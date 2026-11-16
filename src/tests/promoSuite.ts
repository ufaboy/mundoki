import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { addCalendarMonths, maxPromoMonths, promoPrice, PROMO_TERMS_VERSION, validateInvite } from '../lib/promos/policy';
import { changeInvite, getInvite, issueInvite, revokeInvite } from '../lib/promos/store';
import { publicQuote, quotePromo, redeemPromo } from '../lib/promos/service';
import { synchronizePromo } from '../lib/promos/billing';
import { hasAdminRole } from '../lib/auth/roles';
import { getSubscriptionFromStore, saveSubscriptionInStore } from '../lib/db/d1Store';
import type { RuntimeEnv } from '../lib/server/runtimeEnv';

const sqlite = new DatabaseSync(':memory:');
for (const file of ['0000_initial.sql', '0001_better_auth.sql', '0002_personal_promos.sql']) sqlite.exec(readFileSync(`drizzle/${file}`, 'utf8'));
class Statement {
  constructor(private query: string, private params: any[] = []) {}
  bind(...params: any[]) { return new Statement(this.query, params); }
  async all() { return { results: sqlite.prepare(this.query).all(...this.params), success: true, meta: {} }; }
  async raw() { const stmt = sqlite.prepare(this.query); stmt.setReturnArrays(true); return stmt.all(...this.params); }
  async run() { return this.all(); }
}
const env: RuntimeEnv = { DB: { prepare: (query: string) => new Statement(query), batch: async (statements: Statement[]) => {
  sqlite.exec('BEGIN');
  try { const rows = []; for (const stmt of statements) rows.push(await stmt.all()); sqlite.exec('COMMIT'); return rows; }
  catch (error) { sqlite.exec('ROLLBACK'); throw error; }
} }, PROMO_LIVE_BILLING_ENABLED: 'true', MP_ACCESS_TOKEN: 'test-token', PREMIUM_MONTHLY_ARS: '4500' };
function user(id: string) {
  sqlite.prepare('INSERT INTO users(id,email,name,created_at,updated_at) VALUES(?,?,?,?,?)').run(id, `${id}@example.invalid`, id, '2026', '2026');
  return { id, email: `${id}@example.invalid`, name: id, emailVerified: true, twoFactorEnabled: false, sessionToken: 'test' };
}
const admin = user('admin'); const customer = user('customer');
assert.equal(await hasAdminRole(admin.id, env), false);
sqlite.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(admin.id);
assert.equal(await hasAdminRole(admin.id, env), true);
assert.equal(await hasAdminRole(customer.id, env), false);
const input = { recipientEmail: customer.email, discountPercent: 50, durationMonths: 3,
  expiresAt: new Date(Date.now() + 86400000).toISOString() };
