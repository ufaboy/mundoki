import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHmac } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

// Import the local store only after isolating its working directory. No real credentials or data.
const root = process.cwd();
process.chdir(mkdtempSync(path.join(tmpdir(), 'mundoki-regression-')));
for (const key of ['DB', 'MERCADOPAGO_ACCESS_TOKEN', 'MP_ACCESS_TOKEN', 'MERCADOPAGO_WEBHOOK_SECRET', 'MP_WEBHOOK_SECRET', 'BETTER_AUTH_SECRET']) delete process.env[key];
process.env.BETTER_AUTH_SECRET = 'isolated-test-secret-with-at-least-32-characters';
const store = await import('../lib/db/d1Store');
const { POST: sync } = await import('../pages/api/progress/sync');
const { POST: webhook } = await import('../pages/api/webhooks/mercadopago');
const { POST: cancel } = await import('../pages/api/subscriptions/cancel');
const { POST: checkout } = await import('../pages/api/subscriptions/checkout');
const { ALL: auth } = await import('../pages/api/auth/[...all]');
const { generateMathExercise } = await import('../math/topics/generators');
const { validateMathAnswer } = await import('../math/core/validator');
const { INITIAL_GAME_STATE, applyExerciseOutcome } = await import('../game/core/gameState');
const { reconcileSyncedState } = await import('../game/core/syncState');
const { computeTotpCode } = await import('../lib/auth/totp');
const request = (route: string, body: unknown = {}, headers = {}) => new Request(`http://localhost:3333${route}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', authorization: 'Bearer test-session', ...headers }, body: JSON.stringify(body),
});
const call = (handler: Function, req: Request, action?: string) => handler({ request: req, params: { all: action } }) as Promise<Response>;
const db = store.loadDb();
db.users.push({ id: 'u1', email: 'audit@example.invalid', name: 'Audit', emailVerified: true } as any);
db.sessions.push({ token: 'test-session', userId: 'u1', expiresAt: '2099-01-01T00:00:00Z' });
store.saveDb(db);
const exercise = generateMathExercise('addition-subtraction', 1, 424242);
const attempt = { attemptId: 'one', exerciseId: exercise.id, topicId: exercise.topic, seed: 424242, difficulty: 1,
  userAnswer: validateMathAnswer(exercise, '0').expectedCanonicalAnswer, isCorrect: true,
  timestamp: new Date().toISOString(), syncedToServer: false } as any;
const first = await (await call(sync, request('/api/progress/sync', { attempts: [attempt, attempt] }))).json();
assert.equal(first.gameState.totalSolved, 1);
assert.equal(first.syncedAttemptIds.length, 1);
const replay = await (await call(sync, request('/api/progress/sync', { attempts: [attempt] }))).json();
assert.equal(replay.gameState.totalSolved, 1);
const attempts = Array.from({ length: 51 }, (_, i) => ({ ...attempt, attemptId: `batch-${i}` }));
const batch = await (await call(sync, request('/api/progress/sync', { attempts }))).json();
assert.equal(batch.syncedAttemptIds.length, 50);
let local = first.gameState;
for (const item of attempts) local = applyExerciseOutcome(local, item, false).nextState;
local = applyExerciseOutcome(local, { ...attempt, attemptId: 'during-request' }, false).nextState;
const merged = reconcileSyncedState(local, batch.gameState, batch.syncedAttemptIds, false);
assert.deepEqual(merged.pendingSyncAttempts.map(a => a.attemptId), ['batch-50', 'during-request']);
assert.equal(merged.totalSolved, 53);
console.log('PASS [API sync] duplicate IDs, replay, 51-answer batch, answers during request');

const sub = { id: 's1', userId: 'u1', provider: 'mercadopago', providerSubscriptionId: 'resource-1', planCode: 'monthly_ars',
  currency: 'ARS', amountArs: 4500, status: 'pending', currentPeriodEnd: null, isDevMock: false, updatedAt: '2026-01-01T00:00:00.000Z' } as const;
await store.saveSubscriptionInStore(sub, {});
process.env.MERCADOPAGO_ACCESS_TOKEN = 'test-provider-token';
process.env.MERCADOPAGO_WEBHOOK_SECRET = 'test-webhook-secret';
const remote = { id: sub.providerSubscriptionId, external_reference: 'u1', status: 'authorized', last_modified: '2026-02-01T00:00:00.000Z',
  next_payment_date: '2099-01-01T00:00:00.000Z', auto_recurring: { currency_id: 'ARS', transaction_amount: 4500 } };
const realFetch = globalThis.fetch;
let failure = false;
let cancelled = false;
globalThis.fetch = async (url, init) => {
  assert.equal(String(url), 'https://api.mercadopago.com/preapproval/resource-1');
  if (failure) return new Response('{}', { status: 503 });
  if (init?.method === 'PUT') {
    assert.equal(JSON.parse(String(init.body)).status, 'cancelled');
    cancelled = true;
    return Response.json({ ...remote, status: 'cancelled' });
  }
  return Response.json(remote);
};
const signature = createHmac('sha256', 'test-webhook-secret').update('id:resource-1;request-id:req-1;ts:123;').digest('hex');
const signed = { 'x-signature': `ts=123,v1=${signature}`, 'x-request-id': 'req-1' };
const notify = (body = {}) => call(webhook, request('/api/webhooks/mercadopago?data.id=resource-1', {
  id: 100, type: 'subscription_preapproval', action: 'updated', data: { id: 'resource-1' }, ...body,
}, signed));
assert.equal((await notify()).status, 200);
const altered = await (await notify({ userId: 'victim', eventId: 'different', action: 'subscription_cancelled' })).json();
assert.equal(altered.idempotentReplay, true);
assert.equal(await store.getSubscriptionFromStore('victim', {}), null);
assert.equal((await store.getSubscriptionFromStore('u1', {}))?.status, 'active');
assert.equal((await call(webhook, request('/api/webhooks/mercadopago?data.id=other', {}, signed))).status, 401);
failure = true;
assert.equal((await call(cancel, request('/api/subscriptions/cancel'))).status, 502);
assert.equal((await store.getSubscriptionFromStore('u1', {}))?.status, 'active');
failure = false;
assert.equal((await call(cancel, request('/api/subscriptions/cancel'))).status, 200);
assert.equal(cancelled, true);
assert.equal((await store.getSubscriptionFromStore('u1', {}))?.status, 'cancelled');
globalThis.fetch = realFetch;
console.log('PASS [Payments] official payload, tampering, replay, provider failure and confirmed cancellation');

const secret = 'JBSWY3DPEHPK3PXP';
await store.saveTwoFactorRecordInStore({ userId: 'u1', secretBase32: secret, backupCodes: [], enabled: true }, {});
assert.equal((await call(auth, request('/api/auth/2fa/setup'), '2fa/setup')).status, 409);
assert.equal((await store.getTwoFactorRecordInStore('u1', {}))?.secretBase32, secret);
assert.equal((await call(auth, request('/api/auth/2fa/disable'), '2fa/disable')).status, 403);
assert.equal((await call(auth, request('/api/auth/two-factor/disable'), 'two-factor/disable')).status, 403);
assert.equal((await call(auth, request('/api/auth/2fa/disable', { code: computeTotpCode(secret) }), '2fa/disable')).status, 200);
console.log('PASS [2FA] enabled setup preserved; removal requires TOTP; native bypass blocked');

const { createBetterAuthInstance } = await import('../lib/auth/betterAuth');
const memoryAuth = createBetterAuthInstance({ BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET });
const spoofed = await memoryAuth.api.signUpEmail({ body: { name: 'Role test', email: 'role-test@example.invalid', password: 'isolated-password-123', role: 'admin' } as any });
assert.notEqual((spoofed.user as any).role, 'admin');
console.log('PASS [Roles] registration cannot supply an admin role');

// A native email URL must not create a session; POST must revoke the library session before 2FA.
let magicToken = '';
createBetterAuthInstance({ BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET }, {
  onDevMagicLink: payload => { magicToken = payload.token; },
});
const authContext = await memoryAuth.$context;
await authContext.internalAdapter.updateUser(spoofed.user.id, { twoFactorEnabled: true, emailVerified: true });
const headers = new Headers({ origin: 'http://localhost:3333' });
await memoryAuth.api.signInMagicLink({ headers, body: { email: spoofed.user.email } });
const beforeSessions = await authContext.internalAdapter.listSessions(spoofed.user.id);
const nativeMagic = await call(auth, new Request(`http://localhost:3333/api/auth/magic-link/verify?token=${magicToken}&callbackURL=https://evil.invalid/en-us/account`), 'magic-link/verify');
assert.equal(nativeMagic.status, 303);
assert.equal(new URL(nativeMagic.headers.get('location')!).origin, 'http://localhost:3333');
assert.equal(new URL(nativeMagic.headers.get('location')!).searchParams.get('magic_token'), magicToken);
assert.equal(nativeMagic.headers.get('set-cookie'), null);
const magicVerification = await call(auth, request('/api/auth/magic-link/verify', { token: magicToken }), 'magic-link/verify');
const magicPayload = await magicVerification.json();
assert.equal(magicPayload.requiresTwoFactor, true);
assert.equal(magicPayload.token, undefined);
assert.equal(magicVerification.headers.get('set-cookie'), null);
assert.equal((await authContext.internalAdapter.listSessions(spoofed.user.id)).length, beforeSessions.length);
assert.equal((await call(auth, request('/api/auth/magic-link/verify', { token: magicToken }), 'magic-link/verify')).status, 401);
await authContext.internalAdapter.updateUser(spoofed.user.id, { twoFactorEnabled: false });
createBetterAuthInstance({ BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET }, {
  onDevMagicLink: payload => { magicToken = payload.token; },
});
await memoryAuth.api.signInMagicLink({ headers, body: { email: spoofed.user.email } });
const ordinaryMagic = await call(auth, request('/api/auth/magic-link/verify', { token: magicToken }), 'magic-link/verify');
const ordinaryPayload = await ordinaryMagic.json();
assert.equal(ordinaryPayload.requiresTwoFactor, false);
assert.ok(ordinaryPayload.token);
assert.ok(await memoryAuth.api.getSession({ headers: new Headers({ authorization: `Bearer ${ordinaryPayload.token}` }) }));

await store.saveTwoFactorRecordInStore({ userId: 'u1', secretBase32: secret, backupCodes: ['ONE-TIME'], enabled: true }, {});
const challenges = await Promise.all([1, 2].map(() => store.create2faChallengeInStore('u1', {})));
const backupResponses = await Promise.all(challenges.map(pending2faToken => call(auth,
  request('/api/auth/2fa/verify-challenge', { pending2faToken, code: 'ONE-TIME' }), '2fa/verify-challenge')));
assert.deepEqual(backupResponses.map(response => response.status).sort(), [200, 401]);
console.log('PASS [2FA regression] native magic link gated, provisional session revoked, backup code single use');

// A magic link is only issued for registered emails, and the answer never reveals which ones exist.
const magicFor = async (email: string) => (await call(auth, request('/api/auth/magic-link/request', { email, locale: 'en-US' }, { authorization: '' }), 'magic-link/request')).json();
const unknownMagic = await magicFor('nobody-here@example.invalid');
const knownMagic = await magicFor(spoofed.user.email);
assert.equal(unknownMagic.ok, true);
assert.equal(unknownMagic.magicToken, undefined);
assert.ok(knownMagic.magicToken);
assert.equal(unknownMagic.message.replace('nobody-here@example.invalid', ''), knownMagic.message.replace(spoofed.user.email, ''));
console.log('PASS [Magic link] sent only to registered emails; same answer for unknown emails');

let providerCalls = 0;
let checkoutKey = '';
let providerEntered!: () => void;
let providerRelease!: () => void;
const entered = new Promise<void>(resolve => { providerEntered = resolve; });
const release = new Promise<void>(resolve => { providerRelease = resolve; });
globalThis.fetch = async (_url, init) => {
  providerCalls++;
  const key = new Headers(init?.headers).get('X-Idempotency-Key');
  assert.ok(key);
  if (checkoutKey) assert.equal(key, checkoutKey);
  checkoutKey = key;
  if (providerCalls === 1) {
    providerEntered();
    await release;
    throw new Error('Lost provider response');
  }
  return Response.json({ id: 'resumed-provider-id', init_point: 'https://example.invalid/checkout' });
};
const startCheckout = () => call(checkout, request('/api/subscriptions/checkout', { adultConfirmed: true }));
const firstCheckout = startCheckout();
await entered;
assert.equal((await startCheckout()).status, 409);
assert.equal(providerCalls, 1);
providerRelease();
assert.equal((await firstCheckout).status, 502);
assert.equal((await startCheckout()).status, 200);
assert.equal((await store.getSubscriptionFromStore('u1', {}))?.providerSubscriptionId, 'resumed-provider-id');
assert.equal((await startCheckout()).status, 409);
globalThis.fetch = realFetch;
console.log('PASS [Checkout regression] concurrent request rejected, failed request resumes with stable idempotency key');

// SQLite-backed D1 adapter exercises actual Drizzle statements, constraints and batch rollback.
const sqlite = new DatabaseSync(':memory:');
sqlite.exec(readFileSync(path.join(root, 'drizzle/0000_initial.sql'), 'utf8'));
sqlite.exec(readFileSync(path.join(root, 'drizzle/0001_better_auth.sql'), 'utf8'));
sqlite.exec(readFileSync(path.join(root, 'drizzle/0002_personal_promos.sql'), 'utf8'));
sqlite.exec("INSERT INTO users(id,email,name,created_at,updated_at) VALUES('u1','sql@example.invalid','SQL','2026','2026')");
class Statement {
  constructor(private query: string, private params: any[] = []) {}
  bind(...params: any[]) { return new Statement(this.query, params); }
  async all() { return { results: sqlite.prepare(this.query).all(...this.params), success: true, meta: {} }; }
  async raw() { const stmt = sqlite.prepare(this.query); stmt.setReturnArrays(true); return stmt.all(...this.params); }
  async run() { return this.all(); }
}
const env = { DB: { prepare: (query: string) => new Statement(query), batch: async (statements: Statement[]) => {
  sqlite.exec('BEGIN');
  try { const result = []; for (const stmt of statements) result.push(await stmt.all()); sqlite.exec('COMMIT'); return result; }
  catch (error) { sqlite.exec('ROLLBACK'); throw error; }
} }, BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET };
await store.saveGameStateInStore('u1', INITIAL_GAME_STATE, env);
const revision = await store.getGameStateRevision('u1', env);
await store.saveGameStateInStore('u1', { ...INITIAL_GAME_STATE, energy: 40 }, env, [], revision);
await assert.rejects(store.saveGameStateInStore('u1', { ...INITIAL_GAME_STATE, energy: 999 }, env, [], revision));
assert.equal((await store.getGameStateFromStore('u1', env)).energy, 40);
await store.saveGameStateInStore('u1', { ...INITIAL_GAME_STATE, energy: 60 }, env, [attempt], await store.getGameStateRevision('u1', env));
await assert.rejects(store.saveGameStateInStore('u1', { ...INITIAL_GAME_STATE, energy: 999 }, env, [attempt], await store.getGameStateRevision('u1', env)));
assert.equal((await store.getGameStateFromStore('u1', env)).energy, 60);
assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM exercise_attempts').get()?.count, 1);
await store.saveSubscriptionInStore(sub, env);
assert.equal(await store.commitSubscriptionEvent('event', { ...sub, status: 'active', updatedAt: '2026-02-01T00:00:00.000Z' }, env), true);
assert.equal(await store.commitSubscriptionEvent('event', { ...sub, status: 'cancelled', updatedAt: '2026-03-01T00:00:00.000Z' }, env), false);
assert.equal((await store.getSubscriptionFromStore('u1', env))?.status, 'active');
await store.commitSubscriptionEvent('old-event', { ...sub, status: 'cancelled' }, env);
assert.equal((await store.getSubscriptionFromStore('u1', env))?.status, 'active');
await store.saveTwoFactorRecordInStore({ userId: 'u1', secretBase32: secret, backupCodes: [], enabled: true }, env);
await assert.rejects(store.saveTwoFactorRecordInStore({ userId: 'u1', secretBase32: 'new', backupCodes: [], enabled: false }, env));
for (let i = 0; i < 5; i++) assert.equal(await store.verifyTwoFactorForRemoval('u1', 'invalid', env), false);
assert.equal(await store.verifyTwoFactorForRemoval('u1', computeTotpCode(secret), env), false);
await store.saveTwoFactorRecordInStore({ userId: 'u1', secretBase32: secret, backupCodes: ['SQL-ONE', 'SQL-TWO'], enabled: true }, env);
const backupClaims = await Promise.all([1, 2].map(() => store.consumeBackupCodeInStore('u1', 'SQL-ONE', env)));
assert.equal(backupClaims.filter(value => value === 1).length, 1);
assert.equal(backupClaims.filter(value => value === null).length, 1);
assert.equal(await store.consumeBackupCodeInStore('u1', 'SQL-ONE', env), null);
assert.equal(await store.consumeBackupCodeInStore('u1', 'SQL-TWO', env), 0);
const challengeToken = await store.create2faChallengeInStore('u1', env);
const challengeClaims = await Promise.all([1, 2].map(() => store.consume2faChallengeInStore(challengeToken, env)));
assert.equal(challengeClaims.filter(value => 'userId' in value).length, 1);
const leases = await Promise.all([1, 2].map(() => store.acquireCheckoutLease('u1', env)));
assert.equal(leases.filter(Boolean).length, 1);
await store.releaseCheckoutLease('u1', 'wrong-owner', env);
assert.equal(await store.acquireCheckoutLease('u1', env), null);
await store.releaseCheckoutLease('u1', leases.find(Boolean)!, env);
assert.ok(await store.acquireCheckoutLease('u1', env));
const reserved = { ...sub, providerSubscriptionId: 'checkout:sql-reservation' };
await store.saveSubscriptionInStore(reserved, env);
await store.completeCheckoutInStore(sub, reserved.providerSubscriptionId, env);
await store.commitSubscriptionEvent('checkout-active', { ...sub, status: 'active', updatedAt: '2026-03-01T00:00:00.000Z' }, env);
await store.completeCheckoutInStore(sub, reserved.providerSubscriptionId, env);
assert.equal((await store.getSubscriptionFromStore('u1', env))?.status, 'active');
await assert.rejects(store.completeCheckoutInStore({ ...sub, providerSubscriptionId: 'another-provider' }, reserved.providerSubscriptionId, env));
sqlite.close();
process.chdir(root);
console.log('PASS [D1 SQL] stale progress rollback, atomic payment replay, active 2FA guard and verification limit');
