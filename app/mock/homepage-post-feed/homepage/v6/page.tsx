'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Variant 6: Tag Filter Bar + 3-Column Grid (Magic UI-inspired)
 *
 * Approach: Sticky tag filter with counts, 3-column image grid, hover zoom effects
 * Hypothesis: Modern, clean aesthetic with smooth interactions increases engagement
 * Tradeoff: Image-dependent (needs good featured images), less text-focused
 */
export default function HomepageV6() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Aviation Safety Systems', track: 'Aviation', excerpt: 'Learn about systematic thinking in aviation and how checklists prevent catastrophic failures through decades of refinement.', date: 'Oct 15, 2025' },
    { id: 2, title: 'Scalable Architecture', track: 'Dev/Startup', excerpt: 'Building systems that grow from prototype to production without breaking.', date: 'Oct 14, 2025' },
    { id: 3, title: 'Learning from Flight Decks', track: 'Cross-pollination', excerpt: 'How cockpit design principles apply to UI design and human factors engineering.', date: 'Oct 13, 2025' },
    { id: 4, title: 'Pre-flight Checklists', track: 'Aviation', excerpt: 'The importance of routine and how mental models prevent errors.', date: 'Oct 12, 2025' },
    { id: 5, title: 'Code Review Process', track: 'Dev/Startup', excerpt: 'Implementing effective peer review inspired by aviation crew resource management.', date: 'Oct 11, 2025' },
    { id: 6, title: 'Systems Thinking', track: 'Cross-pollination', excerpt: 'How to see connections between aviation and software engineering practices.', date: 'Oct 10, 2025' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  const postCounts = {
    all: posts.length,
    aviation: posts.filter(p => p.track === 'Aviation').length,
    dev: posts.filter(p => p.track === 'Dev/Startup').length,
    cross: posts.filter(p => p.track === 'Cross-pollination').length,
  };

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header with Theme-like styling */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Marcus Gollahon Blog</h1>
              <p className="text-xs text-gray-500">Aviation & Development Insights</p>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Hero Section */}
        <div className="py-12 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Marcus Gollahon Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Systematic thinking from 30,000 feet. Aviation principles applied to software engineering and startups.
          </p>
        </div>

        {/* Tag Filter Bar with Counts */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Link href="?track=all">
              <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                track === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}>
                All <span className="ml-1 text-xs opacity-70">({postCounts.all})</span>
              </button>
            </Link>
            <Link href="?track=aviation">
              <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                track === 'aviation'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}>
                Aviation <span className="ml-1 text-xs opacity-70">({postCounts.aviation})</span>
              </button>
            </Link>
            <Link href="?track=dev">
              <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                track === 'dev'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}>
                Dev/Startup <span className="ml-1 text-xs opacity-70">({postCounts.dev})</span>
              </button>
            </Link>
            <Link href="?track=cross">
              <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                track === 'cross'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}>
                Cross-pollination <span className="ml-1 text-xs opacity-70">({postCounts.cross})</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 3-Column Grid with Hover Effects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm transform transition-transform duration-300 group-hover:scale-105">
                  Featured Image
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {post.track}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 6: Tag Filter Bar + 3-Column Grid (Magic UI-inspired)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Sticky header, hero section, 3-column responsive grid</li>
              <li><strong>Filter:</strong> Tag bar with post counts, modern pill styling</li>
              <li><strong>Interactions:</strong> Hover zoom on images, hover underline on titles</li>
              <li><strong>Visual:</strong> Clean, minimal aesthetic with smooth transitions</li>
              <li><strong>Pros:</strong> Modern feel, engaging interactions, clear filtering with counts</li>
              <li><strong>Cons:</strong> Image-dependent design, less content visible per card</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Magic UI blog - tag filter with counts, hover effects, clean modern aesthetic
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
      <div className="sticky top-0 bg-white border-b border-gray-200">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="py-12 text-center">
          <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <div className="p-5">
                <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
