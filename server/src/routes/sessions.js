import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

r.get("/", async (_req, res) => {
  const { rows } = await q(
    "SELECT name, is_active FROM member_sessions ORDER BY sort_order DESC, name DESC",
  );
  const active = rows.find((r) => r.is_active)?.name || rows[0]?.name || null;
  res.json({ sessions: rows.map((r) => r.name), active });
});

r.post("/", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ ok: false, error: "Missing name" });
  const exists = await q("SELECT 1 FROM member_sessions WHERE name=$1", [name]);
  if (exists.rowCount) return res.status(409).json({ ok: false, error: "Session already exists." });
  await q("UPDATE member_sessions SET is_active=FALSE");
  await q(
    `INSERT INTO member_sessions (name, is_active, sort_order)
     VALUES ($1, TRUE, COALESCE((SELECT MAX(sort_order) FROM member_sessions),0) + 1)`,
    [name],
  );
  await log(req.user, "Session Created", name);
  res.json({ ok: true });
});

r.patch("/active", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ ok: false });
  await q("UPDATE member_sessions SET is_active = (name = $1)", [name]);
  res.json({ ok: true, active: name });
});

export default r;
