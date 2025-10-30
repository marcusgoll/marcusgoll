/**
 * Individual Article Page
 *
 * Comprehensive article page with all enhancements:
 * - Related articles based on tag overlap algorithm
 * - Previous/Next chronological navigation
 * - BlogPosting Schema.org JSON-LD for rich snippets
 * - Social sharing (Twitter, LinkedIn, Copy, Web Share API)
 * - Table of contents with scroll spy
 * - Breadcrumb navigation with BreadcrumbList schema
 */

import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx/mdx-components';
import rehypeShiki from '@/lib/rehype-shiki';
import remarkGfm from 'remark-gfm';
import { remarkValidateHeadings } from '@/lib/remark-validate-headings';
import Image from 'next/image';
import { RelatedPosts } from '@/components/blog/related-posts';
import { PrevNextNav } from '@/components/blog/prev-next-nav';
import { SocialShare } from '@/components/blog/social-share';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { Breadcrumbs, type BreadcrumbSegment } from '@/components/blog/breadcrumbs';
import { generateBlogPostingSchema, generateOrganizationSchema } from '@/lib/schema';
import { InlineNewsletterCTA } from '@/components/newsletter/InlineNewsletterCTA';
import { TLDRSection } from '@/components/blog/tldr-section';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const { frontmatter } = post;

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return `${SITE_URL}/images/og-default.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${SITE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const imageUrl = getImageUrl(frontmatter.featuredImage);

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    authors: [{ name: frontmatter.author }],
    alternates: {
      canonical: `${SITE_URL}/articles/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      url: `${SITE_URL}/articles/${slug}`,
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      siteName: 'Marcus Gollahon',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@marcusgoll',
      creator: '@marcusgoll',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  const blogPostingSchema = generateBlogPostingSchema(post);
  const organizationSchema = generateOrganizationSchema(false);

  const breadcrumbSegments: BreadcrumbSegment[] = [
    {
      label: 'Home',
      url: 'https://marcusgoll.com',
      position: 1,
    },
    {
      label: 'Articles',
      url: 'https://marcusgoll.com/articles',
      position: 2,
    },
    {
      label: frontmatter.title,
      url: `https://marcusgoll.com/articles/${slug}`,
      position: 3,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="lg:hidden mb-8">
          <TableOfContents />
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
          <article className="max-w-3xl">
        <Breadcrumbs segments={breadcrumbSegments} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{frontmatter.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{frontmatter.author}</span>
          {frontmatter.readingTime && (
            <>
              <span>•</span>
              <span>{frontmatter.readingTime} min read</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {frontmatter.tags.map((tag) => (
            <a
              key={tag}
              href={`/articles/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>

        <SocialShare
          url={`https://marcusgoll.com/articles/${slug}`}
          title={frontmatter.title}
        />
      </header>

      <TLDRSection excerpt={frontmatter.excerpt} />

      {frontmatter.featuredImage && (
        <div className="mb-8 relative aspect-video">
          <Image
            src={frontmatter.featuredImage}
            alt={frontmatter.title}
            width={1200}
            height={630}
            priority
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [
                remarkGfm,
                remarkValidateHeadings,
              ],
              rehypePlugins: [rehypeShiki],
            },
          }}
        />
      </div>

      <InlineNewsletterCTA postTags={frontmatter.tags} />

          <PrevNextNav currentSlug={slug} />

          <RelatedPosts currentSlug={slug} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">On this page</h2>
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
