import { Router } from "express";
import bcrypt from "bcryptjs";
import { q, uid } from "../db.js";
import { signToken, requireAuth } from "../auth.js";
import { log } from "../audit.js";

const r = Router();

r.post("/register", async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password || !role)
    return res.status(400).json({ ok: false, error: "Missing fields" });
  if (!["admin", "developer"].includes(role))
    return res.status(400).json({ ok: false, error: "Invalid role" });

  const existing = await q("SELECT id FROM users WHERE LOWER(username)=LOWER($1)", [username]);
  if (existing.rowCount)
    return res.status(409).json({ ok: false, error: "Username already taken." });

  const hash = await bcrypt.hash(password, 10);
  const id = uid("usr");
  await q(
    `INSERT INTO users (id, username, password, role, status) VALUES ($1,$2,$3,$4,'pending')`,
    [id, username, hash, role],
  );
  await log({ username, role }, "Account Requested", `${role} account`);
  res.json({ ok: true, user: { id, username, role, status: "pending" } });
});

r.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ ok: false, error: "Missing credentials" });

  const { rows } = await q("SELECT * FROM users WHERE LOWER(username)=LOWER($1)", [username]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ ok: false, error: "Invalid username or password." });

  if (user.status === "pending")
    return res.status(403).json({
      ok: false,
      error:
        user.role === "admin"
          ? "Your admin registration is pending approval by an active developer."
          : "Your developer registration is pending approval by an active developer.",
    });
  if (user.status === "rejected")
    return res.status(403).json({ ok: false, error: "This account request has been rejected." });

  const safe = { id: user.id, username: user.username, role: user.role, status: user.status };
  const token = signToken(safe);
  await log(safe, "Logged In", safe.role);
  res.json({ ok: true, user: safe, token });
});

r.get("/me", requireAuth, async (req, res) => {
  const { rows } = await q("SELECT id, username, role, status FROM users WHERE id=$1", [
    req.user.sub,
  ]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ user: rows[0] });
});

r.post("/logout", requireAuth, async (req, res) => {
  await log(req.user, "Logged Out", req.user.role);
  res.json({ ok: true });
});

export default r;
