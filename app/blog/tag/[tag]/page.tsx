/**
 * Tag archive page
 * Shows all blog posts filtered by a specific tag
 * FR-014, US5
 */

import { getAllTags, getPostsByTag } from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/post-card';

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
  try {
    const tags = await getAllTags();
    return tags.map((tag) => ({
      tag: tag.slug,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Failed to generate tag params:', error);
    // Return empty array to prevent build failure
    // Tags will be generated dynamically at runtime
    return [];
  }
}

// Site URL with fallback
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

/**
 * Generate metadata for tag archive pages with Open Graph and Twitter Card
 */
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

    const title = `Posts tagged: ${displayName} | Marcus Gollahon`;
    const description = `Explore all posts about ${displayName}. ${posts.length} post${posts.length !== 1 ? 's' : ''} found.`;
    const url = `${SITE_URL}/blog/tag/${tag}`;

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
            alt: `Posts tagged: ${displayName}`,
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
      title: 'Blog Tags',
    };
  }
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
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
