import { q } from "./db.js";

export async function log(actor, action, target) {
  try {
    await q(
      `INSERT INTO audit_log (username, role, action, target) VALUES ($1,$2,$3,$4)`,
      [actor?.username || "system", actor?.role || "system", action, target || "-"],
    );
  } catch (e) {
    console.error("[audit] failed", e.message);
  }
}
