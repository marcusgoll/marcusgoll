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
import Link from 'next/link';
import { PrevNextNav } from '@/components/blog/prev-next-nav';
import { SocialShare } from '@/components/blog/social-share';
import { TableOfContents } from '@/components/blog/table-of-contents';
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

      <div className="min-h-screen bg-[var(--bg)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:hidden mb-8">
            <TableOfContents />
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
            <article className="w-full lg:max-w-[min(65ch,100%)] xl:max-w-3xl">
              <header className="mb-8">
                {/* Eyebrow - Back to Articles */}
                <div className="mb-3">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Articles
                  </Link>
                </div>

                <h1 className="text-5xl font-black text-[var(--text)] mb-6 leading-tight">
                  {frontmatter.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mb-6">
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
                      className="inline-block px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] rounded transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>

                <SocialShare
                  url={`https://marcusgoll.com/articles/${slug}`}
                  title={frontmatter.title}
                />

                {/* Divider */}
                <hr className="mt-6" />
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

              <div className="format format-base lg:format-lg format-blue dark:format-invert">
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
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <h2 className="text-lg font-semibold text-[var(--text)] mb-4 format">On this page</h2>
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
