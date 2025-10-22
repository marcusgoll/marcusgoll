'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

/**
 * Variant 2: Button Pills + Card Grid
 *
 * Approach: Pill-style filter buttons, 2-column card grid
 * Hypothesis: Visual cards increase engagement, grid shows more content
 * Tradeoff: Less detail per post, more scrolling on mobile
 */
export default function HomepageV2() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Aviation Post 1', track: 'Aviation', excerpt: 'Learn about systematic thinking...', date: '2025-10-15', image: '/placeholder.png' },
    { id: 2, title: 'Dev Post 1', track: 'Dev/Startup', excerpt: 'Building scalable systems...', date: '2025-10-14', image: '/placeholder.png' },
    { id: 3, title: 'Cross-pollination Post', track: 'Cross-pollination', excerpt: 'How aviation principles...', date: '2025-10-13', image: '/placeholder.png' },
    { id: 4, title: 'Aviation Post 2', track: 'Aviation', excerpt: 'Safety principles in code...', date: '2025-10-12', image: '/placeholder.png' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Marcus Gollahon
            </h1>
            <p className="text-gray-600">
              Teaching systematic thinking from 30,000 feet
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Filter Pills */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Link href="?track=all">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    track === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  All Posts
                </button>
              </Link>
              <Link href="?track=aviation">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    track === 'aviation'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  ✈️ Aviation
                </button>
              </Link>
              <Link href="?track=dev">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    track === 'dev'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  💻 Dev/Startup
                </button>
              </Link>
              <Link href="?track=cross">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    track === 'cross'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🔀 Cross-pollination
                </button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredPosts.length} posts
            </p>
          </div>

          {/* Featured Banner */}
          <div className="mb-8 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-300 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded mb-2">
                  Featured
                </span>
                <h3 className="text-xl font-bold mb-1">Latest Featured Post</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Discover how aviation safety principles apply to software development...
                </p>
                <Button variant="default" size="sm">
                  Read Article
                </Button>
              </div>
            </div>
          </div>

          {/* Card Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded mb-2">
                    {post.track}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span className="font-medium text-gray-900">Read →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-10 text-center">
            <Button variant="outline" size="default">
              Show 6 More Posts
            </Button>
            <p className="text-xs text-gray-500 mt-2">24 more posts available</p>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-white border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 2: Button Pills + Card Grid</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> 2-3 column grid, card-based</li>
              <li><strong>Filter:</strong> Pill buttons with icons (visual hierarchy)</li>
              <li><strong>Featured:</strong> Horizontal banner with image</li>
              <li><strong>Pros:</strong> High content density, visual engagement, emoji help scannability</li>
              <li><strong>Cons:</strong> Less detail per post, grid less mobile-optimal than list</li>
            </ul>
            <p className="mt-2 text-gray-600">
              States: <Link href="?state=default" className="text-blue-600 underline">default</Link> |
              <Link href="?state=loading" className="text-blue-600 underline ml-1">loading</Link>
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
