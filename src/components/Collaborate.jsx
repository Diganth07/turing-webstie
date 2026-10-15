import { useState } from 'react';
import CollaborationModal from './CollaborationModal';
import collabHeroImg from '../assets/images/collaborate/collab-hero.jpg';
import collabClubImg from '../assets/images/collaborate/collab-club.jpg';
import collabSponsorImg from '../assets/images/collaborate/collab-sponsor.jpg';
import collabKeyboardImg from '../assets/images/collaborate/collab-keyboard.jpg';

export default function Collaborate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState('hackathon');

  const openWithTrack = (track) => {
    setActiveTrack(track);
    setModalOpen(true);
  };

  return (
    <>
      <section id="collaborate" className="relative border-b border-border overflow-hidden bg-bg">
        {/* Subtle ambient lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 900px 500px at 25% 30%, rgba(37,99,235,0.08) 0%, rgba(10,10,10,0) 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
          {/* Section label */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 border border-border rounded-full text-xs font-mono tracking-widest text-text-muted uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
            Collaborate Together
          </div>

          {/* Top Hero Layout: Matches the Pinterest Inspo (Illustration on Left + Copy & Actions on Right) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16 md:mb-24">
            {/* Left: The Multi-Panel Character Infographic Collage */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative group rounded-3xl border border-white/10 bg-surface/40 p-3 sm:p-5 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20">
                {/* Glow accent behind artwork */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={collabHeroImg}
                    alt="The Turing Club collaborative team building across panels"
                    className="w-full h-auto object-cover select-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right: Heading, Subtitle, and Dual CTA Action Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] mb-4">
                Collaborate smarter
              </h2>
              <p className="text-lg sm:text-xl text-text-muted font-normal tracking-tight mb-6">
                Team management at its best
              </p>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-8">
                Whether you are an industry partner looking to sponsor student innovators,
                a tech lead wanting to deliver a masterclass, or a fellow student community,
                let&apos;s build high-impact hackathons and events together.
              </p>

              {/* Dual Action Buttons (White Pill + Primary Blue Pill) with subtle email below */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => openWithTrack('hackathon')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-sm tracking-tight transition-all duration-200 shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Get started today</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openWithTrack('sponsorship')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-light text-white font-semibold text-sm tracking-tight transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Our plans</span>
                  </button>
                </div>

                {/* Subtle direct email below the two buttons */}
                <div className="flex items-center gap-2 text-xs text-text-dim pl-1">
                  <a
                    href="mailto:ttclub.ju@gmail.com"
                    className="inline-flex items-center gap-1.5 font-mono text-text-muted hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-primary-light">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    <span>ttclub.ju@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Infographic Feature Columns (Direct match to the Pinterest inspo with authentic art!) */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 pt-8 border-t border-border">
            {/* Feature 1: Free live support / Event Co-hosting */}
            <div className="group rounded-2xl border border-border/80 bg-surface/30 hover:bg-surface/60 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-xl">
              <div>
                {/* Infographic Student Tech Club Leaders Collaboration */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 mb-5 flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={collabClubImg}
                    alt="Student tech community collaboration"
                    className="w-full h-full object-cover select-none rounded-xl"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">
                  Free live support
                </h3>

                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  We&apos;re always here whenever you need us, our team will answer all your
                  questions immediately and help co-host hackathons from start to finish.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openWithTrack('hackathon')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-light group-hover:text-white transition-colors cursor-pointer self-start"
              >
                <span>Partner on an event</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Feature 2: Increased security / Sponsorships */}
            <div className="group rounded-2xl border border-border/80 bg-surface/30 hover:bg-surface/60 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-xl">
              <div>
                {/* Infographic Tech Sponsor and Student Partnership */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 mb-5 flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={collabSponsorImg}
                    alt="Tech sponsorship and industry grants"
                    className="w-full h-full object-cover select-none rounded-xl"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">
                  Increased security
                </h3>

                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  All partnerships and communications done through our platform are verified,
                  highly transparent, and fully dedicated to empowering student builders.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openWithTrack('sponsorship')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 group-hover:text-white transition-colors cursor-pointer self-start"
              >
                <span>Sponsor initiatives</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Feature 3: Intuitive interface / Workshops */}
            <div className="group rounded-2xl border border-border/80 bg-surface/30 hover:bg-surface/60 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-xl">
              <div>
                {/* Infographic Hands typing on Keyboard with bubbles */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 mb-5 flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={collabKeyboardImg}
                    alt="Intuitive interface and interactive masterclasses"
                    className="w-full h-full object-contain select-none rounded-xl"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">
                  Intuitive interface
                </h3>

                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Our community delivers the most hands-on, practical tech masterclasses and
                  workshops built on extensive student interaction and real code.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openWithTrack('workshop')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 group-hover:text-white transition-colors cursor-pointer self-start"
              >
                <span>Host a masterclass</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Collaboration Proposal Modal hardwired to ttclub.ju@gmail.com */}
      <CollaborationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTrack={activeTrack}
      />
    </>
  );
}
