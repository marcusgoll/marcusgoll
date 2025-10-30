/**
 * Tag archive page for articles
 * Shows all articles filtered by a specific tag
 */

import { getAllTags, getPostsByTag } from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArticleGridCard } from '@/components/blog/article-grid-card';

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

  return (
    <div className="min-h-screen bg-[#1a1f2e] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-12">
          <div className="mb-4">
            <Link
              href="/articles"
              className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-2 transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Tagged: <span className="text-emerald-400">{displayName}</span>
          </h1>
          <p className="text-lg text-gray-400">
            {posts.length} article{posts.length !== 1 ? 's' : ''} found
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ArticleGridCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
