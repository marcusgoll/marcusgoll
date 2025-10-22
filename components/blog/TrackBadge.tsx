interface TrackBadgeProps {
  track: 'aviation' | 'dev-startup' | 'cross-pollination' | null;
  className?: string;
}

/**
 * TrackBadge component - Displays content track badge with appropriate colors
 * Colors:
 * - Aviation: Sky Blue (#0EA5E9)
 * - Dev/Startup: Emerald (#059669)
 * - Cross-pollination: Gradient (Sky Blue → Emerald)
 */
export default function TrackBadge({ track, className = '' }: TrackBadgeProps) {
  if (!track) {
    return null;
  }

  const trackStyles = {
    aviation: 'bg-sky-blue text-white',
    'dev-startup': 'bg-emerald-600 text-white',
    'cross-pollination': 'bg-gradient-to-r from-sky-blue to-emerald-600 text-white',
  };

  const trackLabels = {
    aviation: 'AVIATION',
    'dev-startup': 'DEV/STARTUP',
    'cross-pollination': 'CROSS-POLLINATION',
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${trackStyles[track]} ${className}`}
      aria-label={`Content track: ${trackLabels[track]}`}
    >
      {trackLabels[track]}
    </span>
  );
}
