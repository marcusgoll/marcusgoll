'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import Container from '@/components/ui/Container';
import FlickeringGrid from '@/components/ui/flickering-grid';

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
  { id: 1, title: 'Systematic Thinking in Aviation Safety', track: 'Aviation', excerpt: 'How commercial aviation applies systematic principles to prevent failures.', date: 'Oct 15, 2025', featured: true, hasImage: true, size: 'large' },
  { id: 2, title: 'Scalable Architecture Patterns', track: 'Dev/Startup', excerpt: 'Building systems that scale from prototype to production.', date: 'Oct 14, 2025', featured: false, hasImage: false, size: 'small' },
  { id: 3, title: 'Human Factors in Cockpit Design', track: 'Cross-pollination', excerpt: 'What aviation human factors research teaches us about interface design.', date: 'Oct 13, 2025', featured: false, hasImage: true, size: 'medium' },
  { id: 4, title: 'Pre-flight Checklist Philosophy', track: 'Aviation', excerpt: 'The cognitive science behind effective checklists.', date: 'Oct 12, 2025', featured: false, hasImage: false, size: 'small' },
  { id: 5, title: 'Startup Velocity vs Safety', track: 'Dev/Startup', excerpt: 'How to move fast without breaking critical systems.', date: 'Oct 11, 2025', featured: false, hasImage: true, size: 'medium' },
  { id: 6, title: 'Decision Making Under Pressure', track: 'Cross-pollination', excerpt: 'Emergency decision frameworks from aviation.', date: 'Oct 10, 2025', featured: false, hasImage: true, size: 'medium' },
];

