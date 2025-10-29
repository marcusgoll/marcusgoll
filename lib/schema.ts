/**
 * Schema.org utilities for structured data generation
 * Provides JSON-LD generation for BlogPosting and BreadcrumbList schemas
 */

import type { PostData } from './mdx-types';

/**
 * BlogPosting schema type for Schema.org JSON-LD
 * Used for rich snippets in search engines
 * T008, T009: Extended with mainEntityOfPage for LLM optimization
 */
export interface BlogPostingSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
    url: string;
  };
  image?: string | string[];
  articleBody: string;
  wordCount: number;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

/**
 * BreadcrumbList schema type for Schema.org JSON-LD
 * Used for navigation breadcrumbs in search results
 */
export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * FAQPage schema type for Schema.org JSON-LD
 * T002: FAQ schema interfaces for LLM optimization
 * Used for FAQ-style blog posts to appear in rich results
 */
export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: QuestionSchema[];
}

export interface QuestionSchema {
  '@type': 'Question';
  name: string;
  acceptedAnswer: AnswerSchema;
}

export interface AnswerSchema {
  '@type': 'Answer';
  text: string;
}

/**
 * HowTo schema type for Schema.org JSON-LD
 * T003: HowTo schema interfaces for LLM optimization
 * Used for tutorial-style blog posts to appear in rich results
 */
export interface HowToSchema {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  step: HowToStepSchema[];
}

export interface HowToStepSchema {
  '@type': 'HowToStep';
  name: string;
  text: string;
  position?: number;
}

/**
 * Generate BlogPosting JSON-LD schema for SEO
 * FR-003: Schema.org structured data generation
 * NFR-004: Must pass Google Rich Results Test
 * T008, T009: Extended with mainEntityOfPage for canonical URL
 *
 * @param post - Post data including frontmatter and content
 * @returns BlogPosting schema object for JSON-LD script tag
 */
export function generateBlogPostingSchema(post: PostData): BlogPostingSchema {
  // Calculate word count from content
  const wordCount = post.content.trim().split(/\s+/).length;

  // Ensure absolute URL for image
  const image = post.frontmatter.featuredImage
    ? post.frontmatter.featuredImage.startsWith('http')
      ? post.frontmatter.featuredImage
      : `https://marcusgoll.com${post.frontmatter.featuredImage}`
    : 'https://marcusgoll.com/images/og-default.png';

  // Canonical URL for mainEntityOfPage (T009)
  const canonicalUrl = `https://marcusgoll.com/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.publishedAt || post.frontmatter.date,
    author: {
      '@type': 'Person',
      name: post.frontmatter.author,
      url: 'https://marcusgoll.com',
    },
    image,
    articleBody: post.content,
    wordCount,
    description: post.frontmatter.excerpt,
    publisher: {
      '@type': 'Organization',
      name: 'Marcus Gollahon',
      logo: {
        '@type': 'ImageObject',
        url: 'https://marcusgoll.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema for SEO
 * FR-007: Breadcrumb navigation with Schema.org structured data
 * T061: Implementation of breadcrumb schema generation
 *
 * @param segments - Array of breadcrumb segments with label, url, and position
 * @returns BreadcrumbListSchema object for JSON-LD script tag
 */
export function generateBreadcrumbListSchema(
  segments: Array<{ label: string; url: string; position: number }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment) => ({
      '@type': 'ListItem',
      position: segment.position,
      name: segment.label,
      item: segment.url,
    })),
  };
}
