import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import {
  getAuthenticatedSessionUser,
  getSubscriptionFromStore,
  jsonResponse,
  saveSubscriptionInStore,
  acquireCheckoutLease,
  completeCheckoutInStore,
  releaseCheckoutLease,
  type StoredSubscription,
} from '../../../lib/db/d1Store';
import { initiateMercadoPagoSubscription } from '../../../lib/payments/mercadoPago';
import { getAppOrigin, getRuntimeEnv } from '../../../lib/server/runtimeEnv';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) {
    return jsonResponse({ error: 'Please sign in before starting a subscription.' }, 401);
  }

  let body: { adultConfirmed?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (body?.adultConfirmed !== true) {
    return jsonResponse(
      { error: 'An adult account holder must confirm authorization before billing.' },
      400
    );
  }

  const lease = await acquireCheckoutLease(user.id, env);
  if (!lease) return jsonResponse({ error: 'Checkout is in progress. Retry shortly.' }, 409);
  try {
    const existing = await getSubscriptionFromStore(user.id, env);
    const resumable = existing?.status === 'pending' && existing.providerSubscriptionId.startsWith('checkout:');
    if (existing && ['active', 'pending'].includes(existing.status) && !resumable) {
      return jsonResponse({ error: 'An existing subscription must be cancelled first.' }, 409);
    }
    // Keep this reservation after ambiguous provider failures. A retry uses the same key and price.
    const id = randomUUID();
    const reservation: StoredSubscription = resumable ? existing : {
      id, userId: user.id, provider: 'mercadopago', providerSubscriptionId: `checkout:${id}`,
      planCode: 'monthly_ars', currency: 'ARS', amountArs: Number(env.PREMIUM_MONTHLY_ARS) || 4500,
      status: 'pending', currentPeriodEnd: null, isDevMock: false, updatedAt: new Date().toISOString(),
    };
    if (!resumable) await saveSubscriptionInStore(reservation, env);
    const result = await initiateMercadoPagoSubscription({
      userId: user.id, userEmail: user.email, backUrl: `${getAppOrigin(request, env)}/es-ar/premium`,
      monthlyArs: reservation.amountArs, idempotencyKey: reservation.providerSubscriptionId.slice('checkout:'.length), env,
    });
    result.subscription.id = reservation.id;
    await completeCheckoutInStore(result.subscription, reservation.providerSubscriptionId, env);
    return jsonResponse(result);
  } catch {
    return jsonResponse({ error: 'Unable to complete checkout. Retry to resume the same operation.' }, 502);
  } finally {
    await releaseCheckoutLease(user.id, lease, env);
  }
};
