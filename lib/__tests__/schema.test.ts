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

import { mapTagsToCategory, generateBlogPostingSchema } from '../schema';
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
