import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { symmetricDecrypt, symmetricEncrypt } from 'better-auth/crypto';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { AttemptRecord, INITIAL_GAME_STATE, PlayerGameState, VEHICLE_TIERS } from '../../game/core/gameState';
import { Locale } from '../../math/core/types';
import { createBetterAuthInstance } from '../auth/betterAuth';
import { computeTotpCode, verifyTotpCode } from '../auth/totp';
import { getAppOrigin, getAuthSecret, RuntimeEnv } from '../server/runtimeEnv';
import {
  accounts,
  exerciseAttempts,
  paymentEvents,
  profiles,
  schema,
  sessions,
  subscriptions,
  twoFactors,
  unlockedRewards,
  userGameState,
  userProgress,
  users,
  verifications,
} from './schema';

/**
 * Cloudflare D1 + Drizzle ORM + Local Dev Store Adapter.
 * - Uses Cloudflare D1 (`env.DB`) via Drizzle ORM when running in Workers / `wrangler dev`.
 * - Falls back to `.data/mundoki-d1.json` when `env.DB` is absent (local Node dev / CLI tests).
 */
export function createD1DrizzleClient(d1Binding: unknown) {
  return drizzle(d1Binding as Parameters<typeof drizzle>[0], { schema });
}

export type OAuthProvider = 'google' | 'facebook' | 'apple';
export type AuthMethod = 'password' | 'magic_link' | OAuthProvider;

export interface StoredUser {
  role?: 'user' | 'admin';
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
  authMethods: AuthMethod[];
  preferredLocale: Locale;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface StoredOAuthAccount {
  id: string;
  userId: string;
  providerId: OAuthProvider;
  accountId: string;
  createdAt: string;
}

export interface StoredMagicVerification {
  id: string;
  identifier: string;
  token: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface StoredTwoFactor {
  userId: string;
  secret: string;
  backupCodes: string[];
  enabled: boolean;
  updatedAt: string;
  failedVerificationCount?: number;
  lockedUntil?: string;
}

export interface StoredPending2faChallenge {
  challengeToken: string;
  userId: string;
  expiresAt: string;
}

export interface StoredSubscription {
  id: string;
  userId: string;
  provider: 'mercadopago';
  providerSubscriptionId: string;
  planCode: string;
  currency: 'ARS';
  amountArs: number;
  status: 'inactive' | 'pending' | 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: string | null;
  isDevMock: boolean;
  updatedAt: string;
}

export interface StoredDatabase {
  users: StoredUser[];
  sessions: StoredSession[];
  oauthAccounts: StoredOAuthAccount[];
  verifications: StoredMagicVerification[];
  twoFactors: Record<string, StoredTwoFactor>;
  pending2faChallenges: Record<string, StoredPending2faChallenge>;
  gameStates: Record<string, PlayerGameState>;
  processedAttemptIds: Record<string, boolean>;
  subscriptions: Record<string, StoredSubscription>;
  processedPaymentEvents: Record<string, { eventType: string; processedAt: string }>;
  userLocales?: Record<string, Locale>;
  userAuthMethods?: Record<string, AuthMethod[]>;
  checkoutLeases?: Record<string, { token: string; expiresAt: string }>;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'mundoki-d1.json');

export function loadDb(): StoredDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoredDatabase>;
      return {
        users: parsed.users || [],
        sessions: parsed.sessions || [],
        oauthAccounts: parsed.oauthAccounts || [],
        verifications: parsed.verifications || [],
        twoFactors: parsed.twoFactors || {},
        pending2faChallenges: parsed.pending2faChallenges || {},
        gameStates: parsed.gameStates || {},
        processedAttemptIds: parsed.processedAttemptIds || {},
        subscriptions: parsed.subscriptions || {},
        processedPaymentEvents: parsed.processedPaymentEvents || {},
        userLocales: parsed.userLocales || {},
        userAuthMethods: parsed.userAuthMethods || {},
        checkoutLeases: parsed.checkoutLeases || {},
      };
    }
  } catch (err) {
    console.error('Error loading local JSON store:', err);
  }
  return {
    users: [],
    sessions: [],
    oauthAccounts: [],
    verifications: [],
    twoFactors: {},
    pending2faChallenges: {},
    gameStates: {},
    processedAttemptIds: {},
    subscriptions: {},
    processedPaymentEvents: {},
    userLocales: {},
    userAuthMethods: {},
  };
}

export function saveDb(db: StoredDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local JSON store:', err);
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) return false;
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
}

export function parseAuthTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)mundoki_session=([^;]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

export function getAuthenticatedUserFromRequest(
  request: Request,
  db: StoredDatabase
): StoredUser | null {
  const token = parseAuthTokenFromRequest(request);
  if (!token) return null;

  const session = db.sessions.find(
    (s) => s.token === token && new Date(s.expiresAt).getTime() > Date.now()
  );
  if (!session) return null;

  return db.users.find((u) => u.id === session.userId) || null;
}

export function isSubscriptionActive(sub: StoredSubscription | null | undefined): boolean {
  if (!sub || sub.status !== 'active') return false;
  if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() < Date.now()) {
    return false;
  }
  return true;
}

