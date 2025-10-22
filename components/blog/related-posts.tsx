/**
 * Related Posts Component
 * Displays 3 related posts based on tag overlap algorithm
 * Server Component - data fetched server-side during static generation
 * FR-001, US1
 */

import { getRelatedPosts } from '@/lib/mdx';
import { PostCard } from './post-card';

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
}

export async function RelatedPosts({ currentSlug, limit = 3 }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentSlug, limit);

  // Don't render if no related posts found
  if (relatedPosts.length === 0) {
    return null;
  }

  // Check if showing true related posts (score > 0) or fallback latest posts
  const hasRelatedPosts = relatedPosts.some((post) => post.relevanceScore > 0);
  const sectionTitle = hasRelatedPosts ? 'Related Posts' : 'Latest Posts';

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-3xl font-bold tracking-tight mb-8">{sectionTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <div key={post.slug} className="border-none pb-0">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Optional: Show relevance scores in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-600">
          {relatedPosts.map((post) => (
            <div key={post.slug}>
              {post.slug}: relevance score = {post.relevanceScore}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
