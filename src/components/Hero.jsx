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

          {/* domain tags */}
          <div className="flex flex-wrap gap-2 mb-7">
            {DOMAIN_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md border border-border bg-surface/50 text-[11px] sm:text-xs text-text-muted font-mono hover:border-white/20 hover:text-white transition-colors duration-150"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-primary hover:bg-primary-light text-white font-medium text-sm tracking-tight transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
            >
              <span>Apply to Join</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <a
              href="#upcoming-events"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface/80 hover:bg-surface hover:border-white/20 text-text-muted hover:text-white font-medium text-sm tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <span>See Upcoming Events</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-text-dim group-hover:text-white transition-transform duration-200 ease-out group-hover:translate-y-0.5"
              >
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
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