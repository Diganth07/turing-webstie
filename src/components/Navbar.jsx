import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useActiveSection } from './navbar/useActiveSection';
import CenterNavPill from './navbar/CenterNavPill';
import ActionPill from './navbar/ActionPill';
import MobileNavDrawer from './navbar/MobileNavDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeSection, isScrolled } = useActiveSection();

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
          isScrolled ? 'pt-2.5 sm:pt-3 pb-2' : 'pt-4 sm:pt-5 pb-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Desktop & Tablet Floating Nav (3-section pill layout inspired by Zenwood) */}
          <div className="hidden md:flex items-center justify-between gap-4 pointer-events-auto">
            {/* Left section: Balanced spacer so CenterNavPill stays perfectly centered */}
            <div className="flex-1" />

            {/* Center section: Logo + Nav Items Floating Pill */}
            <div className="flex items-center justify-center">
              <CenterNavPill activeSection={activeSection} />
            </div>

            {/* Right section: Action / CTA Pill */}
            <div className="flex-1 flex items-center justify-end">
              <ActionPill />
            </div>
          </div>

          {/* Mobile Unified Floating Pill Bar */}
          <div className="md:hidden flex items-center justify-between glass-pill px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl pointer-events-auto transition-all duration-300">
            {/* Mobile Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 group active:scale-95 transition-transform duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-black/80 border border-white/15 flex items-center justify-center shrink-0 shadow-xs group-hover:border-white/30 transition-colors">
                <img
                  src={logo}
                  alt="The Turing Club"
                  className="w-5.5 h-5.5 object-contain transition-transform duration-300 group-hover:rotate-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-[15px] tracking-tight text-white leading-tight">
                  The Turing Club
                </span>
                <span className="text-[10px] font-mono text-text-muted leading-none mt-0.5">
                  Jain University
                </span>
              </div>
            </Link>

            {/* Mobile Actions: Menu toggle button */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 active:scale-90 text-text-muted hover:text-white transition-all duration-200"
                aria-label="Open mobile menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5.5 h-5.5"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Animated Glass Drawer */}
      <MobileNavDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
}