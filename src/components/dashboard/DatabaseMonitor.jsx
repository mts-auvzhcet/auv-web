import { useState } from "react";
import { Database, RotateCcw } from "lucide-react";
import { getDB, resetDB } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

// Tables to expose. Passwords are redacted for the users table.
const TABLES = ["users", "members", "events", "projects", "vehicles", "announcements", "audit"];

function redact(name, db) {
  if (name === "users") {
    return db.users.map((u) => ({ ...u, password: "••••••" }));
  }
  return db[name];
}

export default function DatabaseMonitor() {
  const { user } = useAuth();
  useStore();
  const db = getDB();
  const [active, setActive] = useState("users");

  const rows = redact(active, db);
  const count = Array.isArray(rows)
    ? rows.length
    : Object.values(rows || {}).reduce((n, arr) => n + arr.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-zinc-300">
          <Database size={16} className="text-sky-400" />
          <span className="text-sm font-space uppercase tracking-wider font-bold">
            Raw Table Inspector
          </span>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Reset the entire database to seed data? This cannot be undone.")) {
              resetDB();
            }
          }}
          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-space font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-colors"
        >
          <RotateCcw size={13} /> Reset DB
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {TABLES.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              active === t
                ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                : "bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500 font-light mb-2">
        {count} record(s) in <span className="text-zinc-300 font-mono">{active}</span>
      </p>
      <pre className="bg-black/50 border border-zinc-800 rounded-xl p-4 text-[11px] leading-relaxed text-sky-200/80 font-mono overflow-auto max-h-[480px]">
        {JSON.stringify(rows, null, 2)}
      </pre>
    </div>
  );
}
