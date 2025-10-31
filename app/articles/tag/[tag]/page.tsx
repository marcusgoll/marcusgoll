/**
 * Tag archive page for articles
 * Shows all articles filtered by a specific tag
 */

import { getAllTags, getPostsByTag } from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FeaturedArticleCard } from '@/components/blog/featured-article-card';
import { CompactArticleCard } from '@/components/blog/compact-article-card';

interface TagArchivePageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const tags = await getAllTags();
    return tags.map((tag) => ({
      tag: tag.slug,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Failed to generate tag params:', error);
    return [];
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

export async function generateMetadata({ params }: TagArchivePageProps): Promise<Metadata> {
  try {
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

    const title = `Articles tagged: ${displayName} | Marcus Gollahon`;
    const description = `Explore all articles about ${displayName}. ${posts.length} article${posts.length !== 1 ? 's' : ''} found.`;
    const url = `${SITE_URL}/articles/tag/${tag}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        siteName: 'Marcus Gollahon',
        images: [
          {
            url: `${SITE_URL}/images/og/og-default.svg`,
            width: 1200,
            height: 630,
            alt: `Articles tagged: ${displayName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@marcusgoll',
        creator: '@marcusgoll',
        title,
        description,
        images: [`${SITE_URL}/images/og/og-default.svg`],
      },
    };
  } catch (error) {
    console.error('[generateMetadata] Failed to generate tag metadata:', error);
    return {
      title: 'Article Tags',
    };
  }
}

export default async function TagArchivePage({ params }: TagArchivePageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const displayName = posts[0].frontmatter.tags.find(
    (t) => t.toLowerCase().replace(/\s+/g, '-') === tag
  ) || tag;

  // Split posts: featured (first) + evenly distribute remaining across columns 2 and 3
  const [featuredPost, ...remainingPosts] = posts;

  // Split remaining posts evenly between middle and right columns
  const midPoint = Math.ceil(remainingPosts.length / 2);
  const middlePosts = remainingPosts.slice(0, midPoint);
  const rightPosts = remainingPosts.slice(midPoint);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header - Left Aligned */}
        <header className="mb-12">
          <div className="mb-4">
            <Link
              href="/articles"
              className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 inline-flex items-center gap-2 transition-colors text-sm"
            >
              ← Back to all articles
            </Link>
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
            Tagged: <span className="text-emerald-600 dark:text-emerald-400">{displayName}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {posts.length} article{posts.length !== 1 ? 's' : ''} found
          </p>
        </header>

        {/* 3-Column Layout with Full-Height Dividers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Featured Post */}
          {featuredPost && (
            <div>
              <FeaturedArticleCard post={featuredPost} />
            </div>
          )}

          {/* Middle Column - With Full-Height Left Border */}
          {middlePosts.length > 0 && (
            <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8 space-y-8">
              {middlePosts.map((post) => (
                <CompactArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Right Column - With Full-Height Left Border */}
          {rightPosts.length > 0 && (
            <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8 space-y-8">
              {rightPosts.map((post) => (
                <CompactArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
