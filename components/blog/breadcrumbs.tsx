/**
 * Breadcrumbs Component
 * Displays hierarchical navigation path with Schema.org structured data
 * Server Component - no client-side state needed
 * FR-007, US6
 */

import Link from 'next/link';
import { generateBreadcrumbListSchema } from '@/lib/schema';

/**
 * BreadcrumbSegment type representing a single breadcrumb item
 * T060: Type definition for breadcrumb structure
 */
export interface BreadcrumbSegment {
  label: string;
  url: string;
  position: number;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
}

/**
 * Breadcrumbs Component
 * T062: Implementation of breadcrumb navigation
 *
 * @param segments - Array of breadcrumb segments to display
 * @returns Breadcrumb navigation with Schema.org JSON-LD
 */
export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  // Don't render if no segments provided
  if (!segments || segments.length === 0) {
    return null;
  }

  // Generate BreadcrumbList schema for SEO (T061)
  const breadcrumbSchema = generateBreadcrumbListSchema(segments);

  return (
    <>
      {/* BreadcrumbList JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb navigation */}
      <nav
        aria-label="Breadcrumb navigation"
        className="mb-8 text-sm"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;

            return (
              <li key={segment.position} className="flex items-center gap-2">
                {!isLast ? (
                  <>
                    <Link
                      href={segment.url}
                      className="text-[var(--secondary)] hover:underline transition-colors"
                    >
                      {segment.label}
                    </Link>
                    <span
                      className="text-[var(--text-muted)]"
                      aria-hidden="true"
                    >
                      /
                    </span>
                  </>
                ) : (
                  <span
                    className="text-[var(--text-muted)] font-medium"
                    aria-current="page"
                  >
                    {segment.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
