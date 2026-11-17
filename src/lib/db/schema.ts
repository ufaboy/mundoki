import { sql } from 'drizzle-orm';
import { DEFAULT_PREMIUM_MONTHLY_ARS } from '../payments/pricing';
import {
  integer,
  check,
  index,
  real,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/**
 * Cloudflare D1 (SQLite) & Drizzle ORM Schema Definition for Mundoki.
 * Implements Section 11 & 12 of the Master Product Specification:
 * - Better Auth tables (users, sessions, accounts, verifications, two_factors)
 * - Profiles & Curriculum hierarchy (profiles, subjects, school_stages, topics)
 * - Server-verifiable progress (exercise_sessions, exercise_attempts, user_progress)
 * - Gamified progression (user_game_state, unlocked_rewards)
 * - Subscriptions & idempotent webhooks (subscriptions, payment_events)
 */

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).notNull().default(false),
  authMethods: text('auth_methods').notNull().default('password'),
  image: text('image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const accounts = sqliteTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerId: text('provider_id').notNull(),
    accountId: text('account_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: text('access_token_expires_at'),
    refreshTokenExpiresAt: text('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [uniqueIndex('accounts_provider_account_idx').on(table.providerId, table.accountId)]
);

export const verifications = sqliteTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  token: text('token').unique(),
  purpose: text('purpose').notNull().default('magic_link'),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const twoFactors = sqliteTable('two_factors', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(true),
  failedVerificationCount: integer('failed_verification_count').notNull().default(0),
  lockedUntil: text('locked_until'),
  updatedAt: text('updated_at'),
});

export const profiles = sqliteTable('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  preferredLocale: text('preferred_locale').notNull().default('es-AR'),
  reducedMotion: integer('reduced_motion', { mode: 'boolean' }).notNull().default(false),
  activeStage: text('active_stage').notNull().default('primary'),
  activeGrade: text('active_grade').notNull().default('grade-1'),
  updatedAt: text('updated_at').notNull(),
});

export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  slugEs: text('slug_es').notNull(),
  slugEn: text('slug_en').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const schoolStages = sqliteTable('school_stages', {
  id: text('id').primaryKey(),
  sortOrder: integer('sort_order').notNull(),
  status: text('status', { enum: ['active', 'future'] }).notNull(),
});

export const schoolGrades = sqliteTable('school_grades', {
  id: text('id').primaryKey(),
  stageId: text('stage_id')
    .notNull()
    .references(() => schoolStages.id),
  gradeNumber: integer('grade_number').notNull(),
  slugEs: text('slug_es').notNull(),
  slugEn: text('slug_en').notNull(),
  sortOrder: integer('sort_order').notNull(),
  status: text('status', { enum: ['active', 'planned'] }).notNull().default('active'),
});

export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id')
    .notNull()
    .references(() => subjects.id),
  stageId: text('stage_id')
    .notNull()
    .references(() => schoolStages.id),
  gradeId: text('grade_id')
    .notNull()
    .default('grade-1')
    .references(() => schoolGrades.id),
  slugEs: text('slug_es').notNull(),
  slugEn: text('slug_en').notNull(),
  sortOrder: integer('sort_order').notNull(),
  entitlementLevel: text('entitlement_level', { enum: ['free', 'premium'] }).notNull(),
});

export const exerciseSessions = sqliteTable('exercise_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  topicId: text('topic_id')
    .notNull()
    .references(() => topics.id),
  seed: integer('seed').notNull(),
  difficulty: integer('difficulty').notNull(),
  status: text('status', { enum: ['active', 'completed', 'expired'] }).notNull().default('active'),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull(),
});

export const exerciseAttempts = sqliteTable('exercise_attempts', {
  attemptId: text('attempt_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  topicId: text('topic_id')
    .notNull()
    .references(() => topics.id),
  seed: integer('seed').notNull(),
  difficulty: integer('difficulty').notNull(),
  submittedAnswer: text('submitted_answer').notNull(),
  serverVerifiedCorrect: integer('server_verified_correct', { mode: 'boolean' }).notNull(),
  createdAt: text('created_at').notNull(),
});

export const userProgress = sqliteTable(
  'user_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    topicId: text('topic_id')
      .notNull()
      .references(() => topics.id),
    solvedCount: integer('solved_count').notNull().default(0),
    attemptCount: integer('attempt_count').notNull().default(0),
    guardianDefeated: integer('guardian_defeated', { mode: 'boolean' }).notNull().default(false),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.topicId] })]
);

