import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { hasAdminRole } from '../../../lib/auth/roles';
import { createD1DrizzleClient, getAuthenticatedSessionUser, jsonResponse } from '../../../lib/db/d1Store';
import { users } from '../../../lib/db/schema';
import { maxPromoMonths, PROMO_DEFAULT_MAX_ACTIVATIONS, PromoError } from '../../../lib/promos/policy';
import {
  issueCampaign,
  issueInvite,
  listCampaigns,
  listInvites,
  toggleCampaignActive,
} from '../../../lib/promos/store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'sign_in' }, 401);
  if (!(await hasAdminRole(user.id, env))) return jsonResponse({ error: 'admin_only' }, 403);

  try {
    if (request.method === 'GET') {
      const [campaigns, invites] = await Promise.all([listCampaigns(env), listInvites(env)]);
      return jsonResponse({
        campaigns,
        invites,
        maxMonths: maxPromoMonths(env),
        defaultMaxActivations: PROMO_DEFAULT_MAX_ACTIVATIONS,
      });
    }

    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return jsonResponse({ error: 'invalid_origin' }, 403);

    const body = await request.json();
    if (!body || typeof body !== 'object') throw new PromoError('invalid_request');

    if (request.method === 'POST') {
      if (body.mode === 'direct') {
        if (!env.DB) throw new PromoError('database_required', 503);
        const email = String(body.recipientEmail || '').trim().toLowerCase();
        const existingUser = (
          await createD1DrizzleClient(env.DB).select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email)).limit(1)
        )[0];
        if (!existingUser) throw new PromoError('user_not_found', 404);
        const invite = await issueInvite(env, user.id, { ...body, recipientEmail: existingUser.email });
        return jsonResponse({ invite }, 201);
      }
      const campaign = await issueCampaign(env, user.id, body);
      return jsonResponse({ campaign }, 201);
    }

    if (request.method === 'PATCH') {
      const campaign = await toggleCampaignActive(env, String(body.id || ''), Boolean(body.active));
      return jsonResponse({ campaign });
    }

    return jsonResponse({ error: 'method_not_allowed' }, 405);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof PromoError ? error.code : 'request_failed' },
      error instanceof PromoError ? error.status : 400
    );
  }
};
