import { useState } from "react";
import { Search, Clock } from "lucide-react";
import { getAudit } from "../../lib/store";
import { useStore } from "../../lib/useStore";

function timeAgo(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function TimelineHistory() {
  useStore();
  const [q, setQ] = useState("");
  const audit = getAudit();

  const filtered = audit.filter((e) => {
    const hay = `${e.user} ${e.role} ${e.action} ${e.target}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 rounded-lg px-3 mb-5 focus-within:border-sky-500/60 transition-colors">
        <Search size={16} className="text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search audit log by user, action, or entity..."
          className="flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </div>

      <div className="relative border-l border-zinc-800 ml-2 pl-6 flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-600 font-light italic">No matching log entries.</p>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-[#0c1a2e]" />
            <div className="bg-zinc-950/60 border border-zinc-800/70 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-bold text-white font-space">{e.action}</span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-light">
                  <Clock size={11} /> {timeAgo(e.timestamp)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light mt-1">
                <span className="text-sky-400 font-medium">{e.user}</span>{" "}
                <span className="uppercase text-zinc-600">({e.role})</span> &rarr;{" "}
                <span className="text-zinc-300">{e.target}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
