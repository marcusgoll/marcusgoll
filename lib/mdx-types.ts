/**
 * TypeScript types and Zod schemas for MDX blog post frontmatter
 *
 * Validates frontmatter at build time to ensure data integrity
 * FR-002, FR-004, NFR-009
 */

import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

/**
 * Zod schema for MDX frontmatter validation
 * Build fails if validation fails (NFR-009)
 * T004: Extended with contentType field for LLM optimization
 */
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  date: z.string().datetime('Date must be valid ISO 8601 datetime'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(300, 'Excerpt must be 300 characters or less'),
  author: z.string().min(1, 'Author is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  featuredImage: z.string().optional(),
  publishedAt: z.string().datetime('PublishedAt must be valid ISO 8601 datetime').optional(),
  draft: z.boolean().default(false),
  readingTime: z.number().optional(),
  modified: z.string().datetime('Modified must be valid ISO 8601 datetime').optional(),
  updated: z.string().datetime('Updated must be valid ISO 8601 datetime').optional(),
  // T004: LLM SEO Optimization fields
  contentType: z.enum(['standard', 'faq', 'tutorial']).optional().default('standard'),
  faq: z.array(z.object({
    question: z.string().min(5, 'FAQ question must be at least 5 characters'),
    answer: z.string().min(10, 'FAQ answer must be at least 10 characters'),
  })).optional(),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/**
 * Complete post data including frontmatter and content
 */
export interface PostData {
  frontmatter: PostFrontmatter;
  content: string;           // Raw MDX content
  slug: string;              // Derived from filename
  compiledContent?: MDXContent;  // Compiled JSX (for rendering)
}

/**
 * Tag data derived from post frontmatter
 */
export interface TagData {
  slug: string;          // Lowercase tag identifier (e.g., "aviation")
  displayName: string;   // Human-readable name (e.g., "Aviation")
  postCount: number;     // Number of posts with this tag
  posts: PostData[];     // Array of posts with this tag
}

/**
 * Related post with relevance score
 * Used for "related posts" recommendations based on tag overlap
 * Extends PostData with additional relevanceScore field
 */
export interface RelatedPost extends PostData {
  relevanceScore: number;  // Count of shared tags with current post (higher = more relevant)
}

/**
 * Validation result returned from parsing functions
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
