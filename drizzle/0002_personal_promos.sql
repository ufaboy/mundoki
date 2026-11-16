ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin'));

CREATE TABLE promo_invites (
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
CREATE INDEX promo_invites_recipient_idx ON promo_invites(recipient_email);
CREATE INDEX promo_invites_due_idx ON promo_invites(state, promo_ends_at);
CREATE UNIQUE INDEX promo_invites_one_current_per_user ON promo_invites(user_id)
  WHERE state IN ('checkout','active','attention');
CREATE TABLE promo_events (
  id TEXT PRIMARY KEY NOT NULL,
  invite_id TEXT NOT NULL REFERENCES promo_invites(id),
  actor_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX promo_events_invite_idx ON promo_events(invite_id, created_at);
