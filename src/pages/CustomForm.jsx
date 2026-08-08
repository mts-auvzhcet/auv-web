import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { addItem, getCollection, isHydrated } from '../lib/store';
import { uploadImage } from '../lib/cloudinary';
import { useStore } from '../lib/useStore';
import { createSlug } from '../lib/utils';
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';

// Renders any form created in Dashboard → Forms → Custom Builders, dynamically
// from its `fields` definition. This is what was missing before — form
// DEFINITIONS were being saved fine, but there was no public page that could
// actually render one and let someone submit a response, so "submissions"
// for custom forms never had anywhere to come from.
export default function CustomForm() {
  useStore();
  const { formId } = useParams();

  const forms = getCollection('forms');
  const form = forms.find((f) => (f.id === formId || createSlug(f.title) === formId) && !f.isRecruitment);
  const loadingDb = !isHydrated();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingField, setUploadingField] = useState(null);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleImageChange = async (fieldId, file) => {
    if (!file) return;
    setUploadingField(fieldId);
    try {
      const url = await uploadImage(file);
      handleChange(fieldId, url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const missing = (form.fields || []).filter(
      (f) => f.required && f.type !== 'display_image' && !formData[f.id],
    );
    if (missing.length > 0) {
      setErrorMsg(`Please fill: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await addItem(
        'recruitments',
        {
          ...formData,
          formId: form.id,
          version: form.version || 1,
          submittedAt: new Date().toISOString(),
        },
        { username: formData.name || 'applicant', role: 'applicant' },
      );
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDb) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500 text-sm">
        Loading form...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-6 gap-4">
        <AlertCircle className="text-zinc-600" size={32} />
        <p className="text-zinc-400 text-sm">This form doesn't exist or has been removed.</p>
        <Link to="/" className="text-sky-400 text-xs hover:underline">Back to home</Link>
      </div>
    );
  }

  if (!form.isOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-6 gap-4">
        <AlertCircle className="text-zinc-600" size={32} />
        <h1 className="text-xl font-bold text-white">{form.title}</h1>
        <p className="text-zinc-500 text-sm">This form is currently closed.</p>
        <Link to="/" className="text-sky-400 text-xs hover:underline">Back to home</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-6 gap-4">
        <CheckCircle className="text-green-400" size={40} />
        <h1 className="text-xl font-bold text-white">Response submitted</h1>
        <p className="text-zinc-500 text-sm">Thanks — your submission for "{form.title}" has been recorded.</p>
        <Link to="/" className="text-sky-400 text-xs hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#090d16] to-black pt-32 pb-20 px-6 relative selection:bg-blue-500/30 overflow-hidden">
      <GravityStarsBackground className="fixed inset-0 w-full h-full opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-zinc-950/60 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-shadow duration-500"
      >
        <h1 className="text-2xl font-bold text-white mb-1">{form.title}</h1>
        <p className="text-zinc-500 text-xs mb-8">Fields marked * are required.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {(form.fields || []).map((field) => {
            if (field.type === 'display_image') {
              return (
                <div key={field.id} className="flex flex-col gap-2 items-center text-center">
                  {field.displayImage && (
                    <img
                      src={field.displayImage}
                      alt={field.label}
                      className="max-h-64 rounded-xl border border-zinc-800 object-contain"
                    />
                  )}
                  <p className="text-xs text-zinc-400">{field.label}</p>
                </div>
              );
            }

            if (field.type === 'textarea') {
              return (
                <div key={field.id} className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                  />
                </div>
              );
            }

            if (field.type === 'image') {
              return (
                <div key={field.id} className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(field.id, e.target.files[0])}
                    className="hidden"
                    id={`img-${field.id}`}
                  />
                  <label
                    htmlFor={`img-${field.id}`}
                    className="flex items-center justify-center gap-3 bg-black/40 border border-zinc-800 border-dashed rounded-xl p-6 cursor-pointer hover:border-sky-500/40 transition-all"
                  >
                    {uploadingField === field.id ? (
                      <span className="text-[10px] font-bold text-sky-400 uppercase animate-pulse">Uploading...</span>
                    ) : formData[field.id] ? (
                      <img src={formData[field.id]} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <>
                        <ImageIcon size={20} className="text-zinc-600" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              );
            }

            // default: plain text field
            return (
              <div key={field.id} className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                />
              </div>
            );
          })}

          {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading || !!uploadingField}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white py-3.5 rounded-2xl text-sm font-bold transition-all hover-spring hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]"
          >
            <Send size={16} /> {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
