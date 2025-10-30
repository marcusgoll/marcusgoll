/**
 * Articles index page
 * Grid layout with dark navy background
 * Lists all articles sorted by date (newest first)
 */

import { getAllPosts } from '@/lib/mdx';
import type { Metadata } from 'next';
import { ArticleGridCard } from '@/components/blog/article-grid-card';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Aviation career guidance, software development insights, and startup lessons. Teaching systematic thinking from 30,000 feet.',
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/articles`,
    title: 'Articles | Marcus Gollahon',
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

export default async function ArticlesIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-[#1a1f2e] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We use an agile approach to test assumptions and connect with the needs of your audience early and often.
          </p>
        </header>

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ArticleGridCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
