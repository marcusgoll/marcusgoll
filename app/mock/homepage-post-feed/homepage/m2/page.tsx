'use client';
export const dynamic = 'force-dynamic';


import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * Merged Concept 2: "Sidebar Enhanced"
 *
 * Combines:
 * - v3's persistent sidebar with counts (power user)
 * - v5's large 2:1 featured hero in main area (prominent)
 * - v6's 3-column grid with hover effects (modern)
 * - v5's dark newsletter CTA (conversion)
 *
 * Philosophy: Desktop-first professional experience with maximum navigation
 */
export default function MergedConcept2() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';

  const posts = [
    { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', featured: true, hasImage: true, size: 'large' },
    { id: 2, title: 'Scalable Architecture Patterns', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', featured: false, hasImage: false, size: 'small' },
    { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention in software systems.', date: 'Oct 13, 2025', featured: false, hasImage: true, size: 'medium' },
    { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.', date: 'Oct 12, 2025', featured: false, hasImage: false, size: 'small' },
    { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startup engineering culture.', date: 'Oct 11, 2025', featured: false, hasImage: true, size: 'medium' },
    { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents and crisis management.', date: 'Oct 10, 2025', featured: false, hasImage: true, size: 'medium' },
  ];

  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));
  const featuredPost = filteredPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  if (state === 'loading') {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Systematic thinking from 30,000 feet
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aviation principles applied to software engineering and startups.
              Learn how commercial aviation's systematic approach to safety translates to building resilient systems.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          <div className="flex gap-8">
            {/* Persistent Sidebar (from v3) */}
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
            <main className="flex-1 min-w-0">
              {/* Featured Hero (from v5) */}
              {featuredPost && (
                <article className="mb-10 cursor-pointer group">
                  {featuredPost.hasImage && (
                    <div className="aspect-[2/1] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Featured Illustration
                      </div>
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded mb-3 uppercase tracking-wide">
                    {featuredPost.track}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
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
                </article>
              )}

              {/* Magazine Masonry Grid */}
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {regularPosts.map((post) => {
                  const isLarge = post.size === 'large';
                  const isMedium = post.size === 'medium';

                  return (
                    <article
                      key={post.id}
                      className="break-inside-avoid group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      {post.hasImage && (
                        <div className={`bg-gray-200 overflow-hidden ${
                          isLarge ? 'aspect-[4/3]' :
                          isMedium ? 'aspect-video' :
                          'aspect-square'
                        }`}>
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm transform transition-transform duration-300 group-hover:scale-105">
                            {isLarge ? 'Large' : isMedium ? 'Medium' : 'Small'}
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-3">
                          {post.track}
                        </span>
                        <h3 className={`font-bold text-gray-900 mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all ${
                          isLarge ? 'text-2xl' :
                          isMedium ? 'text-lg' :
                          'text-base'
                        }`}>
                          {post.title}
                        </h3>
                        <p className={`text-gray-600 mb-3 ${
                          isLarge ? 'text-base' : 'text-sm'
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
            </main>
          </div>
        </div>
      </Container>

      {/* Concept Notes */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Merged Concept 2: "Sidebar Enhanced"</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Layout:</strong> v3's sidebar + main content (desktop power user)</li>
              <li><strong>Hero:</strong> v5's large 2:1 featured hero in main area</li>
              <li><strong>Filter:</strong> v3's persistent sidebar with post counts (always visible)</li>
              <li><strong>Grid:</strong> v6's 3-column grid with aspect-video cards</li>
              <li><strong>Hover:</strong> v6's zoom + underline effects (engaging)</li>
              <li><strong>CTA:</strong> Sidebar newsletter box (always present)</li>
            </ul>
            <p className="mt-2 text-gray-600">
              <strong>Best for:</strong> Documentation sites, developer blogs, content-heavy sites
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
            <div className="aspect-[2/1] bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </main>
        </div>
      </Container>
    </div>
  );
}