export function isUserPremiumEntitled(userId: string, db: StoredDatabase): boolean {
  return isSubscriptionActive(db.subscriptions[userId]);
}

export function serializeUser(user: StoredUser, db?: StoredDatabase) {
  const tfEnabled = Boolean(
    user.twoFactorEnabled || (db && db.twoFactors[user.id]?.enabled)
  );
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: Boolean(user.emailVerified),
    twoFactorEnabled: tfEnabled,
    authMethods: user.authMethods || ['password'],
    preferredLocale: user.preferredLocale,
  };
}

export function buildAuthSessionOr2faPayload(
  user: StoredUser,
  db: StoredDatabase,
  extraFields: Record<string, unknown> = {}
) {
  const tf = db.twoFactors[user.id];
  if (tf && tf.enabled) {
    const challengeToken = `2fa_chal_${crypto.randomBytes(18).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5).toISOString();
    db.pending2faChallenges[challengeToken] = {
      challengeToken,
      userId: user.id,
      expiresAt,
    };
    saveDb(db);
    return {
      payload: {
        requiresTwoFactor: true,
        pending2faToken: challengeToken,
        email: user.email,
        devCurrentTotpCode: computeTotpCode(tf.secret),
        ...extraFields,
      },
      sessionToken: null,
    };
  }

  const sessionToken = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  db.sessions.push({ token: sessionToken, userId: user.id, expiresAt });
  if (!db.gameStates[user.id]) {
    db.gameStates[user.id] = { ...INITIAL_GAME_STATE };
  }
  saveDb(db);

  return {
    payload: {
      requiresTwoFactor: false,
      token: sessionToken,
      user: serializeUser(user, db),
      gameState: db.gameStates[user.id],
      subscription: db.subscriptions[user.id] || null,
      isPremiumEntitled: isUserPremiumEntitled(user.id, db),
      ...extraFields,
    },
    sessionToken,
  };
}

export function jsonResponse(
  data: unknown,
  status = 200,
  sessionToken?: string | null,
  extraHeaders?: Headers
): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  if (extraHeaders) {
    extraHeaders.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        headers.append('Set-Cookie', value);
      }
    });
  }
  if (sessionToken) {
    headers.append(
      'Set-Cookie',
      `mundoki_session=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 14}`
    );
  }
  return new Response(JSON.stringify(data), { status, headers });
}

/* -------------------------------------------------------------------------- */
/* Better Auth + Cloudflare D1 Async Store Operations                         */
/* -------------------------------------------------------------------------- */

export interface AuthenticatedSessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  sessionToken: string | null;
}

function buildHeadersWithSessionToken(request: Request): Headers {
  const headers = new Headers(request.headers);
  if (!headers.get('authorization')) {
    const token = parseAuthTokenFromRequest(request);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
  }
  return headers;
}

/**
 * Resolves the authenticated user via Better Auth (`getSession` supporting both
 * Better Auth cookies and Bearer tokens), with D1 / local JSON fallback.
 */
export async function getAuthenticatedSessionUser(
  request: Request,
  env: RuntimeEnv
): Promise<AuthenticatedSessionUser | null> {
  const origin = getAppOrigin(request, env);
  const auth = createBetterAuthInstance(env, {
    baseURL: origin,
    requestOrigin: new URL(request.url).origin,
  });

  const headers = buildHeadersWithSessionToken(request);
  try {
    const baSession = await auth.api.getSession({ headers });
    if (baSession?.user) {
      const u = baSession.user as {
        id: string;
        email: string;
        name: string;
        emailVerified?: boolean;
        twoFactorEnabled?: boolean | null;
      };
      const sess = baSession.session as { token?: string } | undefined;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        emailVerified: Boolean(u.emailVerified),
        twoFactorEnabled: Boolean(u.twoFactorEnabled),
        sessionToken: sess?.token || parseAuthTokenFromRequest(request),
      };
    }
  } catch {
    // Fall through to direct store lookup
  }

  const token = parseAuthTokenFromRequest(request);
  if (!token) return null;

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1
      .select({
        user: users,
        session: sessions,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    const match = rows[0];
    if (!match) return null;
    if (new Date(match.session.expiresAt).getTime() <= Date.now()) return null;

    return {
      id: match.user.id,
      email: match.user.email,
      name: match.user.name,
      emailVerified: Boolean(match.user.emailVerified),
      twoFactorEnabled: Boolean(match.user.twoFactorEnabled),
      sessionToken: match.session.token,
    };
  }

  const db = loadDb();
  const user = getAuthenticatedUserFromRequest(request, db);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: Boolean(user.emailVerified),
    twoFactorEnabled: Boolean(user.twoFactorEnabled || db.twoFactors[user.id]?.enabled),
    sessionToken: token,
  };
}

export async function ensureUserAppRecords(
  userId: string,
  preferredLocale: Locale,
  env: RuntimeEnv,
  authMethod?: AuthMethod
): Promise<void> {
  const now = new Date().toISOString();

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1
      .insert(profiles)
      .values({
        userId,
        preferredLocale,
        reducedMotion: false,
        activeStage: 'primary',
        activeGrade: 'grade-1',
        updatedAt: now,
      })
      .onConflictDoNothing();

    await d1
      .insert(userGameState)
      .values({
        userId,
        energy: INITIAL_GAME_STATE.energy,
        stars: INITIAL_GAME_STATE.stars,
        currentPlanetId: INITIAL_GAME_STATE.currentPlanetId,
        equippedHat: INITIAL_GAME_STATE.equippedCosmetics.hat,
        equippedSuit: INITIAL_GAME_STATE.equippedCosmetics.suit,
        equippedAccessory: INITIAL_GAME_STATE.equippedCosmetics.accessory,
        stateJson: JSON.stringify(INITIAL_GAME_STATE),
        updatedAt: now,
      })
      .onConflictDoNothing();

    if (authMethod) {
      const existing = await d1.select().from(users).where(eq(users.id, userId)).limit(1);
      if (existing[0]) {
        const methods = new Set(
          String(existing[0].authMethods || 'password')
            .split(',')
            .map((m) => m.trim())
            .filter(Boolean)
        );
        methods.add(authMethod);
        await d1
          .update(users)
          .set({ authMethods: Array.from(methods).join(','), updatedAt: now })
          .where(eq(users.id, userId));
      }
    }
    return;
  }

  const db = loadDb();
  if (!db.gameStates[userId]) {
    db.gameStates[userId] = { ...INITIAL_GAME_STATE };
  }
  db.userLocales = db.userLocales || {};
  if (!db.userLocales[userId]) {
    db.userLocales[userId] = preferredLocale;
  }
  if (authMethod) {
    db.userAuthMethods = db.userAuthMethods || {};
    const current = new Set<AuthMethod>(db.userAuthMethods[userId] || ['password']);
    current.add(authMethod);
    db.userAuthMethods[userId] = Array.from(current);
  }
  saveDb(db);
}

export async function updateUserPreferredLocaleInStore(
  userId: string,
  locale: Locale,
  env: RuntimeEnv
): Promise<void> {
  const now = new Date().toISOString();
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1
      .insert(profiles)
      .values({
        userId,
        preferredLocale: locale,
        reducedMotion: false,
        activeStage: 'primary',
        activeGrade: 'grade-1',
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: { preferredLocale: locale, updatedAt: now },
      });
    return;
  }

  const db = loadDb();
  db.userLocales = db.userLocales || {};
  db.userLocales[userId] = locale;
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    user.preferredLocale = locale;
  }
  saveDb(db);
}

export async function getGameStateFromStore(
  userId: string,
  env: RuntimeEnv
): Promise<PlayerGameState> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1
      .select()
      .from(userGameState)
      .where(eq(userGameState.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) return { ...INITIAL_GAME_STATE };
    if (row.stateJson) {
      try {
        const parsed = JSON.parse(row.stateJson) as Partial<PlayerGameState>;
        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          equippedCosmetics: {
            ...INITIAL_GAME_STATE.equippedCosmetics,
            ...(parsed.equippedCosmetics || {}),
          },
        };
      } catch {
        // Fallback to columns below
      }
    }
    return {
      ...INITIAL_GAME_STATE,
      energy: row.energy,
      stars: row.stars,
      currentPlanetId: row.currentPlanetId,
      equippedCosmetics: {
        hat: row.equippedHat || null,
        suit: row.equippedSuit || null,
        accessory: row.equippedAccessory || null,
      },
    };
  }

  const db = loadDb();
  return db.gameStates[userId] || { ...INITIAL_GAME_STATE };
}

/** Read before loading state; a concurrent write makes the later batch fail atomically. */
export async function getGameStateRevision(userId: string, env: RuntimeEnv): Promise<string | null> {
  if (env.DB) {
    const rows = await createD1DrizzleClient(env.DB).select({ revision: userGameState.stateJson })
      .from(userGameState).where(eq(userGameState.userId, userId)).limit(1);
    return rows[0]?.revision ?? null;
  }
  return JSON.stringify(loadDb().gameStates[userId] ?? null);
}

export async function saveGameStateInStore(
  userId: string,
  state: PlayerGameState,
  env: RuntimeEnv,
  verifiedAttempts: AttemptRecord[] = [],
  expectedRevision?: string | null
): Promise<void> {
  const now = new Date().toISOString();

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const queries = [
      d1
        .insert(userGameState)
        .values({
          userId,
          energy: state.energy,
          stars: state.stars,
          currentPlanetId: state.currentPlanetId,
          equippedHat: state.equippedCosmetics.hat,
          equippedSuit: state.equippedCosmetics.suit,
          equippedAccessory: state.equippedCosmetics.accessory,
          stateJson: JSON.stringify(state),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: userGameState.userId,
          set: {
            // A failed compare deliberately violates NOT NULL, rolling back the entire D1 batch.
            energy: expectedRevision !== undefined
              ? sql`CASE WHEN ${userGameState.stateJson} IS ${expectedRevision} THEN ${state.energy} ELSE NULL END`
              : state.energy,
            stars: state.stars,
            currentPlanetId: state.currentPlanetId,
            equippedHat: state.equippedCosmetics.hat,
            equippedSuit: state.equippedCosmetics.suit,
            equippedAccessory: state.equippedCosmetics.accessory,
            stateJson: JSON.stringify(state),
            updatedAt: now,
          },
        }),
      ...verifiedAttempts.map((attempt) =>
        d1
          .insert(exerciseAttempts)
          .values({
            attemptId: attempt.attemptId,
            userId,
            topicId: attempt.topicId,
            seed: attempt.seed,
            difficulty: attempt.difficulty,
            submittedAnswer: attempt.userAnswer,
            serverVerifiedCorrect: attempt.isCorrect,
            createdAt: attempt.timestamp || now,
          })
      ),
      ...Object.entries(state.topicMastery || {}).map(([topicId, mastery]) =>
        d1
          .insert(userProgress)
          .values({
            userId,
            topicId,
            solvedCount: mastery.solved,
            attemptCount: mastery.attempts,
            guardianDefeated: mastery.guardianDefeated,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: [userProgress.userId, userProgress.topicId],
            set: {
              solvedCount: mastery.solved,
              attemptCount: mastery.attempts,
              guardianDefeated: mastery.guardianDefeated,
              updatedAt: now,
            },
          })
      ),
      ...(state.unlockedCosmetics || []).map((cosmeticId) =>
        d1
          .insert(unlockedRewards)
          .values({ userId, rewardType: 'cosmetic', rewardId: cosmeticId, unlockedAt: now })
          .onConflictDoNothing()
      ),
      ...(state.unlockedPlanets || []).map((planetId) =>
        d1
          .insert(unlockedRewards)
          .values({ userId, rewardType: 'planet', rewardId: planetId, unlockedAt: now })
          .onConflictDoNothing()
      ),
      ...VEHICLE_TIERS.filter((tier) => state.energy >= tier.requiredEnergy).map((tier) =>
        d1
          .insert(unlockedRewards)
          .values({ userId, rewardType: 'vehicle', rewardId: tier.id, unlockedAt: now })
          .onConflictDoNothing()
      ),
    ] as const;

    await d1.batch([queries[0], ...queries.slice(1)]);
    return;
  }

  const db = loadDb();
  if (expectedRevision !== undefined && JSON.stringify(db.gameStates[userId] ?? null) !== expectedRevision) {
    throw new Error('Concurrent progress update');
  }
  db.gameStates[userId] = state;
  for (const attempt of verifiedAttempts) {
    db.processedAttemptIds[attempt.attemptId] = true;
  }
  saveDb(db);
}

export async function isAttemptProcessedInStore(
  attemptId: string,
  env: RuntimeEnv
): Promise<boolean> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1
      .select({ attemptId: exerciseAttempts.attemptId })
      .from(exerciseAttempts)
      .where(eq(exerciseAttempts.attemptId, attemptId))
      .limit(1);
    return Boolean(rows[0]);
  }
  const db = loadDb();
  return Boolean(db.processedAttemptIds[attemptId]);
}

export async function getSubscriptionFromStore(
  userId: string,
  env: RuntimeEnv
): Promise<StoredSubscription | null> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      provider: 'mercadopago',
      providerSubscriptionId: row.providerSubscriptionId || '',
      planCode: row.planCode,
      currency: 'ARS',
      amountArs: row.amountArs,
      status: row.status,
      currentPeriodEnd: row.currentPeriodEnd,
      isDevMock: Boolean(row.isDevMock),
      updatedAt: row.updatedAt,
    };
  }
  const db = loadDb();
  return db.subscriptions[userId] || null;
}

/** A durable lease serializes checkout requests across Worker isolates. */
export async function acquireCheckoutLease(userId: string, env: RuntimeEnv): Promise<string | null> {
  const token = crypto.randomUUID();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 60000).toISOString();
  if (env.DB) {
    const rows = await createD1DrizzleClient(env.DB).insert(verifications).values({
      id: `checkout:${userId}`, identifier: `checkout:${userId}`, value: token,
      purpose: 'checkout_lease', expiresAt, createdAt: now, updatedAt: now,
    }).onConflictDoUpdate({ target: verifications.id, set: { value: token, expiresAt, updatedAt: now },
      setWhere: sql`${verifications.expiresAt} <= ${now}` }).returning({ id: verifications.id });
    return rows.length ? token : null;
  }
  const db = loadDb();
  db.checkoutLeases ??= {};
  if (db.checkoutLeases[userId]?.expiresAt > now) return null;
  db.checkoutLeases[userId] = { token, expiresAt };
  saveDb(db);
  return token;
}

export async function releaseCheckoutLease(userId: string, token: string, env: RuntimeEnv): Promise<void> {
  if (env.DB) {
    await createD1DrizzleClient(env.DB).delete(verifications)
      .where(sql`${verifications.id} = ${`checkout:${userId}`} AND ${verifications.value} = ${token}`);
    return;
  }
  const db = loadDb();
  if (db.checkoutLeases?.[userId]?.token === token) {
    delete db.checkoutLeases[userId];
    saveDb(db);
  }
}

/** Complete only the reserved checkout; never overwrite a newer webhook or replacement. */
export async function completeCheckoutInStore(sub: StoredSubscription, reservationId: string, env: RuntimeEnv): Promise<void> {
  if (env.DB) {
    const rows = await createD1DrizzleClient(env.DB).update(subscriptions).set({
      providerSubscriptionId: sub.providerSubscriptionId, isDevMock: sub.isDevMock,
      status: sub.status, updatedAt: sub.updatedAt,
    }).where(sql`${subscriptions.userId} = ${sub.userId} AND ${subscriptions.providerSubscriptionId} = ${reservationId}`)
      .returning({ id: subscriptions.id });
    if (rows.length) return;
  } else {
    const db = loadDb();
    if (db.subscriptions[sub.userId]?.providerSubscriptionId === reservationId) {
      db.subscriptions[sub.userId] = sub;
      saveDb(db);
      return;
    }
  }
  const existing = await getSubscriptionFromStore(sub.userId, env);
  if (existing?.providerSubscriptionId !== sub.providerSubscriptionId) throw new Error('Checkout reservation changed');
}

export async function saveSubscriptionInStore(
  sub: StoredSubscription,
  env: RuntimeEnv
): Promise<void> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1
      .insert(subscriptions)
      .values({
        id: sub.id,
        userId: sub.userId,
        provider: sub.provider,
        providerSubscriptionId: sub.providerSubscriptionId,
        planCode: sub.planCode,
        currency: sub.currency,
        amountArs: sub.amountArs,
        status: sub.status,
        currentPeriodEnd: sub.currentPeriodEnd,
        isDevMock: sub.isDevMock,
        updatedAt: sub.updatedAt,
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: {
          providerSubscriptionId: sub.providerSubscriptionId,
          planCode: sub.planCode,
          currency: sub.currency,
          amountArs: sub.amountArs,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          isDevMock: sub.isDevMock,
          updatedAt: sub.updatedAt,
        },
      });
    return;
  }
  const db = loadDb();
  db.subscriptions[sub.userId] = sub;
  saveDb(db);
}

export async function hasProcessedPaymentEventInStore(
  eventId: string,
  env: RuntimeEnv
): Promise<boolean> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1
      .select({ providerEventId: paymentEvents.providerEventId })
      .from(paymentEvents)
      .where(eq(paymentEvents.providerEventId, eventId))
      .limit(1);
    return Boolean(rows[0]);
  }
  const db = loadDb();
  return Boolean(db.processedPaymentEvents[eventId]);
}

export async function recordPaymentEventInStore(
  params: {
    eventId: string;
    userId: string;
    eventType: string;
    payloadSummary: string;
    processedAt: string;
  },
  env: RuntimeEnv
): Promise<void> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1
      .insert(paymentEvents)
      .values({
        providerEventId: params.eventId,
        userId: params.userId,
        provider: 'mercadopago',
        eventType: params.eventType,
        payloadSummary: params.payloadSummary,
        processedAt: params.processedAt,
      })
      .onConflictDoNothing();
    return;
  }
  const db = loadDb();
  db.processedPaymentEvents[params.eventId] = {
    eventType: params.eventType,
    processedAt: params.processedAt,
  };
  saveDb(db);
}

export async function getUserAppBundle(
  authUser: AuthenticatedSessionUser,
  env: RuntimeEnv
) {
  let role: 'user' | 'admin' = 'user';
  let preferredLocale: Locale = 'es-AR';
  let authMethods: AuthMethod[] = ['password'];
  let twoFactorEnabled = Boolean(authUser.twoFactorEnabled);

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const [profileRow, userRow, accountRows, tfRow] = await Promise.all([
      d1.select().from(profiles).where(eq(profiles.userId, authUser.id)).limit(1),
      d1.select().from(users).where(eq(users.id, authUser.id)).limit(1),
      d1.select({ providerId: accounts.providerId }).from(accounts).where(eq(accounts.userId, authUser.id)),
      d1.select({ verified: twoFactors.verified }).from(twoFactors).where(eq(twoFactors.userId, authUser.id)).limit(1),
    ]);

    if (profileRow[0]?.preferredLocale === 'en-US') {
      preferredLocale = 'en-US';
    }
    const methods = new Set<AuthMethod>();
    for (const acc of accountRows) {
      if (acc.providerId === 'credential') methods.add('password');
      else if (
        acc.providerId === 'google' ||
        acc.providerId === 'facebook' ||
        acc.providerId === 'apple' ||
        acc.providerId === 'magic_link'
      ) {
        methods.add(acc.providerId);
      }
    }
    if (userRow[0]?.authMethods) {
      for (const raw of userRow[0].authMethods.split(',')) {
        const m = raw.trim() as AuthMethod;
        if (
          m === 'password' ||
          m === 'magic_link' ||
          m === 'google' ||
          m === 'facebook' ||
          m === 'apple'
        ) {
          methods.add(m);
        }
      }
    }
    role = userRow[0]?.role === 'admin' ? 'admin' : 'user';
    if (methods.size > 0) authMethods = Array.from(methods);
    twoFactorEnabled = Boolean(authUser.twoFactorEnabled || userRow[0]?.twoFactorEnabled || tfRow[0]?.verified);
  } else {
    const db = loadDb();
    role = db.users.find(user => user.id === authUser.id)?.role === 'admin' ? 'admin' : 'user';
    preferredLocale = db.userLocales?.[authUser.id] || 'es-AR';
    authMethods = db.userAuthMethods?.[authUser.id] || ['password'];
    twoFactorEnabled = Boolean(authUser.twoFactorEnabled || db.twoFactors[authUser.id]?.enabled);
  }

  const [gameState, subscription] = await Promise.all([
    getGameStateFromStore(authUser.id, env),
    getSubscriptionFromStore(authUser.id, env),
  ]);

  return {
    user: {
      id: authUser.id,
      role,
      email: authUser.email,
      name: authUser.name,
      emailVerified: authUser.emailVerified,
      twoFactorEnabled,
      authMethods,
      preferredLocale,
    },
    gameState,
    subscription,
    isPremiumEntitled: isSubscriptionActive(subscription),
  };
}

export async function createOrFindUserSessionInStore(
  params: {
    email: string;
    name: string;
    providerId: OAuthProvider | 'magic_link';
    accountId: string;
    preferredLocale: Locale;
    emailVerified?: boolean;
  },
  env: RuntimeEnv
): Promise<{ user: AuthenticatedSessionUser; sessionToken: string }> {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  const sessionToken = crypto.randomBytes(24).toString('hex');

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const existingUsers = await d1.select().from(users).where(eq(users.email, params.email)).limit(1);
    let userRow = existingUsers[0];

    if (!userRow) {
      const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
      await d1.insert(users).values({
        id: userId,
        email: params.email,
        name: params.name,
        emailVerified: params.emailVerified ?? true,
        twoFactorEnabled: false,
        authMethods: params.providerId,
        createdAt: now,
        updatedAt: now,
      });
      userRow = (await d1.select().from(users).where(eq(users.id, userId)).limit(1))[0];
    } else if (params.emailVerified && !userRow.emailVerified) {
      await d1
        .update(users)
        .set({ emailVerified: true, updatedAt: now })
        .where(eq(users.id, userRow.id));
    }

    const existingAcc = await d1
      .select()
      .from(accounts)
      .where(eq(accounts.accountId, params.accountId))
      .limit(1);
    if (!existingAcc[0]) {
      await d1
        .insert(accounts)
        .values({
          id: `acc_${crypto.randomBytes(8).toString('hex')}`,
          userId: userRow.id,
          providerId: params.providerId,
          accountId: params.accountId,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();
    }

    await d1.insert(sessions).values({
      id: `ses_${crypto.randomBytes(8).toString('hex')}`,
      userId: userRow.id,
      token: sessionToken,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    await ensureUserAppRecords(userRow.id, params.preferredLocale, env, params.providerId);

    return {
      user: {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        emailVerified: Boolean(userRow.emailVerified || params.emailVerified),
        twoFactorEnabled: Boolean(userRow.twoFactorEnabled),
        sessionToken,
      },
      sessionToken,
    };
  }

  const db = loadDb();
  let user = db.users.find((u) => u.email === params.email);
  if (!user) {
    user = {
      id: `usr_${crypto.randomBytes(8).toString('hex')}`,
      email: params.email,
      name: params.name,
      passwordHash: null,
      emailVerified: params.emailVerified ?? true,
      twoFactorEnabled: false,
      authMethods: [params.providerId],
      preferredLocale: params.preferredLocale,
      createdAt: now,
    };
    db.users.push(user);
  } else if (!user.authMethods.includes(params.providerId)) {
    user.authMethods.push(params.providerId);
  }
  db.sessions.push({ token: sessionToken, userId: user.id, expiresAt });
  saveDb(db);
  await ensureUserAppRecords(user.id, params.preferredLocale, env, params.providerId);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      twoFactorEnabled: Boolean(user.twoFactorEnabled || db.twoFactors[user.id]?.enabled),
      sessionToken,
    },
    sessionToken,
  };
}

export async function create2faChallengeInStore(
  userId: string,
  env: RuntimeEnv
): Promise<string> {
  const challengeToken = `2fa_chal_${crypto.randomBytes(18).toString('hex')}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5).toISOString();

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1.insert(verifications).values({
      id: `ver_${crypto.randomBytes(8).toString('hex')}`,
      identifier: `2fa_challenge:${challengeToken}`,
      value: userId,
      token: challengeToken,
      purpose: '2fa_challenge',
      used: false,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });
    return challengeToken;
  }

  const db = loadDb();
  db.pending2faChallenges[challengeToken] = { challengeToken, userId, expiresAt };
  saveDb(db);
  return challengeToken;
}

