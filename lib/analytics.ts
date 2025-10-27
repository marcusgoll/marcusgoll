/**
 * Analytics Module - GA4 event tracking for dual-track content strategy
 * Tracks user engagement with aviation, dev-startup, cross-pollination, and general content
 */

type ContentTrack = 'aviation' | 'dev-startup' | 'cross-pollination' | 'general';

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

interface TrackNewsletterViewParams {
  location: string;
  track?: ContentTrack;
}

interface TrackNewsletterSubmitParams {
  location: string;
  track?: ContentTrack;
  email?: string; // Optional for analytics (should be hashed if sent)
}

interface TrackNewsletterSuccessParams {
  location: string;
  track?: ContentTrack;
  source?: string; // Newsletter source (e.g., 'sidebar', 'footer', 'inline')
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

  window.gtag!('event', 'content_track_click', {
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

  window.gtag!('event', 'newsletter_signup', {
    location: location,
    content_track: track || 'unknown',
    event_category: 'conversion',
    event_label: `signup_${location}`,
  });

  console.debug('[Analytics] Newsletter signup:', { location, track });
};

/**
 * Track newsletter form view (US6, T021)
 * Fires when user views a newsletter signup form
 * Helps measure form visibility and engagement
 */
export const trackNewsletterView = ({
  location,
  track,
}: TrackNewsletterViewParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag!('event', 'newsletter_view', {
    location: location,
    content_track: track || 'general',
    event_category: 'newsletter',
    event_label: `view_${location}`,
  });

  console.debug('[Analytics] Newsletter view:', { location, track });
};

/**
 * Track newsletter form submit attempt (US6, T021)
 * Fires when user submits the newsletter form (before success/failure)
 * Helps measure conversion funnel and identify drop-off points
 */
export const trackNewsletterSubmit = ({
  location,
  track,
  email,
}: TrackNewsletterSubmitParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag!('event', 'newsletter_submit', {
    location: location,
    content_track: track || 'general',
    event_category: 'newsletter',
    event_label: `submit_${location}`,
    // Don't send actual email - GA4 PII compliance
    has_email: email ? 'yes' : 'no',
  });

  console.debug('[Analytics] Newsletter submit:', { location, track });
};

/**
 * Track newsletter signup success (US6, T021)
 * Fires after successful newsletter subscription
 * Tracks which content drives successful conversions
 */
export const trackNewsletterSuccess = ({
  location,
  track,
  source,
}: TrackNewsletterSuccessParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag!('event', 'newsletter_success', {
    location: location,
    content_track: track || 'general',
    source: source || 'unknown',
    event_category: 'conversion',
    event_label: `success_${location}_${source || 'unknown'}`,
    value: 1, // Assign value to conversion
  });

  console.debug('[Analytics] Newsletter success:', { location, track, source });
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

  window.gtag!('event', 'external_link_click', {
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

  window.gtag!('event', 'page_view', {
    page_path: path,
    content_track: track || 'general',
  });

  console.debug('[Analytics] Page view:', { path, track });
};

