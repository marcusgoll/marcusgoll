'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Variant 7: Bento Grid + Category Groups (Hybrid)
 *
 * Approach: Mixed-size bento grid, grouped by category, modern layout
 * Hypothesis: Visual variety and category grouping improves content discovery
 * Tradeoff: Complex layout may be harder to scan, desktop-biased
 */
export default function HomepageV7() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const postsByTrack = {
    'Aviation': [
      { id: 1, title: 'Aviation Safety Systems Design', excerpt: 'How commercial aviation applies systematic thinking to prevent catastrophic failures through decades of incident analysis.', date: 'Oct 15, 2025', size: 'large' },
      { id: 4, title: 'Pre-flight Checklist Philosophy', excerpt: 'The cognitive science behind checklists and error prevention.', date: 'Oct 12, 2025', size: 'small' },
    ],
    'Dev/Startup': [
      { id: 2, title: 'Scalable Architecture Patterns', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', size: 'medium' },
      { id: 5, title: 'Code Review Best Practices', excerpt: 'Peer review inspired by crew resource management.', date: 'Oct 11, 2025', size: 'small' },
    ],
    'Cross-pollination': [
      { id: 3, title: 'Human Factors in Interface Design', excerpt: 'What aviation human factors research teaches us about UI design and error prevention in software systems.', date: 'Oct 13, 2025', size: 'medium' },
      { id: 6, title: 'Decision Making Under Pressure', excerpt: 'Emergency frameworks from aviation applied to production incidents.', date: 'Oct 10, 2025', size: 'small' },
    ],
  };

  if (state === 'loading') {
    return <LoadingState />;
  }

  const displayTracks = track === 'all'
    ? Object.keys(postsByTrack)
    : Object.keys(postsByTrack).filter(t => t.toLowerCase().includes(track));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marcus Gollahon</h1>
              <p className="text-gray-600 mt-1">Teaching systematic thinking from 30,000 feet</p>
            </div>

            {/* Mini Filter */}
            <div className="flex gap-2">
              <Link href="?track=all">
                <span className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  track === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  All
                </span>
              </Link>
              <Link href="?track=aviation">
                <span className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  track === 'aviation' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Aviation
                </span>
              </Link>
              <Link href="?track=dev">
                <span className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  track === 'dev' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Dev
                </span>
              </Link>
              <Link href="?track=cross">
                <span className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  track === 'cross' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Cross
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 space-y-16">
          {/* Category-Grouped Bento Grids */}
          {displayTracks.map((trackName) => (
            <section key={trackName}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{trackName}</h2>
                <div className="w-16 h-1 bg-gray-900 rounded"></div>
              </div>

              {/* Bento Grid - Mixed Sizes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {postsByTrack[trackName as keyof typeof postsByTrack].map((post, index) => {
                  const isLarge = post.size === 'large';
                  const isMedium = post.size === 'medium';

                  return (
                    <article
                      key={post.id}
                      className={`group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all ${
                        isLarge ? 'md:col-span-2 md:row-span-2' :
                        isMedium ? 'md:col-span-2' :
                        'md:col-span-1'
                      }`}
                    >
                      <div className={`bg-gray-200 ${
                        isLarge ? 'aspect-[4/3]' :
                        isMedium ? 'aspect-video' :
                        'aspect-square'
                      }`}>
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          {isLarge ? 'Large' : isMedium ? 'Medium' : 'Small'}
                        </div>
                      </div>
                      <div className={`p-4 ${isLarge ? 'md:p-6' : ''}`}>
                        <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors ${
                          isLarge ? 'text-2xl' :
                          isMedium ? 'text-lg' :
                          'text-base'
                        }`}>
                          {post.title}
                        </h3>
                        <p className={`text-gray-600 mb-3 ${
                          isLarge ? 'text-base' : 'text-sm line-clamp-2'
                        }`}>
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.date}</span>
                          <span className="font-medium text-gray-900">Read →</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Newsletter CTA */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Join the systematic thinking community
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Weekly insights on applying aviation principles to software engineering. Join 500+ engineers and founders.
            </p>
            <Button variant="default" size="default">
              Subscribe
            </Button>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-white border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 7: Bento Grid + Category Groups (Hybrid)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Category-grouped sections with mixed-size bento grids</li>
              <li><strong>Filter:</strong> Minimal inline filter in header</li>
              <li><strong>Cards:</strong> Variable sizes (large 2x2, medium 2x1, small 1x1)</li>
              <li><strong>Visual:</strong> Modern bento layout with hover lift effect</li>
              <li><strong>Pros:</strong> Visual variety, clear category organization, modern aesthetic</li>
              <li><strong>Cons:</strong> Complex layout, harder to scan linearly, desktop-biased</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Hybrid approach combining featured content priority (Anthropic) with modern interactions (Magic UI)
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="py-12 space-y-16">
          {[1, 2, 3].map((section) => (
            <section key={section}>
              <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 md:row-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
