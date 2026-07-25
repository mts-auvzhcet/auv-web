import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

r.use(requireAuth, requireRole("developer"));

r.get("/", async (_req, res) => {
  const { rows } = await q(
    "SELECT id, username, role, status, created_at FROM users ORDER BY created_at DESC",
  );
  res.json({ users: rows });
});

r.get("/pending", async (_req, res) => {
  const { rows } = await q(
    "SELECT id, username, role, status, created_at FROM users WHERE status='pending' ORDER BY created_at DESC",
  );
  res.json({ users: rows });
});

r.patch("/:id/status", async (req, res) => {
  const { status } = req.body || {};
  if (!["active", "rejected"].includes(status))
    return res.status(400).json({ ok: false, error: "Invalid status" });
  const { rows } = await q(
    "UPDATE users SET status=$1 WHERE id=$2 RETURNING id, username, role, status",
    [status, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ ok: false });
  const user = rows[0];
  const verb = status === "active" ? "Approved" : "Rejected";
  const roleLabel = user.role === "admin" ? "Admin" : "Developer";
  await log(req.user, `${roleLabel} ${verb}`, user.username);
  res.json({ ok: true, user });
});

export default r;
