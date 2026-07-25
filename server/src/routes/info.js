import { Router } from "express";
import { q } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

r.get("/", async (_req, res) => {
  const { rows } = await q("SELECT value FROM settings WHERE key='info_md'");
  res.json({ infoMd: rows[0]?.value || "" });
});

r.put("/", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const md = String(req.body?.infoMd ?? "");
  await q(
    `INSERT INTO settings (key, value) VALUES ('info_md', $1)
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
    [md],
  );
  await log(req.user, "Markdown Updated", "info.md");
  res.json({ ok: true });
});

export default r;
