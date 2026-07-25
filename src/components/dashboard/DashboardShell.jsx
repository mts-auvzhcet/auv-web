import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardShell({ title, subtitle, tabs, activeTab, onTab, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0c4a6e] to-[#020617] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <span className="text-sky-400 font-space text-xs font-semibold tracking-wider uppercase block">
              {subtitle}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-outfit text-white uppercase tracking-tight">
              {title}
            </h1>
            <p className="text-zinc-400 text-sm font-light mt-1">
              Signed in as{" "}
              <span className="text-zinc-200 font-medium">{user?.username}</span>{" "}
              <span className="text-sky-400 uppercase text-xs">({user?.role})</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-space font-bold uppercase tracking-wider text-xs py-2 px-4 rounded-lg transition-colors"
            >
              <Home size={14} /> Site
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-space font-bold uppercase tracking-wider text-xs py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-zinc-800/60 hide-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-t-lg text-xs font-space font-bold uppercase tracking-wider transition-colors ${
                activeTab === t.id
                  ? "bg-sky-500/15 text-sky-300 border-b-2 border-sky-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
