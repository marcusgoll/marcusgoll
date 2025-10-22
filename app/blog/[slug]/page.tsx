/**
 * Individual blog post page
 * Renders MDX content with metadata and SEO optimization
 * FR-003, FR-009, US1
 */

import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx/mdx-components';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { RelatedPosts } from '@/components/blog/related-posts';
import { PrevNextNav } from '@/components/blog/prev-next-nav';
import { SocialShare } from '@/components/blog/social-share';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { generateBlogPostingSchema } from '@/lib/schema';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts at build time
 * FR-003: Pre-render all posts
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO (title, description, OG tags)
 * FR-009: SEO meta tags from frontmatter
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { frontmatter } = post;

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      images: frontmatter.featuredImage ? [frontmatter.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: frontmatter.featuredImage ? [frontmatter.featuredImage] : [],
    },
  };
}

/**
 * Blog post page component
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Return 404 if post not found
  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  // Generate BlogPosting schema for SEO (US3, FR-003)
  const blogPostingSchema = generateBlogPostingSchema(post);

  return (
    <>
      {/* BlogPosting JSON-LD for SEO - US3 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Mobile TOC - shown only on mobile devices, before content */}
        <div className="lg:hidden mb-8">
          <TableOfContents />
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
          <article className="max-w-3xl">
        {/* Post header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{frontmatter.title}</h1>

        {/* Post metadata */}
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {frontmatter.tags.map((tag) => (
            <a
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>

        {/* Social Share - US4 */}
        <SocialShare
          url={`https://marcusgoll.com/blog/${slug}`}
          title={frontmatter.title}
        />
      </header>

      {/* Featured image */}
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

      {/* MDX content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>

          {/* Previous/Next Navigation - US2 */}
          <PrevNextNav currentSlug={slug} />

          {/* Related Posts - US1 */}
          <RelatedPosts currentSlug={slug} />
        </article>

        {/* Table of Contents - US5 (sticky sidebar on desktop) */}
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