export async function consume2faChallengeInStore(
  challengeToken: string,
  env: RuntimeEnv
): Promise<{ userId: string } | { error: string }> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1.delete(verifications)
      .where(eq(verifications.identifier, `2fa_challenge:${challengeToken}`)).returning();
    const row = rows[0];
    if (!row) return { error: 'Invalid or expired 2FA login challenge.' };
    if (new Date(row.expiresAt).getTime() < Date.now()) {
      return { error: '2FA login challenge expired (5-minute limit). Please sign in again.' };
    }
    return { userId: row.value };
  }

  const db = loadDb();
  const challenge = db.pending2faChallenges[challengeToken];
  if (!challenge) return { error: 'Invalid or expired 2FA login challenge.' };
  delete db.pending2faChallenges[challengeToken];
  saveDb(db);
  if (new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { error: '2FA login challenge expired (5-minute limit). Please sign in again.' };
  }
  return { userId: challenge.userId };
}

/** Compare the encrypted snapshot so concurrent requests cannot reuse or resurrect codes. */
export async function consumeBackupCodeInStore(userId: string, code: string, env: RuntimeEnv): Promise<number | null> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const [row] = await d1.select().from(twoFactors).where(eq(twoFactors.userId, userId)).limit(1);
    if (!row?.verified) return null;
    let codes: string[];
    try { codes = JSON.parse(await symmetricDecrypt({ key: getAuthSecret(env), data: row.backupCodes })); }
    catch { try { codes = JSON.parse(row.backupCodes); } catch { return null; } }
    if (!Array.isArray(codes)) return null;
    const index = codes.findIndex(value => value.toUpperCase() === code.toUpperCase());
    if (index < 0) return null;
    codes.splice(index, 1);
    const encrypted = await symmetricEncrypt({ key: getAuthSecret(env), data: JSON.stringify(codes) });
    const saved = await d1.update(twoFactors).set({ backupCodes: encrypted, updatedAt: new Date().toISOString() })
      .where(sql`${twoFactors.userId} = ${userId} AND ${twoFactors.verified} = 1 AND ${twoFactors.backupCodes} = ${row.backupCodes}`)
      .returning({ id: twoFactors.id });
    return saved.length ? codes.length : null;
  }
  const db = loadDb();
  const record = db.twoFactors[userId];
  if (!record?.enabled) return null;
  const index = record.backupCodes.findIndex(value => value.toUpperCase() === code.toUpperCase());
  if (index < 0) return null;
  record.backupCodes.splice(index, 1);
  saveDb(db);
  return record.backupCodes.length;
}

