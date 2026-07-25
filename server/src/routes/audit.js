import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";

const r = Router();

r.get("/", requireAuth, requireRole("developer"), async (_req, res) => {
  const { rows } = await q(
    "SELECT id, username, role, action, target, created_at FROM audit_log ORDER BY created_at DESC LIMIT 500",
  );
  res.json({
    audit: rows.map((r) => ({
      id: r.id,
      user: r.username,
      role: r.role,
      action: r.action,
      target: r.target,
      timestamp: r.created_at,
    })),
  });
});

export default r;
