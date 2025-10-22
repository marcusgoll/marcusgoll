/**
 * Blog index page
 * Lists all blog posts sorted by date (newest first)
 * FR-013, US3
 */

import { getAllPosts, getAllTags } from '@/lib/mdx';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Tech Stack Foundation',
  description: 'Articles and insights about aviation and software development.',
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
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
            <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0">
              <Link href={`/blog/${post.slug}`} className="group">
                {/* Post header */}
                <h2 className="text-2xl font-semibold tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.frontmatter.title}
                </h2>

                {/* Post metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.frontmatter.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
