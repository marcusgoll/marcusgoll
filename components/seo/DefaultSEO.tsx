/**
 * DefaultSEO Component
 *
 * Wrapper for next-seo's DefaultSeo that applies site-wide SEO defaults.
 * Should be placed in the root layout to provide consistent meta tags across all pages.
 *
 * Individual pages can override these defaults using the NextSeo component.
 */

'use client';

import { DefaultSeo } from 'next-seo';
import { defaultSEO } from '@/lib/seo-config';

export function DefaultSEO() {
  return <DefaultSeo {...defaultSEO} />;
}