export async function getTwoFactorRecordInStore(
  userId: string,
  env: RuntimeEnv
): Promise<{ secretBase32: string; backupCodes: string[]; enabled: boolean } | null> {
  const authSecret = getAuthSecret(env);

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const rows = await d1.select().from(twoFactors).where(eq(twoFactors.userId, userId)).limit(1);
    const row = rows[0];
    if (!row) return null;

    let secretBase32 = row.secret;
    try {
      const decrypted = await symmetricDecrypt({ key: authSecret, data: row.secret });
      secretBase32 = decrypted.startsWith('base32:') ? decrypted.slice(7) : decrypted;
    } catch {
      // Fallback if stored unencrypted
    }

    let backupCodes: string[] = [];
    try {
      const decCodes = await symmetricDecrypt({ key: authSecret, data: row.backupCodes });
      backupCodes = JSON.parse(decCodes) as string[];
    } catch {
      try {
        backupCodes = JSON.parse(row.backupCodes) as string[];
      } catch {
        backupCodes = [];
      }
    }

    return {
      secretBase32,
      backupCodes,
      enabled: Boolean(row.verified),
    };
  }

  const db = loadDb();
  const tf = db.twoFactors[userId];
  if (!tf) return null;
  return {
    secretBase32: tf.secret,
    backupCodes: tf.backupCodes,
    enabled: tf.enabled,
  };
}

