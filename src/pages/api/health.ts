import type { APIRoute } from 'astro';
import { jsonResponse } from '../../lib/db/d1Store';
import { getRuntimeEnv } from '../../lib/server/runtimeEnv';

export const prerender = false;

export const GET: APIRoute = async () => {
  const env = await getRuntimeEnv();
  return jsonResponse({
    status: 'ok',
    runtime: 'astro-cloudflare-workers-d1-adapter',
    framework: 'Astro',
    orm: 'Drizzle ORM',
    auth: 'Better Auth (Email/Password + OAuth 2.0 + Magic Link + TOTP 2FA)',
    d1Bound: Boolean(env.DB),
    mercadoPagoLiveConfigured: Boolean(env.MERCADOPAGO_ACCESS_TOKEN || env.MP_ACCESS_TOKEN),
  });
};
