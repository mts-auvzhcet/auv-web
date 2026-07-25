import { useState } from "react";
import { Plus } from "lucide-react";
import { Field, FormCard, ListSection, ListRow, empty } from "./ui";
import {
  getSessions,
  getActiveSession,
  setActiveSession,
  createSession,
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

const FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "designation", label: "Designation" },
  { key: "branch", label: "Branch/Team" },
  { key: "email", label: "Email", type: "email" },
  { key: "oneLiner", label: "One-liner", textarea: true },
  { key: "imageBase64", label: "Image Upload", type: "file" },
];
const KEYS = FIELDS.map((f) => f.key);

export default function MembersManager() {
  const { user } = useAuth();
  const db = useStore();
  const sessions = db.sessions || [];
  const active = db.activeSession;
  const members = db.members[active] || [];

  const [form, setForm] = useState(empty(KEYS));
  const [editingId, setEditingId] = useState(null);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const reset = () => {
    setForm(empty(KEYS));
    setEditingId(null);
  };

  const startEdit = (m) => {
    const next = {};
    KEYS.forEach((k) => (next[k] = m[k] || ""));
    setForm(next);
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [saveError, setSaveError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaveError("");
    try {
      if (editingId) await updateMember(active, editingId, form, user);
      else await addMember(active, form, user);
      reset();
    } catch (err) {
      setSaveError(
        err.status === 413
          ? "That photo is too large to upload. Try a smaller image (under ~7MB)."
          : err.message || "Save failed. Please try again.",
      );
    }
  };

  const remove = (id) => {
    if (window.confirm("Delete this member?")) {
      deleteMember(active, id, user);
      if (editingId === id) reset();
    }
  };

  const newSession = async () => {
    const name = window.prompt("New session name (e.g. 26-27):");
    if (!name) return;
    const res = await createSession(name.trim(), user);
    if (!res.ok) window.alert(res.error);
    else reset();
  };

  return (
    <div>
      {/* Session selector + New Session button */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-space uppercase tracking-wider text-zinc-500 font-bold">
            Session
          </span>
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSession(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-space font-bold border transition-colors ${
                s === active
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                  : "bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={newSession}
          className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-space font-bold uppercase tracking-wider text-xs py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={14} /> New Session
        </button>
      </div>
       
       {saveError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl p-3">
          {saveError}
        </div>
      )}

      <FormCard
        title={`Member (${active})`}
        onSubmit={submit}
        editing={!!editingId}
        onCancel={reset}
      >
        {FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
            <Field
              label={f.label}
              type={f.type}
              textarea={f.textarea}
              value={form[f.key]}
              onChange={set(f.key)}
              required={f.required}
            />
          </div>
        ))}
      </FormCard>

      <ListSection title={`Members in ${active}`} count={members.length}>
        {members.length === 0 && (
          <p className="text-sm text-zinc-600 font-light italic py-4">
            No members in this session yet.
          </p>
        )}
        {members.map((m) => (
          <ListRow
            key={m.id}
            image={m.imageBase64 || m.imageUrl}
            title={m.name}
            subtitle={m.designation || m.branch}
            onEdit={() => startEdit(m)}
            onDelete={() => remove(m.id)}
          />
        ))}
      </ListSection>
    </div>
  );
}
