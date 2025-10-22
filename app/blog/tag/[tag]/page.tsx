/**
 * Tag archive page
 * Shows all blog posts filtered by a specific tag
 * FR-014, US5
 */

import { getAllTags, getPostsByTag } from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface TagArchivePageProps {
  params: Promise<{
    tag: string;
  }>;
}

/**
 * Generate static params for all tags at build time
 * FR-014: Pre-render all tag pages
 */
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.slug,
  }));
}

/**
 * Generate metadata for tag archive pages
 */
export async function generateMetadata({ params }: TagArchivePageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
    };
  }

  const displayName = posts[0].frontmatter.tags.find(
    (t) => t.toLowerCase().replace(/\s+/g, '-') === tag
  ) || tag;

  return {
    title: `${displayName} | Blog`,
    description: `Articles tagged with ${displayName}. ${posts.length} post${posts.length !== 1 ? 's' : ''} found.`,
  };
}

/**
 * Tag archive page component
 */
export default async function TagArchivePage({ params }: TagArchivePageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  // Return 404 if no posts found for tag
  if (posts.length === 0) {
    notFound();
  }

  // Get display name from first post's tags
  const displayName = posts[0].frontmatter.tags.find(
    (t) => t.toLowerCase().replace(/\s+/g, '-') === tag
  ) || tag;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12">
        <div className="mb-4">
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
          >
            ← Back to all posts
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Tagged: <span className="text-blue-600 dark:text-blue-400">{displayName}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </p>
      </header>

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
                {post.frontmatter.tags.map((postTag) => {
                  const tagSlug = postTag.toLowerCase().replace(/\s+/g, '-');
                  const isCurrentTag = tagSlug === tag;

                  return (
                    <span
                      key={postTag}
                      className={`px-3 py-1 text-sm rounded-full ${
                        isCurrentTag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {postTag}
                    </span>
                  );
                })}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
