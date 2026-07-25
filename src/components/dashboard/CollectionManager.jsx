import { useState } from "react";
import { Field, FormCard, ListSection, ListRow } from "./ui";
import { getCollection, addItem, updateItem, deleteItem } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

/**
 * Generic CRUD manager for a collection.
 * config: { name, label, titleKey, subtitleKey, imageKey, fields: [{key,label,textarea,type}] }
 */
export default function CollectionManager({ config }) {
  const { user } = useAuth();
  const db = useStore(); // subscribe to re-render on data changes
  const items = db[config.name] || [];

  const emptyForm = () =>
    config.fields.reduce(
      (acc, f) => ({ ...acc, [f.key]: f.type === "files" ? [] : "" }),
      {}
    );

  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const startEdit = (item) => {
    const next = {};
    config.fields.forEach((f) => {
      if (f.type === "files") {
        next[f.key] = Array.isArray(item[f.key]) ? item[f.key] : [];
      } else {
        next[f.key] = item[f.key] || "";
      }
    });
    setForm(next);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const [saveError, setSaveError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaveError("");
    try {
      if (editingId) await updateItem(config.name, editingId, form, user);
      else await addItem(config.name, form, user);
      reset();
    } catch (err) {
      setSaveError(
        err.status === 413
          ? "One of these images is too large to upload. Try smaller images (under ~7MB total)."
          : err.message || "Save failed. Please try again.",
      );
    }
  };

  const remove = (id) => {
    if (window.confirm(`Delete this ${config.label.toLowerCase()}?`)) {
      deleteItem(config.name, id, user);
      if (editingId === id) reset();
    }
  };

  return (
    <div>
      {saveError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl p-3">
          {saveError}
        </div>
      )}

      <FormCard title={config.label} onSubmit={submit} editing={!!editingId} onCancel={reset}>
        {config.fields.map((f) => (
          <div key={f.key} className={f.textarea || f.type === "files" ? "sm:col-span-2" : ""}>
            <Field
              label={f.label}
              type={f.type}
              textarea={f.textarea}
              value={form[f.key]}
              onChange={set(f.key)}
              required={f.required}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </FormCard>

      <ListSection title={`Existing ${config.label}s`} count={items.length}>
        {items.length === 0 && (
          <p className="text-sm text-zinc-600 font-light italic py-4">
            No {config.label.toLowerCase()}s yet.
          </p>
        )}
        {items.map((item) => (
          <ListRow
            key={item.id}
            image={config.imageKey ? item[config.imageKey] : null}
            title={item[config.titleKey] || "Untitled"}
            subtitle={config.subtitleKey ? item[config.subtitleKey] : null}
            onEdit={() => startEdit(item)}
            onDelete={() => remove(item.id)}
          />
        ))}
      </ListSection>
    </div>
  );
}
