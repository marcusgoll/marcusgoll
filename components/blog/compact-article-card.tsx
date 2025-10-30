/**
 * Compact article card - smaller card for grid layout
 */

import Link from 'next/link';
import type { PostData } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';

interface CompactArticleCardProps {
  post: PostData;
}

export function CompactArticleCard({ post }: CompactArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
          {post.frontmatter.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
          {post.frontmatter.excerpt}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-blue-500 font-medium group-hover:text-blue-400 transition-colors text-sm">
          <span>Read more</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