export default function M2FunctionalPolished() {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const state = searchParams?.get('state') || 'default';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const { theme, setTheme } = useTheme();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setMobileMenuOpen(prev => !prev);
      }
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

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Screen reader announcements
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    setNewsletterOpen(false);
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
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Hero Section with Flickering Grid */}
      <header className="relative bg-primary text-primary-foreground overflow-hidden">
        {/* Flickering Grid Background */}
        <div className="absolute inset-0">
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            color="rgb(255, 255, 255)"
            flickerChance={0.3}
            maskGradient={true}
          />
        </div>

        <Container className="relative z-10">
          <div className="py-16 text-center">
            {/* Dark Mode Toggle */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle dark mode"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </Button>
            </div>

            <h1 className="text-5xl font-bold mb-4">
              Systematic thinking from 30,000 feet
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Aviation principles applied to software engineering and startups.
              Learn how commercial aviation&apos;s systematic approach to safety translates to building resilient systems.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary">
                Read Latest Posts
              </Button>
              <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    Subscribe to Newsletter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subscribe to Newsletter</DialogTitle>
                    <DialogDescription>
                      Get systematic thinking insights delivered weekly. Join 500+ engineers and founders.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewsletterSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Subscribe</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="py-8">
          {/* Mobile Menu Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mb-4"
            aria-expanded={mobileMenuOpen}
            aria-controls="sidebar-nav"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? 'Close' : 'Open'} Menu
          </Button>

          {/* Mobile Overlay Backdrop */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          <div className="flex gap-8 relative">
            {/* Sidebar */}
            <aside
              id="sidebar-nav"
              className={`
                w-80 flex-shrink-0 bg-card z-50
                lg:sticky lg:top-8 lg:self-start
                fixed top-0 left-0 h-full overflow-y-auto shadow-xl
                transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:shadow-none lg:relative lg:h-auto
              `}
              aria-label="Blog navigation and filters"
            >
              <div className="p-4 lg:p-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden absolute top-4 right-4"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>

                {/* Profile Avatar - Centered, No Text */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm">
                    Avatar
                  </div>
                </div>

                {/* Navigation Filter */}
                <nav aria-label="Content filter">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">
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
                          <Link href={`?track=${key}`} onClick={() => setMobileMenuOpen(false)}>
                            <div
                              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                track === key
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-foreground hover:bg-accent'
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
                <div className="mt-4 p-4 bg-primary text-primary-foreground rounded-lg">
                  <p className="text-sm mb-3">
                    Get systematic thinking insights delivered weekly
                  </p>
                  <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="w-full">
                        Subscribe
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>

                {/* Keyboard Shortcuts - Hidden on Mobile/Tablet */}
                <details className="mt-4 p-4 bg-muted/50 rounded-lg border border-border text-sm hidden xl:block">
                  <summary className="font-semibold cursor-pointer">
                    Keyboard Shortcuts
                  </summary>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li><kbd className="px-1 bg-muted rounded">Alt+M</kbd> Toggle menu</li>
                    <li><kbd className="px-1 bg-muted rounded">Alt+1-4</kbd> Quick filter</li>
                  </ul>
                </details>
              </div>
            </aside>

            {/* Main Content */}
            <main id="main-content" className="flex-1 min-w-0" role="main">
              {/* Featured Hero */}
              {featuredPost && (
                <article className="mb-10 cursor-pointer group rounded-lg">
                  <Link href={`/mock/homepage-post-feed/blog/${featuredPost.id}`}>
                    {featuredPost.hasImage && (
                      <div className="aspect-[2/1] bg-muted rounded-lg mb-4 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          Featured Illustration
                        </div>
                      </div>
                    )}
                    <span className="inline-block px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-full mb-3 uppercase tracking-wider shadow-lg">
                      {featuredPost.track}
                    </span>
                    <h2 className="text-3xl font-bold mb-3 group-hover:text-muted-foreground transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <time dateTime="2025-10-15" className="text-sm text-muted-foreground">
                        {featuredPost.date}
                      </time>
                      <Button>Read Article</Button>
                    </div>
                  </Link>
                </article>
              )}

              {/* Magazine Masonry Grid */}
              <div className="columns-1 md:columns-2 gap-6 space-y-6" role="feed" aria-label="Blog posts">
                {regularPosts.map((post) => {
                  const isLarge = post.size === 'large';
                  const isMedium = post.size === 'medium';

                  return (
                    <article
                      key={post.id}
                      className="break-inside-avoid group cursor-pointer border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      <Link href={`/mock/homepage-post-feed/blog/${post.id}`}>
                        {post.hasImage && (
                          <div
                            className={`bg-muted overflow-hidden ${
                              isLarge ? 'aspect-[4/3]' :
                              isMedium ? 'aspect-video' :
                              'aspect-square'
                            }`}
                          >
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm transform transition-transform duration-300 group-hover:scale-105">
                              {isLarge ? 'Large' : isMedium ? 'Medium' : 'Small'}
                            </div>
                          </div>
                        )}
                        <div className="p-5">
                          <span className="inline-block px-3 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full mb-3 uppercase tracking-wider">
                            {post.track}
                          </span>
                          <h3
                            className={`font-bold mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all ${
                              isLarge ? 'text-2xl' :
                              isMedium ? 'text-lg' :
                              'text-base'
                            }`}
                          >
                            {post.title}
                          </h3>
                          <p className={`text-muted-foreground mb-3 ${
                            isLarge ? 'text-base' : 'text-sm'
                          }`}>
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <time dateTime="2025-10-15">{post.date}</time>
                            <span className="font-medium" aria-hidden="true">Read →</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12" role="status">
                  <p className="text-muted-foreground">No posts found for this filter.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>

      {/* Return to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 shadow-lg z-50"
          aria-label="Return to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </Button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background" role="status" aria-live="polite" aria-label="Loading content">
      <Container>
        <div className="py-12 flex gap-8">
          <aside className="w-64 flex-shrink-0" aria-hidden="true">
            <div className="bg-muted rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-muted-foreground/20 rounded"></div>
                ))}
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="aspect-[2/1] bg-muted rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-1/3 mb-3 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          </main>
        </div>
      </Container>
      <span className="sr-only">Loading blog posts...</span>
    </div>
  );
}

function EmptyState({ track }: { track: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="py-24 text-center" role="status">
          <h1 className="text-3xl font-bold mb-4">No posts found</h1>
          <p className="text-muted-foreground mb-8">
            There are no posts in the {track === 'all' ? 'All Posts' : track} category yet.
          </p>
          <Link href="?track=all">
            <Button>View All Posts</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="py-24 text-center" role="alert" aria-live="assertive">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t load the blog posts. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Container>
    </div>
  );
}
