import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '/#home', id: 'home' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'What We Do', href: '/#what-we-do', id: 'what-we-do' },
  { label: 'Events', href: '/#events', id: 'events' },
  { label: 'Leaders', href: '/#leaders', id: 'leaders' },
  { label: 'Collaborate', href: '/#collaborate', id: 'collaborate' },
];

export default function MobileNavDrawer({ isOpen, onClose, activeSection }) {
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const activeId = activeSection || 'home';

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fluid sliding active indicator calculation
  useEffect(() => {
    if (!isOpen) return;

    const updateIndicator = () => {
      const targetEl = itemRefs.current[activeId];
      if (targetEl) {
        setIndicatorStyle({
          top: targetEl.offsetTop,
          height: targetEl.offsetHeight,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    const frame = requestAnimationFrame(updateIndicator);
    const timer = setTimeout(updateIndicator, 50);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [isOpen, activeId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with smooth blur fade */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating glass modal panel with spring entrance */}
      <div className="fixed top-3.5 inset-x-3.5 sm:inset-x-6 max-w-md mx-auto z-[80] glass-pill rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/90 animate-in zoom-in-95 duration-250 ease-out">
        {/* Header inside modal */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-black/80 border border-white/15 flex items-center justify-center shrink-0 shadow-xs">
              <img src={logo} alt="The Turing Club" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="font-semibold text-sm sm:text-base tracking-tight text-white block leading-tight">
                The Turing Club
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted mt-0.5 block">
                JAIN (Deemed-to-be University)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-text-muted hover:text-white active:scale-90 transition-all duration-200"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation list with zero-padding container so offsetTop starts at 0 */}
        <div className="relative flex flex-col gap-1.5 my-3">
          {/* Fluid vertical sliding active pill — perfectly synced with activeSection */}
          <div
            className="absolute inset-x-0 rounded-2xl pointer-events-none transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/[0.12] border border-white/15 shadow-inner backdrop-blur-sm"
            style={{
              transform: `translate3d(0, ${indicatorStyle.top}px, 0)`,
              height: `${indicatorStyle.height}px`,
              opacity: indicatorStyle.opacity,
            }}
          />

          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;

            return (
              <Link
                key={link.href}
                to={link.href}
                ref={(el) => {
                  if (el) itemRefs.current[link.id] = el;
                }}
                onClick={onClose}
                className={`relative z-10 flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] sm:text-base font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.04] active:scale-[0.98]'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`w-2 h-2 rounded-full bg-primary-light shadow-xs shadow-primary-light/60 transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* CTA Button with fluid hover slide */}
        <div className="pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center justify-center gap-2.5 w-full py-3.5 bg-primary hover:bg-primary-light text-white font-semibold text-sm sm:text-[15px] rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <span>Apply to Join</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 ease-out"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
