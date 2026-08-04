import { Router } from "express";
import { q } from "../db.js";
import { optionalAuth } from "../auth.js";

const r = Router();

/**
 * Full DB snapshot for frontend hydration. Public-safe fields only.
 * Auth-gated data (users list, audit) is fetched separately by developers.
 */
r.get("/", optionalAuth, async (_req, res) => {
  const [sessions, members, events, vehicles, projects, items, info] = await Promise.all([
    q("SELECT name, is_active, sort_order FROM member_sessions ORDER BY sort_order DESC"),
    q("SELECT id, session_name, data FROM members ORDER BY created_at ASC"),
    q("SELECT id, data, created_at FROM events ORDER BY created_at ASC"),
    q("SELECT id, data, created_at FROM vehicles ORDER BY created_at ASC"),
    q("SELECT id, data, created_at FROM projects ORDER BY created_at ASC"),
    // events/vehicles/projects now live in their own dedicated tables above —
    // this only covers the remaining shared collections (announcements,
    // recruitments, advisory, forms).
    q(
      "SELECT id, collection, data, created_at FROM items WHERE collection NOT IN ('events','vehicles','projects','recruitments') ORDER BY created_at ASC",
    ),
    q("SELECT value FROM settings WHERE key='info_md'"),
  ]);

  const membersBySession = {};
  for (const s of sessions.rows) membersBySession[s.name] = [];
  for (const m of members.rows) {
    (membersBySession[m.session_name] ||= []).push({ id: m.id, ...(m.data || {}) });
  }

  const byCollection = { events: [], projects: [], vehicles: [], announcements: [], recruitments: [], advisory: [], forms: [] };
  for (const e of events.rows) byCollection.events.push({ id: e.id, ...(e.data || {}) });
  for (const v of vehicles.rows) byCollection.vehicles.push({ id: v.id, ...(v.data || {}) });
  for (const p of projects.rows) byCollection.projects.push({ id: p.id, ...(p.data || {}) });
  for (const it of items.rows) {
    (byCollection[it.collection] ||= []).push({ id: it.id, ...(it.data || {}) });
  }

  res.json({
    sessions: sessions.rows.map((r) => r.name),
    activeSession: sessions.rows.find((r) => r.is_active)?.name || sessions.rows[0]?.name || null,
    members: membersBySession,
    ...byCollection,
    infoMd: info.rows[0]?.value || "",
  });
});

export default r;