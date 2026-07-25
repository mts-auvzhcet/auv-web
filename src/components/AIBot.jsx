import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { getDB, getActiveSession, getMembers } from '../lib/store';

function answer(query) {
  const q = query.toLowerCase().trim();
  const db = getDB();
  const session = getActiveSession();

  if (/hi|hello|hey|yo\b/.test(q))
    return "Hey! I'm AUV Assistant 🤖 — ask me about members, events, projects, vehicles, or announcements.";

  if (/login|sign in|log in/.test(q))
    return "You can log in via the login icon in the top-right of the navbar, or head to /login. Default dev account: developer / devpass.";

  if (/announce/.test(q)) {
    const a = db.announcements || [];
    if (!a.length) return "No announcements yet.";
    return `Latest announcement: "${a[0].title}" — ${a[0].body?.slice(0, 120) || ''}`;
  }

  if (/event/.test(q)) {
    const e = db.events || [];
    return e.length ? `We have ${e.length} event(s). Latest: ${e[0].title}` : "No events scheduled.";
  }

  if (/project/.test(q)) {
    const p = db.projects || [];
    return p.length ? `We're working on ${p.length} project(s). Latest: ${p[0].title}` : "No projects listed yet.";
  }

  if (/vehicle|auv|rov/.test(q)) {
    const v = db.vehicles || [];
    return v.length ? `${v.length} vehicle(s) in the fleet. Latest: ${v[0].name}` : "No vehicles listed yet.";
  }

  if (/member|team|who/.test(q)) {
    const m = getMembers(session);
    return m.length ? `${m.length} members in session ${session}. Try the Leadership page for details.` : "No members in the current session.";
  }

  if (/session/.test(q))
    return `Active session is ${session}. Sessions are managed by developers in the Dev Console.`;

  if (/admin|dashboard|developer/.test(q))
    return "Admin dashboard: /admin/dashboard. Developer console: /dev/dashboard. Both require login.";

  if (/help|what can/.test(q))
    return "Ask me about: members, events, projects, vehicles, announcements, sessions, or how to log in.";

  return "I'm a lightweight assistant — try asking about events, projects, vehicles, announcements, or how to log in.";
}

export default function AIBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm the AUV Assistant. Ask me anything about the team, events, or projects. 🚀" },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: answer(text) }]);
    }, 350);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center
                   bg-gradient-to-br from-sky-500/80 to-blue-700/80 backdrop-blur-xl
                   border border-white/20 shadow-[0_8px_32px_rgba(56,189,248,0.35)]
                   hover:scale-110 hover:shadow-[0_8px_40px_rgba(56,189,248,0.55)]
                   transition-all duration-300"
      >
        {open ? <X className="text-white" size={24} /> : <Bot className="text-white" size={26} />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping opacity-40" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-[9998] w-[min(92vw,380px)] h-[520px] max-h-[75vh]
                    rounded-3xl overflow-hidden flex flex-col
                    bg-white/5 backdrop-blur-2xl border border-white/15
                    shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    transition-all duration-300 origin-bottom-right
                    ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
      >
        {/* Glass sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-600/10 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">AUV Assistant</div>
            <div className="text-sky-300/80 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-sm shadow-lg'
                    : 'bg-white/10 text-zinc-100 backdrop-blur-md border border-white/10 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="relative p-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 pl-4 pr-1.5 py-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask something…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-400 outline-none"
            />
            <button
              onClick={send}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center hover:scale-105 transition"
              aria-label="Send message"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
