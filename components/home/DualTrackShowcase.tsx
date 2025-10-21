import Link from 'next/link';
import { GhostPost } from '@/lib/ghost';
import PostGrid from '@/components/blog/PostGrid';
import Button from '@/components/ui/Button';

interface DualTrackShowcaseProps {
  aviationPosts: GhostPost[];
  devStartupPosts: GhostPost[];
}

/**
 * DualTrackShowcase component - Homepage feature sections
 * Displays latest posts from both content tracks with "View All" CTAs
 */
export default function DualTrackShowcase({
  aviationPosts,
  devStartupPosts,
}: DualTrackShowcaseProps) {
  return (
    <div className="space-y-16">
      {/* Aviation Track Section */}
      <section>
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-navy-900">Aviation</h2>
            <p className="text-gray-600">
              Flight training, CFI resources, and aviation career guidance
            </p>
          </div>
          <Link href="/aviation">
            <Button variant="outline" size="md">
              View All Aviation Posts
            </Button>
          </Link>
        </div>
        {aviationPosts.length > 0 ? (
          <PostGrid posts={aviationPosts} />
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No aviation posts available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Dev/Startup Track Section */}
      <section>
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-navy-900">
              Dev/Startup
            </h2>
            <p className="text-gray-600">
              Software development, systematic thinking, and startup insights
            </p>
          </div>
          <Link href="/dev-startup">
            <Button variant="outline" size="md">
              View All Dev/Startup Posts
            </Button>
          </Link>
        </div>
        {devStartupPosts.length > 0 ? (
          <PostGrid posts={devStartupPosts} />
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No dev/startup posts available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
