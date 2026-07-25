import { motion } from 'framer-motion';
import { Cpu, Eye, Zap, Shield, HelpCircle, HardDrive, Anchor, Activity } from 'lucide-react';

export default function Tech() {
  
  const techSpecs = {
    computing: [
      { name: 'Processor', value: 'Nvidia Jetson Xavier AGX' },
      { name: 'Cores', value: '512-core Volta GPU with Tensor Cores' },
      { name: 'Performance', value: 'Up to 32 TOPS (AI computing)' },
      { name: 'Cooling', value: 'Custom closed-loop heat dissipation' }
    ],
    perception: [
      { name: 'Camera', value: 'Intel RealSense D435i Stereo' },
      { name: 'Tracking', value: 'Active IR stereoscopic depth sensing' },
      { name: 'AI Model', value: 'YOLO v8 target classification' },
      { name: 'Odometry', value: 'Visual SLAM integration' }
    ],
    propulsion: [
      { name: 'Thrusters', value: '4x BlueRobotics T200 Brushless' },
      { name: 'Peak Draw', value: '24 Amps per thruster' },
      { name: 'Lubrication', value: 'Hydrocarbon bearing water-cooled' },
      { name: 'Max Speed', value: 'Up to 5.0 m/s displacement' }
    ]
  };

  return (
    <div className="flex flex-col font-poppins bg-gradient-to-b from-[#0284c7] via-[#0c4a6e] to-[#0f172a] text-[#fafafa] min-h-screen relative selection:bg-blue-500/30">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* 1. HERO SECTION (Immersive Monohull Render) */}
      <div className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-gradient-to-b from-transparent to-[#020204]">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 0.7 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            alt="SEA 5.0 vehicle render"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(6,182,212,0.15)]"
            src="https://auvzhcet.vercel.app/LandingPage/SEA_5.0.png"
          />
        </div>
        
        {/* Floating title block */}
        <div className="z-10 flex flex-col items-center select-none absolute bottom-[15%]">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-400 font-space text-xs sm:text-sm font-semibold tracking-wider uppercase block"
          >
            Core Technology
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black font-outfit uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mt-2"
          >
            SEA 5.0
          </motion.h1>
        </div>
      </div>

      {/* 2. DOUBLE DIVE (Hull & Structure Section) */}
      <div className="z-10 flex flex-col w-full min-h-[50vh] items-center justify-center px-6 py-20 bg-zinc-950/20 border-t border-b border-zinc-900/60 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center border border-zinc-900 bg-zinc-950/70 p-8 sm:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/40 via-blue-500 to-transparent"></div>
          
          <div className="flex-1">
            <span className="text-cyan-400 font-space text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Shield size={12} /> Hydrodynamics
            </span>
            <h2 className="text-3xl sm:text-4xl text-white font-extrabold font-outfit uppercase tracking-wide mb-4">
              Double Dive
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-outfit font-light text-justify">
              SEA 5.0 utilizes a modular double-hull design meticulously crafted to enhance drag reduction and optimize underwater buoyancy dynamics. Engineered and simulated entirely in-house, the structure balances structural integrity with rapid payload swapping.
            </p>
          </div>
          
          {/* Subsystem spec list */}
          <div className="flex-1 w-full flex flex-col gap-3 font-space text-xs">
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span className="text-zinc-500 font-bold uppercase">Hull Material</span>
              <span className="text-zinc-200">Carbon Fiber / Acrylic</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span className="text-zinc-500 font-bold uppercase">Depth Rating</span>
              <span className="text-zinc-200">100 meters</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span className="text-zinc-500 font-bold uppercase">Sealing System</span>
              <span className="text-zinc-200">Double O-Ring Machined Endcaps</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. COMPUTING CORE (Jetson Section) */}
      <div className="z-10 w-full max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Text column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-6 flex flex-col justify-center gap-5"
        >
          <span className="text-zinc-400 font-space text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={12} /> Computing Engine
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-extrabold font-outfit uppercase tracking-wide">
            Freaking Fast
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-outfit font-light text-justify">
            Powered by Nvidia’s top of the line board – Jetson Xavier AGX. Incorporates 512 Volta computing cores with tensor accelerators to handle heavy AI tasks on the go. Customized cooling keeps temperatures controlled in confined, sealed hull chambers.
          </p>

          {/* Staggered specs sheet */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {techSpecs.computing.map((spec, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-500 font-bold uppercase font-space tracking-wider block">{spec.name}</span>
                <span className="text-zinc-200 text-xs sm:text-sm font-semibold mt-1 block leading-tight">{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Video column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-6 w-full rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl relative bg-zinc-950"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none"></div>
          <video
            src="https://auvzhcet.vercel.app/LandingPage/jetson.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover opacity-80"
          />
        </motion.div>
      </div>

      {/* 4. PERCEPTION SYSTEM (RealSense Section) */}
      <div className="z-10 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col items-center gap-12 border-t border-zinc-900/60">
        
        {/* Text header block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl flex flex-col items-center gap-4"
        >
          <span className="text-cyan-400 font-space text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Eye size={12} /> Computer Vision
          </span>
          <h2 className="text-4xl md:text-5xl text-white font-extrabold font-outfit uppercase tracking-wide">
            Sea Like Never Before
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-outfit font-light">
            Powered by active infrared stereo vision technology, the Intel RealSense depth camera recreates subsea surroundings in 3D. Enables Real-time localization and mapping (SLAM) to navigate pools and trenches seamlessly.
          </p>
        </motion.div>

        {/* Video feed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full sm:w-[85%] rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl relative bg-zinc-950"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none"></div>
          <video
            src="https://auvzhcet.vercel.app/LandingPage/realSense.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover opacity-80"
          />
        </motion.div>

        {/* Data sheet stats grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-950/70 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-3">
              <span className="text-zinc-400 font-space text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={12} /> Target Identification
              </span>
              <p className="text-slate-400 text-sm font-outfit font-light leading-relaxed">
                Utilizes YOLO v8 object classification architectures to identify competition targets (gates, paths, recovery buckets) in real time.
              </p>
            </div>
            <img
              alt="objectDetection1"
              className="rounded-2xl w-full border border-zinc-900 shadow-lg object-cover"
              src="https://auvzhcet.vercel.app/LandingPage/objectDetection1.png"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-950/70 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-3">
              <span className="text-zinc-400 font-space text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={12} /> Path Finding Localization
              </span>
              <p className="text-slate-400 text-sm font-outfit font-light leading-relaxed">
                Deep neural segmentation networks extract underwater visual markers, adjusting vector parameters to align heading constraints.
              </p>
            </div>
            <img
              alt="objectDetection2"
              className="rounded-2xl w-full border border-zinc-900 shadow-lg object-cover"
              src="https://auvzhcet.vercel.app/LandingPage/objectDetection2.png"
            />
          </motion.div>
        </div>
      </div>

      {/* 5. PROPULSION ENGINE (T200 Thrusters Section) */}
      <div className="z-10 w-full max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center border-t border-zinc-900/60 mb-16">
        
        {/* Video column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-6 w-full rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl relative bg-zinc-950 md:order-1 order-2"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none"></div>
          <video
            src="https://auvzhcet.vercel.app/LandingPage/thruster.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover opacity-80"
          />
        </motion.div>

        {/* Text column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-6 flex flex-col justify-center gap-5 md:order-2 order-1"
        >
          <span className="text-zinc-400 font-space text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Anchor size={12} /> Propulsion
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-extrabold font-outfit uppercase tracking-wide">
            Kraken
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-outfit font-light text-justify">
            Equipped with 6 BlueRobotics T200 thrusters, each drawing 24 amps at peak output. Features custom water-lubricated hydrocarbon bearings providing a vector displacement top speed of 5.0 m/s for rapid directional pivots.
          </p>

          {/* Staggered specs sheet */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {techSpecs.propulsion.map((spec, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl">
                <span className="text-[10px] text-zinc-500 font-bold uppercase font-space tracking-wider block">{spec.name}</span>
                <span className="text-zinc-200 text-xs sm:text-sm font-semibold mt-1 block leading-tight">{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
