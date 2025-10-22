/**
 * Previous/Next Post Navigation Component
 * Chronological navigation between blog posts
 * Server Component - data fetched server-side during static generation
 * FR-002, US2
 */

import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

interface PrevNextNavProps {
  currentSlug: string;
}

export async function PrevNextNav({ currentSlug }: PrevNextNavProps) {
  const allPosts = await getAllPosts();

  // Find current post index in sorted array (sorted by date DESC)
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  // Edge case: post not found
  if (currentIndex === -1) {
    return null;
  }

  // Previous post = older post (index + 1, since array sorted newest first)
  const previousPost = allPosts[currentIndex + 1] || null;

  // Next post = newer post (index - 1)
  const nextPost = allPosts[currentIndex - 1] || null;

  // Don't render if both are null (shouldn't happen with multiple posts)
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav
      className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4"
      aria-label="Post navigation"
    >
      {/* Previous post button */}
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="flex-1 group p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">← Previous</div>
          <div className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {previousPost.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" /> // Spacer to maintain layout
      )}

      {/* Next post button */}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="flex-1 group p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors text-right"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next →</div>
          <div className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {nextPost.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" /> // Spacer to maintain layout
      )}
    </nav>
  );
}
