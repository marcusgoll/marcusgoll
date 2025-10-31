import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';
import TrackBadge from './TrackBadge';
import { shimmerDataURL } from '@/lib/utils/shimmer';

interface PostCardProps {
  post: Post;
  track?: 'aviation' | 'dev-startup' | 'cross-pollination' | null;
}

/**
 * PostCard component - Displays a blog post card with featured image,
 * title, excerpt, metadata, and track badge
 */
export default function PostCard({ post, track }: PostCardProps) {
  // Format published date
  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)] transition-all duration-200 hover:shadow-lg hover:border-[var(--highlight)]"
    >
      {/* Featured Image */}
      {post.feature_image && (
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface)]">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={shimmerDataURL(800, 450)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Track Badge */}
        {track && (
          <div className="mb-2">
            <TrackBadge track={track} />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-3 text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <div className="flex items-center space-x-2">
            {/* Author */}
            <span>{post.primary_author.name}</span>
            <span>•</span>
            {/* Date */}
            <time dateTime={post.published_at}>{publishedDate}</time>
          </div>

          {/* Reading Time */}
          <span>{post.reading_time} min read</span>
        </div>
      </div>
    </Link>
  );
}
