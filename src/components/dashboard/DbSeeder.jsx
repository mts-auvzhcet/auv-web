/**
 * DbSeeder.jsx
 * One-time seeder for the developer dashboard.
 * Seeds all hardcoded site data (members, vehicles, advisory board) into Neon DB.
 * Checks first — won't duplicate data if already seeded.
 */
import { useState } from "react";
import { Database, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { getCollection, getMembers, addItem, updateItem, addMember, updateMember } from "../../lib/store";
import { useStore } from "../../lib/useStore";
import { useAuth } from "../../context/AuthContext";

// ---------------------------------------------------------------------------
// Hardcoded data to seed
// ---------------------------------------------------------------------------
const SEED_VEHICLES = [
  {
    name: "SEA 1.0", tagline: "Foundation AUV Platform",
    img: "https://auvzhcet.vercel.app/auvs/sea1.0.png",
    desc: "Our first prototype, built to validate basic sealing mechanisms, rotary thruster vectoring, and manual navigation overrides.",
    thrusters: "3 Thrusters", dof: "4 (Rotary Mounts)", depth: "25 meters", speed: "1 knot", endurance: "40 mins", weight: "15 kg",
    mission: "Validated subsea waterproofing seals and basic motor telemetry controls in pool depth test environments.",
    mech: "Rotary thrusters mount provides vectoring thrust via servo motors. First prototype of the safina series.",
    elec: "Simple power switch system, ESC controllers, and tethered data line.",
    soft: "Basic motor controls and manual heading override stacks.",
  },
  {
    name: "SEA 2.0", tagline: "Hydrodynamic Prototype",
    img: "https://auvzhcet.vercel.app/auvs/sea2.0.png",
    desc: "Designed with improved hulls to optimize underwater stability. Achieved heading and depth hold via tuned PID controllers.",
    thrusters: "4 Thrusters", dof: "4 DoF", depth: "25 meters", speed: "1.2 knots", endurance: "50 mins", weight: "18 kg",
    mission: "Conducted automated heading hold drills and depth profile sweeps utilizing a closed-loop PID controller.",
    mech: "Constructed using PVC and acrylic tubes. Dual-compartment frame separates battery and electronics.",
    elec: "Basic battery management system with analog voltage sensors and tethered control option.",
    soft: "Proportional-Integral-Derivative (PID) controller tuning for basic depth and heading hold.",
  },
  {
    name: "SEA 3.0", tagline: "Stereo Vision Explorer",
    img: "https://auvzhcet.vercel.app/auvs/sea3.0.png",
    desc: "Incorporated forward-facing stereo cameras to perform visual targeting, line tracing, and autonomous gate navigation.",
    thrusters: "4 Thrusters", dof: "4 DoF", depth: "50 meters", speed: "2 knots", endurance: "90 mins", weight: "24 kg",
    mission: "Successfully navigated obstacle gates and completed underwater marker trace tasks autonomously.",
    mech: "Lightweight structure optimized for academic pool tests. Incorporates external modular payloads.",
    elec: "Utilizes Raspberry Pi 4 for primary navigation computing and Pixhawk for flight control stabilization.",
    soft: "Features basic color thresholding vision pipelines to trace lines and navigate through gates.",
  },
  {
    name: "SEA 4.0", tagline: "High-Endurance Acoustic Surveyor",
    img: "https://auvzhcet.vercel.app/auvs/sea4.0.jpg",
    desc: "Configured with 6 vectored thrusters to allow lateral strafing. Features a 3-hydrophone array for underwater acoustic localization.",
    thrusters: "6 Vectored", dof: "6 DoF", depth: "50 meters", speed: "2 knots", endurance: "60 mins", weight: "28 kg",
    mission: "Executed deep acoustic sweeps and localized underwater sound beacons using hydrophone arrays.",
    mech: "Vectored thruster configuration allows lateral translation without pitching. Single hull structure with machined end-caps and double O-ring sealings.",
    elec: "Features an Arduino/Raspberry Pi communications bridge, custom ESC control boards, and leak detection sensor arrays.",
    soft: "Implements acoustic source localization algorithm using a 3-hydrophone array to navigate toward underwater pingers.",
  },
  {
    name: "SEA 5.0", tagline: "Flagship Autonomous Vehicle",
    img: "https://auvzhcet.vercel.app/auvs/sea5.0.png",
    desc: "Our latest monohull vehicle under development. Houses the Nvidia Jetson processing stack, RealSense depth camera, and high-thrust vector motors.",
    thrusters: "6 T200", dof: "6 (Full DoF)", depth: "100 meters", speed: "4 knots", endurance: "60 mins", weight: "32 kg",
    mission: "Flagship marine challenge platform for high-precision autonomous navigation and Real-time YOLO target locking.",
    mech: "Features a modular double hull layout crafted from carbon fiber and high-strength acrylic. Anodized aluminum framework ensures drag reduction.",
    elec: "Equipped with custom power distribution boards, lithium-polymer batteries, and Nvidia Jetson Xavier AGX.",
    soft: "Runs ROS 2 on Linux. Implements deep-learning based YOLO object detection and Extended Kalman Filter (EKF) for state estimation.",
  },
];

const SEED_ADVISORY = [
  {
    name: "Prof. Naima Khatoon", role: "Vice Chancellor",
    img: "https://auvzhcet.vercel.app/teachers/nk.jpg",
    text: "It is quite inspiring to watch and witness the potential of the students of AUV-ZHCET Club unfold at various stages day by day. The students relentlessly put forward their best efforts in various activities and competitions. They have grown tremendously and have brought laurels and accolades to AMU both nationally and internationally, recently being placed first in the National AMU ROV Competition (2022), organized by Aligarh Muslim University.",
  },
  {
    name: "Prof. Mirza Salim Beg", role: "Dean, Faculty of Engineering & Technology",
    img: "https://auvzhcet.vercel.app/teachers/msb.jpg",
    text: "The MTS AUV-ZHCET is a student club that works on autonomous and remotely operated vehicles. They have participated in several international and national events, including being among the top 25% performers in the Singapore AUV Challenge 2022. I wish every member of the club success and a bright future.",
  },
  {
    name: "Prof. M. M. Sufyan Beg", role: "Former Principal, ZHCET",
    img: "https://auvzhcet.vercel.app/teachers/sb.jpg",
    text: "MTS AUV-ZHCET embrace the sharing of knowledge by hosting insightful workshops on the workings of ROVs, and undertaking classes in machine learning, Arduino, raspberry pi, and sensors. I congratulate the team for putting up sincere efforts.",
  },
];

const SEED_PROJECTS = [
  {
    title: 'AutoBase 1.0',
    category: 'Autonomous Perceptions',
    year: '2023',
    description: 'Our in-house autonomous path detection, SLAM navigation, and real-time mission base station. Recreates underwater surroundings in 3D using stereo vision sensors and runs Deep-learning pipelines for automated visual alignment.',
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
    description: 'Engineered in-house to speed up rapid prototyping of mechanical mounts, customized camera brackets, and sealing framework. Built with heavy-duty structural frames and tuned active leveling systems.',
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

const SEED_EVENTS = [
  {
    title: 'AMU ROVc',
    year: '2023',
    venue: 'AMU Campus Pool, Aligarh',
    theme: 'Remotely Operated Underwater Vehicles Challenge',
    description: 'AMUROV is a national-level student competition organised by Marine Technology Society, Autonomous Underwater Vehicle Club MTS-AUV in collaboration with Institute of Electrical and Electronics Engineers, IEEE AMU, established to generate and enhance a community of innovators capable of making substantive contributions to the remotely operated underwater vehicles (ROVs) domain.',
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
    description: 'MTS AUV-ZHCET organized a school science fair on the theme of renewable energy, inviting students from grades 6-10 to participate either individually or in groups of five to showcase their innovative ideas based on the theme of renewable energy.',
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
    description: 'MTS AUV-ZHCET participated in the Singapore Autonomous Underwater Vehicle Challenge (SAUVc), a prestigious international competition that challenges teams to design and build autonomous underwater vehicles (AUVs) to execute target tracking under pool depths.',
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

const SEED_MEMBERS = {
  "2026-27": [
    { name: "Mohd Ayaan Zafar", designation: "Chairperson (Management Affairs)", branch: "Management", img: "https://auvzhcet.vercel.app/Team/ayan.jpg" },
    { name: "Mohd Rayyan Khan", designation: "Chairperson (Technical Affairs)", branch: "Technical", img: "https://auvzhcet.vercel.app/Team/Rayyan.jpg" },
    { name: "Mohd Bilal", designation: "Vice-Chairperson (Management Affairs)", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Tanishka Bhardwaj", designation: "Vice-Chairperson (Technical Affairs)", branch: "Technical", img: "https://auvzhcet.vercel.app/Team/tanishka.jpg" },
    { name: "Mohammad Hamza Siddiqui", designation: "Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Um Kulsoom Shehroz", designation: "Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Akanksha Singh", designation: "Joint Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Mohd Kaif Khan", designation: "Joint Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Mohd Farhan Baig", designation: "Treasurer", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Supreet Chaudhary", designation: "Research & Development Lead", branch: "R&D", img: "https://auvzhcet.vercel.app/Team/supreet.jpg" },
    { name: "Aiama Sajad", designation: "Deputy R&D Lead", branch: "R&D", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Divyanshi Gupta", designation: "Deputy R&D Lead", branch: "R&D", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Mohammad Ayan", designation: "Computer Team Lead", branch: "Software", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Priyanshi Varshney", designation: "Deputy Computer Lead", branch: "Software", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Kandarp Gupta", designation: "Electronics Team Lead", branch: "Electronics", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Mohd Anas Aftab", designation: "Deputy Electronics Lead", branch: "Electronics", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Mamoon Ataur Rahman", designation: "Mechanical Team Lead", branch: "Mechanical", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Adeeb Ur Rehman", designation: "Deputy Mechanical Lead", branch: "Mechanical", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Fatima Amir", designation: "Event Lead", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Hania Hayat", designation: "Deputy Event Lead", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Aiysha Anjum", designation: "Sponsorship Lead", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
  ],
  "2025-26": [
    { name: "Eizad Hamdan", designation: "Chairperson (Technical Affairs)", branch: "Technical", img: "https://auvzhcet.vercel.app/Team/Eizad.jpg" },
    { name: "Hamza Hyeder", designation: "Chairperson (Operational Affairs)", branch: "Management", img: "https://auvzhcet.vercel.app/Team/Hamza.jpg" },
    { name: "Sidra Wajeeh", designation: "Vice-Chairperson", branch: "Technical", img: "https://auvzhcet.vercel.app/Team/Sidra.jpg" },
    { name: "Ammar Bari", designation: "ECE Lead", branch: "Electronics", img: "https://auvzhcet.vercel.app/Team/bari.jpg" },
    { name: "Harsh Awasthi", designation: "CS Lead", branch: "Software", img: "https://auvzhcet.vercel.app/Team/Harsh.jpg" },
    { name: "Rayyan Khan", designation: "ECE Lead", branch: "Electronics", img: "https://auvzhcet.vercel.app/Team/Rayyan.jpg" },
    { name: "Sabih Ahemad Khan", designation: "Mechanical Lead", branch: "Mechanical", img: "https://auvzhcet.vercel.app/Team/sabih.jpg" },
    { name: "Ayra Riaz Khan", designation: "R&D Lead", branch: "R&D", img: "https://auvzhcet.vercel.app/Team/ayra.jpg" },
    { name: "Mohd Ayaan Zafar", designation: "Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/ayan.jpg" },
    { name: "Asna Fatimah", designation: "PR Coordinator", branch: "Management", img: "https://auvzhcet.vercel.app/Team/asna.jpg" },
    { name: "Tabish Shah Mohsin", designation: "Co-CS Lead", branch: "Software", img: "https://auvzhcet.vercel.app/Team/tabish.jpg" },
    { name: "Supreet Chaudhary", designation: "Co-R&D Lead", branch: "R&D", img: "https://auvzhcet.vercel.app/Team/supreet.jpg" },
    { name: "Nabiha Irfan", designation: "Joint Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/nabiha.jpg" },
    { name: "Tanishka Bharadwaj", designation: "Joint Secretary", branch: "Management", img: "https://auvzhcet.vercel.app/Team/tanishka.jpg" },
    { name: "Mohammad Hasan", designation: "Treasurer", branch: "Management", img: "https://auvzhcet.vercel.app/Team/Hasan.JPG" },
    { name: "Musab Ahmad Khan", designation: "Treasurer", branch: "Management", img: "https://auvzhcet.vercel.app/Team/musab.jpg" },
    { name: "Ahmad Moosa Saad", designation: "Event Lead", branch: "Management", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
  ],
  "Alumni": [
    { name: "Mohammad Shariq", designation: "Past Chairperson (2023-24)", branch: "Alumni", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Faraz Ahmad", designation: "Past Software Lead (2023-24)", branch: "Alumni", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Zaid Khan", designation: "Past Mechanical Lead (2022-23)", branch: "Alumni", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Arsalan Yusuf", designation: "MTS Student Representative (2021-22)", branch: "Alumni", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
    { name: "Yusra Fatma", designation: "Past Joint Secretary (2022-23)", branch: "Alumni", img: "https://auvzhcet.vercel.app/Team/no.jpg" },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DbSeeder() {
  useStore();
  const { user } = useAuth();
  const [status, setStatus] = useState(null); // null | 'running' | 'done' | 'error'
  const [log, setLog] = useState([]);

  const addLog = (msg, type = "info") => setLog((prev) => [...prev, { msg, type }]);

  const checkAlreadySeeded = () => {
    const vehicles = getCollection("vehicles");
    const advisory = getCollection("advisory");
    const projects = getCollection("projects");
    const events = getCollection("events");
    const members2627 = getMembers("2026-27");
    return vehicles.length >= 5 && advisory.length >= 3 && projects.length >= 2 && events.length >= 3 && members2627.length >= 10;
  };

  // Compares a hardcoded entry against an existing DB row, ignoring
  // fields the DB adds itself (id, createdAt, updatedAt) — so unrelated
  // metadata never triggers a false "changed" update.
  const isSame = (hardcoded, existing) => {
    const strip = (obj) => {
      const { id, createdAt, updatedAt, ...rest } = obj;
      return rest;
    };
    return JSON.stringify(strip(hardcoded)) === JSON.stringify(strip(existing));
  };

  // Upserts a list of hardcoded items against an existing collection,
  // matching by `keyField` (e.g. "name" or "title"). Inserts new ones,
  // updates changed ones, leaves identical ones untouched. Safe to run
  // any number of times — never creates duplicates.
  const upsertList = async (label, hardcodedList, existingList, keyField, addFn, updateFn) => {
    let added = 0, updated = 0, skipped = 0;
    for (const entry of hardcodedList) {
      const match = existingList.find((e) => e[keyField] === entry[keyField]);
      if (!match) {
        await addFn(entry);
        added++;
      } else if (!isSame(entry, match)) {
        await updateFn(match.id, entry);
        updated++;
      } else {
        skipped++;
      }
    }
    addLog(
      `${label}: ${added} added, ${updated} updated, ${skipped} unchanged`,
      added || updated ? "success" : "skip",
    );
  };

  const runSeed = async () => {
    setStatus("running");
    setLog([]);

    try {
      addLog("Seeding vehicles...");
      await upsertList(
        "Vehicles",
        SEED_VEHICLES,
        getCollection("vehicles"),
        "name",
        (v) => addItem("vehicles", v, user),
        (id, v) => updateItem("vehicles", id, v, user),
      );

      addLog("Seeding advisory board...");
      await upsertList(
        "Advisory",
        SEED_ADVISORY,
        getCollection("advisory"),
        "name",
        (a) => addItem("advisory", a, user),
        (id, a) => updateItem("advisory", id, a, user),
      );

      addLog("Seeding projects...");
      await upsertList(
        "Projects",
        SEED_PROJECTS,
        getCollection("projects"),
        "title",
        (p) => addItem("projects", p, user),
        (id, p) => updateItem("projects", id, p, user),
      );

      addLog("Seeding events...");
      await upsertList(
        "Events",
        SEED_EVENTS,
        getCollection("events"),
        "title",
        (e) => addItem("events", e, user),
        (id, e) => updateItem("events", id, e, user),
      );

      for (const [session, members] of Object.entries(SEED_MEMBERS)) {
        addLog(`Seeding members for ${session}...`);
        // Assign position in increments of 10 based on this array's order —
        // leaves room to slot someone in between later (e.g. position 15
        // between 10 and 20) without renumbering everyone else.
        const membersWithPosition = members.map((m, idx) => ({
          ...m,
          position: (idx + 1) * 10,
        }));
        await upsertList(
          `Members (${session})`,
          membersWithPosition,
          getMembers(session),
          "name",
          (m) => addMember(session, m, user),
          (id, m) => updateMember(session, id, m, user),
        );
      }

      setStatus("done");
      addLog("All done! Refresh the site to see changes.", "success");
    } catch (err) {
      console.error("[seeder] error", err);
      addLog(`Error: ${err.message}`, "error");
      setStatus("error");
    }
  };

  const alreadySeeded = checkAlreadySeeded();

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h2 className="text-lg font-bold font-outfit text-white">Seed Database</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5 max-w-xl">
            One-time seeder — inserts all hardcoded site data (members, vehicles, advisory quotes) into Neon DB.
            Each category is skipped if already populated, so running this multiple times is safe.
          </p>
        </div>
      </div>

      {alreadySeeded && status === null && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-5">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          <p className="text-sm text-green-300 font-light">
            Looks like the database is already seeded — all data collections are populated.
          </p>
        </div>
      )}

      <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-zinc-400 font-space uppercase tracking-wider mb-4">What will be seeded:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Vehicles", count: "5", desc: "SEA 1.0 through SEA 5.0", icon: "🤿" },
            { label: "Advisory Board", count: "3", desc: "Prof. Naima Khatoon + 2 more", icon: "🎓" },
            { label: "Projects", count: "2", desc: "AutoBase 1.0 + Custom 3D Printer", icon: "🚀" },
            { label: "Events", count: "3", desc: "AMU ROVc, Science Fair, SAUVc", icon: "🏆" },
            { label: "Members", count: "43", desc: "Across 2026-27, 2025-26, Alumni", icon: "👥" },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-2xl font-black font-outfit text-white">{item.count}</div>
              <div className="text-xs font-bold text-zinc-400 font-space uppercase tracking-wider mt-0.5">{item.label}</div>
              <div className="text-[10px] text-zinc-600 mt-1 font-light">{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={runSeed}
          disabled={status === "running" || status === "done"}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold font-space uppercase tracking-wider transition-all ${
            status === "done"
              ? "bg-green-600/30 text-green-400 border border-green-600/40 cursor-default"
              : status === "running"
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-wait"
              : "bg-sky-500 hover:bg-sky-400 text-white"
          }`}
        >
          {status === "running" ? (
            <><Loader size={14} className="animate-spin" /> Seeding...</>
          ) : status === "done" ? (
            <><CheckCircle size={14} /> Seeded Successfully</>
          ) : (
            <><Database size={14} /> Seed Database Now</>
          )}
        </button>

        {log.length > 0 && (
          <div className="mt-5 bg-black/60 rounded-xl border border-zinc-900 p-4 font-mono text-xs flex flex-col gap-1.5 max-h-64 overflow-y-auto">
            {log.map((entry, i) => (
              <div
                key={i}
                className={
                  entry.type === "success" ? "text-green-400" :
                  entry.type === "error" ? "text-red-400" :
                  entry.type === "skip" ? "text-zinc-500 italic" :
                  "text-zinc-300"
                }
              >
                {entry.type === "success" ? "✓ " : entry.type === "error" ? "✗ " : "  "}{entry.msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium">Seeding failed</p>
            <p className="text-xs text-red-400/70 mt-1 font-light">
              Make sure the backend server is running and VITE_API_URL is set correctly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
