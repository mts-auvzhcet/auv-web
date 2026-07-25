import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LockKeyhole, User, AlertCircle, Waves } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const dest = "/dev/dashboard";
    const from = location.state?.from;
    navigate(from && from !== "/login" ? from : dest, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#0c4a6e] to-[#020617] px-4 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-4">
            <Waves className="text-sky-400" size={26} />
          </div>
          <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tight">
            Console Sign In
          </h1>
          <p className="text-zinc-400 text-sm font-light mt-1">
            Developer access only
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-8 shadow-xl backdrop-blur-md flex flex-col gap-5"
        >
          {error && (
            <div className="flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="font-light leading-relaxed">{error}</span>
            </div>
          )}

          <label className="flex flex-col gap-2">
            <span className="text-xs font-space uppercase tracking-wider text-zinc-400 font-bold">
              Username
            </span>
            <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 rounded-lg px-3 focus-within:border-sky-500/60 transition-colors">
              <User size={16} className="text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                placeholder="Enter your username"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-space uppercase tracking-wider text-zinc-400 font-bold">
              Password
            </span>
            <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 rounded-lg px-3 focus-within:border-sky-500/60 transition-colors">
              <LockKeyhole size={16} className="text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                placeholder="Enter your password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-space font-bold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}
