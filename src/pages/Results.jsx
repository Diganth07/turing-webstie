import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { RESULTS } from '../data/results';
import { EVENTS } from '../data/events';
import { WORKSHOPS } from '../data/workshops';
import { SEMINARS } from '../data/seminars';

const ALL_ITEMS = [...EVENTS, ...WORKSHOPS, ...SEMINARS];

const DOMAIN_ORDER = ['tech', 'design', 'photography', 'marketing', 'social-media'];

function formatAnnouncedDate(dateString) {
  if (!dateString || typeof dateString !== 'string' || dateString.includes('YYYY')) {
    return null;
  }
  const parts = dateString.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Results() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabRefs = useRef({});

  const item = ALL_ITEMS.find((i) => i.slug === slug);
  const data = RESULTS[slug];

  const rawTab = searchParams.get('tab');
  const activeTab = DOMAIN_ORDER.includes(rawTab) ? rawTab : 'tech';

  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-28 text-center">
        <Link
          to={item ? `/our-work/${item.slug}` : '/our-work'}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-10"
        >
          &larr; Back to {item ? item.title : 'Our Work'}
        </Link>

        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-border rounded-full text-xs font-mono tracking-widest text-text-muted uppercase">
          Results
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
          {item ? item.title : 'Results'}
        </h1>

        <p className="text-sm md:text-base text-text-muted leading-relaxed">
          Results aren't available for this event.
        </p>
      </div>
    );
  }

  const announcedDate = formatAnnouncedDate(data.announcedOn);
  const activeDomain = data.domains?.[activeTab];
  const activeDomainLabel = activeDomain?.label || activeTab;
  const selectedStudents = activeDomain?.selected || [];
  const count = selectedStudents.length;

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', newTab);
        return next;
      },
      { replace: true }
    );
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % DOMAIN_ORDER.length;
      const nextKey = DOMAIN_ORDER[nextIndex];
      handleTabChange(nextKey);
      tabRefs.current[nextKey]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + DOMAIN_ORDER.length) % DOMAIN_ORDER.length;
      const prevKey = DOMAIN_ORDER[prevIndex];
      handleTabChange(prevKey);
      tabRefs.current[prevKey]?.focus();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-10 py-16 md:py-24">
      {/* Header section */}
      <div className="text-center mb-10 md:mb-12">
        <Link
          to={item ? `/our-work/${item.slug}` : '/our-work'}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-8"
        >
          &larr; Back to {item ? item.title : 'Our Work'}
        </Link>

        <div className="block">
          <span className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border border-border rounded-full text-xs font-mono tracking-widest text-text-muted uppercase">
            Results
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3">
          {data.event || (item ? item.title : 'Results')}
        </h1>

        {announcedDate && (
          <p className="text-xs sm:text-sm font-mono text-text-dim">
            Announced on {announcedDate}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div
          role="tablist"
          aria-label="Results domains"
          className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 sm:justify-center border-b border-border"
        >
          {DOMAIN_ORDER.map((domainKey, index) => {
            const domain = data.domains?.[domainKey];
            const label = domain?.label || domainKey;
            const isActive = activeTab === domainKey;
            return (
              <button
                key={domainKey}
                ref={(el) => {
                  tabRefs.current[domainKey] = el;
                }}
                role="tab"
                id={`tab-${domainKey}`}
                aria-selected={isActive}
                aria-controls={`panel-${domainKey}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(domainKey)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                  isActive
                    ? 'bg-primary text-text'
                    : 'border border-border text-text-muted hover:border-text-dim hover:text-text'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {count === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 md:p-14 text-center bg-surface/40">
            <p className="text-sm md:text-base text-text-muted">
              No selections announced for this domain yet.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-text">
                {activeDomainLabel}
              </h2>
              <span className="text-xs sm:text-sm font-mono text-text-dim">
                {count === 1 ? '1 selected' : `${count} selected`}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {selectedStudents.map((student, index) => (
                <div
                  key={`${student.name}-${index}`}
                  className="p-4 sm:p-5 rounded-lg border border-border bg-surface/60 hover:border-text-dim transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-text mb-1">
                      {student.name}
                    </div>
                    {student.usn && (
                      <div className="text-xs font-mono text-text-dim mb-1">
                        {student.usn}
                      </div>
                    )}
                    {student.program && (
                      <div className="text-xs text-text-muted mb-2">
                        {student.program}
                      </div>
                    )}
                  </div>
                  {student.year && (
                    <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
                        Year
                      </span>
                      <span className="text-xs font-mono font-medium text-primary-light">
                        {student.year.toLowerCase().includes('year')
                          ? student.year
                          : `${student.year} Year`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}