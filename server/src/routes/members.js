import { Router } from "express";
import { q, uid } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

const flatten = (row) => ({ id: row.id, ...(row.data || {}) });

r.get("/:session", async (req, res) => {
  const { rows } = await q(
    "SELECT id, data FROM members WHERE session_name=$1 ORDER BY created_at ASC",
    [req.params.session],
  );
  res.json({ members: rows.map(flatten) });
});

r.post("/:session", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const session = req.params.session;
  const exists = await q("SELECT 1 FROM member_sessions WHERE name=$1", [session]);
  if (!exists.rowCount) return res.status(404).json({ error: "Unknown session" });
  const id = uid("mem");
  const data = { ...(req.body || {}) };
  delete data.id;
  await q("INSERT INTO members (id, session_name, data) VALUES ($1,$2,$3)", [id, session, data]);
  await log(req.user, "Member Added", `${data.name || id} (${session})`);
  res.json({ member: { id, ...data } });
});

r.patch("/:session/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { session, id } = req.params;
  const { rows } = await q(
    "SELECT data FROM members WHERE id=$1 AND session_name=$2",
    [id, session],
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  const merged = { ...rows[0].data, ...(req.body || {}) };
  delete merged.id;
  await q("UPDATE members SET data=$1 WHERE id=$2", [merged, id]);
  await log(req.user, "Member Edited", `${merged.name || id} (${session})`);
  res.json({ member: { id, ...merged } });
});

r.delete("/:session/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { session, id } = req.params;
  const { rows } = await q(
    "DELETE FROM members WHERE id=$1 AND session_name=$2 RETURNING data",
    [id, session],
  );
  const removed = rows[0]?.data;
  await log(req.user, "Member Deleted", `${removed?.name || id} (${session})`);
  res.json({ ok: true });
});

export default r;
