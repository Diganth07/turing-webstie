import { Link } from 'react-router-dom';

export default function ActionPill() {
  return (
    <Link
      to="/our-work/hiring-1st-year-2026"
      className="glass-pill glass-pill-hover group hidden md:inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-[15px] font-semibold text-white transition-all duration-300 hover:border-primary-light/40 hover:shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
    >
      <span className="text-primary-light font-mono text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
        ✦
      </span>
      <span className="tracking-tight">Apply to Join</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all duration-300 ease-out"
      >
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
