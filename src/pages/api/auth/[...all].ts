import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { createBetterAuthInstance, DevMagicLinkPayload } from '../../../lib/auth/betterAuth';
import {
  buildOtpAuthUri,
  computeTotpCode,
  generateBackupCodes,
  generateBase32Secret,
  verifyTotpCode,
} from '../../../lib/auth/totp';
import {
  consume2faChallengeInStore,
  consumeBackupCodeInStore,
  create2faChallengeInStore,
  createD1DrizzleClient,
  createOrFindUserSessionInStore,
  createSessionForUserInD1,
  deleteTwoFactorRecordInStore,
  verifyTwoFactorForRemoval,
  ensureUserAppRecords,
  getAuthenticatedSessionUser,
  getTwoFactorRecordInStore,
  getUserAppBundle,
  jsonResponse,
  loadDb,
  OAuthProvider,
  parseAuthTokenFromRequest,
  saveTwoFactorRecordInStore,
  updateUserPreferredLocaleInStore,
} from '../../../lib/db/d1Store';
import { users } from '../../../lib/db/schema';
import { getAppOrigin, getRuntimeEnv, isDevSandboxEnabled } from '../../../lib/server/runtimeEnv';
import { Locale } from '../../../math/core/types';

export const prerender = false;

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function readBaError(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string; error?: string };
    return data.message || data.error || fallback;
  } catch {
    return fallback;
  }
}

async function findUserByEmail(email: string, env: Awaited<ReturnType<typeof getRuntimeEnv>>) {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1.select().from(users).where(eq(users.email, email)).limit(1);
    return rows[0] || null;
  }
  const db = loadDb();
  return db.users.find((u) => u.email === email) || null;
}

async function findUserById(userId: string, env: Awaited<ReturnType<typeof getRuntimeEnv>>) {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1.select().from(users).where(eq(users.id, userId)).limit(1);
    return rows[0] || null;
  }
  const db = loadDb();
  return db.users.find((u) => u.id === userId) || null;
}

function safeComputeTotp(secretBase32: string): string | undefined {
  try {
    return computeTotpCode(secretBase32);
  } catch {
    return undefined;
  }
}

const OAUTH_PROVIDER_META: Record<
  OAuthProvider,
  { envIdKey: string; defaultName: string }
> = {
  google: { envIdKey: 'GOOGLE_CLIENT_ID', defaultName: 'Explorador Google' },
  facebook: { envIdKey: 'FACEBOOK_CLIENT_ID', defaultName: 'Explorador Facebook' },
  apple: { envIdKey: 'APPLE_CLIENT_ID', defaultName: 'Explorador Apple' },
};

function parseOAuthProvider(value: unknown): OAuthProvider {
  if (value === 'facebook' || value === 'apple') return value;
  return 'google';
}

function isOAuthProviderConfigured(
  provider: OAuthProvider,
  env: Awaited<ReturnType<typeof getRuntimeEnv>>
): boolean {
  const credentials: Record<OAuthProvider, [string | undefined, string | undefined]> = {
    google: [env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET],
    facebook: [env.FACEBOOK_CLIENT_ID, env.FACEBOOK_CLIENT_SECRET],
    apple: [env.APPLE_CLIENT_ID, env.APPLE_CLIENT_SECRET],
  };
  const [clientId, clientSecret] = credentials[provider];
  return Boolean(clientId?.trim() && clientSecret?.trim());
}

