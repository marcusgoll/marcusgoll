/**
 * Articles index page
 * Navy background with 3-column equal grid layout
 */

import { getAllPosts } from '@/lib/mdx';
import type { Metadata } from 'next';
import { CompactArticleCard } from '@/components/blog/compact-article-card';
import { Pagination } from '@/components/blog/pagination';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';
const POSTS_PER_PAGE = 9; // 3 columns x 3 rows

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

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesIndexPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // Paginate posts
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-navy-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header - Left Aligned */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            We use an agile approach to test assumptions and connect with the needs of your audience early and often.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles found. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* 3-Column Equal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
              {posts.map((post, index) => {
                // Add left border to columns 2 and 3 (index % 3 === 1 or 2)
                const columnIndex = index % 3;
                const showLeftBorder = columnIndex === 1 || columnIndex === 2;

                return (
                  <CompactArticleCard
                    key={post.slug}
                    post={post}
                    showLeftBorder={showLeftBorder}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/articles" />
          </>
        )}
      </div>
    </div>
  );
}
