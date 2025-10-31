/**
 * Pagination component for articles list
 */

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/articles' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show max 7 page numbers: [1] ... [4] [5] [6] ... [10]
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text)] hover:text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text-muted)] bg-[var(--surface)]/50 rounded-lg cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-[var(--text-muted)]">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={pageNum === 1 ? basePath : `${basePath}?page=${pageNum}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--text)] hover:text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text)] hover:text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text-muted)] bg-[var(--surface)]/50 rounded-lg cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
