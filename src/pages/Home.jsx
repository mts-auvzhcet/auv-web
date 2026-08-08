import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Anchor, Cpu, Navigation, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCollection, addItem } from '../lib/store';
import { uploadImage } from '../lib/cloudinary';
import SplitText from '../components/SplitText';
import { useStore } from '../lib/useStore';
import { createSlug } from '../lib/utils';
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';

function OpenFormCard({ form }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  const setField = (key, value) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const handleImageField = async (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(key);
    try {
      const url = await uploadImage(file);
      setField(key, url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addItem(
        'recruitments',
        {
          formId: form.id,
          version: form.version || 1,
          ...answers,
          submittedAt: new Date().toISOString(),
        },
        { username: answers.name || 'applicant', role: 'applicant' },
      );
      setSubmitted(true);
    } catch (err) {
      console.error('[form submit] failed', err);
      alert('Something went wrong submitting the form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
        <p className="text-sm text-green-300 font-medium">Thanks — your response has been submitted!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-zinc-900 bg-zinc-950/60 p-5 flex flex-col gap-4">
      {(form.fields || [])
        .filter((f) => f.type !== 'display_image')
        .map((field) => (
          <label key={field.id} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-space uppercase tracking-wider text-zinc-400 font-bold">
              {field.label}{field.required && ' *'}
            </span>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                rows={3}
                value={answers[field.id] || ''}
                onChange={(e) => setField(field.id, e.target.value)}
                className="bg-black/30 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/60 resize-y"
              />
            ) : field.type === 'image' ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingField === field.id}
                  required={field.required && !answers[field.id]}
                  onChange={(e) => handleImageField(field.id, e)}
                  className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 disabled:opacity-50"
                />
                {uploadingField === field.id && <span className="text-[10px] text-sky-400 animate-pulse block mt-1">Uploading...</span>}
              </>
            ) : (
              <input
                type="text"
                required={field.required}
                value={answers[field.id] || ''}
                onChange={(e) => setField(field.id, e.target.value)}
                className="bg-black/30 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/60"
              />
            )}
          </label>
        ))}
      <button
        type="submit"
        disabled={submitting || !!uploadingField}
        className="self-start bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-space font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

const DepthGauge = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setScrollPercent(window.scrollY / docHeight);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const depthMarkers = [0, 100, 300, 500, 1000, 1500, 2000, 2500, 3000];
  const currentDepth = Math.round(scrollPercent * 3000);

  return (
    <div className="hidden xl:flex fixed left-8 top-[20vh] h-[60vh] w-16 z-50 flex-col items-center justify-between text-zinc-500 font-space text-[9px] pointer-events-none select-none border-l border-zinc-800/30 pl-4">
      <div className="relative h-full w-full flex flex-col justify-between">
        <div 
          className="absolute left-[-17px] w-3 h-[1.5px] bg-sky-500 transition-all duration-75 shadow-[0_0_8px_#0ea5e9]"
          style={{ top: `${scrollPercent * 100}%` }}
        />
        {depthMarkers.map((marker, idx) => {
          const active = Math.abs(currentDepth - marker) < 180;
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className={`h-[1px] w-1.5 bg-zinc-800/40 ${active ? 'bg-sky-500 w-3' : ''}`} />
              <span className={`transition-colors duration-300 ${active ? 'text-sky-400 font-bold' : 'text-zinc-500'}`}>
                {marker} m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Home() {
  useStore();
  const [activeFleetIndex, setActiveFleetIndex] = useState(4); // Default to SEA 5.0
  const [isFleetDropdownOpen, setIsFleetDropdownOpen] = useState(false);
  const fleetDropdownRef = useRef(null);
  const [activeTab, setActiveTab] = useState('specs'); // specs, subsystems, mission
  const [subsystemTab, setSubsystemTab] = useState('mech');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fleetDropdownRef.current && !fleetDropdownRef.current.contains(event.target)) {
        setIsFleetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fallbackFleet = [
    {
      name: 'SEA 1.0',
      tagline: 'Foundation AUV Platform',
      img: 'https://auvzhcet.vercel.app/auvs/sea1.0.png',
      desc: 'Our first prototype, built to validate basic sealing mechanisms, rotary thruster vectoring, and manual navigation overrides.',
      specs: { thrusters: '3 Thrusters', dof: '4 (Rotary Mounts)', depth: '25 meters', speed: '1 knot', endurance: '40 mins', weight: '15 kg' },
      mission: 'Validated subsea waterproofing seals and basic motor telemetry controls in pool depth test environments.',
      subsystems: {
        mech: 'Rotary thrusters mount provides vectoring thrust via servo motors. First prototype of the safina series.',
        elec: 'Simple power switch system, ESC controllers, and tethered data line.',
        soft: 'Basic motor controls and manual heading override stacks.',
      }
    },
    {
      name: 'SEA 2.0',
      tagline: 'Hydrodynamic Prototype',
      img: 'https://auvzhcet.vercel.app/auvs/sea2.0.png',
      desc: 'Designed with improved hulls to optimize underwater stability. Achieved heading and depth hold via tuned PID controllers.',
      specs: { thrusters: '4 Thrusters', dof: '4 DoF', depth: '25 meters', speed: '1.2 knots', endurance: '50 mins', weight: '18 kg' },
      mission: 'Conducted automated heading hold drills and depth profile sweeps utilizing a closed-loop PID controller.',
      subsystems: {
        mech: 'Constructed using PVC and acrylic tubes. Dual-compartment frame separates battery and electronics.',
        elec: 'Basic battery management system with analog voltage sensors and tethered control option.',
        soft: 'Proportional-Integral-Derivative (PID) controller tuning for basic depth and heading hold.',
      }
    },
    {
      name: 'SEA 3.0',
      tagline: 'Stereo Vision Explorer',
      img: 'https://auvzhcet.vercel.app/auvs/sea3.0.png',
      desc: 'Incorporated forward-facing stereo cameras to perform visual targeting, line tracing, and autonomous gate navigation.',
      specs: { thrusters: '4 Thrusters', dof: '4 DoF', depth: '50 meters', speed: '2 knots', endurance: '90 mins', weight: '24 kg' },
      mission: 'Successfully navigated obstacle gates and completed underwater marker trace tasks autonomously.',
      subsystems: {
        mech: 'Lightweight structure optimized for academic pool tests. Incorporates external modular payloads.',
        elec: 'Utilizes Raspberry Pi 4 for primary navigation computing and Pixhawk for flight control stabilization.',
        soft: 'Features basic color thresholding vision pipelines to trace lines and navigate through gates.',
      }
    },
    {
      name: 'SEA 4.0',
      tagline: 'High-Endurance Acoustic Surveyor',
      img: 'https://auvzhcet.vercel.app/auvs/sea4.0.jpg',
      desc: 'Configured with 6 vectored thrusters to allow lateral strafing. Features a 3-hydrophone array for underwater acoustic localization.',
      specs: { thrusters: '6 Vectored', dof: '6 DoF', depth: '50 meters', speed: '2 knots', endurance: '60 mins', weight: '28 kg' },
      mission: 'Executed deep acoustic sweeps and localized underwater sound beacons using hydrophone arrays.',
      subsystems: {
        mech: 'Vectored thruster configuration allows lateral translation without pitching. Single hull structure with machined end-caps and double O-ring sealings for reliable waterproofing.',
        elec: 'Features an Arduino/Raspberry Pi communications bridge, custom ESC control boards, and leak detection sensor arrays.',
        soft: 'Implements acoustic source localization algorithm using a 3-hydrophone array to navigate toward underwater pingers.',
      }
    },
    {
      name: 'SEA 5.0',
      tagline: 'Flagship Autonomous Vehicle',
      img: 'https://auvzhcet.vercel.app/auvs/sea5.0.png',
      desc: 'Our latest monohull vehicle under development. Houses the Nvidia Jetson processing stack, RealSense depth camera, and high-thrust vector motors.',
      specs: { thrusters: '6 T200', dof: '6 (Full DoF)', depth: '100 meters', speed: '4 knots', endurance: '60 mins', weight: '32 kg' },
      mission: 'Flagship marine challenge platform for high-precision autonomous navigation and Real-time YOLO target locking.',
      subsystems: {
        mech: 'Features a modular double hull layout crafted from carbon fiber and high-strength acrylic. Anodized aluminum framework ensures drag reduction and optimal balancing of center of gravity and buoyancy.',
        elec: 'Equipped with custom power distribution boards, lithium-polymer batteries, and Nvidia Jetson Xavier AGX. Sensory inputs include a DVL, IMU, pressure sensor, and front-bottom camera interfaces.',
        soft: 'Runs ROS 2 (Robot Operating System) on Linux. Implements deep-learning based YOLO object detection for underwater target acquisition and Extended Kalman Filter (EKF) for state estimation.',
      }
    },
  ];

  // Use DB vehicles. Fall back to hardcoded only if DB is empty (pre-seed).
  const storeFleet = getCollection('vehicles').map((v) => ({
    name: v.name || 'Unnamed',
    tagline: v.tagline || '',
    img: v.img || v.imageUrl || v.imageBase64 || '',
    videourl: v.videourl || '',
    desc: v.desc || v.description || '',
    specs: {
      thrusters: v.thrusters || '', dof: v.dof || '', depth: v.depth || '',
      speed: v.speed || '', endurance: v.endurance || '', weight: v.weight || '',
    },
    mission: v.mission || '',
    subsystems: {
      mech: v.mech || '', elec: v.elec || '', soft: v.soft || '',
    },
  }));
  // Only show hardcoded fallback if DB has nothing seeded yet
  const fleet = storeFleet.length > 0 ? storeFleet : fallbackFleet;

  // Wisdom Slides (Advisory Board)
  const storeAdvisory = getCollection('advisory').map(item => ({
    name: item.name,
    role: item.role,
    img: item.imageBase64 || item.img || 'https://auvzhcet.vercel.app/Team/no.jpg',
    text: item.text
  }));

  const fallbackWisdomSlides = [
    {
      name: 'Prof. Naima Khatoon',
      role: 'Vice Chancellor',
      img: 'https://auvzhcet.vercel.app/teachers/nk.jpg',
      text: 'It is quite inspiring to watch and witness the potential of the students of AUV-ZHCET Club unfold at various stages day by day. The students relentlessly put forward their best efforts in various activities and competitions. They have grown tremendously and have brought laurels and accolades to AMU both nationally and internationally, recently being placed first in the National AMU ROV Competition (2022), organized by Aligarh Muslim University.',
    },
    {
      name: 'Prof. Mirza Salim Beg',
      role: 'Dean, Faculty of Engineering & Technology',
      img: 'https://auvzhcet.vercel.app/teachers/msb.jpg',
      text: 'The MTS AUV-ZHCET is a student club that works on autonomous and remotely operated vehicles. They have participated in several international and national events, including being among the top 25% performers in the Singapore AUV Challenge 2022. I wish every member of the club success and a bright future.',
    },
    {
      name: 'Prof. M. M. Sufyan Beg',
      role: 'Former Principal, ZHCET',
      img: 'https://auvzhcet.vercel.app/teachers/sb.jpg',
      text: 'MTS AUV-ZHCET embrace the sharing of knowledge by hosting insightful workshops on the workings of ROVs, and undertaking classes in machine learning, Arduino, raspberry pi, and sensors. I congratulate the team for putting up sincere efforts.',
    },
  ];

  const wisdomSlides = storeAdvisory.length > 0 ? storeAdvisory : fallbackWisdomSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % wisdomSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // News Accordion State
  const [openAccordion, setOpenAccordion] = useState('projects');
  const openCustomForms = getCollection('forms').filter((f) => f.isOpen && !f.isRecruitment);
  const newsItems = [
    {
      id: 'projects',
      title: 'Open Projects',
      content: 'We have active openings for undergraduate researchers in machine learning, computer vision, and CFD modeling.',
    },
  ];

  const currentVehicle = fleet[activeFleetIndex];

  return (
    <div className="min-h-screen text-zinc-900 relative transition-all duration-350 overflow-hidden">

      {/* Fixed background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617]" />
      
      {/* Gravity Stars Background effect (Pointer events none so it doesn't block clicks, but reacts to window mouse events) */}
      <GravityStarsBackground className="fixed inset-0 w-full h-full z-[1] text-white opacity-60 pointer-events-none" />
      
      {/* Fixed Submarine Depth Gauge (renders ONLY on Home page) */}
      {/* <DepthGauge /> */}

      {/* Gentle bioluminescent particles background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-sky-400/20 rounded-full blur-[1px] animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-sky-300/10 rounded-full blur-[1px] animate-[pulse_6s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-[30%] left-[10%] w-2 h-2 bg-sky-400/20 rounded-full blur-[1px] animate-[pulse_5s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[10%] right-[30%] w-1 h-1 bg-sky-300/30 rounded-full blur-[0.5px] animate-[pulse_4s_ease-in-out_infinite_3s]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-6 pt-20">
        
        {/* Background Video */}
        <motion.video 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-[5]"
        >
          <source src="/AUV_Animation.mp4" type="video/mp4" />
        </motion.video>

        {/* Gradient Overlay for blending */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0f1d] z-[6]"
        ></motion.div>

        <div className="max-w-4xl text-center flex flex-col gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            <span className="text-sky-400 font-space text-xs font-semibold tracking-wider uppercase block">
              Autonomous Systems & Exploration
            </span>
            <SplitText
              tag="h1"
              text="MTS AUV ZHCET"
              className="text-6xl sm:text-8xl font-black font-outfit text-white tracking-tight leading-none uppercase drop-shadow-2xl"
              splitType="chars"
              delay={50}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="center"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-zinc-200 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed mt-2 drop-shadow-md"
            >
              Designing, building, and deploying advanced autonomous underwater vehicles at Aligarh Muslim University.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION (Sunlight to Twilight Transition) */}
      <section className="py-32 px-6 max-w-6xl mx-auto z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
        >
          
          <div className="lg:col-span-12 flex flex-col gap-6 text-white">
            <div>
              <span className="text-sky-400 text-xs font-semibold tracking-wider font-space uppercase">
                Introduction
              </span>
              <h2 className="text-4xl sm:text-5xl font-black font-outfit text-white uppercase tracking-tight mt-1">
                A Legacy of Underwater Exploration
              </h2>
            </div>
            
            <p className="text-zinc-300 text-sm leading-relaxed text-justify font-light">
              MTS AUV-ZHCET is a student research club established under the Marine Technology Society. We consist of software developers, electrical designers, and mechanical designers building custom subsea systems.
            </p>

            <div className="flex flex-col gap-4 border-l-2 border-sky-500 pl-5 py-0.5 mt-2">
              <div>
                <span className="text-white font-bold font-space text-xs tracking-wider uppercase block">Research Organization:</span>
                <p className="text-zinc-300 mt-1 font-light text-xs sm:text-sm">We construct pressure vessels, leak sensor circuits, and real-time vision pipelines.</p>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 3. VEHICLES SECTION (Cinematic presentation panels - Deep Ocean Navy) */}
      <section className="py-32 border-t border-white/5 relative z-10 text-white bg-black/20">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto px-6 mb-16"
        >
          <span className="text-sky-400 font-space text-xs font-semibold tracking-wider uppercase block mb-1">
            Engineering Fleet
          </span>
          <h2 className="font-black font-outfit text-4xl sm:text-5xl uppercase tracking-wider">
            Vehicle Showcases
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          
          {/* Desktop list selector */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
            {fleet.map((item, index) => {
              const active = activeFleetIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveFleetIndex(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 font-space uppercase tracking-wider ${
                    active
                      ? 'bg-sky-500/10 border-sky-500/50 text-sky-300 font-semibold shadow-lg shadow-sky-500/10'
                      : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:bg-zinc-950/80 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile dropdown selector */}
          <div ref={fleetDropdownRef} className="lg:hidden relative z-20 w-full mb-2">
            <button
              onClick={() => setIsFleetDropdownOpen(!isFleetDropdownOpen)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 text-zinc-400 hover:text-white hover:border-zinc-700 font-space uppercase tracking-wider shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-sky-400 font-bold tracking-widest block mb-0.5">Select Vehicle</span>
                <span className="text-sm font-extrabold text-white">{currentVehicle.name}</span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-sky-400 transition-transform duration-300 ${isFleetDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isFleetDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 bg-zinc-950/90 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md z-30"
                >
                  <div className="py-1">
                    {fleet.map((item, index) => {
                      const active = activeFleetIndex === index;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveFleetIndex(index);
                            setIsFleetDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-4 border-b border-zinc-900/50 last:border-b-0 transition-colors duration-200 flex items-center justify-between font-space uppercase tracking-wider cursor-pointer ${
                            active
                              ? 'bg-sky-500/10 text-sky-300 font-semibold'
                              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold">{item.name}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active vehicle cinematic panel */}
          <div className="lg:col-span-9 bg-zinc-950/60 border border-sky-500/10 p-8 rounded-2xl shadow-xl shadow-sky-500/5 backdrop-blur-md relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            
            {/* Visual element backdrop: slow propeller rotation animation */}
            <div className="absolute right-[5%] top-[10%] w-24 h-24 border border-sky-500/20 rounded-full flex items-center justify-center opacity-40">
              <div 
                className="w-1.5 h-16 bg-sky-400/50 rounded-full animate-[spin_3s_linear_infinite]"
                style={{ animationDuration: `${activeFleetIndex === 4 ? '1s' : '4s'}` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFleetIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-grow w-full"
              >
                
                {/* Cinematic Float Animation AUV Visual */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[250px]">
                  {/* Slow floating translation */}
                  <div className="relative w-full flex justify-center">
                    <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full scale-75" />
                    {currentVehicle.videoUrl ? (
                      <video
                        src={currentVehicle.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-[240px] object-contain relative filter drop-shadow-[0_15px_35px_rgba(56,189,248,0.25)]"
                      />
                    ) : (
                      <img
                        src={currentVehicle.img}
                        alt={currentVehicle.name}
                        className="max-h-[240px] object-contain relative filter drop-shadow-[0_15px_35px_rgba(56,189,248,0.25)]"
                      />
                    )}
                  </div>
                </div>

                {/* Panel Details & Tabs */}
                <div className="md:col-span-7 flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex justify-between items-baseline border-b border-zinc-900 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold font-space text-sky-400 uppercase tracking-widest block">
                        {currentVehicle.tagline}
                      </span>
                      <h3 className="text-3xl font-extrabold font-outfit uppercase tracking-wide text-white">
                        {currentVehicle.name}
                      </h3>
                    </div>
                  </div>

                  {/* Panel navigation menu tabs */}
                  <div className="flex gap-4 border-b border-zinc-900 pb-px mb-4 font-space text-xs uppercase tracking-wider">
                    {[
                      { id: 'specs', name: 'Specs' },
                      { id: 'subsystems', name: 'Subsystems' },
                      { id: 'mission', name: 'Mission Info' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 transition-colors border-b-2 font-bold ${
                          activeTab === tab.id ? 'border-sky-400 text-sky-300' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Tab contents (Premium technical spec panel styling) */}
                  <div className="min-h-[140px] text-xs sm:text-sm text-zinc-400 font-outfit font-light leading-relaxed">
                    {activeTab === 'specs' && (
                      <div className="grid grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                        {Object.entries(currentVehicle.specs).map(([key, val]) => (
                          <div key={key} className="flex flex-col border-b border-zinc-900/40 pb-1.5 last:border-0">
                            <span className="text-sky-400/80 font-space text-[9px] uppercase font-bold tracking-wider">{key}</span>
                            <span className="text-zinc-200 mt-0.5 font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'mission' && (
                      <p className="border-l border-zinc-500 pl-4 py-0.5 italic">{currentVehicle.mission}</p>
                    )}

                    {activeTab === 'subsystems' && (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          {['mech', 'elec', 'soft'].map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSubsystemTab(sub)}
                              className={`px-3 py-1 rounded text-[10px] font-space font-bold border transition-colors uppercase ${
                                subsystemTab === sub
                                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                                  : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-350'
                              }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                        <p className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-lg">
                          {currentVehicle.subsystems[subsystemTab]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        </motion.div>
      </section>

      {/* 4. ADVISORY BOARD (Slow Auto-Sliding Carousel) */}
      <section className="py-28 relative z-10 bg-black/20 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center font-bold font-outfit text-4xl sm:text-5xl tracking-tight leading-none mb-16"
        >
          Words of Wisdom by our very own!
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full max-w-5xl mx-auto px-4 min-h-[400px] flex items-center justify-center"
        >
          {wisdomSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`transition-all duration-[800ms] absolute left-4 right-4 ${
                idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="relative max-w-4xl mx-auto mt-12">
                {/* Image overlapping the top border */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shadow-xl">
                    <img
                      alt={slide.name}
                      className="object-cover w-full h-full"
                      src={slide.img}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-600 p-8 pt-16 flex flex-col items-center justify-center bg-zinc-900/60 shadow-2xl">
                  <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed text-justify mb-8 px-4 sm:px-8">
                    {slide.text}
                  </p>
                  <div className="text-center font-outfit pb-2">
                    <span className="text-lg font-bold text-zinc-100 block">{slide.name}</span>
                    <span className="text-sm text-zinc-400 font-medium mt-1 block">
                      {slide.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 5. LATEST NEWS ACCORDION */}
      <section className="py-28 px-6 max-w-3xl mx-auto relative z-10 border-t border-white/5 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center font-bold font-outfit text-3xl uppercase tracking-wider mb-10"
        >
          Latest News
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="border border-zinc-900/80 rounded-xl overflow-hidden bg-zinc-950/60"
        >
          {newsItems.map((item, idx) => {
            const isOpen = openAccordion === item.id;
            return (
              <div key={idx} className="border-b border-zinc-900 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-zinc-350 hover:text-white font-space font-bold text-sm uppercase tracking-wider"
                >
                  <span>{item.title}</span>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-sky-400' : ''}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-zinc-900/60' : 'max-h-0'}`}>
                  <p className="p-5 text-xs sm:text-sm text-zinc-400 font-light font-outfit bg-black/20">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}

          {openCustomForms.map((form) => (
            <Link
              key={form.id}
              to={`/forms/${createSlug(form.title) || form.id}`}
              className="w-full flex items-center justify-between p-5 text-left text-zinc-350 hover:text-white font-space font-bold text-sm uppercase tracking-wider border-b border-zinc-900 last:border-0 transition-colors"
            >
              <span>{form.title}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </motion.div>

        {/* Career / Recruitment CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-zinc-400 text-xs sm:text-sm font-light font-outfit">
            Want to build the future of marine robotics? We are recruiting.
          </p>
          <Link
            to="/recruitment"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white font-space uppercase tracking-wider transition-colors duration-200 hover-spring hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            Apply Now
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
