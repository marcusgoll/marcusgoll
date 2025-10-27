'use client';
export const dynamic = 'force-dynamic';


import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Variant 9: Centered Single-Column (Linear-inspired)
 *
 * Approach: Single-column centered layout, clean typography, minimal design
 * Hypothesis: Constrained width increases readability, reduces decision fatigue
 * Tradeoff: Less content visible, more scrolling required
 */
export default function HomepageV9() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', author: 'Marcus Gollahon' },
    { id: 2, title: 'Scalable Architecture Patterns for Startups', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production without breaking the bank.', date: 'Oct 14, 2025', author: 'Marcus Gollahon' },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention.', date: 'Oct 13, 2025', author: 'Marcus Gollahon' },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and deployment processes.', date: 'Oct 12, 2025', author: 'Marcus Gollahon' },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Aviation applied to startups.', date: 'Oct 11, 2025', author: 'Marcus Gollahon' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Centered Content Container */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Marcus Gollahon
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Systematic thinking from 30,000 feet
          </p>

          {/* Simple Text Navigation */}
          <nav className="flex gap-6 text-sm border-b border-gray-200 pb-4">
            <Link href="?track=all">
              <span className={`transition-colors ${
                track === 'all'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}>
                All
              </span>
            </Link>
            <Link href="?track=aviation">
              <span className={`transition-colors ${
                track === 'aviation'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}>
                Aviation
              </span>
            </Link>
            <Link href="?track=dev">
              <span className={`transition-colors ${
                track === 'dev'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}>
                Dev/Startup
              </span>
            </Link>
            <Link href="?track=cross">
              <span className={`transition-colors ${
                track === 'cross'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}>
                Cross-pollination
              </span>
            </Link>
          </nav>
        </header>

        {/* Single-Column Post List */}
        <div className="space-y-16">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="group cursor-pointer"
            >
              {/* Metadata */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span className="text-gray-400">{post.track}</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <div className="text-gray-900 font-medium text-sm group-hover:underline">
                Read article →
              </div>

              {/* Subtle Separator */}
              {index < filteredPosts.length - 1 && (
                <hr className="mt-16 border-gray-200" />
              )}
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center">
          <button className="text-sm font-medium text-gray-900 hover:underline">
            Load more posts
          </button>
        </div>
      </div>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 9: Centered Single-Column (Linear-inspired)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Single-column (max-w-2xl), centered with generous margins</li>
              <li><strong>Typography:</strong> Large titles (text-3xl), readable body (text-lg)</li>
              <li><strong>Navigation:</strong> Simple text links, no pills or buttons</li>
              <li><strong>Spacing:</strong> Consistent vertical rhythm (80px between posts)</li>
              <li><strong>Pros:</strong> Maximum readability, clean/minimal, focused experience</li>
              <li><strong>Cons:</strong> Less content density, requires more scrolling</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Linear Blog - constrained width, vertical rhythm, minimal chrome
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
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-16">
          <div className="h-10 bg-gray-200 rounded w-64 mb-3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-8 animate-pulse"></div>
          <div className="flex gap-6 pb-4 border-b border-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="space-y-16">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
