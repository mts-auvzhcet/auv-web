import { Check, X, UserCog, Inbox } from "lucide-react";
import { getPendingUsers, getAllUsers, setUserStatus } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

function StatusBadge({ status }) {
  const map = {
    active: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    rejected: "bg-red-500/15 text-red-300 border-red-500/40",
  };
  return (
    <span
      className={`text-[10px] font-space font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${map[status]}`}
    >
      {status}
    </span>
  );
}

export default function AccessManager() {
  const { user } = useAuth();
  useStore();
  const pending = getPendingUsers();
  const all = getAllUsers();

  const approve = (u) => setUserStatus(u.id, "active", user);
  const reject = (u) => setUserStatus(u.id, "rejected", user);

  const pendingDevs = pending.filter((u) => u.role === "developer");
  const pendingAdmins = pending.filter((u) => u.role === "admin");

  const Group = ({ label, list }) => (
    <div className="mb-6">
      <h4 className="text-xs font-space uppercase tracking-wider text-zinc-500 font-bold mb-3">
        Pending {label} <span className="text-sky-400">({list.length})</span>
      </h4>
      {list.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-zinc-600 font-light italic bg-black/20 border border-zinc-900 rounded-xl p-4">
          <Inbox size={16} /> No pending {label.toLowerCase()} requests.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-800/70 rounded-xl p-4"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
                <UserCog size={16} className="text-sky-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{u.username}</p>
                <p className="text-xs text-zinc-500 font-light uppercase">{u.role}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approve(u)}
                  className="flex items-center gap-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-space font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-colors"
                >
                  <Check size={13} /> Approve
                </button>
                <button
                  onClick={() => reject(u)}
                  className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-space font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-colors"
                >
                  <X size={13} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Group label="Developers" list={pendingDevs} />
      <Group label="Admins" list={pendingAdmins} />

      <h4 className="text-xs font-space uppercase tracking-wider text-zinc-500 font-bold mb-3 mt-8">
        All Accounts <span className="text-sky-400">({all.length})</span>
      </h4>
      <div className="flex flex-col gap-2">
        {all.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 bg-black/30 border border-zinc-900 rounded-xl p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {u.username}{" "}
                <span className="text-zinc-600 uppercase text-[11px]">({u.role})</span>
              </p>
            </div>
            <StatusBadge status={u.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
