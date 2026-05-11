-- Research Radar Italy production schema for Supabase/Postgres.
-- The local JSON store keeps the same entities so imports stay idempotent.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  kind TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE import_runs (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(id),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  records_seen INTEGER NOT NULL DEFAULT 0,
  records_imported INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  records_duplicated INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  report_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE source_records (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(id),
  import_run_id TEXT REFERENCES import_runs(id),
  external_id TEXT NOT NULL,
  source_category TEXT NOT NULL,
  source_category_label TEXT,
  source_url TEXT NOT NULL,
  source_url_canonical TEXT NOT NULL,
  raw_fields_json JSONB NOT NULL,
  normalized_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_hash TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_id, source_category, external_id),
  UNIQUE(source_id, source_url_canonical)
);

CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  source_record_id TEXT NOT NULL REFERENCES source_records(id),
  duplicate_of_position_id TEXT REFERENCES positions(id),
  title TEXT NOT NULL,
  title_key TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_key TEXT NOT NULL,
  department TEXT,
  location TEXT,
  region TEXT,
  position_type TEXT NOT NULL,
  professor_rank TEXT CHECK (
    professor_rank IS NULL OR professor_rank IN (
      'Professore I fascia',
      'Professore II fascia',
      'Professore straordinario'
    )
  ),
  discipline TEXT,
  ssd TEXT,
  gsd TEXT,
  funding_type TEXT,
  deadline DATE,
  deadline_status TEXT NOT NULL DEFAULT 'unknown' CHECK (deadline_status IN ('open', 'closing_soon', 'expired', 'unknown')),
  published_at DATE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_url_canonical TEXT NOT NULL,
  salary_or_amount TEXT,
  duration TEXT,
  language TEXT,
  summary TEXT,
  requirements_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  dedupe_key TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'auto_published' CHECK (review_status IN ('auto_published', 'needs_review', 'duplicate', 'rejected')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  confidence_score REAL NOT NULL DEFAULT 0.8 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_record_id),
  UNIQUE(source_url_canonical)
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  email_opt_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  position_types_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  disciplines_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  grant_programs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  email_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (email_frequency IN ('immediate', 'daily', 'weekly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  name TEXT NOT NULL,
  filters_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
  filters_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL,
  opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('position', 'grant')),
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'reading', 'applying', 'discarded')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, opportunity_type, opportunity_id)
);

CREATE TABLE email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  alert_subscription_id UUID REFERENCES alert_subscriptions(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'skipped')),
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE TABLE email_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_notification_id UUID REFERENCES email_notifications(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id TEXT NOT NULL REFERENCES positions(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX import_runs_source_started_idx ON import_runs(source_id, started_at DESC);
CREATE INDEX source_records_last_seen_idx ON source_records(source_id, last_seen_at DESC);
CREATE INDEX positions_deadline_idx ON positions(deadline);
CREATE INDEX positions_deadline_status_idx ON positions(deadline_status);
CREATE INDEX positions_position_type_idx ON positions(position_type);
CREATE INDEX positions_professor_rank_idx ON positions(professor_rank);
CREATE INDEX positions_region_idx ON positions(region);
CREATE INDEX positions_discipline_idx ON positions(discipline);
CREATE INDEX positions_funding_type_idx ON positions(funding_type);
CREATE INDEX positions_dedupe_key_idx ON positions(dedupe_key);
CREATE INDEX positions_review_status_idx ON positions(review_status);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX saved_searches_profile_idx ON saved_searches(profile_id, created_at DESC);
CREATE INDEX alert_subscriptions_profile_idx ON alert_subscriptions(profile_id, created_at DESC);
CREATE INDEX saved_opportunities_profile_idx ON saved_opportunities(profile_id, created_at DESC);
CREATE INDEX email_notifications_status_idx ON email_notifications(status, created_at);
