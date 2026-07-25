import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Shield, Wind, Droplets, Thermometer, Gauge, AlertCircle, HelpCircle } from 'lucide-react';

export default function DepthExplorer() {
  const [depth, setDepth] = useState(0); // State-driven depth (0m to 3000m)
  const [isDragging, setIsDragging] = useState(false);
  const maxDepth = 3000;
  const containerRef = useRef(null);

  // Depth Zones configurations
  const depthZones = [
    {
      id: 'epipelagic',
      name: 'Epipelagic Zone',
      aka: 'Sunlight Zone',
      range: '0m - 200m',
      min: 0,
      max: 200,
      temp: '12°C to 20°C',
      pressure: '1 to 20 atm',
      description: 'The surface layer where sunlight is abundant, hosting over 90% of all marine life. Photosynthesis thrives here.',
      creatures: [
        {
          name: 'Bottlenose Dolphin',
          fact: 'Highly intelligent social mammals that use a series of clicks and whistles (echolocation) to hunt.',
          svg: (
            <svg viewBox="0 0 100 60" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(56,189,248,0.3)]">
              <path d="M10,35 C25,20 50,15 80,30 C90,34 95,38 98,34 C95,30 90,20 75,18 C60,16 40,22 25,30 C15,35 10,38 10,35 Z" fill="#38bdf8" />
              <path d="M45,26 C43,35 38,42 34,44 C36,38 41,30 45,26 Z" fill="#0284c7" />
              <path d="M55,18 C58,10 65,8 68,6 C64,12 60,16 55,18 Z" fill="#0284c7" />
              <path d="M10,35 C8,30 5,28 2,26 C5,34 5,38 2,44 C5,42 8,40 10,35 Z" fill="#38bdf8" />
              <circle cx="85" cy="28" r="1.5" fill="black" />
            </svg>
          )
        },
        {
          name: 'Sea Turtle',
          fact: 'Ancient ocean wanderers that travel thousands of miles between nesting beaches and feeding grounds.',
          svg: (
            <svg viewBox="0 0 100 80" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(52,211,153,0.3)]">
              <ellipse cx="50" cy="40" rx="30" ry="22" fill="#047857" stroke="#10b981" strokeWidth="2" />
              <path d="M35,40 Q50,28 65,40 Q50,52 35,40 Z" fill="#065f46" opacity="0.5" />
              <path d="M72,25 C82,15 92,12 95,15 C92,25 82,32 72,28 Z" fill="#10b981" />
              <path d="M72,55 C82,65 92,68 95,65 C92,55 82,48 72,52 Z" fill="#10b981" />
              <path d="M28,28 C20,20 12,18 10,20 C12,28 20,32 28,30 Z" fill="#059669" />
              <path d="M28,52 C20,60 12,62 10,60 C12,52 20,48 28,50 Z" fill="#059669" />
              <path d="M78,40 C85,35 92,35 95,40 C92,45 85,45 78,40 Z" fill="#10b981" />
              <circle cx="88" cy="38" r="1.5" fill="black" />
            </svg>
          )
        },
        {
          name: 'Clownfish',
          fact: 'Protected by a coating of mucus, they live in symbiosis with venomous sea anemones.',
          svg: (
            <svg viewBox="0 0 100 60" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.3)]">
              <ellipse cx="48" cy="30" rx="35" ry="20" fill="#f97316" />
              <path d="M28,12 C28,48 36,48 36,12 Z" fill="white" stroke="black" strokeWidth="1.5" />
              <path d="M52,10 C52,50 60,50 60,10 Z" fill="white" stroke="black" strokeWidth="1.5" />
              <path d="M83,30 Q92,15 96,12 Q92,30 96,48 Q92,45 83,30 Z" fill="#f97316" stroke="black" strokeWidth="1" />
              <circle cx="22" cy="24" r="3.5" fill="white" stroke="black" strokeWidth="1" />
              <circle cx="21" cy="24" r="1.5" fill="black" />
              <path d="M42,10 C46,2 50,2 52,10 Z" fill="#ea580c" />
              <path d="M42,50 C46,58 50,58 52,50 Z" fill="#ea580c" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'mesopelagic',
      name: 'Mesopelagic Zone',
      aka: 'Twilight Zone',
      range: '200m - 1000m',
      min: 200,
      max: 1000,
      temp: '4°C to 12°C',
      pressure: '20 to 100 atm',
      description: 'Only a faint glimmer of light filters down. Creatures here have adapted with huge eyes and bioluminescent capabilities.',
      creatures: [
        {
          name: 'Lanternfish',
          fact: 'Accounts for nearly 65% of all deep-sea fish biomass. Features glowing light organs (photophores) on its belly.',
          svg: (
            <svg viewBox="0 0 100 50" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(96,165,250,0.35)]">
              <path d="M10,25 C30,12 60,12 85,22 C92,25 96,22 98,25 C96,28 92,25 85,28 C60,38 30,38 10,25 Z" fill="#2563eb" />
              <circle cx="20" cy="22" r="5" fill="#fde047" stroke="#1d4ed8" strokeWidth="1.5" />
              <circle cx="21" cy="22" r="2" fill="black" />
              <circle cx="35" cy="30" r="1.5" fill="#fef08a" className="animate-ping" />
              <circle cx="45" cy="31" r="1" fill="#fef08a" />
              <circle cx="55" cy="31" r="1" fill="#fef08a" />
              <circle cx="65" cy="29" r="1" fill="#fef08a" />
              <circle cx="75" cy="27" r="1.5" fill="#fef08a" className="animate-ping" />
            </svg>
          )
        },
        {
          name: 'Vampire Squid',
          fact: 'Named for its dark color and cape-like webbing. It is a passive feeder, utilizing sensory filaments to gather marine snow.',
          svg: (
            <svg viewBox="0 0 100 70" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(225,29,72,0.35)]">
              <path d="M50,10 C35,10 32,32 32,45 C42,42 58,42 68,45 C68,32 65,10 50,10 Z" fill="#be123c" />
              <path d="M32,45 C25,58 35,65 40,55 C45,65 50,55 50,55 C50,55 55,65 60,55 C65,65 75,58 68,45 Z" fill="#9f1239" />
              <circle cx="42" cy="36" r="3" fill="#22d3ee" className="animate-pulse" />
              <circle cx="58" cy="36" r="3" fill="#22d3ee" className="animate-pulse" />
              <path d="M34,22 C26,18 28,12 32,15 Z" fill="#be123c" />
              <path d="M66,22 C74,18 72,12 68,15 Z" fill="#be123c" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'bathypelagic',
      name: 'Bathypelagic Zone',
      aka: 'Midnight Zone',
      range: '1000m - 2000m',
      min: 1000,
      max: 2000,
      temp: '4°C',
      pressure: '100 to 200 atm',
      description: 'Zero sunlight penetrates this zone. The only light source is bioluminescence. Animals have slow metabolic rates to conserve energy.',
      creatures: [
        {
          name: 'Anglerfish',
          fact: 'Uses a glowing bioluminescent rod-like lure protruding from its head to attract prey in total darkness.',
          svg: (
            <svg viewBox="0 0 100 80" className="w-20 h-20 filter drop-shadow-[0_4px_12px_rgba(253,224,71,0.25)]">
              <path d="M15,45 C20,25 45,20 70,35 C82,38 90,32 94,36 C90,44 82,42 70,55 C45,70 20,65 15,45 Z" fill="#27272a" />
              <path d="M45,28 C50,15 62,8 74,12" fill="none" stroke="#71717a" strokeWidth="2.5" />
              <circle cx="74" cy="12" r="5" fill="#fef08a" className="animate-pulse shadow-[0_0_15px_#fef08a]" />
              <path d="M15,45 Q40,48 30,62" fill="none" stroke="#27272a" strokeWidth="4" />
              <polygon points="17,45 20,49 22,45 25,50 28,46" fill="white" />
              <polygon points="18,58 21,52 24,56 27,51 29,54" fill="white" />
              <path d="M70,35 L76,32 M68,52 L74,55" stroke="#71717a" strokeWidth="2" />
              <circle cx="34" cy="36" r="3.5" fill="#fde047" />
              <circle cx="33" cy="36" r="1.5" fill="black" />
            </svg>
          )
        },
        {
          name: 'Gulper Eel',
          fact: 'Possesses a massive jaw hinged loosely, allowing it to swallow prey much larger than itself in one gulp.',
          svg: (
            <svg viewBox="0 0 120 50" className="w-24 h-16 filter drop-shadow-[0_4px_10px_rgba(113,113,122,0.3)]">
              <path d="M5,25 Q30,22 55,25 T95,20 T115,22 C115,22 95,28 55,27 Z" fill="#18181b" />
              <path d="M5,25 L42,12 L38,38 Z" fill="#27272a" stroke="#18181b" strokeWidth="2" />
              <path d="M5,25 L38,38" stroke="white" strokeWidth="1.5" strokeDasharray="2,2" />
              <circle cx="38" cy="18" r="1.2" fill="#22d3ee" />
              <circle cx="115" cy="22" r="2.2" fill="#f43f5e" className="animate-ping" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'abyssopelagic',
      name: 'Abyssopelagic Zone',
      aka: 'Abyssal Zone',
      range: '2000m - 3000m',
      min: 2000,
      max: 3000,
      temp: '2°C to 3°C',
      pressure: '200 to 300 atm',
      description: 'Extremely cold, highly pressured, and dark. The sea floor begins here, covered in nutrient-rich marine snow.',
      creatures: [
        {
          name: 'Dumbo Octopus',
          fact: 'Named after the ear-like fins on its head which it flaps to navigate gracefully through deep waters.',
          svg: (
            <svg viewBox="0 0 100 80" className="w-20 h-16 filter drop-shadow-[0_4px_10px_rgba(167,139,250,0.35)]">
              <ellipse cx="50" cy="42" rx="22" ry="24" fill="#a78bfa" />
              <path d="M30,30 Q15,25 22,15 Q30,18 34,26 Z" fill="#c084fc" />
              <path d="M70,30 Q85,25 78,15 Q70,18 66,26 Z" fill="#c084fc" />
              <circle cx="40" cy="40" r="4.5" fill="black" />
              <circle cx="38.5" cy="38.5" r="1.5" fill="white" />
              <circle cx="60" cy="40" r="4.5" fill="black" />
              <circle cx="58.5" cy="38.5" r="1.5" fill="white" />
              <path d="M32,58 C25,68 35,74 40,65 C45,74 50,65 50,65 C50,65 55,74 60,65 C65,74 75,68 68,58 Z" fill="#8b5cf6" />
            </svg>
          )
        },
        {
          name: 'Giant Isopod',
          fact: 'Bottom-dwelling scavenger related to pillbugs. Can grow up to 30 cm in length due to deep-sea gigantism.',
          svg: (
            <svg viewBox="0 0 100 50" className="w-20 h-14 filter drop-shadow-[0_4px_10px_rgba(100,116,139,0.3)]">
              <ellipse cx="50" cy="25" rx="36" ry="18" fill="#64748b" stroke="#475569" strokeWidth="2" />
              <line x1="26" y1="9" x2="26" y2="41" stroke="#334155" strokeWidth="2.5" />
              <line x1="38" y1="7" x2="38" y2="43" stroke="#334155" strokeWidth="2.5" />
              <line x1="50" y1="7" x2="50" y2="43" stroke="#334155" strokeWidth="2.5" />
              <line x1="62" y1="7" x2="62" y2="43" stroke="#334155" strokeWidth="2.5" />
              <line x1="74" y1="9" x2="74" y2="41" stroke="#334155" strokeWidth="2.5" />
              <polygon points="18,20 14,24 18,28" fill="#fde047" />
              <path d="M34,42 Q30,52 24,48 M46,43 Q42,53 36,49 M58,43 Q54,53 48,49 M70,42 Q66,52 60,48" fill="none" stroke="#475569" strokeWidth="2" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'hadalpelagic',
      name: 'Hadalpelagic Zone',
      aka: 'Trench Zone',
      range: '3000m+',
      min: 3000,
      max: 3000,
      temp: '1°C to 4°C',
      pressure: '300+ atm',
      description: 'Found inside deep ocean trenches. The pressure is equivalent to an elephant standing on your thumb. Extreme adaptations.',
      creatures: [
        {
          name: 'Tube Worms',
          fact: 'Thrive around hydrothermal vents, converting toxic chemicals into energy using symbiotic bacteria.',
          svg: (
            <svg viewBox="0 0 80 100" className="w-16 h-20 filter drop-shadow-[0_4px_10px_rgba(239,68,68,0.25)]">
              <path d="M25,90 L30,20 L38,20 L35,90 Z" fill="#d4d4d4" stroke="#a3a3a3" strokeWidth="1.5" />
              <path d="M29,20 Q34,10 39,20 Z" fill="#ef4444" />
              <path d="M45,90 L48,35 L55,35 L52,90 Z" fill="#e5e5e5" stroke="#a3a3a3" strokeWidth="1.5" />
              <path d="M47,35 Q51.5,25 56,35 Z" fill="#ef4444" />
              <path d="M60,90 L58,45 L64,45 L66,90 Z" fill="#c2c2c2" stroke="#8a8a8a" strokeWidth="1.5" />
              <path d="M57.5,45 Q61,37 64.5,45 Z" fill="#dc2626" />
            </svg>
          )
        }
      ]
    }
  ];

  // Dynamic light falloff color stops
  const getBackgroundColor = (val) => {
    const p = val / maxDepth;
    const stops = [
      { p: 0, r: 2, g: 8, b: 20 },         // 0m (Midnight blue/black surface)
      { p: 0.067, r: 1, g: 5, b: 12 },     // 200m (End of Epipelagic)
      { p: 0.333, r: 0, g: 3, b: 8 },      // 1000m (End of Mesopelagic)
      { p: 0.667, r: 0, g: 1, b: 4 },      // 2000m (End of Bathypelagic)
      { p: 1.0, r: 0, g: 0, b: 1 }         // 3000m (Hadal absolute black)
    ];

    for (let i = 0; i < stops.length - 1; i++) {
      const s1 = stops[i];
      const s2 = stops[i + 1];
      if (p >= s1.p && p <= s2.p) {
        const ratio = (p - s1.p) / (s2.p - s1.p);
        const r = Math.round(s1.r + (s2.r - s1.r) * ratio);
        const g = Math.round(s1.g + (s2.g - s1.g) * ratio);
        const b = Math.round(s1.b + (s2.b - s1.b) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    return 'rgb(0, 0, 0)';
  };

  const activeZone = (() => {
    if (depth < 200) return depthZones[0];
    if (depth < 1000) return depthZones[1];
    if (depth < 2000) return depthZones[2];
    if (depth < 3000) return depthZones[3];
    return depthZones[4];
  })();

  const isBioluminescent = depth >= 1000;
  const particles = [
    { top: '15%', left: '20%', delay: 0, size: 'w-2 h-2' },
    { top: '25%', left: '80%', delay: 1, size: 'w-1 h-1' },
    { top: '45%', left: '15%', delay: 3, size: 'w-1.5 h-1.5' },
    { top: '55%', left: '75%', delay: 2, size: 'w-2 h-2' },
    { top: '70%', left: '30%', delay: 4, size: 'w-1 h-1' },
    { top: '85%', left: '60%', delay: 0.5, size: 'w-2 h-2' },
  ];

  // Dynamic light beam opacity based on depth
  const beamOpacity = Math.max(0, 0.4 - (depth / 1000));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[94vh] mt-12 flex flex-col items-center justify-center text-gray-100 font-outfit selection:bg-cyan-500/30 overflow-hidden transition-colors duration-[800ms]"
      style={{ backgroundColor: getBackgroundColor(depth) }}
    >
      {/* Dynamic Water Caustic Effect (Light Beam) */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none transition-opacity duration-700 z-0"
        style={{ opacity: beamOpacity }}
      ></div>

      {/* Bioluminescent Particle Overlays */}
      <AnimatePresence>
        {isBioluminescent && particles.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.2, 0.9, 0.2], 
              scale: [1, 1.2, 1],
              y: [0, -10, 0] 
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
            className={`absolute rounded-full bg-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.9)] ${p.size} z-0`}
            style={{
              top: p.top,
              left: p.left,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Title Header */}
      <div className="absolute top-8 text-center z-20 select-none">
        <span className="text-cyan-400 text-xs font-space font-bold tracking-[0.25em] uppercase">
          MTS AUV-ZHCET Mission Control
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-outfit text-white uppercase tracking-wider mt-1 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          Ocean Depths
        </h1>
      </div>

      {/* Dynamic 3-Column HUD Grid */}
      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 md:px-12 relative h-[70%] mt-8">
        
        {/* COLUMN 1: Custom Depth Slider Track */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-full relative">
          <span className="text-[10px] text-zinc-500 font-space font-bold uppercase mb-4 tracking-widest">
            0m Surface
          </span>

          <div className="relative h-[48vh] w-14 flex justify-center items-center">
            {/* Track Line with Glow */}
            <div className="absolute h-full w-[4px] bg-zinc-900 rounded-full border border-zinc-800/40"></div>
            <div 
              className="absolute w-[2px] bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ height: `${(depth / maxDepth) * 100}%`, top: 0 }}
            ></div>
            
            {/* Ticks */}
            {[0, 500, 1000, 1500, 2000, 2500, 3000].map((t) => (
              <div
                key={t}
                className="absolute left-0 flex items-center"
                style={{ top: `${(t / maxDepth) * 100}%` }}
              >
                <div className="w-4 h-[1px] bg-zinc-800"></div>
                <span className="text-[9px] text-zinc-600 font-space font-extrabold ml-3">{t}m</span>
              </div>
            ))}

            {/* Glowing Pointer */}
            <motion.div
              className="absolute left-[-46px] -translate-y-1/2 flex items-center gap-2 cursor-grab active:cursor-grabbing z-40"
              style={{ top: `${(depth / maxDepth) * 100}%` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Floating Tooltip */}
              <div className="absolute left-[-50px] bg-cyan-500 text-black text-[9px] font-bold font-space px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {depth}m
              </div>
              <svg viewBox="0 0 36 24" className="w-10 h-7 text-cyan-400 fill-current drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]">
                <rect x="6" y="4" width="24" height="12" rx="3" />
                <circle cx="12" cy="16" r="2.5" />
                <circle cx="24" cy="16" r="2.5" />
                <rect x="14" y="6" width="8" height="3" rx="1" fill="black" />
                <polygon points="30,8 33,10 33,14 30,16" className="text-cyan-500 fill-current" />
              </svg>
            </motion.div>

            {/* Ranger input overlay */}
            <input
              type="range"
              min="0"
              max={maxDepth}
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              className="absolute h-full w-14 opacity-0 cursor-row-resize z-50"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
          </div>

          <span className="text-[10px] text-zinc-500 font-space font-bold uppercase mt-4 tracking-widest">
            3000m Hadal
          </span>
        </div>

        {/* COLUMN 2: Center Sonar HUD & Zone details */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          {/* Sonar / Radar HUD */}
          <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
            {/* Spinning Radar Ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/10 border-t-cyan-500/80 animate-spin" style={{ animationDuration: '6s' }}></div>
            <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/20"></div>
            <div className="absolute inset-8 rounded-full border border-cyan-500/5"></div>
            
            {/* Central Depth value readout */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-[9px] font-mono text-cyan-400 tracking-[0.2em] uppercase font-bold">Sonar Depth</span>
              <div className="text-5xl font-black font-outfit text-white tracking-wide mt-1 flex items-baseline">
                {depth}
                <span className="text-lg font-light text-cyan-400 ml-0.5 font-space">m</span>
              </div>
              <span className="text-[9px] text-zinc-500 font-space uppercase mt-1">Status: Operational</span>
            </div>
          </div>

          {/* Active Zone Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeZone.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-zinc-950/70 border border-zinc-900/60 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              
              <span className="text-[9px] font-space text-zinc-500 tracking-[0.25em] uppercase block mb-1">
                Diving Layer
              </span>
              <h2 className="text-2xl font-bold font-outfit text-white uppercase tracking-wider">
                {activeZone.name}
              </h2>
              <p className="text-cyan-400 text-xs font-space font-semibold uppercase mt-0.5 tracking-widest">
                Alias: {activeZone.aka} | Range: {activeZone.range}
              </p>

              <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed font-outfit font-light text-justify border-t border-zinc-900/60 pt-4">
                {activeZone.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-zinc-900/60 text-left">
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-900/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Thermometer size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase block font-space">Temperature</span>
                    <span className="text-zinc-200 font-bold text-xs mt-0.5 block">{activeZone.temp}</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-900/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Gauge size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase block font-space">Pressure</span>
                    <span className="text-zinc-200 font-bold text-xs mt-0.5 block">{activeZone.pressure}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* COLUMN 3: Species Showcase Grid */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
          <h3 className="text-cyan-400 font-space text-xs tracking-widest font-bold uppercase border-b border-zinc-900/60 pb-2 mb-2 text-center lg:text-left">
            Layer Species
          </h3>

          <div className="flex flex-col gap-4 min-h-[220px] justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeZone.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {activeZone.creatures.map((creature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-zinc-950/60 border border-zinc-900/60 rounded-2xl p-4 flex gap-4 items-center shadow-xl hover:border-cyan-900/30 transition-all duration-300"
                  >
                    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-2 flex items-center justify-center shrink-0 w-16 h-16">
                      {creature.svg}
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white font-bold font-space text-sm tracking-wider uppercase">
                        {creature.name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 font-outfit leading-relaxed font-light">
                        {creature.fact}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Drag tip */}
      <div className="absolute bottom-8 text-center select-none pointer-events-none z-20">
        <span className="text-[9px] text-cyan-500/50 font-space font-bold uppercase tracking-widest animate-pulse">
          Drag the AUV pointer vertically to dive
        </span>
      </div>

    </motion.div>
  );
}
