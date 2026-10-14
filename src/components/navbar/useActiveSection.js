import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useActiveSection(sectionIds = ['home', 'about', 'what-we-do', 'events', 'leaders']) {
  const [activeSection, setActiveSection] = useState('home');
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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, sectionIds]);

  return { activeSection, isScrolled };
}
