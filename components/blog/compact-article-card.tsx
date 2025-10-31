/**
 * Compact article card - smaller card for grid layout
 */

import Link from 'next/link';
import type { PostData } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';
import { TagBadges } from './tag-badges';

interface CompactArticleCardProps {
  post: PostData;
}

export function CompactArticleCard({ post }: CompactArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        {/* Tags */}
        <div className="mb-2">
          <TagBadges tags={post.frontmatter.tags} maxTags={3} />
        </div>

        <h3 className="text-2xl font-bold text-[var(--text)] mb-3">
          {post.frontmatter.title}
        </h3>

        <p className="text-[var(--text-muted)] mb-4 line-clamp-3 text-base leading-relaxed">
          {post.frontmatter.excerpt}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-[var(--secondary)] font-medium group-hover:text-[var(--secondary-hover)] transition-colors text-sm">
          <span>Read more</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
