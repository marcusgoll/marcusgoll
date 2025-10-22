/**
 * Ghost CMS to MDX migration script
 * Exports posts from Ghost Admin API and converts to MDX format
 * Usage: npm run migrate-ghost [--dry-run]
 */

import GhostAdminAPI from '@tryghost/admin-api';
import TurndownService from 'turndown';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { PostFrontmatterSchema } from '../lib/mdx-types';

// Configuration
const GHOST_URL = process.env.GHOST_URL || 'https://ghost.marcusgoll.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY || '';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts');

// Command-line arguments
const isDryRun = process.argv.includes('--dry-run');

/**
 * Initialize Ghost Admin API client
 */
function initializeGhostAPI() {
  if (!GHOST_ADMIN_KEY) {
    throw new Error('GHOST_ADMIN_KEY environment variable is required');
  }

  return new GhostAdminAPI({
    url: GHOST_URL,
    key: GHOST_ADMIN_KEY,
    version: 'v5.0',
  });
}

/**
 * Sanitize slug for safe file system usage
 * Prevents path traversal attacks
 */
function sanitizeSlug(slug: string): string {
  const sanitized = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');

  // Validate after sanitization
  if (!sanitized || sanitized.includes('..') || sanitized.includes('/') || sanitized.includes('\\')) {
    throw new Error(`Invalid slug after sanitization: ${slug}`);
  }

  return sanitized;
}

/**
 * Initialize Turndown service for HTML to Markdown conversion
 */
function initializeTurndown() {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Preserve code blocks with language
  turndown.addRule('codeBlock', {
    filter: ['pre'],
    replacement: (content, node) => {
      const codeElement = node.querySelector('code');
      const language = codeElement?.className.match(/language-(\w+)/)?.[1] || '';
      return `\n\n\`\`\`${language}\n${content.trim()}\n\`\`\`\n\n`;
    },
  });

  return turndown;
}

/**
 * Convert Ghost post to MDX format
 */
function convertToMDX(post: any, turndown: TurndownService) {
  // Sanitize slug for safe file system usage
  const sanitizedSlug = sanitizeSlug(post.slug);

  // Convert HTML to Markdown
  const markdown = turndown.turndown(post.html || '');

  // Create frontmatter
  const frontmatter = {
    title: post.title,
    slug: sanitizedSlug,
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || post.meta_description || '',
    author: post.primary_author?.name || 'Marcus Gollahon',
    tags: post.tags?.map((tag: any) => tag.name) || [],
    featuredImage: post.feature_image ? `/images/posts/${sanitizedSlug}/featured.jpg` : undefined,
    draft: post.status !== 'published',
  };

  // Validate frontmatter
  try {
    PostFrontmatterSchema.parse(frontmatter);
  } catch (error) {
    console.warn(`⚠️ Validation warning for ${post.slug}:`, error);
  }

  // Create MDX content
  const mdxContent = matter.stringify(markdown, frontmatter);

  return mdxContent;
}

/**
 * Download featured image
 */
async function downloadFeaturedImage(post: any) {
  if (!post.feature_image) {
    return;
  }

  try {
    // Sanitize slug for safe file system usage
    const sanitizedSlug = sanitizeSlug(post.slug);

    const imageUrl = post.feature_image;
    const postImagesDir = path.join(IMAGES_DIR, sanitizedSlug);

    if (!isDryRun) {
      await fs.mkdir(postImagesDir, { recursive: true });

      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const imagePath = path.join(postImagesDir, 'featured.jpg');

      await fs.writeFile(imagePath, Buffer.from(buffer));
      console.log(`  ✅ Downloaded featured image: ${imagePath}`);
    } else {
      console.log(`  [DRY-RUN] Would download featured image: ${imageUrl}`);
    }
  } catch (error) {
    console.error(`  ❌ Failed to download featured image for ${post.slug}:`, error);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Ghost to MDX migration...\n');
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Initialize services
  const ghostAPI = initializeGhostAPI();
  const turndown = initializeTurndown();

  // Fetch all posts from Ghost
  console.log('📥 Fetching posts from Ghost CMS...');
  const posts = await ghostAPI.posts.browse({
    limit: 'all',
    include: ['tags', 'authors'],
    formats: ['html'],
  });

  console.log(`Found ${posts.length} posts\n`);

  // Create content directory
  if (!isDryRun) {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }

  // Process each post
  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      console.log(`📝 Processing: ${post.title} (${post.slug})`);

      // Sanitize slug for safe file system usage
      const sanitizedSlug = sanitizeSlug(post.slug);

      // Convert to MDX
      const mdxContent = convertToMDX(post, turndown);

      // Write MDX file
      const filePath = path.join(CONTENT_DIR, `${sanitizedSlug}.mdx`);

      if (!isDryRun) {
        await fs.writeFile(filePath, mdxContent, 'utf-8');
        console.log(`  ✅ Created: ${filePath}`);
      } else {
        console.log(`  [DRY-RUN] Would create: ${filePath}`);
      }

      // Download featured image
      await downloadFeaturedImage(post);

      successCount++;
      console.log();
    } catch (error) {
      console.error(`  ❌ Error processing ${post.slug}:`, error);
      errorCount++;
      console.log();
    }
  }

  // Summary
  console.log('📊 Migration Summary:');
  console.log(`  ✅ Success: ${successCount} posts`);
  console.log(`  ❌ Errors: ${errorCount} posts`);

  if (isDryRun) {
    console.log('\n💡 This was a DRY RUN. No files were created.');
    console.log('   Run without --dry-run to perform actual migration.');
  } else {
    console.log('\n✅ Migration complete!');
    console.log(`   Content: ${CONTENT_DIR}`);
    console.log(`   Images: ${IMAGES_DIR}`);
  }
}

// Run migration
migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
