'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plane, Code, GraduationCap, Lightbulb, Mic, TrendingUp } from 'lucide-react';

interface Tag {
  slug: string;
  name: string;
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  tags: Tag[];
  reading_time: number;
  feature_image: string | null;
  author?: string;
}

interface RecentPostsProps {
  posts: Post[];
}

/**
 * RecentPosts - Display latest blog posts
 * Featured post (left) + 3 recent posts (right) layout
 */
export default function RecentPosts({ posts }: RecentPostsProps) {
  // Take 4 posts: 1 featured + 3 recent
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  const getPrimaryTrack = (tags: Tag[]) => {
    if (!tags || tags.length === 0) return null;
    if (tags.some((tag) => tag.slug === 'aviation')) return 'aviation';
    if (tags.some((tag) => tag.slug === 'dev-startup')) return 'dev-startup';
    if (tags.some((tag) => tag.slug === 'education')) return 'education';
    if (tags.some((tag) => tag.slug === 'cross-pollination')) return 'cross-pollination';
    return null;
  };

  const getTrackConfig = (post: Post) => {
    const track = getPrimaryTrack(post.tags);

    switch (track) {
      case 'aviation':
        return {
          label: 'Aviation',
          icon: Plane,
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-600 dark:text-blue-400',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'dev-startup':
        return {
          label: 'Dev/Startup',
          icon: Code,
          bgColor: 'bg-emerald-500/10',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'education':
        return {
          label: 'Education',
          icon: GraduationCap,
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-600 dark:text-purple-400',
          iconColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'cross-pollination':
        return {
          label: 'Insights',
          icon: Lightbulb,
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-600 dark:text-amber-400',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          label: 'Article',
          icon: TrendingUp,
          bgColor: 'bg-[var(--surface)]',
          textColor: 'text-[var(--text-muted)]',
          iconColor: 'text-[var(--text-muted)]',
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const TrackBadge = ({ post }: { post: Post }) => {
    const config = getTrackConfig(post);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-[var(--bg)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-[var(--text)] sm:text-5xl">
            Latest articles
          </h2>
          <p className="mt-2 text-lg/8 format text-[var(--text-muted)]">
            Insights from aviation, development, and the spaces where they intersect.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-12 border-t border-[var(--border)] pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Featured Post - Left Column */}
          {featuredPost && (
            <article className="flex flex-col">
              {featuredPost.feature_image && (
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-6 bg-[var(--surface-muted)] hover:opacity-90 transition-opacity">
                    <Image
                      src={featuredPost.feature_image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}

              <div className="inline-flex">
                <TrackBadge post={featuredPost} />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-[var(--text)] group">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                  {featuredPost.title}
                </Link>
              </h3>

              <p className="mt-3 text-base format text-[var(--text-muted)] line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-md font-semibold text-[var(--secondary)] hover:text-[var(--secondary)]/80 transition-colors"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          )}

          {/* Recent Posts - Right Column */}
          <div className="flex flex-col gap-10">
            {recentPosts.map((post) => (
              <article key={post.slug} className="flex flex-col">
                <div className="inline-flex">
                  <TrackBadge post={post} />
                </div>

                <h2 className="mt-3 text-xl font-bold text-[var(--text)]">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-2 text-sm format text-[var(--text-muted)] line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-flex items-center gap-2 text-md font-semibold text-[var(--secondary)] hover:text-[var(--secondary)]/80 transition-colors"
                >
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* View all articles link */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--secondary)]/80 font-semibold transition-colors"
          >
            View all articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
