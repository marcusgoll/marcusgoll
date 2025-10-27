/**
 * Content utility functions for client components
 * Extracted from lib/posts.ts to avoid fs import in client components
 */

import { Tag } from '@/lib/posts';

/**
 * Determines the primary content track from post tags
 * Priority: aviation > dev-startup > cross-pollination
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

  return null;
};
