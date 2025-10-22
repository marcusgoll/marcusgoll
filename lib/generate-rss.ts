/**
 * RSS feed generator for blog posts
 * Generates RSS 2.0 compatible feed at build time
 * FR-011, US3
 */

import { Feed } from 'feed';
import { getAllPosts } from './mdx';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate RSS feed and write to public/rss.xml
 * Should be called at build time
 */
export async function generateRSSFeed() {
  const posts = await getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

  const feed = new Feed({
    title: 'Tech Stack Foundation Blog',
    description: 'Articles and insights about aviation and software development',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/images/og-image.jpg`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Marcus Gollahon`,
    updated: posts.length > 0 ? new Date(posts[0].frontmatter.date) : new Date(),
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
    },
    author: {
      name: 'Marcus Gollahon',
      email: 'marcus@marcusgoll.com',
      link: siteUrl,
    },
  });

  // Add each post to the feed
  posts.forEach((post) => {
    const { frontmatter, slug } = post;
    const postUrl = `${siteUrl}/blog/${slug}`;

    feed.addItem({
      title: frontmatter.title,
      id: postUrl,
      link: postUrl,
      description: frontmatter.excerpt,
      content: frontmatter.excerpt, // RSS 2.0 uses description for full content
      author: [
        {
          name: frontmatter.author,
        },
      ],
      date: new Date(frontmatter.date),
      category: frontmatter.tags.map((tag) => ({ name: tag })),
      image: frontmatter.featuredImage ? `${siteUrl}${frontmatter.featuredImage}` : undefined,
    });
  });

  // Write feeds to public directory
  const publicDir = path.join(process.cwd(), 'public');

  try {
    // RSS 2.0
    await fs.writeFile(path.join(publicDir, 'rss.xml'), feed.rss2(), 'utf-8');

    // Atom (optional, modern feed readers prefer Atom)
    await fs.writeFile(path.join(publicDir, 'atom.xml'), feed.atom1(), 'utf-8');

    // JSON Feed (optional, newer standard)
    await fs.writeFile(path.join(publicDir, 'feed.json'), feed.json1(), 'utf-8');

    console.log('✅ RSS feed generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate RSS feed (non-critical):', error);
    // Don't throw - allow build to continue
  }
}

/**
 * Export for use in build scripts or API routes
 */
export default generateRSSFeed;
