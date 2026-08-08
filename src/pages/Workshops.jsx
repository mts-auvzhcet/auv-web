import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, GraduationCap } from 'lucide-react';
import { getCollection, isHydrated } from '../lib/store';
import { useStore } from '../lib/useStore';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';

export default function Workshops() {
  useStore();

  const workshops = getCollection('workshops')
    .map((w) => ({
      id: w.id,
      title: w.title || 'Untitled Workshop',
      year: w.year || '',
      theme: w.theme || '',
      isActive: !!w.isActive,
      cover: w.imageBase64 || (Array.isArray(w.images) && w.images[0]) || 'https://auvzhcet.vercel.app/auv1.png',
      createdAt: w.createdAt,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
      const validA = !isNaN(yearA);
      const validB = !isNaN(yearB);
      if (validA && validB && yearA !== yearB) return yearB - yearA;
      if (validA !== validB) return validA ? -1 : 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  if (!isHydrated()) {
    return (
      <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-space uppercase tracking-wider">Loading workshops...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white pt-24 pb-20 min-h-screen font-poppins relative selection:bg-blue-500/30">
      <HexagonBackground className="fixed inset-0 w-full h-full opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10 pointer-events-none">
        <div className="flex flex-col mb-16 border-b border-white/10 pb-6 pointer-events-auto">
          <span className="text-zinc-400 font-space text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            Learn With Us
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-wide uppercase">
            Workshops
          </h1>
          <p className="text-zinc-550 text-sm sm:text-base font-light mt-3 leading-relaxed max-w-xl">
            Hands-on sessions run by MTS AUV-ZHCET — past and ongoing.
          </p>
        </div>

        {workshops.length === 0 ? (
          <p className="text-zinc-600 text-sm italic text-center py-16 pointer-events-auto">No workshops posted yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-auto">
            {workshops.map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Link
                  to={`/workshops/${w.id}`}
                  className="group block bg-zinc-950/60 border border-zinc-900 hover:border-sky-500/40 rounded-2xl overflow-hidden transition-all"
                >
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={w.cover}
                      alt={w.title}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    {w.isActive && (
                      <span className="absolute top-3 right-3 bg-green-500 text-black text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        Registrations Open
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-space uppercase tracking-wider mb-2">
                      <Calendar size={11} className="text-cyan-400" /> {w.year || 'Date TBA'}
                    </div>
                    <h3 className="font-bold text-white text-base leading-snug mb-1 group-hover:text-sky-300 transition-colors">
                      {w.title}
                    </h3>
                    {w.theme && <p className="text-zinc-500 text-xs font-light line-clamp-2">{w.theme}</p>}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
