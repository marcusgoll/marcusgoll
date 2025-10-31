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
      className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-4"
      aria-label="Post navigation"
    >
      {/* Previous post button */}
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="flex-1 group p-4 border border-[var(--border)] rounded-lg hover:border-[var(--highlight)] transition-colors min-h-[4rem]"
        >
          <div className="text-sm text-[var(--text-muted)] mb-1">← Previous</div>
          <div className="font-semibold group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
            {previousPost.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" /> // Spacer to maintain layout (desktop only)
      )}

      {/* Next post button */}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="flex-1 group p-4 border border-[var(--border)] rounded-lg hover:border-[var(--highlight)] transition-colors sm:text-right min-h-[4rem]"
        >
          <div className="text-sm text-[var(--text-muted)] mb-1">Next →</div>
          <div className="font-semibold group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
            {nextPost.frontmatter.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" /> // Spacer to maintain layout (desktop only)
      )}
    </nav>
  );
}
