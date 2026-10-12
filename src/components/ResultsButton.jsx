import { Link } from 'react-router-dom';

// Reusable "Results" button — links to the dedicated tabbed results page
// for an event (/our-work/:slug/results).
export default function ResultsButton({ slug, className = '', label = 'Results' }) {
  return (
    <Link
      to={`/our-work/${slug}/results`}
      className={`inline-block px-5 py-2.5 border border-border hover:border-text-dim transition-colors rounded-md font-semibold text-sm text-text ${className}`}
    >
      {label}
    </Link>
  );
}