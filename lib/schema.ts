/**
 * Schema.org utilities for structured data generation
 * Provides JSON-LD generation for BlogPosting and BreadcrumbList schemas
 */

import type { PostData } from './mdx-types';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * BlogPosting schema type for Schema.org JSON-LD
 * Used for rich snippets in search engines
 * T008, T009: Extended with mainEntityOfPage for LLM optimization
 * T015: Extended with articleSection for dual-track categories
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
  articleSection: string;
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
 * Brand data extracted from constitution.md
 * T006: Constitution data extraction for Person/Organization schemas
 */
interface BrandData {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
}

/**
 * Cached brand data to avoid repeated file reads
 */
let brandDataCache: BrandData | null = null;

/**
 * Extract brand data from constitution.md at build time
 * T006: Constitution data extraction utility
 *
 * Reads constitution.md once and caches the result.
 * Used by generatePersonSchema() and generateOrganizationSchema().
 *
 * @returns Brand data including name, jobTitle, description, social links
 */
function getConstitutionData(): BrandData {
  if (brandDataCache) {
    return brandDataCache;
  }

  try {
    const constitutionPath = join(process.cwd(), '.spec-flow', 'memory', 'constitution.md');
    const content = readFileSync(constitutionPath, 'utf-8');

    // Extract brand mission (line 19 based on research)
    const missionMatch = content.match(/\*\*Brand Mission\*\*:\s*"([^"]+)"/);
    const description = missionMatch
      ? missionMatch[1]
      : "Software developer, flight instructor, and educator helping pilots and developers master systematic thinking.";

    // Static data from constitution research
    brandDataCache = {
      name: 'Marcus Gollahon',
      jobTitle: 'Software Developer & Flight Instructor',
      description,
      url: 'https://marcusgoll.com',
      sameAs: [
        'https://twitter.com/marcusgoll',
        'https://linkedin.com/in/marcusgollahon',
        'https://github.com/marcusgoll'
      ]
    };

    return brandDataCache;
  } catch (error) {
    // Fallback data if constitution.md is not accessible
    console.warn('Could not read constitution.md, using fallback brand data');
    brandDataCache = {
      name: 'Marcus Gollahon',
      jobTitle: 'Software Developer & Flight Instructor',
      description: 'Software developer, flight instructor, and educator helping pilots and developers master systematic thinking.',
      url: 'https://marcusgoll.com',
      sameAs: [
        'https://twitter.com/marcusgoll',
        'https://linkedin.com/in/marcusgollahon',
        'https://github.com/marcusgoll'
      ]
    };
    return brandDataCache;
  }
}

/**
 * Map blog post tags to dual-track content categories
 * T005: Category mapping utility for BlogPosting articleSection
 *
 * Maps tags to one of four categories based on priority order:
 * Aviation > Development > Leadership > Blog (default)
 *
 * Case-insensitive matching. First matching category wins.
 *
 * @param tags - Array of tags from blog post frontmatter
 * @returns Category string for Schema.org articleSection field
 *
 * @example
 * mapTagsToCategory(['aviation', 'cfi']) // 'Aviation'
 * mapTagsToCategory(['coding', 'typescript']) // 'Development'
 * mapTagsToCategory(['leadership']) // 'Leadership'
 * mapTagsToCategory(['random']) // 'Blog'
 */
export function mapTagsToCategory(tags: string[]): string {
  const lowerTags = tags.map(t => t.toLowerCase());

  // Priority order: Aviation > Development > Leadership > Blog
  const aviationKeywords = ['aviation', 'flight', 'pilot', 'cfi', 'instructor', 'aircraft', 'flying'];
  const devKeywords = ['development', 'coding', 'programming', 'typescript', 'react', 'next', 'software', 'dev', 'startup', 'tech'];
  const leadershipKeywords = ['leadership', 'management', 'teaching', 'education', 'mentoring'];

  for (const tag of lowerTags) {
    if (aviationKeywords.some(k => tag.includes(k))) {
      return 'Aviation';
    }
  }

  for (const tag of lowerTags) {
    if (devKeywords.some(k => tag.includes(k))) {
      return 'Development';
    }
  }

  for (const tag of lowerTags) {
    if (leadershipKeywords.some(k => tag.includes(k))) {
      return 'Leadership';
    }
  }

  // Default fallback
  return 'Blog';
}

/**
 * Generate BlogPosting JSON-LD schema for SEO
 * FR-003: Schema.org structured data generation
 * NFR-004: Must pass Google Rich Results Test
 * T008, T009: Extended with mainEntityOfPage for canonical URL
 * T016: Extended with articleSection for dual-track categories
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

  // Map tags to dual-track category (T016)
  const articleSection = mapTagsToCategory(post.frontmatter.tags || []);

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
    articleSection,
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
