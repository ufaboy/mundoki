-- Migration 0000_initial.sql for Cloudflare D1 (SQLite)
-- Consolidated Mundoki schema (Better Auth, 2FA, curriculum metadata, progress, subscriptions, promos)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  auth_methods TEXT NOT NULL DEFAULT 'password',
  image TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TEXT,
  refresh_token_expires_at TEXT,
  scope TEXT,
  password TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(provider_id, account_id)
);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);

CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  token TEXT UNIQUE,
  purpose TEXT NOT NULL DEFAULT 'magic_link',
  used INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verifications_identifier ON verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_verifications_token ON verifications(token);

CREATE TABLE IF NOT EXISTS two_factors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  backup_codes TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 1,
  failed_verification_count INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_two_factors_user ON two_factors(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factors_secret ON two_factors(secret);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferred_locale TEXT NOT NULL DEFAULT 'es-AR',
  reduced_motion INTEGER NOT NULL DEFAULT 0,
  active_stage TEXT NOT NULL DEFAULT 'primary',
  active_grade TEXT NOT NULL DEFAULT 'grade-1',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  slug_es TEXT NOT NULL,
  slug_en TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS school_stages (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'future'))
);

CREATE TABLE IF NOT EXISTS school_grades (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES school_stages(id),
  grade_number INTEGER NOT NULL,
  slug_es TEXT NOT NULL,
  slug_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'planned'))
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  stage_id TEXT NOT NULL REFERENCES school_stages(id),
  grade_id TEXT NOT NULL DEFAULT 'grade-1' REFERENCES school_grades(id),
  slug_es TEXT NOT NULL,
  slug_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  entitlement_level TEXT NOT NULL CHECK (entitlement_level IN ('free', 'premium'))
);

