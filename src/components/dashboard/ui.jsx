import { Pencil, Trash2 } from "lucide-react";

export function Field({ label, value, onChange, type = "text", textarea, placeholder, required }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      onChange("");
    }
  };

  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      const current = Array.isArray(value) ? value : [];
      onChange([...current, ...results]);
    });
    e.target.value = "";
  };

  const removeImageAt = (idx) => {
    const current = Array.isArray(value) ? value : [];
    onChange(current.filter((_, i) => i !== idx));
  };

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-space uppercase tracking-wider text-zinc-400 font-bold">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={3}
          placeholder={placeholder}
          className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/60 transition-colors placeholder:text-zinc-600 resize-y"
        />
      ) : type === "file" ? (
        <div className="flex items-center gap-4">
          {value && typeof value === 'string' && value.startsWith('data:image') && (
            <img src={value} alt="Preview" className="w-12 h-12 object-cover rounded border border-zinc-700" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={required && !value}
            className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer"
          />
        </div>
      ) : type === "files" ? (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultiFileChange}
            className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer"
          />
          {Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {value.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-16 h-16 object-cover rounded border border-zinc-700" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {Array.isArray(value) && value.length > 0 && (
            <span className="text-[10px] text-zinc-500">{value.length} image{value.length > 1 ? "s" : ""} selected</span>
          )}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/60 transition-colors placeholder:text-zinc-600"
        />
      )}
    </label>
  );
}

export function FormCard({ title, onSubmit, children, editing, onCancel, extra }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-zinc-950/60 border border-zinc-800/70 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-space uppercase tracking-wider text-white">
          {editing ? `Edit ${title}` : `Add ${title}`}
        </h3>
        {extra}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-400 text-white font-space font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg transition-colors"
        >
          {editing ? "Save Changes" : `Add ${title}`}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-space font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function ListSection({ title, count, children }) {
  return (
    <div className="mt-8">
      <h4 className="text-xs font-space uppercase tracking-wider text-zinc-500 font-bold mb-3 flex items-center gap-2">
        {title}
        <span className="text-sky-400">({count})</span>
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function ListRow({ image, title, subtitle, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 bg-black/30 border border-zinc-900 rounded-xl p-3 hover:border-zinc-800 transition-colors">
      {image ? (
        <img
          src={image || "/placeholder.svg"}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white font-medium truncate">{title}</p>
        {subtitle && <p className="text-xs text-zinc-500 font-light truncate">{subtitle}</p>}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onEdit}
          title="Edit"
          className="p-2 rounded-lg bg-zinc-900 hover:bg-sky-500/20 text-zinc-400 hover:text-sky-300 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="p-2 rounded-lg bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export function empty(fields) {
  return fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {});
}
