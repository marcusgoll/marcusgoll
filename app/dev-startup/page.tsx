import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PostGrid from '@/components/blog/PostGrid';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getPostsByTag } from '@/lib/posts';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Static metadata
export const metadata: Metadata = {
  title: 'Dev/Startup | Marcus Gollahon',
  description:
    'Software development insights, systematic thinking, and startup lessons from Marcus Gollahon - teaching developers to build with clarity.',
};

/**
 * Dev/Startup Hub Page
 * Displays dev/startup content organized by secondary tags:
 * - Software Development
 * - Systematic Thinking
 * - Startup Insights
 */
export default async function DevStartupPage() {
  // Fetch all dev-startup posts
  const devStartupPosts = await getPostsByTag('dev-startup', 50);

  // Categorize posts by secondary tags
  const softwareDevPosts = devStartupPosts
    .filter((post) => post.tags.some((tag) => tag.slug === 'software-development'))
    .slice(0, 5);

  const systematicThinkingPosts = devStartupPosts
    .filter((post) => post.tags.some((tag) => tag.slug === 'systematic-thinking'))
    .slice(0, 5);

  const startupInsightsPosts = devStartupPosts
    .filter((post) => post.tags.some((tag) => tag.slug === 'startup-insights'))
    .slice(0, 5);

  return (
    <div className="py-12">
      {/* Analytics Page View Tracking */}
      <PageViewTracker track="dev-startup" />

      <Container>
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-navy-900 md:text-5xl">
            Dev/Startup
          </h1>
          <p className="text-lg text-gray-600">
            Software development insights, systematic thinking, and startup
            lessons to help you build better products.
          </p>
        </header>

        {/* Software Development Section */}
        {softwareDevPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              Software Development
            </h2>
            <PostGrid posts={softwareDevPosts} />
          </section>
        )}

        {/* Systematic Thinking Section */}
        {systematicThinkingPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              Systematic Thinking
            </h2>
            <PostGrid posts={systematicThinkingPosts} />
          </section>
        )}

        {/* Startup Insights Section */}
        {startupInsightsPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              Startup Insights
            </h2>
            <PostGrid posts={startupInsightsPosts} />
          </section>
        )}

        {/* All Dev/Startup Posts */}
        {devStartupPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              All Dev/Startup Posts
            </h2>
            <PostGrid posts={devStartupPosts} />
          </section>
        )}

        {/* No Posts Message */}
        {devStartupPosts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>No dev/startup posts found. Check back soon!</p>
          </div>
        )}
      </Container>
    </div>
  );
}