CREATE TABLE IF NOT EXISTS exercise_attempts (
  attempt_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id),
  seed INTEGER NOT NULL,
  difficulty INTEGER NOT NULL,
  submitted_answer TEXT NOT NULL,
  server_verified_correct INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_topic ON exercise_attempts(user_id, topic_id);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id),
  solved_count INTEGER NOT NULL DEFAULT 0,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  guardian_defeated INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS user_game_state (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  energy INTEGER NOT NULL DEFAULT 20,
  stars INTEGER NOT NULL DEFAULT 1,
  current_planet_id TEXT NOT NULL DEFAULT 'planet-suma',
  equipped_hat TEXT,
  equipped_suit TEXT,
  equipped_accessory TEXT,
  state_json TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS unlocked_rewards (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('cosmetic', 'planet', 'vehicle')),
  reward_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  PRIMARY KEY (user_id, reward_type, reward_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'mercadopago',
  provider_subscription_id TEXT,
  plan_code TEXT NOT NULL DEFAULT 'monthly_ars',
  currency TEXT NOT NULL DEFAULT 'ARS',
  amount_ars INTEGER NOT NULL DEFAULT 4500,
  status TEXT NOT NULL CHECK (status IN ('inactive', 'pending', 'active', 'cancelled', 'expired')),
  current_period_end TEXT,
  is_dev_mock INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_events (
  provider_event_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_summary TEXT NOT NULL,
  processed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS promo_invites (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT NOT NULL UNIQUE,
  recipient_email TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  discount_percent INTEGER NOT NULL CHECK(discount_percent BETWEEN 10 AND 100),
  duration_months INTEGER NOT NULL CHECK(duration_months BETWEEN 1 AND 6),
  new_customers_only INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'issued' CHECK(state IN ('issued','checkout','active','standard','cancelled','revoked','attention')),
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  accepted_at TEXT,
  promo_ends_at TEXT,
  full_amount_ars REAL,
  discounted_amount_ars REAL,
  terms_version TEXT,
  provider_subscription_id TEXT UNIQUE,
  checkout_url TEXT,
  lease_until TEXT,
  transition_attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS promo_invites_recipient_idx ON promo_invites(recipient_email);
CREATE INDEX IF NOT EXISTS promo_invites_due_idx ON promo_invites(state, promo_ends_at);
CREATE UNIQUE INDEX IF NOT EXISTS promo_invites_one_current_per_user ON promo_invites(user_id)
  WHERE state IN ('checkout','active','attention');

CREATE TABLE IF NOT EXISTS promo_events (
  id TEXT PRIMARY KEY NOT NULL,
  invite_id TEXT NOT NULL REFERENCES promo_invites(id),
  actor_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS promo_events_invite_idx ON promo_events(invite_id, created_at);

CREATE TABLE IF NOT EXISTS promo_campaigns (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  discount_percent INTEGER NOT NULL CHECK(discount_percent BETWEEN 10 AND 100),
  duration_months INTEGER NOT NULL CHECK(duration_months BETWEEN 1 AND 6),
  max_activations INTEGER NOT NULL DEFAULT 10 CHECK(max_activations >= 1),
  activations_count INTEGER NOT NULL DEFAULT 0 CHECK(activations_count >= 0 AND activations_count <= max_activations),
  new_customers_only INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS promo_campaign_redemptions (
  id TEXT PRIMARY KEY NOT NULL,
  campaign_id TEXT NOT NULL REFERENCES promo_campaigns(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  invite_id TEXT NOT NULL REFERENCES promo_invites(id),
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS promo_campaign_redemptions_user_idx ON promo_campaign_redemptions(campaign_id, user_id);

-- Seed subjects, school stages, grades (1-12), and active math topics for FK integrity
INSERT OR IGNORE INTO subjects (id, slug_es, slug_en, is_active) VALUES
  ('mathematics', 'matematicas', 'mathematics', 1);

INSERT OR IGNORE INTO school_stages (id, sort_order, status) VALUES
  ('primary', 1, 'active'),
  ('middle', 2, 'active'),
  ('high', 3, 'future');

INSERT OR IGNORE INTO school_grades (id, stage_id, grade_number, slug_es, slug_en, sort_order, status) VALUES
  ('grade-1', 'primary', 1, '1-grado', 'grade-1', 1, 'active'),
  ('grade-2', 'primary', 2, '2-grado', 'grade-2', 2, 'active'),
  ('grade-3', 'primary', 3, '3-grado', 'grade-3', 3, 'active'),
  ('grade-4', 'primary', 4, '4-grado', 'grade-4', 4, 'active'),
  ('grade-5', 'middle', 5, '5-grado', 'grade-5', 5, 'active'),
  ('grade-6', 'middle', 6, '6-grado', 'grade-6', 6, 'active'),
  ('grade-7', 'middle', 7, '7-grado', 'grade-7', 7, 'active'),
  ('grade-8', 'middle', 8, '8-grado', 'grade-8', 8, 'active'),
  ('grade-9', 'high', 9, '9-grado', 'grade-9', 9, 'active'),
  ('grade-10', 'high', 10, '10-grado', 'grade-10', 10, 'active'),
  ('grade-11', 'high', 11, '11-grado', 'grade-11', 11, 'active'),
  ('grade-12', 'high', 12, '12-grado', 'grade-12', 12, 'active');

INSERT OR IGNORE INTO topics (id, subject_id, stage_id, grade_id, slug_es, slug_en, sort_order, entitlement_level) VALUES
  ('addition-subtraction', 'mathematics', 'primary', 'grade-1', 'suma-y-resta', 'addition-subtraction', 1, 'free'),
  ('multiplication-division', 'mathematics', 'primary', 'grade-3', 'multiplicacion-y-division', 'multiplication-division', 2, 'free'),
  ('fractions', 'mathematics', 'primary', 'grade-4', 'fracciones', 'fractions', 3, 'free'),
  ('negative-numbers', 'mathematics', 'middle', 'grade-6', 'numeros-negativos', 'negative-numbers', 4, 'free'),
  ('percentages-proportions', 'mathematics', 'middle', 'grade-7', 'porcentajes-y-proporciones', 'percentages-proportions', 5, 'free'),
  ('linear-equations', 'mathematics', 'middle', 'grade-8', 'ecuaciones-lineales', 'linear-equations', 6, 'premium');
