import { useState } from "react";
import { Trash2, ChevronDown, ChevronRight, Mail, Phone, Plus, Settings, Eye, ToggleLeft, ToggleRight, Image as ImageIcon, Type, List, Download, X, MoreVertical, Layers, CheckCircle, Clock } from "lucide-react";
import { getCollection, addItem, updateItem, deleteItem } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

const FIELD_TYPES = [
  { id: "text", label: "Short Text", icon: <Type size={14} /> },
  { id: "textarea", label: "Long Text", icon: <List size={14} /> },
  { id: "image", label: "Image Upload", icon: <ImageIcon size={14} /> },
  { id: "display_image", label: "Display Image (Instructional)", icon: <ImageIcon size={14} className="text-sky-400" /> },
];

function fmt(dt) {
  if (!dt) return "-";
  try { return new Date(dt).toLocaleString(); } catch { return dt; }
}

export default function FormsManager() {
  const { user } = useAuth();
  const db = useStore();
  const forms = db.forms || [];
  const submissions = db.recruitments || [];

  const [openFormId, setOpenFormId] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newField, setNewField] = useState({ label: "", type: "text", required: false, displayImage: "" });

  const createForm = () => {
    const title = window.prompt("Enter form title (e.g., 'Workshop 2026'):");
    if (title && title.trim()) {
      addItem("forms", { 
        title: title.trim(), 
        isOpen: false, 
        version: 1,
        fields: [
          { id: "name", label: "Full Name", type: "text", required: true },
          { id: "email", label: "Email", type: "text", required: true }
        ] 
      }, user);
    }
  };

  const deleteForm = (id) => {
    if (window.confirm("Delete this form and ALL its submissions?")) {
      deleteItem("forms", id, user);
      if (openFormId === id) setOpenFormId(null);
    }
  };

  const toggleFormStatus = (form) => {
    // Opening/closing must NEVER touch version — reopening a closed form
    // should continue adding to the SAME dataset, not start a new one.
    updateItem("forms", form.id, { ...form, isOpen: !form.isOpen }, user);
  };

  const reinitializeForm = (form) => {
    if (
      !window.confirm(
        `Reinitialize "${form.title}"? This starts a brand-new response table — previous submissions stay saved in your export history but will no longer count toward the live total. This cannot be undone.`,
      )
    )
      return;
    updateItem(
      "forms",
      form.id,
      { ...form, isOpen: true, version: (form.version || 1) + 1 },
      user,
    );
  };

  const handleAddField = () => {
    if (!newField.label.trim()) return;
    const fieldId = newField.label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const updatedFields = [...(editingForm.fields || []), { ...newField, id: fieldId }];
    const updated = { ...editingForm, fields: updatedFields };
    setEditingForm(updated);
    updateItem("forms", editingForm.id, updated, user);
    setShowFieldModal(false);
    setNewField({ label: "", type: "text", required: false, displayImage: "" });
  };

  const removeField = (fieldId) => {
    const newFields = editingForm.fields.filter(f => f.id !== fieldId);
    const updated = { ...editingForm, fields: newFields };
    setEditingForm(updated);
    updateItem("forms", editingForm.id, updated, user);
  };

  const handleDisplayImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewField(prev => ({ ...prev, displayImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToCSV = (form, version) => {
    const formSubs = submissions.filter(s => s.formId === form.id && s.version === version);
    if (formSubs.length === 0) return alert("No submissions to export.");

    const headers = ["Submitted At", ...form.fields.filter(f => f.type !== 'display_image').map(f => f.label)];
    const rows = formSubs.map(s => [
      fmt(s.submittedAt),
      ...form.fields.filter(f => f.type !== 'display_image').map(f => s[f.id] || "")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_v${version}_responses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ensure recruitment form exists
  const recruitmentForm = forms.find(f => f.isRecruitment) || null;
  const ensureRecruitmentForm = () => {
    if (!recruitmentForm) {
      addItem("forms", {
        title: "Default Recruitment Form",
        isRecruitment: true,
        isOpen: false,
        version: 1,
        fields: [
          { id: "name", label: "Full Name", type: "text", required: true },
          { id: "email", label: "Email", type: "text", required: true },
          { id: "phone", label: "Phone Number", type: "text", required: true },
          { id: "department", label: "Department", type: "text", required: true },
          { id: "year", label: "Year", type: "text", required: true },
          { id: "domain", label: "Domain Preference", type: "text", required: true },
          { id: "experience", label: "Experience", type: "textarea", required: false },
          { id: "image", label: "Profile Photo", type: "image", required: false }
        ]
      }, user);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Recruitment Toggle Section */}
      <section className="bg-zinc-950/60 border border-zinc-800/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit text-white">Recruitment Portal</h2>
              <p className="text-xs text-zinc-500 font-light mt-1">Official club membership intake management.</p>
            </div>
          </div>
          {!recruitmentForm ? (
            <button onClick={ensureRecruitmentForm} className="bg-sky-500 hover:bg-sky-400 text-white px-6 py-2.5 rounded-xl text-xs font-bold font-space uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20">Initialize Recruitment</button>
          ) : (
            <div className="flex items-center gap-3">
               <button 
                onClick={() => toggleFormStatus(recruitmentForm)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all ${
                  recruitmentForm.isOpen 
                  ? "bg-green-500/10 border-green-500/50 text-green-400 shadow-lg shadow-green-500/10" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
                }`}
              >
                {recruitmentForm.isOpen ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                <span className="text-xs font-bold font-space uppercase tracking-widest">{recruitmentForm.isOpen ? "Live" : "Closed"}</span>
              </button>
              <button
                onClick={() => exportToCSV(recruitmentForm, recruitmentForm.version || 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold font-space uppercase tracking-wider hover:bg-sky-500/20 transition-all"
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                onClick={() => reinitializeForm(recruitmentForm)}
                title="Start a brand-new response table — previous data stays archived, not deleted"
                className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-space uppercase tracking-wider hover:bg-red-500/20 transition-all"
              >
                Reinitialize
              </button>
              <button onClick={() => setEditingForm(recruitmentForm)} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"><Settings size={18} /></button>
            </div>
          )}
        </div>
      </section>

      {/* Custom Forms Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-white">Custom Builders</h2>
              <p className="text-xs text-zinc-500 font-light">Workshops, internships, and event registration forms.</p>
            </div>
          </div>
          <button onClick={createForm} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-space uppercase tracking-wider transition-all">Create New Form</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {forms.filter(f => !f.isRecruitment).map((f) => {
            const open = openFormId === f.id;
            const currentVersion = f.version || 1;
            const formSubs = submissions.filter(s => s.formId === f.id);

            return (
              <div key={f.id} className="group bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden transition-all hover:border-zinc-800">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setOpenFormId(open ? null : f.id)}>
                    <div className="text-zinc-600 group-hover:text-sky-400 transition-colors">{open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{f.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-space text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Clock size={10}/> v{currentVersion}</span>
                        <span className="text-[10px] font-space text-zinc-500 uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10}/> {formSubs.length} Total Responses</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => exportToCSV(f, currentVersion)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold font-space uppercase tracking-wider hover:bg-sky-500/20 transition-all"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                    <button
                      onClick={() => reinitializeForm(f)}
                      title="Start a brand-new response table — previous data stays archived, not deleted"
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold font-space uppercase tracking-wider hover:bg-red-500/20 transition-all"
                    >
                      Reinitialize
                    </button>
                    <button onClick={() => setEditingForm(f)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"><Settings size={14} /></button>
                    <button onClick={() => toggleFormStatus(f)} className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold font-space uppercase tracking-widest transition-all ${f.isOpen ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>{f.isOpen ? 'Live' : 'Closed'}</button>
                    <button onClick={() => deleteForm(f.id)} className="p-2 rounded-lg text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                {open && currentVersion > 1 && (
                  <div className="border-t border-zinc-900 px-6 py-3 bg-black/10">
                    <p className="text-[10px] text-zinc-500 uppercase font-space tracking-wider mb-2">
                      Earlier response tables (archived — not part of the live total)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: currentVersion - 1 }, (_, i) => i + 1).map((v) => {
                        const vSubs = formSubs.filter((s) => (s.version || 1) === v);
                        return (
                          <button
                            key={v}
                            onClick={() => exportToCSV(f, v)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-[10px] hover:text-sky-400 transition-all"
                          >
                            <Download size={10} /> v{v} ({vSubs.length})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Field Builder Modal */}
      {editingForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">{editingForm.title}</h3>
                <p className="text-xs text-zinc-500 font-light">Advanced Form Builder</p>
              </div>
              <button onClick={() => setEditingForm(null)} className="p-2 rounded-full hover:bg-zinc-900 text-zinc-500 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase font-space tracking-widest">Form Structure</h4>
                  <button onClick={() => setShowFieldModal(true)} className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 hover:text-sky-300 uppercase font-space tracking-widest transition-colors"><Plus size={14}/> Add Field</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {editingForm.fields?.map((field) => (
                    <div key={field.id} className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-zinc-500">
                          {FIELD_TYPES.find(t => t.id === field.type)?.icon}
                        </div>
                        <div>
                          <p className="text-xs text-zinc-200 font-medium">{field.label}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-space tracking-tight">
                            {FIELD_TYPES.find(t => t.id === field.type)?.label} {field.required && "• Required"}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeField(field.id)} className="p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-900 bg-black/20">
               <button onClick={() => setEditingForm(null)} className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-2xl text-xs font-bold font-space uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20">Done Building</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-lg font-bold font-outfit text-white mb-6">New Question Field</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase font-space tracking-widest">Question Label</label>
                <input 
                  type="text" 
                  value={newField.label} 
                  onChange={e => setNewField(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Why do you want to join?"
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/60 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase font-space tracking-widest">Field Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TYPES.map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setNewField(prev => ({ ...prev, type: type.id }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs transition-all ${newField.type === type.id ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {newField.type === 'display_image' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase font-space tracking-widest">Instructional Image</label>
                  <input type="file" accept="image/*" onChange={handleDisplayImageUpload} className="hidden" id="display-img-upload" />
                  <label htmlFor="display-img-upload" className="flex items-center justify-center gap-3 bg-black/40 border border-zinc-800 border-dashed rounded-xl p-6 cursor-pointer hover:border-sky-500/40 transition-all">
                    {newField.displayImage ? (
                      <img src={newField.displayImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <><ImageIcon size={20} className="text-zinc-600"/> <span className="text-[10px] font-bold text-zinc-500 uppercase">Upload Pic</span></>
                    )}
                  </label>
                </div>
              )}

              <div className="flex items-center gap-3 bg-zinc-900/40 p-4 rounded-xl">
                <input 
                  type="checkbox" 
                  id="req-check" 
                  checked={newField.required} 
                  onChange={e => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                  className="w-4 h-4 rounded border-zinc-800 bg-black"
                />
                <label htmlFor="req-check" className="text-xs text-zinc-400">Required field</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowFieldModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-bold uppercase font-space tracking-widest hover:bg-zinc-800 transition-all">Cancel</button>
                <button onClick={handleAddField} className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white text-xs font-bold uppercase font-space tracking-widest hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20">Add Field</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
