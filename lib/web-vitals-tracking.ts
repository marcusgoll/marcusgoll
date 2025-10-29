import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { sendMetricToGA4 } from './analytics';

/**
 * Web Vitals Real User Monitoring (RUM)
 *
 * Tracks Core Web Vitals metrics and sends them to Google Analytics 4
 * for real user performance monitoring and regression detection.
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
export function reportWebVitals() {
  // Track CLS (Cumulative Layout Shift)
  onCLS((metric) => {
    sendMetricToGA4(metric);
  });

  // Track FCP (First Contentful Paint)
  onFCP((metric) => {
    sendMetricToGA4(metric);
  });

  // Track LCP (Largest Contentful Paint)
  onLCP((metric) => {
    sendMetricToGA4(metric);
  });

  // Track TTFB (Time to First Byte)
  onTTFB((metric) => {
    sendMetricToGA4(metric);
  });

  // Track INP (Interaction to Next Paint)
  onINP((metric) => {
    sendMetricToGA4(metric);
  });
}
