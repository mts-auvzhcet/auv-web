import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { q, uid } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  console.log("[migrate] applying schema...");
  await q(sql);

  if (process.env.SEED_ON_MIGRATE !== "false") {
    const { rows } = await q("SELECT COUNT(*)::int AS n FROM users");
    if (rows[0].n === 0) {
      const user = process.env.BOOTSTRAP_DEV_USER || "developer";
      const pass = process.env.BOOTSTRAP_DEV_PASS || "devpass";
      const hash = await bcrypt.hash(pass, 10);
      await q(
        `INSERT INTO users (id, username, password, role, status)
         VALUES ($1, $2, $3, 'developer', 'active')`,
        [uid("usr"), user, hash],
      );
      console.log(`[migrate] seeded developer account "${user}" / "${pass}"`);
    }

    const { rows: srows } = await q("SELECT COUNT(*)::int AS n FROM member_sessions");
    if (srows[0].n === 0) {
      await q(`INSERT INTO member_sessions (name, is_active, sort_order) VALUES
        ('2026-27', TRUE, 3), ('2025-26', FALSE, 2), ('Alumni', FALSE, 1)`);
      console.log("[migrate] seeded member sessions");
    }

    const { rows: irows } = await q("SELECT COUNT(*)::int AS n FROM settings WHERE key='info_md'");
    if (irows[0].n === 0) {
      await q(`INSERT INTO settings (key, value) VALUES
        ('info_md', $1)`, [
          "# Club Info\n\nMTS AUV-ZHCET is a student research club under the Marine Technology Society.\n",
        ]);
    }
  }

  console.log("[migrate] done");
  process.exit(0);
}

main().catch((e) => {
  console.error("[migrate] failed", e);
  process.exit(1);
});
