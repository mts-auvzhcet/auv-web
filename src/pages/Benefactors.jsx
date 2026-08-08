import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';

export default function Benefactors() {
  const supporters = [
    {
      name: 'Aligarh Muslim University',
      img: 'https://auvzhcet.vercel.app/benefactors/amu.png',
      type: 'Academic Partner'
    },
    {
      name: 'AMU Old Boys Association',
      img: 'https://auvzhcet.vercel.app/benefactors/amuoldboysassociation.png',
      type: 'Alumni Patron'
    },
  ];

  const sponsors = [
    {
      name: 'Designing Printing Innovation',
      img: 'https://auvzhcet.vercel.app/benefactors/depi.png',
      type: 'Print & Media Partner'
    },
    {
      name: 'KTM',
      img: 'https://auvzhcet.vercel.app/benefactors/KTM%20logo.png',
      type: 'Technical Support'
    },
    {
      name: 'Shiva Group',
      img: 'https://auvzhcet.vercel.app/benefactors/SG.png',
      type: 'Manufacturing Sponsor'
    },
    {
      name: 'Triumph',
      img: 'https://auvzhcet.vercel.app/benefactors/TRIUMPH.png',
      type: 'Hardware Partner'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617] text-white pt-28 pb-20 font-poppins relative selection:bg-blue-500/20 overflow-hidden">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-space text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-3"
          >
            Innovation Backers
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-outfit text-white uppercase tracking-tight"
          >
            Our Supporters
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base max-w-2xl font-light mt-4 leading-relaxed font-outfit"
          >
            We are deeply grateful to the institutions and corporations whose support drives our engineering innovations.
          </motion.p>
        </div>

        {/* Benefactors Section */}
        <div className="w-full mb-24">
          <div className="flex items-center gap-3 justify-center mb-10">
            <Award className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-extrabold font-outfit text-white uppercase tracking-wider text-center">
              Primary Benefactors
            </h2>
          </div>
          
          <div className="grid gap-8 max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2">
            {supporters.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={idx}
                className="group rounded-3xl bg-zinc-950/40 border border-zinc-900 hover:border-sky-500/20 transition-all duration-350 overflow-hidden flex flex-col justify-between backdrop-blur-sm"
              >
                <div className="p-8 h-48 flex items-center justify-center bg-zinc-900/10">
                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500">
                    <img
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter brightness-95"
                      src={item.img}
                    />
                  </div>
                </div>
                <div className="py-5 px-6 text-center border-t border-zinc-900/60 bg-zinc-950/85">
                  <span className="text-[9px] font-space text-cyan-400 tracking-widest uppercase font-bold">{item.type}</span>
                  <p className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors duration-300 mt-1 uppercase">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="w-full">
          <div className="flex items-center gap-3 justify-center mb-10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-2xl font-extrabold font-outfit text-white uppercase tracking-wider text-center">
              Corporate Sponsors
            </h2>
          </div>

          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {sponsors.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                key={idx}
                className="group rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-sky-500/20 transition-all duration-350 overflow-hidden flex flex-col justify-between backdrop-blur-sm"
              >
                <div className="p-6 h-40 flex items-center justify-center bg-zinc-900/10">
                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500">
                    <img
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter brightness-95"
                      src={item.img}
                    />
                  </div>
                </div>
                <div className="py-4 px-4 text-center border-t border-zinc-900/60 bg-zinc-950/85">
                  <span className="text-[8px] font-space text-cyan-400 tracking-wider uppercase font-bold block">{item.type}</span>
                  <p className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors duration-300 mt-1 uppercase">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
