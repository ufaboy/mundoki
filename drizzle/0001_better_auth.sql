-- Migration 0001_better_auth.sql for Cloudflare D1 (SQLite)
-- Aligns tables with Better Auth v1.7+ (drizzleAdapter) and seeds Mundoki curriculum metadata.

ALTER TABLE users ADD COLUMN image TEXT;
ALTER TABLE sessions ADD COLUMN updated_at TEXT;
ALTER TABLE accounts ADD COLUMN id_token TEXT;
ALTER TABLE accounts ADD COLUMN access_token_expires_at TEXT;
ALTER TABLE accounts ADD COLUMN refresh_token_expires_at TEXT;
ALTER TABLE accounts ADD COLUMN scope TEXT;
ALTER TABLE accounts ADD COLUMN password TEXT;
ALTER TABLE user_game_state ADD COLUMN state_json TEXT;

DROP TABLE IF EXISTS verifications;
CREATE TABLE verifications (
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

DROP TABLE IF EXISTS two_factors;
CREATE TABLE two_factors (
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

