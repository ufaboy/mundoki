import { getSubscriptionFromStore, commitSubscriptionEvent, type StoredSubscription } from '../db/d1Store';
import { requestMercadoPagoSubscription, type MercadoPagoSubscription } from '../payments/mercadoPago';
import type { RuntimeEnv } from '../server/runtimeEnv';
import { changeInvite, deferReconciliation, dueInvites, getInvite, type PromoInvite } from './store';
import { PromoError } from './policy';

async function restoreFullPrice(env: RuntimeEnv, invite: PromoInvite): Promise<MercadoPagoSubscription> {
  const token = env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN;
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(invite.providerSubscriptionId)}`, {
    method: 'PUT', signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': `${invite.id}-standard` },
    // Change the next invoice only after the final discounted charge. Remove the safety stop atomically with the price change.
    body: JSON.stringify({ auto_recurring: { transaction_amount: invite.fullAmountArs, currency_id: 'ARS', end_date: null } }),
  });
  if (!response.ok) throw new PromoError('price_transition_failed', 502);
  const confirmed = await requestMercadoPagoSubscription(env, invite.providerSubscriptionId);
  if (confirmed.auto_recurring.transaction_amount !== invite.fullAmountArs || confirmed.auto_recurring.end_date != null) {
    throw new PromoError('price_transition_unconfirmed', 502);
  }
  return confirmed;
}

/** Provider responses are the authority; no unsigned webhook field controls entitlement or price. */
export async function synchronizePromo(env: RuntimeEnv, invite: PromoInvite, remote: MercadoPagoSubscription): Promise<StoredSubscription> {
  const existing = await getSubscriptionFromStore(invite.userId, env);
  if (!existing || remote.id !== invite.providerSubscriptionId || existing.providerSubscriptionId !== remote.id ||
      remote.external_reference !== invite.userId || remote.auto_recurring.currency_id !== 'ARS') throw new PromoError('subscription_mismatch', 409);
  if (existing.status === 'cancelled' && Date.parse(remote.last_modified) <= Date.parse(existing.updatedAt)) return existing;
  const end = Date.parse(invite.promoEndsAt);
  const amount = remote.auto_recurring.transaction_amount;
  const fullPrice = amount === invite.fullAmountArs;
  if (!fullPrice && amount !== invite.discountedAmountArs) throw new PromoError('price_mismatch', 409);
  if (invite.discountPercent === 100 && (!fullPrice || Date.parse(remote.auto_recurring.start_date || '') !== end)) {
    throw new PromoError('trial_schedule_mismatch', 409);
  }
  if (!fullPrice && Date.parse(remote.auto_recurring.end_date || '') !== end) {
    throw new PromoError('promo_deadline_mismatch', 409);
  }
  let state: PromoInvite['state'] = invite.state;
  let lastError: string | null = null;
  if (['cancelled', 'canceled', 'paused'].includes(remote.status)) state = 'cancelled';
  else if (remote.status === 'authorized') {
    state = fullPrice ? 'standard' : 'active';
    if (!fullPrice && (remote.summarized?.charged_quantity || 0) >= invite.durationMonths &&
        Date.parse(remote.next_payment_date || '') >= end) {
      try {
        remote = await restoreFullPrice(env, invite);
        state = 'standard';
      } catch {
        state = 'attention';
        lastError = 'price_transition_failed';
      }
    } else if (!fullPrice && Date.now() >= end) {
      state = 'attention';
      lastError = 'promo_ended_without_transition';
    }
  }
  const period = remote.next_payment_date && Number.isFinite(Date.parse(remote.next_payment_date))
    ? new Date(remote.next_payment_date).toISOString() : invite.promoEndsAt;
  const cappedPeriod = state === 'standard' ? period : new Date(Math.min(Date.parse(period), end)).toISOString();
  const subscription: StoredSubscription = { ...existing,
    amountArs: remote.auto_recurring.transaction_amount,
    status: remote.status === 'authorized' ? 'active' : remote.status === 'pending' ? 'pending' : 'cancelled',
    currentPeriodEnd: cappedPeriod, updatedAt: new Date(remote.last_modified).toISOString(),
  };
  // Ordinary signed webhook storage commits the event and subscription together; the scheduler persists below.
  if (state !== invite.state || lastError !== invite.lastError) {
    await changeInvite(env, invite, { state, lastError, transitionAttempts: invite.transitionAttempts + (lastError ? 1 : 0) },
      state === 'standard' ? 'full_price_scheduled' : state);
  }
  return subscription;
}

export async function reconcilePromos(env: RuntimeEnv) {
  if (env.PROMO_LIVE_BILLING_ENABLED !== 'true') return { checked: 0, failed: 0 };
  let checked = 0, failed = 0;
  for (const invite of await dueInvites(env)) {
    try {
      const remote = await requestMercadoPagoSubscription(env, invite.providerSubscriptionId);
      const sub = await synchronizePromo(env, invite, remote);
      await commitSubscriptionEvent(`mp:${remote.id}:${sub.updatedAt}:${sub.amountArs}`, sub, env);
      checked++;
    } catch {
      failed++;
      console.error(JSON.stringify({ event: 'promo_reconciliation_failed', inviteId: invite.id }));
    } finally {
      await deferReconciliation(env, invite.id);
    }
  }
  return { checked, failed };
}

export async function cancelPromoForSubscription(env: RuntimeEnv, providerId: string) {
  if (!env.DB) return;
  const invite = await getInvite(env, 'providerSubscriptionId', providerId);
  if (invite && invite.state !== 'cancelled') await changeInvite(env, invite, { state: 'cancelled' }, 'cancelled', invite.userId);
}
