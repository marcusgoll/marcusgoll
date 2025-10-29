/**
 * Unit Tests: Schema.org JSON-LD Generation
 * T010, T011, T020, T030, T040: Test schema generators
 *
 * Test Framework: Simple test harness (following maintenance-utils.test.ts pattern)
 * To run: node --loader tsx lib/__tests__/schema.test.ts
 * Or: npm test (if Jest/Vitest configured)
 *
 * Coverage Target: 100% of new schema generation functions
 */

import {
  mapTagsToCategory,
  generateBlogPostingSchema,
  generateWebsiteSchema,
  generatePersonSchema,
  generateOrganizationSchema
} from '../schema';
import type { PostData } from '../mdx-types';

// Simple test harness (no framework dependency)
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(name: string, fn: () => void): void {
  testsRun++;
  try {
    fn();
    testsPassed++;
    console.log(`✅ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`❌ ${name}`);
    console.error(`   ${error}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      message ||
        `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertIncludes<T>(array: T[], value: T, message?: string): void {
  if (!array.includes(value)) {
    throw new Error(
      message ||
        `Expected array to include ${JSON.stringify(value)}, got ${JSON.stringify(array)}`
    );
  }
}

function assertTruthy(value: unknown, message?: string): void {
  if (!value) {
    throw new Error(message || `Expected truthy value, got ${JSON.stringify(value)}`);
  }
}

// =============================================================================
// T010: mapTagsToCategory() Tests
// =============================================================================

test('mapTagsToCategory: aviation tags return Aviation category', () => {
  assertEqual(mapTagsToCategory(['aviation', 'pilot']), 'Aviation');
});

test('mapTagsToCategory: flight-training tags return Aviation category', () => {
  assertEqual(mapTagsToCategory(['flight-training', 'cfi']), 'Aviation');
});

test('mapTagsToCategory: development tags return Development category', () => {
  assertEqual(mapTagsToCategory(['coding', 'typescript']), 'Development');
});

test('mapTagsToCategory: startup tags return Development category', () => {
  assertEqual(mapTagsToCategory(['startup', 'tech']), 'Development');
});

test('mapTagsToCategory: leadership tags return Leadership category', () => {
  assertEqual(mapTagsToCategory(['leadership', 'management']), 'Leadership');
});

test('mapTagsToCategory: teaching tags return Leadership category', () => {
  assertEqual(mapTagsToCategory(['teaching', 'education']), 'Leadership');
});

test('mapTagsToCategory: unknown tags return Blog category (default)', () => {
  assertEqual(mapTagsToCategory(['random-tag', 'unknown']), 'Blog');
});

test('mapTagsToCategory: empty tags array returns Blog category', () => {
  assertEqual(mapTagsToCategory([]), 'Blog');
});

test('mapTagsToCategory: case-insensitive matching works', () => {
  assertEqual(mapTagsToCategory(['AVIATION', 'PILOT']), 'Aviation');
});

test('mapTagsToCategory: priority order Aviation > Development', () => {
  // When both aviation and dev tags present, Aviation wins
  assertEqual(mapTagsToCategory(['aviation', 'coding']), 'Aviation');
});

test('mapTagsToCategory: priority order Development > Leadership', () => {
  // When both dev and leadership tags present, Development wins
  assertEqual(mapTagsToCategory(['coding', 'leadership']), 'Development');
});

// =============================================================================
// T011: generateBlogPostingSchema() Tests - articleSection field
// =============================================================================

test('generateBlogPostingSchema: includes articleSection field for aviation post', () => {
  const mockPost: PostData = {
    slug: 'test-aviation-post',
    frontmatter: {
      title: 'Aviation Test',
      date: '2025-10-29',
      author: 'Marcus Gollahon',
      excerpt: 'Test excerpt',
      tags: ['aviation', 'pilot'],
      featuredImage: '/images/test.png'
    },
    content: 'Test content for aviation post with multiple words here.'
  };

  const schema = generateBlogPostingSchema(mockPost);

  assertTruthy(schema.articleSection, 'articleSection should be present');
  assertEqual(schema.articleSection, 'Aviation', 'Aviation tags should map to Aviation category');
});

test('generateBlogPostingSchema: includes articleSection field for dev post', () => {
  const mockPost: PostData = {
    slug: 'test-dev-post',
    frontmatter: {
      title: 'Development Test',
      date: '2025-10-29',
      author: 'Marcus Gollahon',
      excerpt: 'Test excerpt',
      tags: ['coding', 'typescript'],
      featuredImage: '/images/test.png'
    },
    content: 'Test content for development post with multiple words here.'
  };

  const schema = generateBlogPostingSchema(mockPost);

  assertTruthy(schema.articleSection, 'articleSection should be present');
  assertEqual(schema.articleSection, 'Development', 'Dev tags should map to Development category');
});

test('generateBlogPostingSchema: articleSection defaults to Blog for unknown tags', () => {
  const mockPost: PostData = {
    slug: 'test-general-post',
    frontmatter: {
      title: 'General Test',
      date: '2025-10-29',
      author: 'Marcus Gollahon',
      excerpt: 'Test excerpt',
      tags: ['random', 'other'],
      featuredImage: '/images/test.png'
    },
    content: 'Test content for general post with multiple words here.'
  };

  const schema = generateBlogPostingSchema(mockPost);

  assertTruthy(schema.articleSection, 'articleSection should be present');
  assertEqual(schema.articleSection, 'Blog', 'Unknown tags should default to Blog category');
});

test('generateBlogPostingSchema: articleSection handles missing tags array', () => {
  const mockPost: PostData = {
    slug: 'test-no-tags-post',
    frontmatter: {
      title: 'No Tags Test',
      date: '2025-10-29',
      author: 'Marcus Gollahon',
      excerpt: 'Test excerpt',
      featuredImage: '/images/test.png'
    },
    content: 'Test content for post without tags field.'
  };

  const schema = generateBlogPostingSchema(mockPost);

  assertTruthy(schema.articleSection, 'articleSection should be present even without tags');
  assertEqual(schema.articleSection, 'Blog', 'Missing tags should default to Blog category');
});

// =============================================================================
// T020: generateWebsiteSchema() Tests
// =============================================================================

test('generateWebsiteSchema: includes all required Schema.org fields', () => {
  const schema = generateWebsiteSchema();

  assertEqual(schema['@context'], 'https://schema.org', '@context should be https://schema.org');
  assertEqual(schema['@type'], 'WebSite', '@type should be WebSite');
  assertTruthy(schema.name, 'name should be present');
  assertTruthy(schema.url, 'url should be present');
  assertTruthy(schema.description, 'description should be present');
});

test('generateWebsiteSchema: includes SearchAction for SERP search box', () => {
  const schema = generateWebsiteSchema();

  assertTruthy(schema.potentialAction, 'potentialAction should be present');
  assertEqual(schema.potentialAction['@type'], 'SearchAction', 'potentialAction should be SearchAction');
  assertTruthy(schema.potentialAction.target, 'SearchAction target should be present');
  assertTruthy(schema.potentialAction.target.urlTemplate, 'SearchAction urlTemplate should be present');
  assertTruthy(schema.potentialAction['query-input'], 'SearchAction query-input should be present');
});

test('generateWebsiteSchema: SearchAction target includes search_term_string placeholder', () => {
  const schema = generateWebsiteSchema();

  const urlTemplate = schema.potentialAction.target.urlTemplate;
  assertTruthy(urlTemplate.includes('{search_term_string}'), 'urlTemplate should include {search_term_string} placeholder');
});

// =============================================================================
// T030: generatePersonSchema() Tests
// =============================================================================

test('generatePersonSchema: includes all required Schema.org fields', () => {
  const schema = generatePersonSchema();

  assertEqual(schema['@context'], 'https://schema.org', '@context should be https://schema.org');
  assertEqual(schema['@type'], 'Person', '@type should be Person');
  assertTruthy(schema.name, 'name should be present');
  assertEqual(schema.name, 'Marcus Gollahon', 'name should be Marcus Gollahon');
  assertTruthy(schema.jobTitle, 'jobTitle should be present');
  assertTruthy(schema.description, 'description should be present');
  assertTruthy(schema.url, 'url should be present');
});

test('generatePersonSchema: includes sameAs social profile links', () => {
  const schema = generatePersonSchema();

  assertTruthy(schema.sameAs, 'sameAs should be present');
  assertTruthy(Array.isArray(schema.sameAs), 'sameAs should be an array');
  assertTruthy(schema.sameAs.length >= 3, 'sameAs should have at least 3 social links');
});

test('generatePersonSchema: includes knowsAbout expertise areas', () => {
  const schema = generatePersonSchema();

  assertTruthy(schema.knowsAbout, 'knowsAbout should be present');
  assertTruthy(Array.isArray(schema.knowsAbout), 'knowsAbout should be an array');
  assertIncludes(schema.knowsAbout, 'Aviation', 'knowsAbout should include Aviation');
  assertIncludes(schema.knowsAbout, 'Software Development', 'knowsAbout should include Software Development');
});

// =============================================================================
// T040: generateOrganizationSchema() Tests
// =============================================================================

test('generateOrganizationSchema: includes all required Schema.org fields', () => {
  const schema = generateOrganizationSchema(false); // Test without founder first

  assertEqual(schema['@context'], 'https://schema.org', '@context should be https://schema.org');
  assertEqual(schema['@type'], 'Organization', '@type should be Organization');
  assertTruthy(schema.name, 'name should be present');
  assertTruthy(schema.url, 'url should be present');
  assertTruthy(schema.logo, 'logo should be present');
  assertEqual(schema.logo['@type'], 'ImageObject', 'logo @type should be ImageObject');
  assertTruthy(schema.logo.url, 'logo url should be present');
  assertTruthy(schema.description, 'description should be present');
});

test('generateOrganizationSchema: includes sameAs social links', () => {
  const schema = generateOrganizationSchema(false);

  assertTruthy(schema.sameAs, 'sameAs should be present');
  assertTruthy(Array.isArray(schema.sameAs), 'sameAs should be an array');
  assertTruthy(schema.sameAs.length >= 3, 'sameAs should have at least 3 social links');
});

test('generateOrganizationSchema: includes founder Person reference when includeFounder=true', () => {
  const schema = generateOrganizationSchema(true);

  assertTruthy(schema.founder, 'founder should be present when includeFounder=true');
  assertEqual(schema.founder?.['@type'], 'Person', 'founder @type should be Person');
  assertEqual(schema.founder?.name, 'Marcus Gollahon', 'founder name should match Person schema');
});

test('generateOrganizationSchema: excludes founder when includeFounder=false', () => {
  const schema = generateOrganizationSchema(false);

  assertEqual(schema.founder, undefined, 'founder should be undefined when includeFounder=false');
});

test('generateOrganizationSchema: founder matches Person schema data (consistency)', () => {
  const orgSchema = generateOrganizationSchema(true);
  const personSchema = generatePersonSchema();

  assertEqual(orgSchema.founder?.name, personSchema.name, 'founder name should match Person schema');
  assertEqual(orgSchema.founder?.jobTitle, personSchema.jobTitle, 'founder jobTitle should match Person schema');
  assertEqual(orgSchema.founder?.url, personSchema.url, 'founder url should match Person schema');
});

// =============================================================================
// Test Runner
// =============================================================================

console.log('\n=== Schema.org JSON-LD Tests ===\n');

console.log(`\nTests run: ${testsRun}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
