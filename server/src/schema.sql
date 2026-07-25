-- Users (developers + admins)
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  password     TEXT NOT NULL,           -- bcrypt hash
  role         TEXT NOT NULL,           -- 'developer' | 'admin'
  status       TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'rejected'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Member sessions (e.g. "2026-27", "Alumni")
CREATE TABLE IF NOT EXISTS member_sessions (
  name         TEXT PRIMARY KEY,
  is_active    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INT NOT NULL DEFAULT 0
);

-- Members in each session
CREATE TABLE IF NOT EXISTS members (
  id           TEXT PRIMARY KEY,
  session_name TEXT NOT NULL REFERENCES member_sessions(name) ON DELETE CASCADE,
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS members_session_idx ON members(session_name);

-- Events, Vehicles, Projects — each has its own dedicated table (same
-- pattern as `members`) instead of sharing the generic `items` table.
CREATE TABLE IF NOT EXISTS events (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generic content collections that still share one table: announcements,
-- recruitments, advisory, forms.
CREATE TABLE IF NOT EXISTS items (
  id           TEXT PRIMARY KEY,
  collection   TEXT NOT NULL,
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS items_collection_idx ON items(collection);

-- Simple key/value store for singletons (info.md, etc)
CREATE TABLE IF NOT EXISTS settings (
  key          TEXT PRIMARY KEY,
  value        TEXT
);

-- Audit trail
CREATE TABLE IF NOT EXISTS audit_log (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT,
  role         TEXT,
  action       TEXT NOT NULL,
  target       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_log(created_at DESC);
