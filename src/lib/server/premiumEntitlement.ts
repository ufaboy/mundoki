// Who is asking and whether their family has an active Premium subscription.
// Reads the httpOnly session cookie (page requests) or a Bearer token (API calls).
import {
  getAuthenticatedSessionUser,
  getSubscriptionFromStore,
  isSubscriptionActive,
} from '../db/d1Store';
import type { RuntimeEnv } from './runtimeEnv';

export interface PremiumEntitlement {
  signedIn: boolean;
  isPremium: boolean;
}

export async function getPremiumEntitlement(request: Request, env: RuntimeEnv): Promise<PremiumEntitlement> {
  try {
    const user = await getAuthenticatedSessionUser(request, env);
    if (!user) return { signedIn: false, isPremium: false };
    const subscription = await getSubscriptionFromStore(user.id, env);
    return { signedIn: true, isPremium: isSubscriptionActive(subscription) };
  } catch {
    // Fail closed: if the store cannot be read, locked missions stay locked.
    return { signedIn: false, isPremium: false };
  }
}
