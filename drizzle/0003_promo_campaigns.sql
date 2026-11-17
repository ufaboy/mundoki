CREATE TABLE promo_campaigns (
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

CREATE TABLE promo_campaign_redemptions (
  id TEXT PRIMARY KEY NOT NULL,
  campaign_id TEXT NOT NULL REFERENCES promo_campaigns(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  invite_id TEXT NOT NULL REFERENCES promo_invites(id),
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX promo_campaign_redemptions_user_idx ON promo_campaign_redemptions(campaign_id, user_id);
