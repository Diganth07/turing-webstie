import { Link } from 'react-router-dom';

export default function ActionPill() {
  return (
    <Link
      to="/apply"
      className="glass-pill glass-pill-hover group hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-[14.5px] font-semibold text-white transition-all duration-300 hover:border-primary-light/40 hover:shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] leading-none"
    >
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
