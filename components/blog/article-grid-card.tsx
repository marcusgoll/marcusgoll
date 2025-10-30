/**
 * Article grid card component for articles index page
 * Grid layout with featured image, title, excerpt, and read more link
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PostData } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';

interface ArticleGridCardProps {
  post: PostData;
}

export function ArticleGridCard({ post }: ArticleGridCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-gray-800">
          {post.frontmatter.featuredImage ? (
            <Image
              src={post.frontmatter.featuredImage}
              alt={post.frontmatter.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <span className="text-gray-500 text-lg font-semibold">
                {post.frontmatter.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
            {post.frontmatter.title}
          </h2>

          <p className="text-gray-400 mb-4 line-clamp-3">
            {post.frontmatter.excerpt}
          </p>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-blue-500 font-medium group-hover:text-blue-400 transition-colors">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
