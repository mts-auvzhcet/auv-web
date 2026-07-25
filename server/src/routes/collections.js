import { Router } from "express";
import { q, uid } from "../db.js";
import { requireAuth, requireRole } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

const LABELS = {
  events: "Event",
  projects: "Project",
  vehicles: "Vehicle",
  announcements: "Announcement",
  recruitments: "Recruitment",
  advisory: "Advisory Board Member",
  forms: "Form",
};

const isValid = (name) => Object.prototype.hasOwnProperty.call(LABELS, name);

function flatten(row) {
  return { id: row.id, ...(row.data || {}), createdAt: row.created_at };
}

r.get("/:name", async (req, res, next) => {
  if (!isValid(req.params.name)) return res.status(404).json({ error: "Unknown collection" });
  if (req.params.name === "recruitments") {
    // Recruitment applications contain private applicant info — require
    // admin/developer login to view the list.
    return requireAuth(req, res, () =>
      requireRole("admin", "developer")(req, res, () => handleGet(req, res)),
    );
  }
  return handleGet(req, res);
});

async function handleGet(req, res) {
  const { rows } = await q(
    "SELECT id, data, created_at FROM items WHERE collection=$1 ORDER BY created_at ASC",
    [req.params.name],
  );
  res.json({ items: rows.map(flatten) });
}

// Public submission endpoint for recruitments — no auth required so
// unauthenticated visitors can apply. GET on /collections/recruitments
// still requires being an admin/developer through the frontend UI; the
// listing endpoint above is intentionally public because other pages
// (events/projects/vehicles/announcements) need it, and recruitment
// applications don't contain secret data — but if you want to lock the
// GET down, split it the same way as this POST.
r.post("/recruitments", async (req, res) => {
  const id = uid("rec");
  const data = { ...(req.body || {}) };
  delete data.id;
  data.submittedAt = new Date().toISOString();
  await q("INSERT INTO items (id, collection, data) VALUES ($1,$2,$3)", [
    id,
    "recruitments",
    data,
  ]);
  await log(
    { username: data.name || "applicant", role: "applicant" },
    "Recruitment Submitted",
    data.name || id,
  );
  res.json({ item: { id, ...data } });
});

r.post("/:name", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const name = req.params.name;
  if (!isValid(name)) return res.status(404).json({ error: "Unknown collection" });
  if (name === "recruitments") return res.status(404).json({ error: "Use /collections/recruitments" });
  const id = uid(name.slice(0, 3));
  const data = { ...(req.body || {}) };
  delete data.id;
  if (name === "announcements") {
    data.author = req.user.username;
    data.createdAt = new Date().toISOString();
  }
  await q("INSERT INTO items (id, collection, data) VALUES ($1,$2,$3)", [id, name, data]);
  await log(req.user, `${LABELS[name]} Added`, data.title || data.name || id);
  res.json({ item: { id, ...data } });
});

r.patch("/:name/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name, id } = req.params;
  if (!isValid(name)) return res.status(404).json({ error: "Unknown collection" });
  const { rows } = await q("SELECT data FROM items WHERE id=$1 AND collection=$2", [id, name]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  const patch = { ...(req.body || {}) };
  delete patch.id;
  const merged = { ...rows[0].data, ...patch };
  await q("UPDATE items SET data=$1 WHERE id=$2", [merged, id]);
  await log(req.user, `${LABELS[name]} Edited`, merged.title || merged.name || id);
  res.json({ item: { id, ...merged } });
});

r.delete("/:name/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name, id } = req.params;
  if (!isValid(name)) return res.status(404).json({ error: "Unknown collection" });
  const { rows } = await q(
    "DELETE FROM items WHERE id=$1 AND collection=$2 RETURNING data",
    [id, name],
  );
  const removed = rows[0]?.data;
  await log(req.user, `${LABELS[name]} Deleted`, removed?.title || removed?.name || id);
  res.json({ ok: true });
});

export default r;
