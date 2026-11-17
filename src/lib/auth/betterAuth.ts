import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, magicLink, twoFactor } from 'better-auth/plugins';
import { createD1DrizzleClient } from '../db/d1Store';
import { accounts, sessions, twoFactors, users, verifications } from '../db/schema';
import { getAuthSecret, RuntimeEnv } from '../server/runtimeEnv';

export interface DevMagicLinkPayload {
  email: string;
  url: string;
  token: string;
}

export interface BetterAuthFactoryOptions {
  baseURL?: string;
  requestOrigin?: string;
  onDevMagicLink?: (payload: DevMagicLinkPayload) => void;
}

const MEMORY_AUTH_KEY = '__mundokiMemoryBetterAuth';
const MAGIC_LINK_HOOK_KEY = '__mundokiMagicLinkHook';

type DevMagicLinkHook = ((payload: DevMagicLinkPayload) => void) | undefined;

/**
 * Better Auth Worker-compatible factory integrated with Cloudflare D1 & Drizzle ORM.
 * Supports:
 * - Email & Password authentication
 * - OAuth 2.0 Social Providers (Google, Facebook, Apple)
 * - Passwordless Email Magic Links (Resend or Dev Outbox)
 * - Two-Factor Authentication (TOTP + Backup Codes)
 * - Bearer token + Cookie session authentication
 */
export function createBetterAuthInstance(
  env: RuntimeEnv,
  options: BetterAuthFactoryOptions = {}
) {
  const secret = getAuthSecret(env);
  const baseURL =
    options.baseURL ||
    env.BETTER_AUTH_URL ||
    env.APP_URL ||
    (typeof process !== 'undefined' ? process.env.BETTER_AUTH_URL || process.env.APP_URL : undefined) ||
    'http://localhost:3333';

  const normalizedBaseUrl =
    baseURL === 'MY_APP_URL' || !baseURL.trim() ? 'http://localhost:3333' : baseURL.replace(/\/$/, '');

  const trustedOrigins = Array.from(
    new Set(
      [
        normalizedBaseUrl,
        options.requestOrigin,
        env.BETTER_AUTH_URL,
        env.APP_URL,
        'http://localhost:3333',
        'https://mundoki.mercosur.workers.dev',
        'https://appleid.apple.com',
      ].filter((origin): origin is string => Boolean(origin && origin !== 'MY_APP_URL'))
    )
  );

  // Store per-request dev magic link callback so a cached memory-mode instance can also emit it.
  if (options.onDevMagicLink) {
    (globalThis as Record<string, unknown>)[MAGIC_LINK_HOOK_KEY] = options.onDevMagicLink;
  } else if (!env.DB) {
    (globalThis as Record<string, unknown>)[MAGIC_LINK_HOOK_KEY] = undefined;
  }

  const db = env.DB ? createD1DrizzleClient(env.DB) : undefined;

  if (!db) {
    const existing = (globalThis as Record<string, unknown>)[MEMORY_AUTH_KEY] as
      | ReturnType<typeof buildAuthInstance>
      | undefined;
    if (existing) {
      return existing;
    }
  }

  const instance = buildAuthInstance({
    db,
    secret,
    baseURL: normalizedBaseUrl,
    trustedOrigins,
    env,
    onDevMagicLink: options.onDevMagicLink,
  });

  if (!db) {
    (globalThis as Record<string, unknown>)[MEMORY_AUTH_KEY] = instance;
  }

  return instance;
}

function buildAuthInstance(params: {
  db: ReturnType<typeof createD1DrizzleClient> | undefined;
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  env: RuntimeEnv;
  onDevMagicLink?: (payload: DevMagicLinkPayload) => void;
}) {
  const { db, secret, baseURL, trustedOrigins, env } = params;

  return betterAuth({
    secret,
    baseURL,
    trustedOrigins,
    database: db
      ? drizzleAdapter(db, {
          provider: 'sqlite',
          schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
            twoFactor: twoFactors,
          },
        })
      : undefined,
    user: {
      additionalFields: {
        role: { type: 'string', required: false, defaultValue: 'user', input: false },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
        ? {
            facebook: {
              clientId: env.FACEBOOK_CLIENT_ID,
              clientSecret: env.FACEBOOK_CLIENT_SECRET,
            },
          }
        : {}),
      ...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
        ? {
            apple: {
              clientId: env.APPLE_CLIENT_ID,
              clientSecret: env.APPLE_CLIENT_SECRET,
              ...(env.APPLE_APP_BUNDLE_IDENTIFIER
                ? { appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER }
                : {}),
            },
          }
        : {}),
    },
    plugins: [
      bearer(),
      twoFactor({
        issuer: 'Mundoki',
        allowPasswordless: true,
      }),
      magicLink({
        expiresIn: 60 * 15,
        // Magic link is a sign-in shortcut for existing accounts only; registration needs the form.
        disableSignUp: true,
        sendMagicLink: async ({ email, url, token }) => {
          const resendApiKey = env.RESEND_API_KEY;
          const emailFrom = env.EMAIL_FROM || 'Mundoki <no-reply@mundoki.edu.ar>';

          if (resendApiKey && resendApiKey.trim() !== '') {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: emailFrom,
                to: [email],
                subject: 'Your magic sign-in link for Mundoki',
                html: `<p>Click the link below to sign in to your Mundoki account (valid for 15 minutes):</p><p><a href="${url}">${url}</a></p>`,
              }),
            });
            if (!res.ok) {
              console.error('Resend magic link email failed:', res.status);
            }
          }

          const hook =
            params.onDevMagicLink ||
            ((globalThis as Record<string, unknown>)[MAGIC_LINK_HOOK_KEY] as DevMagicLinkHook);
          // Never log the link or token: whoever can read logs could sign in as this user.
          if (hook) hook({ email, url, token });
        },
      }),
    ],
  });
}
