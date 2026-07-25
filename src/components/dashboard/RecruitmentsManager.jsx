import { useState } from "react";
import { Trash2, ChevronDown, ChevronRight, Mail, Phone, ExternalLink } from "lucide-react";
import { getCollection, deleteItem } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

const QUESTIONS = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "department", label: "Department" },
  { key: "year", label: "Year of Study" },
  { key: "domain", label: "Preferred Domain" },
  { key: "experience", label: "Prior Experience" },
  { key: "portfolio", label: "Portfolio / GitHub" },
  { key: "resumeLink", label: "Resume Link" },
  { key: "sop", label: "Statement of Purpose" },
];

function fmt(dt) {
  if (!dt) return "-";
  try { return new Date(dt).toLocaleString(); } catch { return dt; }
}

export default function RecruitmentsManager() {
  const { user } = useAuth();
  useStore();
  const items = getCollection("recruitments");
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");

  const domains = ["All", "Software", "Mechanical", "Electrical", "Management"];
  const filtered = filter === "All" ? items : items.filter((r) => r.domain === filter);

  const remove = (id) => {
    if (window.confirm("Delete this recruitment submission?")) {
      deleteItem("recruitments", id, user);
      if (openId === id) setOpenId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-lg font-bold font-outfit text-white">Recruitment Submissions</h2>
          <p className="text-xs text-zinc-500 font-light">All applicants who submitted the recruitment form.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-space font-bold border transition-colors ${
                filter === d
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                  : "bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-900 bg-black/40 p-8 text-center">
          <p className="text-sm text-zinc-500 font-light italic">
            No recruitment submissions yet. Once applicants fill the Recruitment form, they will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-black/40">
          <table className="w-full text-xs font-apple">
            <thead className="bg-zinc-950/70 text-zinc-500 uppercase tracking-wider text-[10px] font-space">
              <tr>
                <th className="text-left px-3 py-3 w-6"></th>
                <th className="text-left px-3 py-3">Name</th>
                <th className="text-left px-3 py-3">Domain</th>
                <th className="text-left px-3 py-3">Dept / Year</th>
                <th className="text-left px-3 py-3">Contact</th>
                <th className="text-left px-3 py-3">Submitted</th>
                <th className="text-right px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const open = openId === r.id;
                return (
                  <>
                    <tr key={r.id} className="border-t border-zinc-900 hover:bg-zinc-950/60">
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setOpenId(open ? null : r.id)}
                          className="text-zinc-500 hover:text-sky-400"
                          aria-label="Toggle details"
                        >
                          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-zinc-200 font-semibold">{r.name || "—"}</td>
                      <td className="px-3 py-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                          {r.domain || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-zinc-400">
                        {r.department || "—"}
                        <span className="text-zinc-600"> · {r.year || "—"}</span>
                      </td>
                      <td className="px-3 py-3 text-zinc-400">
                        <div className="flex items-center gap-1.5"><Mail size={11} className="text-zinc-600" />{r.email || "—"}</div>
                        {r.phone && <div className="flex items-center gap-1.5 mt-0.5"><Phone size={11} className="text-zinc-600" />{r.phone}</div>}
                      </td>
                      <td className="px-3 py-3 text-zinc-500">{fmt(r.submittedAt || r.createdAt)}</td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => remove(r.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-zinc-950/40 border-t border-zinc-900">
                        <td></td>
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {QUESTIONS.map((q) => {
                              const val = r[q.key];
                              const isLink = (q.key === "portfolio" || q.key === "resumeLink") && val;
                              return (
                                <div key={q.key} className={q.key === "sop" ? "md:col-span-2" : ""}>
                                  <div className="text-[10px] font-space font-bold uppercase tracking-wider text-zinc-500 mb-0.5">
                                    {q.label}
                                  </div>
                                  {isLink ? (
                                    <a
                                      href={val}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 text-xs break-all"
                                    >
                                      {val} <ExternalLink size={10} />
                                    </a>
                                  ) : (
                                    <div className="text-xs text-zinc-300 font-light whitespace-pre-wrap break-words">
                                      {val || <span className="text-zinc-600 italic">— not provided —</span>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