export async function saveTwoFactorRecordInStore(
  params: {
    userId: string;
    secretBase32: string;
    backupCodes: string[];
    enabled: boolean;
  },
  env: RuntimeEnv
): Promise<void> {
  const now = new Date().toISOString();
  const authSecret = getAuthSecret(env);

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    const encryptedSecret = await symmetricEncrypt({
      key: authSecret,
      data: `base32:${params.secretBase32}`,
    });
    const encryptedCodes = await symmetricEncrypt({
      key: authSecret,
      data: JSON.stringify(params.backupCodes),
    });

    const saved = await d1
      .insert(twoFactors)
      .values({
        id: `tf_${crypto.randomBytes(8).toString('hex')}`,
        userId: params.userId,
        secret: encryptedSecret,
        backupCodes: encryptedCodes,
        verified: params.enabled,
        failedVerificationCount: 0,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: twoFactors.userId,
        set: {
          secret: encryptedSecret,
          backupCodes: encryptedCodes,
          verified: params.enabled,
          updatedAt: now,
        },
        setWhere: params.enabled ? undefined : eq(twoFactors.verified, false),
      }).returning({ id: twoFactors.id });
    if (!saved.length) throw new Error('2FA is already enabled');

    if (params.enabled) await d1
      .update(users)
      .set({ twoFactorEnabled: params.enabled, updatedAt: now })
      .where(eq(users.id, params.userId));
    return;
  }

  const db = loadDb();
  if (!params.enabled && db.twoFactors[params.userId]?.enabled) throw new Error('2FA is already enabled');
  db.twoFactors[params.userId] = {
    userId: params.userId,
    secret: params.secretBase32,
    backupCodes: params.backupCodes,
    enabled: params.enabled,
    updatedAt: now,
  };
  const user = db.users.find((u) => u.id === params.userId);
  if (user) {
    user.twoFactorEnabled = params.enabled;
  }
  saveDb(db);
}

