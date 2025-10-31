/**
 * Featured article card - large card with image above for left column
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PostData } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';
import { TagBadges } from './tag-badges';

interface FeaturedArticleCardProps {
  post: PostData;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        {/* Featured Image - Only if available */}
        {post.frontmatter.featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-6 bg-[var(--bg-dark)]">
            <Image
              src={post.frontmatter.featuredImage}
              alt={post.frontmatter.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div>
          {/* Tags */}
          <div className="mb-2">
            <TagBadges tags={post.frontmatter.tags} maxTags={3} />
          </div>

          <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
            {post.frontmatter.title}
          </h2>

          <p className="text-[var(--text-muted)] mb-4 line-clamp-3 text-base leading-relaxed">
            {post.frontmatter.excerpt}
          </p>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-[var(--secondary)] font-medium group-hover:text-[var(--secondary-hover)] transition-colors text-sm">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
