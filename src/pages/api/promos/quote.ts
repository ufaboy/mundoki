import type { APIRoute } from 'astro';
import { getAuthenticatedSessionUser, jsonResponse } from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { PromoError } from '../../../lib/promos/policy';
import { publicQuote, quotePromo } from '../../../lib/promos/service';

export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'sign_in' }, 401);
  try {
    const body = await request.json();
    const quoted = await quotePromo(env, user, body?.code);
    return jsonResponse({ promo: publicQuote((quoted.invite ?? quoted.campaign)!, env) });
  } catch (error) {
    return jsonResponse({ error: error instanceof PromoError ? error.code : 'request_failed' }, error instanceof PromoError ? error.status : 400);
  }
};
