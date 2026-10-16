import { useState, useEffect } from 'react';
import collabModalArt from '../assets/images/collaborate/collab-modal-art.jpg';
import collabSponsorImg from '../assets/images/collaborate/collab-sponsor.jpg';
import collabKeyboardImg from '../assets/images/collaborate/collab-keyboard.jpg';
import collabClubImg from '../assets/images/collaborate/collab-club.jpg';
import collabIdeasImg from '../assets/images/collaborate/collab-ideas.jpg';

const TRACKS = [
  {
    id: 'hackathon',
    name: 'Hackathons & Events',
    short: 'Hackathons',
    image: collabModalArt,
    alt: 'Two tech collaborators high-fiving over a laptop blueprint',
    tagline: 'Flagship Hackathons & Technical Masterclasses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship & Grants',
    short: 'Sponsorships',
    image: collabSponsorImg,
    alt: 'Tech sponsor executive and student engineer shaking hands over partnership grant',
    tagline: 'High-Impact Brand Presence & Talent Access',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'workshop',
    name: 'Workshops & Masterclasses',
    short: 'Workshops',
    image: collabKeyboardImg,
    alt: 'Hands typing on glowing keyboard during interactive workshop',
    tagline: 'Hands-on Technical Workshops & Tech Talks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <rect x="2" y="4" width="20" height="12" rx="2" />
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h12" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    id: 'community',
    name: 'Club & Community Partnership',
    short: 'Club Collab',
    image: collabClubImg,
    alt: 'Student tech club leads fist-bumping over event blueprint and connected laptops',
    tagline: 'Cross-Campus Events & Community Co-Hosting',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'other',
    name: 'General Collaboration',
    short: 'Other Idea',
    image: collabIdeasImg,
    alt: 'Creator brainstorming new ideas with glowing lightbulb at desk',
    tagline: 'Open Ideation, Research & Innovation Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  },
];

export default function CollaborationModal({ isOpen, onClose, initialTrack = 'hackathon' }) {
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [proposal, setProposal] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedTrackObj = TRACKS.find((t) => t.id === selectedTrack) || TRACKS[0];
  const trackName = selectedTrackObj.name;

  const buildSubject = () => {
    const senderName = name.trim();
    const senderOrg = organization.trim();
    const senderId = senderName && senderOrg ? `${senderName} (${senderOrg})` : (senderName || senderOrg || 'Partner Inquiry');
    return `Collaboration Proposal: ${trackName} – ${senderId}`;
  };

  const buildBody = () => {
    const senderName = name.trim() || 'Partner';
    const senderOrg = organization.trim();
    const senderEmail = email.trim();
    const proposalContent = proposal.trim() || '(Please share details about your proposed event, dates, or sponsorship tiers)';

    const lines = [
      `Hi Turing Club Team,`,
      ``,
      `I am reaching out to propose a collaboration with The Turing Club regarding ${trackName}.`,
      ``,
      `COLLABORATION OVERVIEW`,
      `• Primary Track: ${trackName}`,
      `• Point of Contact: ${name.trim() || 'N/A'}`,
      `• Organization / Community: ${senderOrg || 'Independent Builder'}`,
      `• Contact Email: ${senderEmail || 'N/A'}`,
      ``,
      `PROPOSAL & SCOPE`,
      proposalContent,
      ``,
      `NEXT STEPS`,
      `We would love to discuss how we can partner on this initiative. Please let us know if you have time for a brief discussion or if you need any additional details.`,
      ``,
      `Best regards,`,
      senderName,
      ...(senderOrg ? [senderOrg] : []),
      ...(senderEmail ? [senderEmail] : []),
    ];

    return lines.join('\n');
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(buildSubject());
    const body = encodeURIComponent(buildBody());
    return `mailto:ttclub.ju@gmail.com?subject=${subject}&body=${body}`;
  };

  const getProposalPlainText = () => {
    return [
      `To: ttclub.ju@gmail.com`,
      `Subject: ${buildSubject()}`,
      ``,
      buildBody(),
    ].join('\n');
  };

  const handleSend = (e) => {
    e.preventDefault();
    const mailtoUrl = generateMailtoUrl();
    window.location.href = mailtoUrl;
  };

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(getProposalPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ttclub.ju@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const getGmailWebLink = () => {
    const subject = encodeURIComponent(buildSubject());
    const body = encodeURIComponent(buildBody());
    return `https://mail.google.com/mail/?view=cm&fs=1&to=ttclub.ju@gmail.com&su=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collab-modal-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
    >
      {/* Dimmed backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modern Studio-Grade Modal Architecture (Split 2-Column Desktop Grid) */}
      <div className="relative w-full max-w-4xl my-auto rounded-3xl border border-white/15 bg-[#0d0e14] text-text shadow-2xl shadow-black/90 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="grid md:grid-cols-12 min-h-[580px]">
          {/* Left Column: Editorial Art Showcase & Value Storytelling */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#131622] via-[#0e1017] to-[#0a0a0d] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge & Header */}
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary-light/30 bg-primary/10 text-primary-light text-[11px] font-mono uppercase tracking-wider mb-4">
                Collaborate Together
              </div>

              <h3 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight mb-2">
                Build Together.
                <br />
                <span className="text-primary-light">Scale Together.</span>
              </h3>

              <p className="text-xs sm:text-[13px] text-text-muted leading-relaxed">
                Connect your brand, event, or initiative directly with 500+ passionate student engineers at Jain University.
              </p>
            </div>

            {/* Authentic Editorial Artwork */}
            <div className="relative z-10 my-5 sm:my-6 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl group aspect-square flex items-center justify-center">
              <img
                key={selectedTrackObj.id}
                src={selectedTrackObj.image}
                alt={selectedTrackObj.alt}
                className="w-full h-full object-cover select-none transition-all duration-300 group-hover:scale-102"
                loading="lazy"
              />
            </div>

            {/* Value Highlights & Contact SLA */}
            <div className="relative z-10 space-y-2.5 pt-2 border-t border-white/10 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="text-primary-light">✓</span>
                <span>{selectedTrackObj.tagline}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Direct reach to top university talent</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim pt-1">
                <span>Direct email:</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-text-muted hover:text-white underline transition-colors cursor-pointer"
                >
                  {emailCopied ? 'Copied!' : 'ttclub.ju@gmail.com'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: The Refined Proposal Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#0e0f15]/95">
            {/* Header with Title and Close Button */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h4 id="collab-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Propose a Collaboration
                </h4>
                <p className="text-xs sm:text-[13px] text-text-muted mt-1 leading-relaxed">
                  Select your track and share your ideas. We review proposals swiftly.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
                aria-label="Close collaboration modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="space-y-4 pt-4">
              {/* Modern Track Selector Chips */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-dim mb-2">
                  Collaboration Track
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((track) => {
                    const isSelected = selectedTrack === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setSelectedTrack(track.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
                          isSelected
                            ? 'border-primary-light bg-primary/20 text-white shadow-sm shadow-primary/30 ring-1 ring-primary-light/40'
                            : 'border-white/10 bg-white/[0.03] text-text-muted hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span className={isSelected ? 'text-primary-light' : 'text-text-dim'}>
                          {track.icon}
                        </span>
                        <span>{track.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Org Dual Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="collab-name" className="block text-[11px] font-mono uppercase tracking-wider text-text-dim mb-1">
                    Your Name
                  </label>
                  <input
                    id="collab-name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder-text-dim/60 focus:outline-none focus:border-primary-light focus:bg-black/70 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="collab-org" className="block text-[11px] font-mono uppercase tracking-wider text-text-dim mb-1">
                    Organization / Club
                  </label>
                  <input
                    id="collab-org"
                    type="text"
                    required
                    placeholder="Google / Dev Club / Startup"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder-text-dim/60 focus:outline-none focus:border-primary-light focus:bg-black/70 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="collab-email" className="block text-[11px] font-mono uppercase tracking-wider text-text-dim mb-1">
                  Contact Email
                </label>
                <input
                  id="collab-email"
                  type="email"
                  required
                  placeholder="alex@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder-text-dim/60 focus:outline-none focus:border-primary-light focus:bg-black/70 transition-colors"
                />
              </div>

              {/* Proposal Overview */}
              <div>
                <label htmlFor="collab-msg" className="block text-[11px] font-mono uppercase tracking-wider text-text-dim mb-1">
                  Proposal Overview
                </label>
                <textarea
                  id="collab-msg"
                  rows={3}
                  placeholder="What would you like to co-organize? Outline expected dates, sponsorship scope, or event format..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder-text-dim/60 focus:outline-none focus:border-primary-light focus:bg-black/70 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Send Collaboration Proposal</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyProposal}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm text-text-muted hover:text-white transition-colors cursor-pointer"
                  title="Copy formatted proposal to clipboard"
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      <span>Copy Proposal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Web Gmail Link */}
              <div className="pt-2 text-[11px] text-text-dim flex items-center justify-between">
                <span>Using webmail?</span>
                <a
                  href={getGmailWebLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-light hover:underline font-medium"
                >
                  Open in Gmail web &rarr;
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
