/**
 * Analytics Module - GA4 event tracking for dual-track content strategy
 * Tracks user engagement with aviation, dev-startup, and cross-pollination content
 */

type ContentTrack = 'aviation' | 'dev-startup' | 'cross-pollination';

interface TrackContentClickParams {
  track: ContentTrack;
  location: string;
}

interface TrackNewsletterSignupParams {
  location: string;
  track?: ContentTrack;
}

interface TrackExternalLinkParams {
  destination: string;
  location: string;
}

interface TrackPageViewParams {
  path: string;
  track?: ContentTrack;
}

/**
 * Check if gtag is available (client-side only, GA4 loaded)
 */
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track content track CTA clicks (e.g., "Explore Aviation" button)
 * Used for measuring engagement with dual-track strategy
 */
export const trackContentTrackClick = ({
  track,
  location,
}: TrackContentClickParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'content_track_click', {
    content_track: track,
    location: location,
    event_category: 'engagement',
    event_label: `${track}_${location}`,
  });

  console.debug('[Analytics] Content track click:', { track, location });
};

/**
 * Track newsletter signups (future enhancement)
 * Tracks which content track drove the signup
 */
export const trackNewsletterSignup = ({
  location,
  track,
}: TrackNewsletterSignupParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'newsletter_signup', {
    location: location,
    content_track: track || 'unknown',
    event_category: 'conversion',
    event_label: `signup_${location}`,
  });

  console.debug('[Analytics] Newsletter signup:', { location, track });
};

/**
 * Track external link clicks (e.g., social media, external resources)
 * Helps understand content sharing and referral patterns
 */
export const trackExternalLinkClick = ({
  destination,
  location,
}: TrackExternalLinkParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'external_link_click', {
    destination: destination,
    location: location,
    event_category: 'outbound',
    event_label: `${location}_to_${destination}`,
  });

  console.debug('[Analytics] External link click:', { destination, location });
};

/**
 * Track enhanced page views with content track metadata
 * Enables segmentation of analytics by aviation vs dev-startup content
 */
export const trackPageView = ({ path, track }: TrackPageViewParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    content_track: track || 'general',
  });

  console.debug('[Analytics] Page view:', { path, track });
};

/**
 * TypeScript declarations for gtag global function
 */
declare global {
  interface Window {
    gtag: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