export async function deleteTwoFactorRecordInStore(
  userId: string,
  env: RuntimeEnv
): Promise<void> {
  const now = new Date().toISOString();

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1.delete(twoFactors).where(eq(twoFactors.userId, userId));
    await d1
      .update(users)
      .set({ twoFactorEnabled: false, updatedAt: now })
      .where(eq(users.id, userId));
    return;
  }

  const db = loadDb();
  delete db.twoFactors[userId];
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    user.twoFactorEnabled = false;
  }
  saveDb(db);
}

export async function createSessionForUserInD1(
  userId: string,
  env: RuntimeEnv
): Promise<string> {
  const sessionToken = crypto.randomBytes(24).toString('hex');
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    await d1.insert(sessions).values({
      id: `ses_${crypto.randomBytes(8).toString('hex')}`,
      userId,
      token: sessionToken,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });
    return sessionToken;
  }

  const db = loadDb();
  db.sessions.push({ token: sessionToken, userId, expiresAt });
  saveDb(db);
  return sessionToken;
}

/** The event and entitlement are committed in one transaction; duplicate events roll back. */
export async function commitSubscriptionEvent(eventId: string, sub: StoredSubscription, env: RuntimeEnv): Promise<boolean> {
  if (env.DB) {
    const d1 = createD1DrizzleClient(env.DB);
    try {
      await d1.batch([
        d1.insert(paymentEvents).values({ providerEventId: eventId, userId: sub.userId,
          provider: 'mercadopago', eventType: sub.status, payloadSummary: JSON.stringify({ subscriptionId: sub.providerSubscriptionId }),
          processedAt: new Date().toISOString() }),
        d1.update(subscriptions).set({ status: sub.status, amountArs: sub.amountArs, currentPeriodEnd: sub.currentPeriodEnd, updatedAt: sub.updatedAt })
          .where(sql`${subscriptions.userId} = ${sub.userId} AND ${subscriptions.providerSubscriptionId} = ${sub.providerSubscriptionId}
            AND ${subscriptions.updatedAt} <= ${sub.updatedAt}`),
      ]);
      return true;
    } catch (error) {
      if (await hasProcessedPaymentEventInStore(eventId, env)) return false;
      throw error;
    }
  }
  const db = loadDb();
  if (db.processedPaymentEvents[eventId]) return false;
  const existing = db.subscriptions[sub.userId];
  if (existing?.providerSubscriptionId === sub.providerSubscriptionId && existing.updatedAt <= sub.updatedAt) db.subscriptions[sub.userId] = sub;
  db.processedPaymentEvents[eventId] = { eventType: sub.status, processedAt: new Date().toISOString() };
  saveDb(db);
  return true;
}

