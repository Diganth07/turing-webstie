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
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
    isHover: false,
  });

  const targetId = hoveredId || activeSection || 'home';

  useEffect(() => {
    const updateIndicator = () => {
      const targetEl = itemRefs.current[targetId];
      const container = containerRef.current;
      if (targetEl && container) {
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          left: targetRect.left - containerRect.left,
          top: targetRect.top - containerRect.top,
          width: targetRect.width,
          height: targetRect.height,
          opacity: 1,
          isHover: Boolean(hoveredId && hoveredId !== activeSection),
        });
      }
    };

    updateIndicator();
    // Re-check after layout has settled
    const timer = setTimeout(updateIndicator, 50);
    return () => clearTimeout(timer);
  }, [targetId, hoveredId, activeSection]);

  // Recalculate indicator position on window resize
  useEffect(() => {
    const handleResize = () => {
      const targetEl = itemRefs.current[targetId];
      const container = containerRef.current;
      if (targetEl && container) {
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setIndicatorStyle((prev) => ({
          ...prev,
          left: targetRect.left - containerRect.left,
          top: targetRect.top - containerRect.top,
          width: targetRect.width,
          height: targetRect.height,
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetId]);

  return (
    <nav
      ref={containerRef}
      onMouseLeave={() => setHoveredId(null)}
      className="glass-pill relative flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-full shadow-2xl transition-all duration-300"
    >
      {/* Fluid animated sliding active pill indicator */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          indicatorStyle.isHover
            ? 'bg-white/[0.08] border border-white/10 shadow-xs shadow-white/5'
            : 'bg-white/[0.14] border border-white/20 shadow-inner shadow-white/10 backdrop-blur-sm'
        }`}
        style={{
          transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
          opacity: indicatorStyle.opacity,
        }}
      />

      {/* Brand logo in round badge */}
      <Link
        to="/"
        className="group relative z-10 flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-black border border-white/15 hover:border-white/30 transition-all duration-300 shrink-0 ml-0.5 overflow-hidden shadow-xs hover:scale-105 active:scale-95"
        title="The Turing Club"
        aria-label="Home"
      >
        <img
          src={logo}
          alt="The Turing Club emblem"
          className="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain transition-transform duration-300 group-hover:rotate-6"
        />
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-0.5 sm:gap-1 relative">
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
              className={`relative z-10 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-[15px] font-medium tracking-tight transition-colors duration-200 select-none ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-primary-light shadow-xs shadow-primary-light/60 transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
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
