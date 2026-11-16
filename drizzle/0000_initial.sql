-- Migration 0000_initial.sql for Cloudflare D1 (SQLite)
-- Mundoki Master Product Specification Schema (including OAuth, Magic Links & TOTP 2FA)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  auth_methods TEXT NOT NULL DEFAULT 'password',
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
  created_at TEXT NOT NULL
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
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(provider_id, account_id)
);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);

CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL DEFAULT 'magic_link',
  used INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verifications_token ON verifications(token);
CREATE INDEX IF NOT EXISTS idx_verifications_identifier ON verifications(identifier);

CREATE TABLE IF NOT EXISTS two_factors (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  backup_codes_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

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
