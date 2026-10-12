import { Link } from 'react-router-dom';

export default function ActionPill() {
  return (
    <Link
      to="/our-work/hiring-1st-year-2026"
      className="glass-pill glass-pill-hover group hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:border-primary-light/40 hover:shadow-primary/20 hover:shadow-lg"
    >
      <span className="text-primary-light font-mono text-xs">✦</span>
      <span className="tracking-tight">Apply to Join</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-3.5 h-3.5 text-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200"
      >
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
