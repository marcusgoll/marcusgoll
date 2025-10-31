/**
 * Tag cloud component - displays all tags with post counts
 */

import Link from 'next/link';
import type { TagData } from '@/lib/mdx';

interface TagCloudProps {
  tags: TagData[];
  maxTags?: number;
}

export function TagCloud({ tags, maxTags = 10 }: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags);

  if (displayTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/articles/tag/${tag.slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] rounded-full transition-colors"
        >
          <span>{tag.displayName}</span>
          <span className="text-xs text-[var(--text-muted)]">{tag.postCount}</span>
        </Link>
      ))}
    </div>
  );
}
