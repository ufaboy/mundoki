import type { APIRoute } from 'astro';
import { computeTotpCode } from '../../lib/auth/totp';
import {
  create2faChallengeInStore,
  createOrFindUserSessionInStore,
  ensureUserAppRecords,
  getAuthenticatedSessionUser,
  getTwoFactorRecordInStore,
  getUserAppBundle,
} from '../../lib/db/d1Store';
import { getAppOrigin, getRuntimeEnv, isDevSandboxEnabled, type RuntimeEnv } from '../../lib/server/runtimeEnv';
import { createBetterAuthInstance } from '../../lib/auth/betterAuth';
import { Locale } from '../../math/core/types';

export const prerender = false;

function safeComputeTotp(secretBase32: string): string | undefined {
  try {
    return computeTotpCode(secretBase32);
  } catch {
    return undefined;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const env = await getRuntimeEnv();
  const devSandbox = isDevSandboxEnabled(env, request);
  const oauthDone = url.searchParams.get('oauth_done') === '1';
  const code = url.searchParams.get('code') || '';
  const stateRaw = url.searchParams.get('state') || '';

  let provider: 'google' = 'google';
  let locale: Locale = url.searchParams.get('locale') === 'en-US' ? 'en-US' : 'es-AR';

  // Better Auth OAuth redirect target: session cookie is already set by /api/auth/callback/:provider
  if (oauthDone) {
    const authUser = await getAuthenticatedSessionUser(request, env);
    let revokedSession = false;
    let payloadJson = JSON.stringify({
      type: 'OAUTH_AUTH_ERROR',
      error: 'OAuth session was not established.',
    });

    if (authUser) {
      await ensureUserAppRecords(authUser.id, locale, env);
      const bundle = await getUserAppBundle(authUser, env);

      if (bundle.user.twoFactorEnabled) {
        // /api/auth/callback/:provider already created a full session and set its cookie.
        // Revoke it before issuing the 2FA challenge, as magic-link verify does; otherwise
        // the cookie would sign the browser in without the second factor.
        await revokeProvisionalSession(request, env, authUser.sessionToken);
        revokedSession = true;
        const tf = await getTwoFactorRecordInStore(authUser.id, env);
        const pending2faToken = await create2faChallengeInStore(authUser.id, env);
        payloadJson = JSON.stringify({
          type: 'OAUTH_AUTH_SUCCESS',
          requiresTwoFactor: true,
          pending2faToken,
          email: bundle.user.email,
          ...(devSandbox && tf ? { devCurrentTotpCode: safeComputeTotp(tf.secretBase32) } : {}),
        });
      } else {
        payloadJson = JSON.stringify({
          type: 'OAUTH_AUTH_SUCCESS',
          requiresTwoFactor: false,
          token: authUser.sessionToken,
          user: bundle.user,
          gameState: bundle.gameState,
          subscription: bundle.subscription,
          isPremiumEntitled: bundle.isPremiumEntitled,
        });
      }
    }

    const html = buildPopupHtml(payloadJson, locale);
    const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    if (revokedSession) {
      headers.append('Set-Cookie', 'mundoki_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0');
    }
    return new Response(html, { status: 200, headers });
  }

  // Legacy direct Google OAuth callback fallback (?code=...&state=...)
  try {
    if (stateRaw) {
      const parsed = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf-8')) as {
        locale?: Locale;
      };
      if (parsed.locale === 'en-US' || parsed.locale === 'es-AR') {
        locale = parsed.locale;
      }
    }
  } catch {
    // Ignore malformed state
  }

  const redirectUri = `${getAppOrigin(request, env)}/auth/callback`;
  let email = '';
  let name = '';
  let providerAccountId = '';
  let errorMessage = '';

  try {
    if (!code) {
      throw new Error('Missing authorization code from OAuth provider.');
    }

    const clientId = env.GOOGLE_CLIENT_ID || '';
    const clientSecret = env.GOOGLE_CLIENT_SECRET || '';
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      throw new Error('Failed to exchange Google OAuth code.');
    }
    const tokenData = (await tokenRes.json()) as { access_token: string };
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) {
      throw new Error('Failed to fetch Google user profile.');
    }
    const profile = (await userRes.json()) as { id: string; email: string; name?: string };
    email = String(profile.email || '').toLowerCase();
    name = profile.name || email.split('@')[0] || 'Google Explorer';
    providerAccountId = String(profile.id || email);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'OAuth authentication failed.';
  }

  let payloadJson = JSON.stringify({
    type: 'OAUTH_AUTH_ERROR',
    error: errorMessage || 'Unknown OAuth error',
  });

  if (!errorMessage && email) {
    const { user, sessionToken } = await createOrFindUserSessionInStore(
      {
        email,
        name,
        providerId: provider,
        accountId: providerAccountId,
        preferredLocale: locale,
        emailVerified: true,
      },
      env
    );

    if (user.twoFactorEnabled) {
      const tf = await getTwoFactorRecordInStore(user.id, env);
      const pending2faToken = await create2faChallengeInStore(user.id, env);
      payloadJson = JSON.stringify({
        type: 'OAUTH_AUTH_SUCCESS',
        requiresTwoFactor: true,
        pending2faToken,
        email: user.email,
        ...(devSandbox && tf ? { devCurrentTotpCode: safeComputeTotp(tf.secretBase32) } : {}),
        provider,
      });
    } else {
      const bundle = await getUserAppBundle(user, env);
      payloadJson = JSON.stringify({
        type: 'OAUTH_AUTH_SUCCESS',
        requiresTwoFactor: false,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
        provider,
      });
    }
  }

  return new Response(buildPopupHtml(payloadJson, locale), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

/** Deletes the session the provider callback just created (2FA still pending). */
async function revokeProvisionalSession(request: Request, env: RuntimeEnv, sessionToken: string | null): Promise<void> {
  if (!sessionToken) return;
  const auth = createBetterAuthInstance(env, {
    baseURL: getAppOrigin(request, env),
    requestOrigin: new URL(request.url).origin,
  });
  try {
    await (await auth.$context).internalAdapter.deleteSession(sessionToken);
  } catch {
    // Already gone: nothing to revoke.
  }
}

function buildPopupHtml(payloadJson: string, locale: Locale): string {
  const fallbackPath = locale === 'en-US' ? '/en-us/account' : '/es-ar/cuenta';
  // The payload can carry a session token. It is posted only to this page's own origin:
  // a page on another site that opened this window (window.open) receives nothing, and
  // the account page also checks event.origin (src/scripts/accountClient.ts).
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Mundoki OAuth Callback</title></head>
  <body style="font-family: system-ui, sans-serif; padding: 2rem; text-align: center;">
    <script>
      (function() {
        var data = ${payloadJson.replace(/</g, '\\u003c')};
        if (window.opener) {
          window.opener.postMessage(data, window.location.origin);
          window.close();
        } else {
          window.location.href = '${fallbackPath}';
        }
      })();
    </script>
    <p>Authentication complete. Closing window...</p>
  </body>
</html>`;
}
