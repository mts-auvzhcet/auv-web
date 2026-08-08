import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Eye, FileText, ChevronLeft, ChevronRight, X, Award, MapPin, Sparkles } from 'lucide-react';
import { getCollection, isHydrated } from '../lib/store';
import { useStore } from '../lib/useStore';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';

export default function Events() {
  useStore();
  const [activeGallery, setActiveGallery] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fallbackEvents = [
    {
      title: 'AMU ROVc',
      year: '2023',
      venue: 'AMU Campus Pool, Aligarh',
      theme: 'Remotely Operated Underwater Vehicles Challenge',
      desc: 'AMUROV is a national-level student competition organised by Marine Technology Society, Autonomous Underwater Vehicle Club MTS-AUV in collaboration with Institute of Electrical and Electronics Engineers, IEEE AMU, established to generate and enhance a community of innovators capable of making substantive contributions to the remotely operated underwater vehicles (ROVs) domain.',
      highlights: [
        'Organized in collaboration with IEEE AMU Student Branch',
        'National-level platform for underwater vehicle developers',
        'Conducted successfully over three consecutive seasons'
      ],
      winningTeams: 'ZHCET AMU AUV Team (First Place), IIT Kanpur (Runner-up)',
      reportLink: 'https://docs.google.com/document/d/17CLr6AK0urJ6QD0Ai7vE8kANG6jwQxns1sapDRGR3Hk/edit?usp=sharing',
      images: [
        'https://auvzhcet.vercel.app/events/rovc/img1.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img2.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img3.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img4.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img5.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img6.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img7.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img8.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img9.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img10.JPG',
        'https://auvzhcet.vercel.app/events/rovc/img11.JPG',
      ]
    },
    {
      title: 'School Science Fair',
      year: '2023',
      venue: 'University Polytechnic Auditorium',
      theme: 'Renewable Energy Innovation Showcase',
      desc: 'MTS AUV-ZHCET organized a school science fair on the theme of renewable energy, inviting students from grades 6-10 to participate either individually or in groups of five to showcase their innovative ideas based on the theme of renewable energy.',
      highlights: [
        'Promoted renewable energy innovation in junior high schools',
        'Hosted over 50+ student teams representing regional schools',
        'Sponsored by AMU Old Boys Association'
      ],
      winningTeams: 'ABK High School (First Place), Senior Secondary School Girls (Second Place)',
      reportLink: 'https://docs.google.com/document/d/1ctQ68nNeUHpyUOEhmSzhFUO60PejEJjjeVNDps1bepg/edit?usp=sharing',
      images: [
        'https://auvzhcet.vercel.app/events/workshop/img1.png'
      ]
    },
    {
      title: 'SAUVc (Singapore)',
      year: '2022',
      venue: 'Singapore Science Centre, Singapore',
      theme: 'Singapore Autonomous Underwater Vehicle Challenge',
      desc: 'MTS AUV-ZHCET participated in the Singapore Autonomous Underwater Vehicle Challenge (SAUVc), a prestigious international competition that challenges teams to design and build autonomous underwater vehicles (AUVs) to execute target tracking under pool depths.',
      highlights: [
        'International exposure alongside leading Asian institutions',
        'Validated autonomous sonar-gate alignment modules',
        'Placed in the top 25% performers globally'
      ],
      winningTeams: 'Northwestern Polytechnical University (NPU), ZHCET AMU (Top Tier Performance)',
      reportLink: 'https://docs.google.com/document/d/1QjEgK1xGakUpA-gggfO22e0PivrY2lkxtBBrt-CctFQ/edit?usp=sharing',
      images: [
        'https://auvzhcet.vercel.app/events/sauvc/img1.png',
        'https://auvzhcet.vercel.app/events/sauvc/img2.png'
      ]
    }
  ];

  const storeEvents = getCollection('events').map((e) => ({
    title: e.title || 'Untitled Event',
    year: e.year || '',
    venue: e.venue || '',
    theme: e.theme || '',
    desc: e.desc || e.description || '',
    highlights: Array.isArray(e.highlights)
      ? e.highlights
      : (e.highlights || '').split('\n').filter(Boolean),
    winningTeams: e.winningTeams || '',
    reportLink: e.reportLink || '#',
    images: Array.isArray(e.images) && e.images.length > 0
      ? e.images
      : e.imageBase64
      ? [e.imageBase64]
      : (typeof e.images === 'string' ? e.images : (e.imageUrl || '')).split(',').map((s) => s.trim()).filter(Boolean),
    createdAt: e.createdAt,
  }));
  const events = [...storeEvents].sort((a, b) => {
    const yearA = parseInt(a.year, 10);
    const yearB = parseInt(b.year, 10);
    const validA = !isNaN(yearA);
    const validB = !isNaN(yearB);
    if (validA && validB && yearA !== yearB) return yearB - yearA; // newest year first
    if (validA !== validB) return validA ? -1 : 1; // events with a year beat ones without
    // Same year (or both missing one) — fall back to most-recently-added first.
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null || !activeGallery) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % activeGallery.images.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeGallery]);

  if (!isHydrated()) {
    return (
      <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-space uppercase tracking-wider">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0f172a] via-[#18181b] to-[#111827] text-white pt-24 pb-20 min-h-screen font-poppins relative selection:bg-blue-500/30">
      <HexagonBackground className="fixed inset-0 w-full h-full opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10 pointer-events-none">
        
        {/* Header Section */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-6 pointer-events-auto">
          <span className="text-zinc-400 font-space text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            Historical Timeline
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-wide uppercase">
            Previous Events & Achievements
          </h1>
          <p className="text-zinc-550 text-sm sm:text-base font-light mt-3 leading-relaxed max-w-xl">
            Celebrating the milestones, school programs, and international competitions of the MTS AUV Club.
          </p>
        </div>

        {/* Timeline Line */}
        <div className="flex flex-col gap-24 relative pl-8 border-l border-zinc-800/80 pointer-events-auto">
          {events.map((event, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              key={idx}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute left-[-41px] top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-cyan-500 flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </div>

              {/* Left Column: Cover Image & Gallery Preview */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                {/* Hero Image */}
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-sm relative group">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-350"
                  />
                  <div className="absolute top-4 left-4 bg-zinc-950/95 border border-zinc-800 rounded-full px-2.5 py-1 text-[9px] font-space font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                    <MapPin size={10} className="text-cyan-400" /> {event.venue}
                  </div>
                </div>

                {/* Gallery Preview Thumbnails Row */}
                {event.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {event.images.slice(0, 5).map((img, imgIdx) => (
                      <button
                        key={imgIdx}
                        onClick={() => {
                          setActiveGallery(event);
                          setLightboxIndex(imgIdx);
                        }}
                        className="w-16 h-12 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 hover:border-cyan-500/40 transition-all shrink-0"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    {event.images.length > 5 && (
                      <button
                        onClick={() => {
                          setActiveGallery(event);
                          setLightboxIndex(5);
                        }}
                        className="w-16 h-12 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-[10px] font-space font-bold text-cyan-400 uppercase shrink-0"
                      >
                        +{event.images.length - 5}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Event Achievements Details */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-zinc-550 font-bold font-space uppercase tracking-widest block">
                    {event.year} — {event.theme}
                  </span>
                  <h2 className="text-3xl font-extrabold font-outfit text-white uppercase tracking-wider mt-1">
                    {event.title}
                  </h2>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed text-justify font-outfit font-light">
                  {event.desc}
                </p>

                {/* Highlights list */}
                <div className="flex flex-col gap-2 border-t border-zinc-900 pt-4 mt-2">
                  <span className="text-[9px] text-zinc-500 font-bold font-space uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-cyan-400" /> Key Highlights
                  </span>
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 items-start text-xs font-outfit text-zinc-400">
                      <span className="text-cyan-400 font-bold mt-0.5">•</span>
                      <span className="font-light">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Winning Teams */}
                <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl flex gap-3 items-center mt-2">
                  <Award size={18} className="text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold font-space uppercase tracking-wider block">Standings / Placements</span>
                    <span className="text-zinc-300 text-xs font-medium font-outfit mt-0.5 block leading-normal">{event.winningTeams}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={event.reportLink}
                    className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider font-space"
                  >
                    <FileText size={12} /> Document Report
                  </a>
                  
                  <button
                    onClick={() => {
                      setActiveGallery(event);
                      setLightboxIndex(0);
                    }}
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-sky-500/10 hover:bg-sky-500 border border-sky-400/30 hover:text-black transition-all font-space tracking-wider uppercase flex items-center gap-1"
                  >
                    <Eye size={12} /> Full Gallery
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {activeGallery && lightboxIndex === null && (
          <div className="fixed inset-0 bg-black/95 z-[10000] flex flex-col items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col max-h-[85vh] shadow-xl relative"
            >
              
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-6 text-white">
                <div>
                  <h3 className="text-lg font-bold font-outfit text-white uppercase tracking-wider">{activeGallery.title} Gallery</h3>
                  <span className="text-[10px] text-zinc-550 font-space uppercase mt-0.5 block">Photos & Media</span>
                </div>
                <button
                  onClick={() => setActiveGallery(null)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close gallery"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeGallery.images.map((imgUrl, imgIdx) => (
                  <div 
                    key={imgIdx} 
                    onClick={() => setLightboxIndex(imgIdx)}
                    className="relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 shadow-sm cursor-pointer aspect-video group"
                  >
                    <img
                      alt={`Event ${activeGallery.title} image ${imgIdx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-300"
                      src={imgUrl}
                    />
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[11000] flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-450 hover:text-white z-50 transition-colors"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
              }}
              className="absolute left-6 w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-450 hover:text-white z-50 transition-colors"
              aria-label="Previous Image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % activeGallery.images.length);
              }}
              className="absolute right-6 w-12 h-12 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-450 hover:text-white z-50 transition-colors"
              aria-label="Next Image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Central Image */}
            <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center select-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  src={activeGallery.images[lightboxIndex]}
                  alt={`Full size item ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[72vh] object-contain rounded-xl border border-zinc-800"
                />
              </AnimatePresence>

              {/* Status bar */}
              <div className="mt-4 text-xs font-space text-zinc-500 uppercase tracking-widest">
                Image {lightboxIndex + 1} of {activeGallery.images.length}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
