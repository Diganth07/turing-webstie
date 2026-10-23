import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SECTION_IDS = ['home', 'about', 'what-we-do', 'events', 'leaders', 'collaborate'];

export function useActiveSection(sectionIds = SECTION_IDS) {
  // Seed from the current URL hash on first render so that after a page
  // refresh the navbar highlight is correct even before the scroll fires.
  const initialHash = window.location.hash.replace('#', '');
  const [activeSection, setActiveSection] = useState(
    sectionIds.includes(initialHash) ? initialHash : 'home'
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If not on the homepage, section is determined by pathname
    if (location.pathname.startsWith('/our-work')) {
      setActiveSection('events');
      return;
    }

    // Scroll listener for elevation & section tracking
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      // Section tracking based on element positions
      const headerOffset = 120;
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            current = id;
            break;
          } else if (rect.top <= headerOffset) {
            current = id;
          }
        }
      }

      setActiveSection(current);

      // Keep the URL hash in sync with the section currently in view so that
      // refreshing the page always lands on the right spot. replaceState is
      // intentional here — we don't want every scroll to push a history entry.
      const nextHash = `#${current}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', nextHash);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Delay the initial handleScroll call slightly so that Home.jsx's
    // scrollIntoView (triggered by the URL hash on mount) has time to
    // move the page to the right position before we read scroll offsets.
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname, sectionIds]);

  return { activeSection, isScrolled };
}
