import { hasAdminRole } from '../../../lib/auth/roles';
import type { APIRoute } from 'astro';
import { getAuthenticatedSessionUser, jsonResponse } from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { maxPromoMonths, PromoError } from '../../../lib/promos/policy';
import { issueInvite, listInvites, revokeInvite, inviteHistory } from '../../../lib/promos/store';

export const prerender = false;
export const ALL: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'sign_in' }, 401);
  if (!await hasAdminRole(user.id, env)) return jsonResponse({ error: 'admin_only' }, 403);
  try {
    if (request.method === 'GET') {
      const id = new URL(request.url).searchParams.get('id');
      return jsonResponse(id ? { events: await inviteHistory(env, id) }
        : { invites: await listInvites(env), maxMonths: maxPromoMonths(env), liveBillingEnabled: env.PROMO_LIVE_BILLING_ENABLED === 'true' });
    }
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return jsonResponse({ error: 'invalid_origin' }, 403);
    const body = await request.json();
    if (!body || typeof body !== 'object') throw new PromoError('invalid_request');
    if (request.method === 'POST') return jsonResponse({ invite: await issueInvite(env, user.id, body) }, 201);
    if (request.method === 'PATCH') return jsonResponse({ invite: await revokeInvite(env, String(body.id || ''), user.id) });
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  } catch (error) {
    return jsonResponse({ error: error instanceof PromoError ? error.code : 'request_failed' }, error instanceof PromoError ? error.status : 400);
  }
};
