'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Merged Concept 3: "Modern Minimal"
 *
 * Combines:
 * - v6's sticky header with filter bar (always accessible)
 * - v5's uniform grid layout (consistent)
 * - v6's hover effects (engaging)
 * - Subtle featured indicator (ring border, not large hero)
 * - v5's dark newsletter CTA (conversion)
 *
 * Philosophy: Clean, mobile-first, modern aesthetic with progressive enhancement
 */
export default function MergedConcept3() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', featured: true },
    { id: 2, title: 'Scalable Architecture Patterns for Startups', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', featured: false },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention.', date: 'Oct 13, 2025', featured: false },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.', date: 'Oct 12, 2025', featured: false },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startups.', date: 'Oct 11, 2025', featured: false },
    { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents.', date: 'Oct 10, 2025', featured: false },
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
      {/* Sticky Header with Filter (from v6) */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
        <Container>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Marcus Gollahon</h1>
                <p className="text-xs text-gray-500">Aviation & Development</p>
              </div>
            </div>

            {/* Tag Filter Bar with Counts (from v6) */}
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
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Uniform Grid with Subtle Featured (from v5 + v6) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className={`group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
                  post.featured ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200'
                }`}
              >
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm transform transition-transform duration-300 group-hover:scale-105">
                    Illustration
                  </div>
                </div>
                <div className="p-5">
                  {post.featured && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-gray-900 text-white rounded mb-2 uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                    {post.track}
                  </span>
                  <h3 className={`font-bold text-gray-900 mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all ${
                    post.featured ? 'text-2xl' : 'text-xl'
                  }`}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Dark CTA Section (from v5) */}
          <div className="mt-20 bg-gray-900 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">
              Join the systematic thinking community
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Weekly insights on applying aviation principles to software engineering. Join 500+ engineers and founders.
            </p>
            <Button variant="default" size="default" className="bg-white text-gray-900 hover:bg-gray-100">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </Container>

      {/* Concept Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Merged Concept 3: "Modern Minimal"</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Header:</strong> v6's sticky header with integrated filter bar (always accessible)</li>
              <li><strong>Featured:</strong> Subtle ring border + badge (not huge hero, stays in grid)</li>
              <li><strong>Grid:</strong> v5's uniform square cards (consistent, clean)</li>
              <li><strong>Hover:</strong> v6's zoom + underline effects (engaging)</li>
              <li><strong>Filter:</strong> v6's tag bar with counts in header (informative)</li>
              <li><strong>CTA:</strong> v5's dark newsletter section (high contrast)</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Best for:</strong> Modern blogs, SaaS marketing, mobile-first sites
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
          <div className="py-4">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
