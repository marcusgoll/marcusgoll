'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
}

interface RecentPostsProps {
  posts: Post[];
}

/**
 * RecentPosts - Display latest blog posts
 * Three-column grid with aviation/dev track indicators
 */
export default function RecentPosts({ posts }: RecentPostsProps) {
  // Take only the first 3 posts
  const displayPosts = posts.slice(0, 3);

  const getPrimaryTrack = (tags: Tag[]) => {
    if (!tags || tags.length === 0) return null;
    if (tags.some((tag) => tag.slug === 'aviation')) return 'aviation';
    if (tags.some((tag) => tag.slug === 'dev-startup')) return 'dev-startup';
    if (tags.some((tag) => tag.slug === 'cross-pollination')) return 'cross-pollination';
    return null;
  };

  const getTrackLabel = (post: Post) => {
    const track = getPrimaryTrack(post.tags);
    if (track === 'aviation') return 'Aviation';
    if (track === 'dev-startup') return 'Dev/Startup';
    return 'General';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Latest articles
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-300">
            Real-world lessons from the flight deck and the terminal.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 dark:border-gray-700">
          {displayPosts.map((post) => (
            <article
              key={post.slug}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time
                  dateTime={post.published_at}
                  className="text-gray-500 dark:text-gray-400"
                >
                  {formatDate(post.published_at)}
                </time>
                <span className="relative z-10 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {getTrackLabel(post)}
                </span>
                {post.reading_time && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {post.reading_time} min read
                  </span>
                )}
              </div>
              <div className="group relative grow">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View all articles link */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
          >
            View all articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
