import { useState } from "react";
import { Save, Check } from "lucide-react";
import { getInfoMd, setInfoMd } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

// Minimal, safe markdown renderer (headings, bold, italics, lists, line breaks).
function renderMarkdown(md) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = esc(md).split("\n");
  let html = "";
  let inList = false;
  const inline = (t) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code class="bg-black/40 px-1 rounded">$1</code>');

  for (const line of lines) {
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 my-2 space-y-1">';
        inList = true;
      }
      html += `<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`;
      continue;
    }
    if (inList) {
      html += "</ul>";
      inList = false;
    }
    if (/^###\s/.test(line)) html += `<h3 class="text-lg font-bold mt-3">${inline(line.slice(4))}</h3>`;
    else if (/^##\s/.test(line)) html += `<h2 class="text-xl font-bold mt-4">${inline(line.slice(3))}</h2>`;
    else if (/^#\s/.test(line)) html += `<h1 class="text-2xl font-black mt-4">${inline(line.slice(2))}</h1>`;
    else if (line.trim() === "") html += "";
    else html += `<p class="my-1.5 leading-relaxed">${inline(line)}</p>`;
  }
  if (inList) html += "</ul>";
  return html;
}

export default function MarkdownEditor() {
  const { user } = useAuth();
  useStore();
  const [md, setMd] = useState(getInfoMd());
  const [saved, setSaved] = useState(false);

  const save = () => {
    setInfoMd(md, user);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold font-space uppercase tracking-wider text-white">
            info.md Editor
          </h3>
          <p className="text-xs text-zinc-500 font-light">Markdown content for the club info page</p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-space font-bold uppercase tracking-wider text-xs py-2 px-4 rounded-lg transition-colors"
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          spellCheck={false}
          className="min-h-[360px] bg-black/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 font-mono outline-none focus:border-sky-500/60 transition-colors resize-y"
        />
        <div
          className="min-h-[360px] bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }}
        />
      </div>
    </div>
  );
}
