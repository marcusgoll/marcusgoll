'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';

/**
 * Variant 8: Text-First Grid (Google Blog-inspired)
 *
 * Approach: Multi-column grid, no images, text-only cards with category badges
 * Hypothesis: Text-first design reduces cognitive load, faster scanning
 * Tradeoff: Less visual engagement, relies entirely on copy quality
 */
export default function HomepageV8() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', readTime: '8 min' },
    { id: 2, title: 'Scalable Architecture Patterns for Startups', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users without breaking the bank.', date: 'Oct 14, 2025', readTime: '6 min' },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention in software systems.', date: 'Oct 13, 2025', readTime: '10 min' },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews and deployment processes.', date: 'Oct 12, 2025', readTime: '7 min' },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startup engineering culture.', date: 'Oct 11, 2025', readTime: '5 min' },
    { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents and crisis management.', date: 'Oct 10, 2025', readTime: '9 min' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-200">
        <Container>
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marcus Gollahon</h1>
            <p className="text-gray-600">Systematic thinking from aviation applied to software engineering and startups</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16">
          {/* Filter Badges */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3">
              <Link href="?track=all">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded transition-all ${
                  track === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  All posts
                </span>
              </Link>
              <Link href="?track=aviation">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded transition-all ${
                  track === 'aviation'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Aviation
                </span>
              </Link>
              <Link href="?track=dev">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded transition-all ${
                  track === 'dev'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Dev/Startup
                </span>
              </Link>
              <Link href="?track=cross">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded transition-all ${
                  track === 'cross'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Cross-pollination
                </span>
              </Link>
            </div>
          </div>

          {/* Multi-column Text Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer"
              >
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-900 bg-opacity-5 text-gray-700 rounded mb-4">
                  {post.track}
                </span>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 8: Text-First Grid (Google Blog-inspired)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Multi-column grid (3 columns desktop), no images</li>
              <li><strong>Typography:</strong> Large titles (text-2xl), readable excerpts</li>
              <li><strong>Spacing:</strong> Generous margins (60-80px), card padding (24px)</li>
              <li><strong>Visual:</strong> Category badges with semi-transparent backgrounds</li>
              <li><strong>Pros:</strong> Fast loading, text-focused, clean and professional</li>
              <li><strong>Cons:</strong> Less visual engagement, requires excellent copy</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Google Blog - prose as primary, generous whitespace, multi-column grids
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
      <div className="border-b border-gray-200">
        <Container>
          <div className="py-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
