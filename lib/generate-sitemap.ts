/**
 * Sitemap generator for blog posts and static pages
 * Generates XML sitemap at build time for SEO
 * FR-012, US3
 */

import { getAllPosts } from './mdx';
import fs from 'fs/promises';
import path from 'path';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate sitemap.xml and write to public directory
 * Should be called at build time
 */
export async function generateSitemap() {
  const posts = await getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

  const entries: SitemapEntry[] = [];

  // Static pages
  entries.push(
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  );

  // Blog posts
  posts.forEach((post) => {
    entries.push({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.frontmatter.date).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(process.cwd(), 'public');

  try {
    await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
    console.log('✅ Sitemap generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate sitemap (non-critical):', error);
    // Don't throw - allow build to continue
  }
}

/**
 * Export for use in build scripts or API routes
 */
export default generateSitemap;

// Run sitemap generation when executed as a script
if (require.main === module) {
  generateSitemap();
}