for (const discountPercent of [9, 101, 50.5]) assert.throws(() => validateInvite({ ...input, discountPercent }, env));
for (const durationMonths of [0, 7, 1.5]) assert.throws(() => validateInvite({ ...input, durationMonths }, env));
assert.equal(maxPromoMonths({ PROMO_MAX_MONTHS: '12' }), 6);
assert.equal(promoPrice(4500, 100), 0);
assert.equal(promoPrice(4500, 10), 4050);
assert.equal(addCalendarMonths('2027-01-31T10:30:00.000Z', 1), '2027-02-28T10:30:00.000Z');
assert.equal(addCalendarMonths('2027-08-31T10:30:00.000Z', 6), '2028-02-29T10:30:00.000Z');
const invite = await issueInvite(env, admin.id, input);
assert.throws(() => sqlite.prepare('UPDATE promo_invites SET duration_months=7 WHERE id=?').run(invite.id));
assert.throws(() => sqlite.prepare('UPDATE promo_invites SET discount_percent=101 WHERE id=?').run(invite.id));
await assert.rejects(quotePromo(env, { ...customer, emailVerified: false }, invite.code), /verify_email/);
await assert.rejects(quotePromo(env, { ...customer, email: 'other@example.invalid' }, invite.code), /invalid_code/);
assert.equal((await quotePromo(env, customer, invite.code.toLowerCase())).invite.id, invite.id);
const request = new Request('https://example.invalid/api/promos/redeem');
const accepted = { code: invite.code, adultConfirmed: true, termsVersion: PROMO_TERMS_VERSION, fullAmountArs: 4500 };
await assert.rejects(redeemPromo(env, customer, request, { ...accepted, adultConfirmed: false }), /consent_required/);
await assert.rejects(redeemPromo(env, customer, request, { ...accepted, fullAmountArs: 4000 }), /price_changed/);
const realFetch = globalThis.fetch;
let creates = 0, failTransition = false;
const remotes = new Map<string, any>();
globalThis.fetch = async (url, init) => {
  assert.ok(String(url).startsWith('https://api.mercadopago.com/preapproval'));
  const body = init?.body ? JSON.parse(String(init.body)) : null;
  if (init?.method === 'POST') {
    const id = `provider-${++creates}`;
    const row = { id, init_point: `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=${id}`,
      external_reference: body.external_reference, auto_recurring: body.auto_recurring,
      status: 'pending', last_modified: new Date().toISOString() };
    remotes.set(id, row); return Response.json(row);
  }
  const row = remotes.get(String(url).split('/').at(-1)); assert.ok(row);
  if (init?.method === 'PUT') {
    if (body.auto_recurring && failTransition) return Response.json({}, { status: 503 });
    if (body.auto_recurring) row.auto_recurring = { ...row.auto_recurring, ...body.auto_recurring };
    if (body.status) row.status = body.status;
    row.last_modified = new Date().toISOString();
  }
  return Response.json(row);
};
const results = await Promise.allSettled([redeemPromo(env, customer, request, accepted), redeemPromo(env, customer, request, accepted)]);
assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
assert.equal(creates, 1);
let redeemed = await getInvite(env, 'id', invite.id);
assert.equal(redeemed.termsVersion, PROMO_TERMS_VERSION);
assert.equal(redeemed.promoEndsAt, addCalendarMonths(redeemed.acceptedAt, 3));
const remote = remotes.get(redeemed.providerSubscriptionId);
assert.equal(remote.auto_recurring.transaction_amount, 2250);
assert.equal(remote.auto_recurring.end_date, redeemed.promoEndsAt);
await redeemPromo(env, customer, request, accepted);
assert.equal(creates, 1, 'Retry resumes the same checkout');
await assert.rejects(revokeInvite(env, invite.id, admin.id), /cannot_revoke/);
remote.status = 'authorized'; remote.next_payment_date = addCalendarMonths(redeemed.acceptedAt, 1); remote.summarized = { charged_quantity: 1 };
let subscription = await synchronizePromo(env, redeemed, structuredClone(remote));
await saveSubscriptionInStore(subscription, env);
redeemed = await getInvite(env, 'id', invite.id);
assert.equal(redeemed.state, 'active');
assert.ok(Date.parse(subscription.currentPeriodEnd) <= Date.parse(redeemed.promoEndsAt));
remote.summarized.charged_quantity = 3; remote.next_payment_date = redeemed.promoEndsAt;
failTransition = true;
await synchronizePromo(env, redeemed, structuredClone(remote));
redeemed = await getInvite(env, 'id', invite.id);
assert.equal(redeemed.state, 'attention');
assert.equal(remote.auto_recurring.end_date, redeemed.promoEndsAt, 'A failed transition retains the provider hard stop');
failTransition = false;
subscription = await synchronizePromo(env, redeemed, structuredClone(remote));
assert.equal(subscription.amountArs, 4500);
assert.equal(remote.auto_recurring.end_date, null);
assert.equal((await getInvite(env, 'id', invite.id)).state, 'standard');

const trialUser = user('trial');
const trial = await issueInvite(env, admin.id, { ...input, recipientEmail: trialUser.email, discountPercent: 100, durationMonths: 6 });
await redeemPromo(env, trialUser, request, { ...accepted, code: trial.code });
const trialClaim = await getInvite(env, 'id', trial.id); const trialRemote = remotes.get(trialClaim.providerSubscriptionId);
assert.equal(trialRemote.auto_recurring.transaction_amount, 4500, '100% promo authorizes future full-price billing, never a zero-value payment');
assert.equal(trialRemote.auto_recurring.start_date, trialClaim.promoEndsAt);
trialRemote.status = 'authorized'; trialRemote.next_payment_date = trialClaim.promoEndsAt;
const trialSub = await synchronizePromo(env, trialClaim, trialRemote);
assert.equal(trialSub.currentPeriodEnd, trialClaim.promoEndsAt);
assert.equal(publicQuote(trialClaim, env).discountedAmountArs, 0);

const revoked = await issueInvite(env, admin.id, { ...input, recipientEmail: user('revoked').email });
await revokeInvite(env, revoked.id, admin.id);
assert.equal((await getInvite(env, 'id', revoked.id)).state, 'revoked');
sqlite.prepare("UPDATE users SET role='user' WHERE id=?").run(admin.id);
assert.equal(await hasAdminRole(admin.id, env), false, 'Role revocation is effective immediately');
globalThis.fetch = realFetch;
sqlite.close();
console.log('PASS [Personal promos] roles, recipient verification, percentage/duration limits, calendar boundaries, consent, concurrent one-time redemption, checkout retry, hard stop, transition retry, 100% trial, revocation');
