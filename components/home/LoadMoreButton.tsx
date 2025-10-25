import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

/**
 * LoadMoreButton - Pagination button for loading additional posts
 *
 * Features:
 * - Loading state with spinner
 * - Hidden when no more posts
 * - Analytics tracking
 */
export default function LoadMoreButton({
  onClick,
  isLoading,
  hasMore,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  const handleClick = () => {
    // Track analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'load_more_clicked', {
        event_category: 'engagement',
        event_label: 'post_feed',
      });
    }

    onClick();
  };

  return (
    <div className="flex justify-center py-8">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        size="lg"
        variant="outline"
        className="min-w-[200px]"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          'Load More Posts'
        )}
      </Button>
    </div>
  );
}
