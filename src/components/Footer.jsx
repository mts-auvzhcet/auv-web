import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ExternalLink, Send, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const sponsors = [
    { name: 'AMU', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'ZHCET', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'MTS', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'SOLIDWORKS', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'NVIDIA', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'KTM', logo: 'https://auvzhcet.vercel.app/auv1.png' },
    { name: 'TRIUMPH', logo: 'https://auvzhcet.vercel.app/auv1.png' },
  ];

  const teamLinks = [
    { name: 'Vehicles', path: '/' },
    { name: 'Achievements', path: '/events' },
    { name: 'Team Leads', path: '/leadership' },
    { name: 'Technology', path: '/tech' },
  ];

  const mediaLinks = [
    { name: 'Events Gallery', path: '/events' },
    { name: 'Benefactors', path: '/benefactors' },
    { name: 'LinkedIn Group', path: 'https://www.linkedin.com/company/auv-zhcet/', isExternal: true },
    { name: 'Club GitHub', path: 'https://github.com/mts-auvzhcet', isExternal: true },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#020617] border-t border-zinc-900 text-slate-400 font-outfit relative overflow-hidden">
      
      {/* 1. OUR SPONSORS scrolling logo strip (Temporarily disabled rendering) */}
      {false && (
        <div className="py-10 border-b border-zinc-900 bg-zinc-950/20">
          <div className="max-w-6xl mx-auto px-6 mb-6">
            <h4 className="text-[10px] sm:text-xs font-bold font-space tracking-[0.25em] text-sky-400 uppercase text-center md:text-left">
              Our Sponsors & Affiliations
            </h4>
          </div>
          
          {/* Infinite horizontal scrolling container */}
          <div className="w-full overflow-hidden relative flex items-center h-20">
            <div className="flex gap-8 items-center animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-full">
              {/* Direct list & double it to make a seamless loop */}
              {[...sponsors, ...sponsors].map((s, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center justify-center bg-zinc-950/50 rounded-xl py-3 px-8 shadow-md border border-zinc-900 shrink-0 h-14 min-w-[150px] gap-3.5 select-none hover:border-cyan-500/20 transition-all duration-300"
                >
                  <img src={s.logo} alt={s.name} className="h-6 w-6 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
                  <span className="text-zinc-200 font-space font-extrabold text-xs tracking-widest">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN FOOTER LINK GRID */}
      <div className="max-w-6xl mx-auto px-6 py-16 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Column 1: Logo, Tagline & Newsletter */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src="https://auvzhcet.vercel.app/auv1.png"
                alt="MTS AUV ZHCET logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-black text-white font-outfit uppercase tracking-wider">
                MTS <span className="text-sky-400">AUV</span> ZHCET
              </span>
            </div>
            
            <p className="text-sm font-light leading-relaxed max-w-sm text-slate-400 font-outfit">
              Pioneering autonomous underwater robotics at Aligarh Muslim University. Engineering custom-built vehicles to explore deep sea frontiers.
            </p>

            {/* Newsletter signup */}
            <div className="flex flex-col gap-3 max-w-sm">
              <span className="text-[10px] font-bold font-space text-slate-500 uppercase tracking-widest block">
                Join our newsletter
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="bg-zinc-950 border border-zinc-900 rounded-full px-4 py-2 text-xs font-outfit text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-sky-500/40 w-full"
                />
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={12} className="relative left-[-0.5px] top-[0.5px]" />
                </button>
              </form>
              <AnimatePresence>
                {subscribed && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-sky-400 font-space font-semibold"
                  >
                    Successfully subscribed!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Column 2: Link groups */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            {/* Team Links */}
            <div className="flex flex-col gap-4">
              <h5 className="text-xs font-bold font-space text-slate-500 uppercase tracking-widest">
                Team
              </h5>
              <div className="flex flex-col gap-2.5">
                {teamLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="text-sm font-light text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Media Links */}
            <div className="flex flex-col gap-4">
              <h5 className="text-xs font-bold font-space text-slate-500 uppercase tracking-widest">
                Media
              </h5>
              <div className="flex flex-col gap-2.5">
                {mediaLinks.map((link, idx) => {
                  if (link.isExternal) {
                    return (
                      <a
                        key={idx}
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-light text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                      >
                        {link.name} <ArrowUpRight size={10} className="opacity-60" />
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={idx}
                      to={link.path}
                      className="text-sm font-light text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Lab */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <h5 className="text-xs font-bold font-space text-slate-500 uppercase tracking-widest">
              Contact & Lab
            </h5>
            
            <div className="flex gap-3 text-sm">
              <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-col font-light text-slate-400 leading-normal text-xs sm:text-sm">
                <span>Main Building, ZHCET</span>
                <span>Aligarh Muslim University</span>
                <span>Aligarh, India - 202002</span>
              </div>
            </div>

            <div className="flex gap-3 text-sm items-center">
              <Mail size={16} className="text-sky-400 shrink-0" />
              <a
                href="mailto:auvzhcet@zhcet.ac.in"
                className="font-light text-slate-400 hover:text-sky-400 transition-colors text-xs sm:text-sm"
              >
                auvzhcet@zhcet.ac.in
              </a>
            </div>

            {/* Social icons row */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.linkedin.com/company/auv-zhcet/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 hover:border-sky-500/40 hover:text-sky-400 flex items-center justify-center text-zinc-400 transition-all duration-300"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mts_auv_zhcet/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 hover:border-sky-500/40 hover:text-sky-400 flex items-center justify-center text-zinc-400 transition-all duration-300"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://youtube.com/@mtsauvzhcet7066?feature=shared"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 hover:border-sky-500/40 hover:text-sky-400 flex items-center justify-center text-zinc-400 transition-all duration-300"
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://github.com/mts-auvzhcet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-900 hover:border-sky-500/40 hover:text-sky-400 flex items-center justify-center text-zinc-400 transition-all duration-300"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT STRIP */}
      <div className="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs font-space font-medium text-slate-500">
        <p>© {new Date().getFullYear()} MTS AUV-ZHCET Club. All rights reserved.</p>
      </div>

    </footer>
  );
}
