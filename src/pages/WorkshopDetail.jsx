import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Award, Ticket, QrCode, ExternalLink, ArrowLeft, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCollection, isHydrated } from '../lib/store';
import { useStore } from '../lib/useStore';

export default function WorkshopDetail() {
  useStore();
  const { id } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const raw = getCollection('workshops').find((w) => w.id === id);

  if (!isHydrated()) {
    return (
      <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-space uppercase tracking-wider">Loading workshop...</span>
        </div>
      </div>
    );
  }

  if (!raw) {
    return (
      <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-zinc-400 text-sm">This workshop doesn't exist or has been removed.</p>
        <Link to="/workshops" className="text-sky-400 text-xs hover:underline flex items-center gap-1">
          <ArrowLeft size={12} /> Back to Workshops
        </Link>
      </div>
    );
  }

  const workshop = {
    title: raw.title || 'Untitled Workshop',
    year: raw.year || '',
    theme: raw.theme || '',
    desc: raw.desc || '',
    highlights: Array.isArray(raw.highlights) ? raw.highlights : (raw.highlights || '').split('\n').filter(Boolean),
    isActive: !!raw.isActive,
    cover: raw.imageBase64 || (Array.isArray(raw.images) && raw.images[0]) || 'https://auvzhcet.vercel.app/auv1.png',
    images: Array.isArray(raw.images) ? raw.images : [],
    venue: raw.venue || '',
    registrationFee: raw.registrationFee || '',
    certificates: raw.certificates || '',
    registrationLink: raw.registrationLink || '',
  };

  const qrUrl = workshop.registrationLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(workshop.registrationLink)}`
    : null;

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-950/40 via-[#090d16] to-[#020617] text-white pt-24 pb-20 min-h-screen font-poppins selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <Link to="/workshops" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs font-space uppercase tracking-wider mb-8 transition-colors">
          <ArrowLeft size={13} /> All Workshops
        </Link>

        {/* Cover + Heading */}
        <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-zinc-900 mb-8 relative">
          <img src={workshop.cover} alt={workshop.title} className="w-full h-full object-cover" />
          {workshop.isActive && (
            <span className="absolute top-4 right-4 bg-green-500 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Registrations Open
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 font-space uppercase tracking-wider mb-3">
          <Calendar size={13} className="text-cyan-400" /> {workshop.year || 'Date TBA'}
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-outfit text-white tracking-wide uppercase mb-3">
          {workshop.title}
        </h1>
        {workshop.theme && <p className="text-zinc-400 text-sm font-light mb-6">{workshop.theme}</p>}
        {workshop.desc && <p className="text-zinc-400 text-sm font-light leading-relaxed mb-10 whitespace-pre-wrap">{workshop.desc}</p>}

        {/* Registration block — only when active */}
        {workshop.isActive && (
          <div className="bg-zinc-950/60 border border-sky-500/20 rounded-2xl p-6 md:p-8 mb-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center hover-spring hover:border-cyan-500/40 backdrop-blur-md hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-shadow duration-500">
            {qrUrl && (
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="bg-white p-3 rounded-xl">
                  <img src={qrUrl} alt="Registration QR code" className="w-36 h-36" />
                </div>
                <span className="text-[10px] text-zinc-500 font-space uppercase tracking-wider flex items-center gap-1">
                  <QrCode size={11} /> Scan to Register
                </span>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {workshop.venue && (
                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold font-space uppercase tracking-wider block">Venue</span>
                    <span className="text-zinc-200 text-sm font-medium">{workshop.venue}</span>
                  </div>
                </div>
              )}
              {workshop.registrationFee && (
                <div className="flex gap-3 items-start">
                  <Ticket size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold font-space uppercase tracking-wider block">Registration Fee</span>
                    <span className="text-zinc-200 text-sm font-medium">{workshop.registrationFee}</span>
                  </div>
                </div>
              )}
              {workshop.certificates && (
                <div className="flex gap-3 items-start">
                  <Award size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold font-space uppercase tracking-wider block">Certificates</span>
                    <span className="text-zinc-200 text-sm font-medium whitespace-pre-wrap">{workshop.certificates}</span>
                  </div>
                </div>
              )}
              {workshop.registrationLink && (
                <a
                  href={workshop.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-colors mt-2 self-start hover-spring hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                >
                  Register Now <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Key Highlights */}
        {workshop.highlights.length > 0 && (
          <div className="mb-10">
            <span className="text-[10px] text-zinc-500 font-bold font-space uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-400" /> Key Highlights
            </span>
            <div className="flex flex-col gap-2">
              {workshop.highlights.map((h, i) => (
                <div key={i} className="flex gap-2 items-start text-sm font-outfit text-zinc-400">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span className="font-light">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlight Gallery */}
        {workshop.images.length > 0 && (
          <div>
            <span className="text-[10px] text-zinc-500 font-bold font-space uppercase tracking-wider mb-3 block">
              Gallery
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {workshop.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 cursor-pointer aspect-video group"
                >
                  <img
                    src={img}
                    alt={`${workshop.title} highlight ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[11000] flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white z-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p - 1 + workshop.images.length) % workshop.images.length); }}
              className="absolute left-6 w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white z-50"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p + 1) % workshop.images.length); }}
              className="absolute right-6 w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white z-50"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
            <img
              src={workshop.images[lightboxIndex]}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-zinc-800"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
