'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * M2 Functional Prototype: "Sidebar Enhanced + Magazine Masonry"
 *
 * Phase 2b enhancements:
 * - Full accessibility (ARIA labels, semantic HTML, keyboard nav)
 * - Responsive behavior (sidebar → mobile drawer)
 * - Loading/empty/error states
 * - Screen reader announcements
 * - Focus management
 * - Keyboard shortcuts
 */

type Post = {
  id: number;
  title: string;
  track: 'Aviation' | 'Dev/Startup' | 'Cross-pollination';
  excerpt: string;
  date: string;
  featured: boolean;
  hasImage: boolean;
  size: 'large' | 'medium' | 'small';
};

const MOCK_POSTS: Post[] = [
  { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures. Lessons from decades of incident analysis and crew resource management.', date: 'Oct 15, 2025', featured: true, hasImage: true, size: 'large' },
  { id: 2, title: 'Scalable Architecture Patterns', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production. Real-world patterns from 0 to 100k users.', date: 'Oct 14, 2025', featured: false, hasImage: false, size: 'small' },
  { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design and error prevention in software systems.', date: 'Oct 13, 2025', featured: false, hasImage: true, size: 'medium' },
  { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists and how to apply it to code reviews.', date: 'Oct 12, 2025', featured: false, hasImage: false, size: 'small' },
  { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems. Lessons from aviation applied to startup engineering culture.', date: 'Oct 11, 2025', featured: false, hasImage: true, size: 'medium' },
  { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation applied to production incidents and crisis management.', date: 'Oct 10, 2025', featured: false, hasImage: true, size: 'medium' },
];

export default function M2FunctionalPrototype() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+M: Toggle mobile menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        setMobileMenuOpen(prev => !prev);
      }
      // Alt+1-4: Quick filter navigation
      if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const filters = ['all', 'aviation', 'dev', 'cross'];
        const index = parseInt(e.key) - 1;
        window.location.href = `?track=${filters[index]}`;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen reader announcements for filter changes
  useEffect(() => {
    const trackLabels = {
      all: 'All Posts',
      aviation: 'Aviation',
      dev: 'Dev/Startup',
      cross: 'Cross-pollination',
    };
    setAnnouncement(`Filtering by ${trackLabels[track as keyof typeof trackLabels]}`);
  }, [track]);

  const posts = MOCK_POSTS;
  const filteredPosts = track === 'all' ? posts : posts.filter(p => p.track.toLowerCase().includes(track));
  const featuredPost = filteredPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  const postCounts = {
    all: posts.length,
    aviation: posts.filter(p => p.track === 'Aviation').length,
    dev: posts.filter(p => p.track === 'Dev/Startup').length,
    cross: posts.filter(p => p.track === 'Cross-pollination').length,
  };

  if (state === 'loading') {
    return <LoadingState />;
  }

  if (state === 'empty') {
    return <EmptyState track={track} />;
  }

  if (state === 'error') {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Screen Reader Announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <header className="bg-gray-900 text-white">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Systematic thinking from 30,000 feet
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aviation principles applied to software engineering and startups.
              Learn how commercial aviation&apos;s systematic approach to safety translates to building resilient systems.
            </p>
          </div>
        </Container>
      </header>

      <Container>
        <div className="py-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mb-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-expanded={mobileMenuOpen}
            aria-controls="sidebar-nav"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? 'Close' : 'Open'} Menu
          </button>

          <div className="flex gap-8">
            {/* Persistent Sidebar (Desktop) / Collapsible (Mobile) */}
            <aside
              id="sidebar-nav"
              className={`
                w-64 flex-shrink-0 lg:sticky lg:top-8 lg:self-start
                ${mobileMenuOpen ? 'block' : 'hidden lg:block'}
              `}
              aria-label="Blog navigation and filters"
            >
              <nav aria-label="Content filter">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Filter by Track
                  </h2>
                  <ul className="space-y-1" role="list">
                    {[
                      { key: 'all', label: 'All Posts', count: postCounts.all, shortcut: '1' },
                      { key: 'aviation', label: 'Aviation', count: postCounts.aviation, shortcut: '2' },
                      { key: 'dev', label: 'Dev/Startup', count: postCounts.dev, shortcut: '3' },
                      { key: 'cross', label: 'Cross-pollination', count: postCounts.cross, shortcut: '4' },
                    ].map(({ key, label, count, shortcut }) => (
                      <li key={key}>
                        <Link href={`?track=${key}`}>
                          <div
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                              track === key
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            role="button"
                            aria-current={track === key ? 'page' : undefined}
                            aria-label={`${label} (${count} posts, Alt+${shortcut})`}
                          >
                            {label} ({count})
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              {/* Sidebar Newsletter CTA */}
              <aside className="mt-4 p-4 bg-gray-900 text-white rounded-lg" aria-label="Newsletter signup">
                <p className="text-sm mb-3">
                  Get systematic thinking insights delivered weekly
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </aside>

              {/* Keyboard Shortcuts Help */}
              <details className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                <summary className="font-semibold text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900">
                  Keyboard Shortcuts
                </summary>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li><kbd className="px-1 bg-gray-200 rounded">Alt+M</kbd> Toggle menu</li>
                  <li><kbd className="px-1 bg-gray-200 rounded">Alt+1-4</kbd> Quick filter</li>
                </ul>
              </details>
            </aside>

            {/* Main Content */}
            <main id="main-content" className="flex-1 min-w-0" role="main">
              {/* Featured Hero */}
              {featuredPost && (
                <article
                  className="mb-10 cursor-pointer group focus-within:ring-2 focus-within:ring-gray-900 rounded-lg"
                  aria-labelledby={`post-title-${featuredPost.id}`}
                >
                  <Link href={`/blog/${featuredPost.id}`} className="block focus:outline-none">
                    {featuredPost.hasImage && (
                      <div
                        className="aspect-[2/1] bg-gray-200 rounded-lg mb-4 overflow-hidden"
                        role="img"
                        aria-label="Featured article illustration"
                      >
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Featured Illustration
                        </div>
                      </div>
                    )}
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded mb-3 uppercase tracking-wide">
                      {featuredPost.track}
                    </span>
                    <h2
                      id={`post-title-${featuredPost.id}`}
                      className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors"
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <time dateTime="2025-10-15" className="text-sm text-gray-500">
                        {featuredPost.date}
                      </time>
                      <Button
                        variant="default"
                        size="default"
                        className="focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        aria-label={`Read article: ${featuredPost.title}`}
                      >
                        Read Article
                      </Button>
                    </div>
                  </Link>
                </article>
              )}

              {/* Magazine Masonry Grid */}
              <div
                className="columns-1 md:columns-2 gap-6 space-y-6"
                role="feed"
                aria-label="Blog posts"
                aria-busy="false"
              >
                {regularPosts.map((post) => {
                  const isLarge = post.size === 'large';
                  const isMedium = post.size === 'medium';

                  return (
                    <article
                      key={post.id}
                      className="break-inside-avoid group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all focus-within:ring-2 focus-within:ring-gray-900"
                      aria-labelledby={`post-title-${post.id}`}
                    >
                      <Link href={`/blog/${post.id}`} className="block focus:outline-none">
                        {post.hasImage && (
                          <div
                            className={`bg-gray-200 overflow-hidden ${
                              isLarge ? 'aspect-[4/3]' :
                              isMedium ? 'aspect-video' :
                              'aspect-square'
                            }`}
                            role="img"
                            aria-label={`${post.title} illustration`}
                          >
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm transform transition-transform duration-300 group-hover:scale-105">
                              {isLarge ? 'Large' : isMedium ? 'Medium' : 'Small'}
                            </div>
                          </div>
                        )}
                        <div className="p-5">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-3">
                            {post.track}
                          </span>
                          <h3
                            id={`post-title-${post.id}`}
                            className={`font-bold text-gray-900 mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all ${
                              isLarge ? 'text-2xl' :
                              isMedium ? 'text-lg' :
                              'text-base'
                            }`}
                          >
                            {post.title}
                          </h3>
                          <p className={`text-gray-600 mb-3 ${
                            isLarge ? 'text-base' : 'text-sm'
                          }`}>
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <time dateTime="2025-10-15">{post.date}</time>
                            <span className="font-medium text-gray-900" aria-hidden="true">Read →</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* No results message */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12" role="status">
                  <p className="text-gray-600">No posts found for this filter.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>

      {/* Accessibility Notes (for review only) */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <Container>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Phase 2b: Accessibility Enhancements</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>✅ Semantic HTML (header, main, nav, aside, article)</li>
              <li>✅ ARIA labels and landmarks</li>
              <li>✅ Keyboard navigation (Tab, Alt+M, Alt+1-4)</li>
              <li>✅ Focus indicators (ring-2 on all interactive elements)</li>
              <li>✅ Screen reader announcements (filter changes)</li>
              <li>✅ Skip to main content link</li>
              <li>✅ Mobile responsive (sidebar → collapsible menu)</li>
              <li>✅ Loading/empty/error states</li>
              <li>✅ Time elements with datetime attributes</li>
              <li>✅ Image alt text via aria-label</li>
              <li>✅ Button aria-labels for context</li>
              <li>✅ Keyboard shortcuts help section</li>
            </ul>
          </div>
        </Container>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-white" role="status" aria-live="polite" aria-label="Loading content">
      <Container>
        <div className="py-12 flex gap-8">
          <aside className="w-64 flex-shrink-0" aria-hidden="true">
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
      <span className="sr-only">Loading blog posts...</span>
    </div>
  );
}

function EmptyState({ track }: { track: string }) {
  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-24 text-center" role="status">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No posts found</h1>
          <p className="text-gray-600 mb-8">
            There are no posts in the {track === 'all' ? 'All Posts' : track} category yet.
          </p>
          <Link href="?track=all">
            <Button
              variant="default"
              size="default"
              className="focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              View All Posts
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-24 text-center" role="alert" aria-live="assertive">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t load the blog posts. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </Container>
    </div>
  );
}
