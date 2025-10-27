import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';
import { getPrimaryTrack } from '@/lib/utils/content';
import TrackBadge from '@/components/blog/TrackBadge';

interface FeaturedPostsSectionProps {
  featuredPosts: Post[];
}

/**
 * FeaturedPostsSection - Hero-style showcase for featured posts
 *
 * Features:
 * - Displays up to 2 featured posts
 * - Hero-style cards with larger images and prominent titles
 * - Responsive grid layout (2 columns desktop, 1 column mobile)
 * - Returns null if no featured posts
 */
export default function FeaturedPostsSection({
  featuredPosts,
}: FeaturedPostsSectionProps) {
  // Return null if no featured posts
  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  // Limit to 2 posts
  const displayPosts = featuredPosts.slice(0, 2);

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Featured Posts</h2>
        <p className="mt-2 text-muted-foreground">
          Handpicked insights from aviation and development
        </p>
      </div>

      {/* Featured Posts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {displayPosts.map((post) => {
          const track = getPrimaryTrack(post.tags);
          const publishedDate = new Date(post.published_at).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          );

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary"
            >
              {/* Featured Image - Larger aspect ratio */}
              {post.feature_image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                    priority
                  />
                  {/* Featured Badge Overlay */}
                  <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                    Featured
                  </div>
                </div>
              )}

              {/* Content - More spacious padding */}
              <div className="p-6 lg:p-8">
                {/* Track Badge */}
                {track && (
                  <div className="mb-3">
                    <TrackBadge track={track} />
                  </div>
                )}

                {/* Title - Larger font */}
                <h3 className="mb-3 text-2xl font-bold text-navy-900 transition-colors group-hover:text-emerald-600 lg:text-3xl">
                  {post.title}
                </h3>

                {/* Excerpt - More lines visible */}
                {post.excerpt && (
                  <p className="mb-4 text-base text-gray-600 line-clamp-3 lg:text-lg">
                    {post.excerpt}
                  </p>
                )}

                {/* Metadata - Larger text */}
                <div className="flex items-center justify-between text-sm text-gray-500 lg:text-base">
                  <div className="flex items-center space-x-2">
                    {/* Author */}
                    <span className="font-medium">
                      {post.primary_author.name}
                    </span>
                    <span>•</span>
                    {/* Date */}
                    <time dateTime={post.published_at}>{publishedDate}</time>
                  </div>

                  {/* Reading Time */}
                  <span className="font-medium">
                    {post.reading_time} min read
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
