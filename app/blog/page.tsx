/**
 * Blog index page
 * Lists all blog posts sorted by date (newest first)
 * FR-013, US3
 */

import { getAllPosts, getAllTags } from '@/lib/mdx';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/post-card';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Aviation career guidance, software development insights, and startup lessons. Teaching systematic thinking from 30,000 feet.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog`,
    title: 'Blog | Marcus Gollahon',
    description: 'Aviation career guidance, software development insights, and startup lessons. Teaching systematic thinking from 30,000 feet.',
    siteName: 'Marcus Gollahon',
    images: [
      {
        url: `${SITE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marcusgoll',
    creator: '@marcusgoll',
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-[var(--text-muted)]">
          Articles and insights about aviation and software development.
        </p>

        {/* Tag cloud */}
        {tags.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-3">
              Browse by topic
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 text-sm bg-[var(--surface)] hover:bg-[var(--surface-muted)] rounded-full transition-colors"
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
          <p className="text-[var(--text-muted)]">No posts found. Check back soon!</p>
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
