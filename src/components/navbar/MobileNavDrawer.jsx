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
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Modal Panel */}
      <div className="fixed top-3.5 inset-x-3.5 sm:inset-x-6 max-w-md mx-auto z-[80] glass-pill rounded-3xl border border-white/15 p-5 sm:p-6 shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200">
        {/* Header inside modal */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black/80 border border-white/15 flex items-center justify-center shrink-0 shadow-xs">
              <img src={logo} alt="The Turing Club" className="w-5.5 h-5.5 object-contain" />
            </div>
            <div>
              <span className="font-semibold text-sm sm:text-base tracking-tight text-white block leading-tight">
                The Turing Club
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted mt-0.5 block">
                Jain (Deemed-to-be) University
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-white active:scale-90 transition-all"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex flex-col gap-1.5 py-3">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] sm:text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.12] text-white font-semibold border border-white/15 shadow-inner'
                    : 'text-text-muted hover:text-white hover:bg-white/5 active:scale-[0.98]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-primary-light shadow-xs shadow-primary-light/60" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pt-3 border-t border-border/80">
          <Link
            to="/our-work/hiring-1st-year-2026"
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-primary hover:bg-primary-light text-white font-semibold text-sm sm:text-[15px] rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
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
