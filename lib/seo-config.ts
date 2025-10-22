/**
 * SEO Configuration
 *
 * Centralized SEO defaults and configuration for the entire site.
 * Used by next-seo to provide consistent meta tags, Open Graph, and Twitter Card data.
 */

import type { DefaultSeoProps } from 'next-seo';

// Site-wide constants
const SITE_NAME = 'Marcus Gollahon';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';
const SITE_DESCRIPTION = 'Aviation CFI and startup builder sharing insights on flight instruction, software development, and systematic thinking.';
const TWITTER_HANDLE = '@marcusgoll';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

/**
 * Default SEO configuration used site-wide
 */
export const defaultSEO: DefaultSeoProps = {
  defaultTitle: SITE_NAME,
  titleTemplate: `%s | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  canonical: SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Aviation and Software Development`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#0F172A', // Navy 900 from brand colors
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
};

/**
 * Helper function to merge page-specific SEO with defaults
 *
 * @param overrides - Page-specific SEO properties to merge with defaults
 * @returns Merged SEO configuration
 *
 * @example
 * ```tsx
 * const pageSEO = getPageSEO({
 *   title: 'About',
 *   description: 'Learn more about my work in aviation and startups',
 * });
 *
 * <NextSeo {...pageSEO} />
 * ```
 */
export function getPageSEO(overrides: Partial<DefaultSeoProps> = {}): DefaultSeoProps {
  return {
    ...defaultSEO,
    ...overrides,
    openGraph: {
      ...defaultSEO.openGraph,
      ...overrides.openGraph,
      images: overrides.openGraph?.images || defaultSEO.openGraph?.images,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...overrides.twitter,
    },
  };
}

/**
 * Generate canonical URL for a given path
 *
 * @param path - Path relative to site root (e.g., '/blog/post-slug')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash, ensure leading slash
  const cleanPath = path.replace(/\/$/, '').replace(/^([^/])/, '/$1');
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate Open Graph image URL for a post
 *
 * @param imagePath - Path or full URL to image
 * @returns Full URL to Open Graph image
 */
export function getOgImageUrl(imagePath?: string): string {
  if (!imagePath) return DEFAULT_OG_IMAGE;

  // If already a full URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;

  // Otherwise, prepend site URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SITE_URL}${cleanPath}`;
}
