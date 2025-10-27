'use client';
export const dynamic = 'force-dynamic';


import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Variant 10: Dense List View (Hacker News-inspired)
 *
 * Approach: Ultra-minimal, compact list, maximum information density
 * Hypothesis: Minimal design reduces distractions, enables fastest scanning
 * Tradeoff: Stark aesthetic may feel unpolished, less welcoming
 */
export default function HomepageV10() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures through decades of refinement.', date: 'Oct 15, 2025', points: 42 },
    { id: 2, title: 'Scalable Architecture Patterns for Startups', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', points: 38 },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention.', date: 'Oct 13, 2025', points: 51 },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.', date: 'Oct 12, 2025', points: 29 },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startups.', date: 'Oct 11, 2025', points: 34 },
    { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents.', date: 'Oct 10, 2025', points: 47 },
    { id: 7, title: 'Crew Resource Management', track: 'Aviation', excerpt: 'How aviation teams prevent errors through communication protocols.', date: 'Oct 9, 2025', points: 26 },
    { id: 8, title: 'Testing in Production', track: 'Dev/Startup', excerpt: 'Lessons from in-flight testing applied to feature flags and canary deployments.', date: 'Oct 8, 2025', points: 41 },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-gray-900">Marcus Gollahon</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="?track=all">
                <span className={track === 'all' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                  all
                </span>
              </Link>
              <Link href="?track=aviation">
                <span className={track === 'aviation' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                  aviation
                </span>
              </Link>
              <Link href="?track=dev">
                <span className={track === 'dev' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                  dev
                </span>
              </Link>
              <Link href="?track=cross">
                <span className={track === 'cross' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}>
                  cross
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Dense List */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-300">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className={`flex gap-4 p-4 ${
                index !== filteredPosts.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Number/Points */}
              <div className="flex-shrink-0 w-10 text-right">
                <div className="text-sm font-medium text-gray-500">{index + 1}.</div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h2 className="text-base font-normal text-gray-900 hover:underline cursor-pointer mb-1">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {post.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {post.track}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="text-gray-600 font-medium">{post.points} reads</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            More
          </button>
        </div>
      </div>

      {/* Variant Notes */}
      <div className="bg-gray-100 border-t border-gray-300 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 10: Dense List View (Hacker News-inspired)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Compact list with numbered posts, maximum density</li>
              <li><strong>Typography:</strong> Small, readable type (text-base/text-sm)</li>
              <li><strong>Visual:</strong> Minimal borders, subtle hover states</li>
              <li><strong>Metadata:</strong> Inline badges, read counts, compact display</li>
              <li><strong>Pros:</strong> Maximum content visible, fast scanning, no distractions</li>
              <li><strong>Cons:</strong> Stark aesthetic, less visual appeal, may feel unfinished</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Hacker News / Reddit - ultra-minimal, text-only, information-dense
            </p>
            <p className="mt-2 text-gray-600">
              States: <Link href="?state=default" className="text-blue-600 underline">default</Link> |
              <Link href="?state=loading" className="text-blue-600 underline ml-1">loading</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-300">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`flex gap-4 p-4 ${
                i !== 6 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="w-10">
                <div className="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
