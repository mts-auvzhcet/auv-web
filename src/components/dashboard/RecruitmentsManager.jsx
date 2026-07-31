import { useState } from "react";
import { Trash2, ChevronDown, ChevronRight, Mail, Phone, ExternalLink, Download } from "lucide-react";
import { getCollection, deleteItem } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

const QUESTIONS = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Mobile Number" },
  { key: "department", label: "Department" },
  { key: "year", label: "Year of Study" },
  { key: "cv", label: "CV Link (Google Drive)" },
  { key: "whyJoin", label: "Why join the club" },
  { key: "additionalComments", label: "Additional Comments" },
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

  const filtered = items;

  const remove = (id) => {
    if (window.confirm("Delete this recruitment submission?")) {
      deleteItem("recruitments", id, user);
      if (openId === id) setOpenId(null);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return alert("No submissions to export.");

    const headers = [
      "Submitted At",
      "Full Name",
      "Email",
      "Mobile Number",
      "Department",
      "Year of Study",
      "Why Join",
      "Additional Comments",
      "CV Document"
    ];
    const rows = filtered.map(s => [
      fmt(s.submittedAt || s.createdAt),
      s.name || "",
      s.email || "",
      s.phone || "",
      s.department || "",
      s.year || "",
      s.whyJoin || "",
      s.additionalComments || "",
      s.cv || ""
    ]);

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`))
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Recruitment_Submissions_responses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-lg font-bold font-outfit text-white">Recruitment Submissions</h2>
          <p className="text-xs text-zinc-500 font-light">All applicants who submitted the recruitment form.</p>
        </div>
        <div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold font-space uppercase tracking-wider hover:bg-sky-500/20 transition-all cursor-pointer shadow-lg shadow-sky-500/5"
          >
            <Download size={14} /> Export CSV
          </button>
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
                  <tr key={r.id} className="border-t border-zinc-900 hover:bg-zinc-950/60 last:border-b-0">
                    <td colSpan={6} className="p-0">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="hover:bg-zinc-950/20">
                            <td className="px-3 py-3 w-6 text-center">
                              <button
                                onClick={() => setOpenId(open ? null : r.id)}
                                className="text-zinc-500 hover:text-sky-400 cursor-pointer"
                                aria-label="Toggle details"
                              >
                                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            </td>
                            <td className="px-3 py-3 text-zinc-200 font-semibold">{r.name || "—"}</td>
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
                                className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer mr-3"
                                aria-label="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                          {open && (
                            <tr className="bg-zinc-950/40 border-t border-zinc-900">
                              <td className="w-6"></td>
                              <td colSpan={5} className="px-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                  {QUESTIONS.map((q) => {
                                    const val = r[q.key];
                                    const isCV = q.key === "cv" && val;
                                    return (
                                      <div key={q.key} className={q.key === "whyJoin" || q.key === "additionalComments" ? "md:col-span-2" : ""}>
                                        <div className="text-[10px] font-space font-bold uppercase tracking-wider text-zinc-550 mb-0.5">
                                          {q.label}
                                        </div>
                                        {isCV ? (
                                          <a
                                            href={val}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold font-space uppercase tracking-wider hover:bg-sky-500/20 transition-all inline-flex items-center gap-2 mt-1 cursor-pointer"
                                          >
                                            <ExternalLink size={12} /> Open CV Link
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
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
