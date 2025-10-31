/**
 * TLDRSection component for blog posts
 * T005: TL;DR summary component for LLM optimization
 * US5: Display 2-4 sentence summary immediately after post title
 * Improves LLM parsing (top-to-bottom priority) and user experience
 */

interface TLDRSectionProps {
  excerpt: string;
}

/**
 * TL;DR section component for blog post summaries
 * Uses semantic HTML (<section class="tldr">) for AI crawler recognition
 * Styled as callout-style box for visual distinction
 *
 * Usage in blog post pages:
 * <TLDRSection excerpt={post.frontmatter.excerpt} />
 */
export function TLDRSection({ excerpt }: TLDRSectionProps) {
  return (
    <section
      className="tldr my-8 rounded-md format bg-[var(--primary)]/10 p-4 outline outline-[var(--primary)]/15"
      role="note"
      aria-label="TL;DR Summary"
    >
      <div className="flex">
        <div className="shrink-0">
          <span className="flex size-5 items-center justify-center text-[var(--primary)]" aria-hidden="true">
            ⚡
          </span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-[var(--text)]">
            TL;DR
          </h3>
          <div className="mt-2 text-sm text-[var(--text-muted)]">
            <p>{excerpt}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
