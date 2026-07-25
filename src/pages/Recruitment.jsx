import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Send, Calendar, Users, HelpCircle, FileText, Globe, Upload, CheckCircle, Info } from 'lucide-react';
import { addItem, getCollection } from '../lib/store';
import { useStore } from '../lib/useStore';

export default function Recruitment() {
  useStore();
  
  const forms = getCollection('forms');
  const activeForm = forms.find(f => f.isOpen && f.isRecruitment);
  const isRecruitmentOpen = !!activeForm;
  
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectionSteps = [
    { step: '1', title: 'Application Screening', desc: 'Evaluation of domain preferences, past projects, portfolio links, and Statement of Purpose.' },
    { step: '2', title: 'Technical Tasks', desc: 'Practical tasks assigned based on domain preference to test coding, designing, or wiring abilities.' },
    { step: '3', title: 'Personal Interview', desc: 'A face-to-face discussion with senior leads and advisors reviewing technical task solutions and team compatibility.' }
  ];

  const timeline = [
    { date: 'July 15, 2026', event: 'Applications Open' },
    { date: 'July 30, 2026', event: 'Submission Deadline' },
    { date: 'Aug 05, 2026', event: 'Shortlists Released' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldId) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [fieldId]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await addItem('recruitments', { 
        ...formData, 
        formId: activeForm.id,
        version: activeForm.version || 1, // Store the version so responses are grouped by "table"
        submittedAt: new Date().toISOString() 
      }, { username: formData.name || 'applicant', role: 'applicant' });
      
      setSubmitted(true);
      setFormData({});
      setLoading(false);
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0c4a6e] via-[#0f172a] to-[#020617] text-white pt-28 pb-20 min-h-screen font-poppins relative selection:bg-blue-500/30 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-16 border-b border-white/10 pb-6">
          <span className="text-zinc-400 font-space text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">Join the Crew</span>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-wide uppercase">MTS AUV Recruitment Portal</h1>
          <p className="text-slate-350 text-sm sm:text-base font-light mt-3 leading-relaxed max-w-xl">
            We are looking for passionate problem solvers, engineers, and creatives eager to push subsea robotic engineering boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider text-white">About Recruitment</h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed text-justify font-light">
                Recruitment at MTS AUV-ZHCET is a gateway to acquiring practical knowledge. You will participate in high-stakes structural designs, electronic debugging, and autonomous testing.
              </p>
              <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl flex gap-3 mt-2">
                <HelpCircle size={18} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-550 font-bold font-space uppercase tracking-wider block">Eligibility Bounds</span>
                  <p className="text-zinc-400 text-xs mt-1 leading-normal font-light">Open to all B.Tech / B.E. / Diploma branches of 1st, 2nd, and 3rd year.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider text-white">Selection Process</h2>
              <div className="flex flex-col gap-4 pl-1">
                {selectionSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 relative last:before:hidden before:absolute before:left-[11px] before:top-5 before:bottom-[-20px] before:w-[1px] before:bg-zinc-900">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-space font-bold text-sky-400 shrink-0">{step.step}</div>
                    <div>
                      <span className="text-xs font-bold text-zinc-300 font-space uppercase tracking-wider">{step.title}</span>
                      <p className="text-xs text-zinc-400 mt-1 font-outfit font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-900 p-6 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md">
            <div className="border-b border-zinc-900 pb-6 mb-8">
              <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">Registration Form</h2>
              {isRecruitmentOpen && <span className="text-xs text-zinc-500 font-space uppercase mt-1 block tracking-widest">{activeForm.title} • v{activeForm.version}</span>}
            </div>

            <AnimatePresence mode="wait">
              {!isRecruitmentOpen ? (
                <motion.div key="closed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-20 flex flex-col items-center justify-center text-center gap-6 text-zinc-400">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-2 shadow-xl"><Calendar size={32} /></div>
                  <h3 className="text-2xl font-bold font-outfit text-white uppercase tracking-wider">Recruitments Closed</h3>
                  <p className="text-sm max-w-sm leading-relaxed font-light font-outfit">There are no active recruitment cycles at the moment. Keep an eye on our social channels for updates.</p>
                </motion.div>
              ) : !submitted ? (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="flex flex-col gap-6 font-outfit">
                  {activeForm.fields?.map((field) => (
                    <div key={field.id} className="flex flex-col gap-2.5">
                      {field.type !== 'display_image' && (
                        <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          {field.label} {field.required && <span className="text-red-500 text-xs">*</span>}
                        </label>
                      )}
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.id}
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={handleInputChange}
                          className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                          rows="4"
                          placeholder={`Enter your ${field.label.toLowerCase()}...`}
                        />
                      ) : field.type === 'image' ? (
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, field.id)}
                            className="hidden"
                            id={`file-${field.id}`}
                            required={field.required && !formData[field.id]}
                          />
                          <label
                            htmlFor={`file-${field.id}`}
                            className="flex flex-col items-center justify-center gap-3 bg-black/40 border border-zinc-800 border-dashed rounded-2xl p-10 text-zinc-500 cursor-pointer group-hover:border-sky-500/40 group-hover:bg-sky-500/5 transition-all"
                          >
                            {formData[field.id] ? (
                              <div className="flex flex-col items-center gap-4">
                                <img src={formData[field.id]} alt="Preview" className="w-24 h-24 object-cover rounded-2xl border border-zinc-800 shadow-xl" />
                                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Change Image</span>
                              </div>
                            ) : (
                              <>
                                <Upload size={24} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Upload {field.label}</span>
                              </>
                            )}
                          </label>
                        </div>
                      ) : field.type === 'display_image' ? (
                        <div className="flex flex-col gap-3 mb-4">
                           <div className="flex items-center gap-2 text-[10px] font-bold font-space text-sky-400 uppercase tracking-widest">
                            <Info size={12}/> Instruction
                          </div>
                          <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-lg">
                            <img src={field.displayImage} alt="Instructional" className="w-full h-auto object-cover" />
                          </div>
                          <p className="text-xs text-zinc-500 font-light italic">{field.label}</p>
                        </div>
                      ) : (
                        <input
                          type="text"
                          name={field.id}
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={handleInputChange}
                          className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                          placeholder={`Type your answer...`}
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-white font-space font-bold uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-sky-500/20 active:scale-[0.98]"
                  >
                    {loading ? 'Processing...' : <><Send size={18} /> Submit Application</>}
                  </button>
                  {errorMsg && <p className="text-red-400 text-center text-xs mt-4 font-bold uppercase tracking-tight">{errorMsg}</p>}
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-2 shadow-lg shadow-green-500/10"><CheckCircle size={40} /></div>
                  <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tight">Success!</h3>
                  <p className="text-sm text-zinc-400 max-w-xs leading-relaxed font-light">Your application has been logged. Our leads will review it and reach out via email.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-[0.15em] font-space transition-all">Submit another response</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