export const ALL: APIRoute = async ({ request, params }) => {
  const action = (params.all || '').replace(/^\/+|\/+$/g, '');
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const env = await getRuntimeEnv();
  const origin = getAppOrigin(request, env);
  const devSandbox = isDevSandboxEnabled(env, request);

  // 1. GET /api/auth/me
  if (action === 'me' && method === 'GET') {
    const authUser = await getAuthenticatedSessionUser(request, env);
    if (!authUser) {
      return jsonResponse({ authenticated: false }, 401);
    }
    const bundle = await getUserAppBundle(authUser, env);
    return jsonResponse({
      authenticated: true,
      user: bundle.user,
      gameState: bundle.gameState,
      subscription: bundle.subscription,
      isPremiumEntitled: bundle.isPremiumEntitled,
    });
  }

  // 2. POST /api/auth/signup (backed by Better Auth)
  if (action === 'signup' && method === 'POST') {
    const body = await readJsonBody(request);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim() || email.split('@')[0] || 'Explorador';
    const preferredLocale: Locale = body.locale === 'en-US' ? 'en-US' : 'es-AR';

    if (!email || !email.includes('@') || password.length < 6) {
      return jsonResponse(
        { error: 'Please provide a valid email and a password of at least 6 characters.' },
        400
      );
    }

    const auth = createBetterAuthInstance(env, {
      baseURL: origin,
      requestOrigin: url.origin,
    });

    let baRes: Response;
    try {
      baRes = await auth.api.signUpEmail({
        body: { email, password, name },
        headers: request.headers,
        asResponse: true,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not create account.';
      return jsonResponse({ error: msg }, 400);
    }

    if (!baRes.ok) {
      const msg = await readBaError(baRes, 'An account with this email already exists.');
      return jsonResponse({ error: msg }, baRes.status === 422 ? 409 : baRes.status);
    }

    const baData = (await baRes.json()) as {
      token?: string;
      user: { id: string; email: string; name: string; emailVerified?: boolean };
    };
    const sessionToken = baData.token || '';

    await ensureUserAppRecords(baData.user.id, preferredLocale, env, 'password');
    const bundle = await getUserAppBundle(
      {
        id: baData.user.id,
        email: baData.user.email,
        name: baData.user.name,
        emailVerified: Boolean(baData.user.emailVerified),
        twoFactorEnabled: false,
        sessionToken,
      },
      env
    );

    return jsonResponse(
      {
        requiresTwoFactor: false,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
      },
      200,
      sessionToken,
      baRes.headers
    );
  }

  // 3. POST /api/auth/signin (backed by Better Auth)
  if (action === 'signin' && method === 'POST') {
    const body = await readJsonBody(request);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    const auth = createBetterAuthInstance(env, {
      baseURL: origin,
      requestOrigin: url.origin,
    });

    let baRes: Response;
    try {
      baRes = await auth.api.signInEmail({
        body: { email, password },
        headers: request.headers,
        asResponse: true,
      });
    } catch {
      return jsonResponse({ error: 'Invalid email or password.' }, 401);
    }

    if (!baRes.ok) {
      return jsonResponse({ error: 'Invalid email or password.' }, 401);
    }

    const baData = (await baRes.json()) as {
      twoFactorRedirect?: boolean;
      token?: string;
      user?: {
        id: string;
        email: string;
        name: string;
        emailVerified?: boolean;
        twoFactorEnabled?: boolean;
      };
    };

    if (baData.twoFactorRedirect) {
      const existingUser = await findUserByEmail(email, env);
      if (!existingUser) {
        return jsonResponse({ error: 'Account not found for 2FA challenge.' }, 404);
      }
      const tf = await getTwoFactorRecordInStore(existingUser.id, env);
      const pending2faToken = await create2faChallengeInStore(existingUser.id, env);
      return jsonResponse(
        {
          requiresTwoFactor: true,
          pending2faToken,
          email: existingUser.email,
          ...(devSandbox && tf ? { devCurrentTotpCode: safeComputeTotp(tf.secretBase32) } : {}),
        },
        200,
        null,
        baRes.headers
      );
    }

    if (!baData.user) {
      return jsonResponse({ error: 'Invalid email or password.' }, 401);
    }

    const sessionToken = baData.token || '';
    await ensureUserAppRecords(baData.user.id, 'es-AR', env);
    const bundle = await getUserAppBundle(
      {
        id: baData.user.id,
        email: baData.user.email,
        name: baData.user.name,
        emailVerified: Boolean(baData.user.emailVerified),
        twoFactorEnabled: Boolean(baData.user.twoFactorEnabled),
        sessionToken,
      },
      env
    );

    return jsonResponse(
      {
        requiresTwoFactor: false,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
      },
      200,
      sessionToken,
      baRes.headers
    );
  }

  // 4. POST /api/auth/signout (backed by Better Auth)
  if (action === 'signout' && method === 'POST') {
    const auth = createBetterAuthInstance(env, {
      baseURL: origin,
      requestOrigin: url.origin,
    });
    const headersWithToken = new Headers(request.headers);
    if (!headersWithToken.get('authorization')) {
      const token = parseAuthTokenFromRequest(request);
      if (token) headersWithToken.set('authorization', `Bearer ${token}`);
    }

    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    try {
      const baRes = await auth.api.signOut({
        headers: headersWithToken,
        asResponse: true,
      });
      baRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          headers.append('Set-Cookie', value);
        }
      });
    } catch {
      // Ignore if session already expired
    }
    headers.append(
      'Set-Cookie',
      'mundoki_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0'
    );
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  // 5. POST /api/auth/locale
  if (action === 'locale' && method === 'POST') {
    const authUser = await getAuthenticatedSessionUser(request, env);
    if (!authUser) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    const body = await readJsonBody(request);
    const nextLocale: Locale = body.locale === 'en-US' ? 'en-US' : 'es-AR';
    await updateUserPreferredLocaleInStore(authUser.id, nextLocale, env);
    return jsonResponse({ ok: true, preferredLocale: nextLocale });
  }

  // 6. GET /api/auth/oauth/url (delegates to Better Auth signInSocial when configured)
  if (action === 'oauth/url' && method === 'GET') {
    const provider = parseOAuthProvider(url.searchParams.get('provider'));
    const locale: Locale = url.searchParams.get('locale') === 'en-US' ? 'en-US' : 'es-AR';
    const redirectUri = `${origin}/api/auth/callback/${provider}`;

    if (isOAuthProviderConfigured(provider, env)) {
      const auth = createBetterAuthInstance(env, {
        baseURL: origin,
        requestOrigin: url.origin,
      });
      const socialRes = await auth.api.signInSocial({
        body: {
          provider,
          callbackURL: `${origin}/auth/callback?oauth_done=1&locale=${encodeURIComponent(locale)}`,
          disableRedirect: true,
        },
        headers: request.headers,
      });
      if (socialRes && 'url' in socialRes && socialRes.url) {
        return jsonResponse({
          configured: true,
          provider,
          redirectUri,
          url: socialRes.url,
        });
      }
    }

    const { envIdKey } = OAUTH_PROVIDER_META[provider];
    return jsonResponse({
      configured: false,
      provider,
      redirectUri,
      notice:
        locale === 'es-AR'
          ? `[MODO DESARROLLO OAuth]: ${envIdKey} no está configurado. Podés usar el simulador OAuth de desarrollo aquí abajo o configurar las credenciales en .env / Wrangler secrets.`
          : `[DEV OAuth MODE]: ${envIdKey} is not configured. You can use the OAuth development sandbox below or configure credentials in .env / Wrangler secrets.`,
    });
  }

  // 7. POST /api/auth/oauth/dev-simulate
  if (action === 'oauth/dev-simulate' && method === 'POST') {
    if (!devSandbox) {
      return jsonResponse({ error: 'Development OAuth simulator is disabled in production.' }, 403);
    }
    const body = await readJsonBody(request);
    const provider = parseOAuthProvider(body.provider);
    const rawEmail = String(body.email || '').trim().toLowerCase();
    const email = rawEmail.includes('@') ? rawEmail : `explorador.${provider}@mundoki.edu.ar`;
    const name = String(body.name || '').trim() || OAUTH_PROVIDER_META[provider].defaultName;
    const preferredLocale: Locale = body.locale === 'en-US' ? 'en-US' : 'es-AR';
    const accountId = `${provider}_dev_${Buffer.from(email).toString('hex').slice(0, 12)}`;

    const { user, sessionToken } = await createOrFindUserSessionInStore(
      {
        email,
        name,
        providerId: provider,
        accountId,
        preferredLocale,
        emailVerified: true,
      },
      env
    );

    if (user.twoFactorEnabled) {
      const tf = await getTwoFactorRecordInStore(user.id, env);
      const pending2faToken = await create2faChallengeInStore(user.id, env);
      return jsonResponse({
        requiresTwoFactor: true,
        pending2faToken,
        email: user.email,
        provider,
        isDevSimulatedOAuth: true,
        devCurrentTotpCode: tf ? safeComputeTotp(tf.secretBase32) : undefined,
      });
    }

    const bundle = await getUserAppBundle(user, env);
    return jsonResponse(
      {
        requiresTwoFactor: false,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
        provider,
        isDevSimulatedOAuth: true,
      },
      200,
      sessionToken
    );
  }

  // 8. POST /api/auth/magic-link/request (backed by Better Auth magicLink plugin)
  if (action === 'magic-link/request' && method === 'POST') {
    const body = await readJsonBody(request);
    const email = String(body.email || '').trim().toLowerCase();
    const locale: Locale = body.locale === 'en-US' ? 'en-US' : 'es-AR';

    if (!email || !email.includes('@')) {
      return jsonResponse(
        {
          error:
            locale === 'es-AR'
              ? 'Ingresá un correo electrónico válido para recibir el enlace mágico.'
              : 'Please enter a valid email address to receive the magic link.',
        },
        400
      );
    }

    const resendConfigured = Boolean(env.RESEND_API_KEY && env.RESEND_API_KEY.trim() !== '');
    // Checked before the account lookup so a misconfigured server never reveals which emails exist.
    if (!resendConfigured && !devSandbox) {
      return jsonResponse(
        {
          error:
            locale === 'es-AR'
              ? 'Ahora no podemos enviar correos. Entrá con tu contraseña.'
              : 'We cannot send emails right now. Sign in with your password.',
        },
        503
      );
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();
    const deliveryMode = resendConfigured ? 'email_provider' : 'dev_preview';
    // The same answer whether or not the account exists: the link only goes to registered
    // emails, and the response must not tell a stranger which emails are registered.
    const neutral = {
      ok: true,
      deliveryMode,
      email,
      expiresAt,
      message:
        locale === 'es-AR'
          ? `Si hay una cuenta con ${email}, te enviamos un enlace para entrar. Revisá tu correo: el enlace vale 15 minutos.`
          : `If there is an account for ${email}, we sent it a sign-in link. Check your email: the link works for 15 minutes.`,
    };

    let capturedLink: DevMagicLinkPayload | null = null;
    const auth = createBetterAuthInstance(env, {
      baseURL: origin,
      requestOrigin: url.origin,
      onDevMagicLink: (payload) => {
        capturedLink = payload;
      },
    });

    // Look the account up where Better Auth keeps it (D1 in production, its own store in dev).
    if (!(await (await auth.$context).internalAdapter.findUserByEmail(email))) {
      return jsonResponse(neutral);
    }

    const localePrefix = locale === 'en-US' ? '/en-us/login' : '/es-ar/login';
    try {
      await auth.api.signInMagicLink({
        body: { email, callbackURL: `${origin}${localePrefix}` },
        headers: request.headers,
      });
    } catch (err) {
      console.error('Magic link generation failed:', err instanceof Error ? err.message : err);
      return jsonResponse(neutral);
    }

    const magicToken = (capturedLink as DevMagicLinkPayload | null)?.token || '';
    if (resendConfigured || !magicToken) {
      return jsonResponse(neutral);
    }

    // Local development without an email provider: hand the link back so it can be opened here.
    return jsonResponse({
      ...neutral,
      magicToken,
      magicUrl: `${origin}${localePrefix}?magic_token=${encodeURIComponent(magicToken)}`,
    });
  }

  // Email links must enter the same UI challenge flow as manual token verification.
  // Never delegate GET verification: Better Auth's magic-link flow does not require TOTP.
  if (action === 'magic-link/verify' && method === 'GET') {
    const loginPath = (url.searchParams.get('callbackURL') || '').includes('/en-us/')
      ? '/en-us/login' : '/es-ar/login';
    const target = new URL(loginPath, origin);
    target.searchParams.set('magic_token', url.searchParams.get('token') || '');
    return new Response(null, { status: 303, headers: { Location: target.toString(), 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  }

  // 9. POST /api/auth/magic-link/verify (backed by Better Auth magicLinkVerify)
  if (action === 'magic-link/verify' && method === 'POST') {
    const body = await readJsonBody(request);
    const magicToken = String(body.token || '').trim();
    const preferredLocale: Locale = body.locale === 'en-US' ? 'en-US' : 'es-AR';

    if (!magicToken) {
      return jsonResponse({ error: 'Missing magic link token.' }, 400);
    }

    const auth = createBetterAuthInstance(env, {
      baseURL: origin,
      requestOrigin: url.origin,
    });

    let baRes: Response;
    try {
      baRes = await auth.api.magicLinkVerify({
        query: { token: magicToken },
        headers: request.headers,
        asResponse: true,
      });
    } catch {
      return jsonResponse({ error: 'Invalid or expired magic link token.' }, 401);
    }

    if (!baRes.ok) {
      const msg = await readBaError(baRes, 'Invalid or expired magic link token.');
      return jsonResponse({ error: msg }, 401);
    }

    const baData = (await baRes.json()) as {
      token?: string;
      user?: { id: string; email: string; name: string; emailVerified?: boolean; twoFactorEnabled?: boolean };
    };
    if (!baData.user) {
      return jsonResponse({ error: 'Magic link verification failed.' }, 401);
    }

    const sessionToken = baData.token || '';
    if (baData.user.twoFactorEnabled) {
      // The library has already created a session. Revoke it before issuing our challenge.
      if (sessionToken) await (await auth.$context).internalAdapter.deleteSession(sessionToken);
      const pending2faToken = await create2faChallengeInStore(baData.user.id, env);
      return jsonResponse({ requiresTwoFactor: true, pending2faToken, email: baData.user.email });
    }
    await ensureUserAppRecords(baData.user.id, preferredLocale, env, 'magic_link');

    const bundle = await getUserAppBundle(
      {
        id: baData.user.id,
        email: baData.user.email,
        name: baData.user.name || baData.user.email.split('@')[0] || 'Explorador',
        emailVerified: true,
        twoFactorEnabled: Boolean(baData.user.twoFactorEnabled),
        sessionToken,
      },
      env
    );

    if (bundle.user.twoFactorEnabled) {
      if (sessionToken) await (await auth.$context).internalAdapter.deleteSession(sessionToken);
      const tf = await getTwoFactorRecordInStore(baData.user.id, env);
      const pending2faToken = await create2faChallengeInStore(baData.user.id, env);
      return jsonResponse({
        requiresTwoFactor: true,
        pending2faToken,
        email: bundle.user.email,
        ...(devSandbox && tf ? { devCurrentTotpCode: safeComputeTotp(tf.secretBase32) } : {}),
      });
    }

    return jsonResponse(
      {
        requiresTwoFactor: false,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
      },
      200,
      sessionToken,
      baRes.headers
    );
  }

  // 10. POST /api/auth/2fa/setup
  if (action === '2fa/setup' && method === 'POST') {
    const authUser = await getAuthenticatedSessionUser(request, env);
    if (!authUser) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const existingFactor = await getTwoFactorRecordInStore(authUser.id, env);
    if (authUser.twoFactorEnabled || existingFactor?.enabled) {
      return jsonResponse({ error: 'Disable existing 2FA with your authenticator code before setting it up again.' }, 409);
    }
    const secretBase32 = generateBase32Secret(20);
    const backupCodes = generateBackupCodes(8);
    try {
      await saveTwoFactorRecordInStore(
      {
        userId: authUser.id,
        secretBase32,
        backupCodes,
        enabled: false,
      },
      env
      );
    } catch {
      return jsonResponse({ error: 'Two-factor settings changed. Reload your account settings.' }, 409);
    }

    const otpauthUri = buildOtpAuthUri(authUser.email, secretBase32);
    return jsonResponse({
      secret: secretBase32,
      otpauthUri,
      backupCodes,
      ...(devSandbox ? { devCurrentTotpCode: safeComputeTotp(secretBase32) } : {}),
    });
  }

  // 11. POST /api/auth/2fa/enable
  if (action === '2fa/enable' && method === 'POST') {
    const authUser = await getAuthenticatedSessionUser(request, env);
    if (!authUser) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const tf = await getTwoFactorRecordInStore(authUser.id, env);
    if (!tf) {
      return jsonResponse({ error: 'Please initiate 2FA setup first.' }, 400);
    }

    const body = await readJsonBody(request);
    const code = String(body.code || '').trim();
    if (!verifyTotpCode(tf.secretBase32, code)) {
      return jsonResponse(
        { error: 'Invalid 6-digit TOTP verification code. Please check your authenticator app.' },
        400
      );
    }

    await saveTwoFactorRecordInStore(
      {
        userId: authUser.id,
        secretBase32: tf.secretBase32,
        backupCodes: tf.backupCodes,
        enabled: true,
      },
      env
    );

    const bundle = await getUserAppBundle({ ...authUser, twoFactorEnabled: true }, env);
    return jsonResponse({
      ok: true,
      twoFactorEnabled: true,
      backupCodes: tf.backupCodes,
      user: bundle.user,
    });
  }

  // 12. POST /api/auth/2fa/disable
  if (action === '2fa/disable' && method === 'POST') {
    const authUser = await getAuthenticatedSessionUser(request, env);
    if (!authUser) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const body = await readJsonBody(request);
    if (!await verifyTwoFactorForRemoval(authUser.id, String(body.code || '').trim(), env)) {
      return jsonResponse({ error: 'Invalid code or too many attempts. Try again in five minutes.' }, 403);
    }
    await deleteTwoFactorRecordInStore(authUser.id, env);
    const bundle = await getUserAppBundle({ ...authUser, twoFactorEnabled: false }, env);
    return jsonResponse({
      ok: true,
      twoFactorEnabled: false,
      user: bundle.user,
    });
  }

  // 13. POST /api/auth/2fa/verify-challenge
  if (action === '2fa/verify-challenge' && method === 'POST') {
    const body = await readJsonBody(request);
    const pending2faToken = String(body.pending2faToken || '').trim();
    const code = String(body.code || '').trim().toUpperCase();

    if (!pending2faToken || !code) {
      return jsonResponse({ error: 'Missing 2FA challenge token or code.' }, 400);
    }

    const challenge = await consume2faChallengeInStore(pending2faToken, env);
    if ('error' in challenge) {
      return jsonResponse({ error: challenge.error }, 401);
    }

    const userRow = await findUserById(challenge.userId, env);
    const tf = userRow ? await getTwoFactorRecordInStore(userRow.id, env) : null;
    if (!userRow || !tf || !tf.enabled) {
      return jsonResponse({ error: '2FA is not configured for this account.' }, 400);
    }

    const verifiedByTotp = verifyTotpCode(tf.secretBase32, code);
    let verifiedByBackupCode = false;
    let remainingBackupCodes = tf.backupCodes.length;

    if (!verifiedByTotp) {
      const remaining = await consumeBackupCodeInStore(userRow.id, code, env);
      verifiedByBackupCode = remaining !== null;
      if (remaining !== null) remainingBackupCodes = remaining;
    }

    if (!verifiedByTotp && !verifiedByBackupCode) {
      return jsonResponse({ error: 'Invalid 6-digit TOTP code or recovery backup code.' }, 401);
    }

    const sessionToken = await createSessionForUserInD1(userRow.id, env);
    await ensureUserAppRecords(userRow.id, 'es-AR', env);
    const bundle = await getUserAppBundle(
      {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        emailVerified: Boolean(userRow.emailVerified),
        twoFactorEnabled: true,
        sessionToken,
      },
      env
    );

    return jsonResponse(
      {
        requiresTwoFactor: false,
        verifiedByBackupCode,
        remainingBackupCodes,
        token: sessionToken,
        user: bundle.user,
        gameState: bundle.gameState,
        subscription: bundle.subscription,
        isPremiumEntitled: bundle.isPremiumEntitled,
      },
      200,
      sessionToken
    );
  }

  if (['two-factor/enable', 'two-factor/disable'].includes(action)) {
    return jsonResponse({ error: 'Use the account two-factor settings.' }, 403);
  }

  // Magic links are issued only through POST /api/auth/magic-link/request, which refuses to
  // run without an email provider outside the dev sandbox. The native route has no such check.
  if (action === 'sign-in/magic-link') {
    return jsonResponse({ error: 'Use /api/auth/magic-link/request.' }, 403);
  }

  // 14. Delegate all native Better Auth endpoints (/api/auth/get-session, /api/auth/sign-in/email,
  //     /api/auth/sign-up/email, /api/auth/callback/google, /api/auth/callback/facebook,
  //     /api/auth/callback/apple, /api/auth/magic-link/verify GET, /api/auth/two-factor/*, /api/auth/ok, etc.)
  const auth = createBetterAuthInstance(env, {
    baseURL: origin,
    requestOrigin: url.origin,
  });
  return auth.handler(request);
};
