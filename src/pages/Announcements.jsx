import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, ChevronLeft, Pin, Calendar, User } from "lucide-react";
import { getCollection } from "../lib/store";
import { useStore } from "../lib/useStore";

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function Announcements() {
  useStore();
  const announcements = getCollection("announcements");
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0c4a6e] to-[#020617] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {selected ? (
            // ---- Full-page detail view ----
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-xs font-space font-bold uppercase tracking-wider mb-6"
              >
                <ChevronLeft size={16} /> All Announcements
              </button>

              <article className="bg-zinc-950/60 border border-zinc-800/70 rounded-2xl p-8 shadow-xl backdrop-blur-md">
                {selected.pinned && (
                  <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/10 border border-amber-500/30 text-[10px] font-space font-bold uppercase tracking-wider px-2 py-1 rounded mb-4">
                    <Pin size={11} /> Pinned
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-black font-outfit text-white uppercase tracking-tight text-balance">
                  {selected.title}
                </h1>
                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-light">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {selected.author || "Team"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {fmtDate(selected.createdAt)}
                  </span>
                </div>
                <div className="h-px bg-zinc-800 my-6" />
                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed whitespace-pre-wrap text-pretty">
                  {selected.body}
                </p>
              </article>
            </motion.div>
          ) : (
            // ---- List view ----
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <Megaphone className="text-sky-400" size={22} />
                </div>
                <div>
                  <span className="text-sky-400 font-space text-xs font-semibold tracking-wider uppercase block">
                    Club Updates
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black font-outfit text-white uppercase tracking-tight">
                    Announcements
                  </h1>
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-light mb-8">
                Tap any announcement to read the full update.
              </p>

              {announcements.length === 0 ? (
                <p className="text-zinc-500 font-light italic">No announcements yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {announcements.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="group text-left bg-zinc-950/50 hover:bg-zinc-900/60 border border-zinc-800/70 hover:border-sky-500/40 rounded-2xl p-6 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold font-outfit text-white group-hover:text-sky-300 transition-colors text-balance">
                          {a.title}
                        </h2>
                        {a.pinned && (
                          <Pin size={14} className="text-amber-400 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 font-light mt-2 line-clamp-2 leading-relaxed">
                        {a.body}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-[11px] text-zinc-600 font-light">
                        <span className="flex items-center gap-1">
                          <User size={11} /> {a.author || "Team"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {fmtDate(a.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
