/**
 * Reusable post card component for blog index and tag pages
 * Extracted to follow DRY principles (H-3 fix)
 */

import Link from 'next/link';
import type { PostData } from '@/lib/mdx';

interface PostCardProps {
  post: PostData;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-[var(--border)] pb-8 last:border-0">
      <Link href={`/blog/${post.slug}`} className="group">
        {/* Post header */}
        <h2 className="text-2xl font-semibold tracking-tight mb-2 group-hover:text-[var(--secondary)] transition-colors">
          {post.frontmatter.title}
        </h2>

        {/* Post metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mb-3">
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{post.frontmatter.author}</span>
          {post.frontmatter.readingTime && (
            <>
              <span>•</span>
              <span>{post.frontmatter.readingTime} min read</span>
            </>
          )}
        </div>

        {/* Post excerpt */}
        <p className="text-[var(--text)] mb-4">{post.frontmatter.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-[var(--surface)] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
