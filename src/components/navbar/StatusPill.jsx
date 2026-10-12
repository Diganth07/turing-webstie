import { Link } from 'react-router-dom';

export default function StatusPill() {
  return (
    <Link
      to="/#events"
      className="glass-pill glass-pill-hover group hidden md:inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-mono transition-all duration-300 hover:border-emerald-500/30"
      title="Recruitment Drive Active"
    >
      {/* Radar live pulsing dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs shadow-emerald-500/50" />
      </span>

      <span className="hidden lg:inline text-text-muted text-[11px] tracking-wide group-hover:text-text transition-colors">
        available for recruitment
      </span>
      <span className="lg:hidden text-text-muted text-[11px] tracking-wide group-hover:text-text transition-colors">
        recruiting
      </span>

      <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
        1st Year
      </span>
    </Link>
  );
}
