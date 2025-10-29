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
      className="tldr my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950 p-4"
      role="note"
      aria-label="TL;DR Summary"
    >
      <div className="flex gap-3">
        <span className="text-xl" aria-hidden="true">
          📝
        </span>
        <div className="flex-1">
          <div className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
            TL;DR
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            {excerpt}
          </div>
        </div>
      </div>
    </section>
  );
}
