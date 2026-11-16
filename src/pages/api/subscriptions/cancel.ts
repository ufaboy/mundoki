import { cancelPromoForSubscription } from '../../../lib/promos/billing';
import type { APIRoute } from 'astro';
import {
  getAuthenticatedSessionUser,
  getSubscriptionFromStore,
  jsonResponse,
  saveSubscriptionInStore,
} from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { requestMercadoPagoSubscription } from '../../../lib/payments/mercadoPago';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const sub = await getSubscriptionFromStore(user.id, env);
  if (!sub) {
    return jsonResponse({ error: 'No subscription found for this account.' }, 404);
  }
  if (sub.providerSubscriptionId.startsWith('checkout:')) {
    return jsonResponse({ error: 'Resume checkout before cancelling so the provider subscription can be identified.' }, 409);
  }

  if (!sub.isDevMock) {
    try {
      const result = await requestMercadoPagoSubscription(env, sub.providerSubscriptionId, true);
      if (result.external_reference !== user.id || !['cancelled', 'canceled'].includes(result.status)) {
        throw new Error('Cancellation not confirmed');
      }
    } catch {
      return jsonResponse({ error: 'Could not confirm cancellation. Please try again.' }, 502);
    }
  }
  sub.status = 'cancelled';
  sub.updatedAt = new Date().toISOString();
  await saveSubscriptionInStore(sub, env);
  await cancelPromoForSubscription(env, sub.providerSubscriptionId);

  return jsonResponse({
    subscription: sub,
    isPremiumEntitled: false,
  });
};
