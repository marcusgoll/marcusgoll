'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Post } from '@/lib/posts';
import { getPrimaryTrack } from '@/lib/utils/content';
import PostGrid from '@/components/blog/PostGrid';
import DualTrackShowcase from './DualTrackShowcase';
import LoadMoreButton from './LoadMoreButton';
import { Button } from '@/components/ui/button';

interface UnifiedPostFeedProps {
  allPosts: Post[];
  aviationPosts: Post[];
  devStartupPosts: Post[];
  initialView?: 'dual-track' | 'unified';
}

/**
 * UnifiedPostFeed - Main post feed with dual-track and unified view support
 *
 * Features:
 * - Dual-track view (default) - Aviation and Dev/Startup in separate sections
 * - Unified view - All posts chronologically
 * - Track filtering
 * - Load more pagination
 * - URL state synchronization
 */
export default function UnifiedPostFeed({
  allPosts,
  aviationPosts,
  devStartupPosts,
  initialView = 'dual-track',
}: UnifiedPostFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // View mode: dual-track or unified
  const viewParam = searchParams?.get('view');
  const [viewMode, setViewMode] = useState<'dual-track' | 'unified'>(
    viewParam === 'unified' ? 'unified' : initialView
  );

  // Track filter
  const trackParam = searchParams?.get('track') as string | null;
  const [activeTrack, setActiveTrack] = useState<string | null>(trackParam);

  // Pagination state
  const POSTS_PER_PAGE = 6;
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Sync view mode with URL
  useEffect(() => {
    const newView = viewParam === 'unified' ? 'unified' : 'dual-track';
    if (newView !== viewMode) {
      setViewMode(newView);
    }
  }, [viewParam, viewMode]);

  // Sync track filter with URL
  useEffect(() => {
    if (trackParam !== activeTrack) {
      setActiveTrack(trackParam);
      setDisplayedCount(POSTS_PER_PAGE); // Reset pagination on filter change
    }
  }, [trackParam, activeTrack]);

  // Handle view toggle
  const handleViewToggle = (mode: 'dual-track' | 'unified') => {
    // Track analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_mode_changed', {
        event_category: 'engagement',
        event_label: mode,
        previous_view: viewMode,
      });
    }

    const params = new URLSearchParams(searchParams?.toString() || '');

    if (mode === 'unified') {
      params.set('view', 'unified');
    } else {
      params.delete('view');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  };

  // Filter posts by active track
  const getFilteredPosts = () => {
    if (!activeTrack || activeTrack === 'all') {
      return allPosts;
    }

    return allPosts.filter((post) => {
      const track = getPrimaryTrack(post.tags);
      return track === activeTrack;
    });
  };

  // Handle load more
  const handleLoadMore = () => {
    setIsLoading(true);

    // Simulate async loading
    setTimeout(() => {
      setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
      setIsLoading(false);
    }, 300);
  };

  const filteredPosts = getFilteredPosts();
  const displayedPosts = filteredPosts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredPosts.length;

  // Dual-track view
  if (viewMode === 'dual-track') {
    return (
      <div className="space-y-8">
        {/* View Toggle */}
        <div className="flex justify-end gap-4">
          <Button
            variant={viewMode === 'dual-track' ? 'default' : 'outline'}
            onClick={() => handleViewToggle('dual-track')}
            aria-pressed={viewMode === 'dual-track'}
            aria-label="Switch to dual-track view"
          >
            Dual-Track View
          </Button>
          <Button
            variant={viewMode === 'unified' ? 'default' : 'outline'}
            onClick={() => handleViewToggle('unified')}
            aria-pressed={viewMode === 'unified'}
            aria-label="Switch to unified view"
          >
            All Posts
          </Button>
        </div>

        <DualTrackShowcase
          aviationPosts={aviationPosts.slice(0, 3)}
          devStartupPosts={devStartupPosts.slice(0, 3)}
        />
      </div>
    );
  }

  // Unified view
  return (
    <div className="space-y-8">
      {/* View Toggle */}
      <div className="flex justify-end gap-4">
        <Button
          variant={viewMode === 'dual-track' ? 'default' : 'outline'}
          onClick={() => handleViewToggle('dual-track')}
          aria-pressed={viewMode === 'dual-track'}
          aria-label="Switch to dual-track view"
        >
          Dual-Track View
        </Button>
        <Button
          variant={viewMode === 'unified' ? 'default' : 'outline'}
          onClick={() => handleViewToggle('unified')}
          aria-pressed={viewMode === 'unified'}
          aria-label="Switch to unified view"
        >
          All Posts
        </Button>
      </div>

      {/* Post Grid */}
      <PostGrid posts={displayedPosts} />

      {/* Load More Button */}
      <LoadMoreButton
        onClick={handleLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
}
