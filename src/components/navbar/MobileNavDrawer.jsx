import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '/#home', id: 'home' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'What We Do', href: '/#what-we-do', id: 'what-we-do' },
  { label: 'Events', href: '/#events', id: 'events' },
  { label: 'Leaders', href: '/#leaders', id: 'leaders' },
];

export default function MobileNavDrawer({ isOpen, onClose, activeSection }) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Modal Panel */}
      <div className="fixed top-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-[80] glass-pill rounded-3xl border border-white/15 p-5 shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200">
        {/* Header inside modal */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black/80 border border-white/10 flex items-center justify-center">
              <img src={logo} alt="The Turing Club" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white block">
                The Turing Club
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Jadavpur University
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Status notice */}
        <div className="my-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-300">
              Recruitment Live
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full">
            1st Year
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex flex-col gap-1 py-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border border-white/10'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-3 border-t border-border/80">
          <Link
            to="/our-work/hiring-1st-year-2026"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary/20"
          >
            <span>Apply to Join</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
