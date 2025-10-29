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
 * Website schema type for Schema.org JSON-LD
 * T025: Website schema with SearchAction for homepage
 * Used for site-level structured data and search box in SERPs
 */
export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

/**
 * Person schema type for Schema.org JSON-LD
 * T035: Person schema for About page
 * Used for personal brand identity and professional profile
 */
export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs: string[];
  knowsAbout: string[];
}

/**
 * Organization schema type for Schema.org JSON-LD
 * T045: Organization schema for brand entity
 * Used for unified brand representation across all pages
 */
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: {
    '@type': 'ImageObject';
    url: string;
  };
  description: string;
  founder?: PersonSchema;
  sameAs: string[];
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

/**
 * Generate Website JSON-LD schema for homepage
 * T026: Website schema with SearchAction
 * FR-007: Site-level structured data with search capability
 *
 * Provides site-wide metadata and enables SERP search box.
 * SearchAction allows users to search directly from Google results.
 *
 * @returns WebsiteSchema object for JSON-LD script tag
 *
 * @see https://schema.org/WebSite
 * @see https://schema.org/SearchAction
 */
export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Marcus Gollahon',
    url: 'https://marcusgoll.com',
    description: 'Software developer, flight instructor, and educator helping pilots and developers master systematic thinking.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://marcusgoll.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generate Person JSON-LD schema for About page
 * T036: Person schema with brand data from constitution
 * FR-008: Personal brand identity schema
 *
 * Provides professional identity and social profile links.
 * Data extracted from constitution.md via getConstitutionData().
 *
 * @returns PersonSchema object for JSON-LD script tag
 *
 * @see https://schema.org/Person
 */
export function generatePersonSchema(): PersonSchema {
  const brandData = getConstitutionData();

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: brandData.name,
    jobTitle: brandData.jobTitle,
    description: brandData.description,
    url: brandData.url,
    image: 'https://marcusgoll.com/images/marcus-profile.jpg',
    sameAs: brandData.sameAs,
    knowsAbout: ['Aviation', 'Software Development', 'Flight Instruction', 'Education', 'Systematic Thinking']
  };
}

/**
 * Generate Organization JSON-LD schema for brand entity
 * T046: Organization schema with optional founder reference
 * FR-009: Unified brand entity across all pages
 *
 * Provides organization-level metadata for personal brand.
 * Optionally includes founder Person reference for About page.
 *
 * @param includeFounder - Whether to include founder Person schema (default: true)
 * @returns OrganizationSchema object for JSON-LD script tag
 *
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema(includeFounder: boolean = true): OrganizationSchema {
  const brandData = getConstitutionData();

  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandData.name,
    url: brandData.url,
    logo: {
      '@type': 'ImageObject',
      url: 'https://marcusgoll.com/images/logo.png'
    },
    description: brandData.description,
    sameAs: brandData.sameAs
  };

  if (includeFounder) {
    schema.founder = generatePersonSchema();
  }

  return schema;
}

/**
 * ContactPage schema type for Schema.org JSON-LD
 * Used for contact pages to appear in rich results
 */
export interface ContactPageSchema {
  '@context': 'https://schema.org';
  '@type': 'ContactPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    '@type': 'WebSite';
    '@id': string;
  };
}

/**
 * Generate ContactPage JSON-LD schema
 * T011: ContactPage schema for contact form page
 *
 * Provides structured data for the contact form page.
 * Improves SEO and helps search engines understand the page purpose.
 *
 * @returns ContactPageSchema object for JSON-LD script tag
 *
 * @see https://schema.org/ContactPage
 */
export function generateContactPageSchema(): ContactPageSchema {
  const brandData = getConstitutionData();

  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${brandData.name}`,
    description: 'Get in touch with Marcus Gollahon about aviation consulting, dev/startup collaboration, or CFI training resources.',
    url: `${brandData.url}/contact`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${brandData.url}/#website`,
    },
  };
}

/**
 * CollectionPage schema type for Schema.org JSON-LD
 * Used for projects portfolio page to appear in rich results
 */
export interface CollectionPageSchema {
  '@context': 'https://schema.org';
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    '@type': 'WebSite';
    '@id': string;
  };
  author: {
    '@type': 'Person';
    name: string;
    url: string;
  };
}

/**
 * Generate CollectionPage JSON-LD schema for projects portfolio
 * T011: CollectionPage schema for projects page
 *
 * Provides structured data for the projects portfolio page.
 * Improves SEO and helps search engines understand the page as a collection.
 *
 * @returns CollectionPageSchema object for JSON-LD script tag
 *
 * @see https://schema.org/CollectionPage
 */
export function generateCollectionPageSchema(): CollectionPageSchema {
  const brandData = getConstitutionData();

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects Portfolio - Marcus Gollahon',
    description: 'Portfolio of aviation and software development projects showcasing flight instruction platforms, developer tools, and systematic thinking applied across domains.',
    url: `${brandData.url}/projects`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${brandData.url}/#website`,
    },
    author: {
      '@type': 'Person',
      name: brandData.name,
      url: brandData.url,
    },
  };
}
