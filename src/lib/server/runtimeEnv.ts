export interface RuntimeEnv {
  PROMO_MAX_MONTHS?: string;
  PROMO_LIVE_BILLING_ENABLED?: string;
  DB?: unknown;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  APP_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FACEBOOK_CLIENT_ID?: string;
  FACEBOOK_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;
  APPLE_APP_BUNDLE_IDENTIFIER?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  MERCADOPAGO_ACCESS_TOKEN?: string;
  MP_ACCESS_TOKEN?: string;
  MERCADOPAGO_WEBHOOK_SECRET?: string;
  MP_WEBHOOK_SECRET?: string;
  PREMIUM_MONTHLY_ARS?: string;
  DEFAULT_LOCALE?: string;
  ALLOW_DEV_SANDBOX?: string;
}

/**
 * Returns true only in local development (no D1 binding or localhost request)
 * or when `ALLOW_DEV_SANDBOX="true"` is explicitly set.
 * Must stay false in production on Cloudflare Workers so dev helpers
 * (TOTP preview, magic-link outbox, OAuth simulator, mock webhook) are disabled.
 */
export function isDevSandboxEnabled(env: RuntimeEnv, request?: Request): boolean {
  if (env.ALLOW_DEV_SANDBOX === 'true') return true;
  if (!env.DB) return true;
  if (request) {
    try {
      const host = new URL(request.url).hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
        return true;
      }
    } catch {
      // Ignore invalid URL
    }
  }
  return false;
}

const DEFAULT_DEV_SECRET = 'mundoki-dev-worker-secret-key-32chars!';

/**
 * Loads runtime bindings & secrets:
 * - Inside Cloudflare Workers (`workerd`), reads `cloudflare:workers` `env`.
 * - In local Node.js dev/test without `workerd`, falls back to `process.env`.
 */
export async function getRuntimeEnv(): Promise<RuntimeEnv> {
  const procEnv = (typeof process !== 'undefined' && process.env ? process.env : {}) as Record<
    string,
    string | undefined
  >;

  try {
    const cfWorkersId = 'cloudflare:workers';
    const mod = (await import(/* @vite-ignore */ cfWorkersId)) as { env?: RuntimeEnv };
    if (mod && mod.env) {
      return {
        ...procEnv,
        ...mod.env,
      };
    }
  } catch {
    // Running outside Cloudflare Workers (Node dev server or CLI test suite)
  }

  return procEnv as RuntimeEnv;
}

export function getAuthSecret(env: RuntimeEnv): string {
  return (
    env.BETTER_AUTH_SECRET ||
    (typeof process !== 'undefined' ? process.env.BETTER_AUTH_SECRET : undefined) ||
    DEFAULT_DEV_SECRET
  );
}

export function getAppOrigin(request: Request, env: RuntimeEnv): string {
  const configuredUrl = env.BETTER_AUTH_URL || env.APP_URL;
  if (configuredUrl && configuredUrl !== 'MY_APP_URL' && configuredUrl.trim() !== '') {
    return configuredUrl.replace(/\/$/, '');
  }
  const url = new URL(request.url);
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '') || 'http';
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    url.host ||
    'localhost:3333';
  return `${proto}://${host}`;
}

