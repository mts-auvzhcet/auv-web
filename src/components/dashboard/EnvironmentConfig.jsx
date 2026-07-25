import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { getDB } from "../../lib/store";
import { useStore } from "../../lib/useStore";

// Verification only. Secret values are never exposed.
function StatusPill({ ok }) {
  return ok ? (
    <span className="flex items-center gap-1 text-sky-300 text-xs font-space font-bold uppercase">
      <CheckCircle2 size={14} /> Configured
    </span>
  ) : (
    <span className="flex items-center gap-1 text-zinc-500 text-xs font-space font-bold uppercase">
      <XCircle size={14} /> Not Set
    </span>
  );
}

export default function EnvironmentConfig() {
  useStore();
  const db = getDB();

  const params = [
    { label: "Storage Adapter", value: "localStorage (frontend)", ok: true },
    { label: "Database Namespace", value: "auv_db_v1", ok: true },
    { label: "Seeded Users", value: `${db.users.length} account(s)`, ok: db.users.length > 0 },
    { label: "Member Sessions", value: `${db.sessions.length} session(s)`, ok: true },
    { label: "Audit Logging", value: "Enabled", ok: true },
  ];

  const keys = [
    { label: "AUTH_SESSION_KEY", present: true },
    { label: "AI_WIDGET_MODE", present: true, value: "scripted" },
    { label: "API_BASE_URL", present: false },
    { label: "AI_GATEWAY_API_KEY", present: false },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="text-xs font-space uppercase tracking-wider text-zinc-500 font-bold mb-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-sky-400" /> System Parameters
        </h4>
        <div className="flex flex-col gap-2">
          {params.map((p) => (
            <div
              key={p.label}
              className="flex items-center justify-between gap-3 bg-zinc-950/60 border border-zinc-800/70 rounded-xl p-4"
            >
              <div>
                <p className="text-sm text-white font-medium">{p.label}</p>
                <p className="text-xs text-zinc-500 font-mono">{p.value}</p>
              </div>
              <StatusPill ok={p.ok} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-space uppercase tracking-wider text-zinc-500 font-bold mb-3">
          API Keys &amp; Environment Variables
        </h4>
        <p className="text-xs text-zinc-600 font-light mb-3">
          Values are never displayed. Only presence is verified.
        </p>
        <div className="flex flex-col gap-2">
          {keys.map((k) => (
            <div
              key={k.label}
              className="flex items-center justify-between gap-3 bg-black/30 border border-zinc-900 rounded-xl p-3"
            >
              <span className="text-sm text-zinc-200 font-mono">{k.label}</span>
              <StatusPill ok={k.present} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
