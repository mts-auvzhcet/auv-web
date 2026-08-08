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
  faculty: "Faculty",
  workshops: "Workshop",
  forms: "Form",
};

const isValid = (name) => Object.prototype.hasOwnProperty.call(LABELS, name);

// Collections listed here have their OWN dedicated table (same idea as
// the separate `members` table) instead of living inside the shared
// `items` table. Everything else (announcements, recruitments, advisory,
// forms) still uses the shared `items` table exactly as before.
const DEDICATED_TABLES = {
  events: "events",
  vehicles: "vehicles",
  projects: "projects",
};

function flatten(row) {
  return { id: row.id, ...(row.data || {}), createdAt: row.created_at };
}

async function fetchList(name) {
  const table = DEDICATED_TABLES[name];
  if (table) {
    const { rows } = await q(`SELECT id, data, created_at FROM ${table} ORDER BY created_at ASC`);
    return rows;
  }
  const { rows } = await q(
    "SELECT id, data, created_at FROM items WHERE collection=$1 ORDER BY created_at ASC",
    [name],
  );
  return rows;
}

async function insertRow(name, id, data) {
  const table = DEDICATED_TABLES[name];
  if (table) {
    await q(`INSERT INTO ${table} (id, data) VALUES ($1,$2)`, [id, data]);
  } else {
    await q("INSERT INTO items (id, collection, data) VALUES ($1,$2,$3)", [id, name, data]);
  }
}

async function fetchRow(name, id) {
  const table = DEDICATED_TABLES[name];
  if (table) {
    const { rows } = await q(`SELECT data FROM ${table} WHERE id=$1`, [id]);
    return rows[0];
  }
  const { rows } = await q("SELECT data FROM items WHERE id=$1 AND collection=$2", [id, name]);
  return rows[0];
}

async function updateRow(name, id, merged) {
  const table = DEDICATED_TABLES[name];
  if (table) {
    await q(`UPDATE ${table} SET data=$1 WHERE id=$2`, [merged, id]);
  } else {
    await q("UPDATE items SET data=$1 WHERE id=$2", [merged, id]);
  }
}

async function deleteRow(name, id) {
  const table = DEDICATED_TABLES[name];
  if (table) {
    const { rows } = await q(`DELETE FROM ${table} WHERE id=$1 RETURNING data`, [id]);
    return rows[0]?.data;
  }
  const { rows } = await q(
    "DELETE FROM items WHERE id=$1 AND collection=$2 RETURNING data",
    [id, name],
  );
  return rows[0]?.data;
}

r.get("/:name", async (req, res, next) => {
  if (!isValid(req.params.name)) return res.status(404).json({ error: "Unknown collection" });
  if (req.params.name === "recruitments") {
    return requireAuth(req, res, () =>
      requireRole("admin", "developer")(req, res, () => handleGet(req, res)),
    );
  }
  return handleGet(req, res);
});

async function handleGet(req, res) {
  const rows = await fetchList(req.params.name);
  res.json({ items: rows.map(flatten) });
}

r.post("/recruitments", async (req, res) => {
  const id = uid("rec");
  const data = { ...(req.body || {}) };
  delete data.id;
  data.submittedAt = new Date().toISOString();
  await insertRow("recruitments", id, data);
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
  await insertRow(name, id, data);
  await log(req.user, `${LABELS[name]} Added`, data.title || data.name || id);
  res.json({ item: { id, ...data } });
});

r.patch("/:name/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name, id } = req.params;
  if (!isValid(name)) return res.status(404).json({ error: "Unknown collection" });
  const row = await fetchRow(name, id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const patch = { ...(req.body || {}) };
  delete patch.id;
  const merged = { ...row.data, ...patch };
  await updateRow(name, id, merged);
  await log(req.user, `${LABELS[name]} Edited`, merged.title || merged.name || id);
  res.json({ item: { id, ...merged } });
});

r.delete("/:name/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  const { name, id } = req.params;
  if (!isValid(name)) return res.status(404).json({ error: "Unknown collection" });
  const removed = await deleteRow(name, id);
  await log(req.user, `${LABELS[name]} Deleted`, removed?.title || removed?.name || id);
  res.json({ ok: true });
});

export default r;