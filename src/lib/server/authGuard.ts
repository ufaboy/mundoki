import { buildAccountUrl, buildHomeUrl, buildLoginUrl } from '../../i18n/routes';
import type { Locale } from '../../math/core/types';
import { getAuthenticatedSessionUser, getUserAppBundle } from '../db/d1Store';
import { getRuntimeEnv } from './runtimeEnv';

/** Accepts only same-origin relative paths so ?next= cannot redirect to another site. */
export function sanitizeNextPath(nextParam: string | null): string {
  const raw = nextParam || '';
  return /^\/(?!\/)[\w\-/.%]*$/.test(raw) ? raw : '';
}

/** Builds the localized login URL, preserving ?next= and ?magic_token= when present. */
export function buildLoginRedirectUrl(locale: Locale, requestUrl: URL): string {
  const target = new URL(buildLoginUrl(locale), requestUrl.origin);
  const safeNext = sanitizeNextPath(requestUrl.searchParams.get('next'));
  if (safeNext) target.searchParams.set('next', safeNext);
  const magicToken = requestUrl.searchParams.get('magic_token');
  if (magicToken) target.searchParams.set('magic_token', magicToken);
  return target.pathname + target.search;
}

export type AccountGuardResult =
  | { redirect: string }
  | { user: Awaited<ReturnType<typeof getUserAppBundle>>['user']; isPremium: boolean };

/**
 * Ensures the request has a valid authenticated session; otherwise returns a
 * redirect path to the localized login page.
 */
export async function requireAuthenticatedAccount(
  request: Request,
  requestUrl: URL,
  locale: Locale
): Promise<AccountGuardResult> {
  const env = await getRuntimeEnv();
  const sessionUser = await getAuthenticatedSessionUser(request, env);
  if (!sessionUser) {
    return { redirect: buildLoginRedirectUrl(locale, requestUrl) };
  }
  const bundle = await getUserAppBundle(sessionUser, env);
  return {
    user: bundle.user,
    isPremium: bundle.isPremiumEntitled,
  };
}

/**
 * If a visitor is already signed in when opening the login page, sends them
 * to their ?next= destination or the family account page.
 */
export async function redirectIfAuthenticated(
  request: Request,
  requestUrl: URL,
  locale: Locale
): Promise<string | null> {
  const env = await getRuntimeEnv();
  const sessionUser = await getAuthenticatedSessionUser(request, env);
  if (!sessionUser) return null;
  const safeNext = sanitizeNextPath(requestUrl.searchParams.get('next'));
  return safeNext || buildAccountUrl(locale);
}

/**
 * Ensures the request has a valid authenticated admin session; otherwise
 * returns a redirect path to the localized home page.
 */
export async function requireAdminAccount(
  request: Request,
  locale: Locale
): Promise<AccountGuardResult> {
  const env = await getRuntimeEnv();
  const sessionUser = await getAuthenticatedSessionUser(request, env);
  if (!sessionUser) {
    return { redirect: buildHomeUrl(locale) };
  }
  const bundle = await getUserAppBundle(sessionUser, env);
  if (bundle.user.role !== 'admin') {
    return { redirect: buildHomeUrl(locale) };
  }
  return {
    user: bundle.user,
    isPremium: bundle.isPremiumEntitled,
  };
}
