'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

interface PageViewTrackerProps {
  track?: 'aviation' | 'dev-startup' | 'cross-pollination' | 'general';
}

/**
 * PageViewTracker - Client component for tracking page views
 * Must be used in server components to track page views on mount
 *
 * Usage in server component:
 * ```tsx
 * import PageViewTracker from '@/components/analytics/PageViewTracker';
 *
 * export default function AviationPage() {
 *   return (
 *     <>
 *       <PageViewTracker track="aviation" />
 *       <div>Page content...</div>
 *     </>
 *   );
 * }
 * ```
 */
export default function PageViewTracker({ track }: PageViewTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on mount
    trackPageView({ path: pathname, track });
  }, [pathname, track]);

  // This component renders nothing
  return null;
}
