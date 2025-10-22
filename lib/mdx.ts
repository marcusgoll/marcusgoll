/**
 * Core MDX parsing and metadata extraction library
 *
 * Provides functions to read and parse MDX files from content/posts/
 * Validates frontmatter at build time using Zod schemas
 * FR-001, FR-002, FR-003, FR-004, NFR-008, NFR-009
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { PostFrontmatterSchema, type PostData, type PostFrontmatter, type TagData } from './mdx-types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

/**
 * Calculate estimated reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

/**
 * Validate frontmatter using Zod schema
 * Throws error with detailed message if validation fails (NFR-009)
 */
function validateFrontmatter(frontmatter: unknown, filename: string): PostFrontmatter {
  try {
    const validated = PostFrontmatterSchema.parse(frontmatter);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[${filename}] Invalid frontmatter: ${error.message}`);
    }
    throw new Error(`[${filename}] Invalid frontmatter: Unknown validation error`);
  }
}

/**
 * Get all published MDX posts sorted by date (newest first)
 * Excludes drafts in production
 * FR-001, FR-003
 */
export async function getAllPosts(): Promise<PostData[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        return getPostBySlug(slug);
      })
    );

    // Filter out null posts (invalid or draft)
    const validPosts = posts.filter((post): post is PostData => post !== null);

    // Filter out drafts in production
    const publishedPosts = process.env.NODE_ENV === 'production'
      ? validPosts.filter((post) => !post.frontmatter.draft)
      : validPosts;

    // Sort by date descending (newest first)
    return publishedPosts.sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
  } catch (error) {
    // Content directory doesn't exist yet
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Get a single post by slug
 * Returns null if post not found
 * FR-001, FR-002, FR-004
 */
export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const { data, content } = matter(fileContent);

    // Validate frontmatter
    const frontmatter = validateFrontmatter(data, `${slug}.mdx`);

    // Verify slug matches filename (data integrity check)
    if (frontmatter.slug !== slug) {
      throw new Error(`[${slug}.mdx] Slug mismatch: frontmatter slug "${frontmatter.slug}" does not match filename "${slug}"`);
    }

    // Calculate reading time if not provided
    if (!frontmatter.readingTime) {
      frontmatter.readingTime = calculateReadingTime(content);
    }

    return {
      frontmatter,
      content,
      slug,
    };
  } catch (error) {
    // File not found
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    // Validation or parsing errors should bubble up
    throw error;
  }
}

/**
 * Get all posts with a specific tag
 * FR-014
 */
export async function getPostsByTag(tag: string): Promise<PostData[]> {
  const allPosts = await getAllPosts();
  const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');

  return allPosts.filter((post) =>
    post.frontmatter.tags.some((postTag) => postTag.toLowerCase().replace(/\s+/g, '-') === tagSlug)
  );
}

/**
 * Get all unique tags with post counts
 * FR-014
 */
export async function getAllTags(): Promise<TagData[]> {
  const allPosts = await getAllPosts();
  const tagMap = new Map<string, { displayName: string; posts: PostData[] }>();

  // Build tag map
  allPosts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
      const existing = tagMap.get(tagSlug);

      if (existing) {
        existing.posts.push(post);
      } else {
        tagMap.set(tagSlug, {
          displayName: tag,
          posts: [post],
        });
      }
    });
  });

  // Convert to TagData array
  const tags: TagData[] = Array.from(tagMap.entries()).map(([slug, data]) => ({
    slug,
    displayName: data.displayName,
    postCount: data.posts.length,
    posts: data.posts,
  }));

  // Sort by post count descending
  return tags.sort((a, b) => b.postCount - a.postCount);
}

/**
 * Search posts by query string (title, excerpt, tags)
 * Case-insensitive search
 * FR-015
 */
export function searchPosts(query: string, posts: PostData[]): PostData[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return posts;
  }

  return posts.filter((post) => {
    const title = post.frontmatter.title.toLowerCase();
    const excerpt = post.frontmatter.excerpt.toLowerCase();
    const tags = post.frontmatter.tags.map((tag) => tag.toLowerCase()).join(' ');

    return title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.includes(searchTerm);
  });
}
