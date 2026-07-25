import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu automatically on route change, so it never
  // stays open and blocks the new page.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Members', path: '/leadership' },
    { name: 'Project', path: '/projects' },
    { name: 'Event', path: '/events' },
    { name: 'Tech', path: '/tech' },
    { name: 'Recruitment', path: '/recruitment' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`z-[9999] fixed w-full top-0 transition-all duration-300 ${
      scrolled 
        ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/60 shadow-lg' 
        : 'bg-black/50 backdrop-blur-sm border-b border-white/5'
    }`}>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center items-center gap-x-8 font-poppins font-light text-sm py-3.5 px-6">
        <Link to="/" className="text-white shrink-0">
          <img
            alt="logo"
            width="22"
            height="22"
            className="hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-300"
            src="https://auvzhcet.vercel.app/auv1.png"
          />
        </Link>
        {navLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className={`flex items-center font-apple hover:text-white hover:scale-105 transition-all duration-300 whitespace-nowrap ${
              isActive(link.path) ? 'text-sky-400 font-medium' : 'text-[#ffffffcc]'
            }`}
          >
            {link.name}
          </Link>
        ))}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ffffffcc] flex items-center font-apple hover:text-white hover:scale-105 transition-all duration-300 whitespace-nowrap"
          href="https://rovcsite.onrender.com"
        >
          AMU ROVc
        </a>

        {/* Dashboard/Logout only show when already signed in. There is no
            visible Login entry point in the navbar by design — the /login
            route still works for anyone who navigates to it directly. */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <Link
              to="/dev/dashboard"
              aria-label="Dashboard"
              className="text-[#ffffffcc] hover:text-sky-400 hover:scale-110 transition-all duration-300"
            >
              <LayoutDashboard size={18} />
            </Link>
            <button
              onClick={logout}
              aria-label="Log out"
              className="text-[#ffffffcc] hover:text-sky-400 hover:scale-110 transition-all duration-300"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-col">
        <div className="flex flex-row justify-between px-5 py-4 items-center">
          <Link to="/">
            <img
              alt="logo"
              width="26"
              height="26"
              src="https://auvzhcet.vercel.app/auv1.png"
            />
          </Link>

          {/* Hamburger button — real, visible Tailwind classes instead of
              undefined custom CSS classes (that was the bug making the
              nav effectively disappear on phones: the old bar/bar1/bar2/bar3
              classes had no styles defined anywhere, so this button was
              invisible with zero width/height). */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((v) => !v)}
            className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 shrink-0"
          >
            <span
              className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } p-4 bg-zinc-950 border-t border-zinc-900 rounded-b-[30px] font-apple w-full font-normal text-white flex-wrap gap-y-4 pb-8 pt-4 transition-all duration-300 ease-in-out`}
        >
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`w-1/2 text-center text-base transition-colors ${
                isActive(link.path) ? 'text-sky-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div>{link.name}</div>
            </Link>
          ))}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rovcsite.onrender.com"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white w-1/2 text-center text-base transition-colors"
          >
            <div>AMU ROVc</div>
          </a>
          {user && (
            <>
              <Link
                to="/dev/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white w-1/2 flex justify-center items-center gap-2 text-base"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="text-zinc-400 hover:text-white w-1/2 flex justify-center items-center gap-2 text-base"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