/** Reserve one of five verification attempts per five-minute window before checking the code. */
export async function verifyTwoFactorForRemoval(userId: string, code: string, env: RuntimeEnv): Promise<boolean> {
  const now = new Date().toISOString();
  const until = new Date(Date.now() + 5 * 60000).toISOString();
  if (env.DB) {
    const rows = await createD1DrizzleClient(env.DB).update(twoFactors).set({
      failedVerificationCount: sql`CASE WHEN ${twoFactors.lockedUntil} IS NULL OR ${twoFactors.lockedUntil} <= ${now} THEN 1 ELSE ${twoFactors.failedVerificationCount} + 1 END`,
      lockedUntil: sql`CASE WHEN ${twoFactors.lockedUntil} IS NULL OR ${twoFactors.lockedUntil} <= ${now} THEN ${until} ELSE ${twoFactors.lockedUntil} END`,
    }).where(sql`${twoFactors.userId} = ${userId} AND ${twoFactors.verified} = 1 AND
      (${twoFactors.lockedUntil} IS NULL OR ${twoFactors.lockedUntil} <= ${now} OR ${twoFactors.failedVerificationCount} < 5)`)
      .returning({ id: twoFactors.id });
    if (!rows.length) return false;
  } else {
    const db = loadDb();
    const tf = db.twoFactors[userId];
    if (!tf?.enabled) return false;
    if (!tf.lockedUntil || tf.lockedUntil <= now) {
      tf.failedVerificationCount = 0;
      tf.lockedUntil = until;
    }
    if ((tf.failedVerificationCount || 0) >= 5) return false;
    tf.failedVerificationCount = (tf.failedVerificationCount || 0) + 1;
    saveDb(db);
  }
  const record = await getTwoFactorRecordInStore(userId, env);
  return Boolean(record?.enabled && /^\d{6}$/.test(code) && verifyTotpCode(record.secretBase32, code));
}
