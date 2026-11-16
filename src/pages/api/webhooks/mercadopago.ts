import { changeInvite, getInvite } from '../../../lib/promos/store';
import { synchronizePromo } from '../../../lib/promos/billing';
import crypto from 'node:crypto';
import type { APIRoute } from 'astro';
import { getAuthenticatedSessionUser, getSubscriptionFromStore, isSubscriptionActive,
  jsonResponse, commitSubscriptionEvent, StoredSubscription } from '../../../lib/db/d1Store';
import { requestMercadoPagoSubscription, subscriptionIdForInvoice } from '../../../lib/payments/mercadoPago';
import { getRuntimeEnv, isDevSandboxEnabled } from '../../../lib/server/runtimeEnv';

export const prerender = false;

export function verifyMercadoPagoHmac(secret: string, signature: string, requestId: string, dataId: string): boolean {
  const parts = Object.fromEntries(signature.split(',').map(part => part.trim().split('=')));
  if (!/^\d+$/.test(parts.ts || '') || !/^[a-fA-F0-9]{64}$/.test(parts.v1 || '') || !requestId || !dataId) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest();
  return crypto.timingSafeEqual(Buffer.from(parts.v1, 'hex'), expected);
}

export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  let body: Record<string, any>;
  try {
    body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
  } catch {
    return jsonResponse({ error: 'Invalid webhook payload.' }, 400);
  }
  const secret = (env.MERCADOPAGO_WEBHOOK_SECRET || env.MP_WEBHOOK_SECRET || '').trim();
  const token = env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN;
  let next: StoredSubscription;
  let eventId: string;
  if (!secret && !token && isDevSandboxEnabled(env, request)) {
    const user = await getAuthenticatedSessionUser(request, env);
    if (!user || body.signature !== 'dev_verified_webhook_sig') return jsonResponse({ error: 'Unauthorized' }, 401);
    const existing = await getSubscriptionFromStore(user.id, env);
    if (!existing?.isDevMock || !body.eventId) return jsonResponse({ error: 'No mock checkout found.' }, 400);
    eventId = `dev:${user.id}:${String(body.eventId)}`;
    next = { ...existing, status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(), updatedAt: new Date().toISOString() };
    const mockPromo = env.DB ? await getInvite(env, 'providerSubscriptionId', existing.providerSubscriptionId) : null;
    if (mockPromo) {
      next.currentPeriodEnd = mockPromo.promoEndsAt;
      if (mockPromo.state === 'checkout') await changeInvite(env, mockPromo, { state: 'active' }, 'mock_activated', user.id);
    }
  } else {
    if (!secret || !token) return jsonResponse({ error: 'Webhook credentials are not configured.' }, 503);
    // Mercado Pago signs data.id from the query string. Never select a different resource from the body.
    const dataId = new URL(request.url).searchParams.get('data.id') || '';
    if (!verifyMercadoPagoHmac(secret, request.headers.get('x-signature') || '', request.headers.get('x-request-id') || '', dataId)) {
      return jsonResponse({ error: 'Invalid webhook signature.' }, 401);
    }
    if (!['subscription_preapproval', 'subscription_authorized_payment'].includes(body.type)) return jsonResponse({ ignored: true });
    try {
      const subscriptionId = body.type === 'subscription_authorized_payment' ? await subscriptionIdForInvoice(env, dataId) : dataId;
      const remote = await requestMercadoPagoSubscription(env, subscriptionId);
      const existing = await getSubscriptionFromStore(remote.external_reference, env);
      if (!existing || existing.isDevMock || existing.providerSubscriptionId !== remote.id) {
        return jsonResponse({ error: 'Subscription does not match a checkout.' }, 409);
      }
      const promo = env.DB ? await getInvite(env, 'providerSubscriptionId', remote.id) : null;
      if (promo) {
        next = await synchronizePromo(env, promo, remote);
        eventId = `mp:${remote.id}:${next.updatedAt}:${next.amountArs}`;
      } else {
      if (remote.auto_recurring?.currency_id !== existing.currency ||
          remote.auto_recurring?.transaction_amount !== existing.amountArs) {
        return jsonResponse({ error: 'Subscription plan mismatch.' }, 409);
      }
      const status = remote.status === 'authorized' ? 'active' :
        ['cancelled', 'canceled'].includes(remote.status) ? 'cancelled' :
        remote.status === 'pending' ? 'pending' : 'inactive';
      const periodEnd = remote.next_payment_date ? new Date(remote.next_payment_date).toISOString() : null;
      // A provider version is stable even if unsigned notification fields are modified or replayed.
      eventId = `mp:${remote.id}:${new Date(remote.last_modified).toISOString()}`;
      next = { ...existing, status, currentPeriodEnd: periodEnd,
        updatedAt: new Date(remote.last_modified).toISOString() };
      }
    } catch {
      return jsonResponse({ error: 'Unable to verify subscription with Mercado Pago.' }, 502);
    }
  }
  try {
    const applied = await commitSubscriptionEvent(eventId, next, env);
    const subscription = await getSubscriptionFromStore(next.userId, env);
    return jsonResponse({ idempotentReplay: !applied, subscription, isPremiumEntitled: isSubscriptionActive(subscription) });
  } catch {
    return jsonResponse({ error: 'Unable to save subscription update.' }, 503);
  }
};
