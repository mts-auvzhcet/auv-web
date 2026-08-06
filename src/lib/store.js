/**
 * Cache-backed data store. Talks to the Express+Postgres backend at VITE_API_URL.
 *
 * Design:
 *  - Reads are SYNCHRONOUS from an in-memory cache (populated by hydrate()).
 *  - Writes are ASYNC (POST/PATCH/DELETE), then optimistically update the
 *    cache and emit so subscribers re-render.
 *  - Public function names/signatures match the previous localStorage
 *    implementation so most consumers don't need to change.
 *
 * If VITE_API_URL is not configured, the store falls back to a read-only
 * empty state and logs a warning. Configure the backend URL to activate.
 */
import { api, API_CONFIGURED, setToken, getToken } from "./api.js";

// ---------------------------------------------------------------------------
// Cache + pub-sub
// ---------------------------------------------------------------------------
const EMPTY_DB = {
  users: [],
  sessions: [],
  activeSession: null,
  members: {},
  events: [],
  projects: [],
  vehicles: [],
  announcements: [],
  recruitments: [],
  advisory: [],
  faculty: [],
  forms: [],
  audit: [],
  infoMd: "",
};

let cache = { ...EMPTY_DB };
let hydrated = false;

const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit() {
  // Swap the cache reference so useSyncExternalStore snapshot comparisons
  // (Object.is) detect the change and re-render subscribers.
  cache = { ...cache };
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.log("[store] listener error", e);
    }
  });
}

export function getDB() {
  return cache;
}

export function isHydrated() {
  return hydrated;
}

// ---------------------------------------------------------------------------
// Hydration — called once at app boot
// ---------------------------------------------------------------------------
export async function hydrate() {
  if (!API_CONFIGURED) {
    console.warn(
      "[store] VITE_API_URL is not set — running with empty in-memory data. " +
        "Configure the backend URL in .env to load real data.",
    );
    hydrated = true;
    emit();
    return;
  }
  try {
    const snap = await api.get("/db");
    cache = { ...EMPTY_DB, ...snap };
    // If logged in as developer, also hydrate users list + audit log.
    const token = getToken();
    if (token) {
      try {
        const me = await api.get("/auth/me");
        if (me?.user?.role === "developer") {
          const [u, a] = await Promise.all([api.get("/users"), api.get("/audit")]);
          cache.users = u.users || [];
          cache.audit = a.audit || [];
        }
        // recruitments (form submissions, can contain large base64 images
        // and applicant PII) are deliberately excluded from the public /db
        // snapshot — admins/developers pull them separately here,
        // authenticated, only when actually logged in. `forms` (the form
        // definitions/open-closed status) stay in the public snapshot since
        // the public Recruitment page needs them to render.
        if (me?.user?.role === "developer" || me?.user?.role === "admin") {
          const rec = await api.get("/collections/recruitments");
          cache.recruitments = rec.items || [];
        }
      } catch {
        // token invalid — ignore
      }
    }
    hydrated = true;
    emit();
  } catch (e) {
    console.error("[store] hydrate failed", e);
    hydrated = true;
    emit();
  }
}

export async function resetDB() {
  // Just re-fetch from server — schema-level reset must be done server-side.
  await hydrate();
  return cache;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function authenticate(username, password) {
  try {
    const res = await api.post("/auth/login", { username, password });
    setToken(res.token);
    // Re-hydrate audit + users if developer
    if (res.user?.role === "developer") {
      try {
        const [u, a] = await Promise.all([api.get("/users"), api.get("/audit")]);
        cache.users = u.users || [];
        cache.audit = a.audit || [];
        emit();
      } catch {}
    }
    return { ok: true, user: res.user };
  } catch (e) {
    return { ok: false, error: e.data?.error || e.message };
  }
}

export async function registerUser({ username, password, role }) {
  try {
    const res = await api.post("/auth/register", { username, password, role });
    return { ok: true, user: res.user };
  } catch (e) {
    return { ok: false, error: e.data?.error || e.message };
  }
}

export function findUser(username) {
  return cache.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function getAllUsers() {
  return cache.users;
}
export function getPendingUsers() {
  return cache.users.filter((u) => u.status === "pending");
}

export async function setUserStatus(userId, status /* , actor */) {
  try {
    await api.patch(`/users/${userId}/status`, { status });
    const u = cache.users.find((x) => x.id === userId);
    if (u) u.status = status;
    emit();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.data?.error || e.message };
  }
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------
export function getAudit() {
  return cache.audit;
}

/**
 * Kept for backwards-compat with existing UI code. Server auto-logs actions
 * for mutations that go through the API, so this is a no-op client-side.
 */
export function logAction(/* user, role, action, target */) {
  return;
}

// ---------------------------------------------------------------------------
// Generic collections
// ---------------------------------------------------------------------------
const COLLECTIONS = ["events", "projects", "vehicles", "announcements", "recruitments", "advisory", "faculty", "forms"];

export function getCollection(name) {
  return cache[name] || [];
}

export async function addItem(name, item /* , actor */) {
  if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection ${name}`);
  const res = await api.post(`/collections/${name}`, item);
  cache[name] = [res.item, ...(cache[name] || [])];
  emit();
  return res.item;
}

export async function updateItem(name, id, patch /* , actor */) {
  if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection ${name}`);
  const res = await api.patch(`/collections/${name}/${id}`, patch);
  cache[name] = (cache[name] || []).map((x) => (x.id === id ? res.item : x));
  emit();
  return res.item;
}

export async function deleteItem(name, id /* , actor */) {
  if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection ${name}`);
  await api.del(`/collections/${name}/${id}`);
  cache[name] = (cache[name] || []).filter((x) => x.id !== id);
  emit();
}

// ---------------------------------------------------------------------------
// Member sessions
// ---------------------------------------------------------------------------
export function getSessions() {
  return cache.sessions;
}
export function getActiveSession() {
  return cache.activeSession;
}

export async function setActiveSession(session) {
  await api.patch("/sessions/active", { name: session });
  cache.activeSession = session;
  emit();
}

export async function createSession(name /* , actor */) {
  try {
    await api.post("/sessions", { name });
    // After creating a session, the server makes it active.
    // We should refresh the session list from the server or update it correctly.
    if (!cache.sessions.includes(name)) {
      cache.sessions = [name, ...cache.sessions];
    }
    cache.members[name] = [];
    cache.activeSession = name;
    emit();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.data?.error || e.message };
  }
}

export function getMembers(session) {
  return cache.members[session] || [];
}

export async function addMember(session, member /* , actor */) {
  const res = await api.post(`/members/${encodeURIComponent(session)}`, member);
  cache.members[session] = [res.member, ...(cache.members[session] || [])];
  emit();
  return res.member;
}

export async function updateMember(session, id, patch /* , actor */) {
  const res = await api.patch(
    `/members/${encodeURIComponent(session)}/${id}`,
    patch,
  );
  cache.members[session] = (cache.members[session] || []).map((m) =>
    m.id === id ? res.member : m,
  );
  emit();
  return res.member;
}

export async function deleteMember(session, id /* , actor */) {
  await api.del(`/members/${encodeURIComponent(session)}/${id}`);
  cache.members[session] = (cache.members[session] || []).filter((m) => m.id !== id);
  emit();
}

// ---------------------------------------------------------------------------
// info.md
// ---------------------------------------------------------------------------
export function getInfoMd() {
  return cache.infoMd || "";
}

export async function setInfoMd(md /* , actor */) {
  await api.put("/info", { infoMd: md });
  cache.infoMd = md;
  emit();
}