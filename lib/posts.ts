import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Type definitions matching previous Ghost structure
export interface Post {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  primary_author: Author;
  primary_tag: Tag | null;
  authors: Author[];
  tags: Tag[];
  reading_time: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
  website: string | null;
  url: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: string;
  url: string;
}

// Default author (you can customize this)
const defaultAuthor: Author = {
  id: '1',
  name: 'Marcus Gollahon',
  slug: 'marcus',
  profile_image: null,
  bio: 'Teaching systematic thinking from 30,000 feet',
  website: 'https://marcusgoll.com',
  url: '/author/marcus',
};

/**
 * Get all post slugs from content directory
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

/**
 * Get post data by slug
 */
export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(
    postsDirectory,
    `${slug}.mdx`
  );

  // Try .mdx first, fall back to .md
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    fileContents = fs.readFileSync(mdPath, 'utf8');
  }

  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  // Parse tags from frontmatter
  const tagSlugs = data.tags || [];
  const tags: Tag[] = tagSlugs.map((tagSlug: string) => ({
    id: tagSlug,
    name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1),
    slug: tagSlug,
    description: null,
    visibility: 'public',
    url: `/tag/${tagSlug}`,
  }));

  const primaryTag = tags.length > 0 ? tags[0] : null;

  // Convert markdown to HTML (simple approach - you can enhance this)
  const html = content;

  const post: Post = {
    id: slug,
    uuid: slug,
    title: data.title || slug,
    slug,
    html,
    excerpt: data.excerpt || data.description || '',
    feature_image: data.image || data.coverImage || null,
    featured: data.featured || false,
    visibility: 'public',
    created_at: data.date || new Date().toISOString(),
    updated_at: data.updated || data.date || new Date().toISOString(),
    published_at: data.date || new Date().toISOString(),
    custom_excerpt: data.excerpt || null,
    meta_title: data.metaTitle || data.title || null,
    meta_description: data.metaDescription || data.excerpt || null,
    primary_author: defaultAuthor,
    primary_tag: primaryTag,
    authors: [defaultAuthor],
    tags,
    reading_time: Math.ceil(stats.minutes),
  };

  return post;
}

/**
 * Get all posts
 */
export async function getAllPosts(limit = 100): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => {
      // Sort by published date, newest first
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    })
    .slice(0, limit);

  return posts;
}

/**
 * Get posts with optional filtering
 */
export async function getPosts(options?: {
  limit?: number;
  include?: Array<'tags' | 'authors'>;
  filter?: string;
}): Promise<Post[]> {
  let posts = await getAllPosts(options?.limit || 15);

  // Apply filters if provided
  if (options?.filter) {
    const filterMatch = options.filter.match(/tag:([a-z-]+)/);
    if (filterMatch) {
      const tagSlug = filterMatch[1];
      posts = posts.filter((post) =>
        post.tags.some((tag) => tag.slug === tagSlug)
      );
    }
  }

  return posts;
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tagSlug: string, limit = 15): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts
    .filter((post) => post.tags.some((tag) => tag.slug === tagSlug))
    .slice(0, limit);
}

/**
 * Get all unique tags from all posts
 */
export async function getTags(): Promise<Tag[]> {
  const posts = await getAllPosts();
  const tagMap = new Map<string, Tag>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagMap.has(tag.slug)) {
        tagMap.set(tag.slug, tag);
      }
    });
  });

  return Array.from(tagMap.values());
}

/**
 * Determine the primary content track for a post based on its tags
 * Priority order: aviation → dev-startup → cross-pollination
 */
export const getPrimaryTrack = (
  tags: Tag[]
): 'aviation' | 'dev-startup' | 'cross-pollination' | null => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Check for aviation tag (highest priority)
  if (tags.some((tag) => tag.slug === 'aviation')) {
    return 'aviation';
  }

  // Check for dev-startup tag (second priority)
  if (tags.some((tag) => tag.slug === 'dev-startup')) {
    return 'dev-startup';
  }

  // Check for cross-pollination tag (third priority)
  if (tags.some((tag) => tag.slug === 'cross-pollination')) {
    return 'cross-pollination';
  }

  // No track tags found
  return null;
};
