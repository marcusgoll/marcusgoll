import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PostGrid from '@/components/blog/PostGrid';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getPostsByTag } from '@/lib/posts';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Static metadata
export const metadata: Metadata = {
  title: 'Aviation | Marcus Gollahon',
  description:
    'Aviation career guidance, flight training resources, and CFI insights from Marcus Gollahon - helping pilots advance their aviation careers.',
};

/**
 * Aviation Hub Page
 * Displays aviation content organized by secondary tags:
 * - Flight Training
 * - CFI Resources
 * - Career Path
 */
export default async function AviationPage() {
  // Fetch all aviation posts
  const aviationPosts = await getPostsByTag('aviation', 50);

  // Categorize posts by secondary tags
  const flightTrainingPosts = aviationPosts.filter((post) =>
    post.tags.some((tag) => tag.slug === 'flight-training')
  ).slice(0, 5);

  const cfiResourcesPosts = aviationPosts.filter((post) =>
    post.tags.some((tag) => tag.slug === 'cfi-resources')
  ).slice(0, 5);

  const careerPathPosts = aviationPosts.filter((post) =>
    post.tags.some((tag) => tag.slug === 'career-path')
  ).slice(0, 5);

  return (
    <div className="py-12">
      {/* Analytics Page View Tracking */}
      <PageViewTracker track="aviation" />

      <Container>
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-navy-900 md:text-5xl">
            Aviation
          </h1>
          <p className="text-lg text-gray-600">
            Flight training resources, CFI insights, and aviation career
            guidance to help you advance your aviation career.
          </p>
        </header>

        {/* Flight Training Section */}
        {flightTrainingPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              Flight Training
            </h2>
            <PostGrid posts={flightTrainingPosts} />
          </section>
        )}

        {/* CFI Resources Section */}
        {cfiResourcesPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              CFI Resources
            </h2>
            <PostGrid posts={cfiResourcesPosts} />
          </section>
        )}

        {/* Career Path Section */}
        {careerPathPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              Career Path
            </h2>
            <PostGrid posts={careerPathPosts} />
          </section>
        )}

        {/* All Aviation Posts */}
        {aviationPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              All Aviation Posts
            </h2>
            <PostGrid posts={aviationPosts} />
          </section>
        )}

        {/* No Posts Message */}
        {aviationPosts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>No aviation posts found. Check back soon!</p>
          </div>
        )}
      </Container>
    </div>
  );
}
