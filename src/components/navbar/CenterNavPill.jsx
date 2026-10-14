import { useState, useEffect, useRef } from 'react';
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
  const [hoveredId, setHoveredId] = useState(null);
  const linksContainerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
    isHover: false,
  });

  const targetId = hoveredId || activeSection || 'home';

  useEffect(() => {
    const updateIndicator = () => {
      const targetEl = itemRefs.current[targetId];
      if (targetEl) {
        setIndicatorStyle({
          left: targetEl.offsetLeft,
          width: targetEl.offsetWidth,
          opacity: 1,
          isHover: Boolean(hoveredId && hoveredId !== activeSection),
        });
      }
    };

    updateIndicator();
    // Allow fonts and DOM to settle
    const frame = requestAnimationFrame(updateIndicator);
    const timer = setTimeout(updateIndicator, 50);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [targetId, hoveredId, activeSection]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      const targetEl = itemRefs.current[targetId];
      if (targetEl) {
        setIndicatorStyle((prev) => ({
          ...prev,
          left: targetEl.offsetLeft,
          width: targetEl.offsetWidth,
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetId]);

  return (
    <nav className="glass-pill flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full shadow-2xl transition-all duration-300">
      {/* Brand logo in round badge */}
      <Link
        to="/"
        className="group relative z-10 flex items-center justify-center w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-black border border-white/15 hover:border-white/30 transition-all duration-300 shrink-0 ml-0.5 overflow-hidden shadow-xs hover:scale-105 active:scale-95"
        title="The Turing Club"
        aria-label="Home"
      >
        <img
          src={logo}
          alt="The Turing Club emblem"
          className="w-5.5 h-5.5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 group-hover:rotate-6"
        />
      </Link>

      {/* Nav items wrapper with inset-y-0 fluid indicator */}
      <div
        ref={linksContainerRef}
        onMouseLeave={() => setHoveredId(null)}
        className="relative flex items-center gap-0.5 sm:gap-1"
      >
        {/* Fluid sliding active pill indicator — perfectly locked via inset-y-0 */}
        <div
          className={`absolute inset-y-0 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            indicatorStyle.isHover
              ? 'bg-white/[0.08] border border-white/10 shadow-xs shadow-white/5'
              : 'bg-white/[0.14] border border-white/20 shadow-inner shadow-white/10 backdrop-blur-sm'
          }`}
          style={{
            transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;

          return (
            <Link
              key={link.href}
              to={link.href}
              ref={(el) => {
                if (el) itemRefs.current[link.id] = el;
              }}
              onMouseEnter={() => setHoveredId(link.id)}
              className={`relative z-10 flex items-center justify-center gap-2 px-4 sm:px-4.5 py-2 rounded-full text-sm sm:text-[14.5px] font-medium tracking-tight transition-colors duration-200 select-none leading-none ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-primary-light shadow-xs shadow-primary-light/60 transition-all duration-300 shrink-0 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0 -mr-1'
                }`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
