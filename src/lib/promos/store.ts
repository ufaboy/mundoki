import crypto from 'node:crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { createD1DrizzleClient } from '../db/d1Store';
import { promoCampaignRedemptions, promoCampaigns, promoEvents, promoInvites } from '../db/schema';
import type { RuntimeEnv } from '../server/runtimeEnv';
import { PromoError, validateCampaign, validateInvite } from './policy';

export type PromoInvite = typeof promoInvites.$inferSelect;
export type PromoCampaign = typeof promoCampaigns.$inferSelect;
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

export async function issueCampaign(env: RuntimeEnv, actorId: string, input: Record<string, unknown>): Promise<PromoCampaign> {
  const valid = validateCampaign(input, env);
  const now = new Date().toISOString();
  const code = valid.code || `MP-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const row: PromoCampaign = {
    id: crypto.randomUUID(),
    code,
    label: valid.label,
    discountPercent: valid.discountPercent,
    durationMonths: valid.durationMonths,
    maxActivations: valid.maxActivations,
    activationsCount: 0,
    newCustomersOnly: valid.newCustomersOnly,
    expiresAt: valid.expiresAt,
    active: true,
    createdBy: actorId,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await db(env).insert(promoCampaigns).values(row);
  } catch {
    throw new PromoError('code_exists', 409);
  }
  return row;
}

export async function listCampaigns(env: RuntimeEnv) {
  return db(env).select().from(promoCampaigns).orderBy(desc(promoCampaigns.createdAt)).limit(200);
}

export async function getCampaignByCode(env: RuntimeEnv, code: string): Promise<PromoCampaign | null> {
  return (await db(env).select().from(promoCampaigns).where(eq(promoCampaigns.code, code)).limit(1))[0] || null;
}

export async function toggleCampaignActive(env: RuntimeEnv, id: string, active: boolean): Promise<PromoCampaign> {
  const now = new Date().toISOString();
  const rows = await db(env).update(promoCampaigns).set({ active, updatedAt: now }).where(eq(promoCampaigns.id, id)).returning();
  if (!rows.length) throw new PromoError('not_found', 404);
  return rows[0];
}

export async function hasUserRedeemedCampaign(env: RuntimeEnv, campaignId: string, userId: string): Promise<boolean> {
  const rows = await db(env)
    .select({ id: promoCampaignRedemptions.id })
    .from(promoCampaignRedemptions)
    .where(and(eq(promoCampaignRedemptions.campaignId, campaignId), eq(promoCampaignRedemptions.userId, userId)))
    .limit(1);
  return rows.length > 0;
}

export async function claimCampaignForUser(
  env: RuntimeEnv,
  campaign: PromoCampaign,
  user: { id: string; email: string },
  terms: { promoEndsAt: string; fullAmountArs: number; discountedAmountArs: number; termsVersion: string }
): Promise<PromoInvite> {
  const now = new Date().toISOString();
  const inviteId = crypto.randomUUID();
  const invite: PromoInvite = {
    id: inviteId,
    code: `${campaign.code}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    recipientEmail: user.email.trim().toLowerCase(),
    label: campaign.label,
    discountPercent: campaign.discountPercent,
    durationMonths: campaign.durationMonths,
    newCustomersOnly: campaign.newCustomersOnly,
    expiresAt: campaign.expiresAt,
    state: 'checkout',
    createdBy: campaign.createdBy,
    createdAt: now,
    userId: user.id,
    acceptedAt: now,
    promoEndsAt: terms.promoEndsAt,
    fullAmountArs: terms.fullAmountArs,
    discountedAmountArs: terms.discountedAmountArs,
    termsVersion: terms.termsVersion,
    providerSubscriptionId: null,
    checkoutUrl: null,
    leaseUntil: null,
    transitionAttempts: 0,
    lastError: null,
    version: 0,
    updatedAt: now,
  };
  const client = db(env);
  try {
    await client.batch([
      client
        .update(promoCampaigns)
        .set({
          updatedAt: now,
          activationsCount: sql`CASE WHEN ${promoCampaigns.active} = 1 AND ${promoCampaigns.activationsCount} < ${promoCampaigns.maxActivations} THEN ${promoCampaigns.activationsCount} + 1 ELSE NULL END`,
        })
        .where(eq(promoCampaigns.id, campaign.id)),
      client.insert(promoInvites).values(invite),
      client.insert(promoEvents).values({
        id: crypto.randomUUID(),
        inviteId,
        actorId: user.id,
        action: 'terms_accepted',
        detail: `campaign:${campaign.code}`,
        createdAt: now,
      }),
      client.insert(promoCampaignRedemptions).values({
        id: crypto.randomUUID(),
        campaignId: campaign.id,
        userId: user.id,
        inviteId,
        createdAt: now,
      }),
    ]);
  } catch {
    throw new PromoError('promo_limit_reached', 409);
  }
  return invite;
}