export const userGameState = sqliteTable('user_game_state', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  energy: integer('energy').notNull().default(20),
  stars: integer('stars').notNull().default(1),
  currentPlanetId: text('current_planet_id').notNull().default('planet-suma'),
  equippedHat: text('equipped_hat'),
  equippedSuit: text('equipped_suit'),
  equippedAccessory: text('equipped_accessory'),
  stateJson: text('state_json'),
  updatedAt: text('updated_at').notNull(),
});

export const unlockedRewards = sqliteTable(
  'unlocked_rewards',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rewardType: text('reward_type', { enum: ['cosmetic', 'planet', 'vehicle'] }).notNull(),
    rewardId: text('reward_id').notNull(),
    unlockedAt: text('unlocked_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.rewardType, table.rewardId] })]
);

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull().default('mercadopago'),
  providerSubscriptionId: text('provider_subscription_id'),
  planCode: text('plan_code').notNull().default('monthly_ars'),
  currency: text('currency').notNull().default('ARS'),
  amountArs: integer('amount_ars').notNull().default(DEFAULT_PREMIUM_MONTHLY_ARS),
  status: text('status', {
    enum: ['inactive', 'pending', 'active', 'cancelled', 'expired'],
  }).notNull(),
  currentPeriodEnd: text('current_period_end'),
  isDevMock: integer('is_dev_mock', { mode: 'boolean' }).notNull().default(false),
  updatedAt: text('updated_at').notNull(),
});

export const paymentEvents = sqliteTable('payment_events', {
  providerEventId: text('provider_event_id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  provider: text('provider').notNull(),
  eventType: text('event_type').notNull(),
  payloadSummary: text('payload_summary').notNull(),
  processedAt: text('processed_at').notNull(),
});

export const promoInvites = sqliteTable('promo_invites', {
  id: text('id').primaryKey().notNull(), code: text('code').notNull().unique(),
  recipientEmail: text('recipient_email').notNull(), label: text('label').notNull().default(''),
  discountPercent: integer('discount_percent').notNull(), durationMonths: integer('duration_months').notNull(),
  newCustomersOnly: integer('new_customers_only', { mode: 'boolean' }).notNull().default(true),
  expiresAt: text('expires_at').notNull(), state: text('state', { enum: ['issued', 'checkout', 'active', 'standard', 'cancelled', 'revoked', 'attention'] }).notNull().default('issued'),
  createdBy: text('created_by').notNull().references(() => users.id), createdAt: text('created_at').notNull(),
  userId: text('user_id').references(() => users.id), acceptedAt: text('accepted_at'), promoEndsAt: text('promo_ends_at'),
  fullAmountArs: real('full_amount_ars'), discountedAmountArs: real('discounted_amount_ars'),
  termsVersion: text('terms_version'), providerSubscriptionId: text('provider_subscription_id').unique(),
  checkoutUrl: text('checkout_url'), leaseUntil: text('lease_until'),
  version: integer('version').notNull().default(0),
  transitionAttempts: integer('transition_attempts').notNull().default(0), lastError: text('last_error'), updatedAt: text('updated_at').notNull(),
}, table => [
  check('promo_discount_range', sql`${table.discountPercent} BETWEEN 10 AND 100`),
  check('promo_duration_range', sql`${table.durationMonths} BETWEEN 1 AND 6`),
  check('promo_state_values', sql`${table.state} IN ('issued','checkout','active','standard','cancelled','revoked','attention')`),
  index('promo_invites_recipient_idx').on(table.recipientEmail),
  index('promo_invites_due_idx').on(table.state, table.promoEndsAt),
  uniqueIndex('promo_invites_one_current_per_user').on(table.userId).where(sql`${table.state} IN ('checkout','active','attention')`),
]);
export const promoEvents = sqliteTable('promo_events', {
  id: text('id').primaryKey().notNull(), inviteId: text('invite_id').notNull().references(() => promoInvites.id),
  actorId: text('actor_id').references(() => users.id), action: text('action').notNull(),
  detail: text('detail').notNull().default(''), createdAt: text('created_at').notNull(),
});

export const schema = {
  promoInvites,
  promoEvents,
  users,
  sessions,
  accounts,
  verifications,
  twoFactors,
  profiles,
  subjects,
  schoolStages,
  schoolGrades,
  topics,
  exerciseSessions,
  exerciseAttempts,
  userProgress,
  userGameState,
  unlockedRewards,
  subscriptions,
  paymentEvents,
};
