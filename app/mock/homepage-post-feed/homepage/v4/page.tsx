'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Variant 4: Minimal Filter + Masonry Grid
 *
 * Approach: Compact dropdown filter, Pinterest-style masonry layout
 * Hypothesis: Maximal content density, unexpected layout draws attention
 * Tradeoff: Unconventional pattern may confuse, harder to scan linearly
 */
export default function HomepageV4() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Aviation Safety Systems', track: 'Aviation', excerpt: 'Learn about systematic thinking in aviation. How checklists prevent catastrophic failures.', date: '2025-10-15', size: 'large' },
    { id: 2, title: 'Scalable Architecture', track: 'Dev/Startup', excerpt: 'Building systems that grow...', date: '2025-10-14', size: 'small' },
    { id: 3, title: 'Learning from Flight Decks', track: 'Cross-pollination', excerpt: 'How cockpit design principles apply to UI design and human factors.', date: '2025-10-13', size: 'medium' },
    { id: 4, title: 'Pre-flight Checklists', track: 'Aviation', excerpt: 'The importance of routine...', date: '2025-10-12', size: 'small' },
    { id: 5, title: 'Code Review Process', track: 'Dev/Startup', excerpt: 'Implementing effective peer review...', date: '2025-10-11', size: 'medium' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marcus Gollahon</h1>
              <p className="text-sm text-gray-600">Aviation & Dev</p>
            </div>

            {/* Compact Filter Dropdown */}
            <div className="relative">
              <select
                value={track}
                onChange={(e) => window.location.href = `?track=${e.target.value}`}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
              >
                <option value="all">All Posts</option>
                <option value="aviation">Aviation</option>
                <option value="dev">Dev/Startup</option>
                <option value="cross">Cross-pollination</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className={`break-inside-avoid bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer ${
                  index === 0 ? 'ring-2 ring-gray-900' : ''
                }`}
              >
                <div className={`bg-gray-200 ${
                  post.size === 'large' ? 'aspect-[4/3]' :
                  post.size === 'medium' ? 'aspect-video' :
                  'aspect-square'
                }`}></div>
                <div className="p-4">
                  {index === 0 && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-gray-900 text-white rounded mb-2 uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                    {post.track}
                  </span>
                  <h2 className={`font-bold text-gray-900 mb-2 ${
                    post.size === 'large' ? 'text-2xl' :
                    post.size === 'medium' ? 'text-lg' :
                    'text-base'
                  }`}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{post.date}</span>
                    <span className="font-medium text-gray-900">Read →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Infinite Scroll Indicator */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2">Scroll for more</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 4: Minimal Filter + Masonry Grid</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Pinterest-style masonry (asymmetric heights)</li>
              <li><strong>Filter:</strong> Compact dropdown in sticky header (minimal chrome)</li>
              <li><strong>Featured:</strong> First card with ring border and badge</li>
              <li><strong>Pros:</strong> Unique visual, maximum content density, sticky header keeps filter accessible</li>
              <li><strong>Cons:</strong> Unconventional (may confuse), harder to scan sequentially, masonry can feel chaotic</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Breaking convention:</strong> This variant challenges the typical blog list/grid pattern with Pinterest-inspired masonry.
              Tests whether visual interest outweighs familiarity.
            </p>
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
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="break-inside-avoid bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className={`bg-gray-200 animate-pulse ${
                  i % 3 === 0 ? 'aspect-[4/3]' :
                  i % 3 === 1 ? 'aspect-video' :
                  'aspect-square'
                }`}></div>
                <div className="p-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
