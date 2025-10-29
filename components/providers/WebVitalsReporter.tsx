'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals-tracking';

/**
 * Web Vitals Reporter Component
 *
 * Client-side component that reports Web Vitals metrics to Google Analytics 4.
 * Should be included in the root layout to track performance across all pages.
 *
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Initial render speed
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 * - INP (Interaction to Next Paint): Responsiveness
 *
 * @see https://web.dev/vitals/
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      reportWebVitals();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
