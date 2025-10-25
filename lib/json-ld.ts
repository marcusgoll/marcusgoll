/**
 * JSON-LD Schema Generators
 *
 * Generates Schema.org structured data for search engines.
 * Supports Article (blog posts) and WebSite (homepage) schemas.
 *
 * US5, T018
 */

import type { PostData } from './mdx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';
const SITE_NAME = 'Marcus Gollahon';
const AUTHOR_NAME = 'Marcus Gollahon';

/**
 * Organization schema for publisher
 * Used in Article schema to identify the publisher
 */
const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/logo.png`,
  },
};

/**
 * Person schema for author
 * Used in Article schema to identify the author
 */
const PERSON_SCHEMA = {
  '@type': 'Person',
  name: AUTHOR_NAME,
  url: SITE_URL,
};

/**
 * Generate Article JSON-LD schema for blog posts
 *
 * Creates Schema.org Article structured data for rich search results.
 * Includes author, publish date, headline, images, and publisher info.
 *
 * @param post - Blog post object with frontmatter and slug
 * @returns Article schema object for JSON-LD
 *
 * @example
 * ```tsx
 * const articleSchema = generateArticleSchema(post);
 * <script type="application/ld+json">
 *   {JSON.stringify(articleSchema)}
 * </script>
 * ```
 */
export function generateArticleSchema(post: PostData) {
  const { frontmatter, slug } = post;
  const articleUrl = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    author: PERSON_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
    datePublished: frontmatter.date,
    dateModified: frontmatter.modified ?? frontmatter.updated ?? frontmatter.date, // Prefer explicit modified/updated fields
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: frontmatter.featuredImage
      ? {
          '@type': 'ImageObject',
          url: frontmatter.featuredImage.startsWith('http')
            ? frontmatter.featuredImage
            : `${SITE_URL}${frontmatter.featuredImage}`,
          width: 1200,
          height: 630,
        }
      : {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/og-default.jpg`,
          width: 1200,
          height: 630,
        },
    articleSection: frontmatter.tags?.[0] || 'General', // Primary tag as section
    keywords: frontmatter.tags?.join(', ') || '',
  };
}

/**
 * Generate WebSite JSON-LD schema for homepage
 *
 * Creates Schema.org WebSite structured data for site-level information.
 * Helps search engines understand the site's purpose and structure.
 *
 * @returns WebSite schema object for JSON-LD
 *
 * @example
 * ```tsx
 * const websiteSchema = generateWebSiteSchema();
 * <script type="application/ld+json">
 *   {JSON.stringify(websiteSchema)}
 * </script>
 * ```
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Aviation CFI and startup builder sharing insights on flight instruction, software development, and systematic thinking.',
    author: PERSON_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
  };
}
