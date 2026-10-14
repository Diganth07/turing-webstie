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
        className={`sticky top-0 z-50 w-full transition-all duration-300 pointer-events-none ${
          isScrolled ? 'pt-2 sm:pt-3 pb-2' : 'pt-3 sm:pt-4 pb-2'
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
          <div className="md:hidden flex items-center justify-between glass-pill px-3.5 py-2 rounded-full shadow-xl pointer-events-auto">
            {/* Mobile Brand */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shrink-0">
                <img src={logo} alt="The Turing Club" className="w-4 h-4 object-contain" />
              </div>
              <span className="font-semibold text-xs tracking-tight text-white">
                The Turing Club
              </span>
            </Link>

            {/* Mobile Actions: Menu toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-1.5 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                aria-label="Open mobile menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
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