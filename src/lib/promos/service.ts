import { acquireCheckoutLease, releaseCheckoutLease, getSubscriptionFromStore, saveSubscriptionInStore, type AuthenticatedSessionUser } from '../db/d1Store';
import { initiateMercadoPagoSubscription } from '../payments/mercadoPago';
import { getAppOrigin, isDevSandboxEnabled, type RuntimeEnv } from '../server/runtimeEnv';
import { addCalendarMonths, maxPromoMonths, normalizePromoCode, promoPrice, PromoError, PROMO_TERMS_VERSION } from './policy';
import {
  changeInvite,
  claimCampaignForUser,
  getCampaignByCode,
  getInvite,
  hasUserRedeemedCampaign,
  type PromoCampaign,
  type PromoInvite,
} from './store';
import { DEFAULT_PREMIUM_MONTHLY_ARS } from '../payments/pricing';

export async function quotePromo(env: RuntimeEnv, user: AuthenticatedSessionUser, code: unknown) {
  if (!user.emailVerified) throw new PromoError('verify_email', 403);
  const normalized = normalizePromoCode(code);
  const invite = await getInvite(env, 'code', normalized);
  if (invite) {
    if (invite.recipientEmail !== user.email.trim().toLowerCase()) throw new PromoError('invalid_code', 404);
    if (invite.state !== 'issued') {
      if (invite.promoEndsAt && Date.parse(invite.promoEndsAt) <= Date.now()) throw new PromoError('expired_code');
      if (invite.userId === user.id && invite.state === 'checkout' && invite.checkoutUrl) return { invite, resumed: true };
      throw new PromoError('already_used', 409);
    }
    if (Date.parse(invite.expiresAt) <= Date.now()) throw new PromoError('expired_code');
    if (invite.durationMonths > maxPromoMonths(env)) throw new PromoError('invalid_duration');
    const existing = await getSubscriptionFromStore(user.id, env);
    if (existing && ['pending', 'active'].includes(existing.status)) throw new PromoError('existing_subscription', 409);
    if (existing && invite.newCustomersOnly) throw new PromoError('new_customers_only', 403);
    return { invite, resumed: false };
  }

  const campaign = await getCampaignByCode(env, normalized);
  if (!campaign || !campaign.active) throw new PromoError('invalid_code', 404);
  if (Date.parse(campaign.expiresAt) <= Date.now()) throw new PromoError('expired_code');
  if (await hasUserRedeemedCampaign(env, campaign.id, user.id)) throw new PromoError('already_used', 409);
  if (campaign.activationsCount >= campaign.maxActivations) throw new PromoError('promo_limit_reached', 409);
  if (campaign.durationMonths > maxPromoMonths(env)) throw new PromoError('invalid_duration');
  const existing = await getSubscriptionFromStore(user.id, env);
  if (existing && ['pending', 'active'].includes(existing.status)) throw new PromoError('existing_subscription', 409);
  if (existing && campaign.newCustomersOnly) throw new PromoError('new_customers_only', 403);
  return { campaign, resumed: false };
}

export function publicQuote(promo: PromoInvite | PromoCampaign, env: RuntimeEnv) {
  const full = ('fullAmountArs' in promo ? promo.fullAmountArs : null) ?? Number(env.PREMIUM_MONTHLY_ARS || DEFAULT_PREMIUM_MONTHLY_ARS);
  return { discountPercent: promo.discountPercent, durationMonths: promo.durationMonths,
    fullAmountArs: full, discountedAmountArs: promoPrice(full, promo.discountPercent), currency: 'ARS',
    acceptedAt: 'acceptedAt' in promo ? promo.acceptedAt : null,
    promoEndsAt: 'promoEndsAt' in promo ? promo.promoEndsAt : null,
    activationDeadline: promo.expiresAt, termsVersion: PROMO_TERMS_VERSION,
    automaticRenewal: true, recipientEmail: 'recipientEmail' in promo ? promo.recipientEmail : null };
}

export async function redeemPromo(env: RuntimeEnv, user: AuthenticatedSessionUser, request: Request,
  input: { code?: unknown; termsVersion?: unknown; adultConfirmed?: unknown; fullAmountArs?: unknown }) {
  const lease = await acquireCheckoutLease(user.id, env);
  if (!lease) throw new PromoError('existing_subscription', 409);
  try { return await redeemPromoWithLease(env, user, request, input); }
  finally { await releaseCheckoutLease(user.id, lease, env); }
}

async function redeemPromoWithLease(env: RuntimeEnv, user: AuthenticatedSessionUser, request: Request,
  input: { code?: unknown; termsVersion?: unknown; adultConfirmed?: unknown; fullAmountArs?: unknown }) {
  if (input.adultConfirmed !== true || input.termsVersion !== PROMO_TERMS_VERSION) throw new PromoError('consent_required');
  const quoted = await quotePromo(env, user, input.code);
  if (quoted.resumed && quoted.invite) return { mode: 'live_mercadopago', initPointUrl: quoted.invite.checkoutUrl, promo: publicQuote(quoted.invite, env) };
  const fullAmount = Number(env.PREMIUM_MONTHLY_ARS || DEFAULT_PREMIUM_MONTHLY_ARS);
  if (input.fullAmountArs !== fullAmount) throw new PromoError('price_changed', 409);
  const hasProvider = Boolean(env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN);
  if (hasProvider && env.PROMO_LIVE_BILLING_ENABLED !== 'true') throw new PromoError('billing_not_enabled', 503);
  if (!hasProvider && !isDevSandboxEnabled(env, request)) throw new PromoError('billing_not_enabled', 503);
  const now = new Date().toISOString();
  const source = quoted.invite ?? quoted.campaign!;
  const promoEndsAt = addCalendarMonths(now, source.durationMonths);
  const discountedAmountArs = promoPrice(fullAmount, source.discountPercent);
  const claimed = quoted.invite
    ? await changeInvite(env, quoted.invite, {
        state: 'checkout', userId: user.id, acceptedAt: now,
        promoEndsAt, fullAmountArs: fullAmount,
        discountedAmountArs, termsVersion: PROMO_TERMS_VERSION,
      }, 'terms_accepted', user.id)
    : await claimCampaignForUser(env, quoted.campaign!, user, {
        promoEndsAt, fullAmountArs: fullAmount,
        discountedAmountArs, termsVersion: PROMO_TERMS_VERSION,
      });
  try {
    const result = await initiateMercadoPagoSubscription({ userId: user.id, userEmail: user.email,
      backUrl: `${getAppOrigin(request, env)}/${new URL(request.url).searchParams.get('locale') === 'en-US' ? 'en-us' : 'es-ar'}/premium`,
      monthlyArs: claimed.discountPercent === 100 ? fullAmount : claimed.discountedAmountArs,
      promo: { id: claimed.id, discountPercent: claimed.discountPercent, end: claimed.promoEndsAt, fullAmount }, env });
    await changeInvite(env, claimed, { providerSubscriptionId: result.subscription.providerSubscriptionId,
      checkoutUrl: result.initPointUrl }, 'checkout_created', user.id);
    await saveSubscriptionInStore(result.subscription, env);
    return { ...result, promo: publicQuote(claimed, env) };
  } catch {
    const current = await getInvite(env, 'id', claimed.id);
    if (current?.state === 'checkout') await changeInvite(env, current, { state: 'attention', lastError: 'checkout_failed_review_required' }, 'checkout_failed', user.id);
    throw new PromoError('checkout_failed', 502);
  }
}
