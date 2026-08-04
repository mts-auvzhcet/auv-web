import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Send, Calendar, Users, HelpCircle, FileText, Globe, Upload, CheckCircle, Info, Clock } from 'lucide-react';
import { addItem, getCollection, isHydrated } from '../lib/store';
import { useStore } from '../lib/useStore';

export default function Recruitment() {
  useStore();
  
  const forms = getCollection('forms');
  const activeForm = forms.find(f => f.isOpen && f.isRecruitment);
  const isRecruitmentOpen = !!activeForm;
  const loadingDb = !isHydrated();
  
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
                  <p className="text-zinc-400 text-xs mt-1 leading-normal font-light">Open to all B.Tech / B.E. / Diploma branches of all years.</p>
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
              {loadingDb ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center text-center gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-sky-500/10 border-t-sky-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-sky-400/5 border-t-sky-500/40 animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-4 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Clock size={16} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-space text-sky-400 uppercase tracking-widest animate-pulse">Initializing Portal...</h3>
                  <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-light font-outfit">Connecting to the deep subsea database. Please wait a moment.</p>
                </motion.div>
              ) : !isRecruitmentOpen ? (
                <motion.div key="closed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-20 flex flex-col items-center justify-center text-center gap-6 text-zinc-400">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-2 shadow-xl"><Calendar size={32} /></div>
                  <h3 className="text-2xl font-bold font-outfit text-white uppercase tracking-wider">Recruitments Closed</h3>
                  <p className="text-sm max-w-sm leading-relaxed font-light font-outfit">There are no active recruitment cycles at the moment. Keep an eye on our social channels for updates.</p>
                </motion.div>
              ) : !submitted ? (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="flex flex-col gap-6 font-outfit">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Full Name <span className="text-red-500 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      placeholder="Enter your full name..."
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Email Address <span className="text-red-500 text-xs">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      placeholder="Enter your email address..."
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Mobile Number <span className="text-red-500 text-xs">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      placeholder="Enter your 10-digit mobile number..."
                    />
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Department <span className="text-red-500 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      required
                      value={formData.department || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      placeholder="e.g. Mechanical Engineering, Computer Engineering..."
                    />
                  </div>

                  {/* Year */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Year <span className="text-red-500 text-xs">*</span>
                    </label>
                    <select
                      name="year"
                      required
                      value={formData.year || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-sky-500/40 w-full transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-zinc-950">Select your year...</option>
                      <option value="1st Year" className="bg-zinc-950">1st Year</option>
                      <option value="2nd Year" className="bg-zinc-950">2nd Year</option>
                      <option value="3rd Year" className="bg-zinc-950">3rd Year</option>
                      <option value="4th Year" className="bg-zinc-950">4th Year</option>
                    </select>
                  </div>

                  {/* Google Drive CV Link */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      CV Link (Google Drive / Accessible Link) 
                    </label>
                    <input
                      type="url"
                      name="cv"
                      value={formData.cv || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      placeholder="Paste accessible Google Drive CV link (optional)..."
                    />
                  </div>

                  {/* Why do you want to join the club? */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Why do you want to join the club? <span className="text-red-500 text-xs">*</span>
                    </label>
                    <textarea
                      name="whyJoin"
                      required
                      value={formData.whyJoin || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      rows="4"
                      placeholder="Tell us about your motivation to join..."
                    />
                  </div>

                  {/* Any additional comment */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Any additional comment
                    </label>
                    <textarea
                      name="additionalComments"
                      value={formData.additionalComments || ''}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-sky-500/40 w-full transition-all"
                      rows="3"
                      placeholder="Any projects, links, or comments you would like to share..."
                    />
                  </div>

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
