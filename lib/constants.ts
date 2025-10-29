/**
 * Application Constants
 *
 * Central location for site-wide constants and configuration values
 * used across the homepage redesign and other features.
 */

/**
 * Site Branding
 */
export const SITE_TAGLINE = "Teaching systematic thinking from 30,000 feet";
export const HERO_HEADLINE = "Systematic thinking from 30,000 feet";
export const HERO_SUBHEADLINE =
  "Aviation career guidance and software development insights for systematic thinkers";

/**
 * Content Tracks
 */
export const CONTENT_TRACKS = {
  AVIATION: "aviation",
  DEV_STARTUP: "dev-startup",
  CROSS_POLLINATION: "cross-pollination",
  ALL: "all",
} as const;

export const TRACK_LABELS = {
  [CONTENT_TRACKS.AVIATION]: "Aviation",
  [CONTENT_TRACKS.DEV_STARTUP]: "Dev/Startup",
  [CONTENT_TRACKS.CROSS_POLLINATION]: "Cross-Pollination",
  [CONTENT_TRACKS.ALL]: "All Posts",
} as const;

/**
 * Active Project (What I'm Building)
 */
export interface ActiveProject {
  name: string;
  tagline: string;
  status: "active" | "shipped" | "paused";
  url: string;
  ctaText: string;
  buildLogUrl?: string;
}

export const ACTIVE_PROJECT: ActiveProject = {
  name: "CFIPros.com",
  tagline: "Flight instructor career platform connecting CFIs with opportunities",
  status: "active",
  url: "https://cfipros.com",
  ctaText: "Visit CFIPros.com",
  buildLogUrl: "/blog?track=dev-startup&tag=cfipros",
};

/**
 * Homepage Configuration
 */
export const HOMEPAGE_CONFIG = {
  RECENT_POSTS_COUNT: 9,
  FEATURED_POSTS_MAX: 3,
  HERO_CTA_PRIMARY: "Read Latest Posts",
  HERO_CTA_SECONDARY: "Subscribe to Newsletter",
} as const;

/**
 * Newsletter Configuration
 */
export const NEWSLETTER_CONFIG = {
  PRIVACY_POLICY_URL: "/privacy",
  TERMS_URL: "/terms",
  TRACKS: ["aviation", "dev-startup", "education", "all"] as const,
} as const;

/**
 * Analytics Events
 */
export const ANALYTICS_EVENTS = {
  HOMEPAGE: {
    PAGE_VIEW: "homepage.page_view",
    FILTER_CLICK: "homepage.filter_click",
    POST_CLICK: "homepage.post_click",
    NEWSLETTER_SIGNUP: "homepage.newsletter_signup",
    PROJECT_CARD_CLICK: "homepage.project_card_click",
    HERO_CTA_CLICK: "homepage.hero_cta_click",
  },
} as const;

/**
 * Responsive Breakpoints (match Tailwind)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/**
 * Performance Budgets
 */
export const PERFORMANCE_BUDGETS = {
  FCP_MS: 1500,
  LCP_MS: 2500,
  TTI_MS: 3500,
  CLS: 0.15,
  LIGHTHOUSE_PERFORMANCE: 85,
  LIGHTHOUSE_ACCESSIBILITY: 95,
  TOTAL_PAGE_WEIGHT_KB: 2048,
  JS_BUNDLE_KB: 512,
  CSS_BUNDLE_KB: 100,
} as const;
