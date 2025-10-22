/**
 * Blog index page
 * Lists all blog posts sorted by date (newest first)
 * FR-013, US3
 */

import { getAllPosts, getAllTags } from '@/lib/mdx';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { NextSeo } from 'next-seo';
import { getPageSEO } from '@/lib/seo-config';

export default async function BlogIndexPage() {
  const pageSEO = getPageSEO({
    title: 'Blog',
    description: 'Aviation career guidance, software development insights, and startup lessons. Teaching systematic thinking from 30,000 feet.',
    canonical: 'https://marcusgoll.com/blog',
    openGraph: {
      type: 'website',
      url: 'https://marcusgoll.com/blog',
      title: 'Blog | Marcus Gollahon',
      description: 'Aviation career guidance, software development insights, and startup lessons. Teaching systematic thinking from 30,000 feet.',
    },
  });
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <>
      <NextSeo {...pageSEO} />
      <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Articles and insights about aviation and software development.
        </p>

        {/* Tag cloud */}
        {tags.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Browse by topic
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  {tag.displayName} ({tag.postCount})
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No posts found. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
