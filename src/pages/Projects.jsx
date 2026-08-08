import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Cpu, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { getCollection, isHydrated } from '../lib/store';
import { useStore } from '../lib/useStore';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';

export default function Projects() {
  useStore();
  const [selectedProject, setSelectedProject] = useState(null);

  const fallbackProjects = [
    {
      title: 'AutoBase 1.0',
      category: 'Autonomous Perceptions',
      year: '2023',
      desc: 'Our in-house autonomous path detection, SLAM navigation, and real-time mission base station. Recreates underwater surroundings in 3D using stereo vision sensors and runs Deep-learning pipelines for automated visual alignment.',
      video: 'https://auvzhcet.vercel.app/Live_project/pathDetector.mp4',
      image: 'https://auvzhcet.vercel.app/Live_project/img1.png',
      tech: ['ROS 2', 'C++', 'OpenCV', 'YOLO v8', 'Nvidia Jetson'],
      features: [
        'Real-time 3D SLAM mapping & target lock',
        'Visual thresholding gate alignment',
        'Acoustic signal path finding'
      ],
      timeline: [
        { phase: 'Phase 1', desc: 'Feasibility & perception architecture design', date: 'Oct 2022' },
        { phase: 'Phase 2', desc: 'Sensor array and telemetry integration', date: 'Dec 2022' },
        { phase: 'Phase 3', desc: 'Pool test validation and path finding trials', date: 'Feb 2023' }
      ],
      team: ['Mohd Rayyan Khan', 'Harsh Awasthi', 'Tanishka Bhardwaj'],
      gallery: [
        'https://auvzhcet.vercel.app/Live_project/img1.png',
        'https://auvzhcet.vercel.app/Live_project/img2.png',
        'https://auvzhcet.vercel.app/Live_project/img4.png'
      ]
    },
    {
      title: 'Custom FDM 3D Printer',
      category: 'Rapid Prototyping Engine',
      year: '2023',
      desc: 'Engineered in-house to speed up rapid prototyping of mechanical mounts, customized camera brackets, and sealing framework. Built with heavy-duty structural frames and tuned active leveling systems.',
      video: 'https://auvzhcet.vercel.app/Live_project/printer_vid1.mp4',
      image: 'https://auvzhcet.vercel.app/Live_project/img2.png',
      tech: ['FDM Extrusion', 'Klipper Firmware', 'SolidWorks CAD', 'Precision Rails'],
      features: [
        'Modular extruder for multi-material prints',
        'Active matrix bed level sensor',
        'High thermal chamber printing'
      ],
      timeline: [
        { phase: 'Phase 1', desc: 'Chassis CAD design and rail alignment trials', date: 'May 2023' },
        { phase: 'Phase 2', desc: 'Wiring harness and Klipper firmware setup', date: 'Aug 2023' },
        { phase: 'Phase 3', desc: 'Calibration printing & frame deployment tests', date: 'Nov 2023' }
      ],
      team: ['Sabih Ahemad Khan', 'Mohd Ayaan Zafar', 'Supreet Chaudhary'],
      gallery: [
        'https://auvzhcet.vercel.app/Live_project/img1.png',
        'https://auvzhcet.vercel.app/Live_project/img2.png',
        'https://auvzhcet.vercel.app/Live_project/img4.png'
      ]
    }
  ];

  const storeProjects = getCollection('projects').map((p) => ({
    title: p.title || 'Untitled',
    category: p.category || 'Project',
    year: p.year || '',
    desc: p.desc || p.description || '',
    video: p.video || '',
    image: p.imageBase64 || p.image || p.imageUrl || '',
    tech: Array.isArray(p.tech) ? p.tech : (p.tech || '').split(',').map((s) => s.trim()).filter(Boolean),
    features: Array.isArray(p.features) ? p.features : (p.features || '').split('\n').filter(Boolean),
    timeline: Array.isArray(p.timeline) ? p.timeline : [],
    team: Array.isArray(p.team) ? p.team : (p.team || '').split(',').map((s) => s.trim()).filter(Boolean),
    gallery: Array.isArray(p.gallery) ? p.gallery : (p.gallery || '').split(',').map((s) => s.trim()).filter(Boolean),
  }));
  const projects = storeProjects;

  if (!isHydrated()) {
    return (
      <div className="bg-gradient-to-b from-[#0c4a6e] via-[#0f172a] to-[#020617] text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-200/30 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-sky-100/70 font-space uppercase tracking-wider">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0c4a6e] via-[#0f172a] to-[#020617] text-white pt-24 pb-20 min-h-screen font-poppins relative selection:bg-blue-500/30">
      <HexagonBackground className="fixed inset-0 w-full h-full opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10 pointer-events-none">
        
        {/* Header Section */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-6 pointer-events-auto">
          <span className="text-zinc-400 font-space text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            Engineering Milestones
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-wide uppercase">
            Featured Projects
          </h1>
          <p className="text-slate-350 text-sm sm:text-base font-light mt-3 leading-relaxed max-w-xl">
            Custom built subsea compute nodes, sensor layouts, and robotic navigation stacks developed in our labs.
          </p>
        </div>

        {/* Alternate Left-Right Layout List */}
        <div className="flex flex-col gap-28 pointer-events-auto">
          {projects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                key={idx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                {/* Visual Column */}
                <div className={`lg:col-span-6 w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-950/40 aspect-video ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-zinc-950/90 border border-zinc-800 rounded-full px-3 py-1 text-[9px] font-space font-semibold uppercase tracking-wider text-zinc-350">
                    {project.category}
                  </div>
                </div>

                {/* Content Details Column */}
                <div className={`lg:col-span-6 flex flex-col justify-center gap-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold font-space text-zinc-500 uppercase tracking-widest">
                      Year: {project.year}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-extrabold font-outfit text-white uppercase tracking-wider">
                    {project.title}
                  </h2>
                  
                  <p className="text-slate-350 text-xs sm:text-sm leading-relaxed text-justify font-outfit font-light border-l border-cyan-500 pl-4 py-0.5">
                    {project.desc}
                  </p>

                  {/* Team involved */}
                  <div className="flex gap-2 items-center text-xs text-zinc-400 font-space mt-2">
                    <Users size={12} className="text-cyan-500" />
                    <span>Credits: {project.team.join(' • ')}</span>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="bg-zinc-950 border border-zinc-900 text-zinc-400 px-2.5 py-0.5 rounded text-[10px] font-semibold font-space tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-sky-500/10 hover:bg-sky-500 border border-sky-400/30 hover:text-black font-space tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 group"
                    >
                      Explore Details
                      <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Slide-out detail drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[10000] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black"
            ></motion.div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-full md:w-[500px] lg:w-[600px] bg-zinc-950 border-l border-zinc-900 h-full flex flex-col justify-between z-10 shadow-xl p-6 sm:p-8"
            >
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full p-2 transition-colors"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>

              <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                <div className="mt-8">
                  <span className="text-zinc-400 text-[10px] font-space font-semibold uppercase tracking-wider block mb-1">
                    {selectedProject.category}
                  </span>
                  
                  <h2 className="text-3xl font-extrabold font-outfit text-white uppercase tracking-wider">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="mt-6 rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 relative aspect-video">
                  <video
                    src={selectedProject.video}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>

                {/* Features */}
                <div className="mt-8">
                  <h3 className="text-white font-bold font-space text-xs border-b border-zinc-900 pb-2 mb-4 uppercase tracking-widest">
                    Core Specifications
                  </h3>
                  <div className="flex flex-col gap-2">
                    {selectedProject.features.map((f, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-400 font-light font-outfit">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timelines */}
                <div className="mt-8">
                  <h3 className="text-white font-bold font-space text-xs border-b border-zinc-900 pb-2 mb-4 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12} className="text-zinc-500" /> Project Milestones
                  </h3>
                  <div className="flex flex-col gap-4 pl-1">
                    {selectedProject.timeline.map((step, i) => (
                      <div key={i} className="flex gap-3 relative last:before:hidden before:absolute before:left-[11px] before:top-5 before:bottom-[-20px] before:w-[1px] before:bg-zinc-900">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-space font-bold text-zinc-500 shrink-0">
                          {i+1}
                        </div>
                        <div>
                          <div className="flex gap-2 items-center">
                            <span className="text-xs font-bold text-zinc-300 font-space uppercase tracking-wider">{step.phase}</span>
                            <span className="text-[10px] text-zinc-500 font-medium font-space">| {step.date}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5 font-outfit font-light">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-850 transition-all uppercase tracking-widest font-space"
                >
                  Close Drawer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
