import { useState } from 'react';
import { getMembers, getDB, isHydrated, getCollection } from '../lib/store';
import { useStore } from '../lib/useStore';

// Map a store member record (name, designation, imageUrl, branch, oneLiner)
// into the shape this page renders (name, role, subteam, img).
const mapMember = (m) => ({
  name: m.name,
  role: m.designation || m.role || '',
  subteam: m.branch || m.subteam || 'Team',
  img: m.imageBase64 || m.imageUrl || m.img || 'https://auvzhcet.vercel.app/Team/no.jpg',
  oneLiner: m.oneLiner || '',
  email: m.email || '',
  position: m.position,
});

export default function Leadership() {
  useStore(); // re-render when store hydrates / updates
  const [activeSession, setActiveSession] = useState('2026-27');

  const supporters = [
    { name: 'Aligarh Muslim University', img: 'https://auvzhcet.vercel.app/benefactors/amu.png', type: 'Academic Partner' },
    { name: 'AMU Old Boys Association', img: 'https://auvzhcet.vercel.app/benefactors/amuoldboysassociation.png', type: 'Alumni Patron' },
  ];

  const sponsors = [
    { name: 'Designing Printing Innovation', img: 'https://auvzhcet.vercel.app/benefactors/depi.png', type: 'Print & Media Partner' },
    { name: 'KTM', img: 'https://auvzhcet.vercel.app/benefactors/KTM%20logo.png', type: ' Our previous Technical Support' },
    { name: 'Shiva Group', img: 'https://auvzhcet.vercel.app/benefactors/SG.png', type: 'Manufacturing Sponsor' },
    { name: 'Triumph', img: 'https://auvzhcet.vercel.app/benefactors/TRIUMPH.png', type: 'Hardware Partner' },
  ];

  const facultyCouncilor = {
    name: 'Dr. Saleem Anwar Khan',
    role: 'Faculty Councilor',
    dept: 'Department of Mechanical Engineering',
    img: 'https://auvzhcet.vercel.app/teachers/sak.jpeg',
    bio: 'Guiding the MTS AUV-ZHCET club since its inception, fostering engineering innovation and team leadership.'
  };

  const facultyAdvisors = [
    {
      name: 'Dr. Mohd Ayyub Khan',
      role: 'Faculty Advisor',
      dept: 'Department of Electronics Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/10077441-1613549831.jpg',
    },
    {
      name: 'Dr. Azhar Jamil',
      role: 'Faculty Advisor',
      dept: 'Department of Mechanical Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/10059288-1776710946.png',
    },
    {
      name: 'Dr. Abdullah Yousuf Usmani',
      role: 'Faculty Advisor',
      dept: 'Department of Mechanical Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/10068753.jpg',
    },
    {
      name: 'Dr. Muhammad Inamullah',
      role: 'Faculty Advisor',
      dept: 'Department of Computer Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/3004-1747199208.jpg',
    },
    {
      name: 'Dr. Mohammad Sarfaraz',
      role: 'Faculty Advisor',
      dept: 'Department of Electrical Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/10061749-1777364177.jpg',
    },
    {
      name: 'Dr. Tauheed Mian',
      role: 'Faculty Advisor',
      dept: 'Department of Mechanical Engineering',
      img: 'https://api.amu.ac.in/storage/images/empphoto/10080909-1767331462.jpg',
    },
  ];

  // Advisory board is editable from the dashboard (Advisory tab). Each entry's
  // `role` field determines whether it's the Councilor or an Advisor — put
  // the exact word "Councilor" in the role for the one councilor, anything
  // else (e.g. "Faculty Advisor") is treated as an advisor. `bio` doubles
  // as the councilor's quote/bio. `sort` (if set) orders the advisors list.
  const facultyDb = getCollection('faculty');
  const dbCouncilor = facultyDb.find((a) => /councilor/i.test(a.role || ''));
  const dbAdvisors = facultyDb
    .filter((a) => !/councilor/i.test(a.role || ''))
    .sort((a, b) => (Number(a.sort) || 0) - (Number(b.sort) || 0));

  const councilorToShow = dbCouncilor
    ? {
        name: dbCouncilor.name,
        role: dbCouncilor.role,
        dept: dbCouncilor.dept || '',
        img: dbCouncilor.img || dbCouncilor.imageBase64 || 'https://auvzhcet.vercel.app/Team/no.jpg',
        bio: dbCouncilor.bio || '',
      }
    : (isHydrated() && facultyDb.length > 0 ? null : facultyCouncilor);

  const advisorsToShow = dbAdvisors.length > 0
    ? dbAdvisors.map((a) => ({
        name: a.name,
        dept: a.dept || '',
        img: a.img || a.imageBase64 || 'https://auvzhcet.vercel.app/Team/no.jpg',
      }))
    : (isHydrated() && facultyDb.length > 0 ? [] : facultyAdvisors);

  const team2026_27 = [
    { name: 'Mohd Ayaan Zafar', role: 'Chairperson (Management Affairs)', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/ayan.jpg' },
    { name: 'Mohd Rayyan Khan', role: 'Chairperson (Technical Affairs)', subteam: 'Technical', img: 'https://auvzhcet.vercel.app/Team/Rayyan.jpg' },
    { name: 'Mohd Bilal', role: 'Vice-Chairperson (Management Affairs)', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Tanishka Bhardwaj', role: 'Vice-Chairperson (Technical Affairs)', subteam: 'Technical', img: 'https://auvzhcet.vercel.app/Team/tanishka.jpg' },
    { name: 'Mohammad Hamza Siddiqui', role: 'Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Um Kulsoom Shehroz', role: 'Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Akanksha Singh', role: 'Joint Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Mohd Kaif Khan', role: 'Joint Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Mohd Farhan Baig', role: 'Treasurer', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Supreet Chaudhary', role: 'Research & Development Lead', subteam: 'R&D', img: 'https://auvzhcet.vercel.app/Team/supreet.jpg' },
    { name: 'Aiama Sajad', role: 'Deputy R&D Lead', subteam: 'R&D', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Divyanshi Gupta', role: 'Deputy R&D Lead', subteam: 'R&D', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Mohammad Ayan', role: 'Computer Team Lead', subteam: 'Software', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Priyanshi Varshney', role: 'Deputy Computer Lead', subteam: 'Software', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Kandarp Gupta', role: 'Electronics Team Lead', subteam: 'Electronics', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Mohd Anas Aftab', role: 'Deputy Electronics Lead', subteam: 'Electronics', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Mamoon Ataur Rahman', role: 'Mechanical Team Lead', subteam: 'Mechanical', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Adeeb Ur Rehman', role: 'Deputy Mechanical Lead', subteam: 'Mechanical', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Fatima Amir', role: 'Event Lead', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Hania Hayat', role: 'Deputy Event Lead', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Aiysha Anjum', role: 'Sponsorship Lead', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
  ];

  const team2025_26 = [
    { name: 'Eizad Hamdan', role: 'Chairperson (Technical Affairs)', subteam: 'Technical', img: 'https://auvzhcet.vercel.app/Team/Eizad.jpg' },
    { name: 'Hamza Hyeder', role: 'Chairperson (Operational Affairs)', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/Hamza.jpg' },
    { name: 'Sidra Wajeeh', role: 'Vice-Chairperson', subteam: 'Technical', img: 'https://auvzhcet.vercel.app/Team/Sidra.jpg' },
    { name: 'Ammar Bari', role: 'ECE Lead', subteam: 'Electronics', img: 'https://auvzhcet.vercel.app/Team/bari.jpg' },
    { name: 'Harsh Awasthi', role: 'CS Lead', subteam: 'Software', img: 'https://auvzhcet.vercel.app/Team/Harsh.jpg' },
    { name: 'Rayyan Khan', role: 'ECE Lead', subteam: 'Electronics', img: 'https://auvzhcet.vercel.app/Team/Rayyan.jpg' },
    { name: 'Sabih Ahemad Khan', role: 'Mechanical Lead', subteam: 'Mechanical', img: 'https://auvzhcet.vercel.app/Team/sabih.jpg' },
    { name: 'Ayra Riaz Khan', role: 'R&D Lead', subteam: 'R&D', img: 'https://auvzhcet.vercel.app/Team/ayra.jpg' },
    { name: 'Mohd Ayaan Zafar', role: 'Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/ayan.jpg' },
    { name: 'Asna Fatimah', role: 'PR Coordinator', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/asna.jpg' },
    { name: 'Tabish Shah Mohsin', role: 'Co-CS Lead', subteam: 'Software', img: 'https://auvzhcet.vercel.app/Team/tabish.jpg' },
    { name: 'Supreet Chaudhary', role: 'Co-R&D Lead', subteam: 'R&D', img: 'https://auvzhcet.vercel.app/Team/supreet.jpg' },
    { name: 'Nabiha Irfan', role: 'Joint Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/nabiha.jpg' },
    { name: 'Tanishka Bharadwaj', role: 'Joint Secretary', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/tanishka.jpg' },
    { name: 'Mohammad Hasan', role: 'Treasurer', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/Hasan.JPG' },
    { name: 'Musab Ahmad Khan', role: 'Treasurer', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/musab.jpg' },
    { name: 'Ahmad Moosa Saad', role: 'Event Lead', subteam: 'Management', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
  ];

  const alumni = [
    { name: 'Mohammad Shariq', role: 'Past Chairperson (2023-24)', subteam: 'Alumni', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Faraz Ahmad', role: 'Past Software Lead (2023-24)', subteam: 'Alumni', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Zaid Khan', role: 'Past Mechanical Lead (2022-23)', subteam: 'Alumni', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Arsalan Yusuf', role: 'MTS Student Representative (2021-22)', subteam: 'Alumni', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
    { name: 'Yusra Fatma', role: 'Past Joint Secretary (2022-23)', subteam: 'Alumni', img: 'https://auvzhcet.vercel.app/Team/no.jpg' },
  ];

  const getActiveTeamList = () => {
    const db = getDB();
    const fromStore = (db.members[activeSession] || []).map(mapMember);
    
    // Fixed designation hierarchy — always applied in this exact order,
    // regardless of when someone was added. "Deputy"/"Co-" variants of a
    // role always come right after the main role, never mixed with a
    // different tier.
    const rank = (role) => {
      if (!role) return 999;
      const r = role.toLowerCase();
      const isDeputy = r.includes('deputy') || r.includes('co-') || r.includes(' co ');

      if (r.includes('vice-chairperson') || r.includes('vice chairperson')) return 2;
      if (r.includes('chairperson')) return 1;
      if (r.includes('joint secretary')) return 4;
      if (r.includes('secretary')) return 3;
      if (r.includes('treasurer')) return 5;

      if (r.includes('r&d') || r.includes('research')) return isDeputy ? 7 : 6;
      if (r.includes('cs lead') || r.includes('computer') || r.includes('software')) return isDeputy ? 9 : 8;
      if (r.includes('ece') || r.includes('electronics')) return isDeputy ? 11 : 10;
      if (r.includes('mech')) return isDeputy ? 13 : 12;
      if (r.includes('event')) return isDeputy ? 15 : 14;
      if (r.includes('sponsorship')) return 16;

      return 999; // anything unrecognized sorts last, in whatever order it arrives
    };

    const sortedFromStore = [...fromStore].sort((a, b) => {
      const posA = a.position !== undefined && a.position !== "" ? Number(a.position) : null;
      const posB = b.position !== undefined && b.position !== "" ? Number(b.position) : null;
      // Explicit position always wins when set on both sides.
      if (posA !== null && posB !== null) return posA - posB;
      // A member with an explicit position is placed ahead of one without.
      if (posA !== null) return -1;
      if (posB !== null) return 1;
      // Neither has a position set — fall back to the title-based guess.
      return rank(a.role) - rank(b.role);
    });

    // After seeding, DB will have all data — use it exclusively.
    // Only fall back to hardcoded if the session is completely empty in DB.
    if (fromStore.length > 0) return sortedFromStore;
    if (!isHydrated()) return null; // still loading — don't show stale hardcoded data yet

    const fallback =
      activeSession === '2026-27' ? team2026_27 :
      activeSession === '2025-26' ? team2025_26 :
      alumni;
    
    return [...fallback].sort((a, b) => rank(a.role) - rank(b.role));
  };

  return (
    <div className="bg-gradient-to-b from-[#111827] via-[#090d16] to-[#020617] text-gray-100 min-h-screen pt-24 pb-16 px-4 md:px-8 font-poppins selection:bg-blue-500/30">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="text-zinc-400 text-xs font-semibold tracking-wider font-space uppercase mb-2">
          MTS AUV-ZHCET Club
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight leading-none mb-4 uppercase">
          Meet Our <span className="text-sky-400">Leadership</span>
        </h1>
        <p className="text-zinc-550 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
          The brilliant minds driving the research, engineering, and operational management of our Autonomous Underwater Vehicles.
        </p>
      </div>

      {/* 1. SEPARATE FACULTY SECTION (Top Column) */}
      <div className="max-w-7xl mx-auto mb-20 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Faculty Councilor */}
          {councilorToShow && (
            <div className="w-full lg:w-1/3 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-zinc-900 pb-8 lg:pb-0 lg:pr-8">
              <h2 className="text-center text-zinc-400 font-poppins tracking-[3px] text-base md:text-lg font-semibold border-b border-zinc-800 pb-2 mb-8 uppercase">
                Faculty Councilor
              </h2>
              <div className="flex flex-col items-center text-center max-w-[240px]">
                <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-lg aspect-square w-48 mb-4 hover:border-zinc-700 transition-all duration-300">
                  <img
                    alt={councilorToShow.name}
                    className="object-cover w-full h-full transition-all duration-500 ease-out"
                    src={councilorToShow.img}
                  />
                </div>
                <h3 className="font-bold text-white text-base md:text-lg leading-snug">{councilorToShow.name}</h3>
                <p className="text-zinc-450 text-xs font-semibold mt-1 font-apple uppercase tracking-wider">{councilorToShow.role}</p>
                <p className="text-zinc-500 text-[10px] mt-1 font-apple leading-tight">{councilorToShow.dept}</p>
                <p className="text-zinc-400 text-xs mt-3 leading-relaxed italic font-apple border-t border-zinc-900 pt-3">
                  "{councilorToShow.bio}"
                </p>
              </div>
            </div>
          )}

          {/* Faculty Advisors */}
          <div className="w-full lg:w-2/3 flex flex-col items-center">
            <h2 className="text-center text-zinc-400 font-poppins tracking-[3px] text-base md:text-lg font-semibold border-b border-zinc-800 pb-2 mb-8 uppercase">
              Faculty Advisors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
              {advisorsToShow.map((adv, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="overflow-hidden rounded-xl border border-zinc-850 shadow-md aspect-square w-28 sm:w-32 mb-3 hover:border-zinc-700 transition-all duration-300">
                    <img
                      alt={adv.name}
                      className="object-cover w-full h-full transition-all duration-500"
                      src={adv.img}
                    />
                  </div>
                  <h4 className="font-bold text-zinc-200 text-xs sm:text-sm leading-snug">{adv.name}</h4>
                  <p className="text-zinc-500 text-[10px] mt-0.5 font-apple leading-tight">{adv.dept}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. STUDENT LEADS SECTION & DROPDOWN SWITCHER */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-900 pb-6 mb-10 gap-6">
          <h2 className="text-2xl font-bold font-poppins text-white flex items-center gap-2">
            Student Team
            <span className="text-blue-400 text-sm font-mono bg-blue-950 px-2.5 py-0.5 rounded border border-blue-900/60">
              {activeSession}
            </span>
          </h2>

          {/* Session Switcher Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-full border border-zinc-900">
            {[
              { id: '2026-27', label: 'Session 26-27' },
              { id: '2025-26', label: 'Session 25-26' },
              { id: 'Alumni', label: 'Alumni' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSession(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                  activeSession === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 3D FLIP CARD GRID */}
        {getActiveTeamList() === null ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500 font-space uppercase tracking-wider">Loading team...</span>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
          {getActiveTeamList().map((stud, idx) => (
            <div key={idx} className="flip-card w-full aspect-[0.72] max-w-[210px] mx-auto group">
              <div className="flip-card-inner w-full h-full">
                
                {/* CARD FRONT */}
                <div className="flip-card-front bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-between p-4 shadow-lg">
                  <div className="w-full aspect-square overflow-hidden rounded-xl bg-zinc-900/30 border border-zinc-900 mb-3">
                    <img
                      alt={stud.name}
                      src={stud.img}
                      className="object-cover w-full h-full transition-all duration-500 filter brightness-95"
                    />
                  </div>
                  <div className="text-center w-full flex-grow flex flex-col justify-end">
                    <h3 className="font-bold text-zinc-100 text-xs sm:text-sm font-poppins leading-tight tracking-wide line-clamp-2">
                      {stud.name}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-medium font-apple tracking-wide uppercase mt-1">
                      {stud.role}
                    </p>
                    {stud.oneLiner && (
                      <p className="text-zinc-400 text-[9px] mt-1 font-light italic line-clamp-2">
                        "{stud.oneLiner}"
                      </p>
                    )}
                  </div>
                </div>

                {/* CARD BACK */}
                <div className="flip-card-back bg-zinc-900 border border-blue-900/60 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex flex-col items-center justify-between p-4 text-center">
                  <div className="w-full">
                    <div className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-semibold border-b border-zinc-800 pb-1.5 mb-3">
                      {stud.subteam} Team
                    </div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{stud.name}</h3>
                  </div>

                  {/* Email Profile Placeholder */}
                  <div className="flex flex-col border-t border-zinc-800 pt-3 w-full mt-auto text-left">
                    <span className="text-[10px] font-space text-sky-500 font-bold uppercase tracking-widest block mb-4">
                      Contact Details
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 font-space uppercase tracking-wider mb-1">Email</span>
                      {stud.email ? (
                        <a href={`mailto:${stud.email}`} className="text-sm font-medium text-zinc-200 hover:text-white truncate">
                          {stud.email}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-zinc-600 truncate">No Email</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
        )}

      {/* 4. SPONSORS & BENEFACTORS */}
      <div className="max-w-7xl mx-auto mt-32 mb-10">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <p className="text-cyan-400 font-space text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-3">
            Innovation Backers
          </p>
          <h2 className="text-4xl sm:text-5xl font-black font-outfit text-white uppercase tracking-tight">
            Sponsors & Benefactors
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-light mt-4 leading-relaxed font-outfit">
            We are deeply grateful to the institutions and corporations whose support drives our engineering innovations.
          </p>
        </div>

        {/* Primary Benefactors */}
        <div className="w-full mb-16">
          <h3 className="text-xl font-extrabold font-outfit text-white uppercase tracking-wider text-center mb-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-cyan-400/50"></span> Primary Benefactors <span className="w-8 h-px bg-cyan-400/50"></span>
          </h3>
          <div className="grid gap-8 max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2">
            {supporters.map((item, idx) => (
              <div key={idx} className="group rounded-3xl bg-zinc-950/40 border border-zinc-900 hover:border-sky-500/20 transition-all duration-350 overflow-hidden flex flex-col justify-between backdrop-blur-sm">
                <div className="p-8 h-40 flex items-center justify-center bg-zinc-900/10">
                  <img alt={item.name} loading="lazy" className="max-h-full max-w-full object-contain transition-all duration-500" src={item.img} />
                </div>
                <div className="py-4 px-6 text-center border-t border-zinc-900/60 bg-zinc-950/85">
                  <span className="text-[9px] font-space text-cyan-400 tracking-widest uppercase font-bold">{item.type}</span>
                  <p className="text-sm font-bold text-zinc-300 mt-1 uppercase">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Sponsors */}
        <div className="w-full mb-10">
          <h3 className="text-xl font-extrabold font-outfit text-white uppercase tracking-wider text-center mb-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-cyan-400/50"></span> Corporate Sponsors <span className="w-8 h-px bg-cyan-400/50"></span>
          </h3>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {sponsors.map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-sky-500/20 transition-all duration-350 overflow-hidden flex flex-col justify-between backdrop-blur-sm">
                <div className="p-6 h-32 flex items-center justify-center bg-zinc-900/10">
                  <img alt={item.name} loading="lazy" className="max-h-full max-w-full object-contain transition-all duration-500" src={item.img} />
                </div>
                <div className="py-3 px-4 text-center border-t border-zinc-900/60 bg-zinc-950/85">
                  <span className="text-[8px] font-space text-cyan-400 tracking-wider uppercase font-bold block">{item.type}</span>
                  <p className="text-xs font-bold text-zinc-400 mt-1 uppercase">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}
