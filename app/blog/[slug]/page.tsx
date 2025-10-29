/**
 * Individual Blog Post Page
 *
 * Comprehensive blog post page with all enhancements from Feature 002:
 * - US1 (FR-001): Related posts based on tag overlap algorithm
 * - US2 (FR-002): Previous/Next chronological navigation
 * - US3 (FR-003): BlogPosting Schema.org JSON-LD for rich snippets
 * - US4 (FR-005): Social sharing (Twitter, LinkedIn, Copy, Web Share API)
 * - US5 (FR-006): Table of contents with scroll spy
 * - US6 (FR-007): Breadcrumb navigation with BreadcrumbList schema
 *
 * Architecture:
 * - Server Component for data fetching and static generation
 * - Client Components for interactive features (SocialShare, TableOfContents)
 * - Responsive grid layout (mobile-first, desktop sidebar for TOC)
 * - SEO optimized with metadata generation and Schema.org structured data
 * - Accessibility compliant (WCAG 2.1 AA, ARIA labels, keyboard navigation)
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
import { TLDRSection } from '@/components/blog/tldr-section';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

/**
 * Props for BlogPostPage component
 * Next.js 15+ uses Promise for params (async route resolution)
 */
interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts at build time
 * Enables Static Site Generation (SSG) for all posts
 * FR-003: Pre-render all posts for optimal performance
 *
 * @returns Array of param objects with slug for each post
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 * Creates title, description, Open Graph, and Twitter Card tags
 * FR-009: SEO meta tags automatically derived from frontmatter
 *
 * @param params - Route params containing post slug
 * @returns Metadata object for Next.js head generation
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

  // Helper to get absolute image URL
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
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      url: `${SITE_URL}/blog/${slug}`,
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

/**
 * Blog Post Page Component
 *
 * Main component that renders a complete blog post with all enhancements.
 * Server Component - fetches data at build time for static generation.
 *
 * Layout Structure:
 * 1. Container with mobile TOC (collapsible) at top
 * 2. Grid layout on desktop (article + sticky TOC sidebar)
 * 3. Article with breadcrumbs, header, featured image, MDX content
 * 4. Footer with prev/next navigation and related posts
 *
 * @param params - Route params containing post slug (Promise in Next.js 15+)
 * @returns Rendered blog post page or 404
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Return 404 if post not found
  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  // Generate BlogPosting JSON-LD schema for rich snippets (US3, FR-003)
  const blogPostingSchema = generateBlogPostingSchema(post);

  // Generate Organization schema for brand entity (T047)
  const organizationSchema = generateOrganizationSchema(false);

  // Generate breadcrumb segments for hierarchical navigation (US6, FR-007, T063)
  // Structure: Home > Blog > [Post Title]
  const breadcrumbSegments: BreadcrumbSegment[] = [
    {
      label: 'Home',
      url: 'https://marcusgoll.com',
      position: 1,
    },
    {
      label: 'Blog',
      url: 'https://marcusgoll.com/blog',
      position: 2,
    },
    {
      label: frontmatter.title,
      url: `https://marcusgoll.com/blog/${slug}`,
      position: 3,
    },
  ];

  return (
    <>
      {/* BlogPosting JSON-LD for SEO - US3 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      {/* Organization JSON-LD for brand entity - T047 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Main container with responsive padding */}
      <div className="container mx-auto px-4 py-12">
        {/* Mobile TOC - collapsible section shown only on mobile devices (< lg breakpoint)
            Positioned before content for better UX on small screens (US5) */}
        <div className="lg:hidden mb-8">
          <TableOfContents />
        </div>

        {/* Grid layout - single column on mobile, two columns on desktop
            Desktop: article (1fr) + sticky sidebar (280px) with 12-16px gap */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
          <article className="max-w-3xl">
        {/* Breadcrumbs navigation - hierarchical path (Home > Blog > Post) with Schema.org (US6) */}
        <Breadcrumbs segments={breadcrumbSegments} />

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

        {/* Tags - clickable links to tag archive pages */}
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

        {/* Social Share buttons - Twitter, LinkedIn, Copy Link, Web Share API (US4) */}
        <SocialShare
          url={`https://marcusgoll.com/blog/${slug}`}
          title={frontmatter.title}
        />
      </header>

      {/* TL;DR Section - T013: LLM optimization summary (US5) */}
      <TLDRSection excerpt={frontmatter.excerpt} />

      {/* Featured image - responsive with 16:9 aspect ratio, priority loading */}
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

      {/* MDX content - rendered with syntax highlighting and GitHub-flavored markdown
          Uses Tailwind Typography plugin (prose) for beautiful default styling */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [
                remarkGfm, // GitHub Flavored Markdown (tables, strikethrough, etc.)
                remarkValidateHeadings, // T012: Heading hierarchy validation for LLM optimization
              ],
              rehypePlugins: [rehypeShiki], // Shiki syntax highlighting with dual themes
            },
          }}
        />
      </div>

          {/* Previous/Next Navigation - chronological post navigation (US2) */}
          <PrevNextNav currentSlug={slug} />

          {/* Related Posts - 3 posts with highest tag overlap, fallback to latest (US1) */}
          <RelatedPosts currentSlug={slug} />
        </article>

        {/* Table of Contents - sticky sidebar on desktop (hidden on mobile < lg)
            Auto-generates from H2/H3 headings with scroll spy for active section highlighting (US5)
            Sticky positioning keeps it visible while scrolling, max-height with overflow for long TOCs */}
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
