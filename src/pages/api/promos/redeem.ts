import type { APIRoute } from 'astro';
import { getAuthenticatedSessionUser, jsonResponse } from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { PromoError } from '../../../lib/promos/policy';
import { redeemPromo } from '../../../lib/promos/service';

export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'sign_in' }, 401);
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return jsonResponse({ error: 'invalid_origin' }, 403);
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') throw new PromoError('invalid_request');
    return jsonResponse(await redeemPromo(env, user, request, body));
  } catch (error) {
    return jsonResponse({ error: error instanceof PromoError ? error.code : 'request_failed' }, error instanceof PromoError ? error.status : 400);
  }
};
