import { Link } from 'react-router-dom';
import NeuralNetDiagram from './NeuralNetDiagram';
import TerminalPanel from './TerminalPanel';

const DOMAIN_TAGS = ['AI/ML', 'Web Dev', 'Cybersecurity', 'Data Science'];

export default function Hero() {
  return (
    <section id="home" className="relative border-b border-border overflow-hidden">
      {/* full-bleed faint diagram backdrop, ties the whole hero together */}
      <NeuralNetDiagram className="absolute inset-0 w-full h-full opacity-70" />

      {/* soft glow tying into the diagram/terminal area */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 500px at 68% 55%, rgba(37,99,235,0.12) 0%, rgba(10,10,10,0) 70%)',
        }}
      />

      {/* fade backdrop toward the left so text stays crisp */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #0a0a0a 0%, #0a0a0a 35%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.1) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-12 pb-10 md:pt-20 md:pb-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-full text-[10px] sm:text-xs font-mono tracking-widest text-text-muted uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/60" />
            Events &middot; Hackathons &middot; Workshops
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.12] tracking-tight mb-4">
            We Run the Events.
            <br />
            <span className="text-primary-light">You Do the Building.</span>
          </h1>

          <p className="max-w-xl text-sm md:text-base text-text-muted leading-relaxed mb-6">
            From AI/ML challenges to full-stack hackathons, the Turing Club
            creates the platform for students to build real projects and
            compete for real stakes.
          </p>

          {/* domain tags with luminous micro-badges */}
          <div className="flex flex-wrap gap-2 mb-7">
            {DOMAIN_TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] sm:text-xs text-text-muted font-mono hover:border-white/25 hover:text-white transition-colors duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-primary-light/60" />
                {tag}
              </span>
            ))}
          </div>

          {/* Creative CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            {/* Primary Creative CTA: Cyber Sheen Luminous Pill */}
            <Link
              to="/our-work/hiring-1st-year-2026"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/45 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 50%, #3b82f6 100%)',
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.22) inset, 0 10px 28px -5px rgba(37,99,235,0.45)',
              }}
            >
              {/* Dynamic light sheen sweep on hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Sparkle micro-icon */}
              <span className="relative z-10 text-blue-200 font-mono text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                ✦
              </span>

              <span className="relative z-10 tracking-tight">Apply to Join</span>

              {/* Animated forward arrow */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="relative z-10 w-4 h-4 text-blue-200 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 ease-out"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Secondary Creative CTA: Translucent Frosted Glass Pill with Live Radar Pulse */}
            <a
              href="#upcoming-events"
              className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full font-medium text-sm text-text-muted hover:text-white glass-pill glass-pill-hover overflow-hidden transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              {/* Live pulsing radar dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              </span>

              <span className="tracking-tight">See Upcoming Events</span>

              {/* Compass diagonal arrow */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-text-dim group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ease-out"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* terminal: single foreground element, overlapping into the diagram backdrop */}
        <TerminalPanel className="hidden lg:block absolute right-10 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 w-[300px]" />

        {/* mobile: terminal stacked below copy */}
        <TerminalPanel className="lg:hidden mt-8 w-full max-w-xs mx-auto" />
      </div>
    </section>
  );
}