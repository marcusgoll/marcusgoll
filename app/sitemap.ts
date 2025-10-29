/**
 * Next.js App Router Sitemap Generation
 *
 * Automatically generates XML sitemap at /sitemap.xml for search engine discovery.
 * Replaces custom lib/generate-sitemap.ts script with framework-native implementation.
 *
 * Priority Scheme (GitHub Issue #17):
 * - Homepage: 1.0 (primary landing page)
 * - Blog list: 0.9 (main content hub)
 * - Blog posts: 0.8 (individual content pages)
 *
 * Change Frequency:
 * - Homepage/Blog list: daily (new posts added regularly)
 * - Blog posts: weekly (may be updated with corrections/additions)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * @see https://github.com/marcusgoll/marcusgoll/issues/17
 */

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

/**
 * Generate sitemap for all public pages
 * Called once during build (not on every request)
 *
 * US1 [P1]: Framework-native sitemap route
 * US2 [P1]: Blog posts in sitemap
 * US3 [P1]: Static pages in sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment variable (fallback to production domain)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

  // Warn if environment variable not set (helps catch deployment issues)
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using default: https://marcusgoll.com');
  }

  try {
    // Fetch all published MDX posts (excludes drafts in production)
    // Uses existing getAllPosts() function from lib/mdx.ts
    const posts = await getAllPosts();

    // Static pages (homepage and blog list)
    // Homepage has highest priority (1.0) as primary landing page
    // Blog list has second-highest (0.9) as main content hub
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(), // Dynamic content (new posts added)
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(), // Dynamic content (new posts added)
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // Dynamic blog post pages
    // Transform MDX posts to sitemap entries
    // Uses frontmatter date for lastModified (when post was published/updated)
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.frontmatter.date), // From MDX frontmatter
      changeFrequency: 'weekly' as const, // Posts may be updated weekly
      priority: 0.8, // Individual content pages
    }));

    // Combine static pages and blog posts
    return [...staticPages, ...blogPosts];
  } catch (error) {
    // Log error with actionable message
    console.error('❌ Sitemap generation failed:', error);

    // Fail build explicitly (prevents deployment with stale/missing sitemap)
    throw new Error(
      'Sitemap generation failed. Check MDX files for invalid frontmatter. ' +
      'See error above for details.'
    );
  }
}
