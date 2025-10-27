'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

type TrackFilter = 'all' | 'aviation' | 'dev-startup' | 'cross-pollination';

interface FilterOption {
  label: string;
  value: TrackFilter;
  icon: string;
}

const filterOptions: FilterOption[] = [
  { label: 'All Posts', value: 'all', icon: '📚' },
  { label: 'Aviation', value: 'aviation', icon: '✈️' },
  { label: 'Dev/Startup', value: 'dev-startup', icon: '💻' },
  { label: 'Cross-pollination', value: 'cross-pollination', icon: '🔄' },
];

/**
 * PostFeedFilter - Content track filter with URL state synchronization
 *
 * Features:
 * - URL parameter syncing (?track=slug)
 * - Active state indication
 * - Keyboard accessible
 * - Analytics tracking
 */
export default function PostFeedFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTrack = (searchParams?.get('track') || 'all') as TrackFilter;

  const handleFilterClick = (track: TrackFilter) => {
    // Track analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_changed', {
        event_category: 'engagement',
        event_label: track,
        previous_filter: currentTrack,
      });
    }

    // Update URL with new filter
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (track === 'all') {
      params.delete('track');
    } else {
      params.set('track', track);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  };

  return (
    <div
      className="space-y-2"
      role="navigation"
      aria-label="Content track filter"
    >
      {filterOptions.map((option) => {
        const isActive = currentTrack === option.value;

        return (
          <Button
            key={option.value}
            variant={isActive ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleFilterClick(option.value)}
            aria-label={`Filter by ${option.label}`}
            aria-pressed={isActive}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
