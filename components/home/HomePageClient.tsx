'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '@/lib/posts';
import Container from '@/components/ui/Container';
import Sidebar from './Sidebar';
import MagazineMasonry from './MagazineMasonry';
import { Button } from '@/components/ui/Button';

interface HomePageClientProps {
  allPosts: Post[];
}

/**
 * HomePageClient - Client-side wrapper for M2 homepage layout
 *
 * Features:
 * - Sidebar + Magazine Masonry layout
 * - Track filtering with URL state
 * - Mobile menu toggle
 * - Keyboard shortcuts
 */
export default function HomePageClient({ allPosts }: HomePageClientProps) {
  const searchParams = useSearchParams();
  const track = searchParams?.get('track') || 'all';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setMobileMenuOpen((prev) => !prev);
      }
      if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const filters = ['all', 'aviation', 'dev-startup', 'cross-pollination'];
        const index = parseInt(e.key) - 1;
        window.location.href = `?track=${filters[index]}`;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen reader announcements
  useEffect(() => {
    const trackLabels = {
      all: 'All Posts',
      aviation: 'Aviation',
      'dev-startup': 'Dev/Startup',
      'cross-pollination': 'Cross-pollination',
    };
    setAnnouncement(
      `Filtering by ${trackLabels[track as keyof typeof trackLabels] || 'All Posts'}`
    );
  }, [track]);

  // Filter posts by track
  const filteredPosts =
    track === 'all'
      ? allPosts
      : allPosts.filter((post) =>
          post.tags.some((tag) => tag.slug === track)
        );

  // Get featured post
  const featuredPost = filteredPosts.find((p) => p.featured) || null;

  // Calculate post counts
  const postCounts = {
    all: allPosts.length,
    aviation: allPosts.filter((p) =>
      p.tags.some((tag) => tag.slug === 'aviation')
    ).length,
    devStartup: allPosts.filter((p) =>
      p.tags.some((tag) => tag.slug === 'dev-startup')
    ).length,
    crossPollination: allPosts.filter((p) =>
      p.tags.some((tag) => tag.slug === 'cross-pollination')
    ).length,
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      <Container>
        <div className="py-6">
          {/* Mobile Menu Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mb-3"
            aria-expanded={mobileMenuOpen}
            aria-controls="sidebar-nav"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? 'Close' : 'Open'} Menu
          </Button>

          <div className="flex gap-6 relative">
            {/* Sidebar */}
            <Sidebar
              postCounts={postCounts}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Main Content */}
            <main id="main-content" className="flex-1 min-w-0" role="main">
              <MagazineMasonry
                posts={filteredPosts}
                featuredPost={featuredPost}
              />
            </main>
          </div>
        </div>
      </Container>
    </>
  );
}
