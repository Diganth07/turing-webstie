import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '/#home', id: 'home' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'What We Do', href: '/#what-we-do', id: 'what-we-do' },
  { label: 'Events', href: '/#events', id: 'events' },
  { label: 'Leaders', href: '/#leaders', id: 'leaders' },
];

export default function CenterNavPill({ activeSection }) {
  return (
    <nav className="glass-pill flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full shadow-xl transition-all duration-300">
      {/* Brand logo in round badge */}
      <Link
        to="/"
        className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-black border border-white/15 hover:border-white/30 transition-all duration-300 shrink-0 ml-0.5 overflow-hidden shadow-xs hover:scale-105"
        title="The Turing Club"
        aria-label="Home"
      >
        <img
          src={logo}
          alt="The Turing Club emblem"
          className="w-5.5 h-5.5 object-contain transition-transform duration-300 group-hover:rotate-6"
        />
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-tight transition-all duration-200 select-none ${
                isActive
                  ? 'bg-white/12 text-white font-semibold shadow-inner border border-white/12'
                  : 'text-text-muted hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light shadow-xs shadow-primary-light/50" />
              )}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
