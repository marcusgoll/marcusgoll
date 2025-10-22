'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Variant 5: Featured Hero + Uniform Grid (Anthropic-inspired)
 *
 * Approach: Large featured article hero, uniform card grid, subject tags
 * Hypothesis: Professional enterprise feel, clear hierarchy, tag-based discovery
 * Tradeoff: Less content above fold, more formal tone
 */
export default function HomepageV5() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', featured: true },
    { id: 2, title: 'Scalable Architecture Patterns', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', featured: false },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention.', date: 'Oct 13, 2025', featured: false },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.', date: 'Oct 12, 2025', featured: false },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startups.', date: 'Oct 11, 2025', featured: false },
    { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents.', date: 'Oct 10, 2025', featured: false },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));
  const featuredPost = filteredPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <Container>
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Marcus Gollahon</h1>
            <p className="text-sm text-gray-600 mt-1">Engineering & Aviation</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Subject Tags Filter */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Filter by subject
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link href="?track=all">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  track === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  All Articles
                </span>
              </Link>
              <Link href="?track=aviation">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  track === 'aviation'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Aviation
                </span>
              </Link>
              <Link href="?track=dev">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  track === 'dev'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Dev/Startup
                </span>
              </Link>
              <Link href="?track=cross">
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  track === 'cross'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Cross-pollination
                </span>
              </Link>
            </div>
          </div>

          {/* Featured Article Hero */}
          {featuredPost && (
            <article className="mb-16 cursor-pointer group">
              <div className="aspect-[2/1] bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Featured Illustration
                </div>
              </div>
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded mb-3 uppercase tracking-wide">
                  {featuredPost.track}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{featuredPost.date}</span>
                  <Button variant="default" size="default">
                    Read Article
                  </Button>
                </div>
              </div>
            </article>
          )}

          {/* Uniform Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Illustration
                  </div>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                  {post.track}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="text-xs text-gray-500">{post.date}</span>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gray-900 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">
              Want systematic thinking insights delivered weekly?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join pilots, engineers, and founders learning to apply aviation safety principles to software development.
            </p>
            <Button variant="default" size="default" className="bg-white text-gray-900 hover:bg-gray-100">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </Container>

      {/* Variant Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Variant 5: Featured Hero + Uniform Grid (Anthropic-inspired)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> Large featured hero (2:1 aspect), uniform 3-column grid</li>
              <li><strong>Filter:</strong> Subject tags with professional styling</li>
              <li><strong>Cards:</strong> Square illustrations (500x500), consistent proportions</li>
              <li><strong>CTA:</strong> Dark section with newsletter signup</li>
              <li><strong>Pros:</strong> Professional/enterprise feel, clear hierarchy, generous whitespace</li>
              <li><strong>Cons:</strong> Less content above fold, requires high-quality illustrations</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Inspiration:</strong> Anthropic Engineering blog - emphasizes featured content, uniform cards, subject-based discovery
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
      <Container>
        <div className="py-12">
          <div className="aspect-[2/1] bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          <div className="max-w-3xl mb-16">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
