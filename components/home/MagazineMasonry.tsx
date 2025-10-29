import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';
import { getPrimaryTrack } from '@/lib/utils/content';
import TrackBadge from '@/components/blog/TrackBadge';
import { Button } from '@/components/ui/Button';
import { shimmerDataURL } from '@/lib/utils/shimmer';

interface MagazineMasonryProps {
  posts: Post[];
  featuredPost?: Post | null;
}

/**
 * MagazineMasonry - Magazine-style masonry grid layout
 *
 * Features:
 * - CSS columns masonry layout (2 columns desktop, 1 mobile)
 * - Variable card aspect ratios
 * - Featured post hero at top
 * - Supports posts with and without images
 * - Hover effects
 */
export default function MagazineMasonry({
  posts,
  featuredPost,
}: MagazineMasonryProps) {
  // Filter out featured post from regular posts
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div>
      {/* Featured Hero */}
      {featuredPost && (
        <article className="mb-6 cursor-pointer group rounded-lg">
          <Link href={`/blog/${featuredPost.slug}`}>
            {featuredPost.feature_image && (
              <div className="aspect-[2/1] bg-muted rounded-lg mb-3 overflow-hidden">
                <Image
                  src={featuredPost.feature_image}
                  alt={featuredPost.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                  placeholder="blur"
                  blurDataURL={shimmerDataURL(1200, 600)}
                />
              </div>
            )}
            {(() => {
              const track = getPrimaryTrack(featuredPost.tags);
              return track ? (
                <span className="inline-block px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-full mb-2 uppercase tracking-wider">
                  <TrackBadge track={track} />
                </span>
              ) : null;
            })()}
            <h2 className="text-2xl font-bold mb-2 group-hover:opacity-70 transition-opacity">
              {featuredPost.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <time
                dateTime={featuredPost.published_at}
                className="text-xs text-muted-foreground"
              >
                {new Date(featuredPost.published_at).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </time>
              <Button size="sm">Read Article</Button>
            </div>
          </Link>
        </article>
      )}

      {/* Magazine Masonry Grid */}
      <div
        className="columns-1 md:columns-2 gap-4 space-y-4"
        role="feed"
        aria-label="Blog posts"
      >
        {regularPosts.map((post) => {
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
            <article
              key={post.id}
              className="break-inside-avoid group cursor-pointer border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-foreground/20 transition-all"
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Post Image */}
                {post.feature_image && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <Image
                      src={post.feature_image}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={shimmerDataURL(600, 400)}
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-3">
                  {/* Track Badge */}
                  {track && (
                    <div className="mb-1.5">
                      <TrackBadge track={track} />
                    </div>
                  )}

                  {/* Title - Size varies based on whether there's an image */}
                  <h3
                    className={`font-bold text-foreground group-hover:opacity-70 transition-opacity mb-1.5 ${
                      post.feature_image ? 'text-base' : 'text-lg'
                    }`}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <time dateTime={post.published_at}>{publishedDate}</time>
                    <span>{post.reading_time} min read</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
