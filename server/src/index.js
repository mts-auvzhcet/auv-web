import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import users from "./routes/users.js";
import collections from "./routes/collections.js";
import members from "./routes/members.js";
import sessions from "./routes/sessions.js";
import info from "./routes/info.js";
import audit from "./routes/audit.js";
import snapshot from "./routes/snapshot.js";

const app = express();

// Needed so express-rate-limit sees the real client IP behind Render's
// reverse proxy instead of rate-limiting the proxy itself.
app.set("trust proxy", 1);

app.use(helmet());

const origins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: origins.includes("*") ? true : origins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

// Login/register are the most sensitive endpoints — cap attempts so they
// can't be brute-forced. 20 requests per 15 minutes per IP is generous for
// a real user, restrictive for an automated attack.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

// A lighter, general limit on everything else so no single client can
// hammer the API and degrade it for everyone.
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use("/auth", authLimiter, authRoutes);
app.use(generalLimiter);
app.use("/users", users);
app.use("/collections", collections);
app.use("/members", members);
app.use("/sessions", sessions);
app.use("/info", info);
app.use("/audit", audit);
app.use("/db", snapshot);

app.use((err, _req, res, _next) => {
  // Full detail always goes to the server log for debugging, but the
  // client only ever gets a generic message — never raw error internals,
  // stack traces, or DB error text that could reveal schema/query shape.
  console.error("[server] error", err);
  res.status(err.status || 500).json({ error: "Something went wrong. Please try again." });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
