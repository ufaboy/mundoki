import crypto from 'node:crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { createD1DrizzleClient } from '../db/d1Store';
import { promoEvents, promoInvites } from '../db/schema';
import type { RuntimeEnv } from '../server/runtimeEnv';
import { PromoError, validateInvite } from './policy';

export type PromoInvite = typeof promoInvites.$inferSelect;
export type PromoState = PromoInvite['state'];
function db(env: RuntimeEnv) {
  if (!env.DB) throw new PromoError('database_required', 503);
  return createD1DrizzleClient(env.DB);
}

export async function issueInvite(env: RuntimeEnv, actorId: string, input: Record<string, unknown>): Promise<PromoInvite> {
  const now = new Date().toISOString();
  const row: PromoInvite = {
    ...validateInvite(input, env), id: crypto.randomUUID(), code: `MG-${crypto.randomBytes(16).toString('hex').toUpperCase()}`,
    state: 'issued', createdBy: actorId, createdAt: now, updatedAt: now,
    userId: null, acceptedAt: null, promoEndsAt: null, fullAmountArs: null, discountedAmountArs: null,
    termsVersion: null, providerSubscriptionId: null, checkoutUrl: null, leaseUntil: null,
    transitionAttempts: 0, lastError: null, version: 0,
  };
  const client = db(env);
  await client.batch([
    client.insert(promoInvites).values(row),
    client.insert(promoEvents).values({ id: crypto.randomUUID(), inviteId: row.id, actorId, action: 'issued', createdAt: now }),
  ]);
  return row;
}

export async function getInvite(env: RuntimeEnv, key: 'id' | 'code' | 'providerSubscriptionId', value: string): Promise<PromoInvite | null> {
  return (await db(env).select().from(promoInvites).where(eq(promoInvites[key], value)).limit(1))[0] || null;
}

export async function listInvites(env: RuntimeEnv) {
  return db(env).select().from(promoInvites).orderBy(desc(promoInvites.createdAt)).limit(200);
}
export async function inviteHistory(env: RuntimeEnv, id: string) {
  return db(env).select().from(promoEvents).where(eq(promoEvents.inviteId, id)).orderBy(desc(promoEvents.createdAt)).limit(100);
}
export async function dueInvites(env: RuntimeEnv) {
  return db(env).select().from(promoInvites)
    .where(and(inArray(promoInvites.state, ['checkout', 'active', 'attention']), sql`${promoInvites.providerSubscriptionId} IS NOT NULL`,
      sql`(${promoInvites.leaseUntil} IS NULL OR ${promoInvites.leaseUntil} <= ${new Date().toISOString()})`))
    .orderBy(promoInvites.leaseUntil, promoInvites.createdAt).limit(100);
}

export async function deferReconciliation(env: RuntimeEnv, id: string) {
  await db(env).update(promoInvites).set({ leaseUntil: new Date(Date.now() + 9 * 60000).toISOString() }).where(eq(promoInvites.id, id));
}

/** Conditional updates prevent double redemption and revocation racing with checkout. */
export async function changeInvite(env: RuntimeEnv, invite: PromoInvite, patch: Partial<PromoInvite>, action: string, actorId: string | null = null) {
  const now = new Date().toISOString();
  const client = db(env);
  let rows: PromoInvite[];
  try {
    const results = await client.batch([
      client.update(promoInvites).set({ ...patch, updatedAt: now,
        // NOT NULL rejects stale mutations and rolls back their audit record in the same batch.
        version: sql`CASE WHEN ${promoInvites.version} = ${invite.version} AND ${promoInvites.state} = ${invite.state} THEN ${invite.version + 1} ELSE NULL END`,
      }).where(eq(promoInvites.id, invite.id)).returning(),
      client.insert(promoEvents).values({ id: crypto.randomUUID(), inviteId: invite.id, actorId, action,
        detail: patch.lastError || '', createdAt: now }),
    ]);
    rows = results[0];
  } catch {
    throw new PromoError('promo_conflict', 409);
  }
  if (!rows.length) throw new PromoError('promo_conflict', 409);
  return rows[0];
}

export async function revokeInvite(env: RuntimeEnv, id: string, actorId: string) {
  const invite = await getInvite(env, 'id', id);
  if (!invite || invite.state !== 'issued') throw new PromoError('cannot_revoke', 409);
  return changeInvite(env, invite, { state: 'revoked' }, 'revoked', actorId);
}
