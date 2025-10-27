'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Variant 1: Traditional Tabs + Vertical List
 *
 * Approach: Tab-based navigation for track filtering, vertical list layout
 * Hypothesis: Familiar tabs pattern reduces cognitive load
 * Tradeoff: More clicks to explore multiple tracks
 */
export default function HomepageV1() {
  const searchParams = useSearchParams();
  const view = searchParams?.get('view') || 'dual';
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  // Mock data
  const posts = [
    { id: 1, title: 'Aviation Post 1', track: 'Aviation', excerpt: 'Learn about systematic thinking in aviation...', date: '2025-10-15' },
    { id: 2, title: 'Dev Post 1', track: 'Dev/Startup', excerpt: 'Building scalable systems with...', date: '2025-10-14' },
    { id: 3, title: 'Cross-pollination Post', track: 'Cross-pollination', excerpt: 'How aviation principles apply to...', date: '2025-10-13' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  if (state === 'empty') {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Marcus Gollahon
            </h1>
            <p className="text-xl text-gray-600">
              Aviation & Software Development
            </p>
          </div>

          {/* Featured Posts */}
          {view === 'dual' && (
            <div className="mb-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Featured
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded mb-2">
                    Aviation
                  </span>
                  <h3 className="text-lg font-semibold mb-2">Featured Aviation Post</h3>
                  <p className="text-gray-600 text-sm">This is a featured post about aviation principles...</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <Link
                href="?track=all"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  track === 'all'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Posts
              </Link>
              <Link
                href="?track=aviation"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  track === 'aviation'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Aviation
              </Link>
              <Link
                href="?track=dev"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  track === 'dev'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dev/Startup
              </Link>
              <Link
                href="?track=cross"
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  track === 'cross'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cross-pollination
              </Link>
            </nav>
          </div>

          {/* Post List (Vertical) */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article key={post.id} className="border-b border-gray-200 pb-6">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded mb-2">
                  {post.track}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Button variant="ghost" size="sm">
                    Read more →
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="default">
              Load More Posts
            </Button>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 1: Traditional Tabs + Vertical List</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Vertical list, full-width posts</li>
              <li><strong>Filter:</strong> Tab navigation (familiar pattern)</li>
              <li><strong>Featured:</strong> Highlighted box at top</li>
              <li><strong>Pros:</strong> Familiar, scannable, mobile-friendly</li>
              <li><strong>Cons:</strong> Requires clicks to switch tracks, less content density</li>
            </ul>
            <p className="mt-2 text-gray-600">
              States: <Link href="?state=default" className="text-blue-600 underline">default</Link> |
              <Link href="?state=loading" className="text-blue-600 underline ml-1">loading</Link> |
              <Link href="?state=empty" className="text-blue-600 underline ml-1">empty</Link>
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-12">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-600 mb-6">
              Check back soon for new content in this category.
            </p>
            <Link href="?track=all">
              <Button variant="default">View All Posts</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
