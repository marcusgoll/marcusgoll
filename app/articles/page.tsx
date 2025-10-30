/**
 * Articles index page
 * Navy background with 3-column layout (featured + 2 grid columns with full-height dividers)
 */

import { getAllPosts } from '@/lib/mdx';
import type { Metadata } from 'next';
import { FeaturedArticleCard } from '@/components/blog/featured-article-card';
import { CompactArticleCard } from '@/components/blog/compact-article-card';
import { Pagination } from '@/components/blog/pagination';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';
const POSTS_PER_PAGE = 9; // 1 featured + 4 + 4

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

  // Split posts: featured (first) + middle column (next 4) + right column (last 4)
  const [featuredPost, ...remainingPosts] = posts;
  const middlePosts = remainingPosts.slice(0, 4);
  const rightPosts = remainingPosts.slice(4, 8);

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
            {/* 3-Column Layout with Full-Height Dividers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              {/* Left Column - Featured Post */}
              {featuredPost && (
                <div>
                  <FeaturedArticleCard post={featuredPost} />
                </div>
              )}

              {/* Middle Column - With Full-Height Left Border */}
              {middlePosts.length > 0 && (
                <div className="lg:border-l lg:border-gray-700 lg:pl-8 space-y-12">
                  {middlePosts.map((post) => (
                    <CompactArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              )}

              {/* Right Column - With Full-Height Left Border */}
              {rightPosts.length > 0 && (
                <div className="lg:border-l lg:border-gray-700 lg:pl-8 space-y-12">
                  {rightPosts.map((post) => (
                    <CompactArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/articles" />
          </>
        )}
      </div>
    </div>
  );
}
