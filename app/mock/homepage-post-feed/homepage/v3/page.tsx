'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

/**
 * Variant 3: Sidebar Filter + Magazine Layout
 *
 * Approach: Persistent sidebar filter, mixed large/small card layout
 * Hypothesis: Desktop-first with visual hierarchy, featured content naturally prominent
 * Tradeoff: Desktop-optimized (sidebar collapses to top on mobile), more complex layout
 */
export default function HomepageV3() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Aviation Safety Systems', track: 'Aviation', excerpt: 'Learn about systematic thinking in aviation...', date: '2025-10-15', featured: true },
    { id: 2, title: 'Scalable Architecture', track: 'Dev/Startup', excerpt: 'Building systems that grow...', date: '2025-10-14', featured: false },
    { id: 3, title: 'Learning from Flight Decks', track: 'Cross-pollination', excerpt: 'How cockpit design principles...', date: '2025-10-13', featured: false },
    { id: 4, title: 'Pre-flight Checklists', track: 'Aviation', excerpt: 'The importance of routine...', date: '2025-10-12', featured: false },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));
  const featuredPost = filteredPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Marcus Gollahon
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Aviation & Software Development
          </p>

          <div className="flex gap-8">
            {/* Sidebar Filter */}
            <aside className="w-64 flex-shrink-0 sticky top-8 self-start">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Filter by Track
                </h3>
                <nav className="space-y-1">
                  <Link href="?track=all">
                    <div className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      track === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      All Posts ({posts.length})
                    </div>
                  </Link>
                  <Link href="?track=aviation">
                    <div className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      track === 'aviation'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Aviation ({posts.filter(p => p.track === 'Aviation').length})
                    </div>
                  </Link>
                  <Link href="?track=dev">
                    <div className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      track === 'dev'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Dev/Startup ({posts.filter(p => p.track === 'Dev/Startup').length})
                    </div>
                  </Link>
                  <Link href="?track=cross">
                    <div className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      track === 'cross'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Cross-pollination ({posts.filter(p => p.track === 'Cross-pollination').length})
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Sidebar CTA */}
              <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
                <p className="text-sm mb-3">
                  Get systematic thinking insights delivered weekly
                </p>
                <Button variant="default" size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Featured Hero */}
              {featuredPost && (
                <article className="mb-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <div className="md:flex">
                    <div className="md:w-2/5 bg-gray-300 aspect-video md:aspect-auto"></div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded mb-3">
                        Featured
                      </span>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{featuredPost.date}</span>
                        <Button variant="default" size="default">
                          Read Article
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Regular Posts - Magazine Style */}
              <div className="space-y-6">
                {regularPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`flex gap-4 pb-6 border-b border-gray-200 hover:bg-gray-50 -mx-4 px-4 transition-colors cursor-pointer ${
                      index === 0 ? 'pt-0' : 'pt-6'
                    }`}
                  >
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded mb-2">
                        {post.track}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.excerpt}
                      </p>
                      <span className="text-xs text-gray-500">{post.date}</span>
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
            </main>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 3: Sidebar Filter + Magazine Layout</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Sidebar + main content, magazine-style cards</li>
              <li><strong>Filter:</strong> Persistent sidebar navigation with post counts</li>
              <li><strong>Featured:</strong> Large hero card with side-by-side image/content</li>
              <li><strong>Pros:</strong> Professional look, sidebar always visible, content hierarchy clear</li>
              <li><strong>Cons:</strong> Desktop-biased, sidebar takes space, mobile requires collapse</li>
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
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-12 flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="bg-gray-100 rounded-lg p-8 mb-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 mb-6 animate-pulse">
                <div className="w-32 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </Container>
    </div>
  );
}
