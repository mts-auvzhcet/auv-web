import { Router } from "express";
import { q } from "../db.js";
import { optionalAuth } from "../auth.js";

const r = Router();

/**
 * Full DB snapshot for frontend hydration. Public-safe fields only.
 * Auth-gated data (users list, audit) is fetched separately by developers.
 */
r.get("/", optionalAuth, async (_req, res) => {
  const [sessions, members, items, info] = await Promise.all([
    q("SELECT name, is_active, sort_order FROM member_sessions ORDER BY sort_order DESC"),
    q("SELECT id, session_name, data FROM members ORDER BY created_at ASC"),
    q("SELECT id, collection, data, created_at FROM items ORDER BY created_at ASC"),
    q("SELECT value FROM settings WHERE key='info_md'"),
  ]);

  const membersBySession = {};
  for (const s of sessions.rows) membersBySession[s.name] = [];
  for (const m of members.rows) {
    (membersBySession[m.session_name] ||= []).push({ id: m.id, ...(m.data || {}) });
  }

  const byCollection = { events: [], projects: [], vehicles: [], announcements: [], recruitments: [], advisory: [], forms: [] };
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
