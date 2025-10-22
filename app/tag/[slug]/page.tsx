import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import PostGrid from '@/components/blog/PostGrid';
import { getPostsByTag } from '@/lib/posts';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for tag archive pages
 */
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Format tag name for display (replace hyphens with spaces, capitalize)
  const tagName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${tagName} | Marcus Gollahon`,
    description: `Browse all posts tagged with ${tagName} on Marcus Gollahon's blog.`,
  };
}

/**
 * Tag Archive Page
 * Displays all posts for a specific tag
 * Route: /tag/[slug]
 */
export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  // Fetch posts for this tag
  const posts = await getPostsByTag(slug, 50);

  // If no posts found, show 404
  if (!posts || posts.length === 0) {
    notFound();
  }

  // Format tag name for display
  const tagName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="py-12">
      <Container>
        {/* Page Header */}
        <header className="mb-12">
          <div className="mb-4 text-sm text-gray-500">
            <span>Tag Archive</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-navy-900 md:text-5xl">
            {tagName}
          </h1>
          <p className="text-lg text-gray-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with &quot;
            {tagName}&quot;
          </p>
        </header>

        {/* Posts Grid */}
        <PostGrid posts={posts} />
      </Container>
    </div>
  );
}
