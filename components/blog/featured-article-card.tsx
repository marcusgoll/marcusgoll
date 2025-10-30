/**
 * Featured article card - large card with image above for left column
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PostData } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';

interface FeaturedArticleCardProps {
  post: PostData;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        {/* Featured Image - Only if available */}
        {post.frontmatter.featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-6 bg-gray-800">
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
          <h2 className="text-2xl font-bold text-white mb-3">
            {post.frontmatter.title}
          </h2>

          <p className="text-gray-400 mb-4 line-clamp-3 text-base leading-relaxed">
            {post.frontmatter.excerpt}
          </p>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-blue-500 font-medium group-hover:text-blue-400 transition-colors text-sm">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
