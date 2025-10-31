/**
 * Tag badges component - displays tags for a post
 */

interface TagBadgesProps {
  tags: string[];
  maxTags?: number;
}

export function TagBadges({ tags, maxTags = 3 }: TagBadgesProps) {
  const displayTags = tags.slice(0, maxTags);

  if (displayTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="inline-block px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] bg-[var(--surface)] rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
