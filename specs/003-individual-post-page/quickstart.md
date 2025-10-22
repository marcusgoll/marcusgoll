# Quickstart: individual-post-page

## Scenario 1: Initial Setup

```bash
# No additional installation needed - uses existing dependencies
# All required packages already in package.json:
# - next-mdx-remote@5.0.0 (MDX rendering)
# - gray-matter@4.0.3 (frontmatter parsing)
# - tailwindcss@4.1.15 (styling)

# Verify dev environment
npm run dev

# Navigate to existing blog post
# Open: http://localhost:3000/blog/welcome-to-mdx
# Verify: Post displays with current layout

# Check console for errors
# Expected: No errors, page loads successfully
```

## Scenario 2: Testing Related Posts Algorithm

```bash
# Create test posts with overlapping tags
cd content/posts/

# Verify existing posts have tags
cat welcome-to-mdx.mdx | grep "tags:"
cat interactive-mdx-demo.mdx | grep "tags:"

# Test related posts logic (manual verification)
# 1. Open any blog post: http://localhost:3000/blog/[slug]
# 2. Scroll to bottom
# 3. Expected: Related posts section with 3 posts
# 4. Verify: Posts share at least one tag with current post
# 5. Fallback test: If <3 related, should show "Latest Posts"

# Programmatic test (run in Node REPL or test file)
node -e "
const { getAllPosts } = require('./lib/mdx.ts');
const posts = await getAllPosts();
console.log('Total posts:', posts.length);
console.log('Tags per post:', posts.map(p => ({
  slug: p.slug,
  tags: p.frontmatter.tags
})));
"
```

## Scenario 3: TOC Generation Validation

```bash
# Create a test post with multiple headings
cat > content/posts/toc-test.mdx <<'EOF'
---
slug: toc-test
title: TOC Test Post
date: 2025-10-22
author: Marcus Gollahon
excerpt: Test post for table of contents
tags: [Test]
---

## Introduction
Content here.

## Section One
More content.

### Subsection A
Details.

### Subsection B
More details.

## Section Two
Final content.

## Conclusion
Wrap up.
EOF

# Visit test post
# Open: http://localhost:3000/blog/toc-test

# Desktop verification (>1024px viewport):
# - TOC should appear as fixed sidebar on right
# - 6 items should be visible (5 H2 + 1 H3)
# - Clicking TOC link should scroll to section
# - Active section should highlight in TOC

# Mobile verification (<1024px viewport):
# - TOC should be collapsible at top of article
# - Default state: collapsed
# - Clicking toggle expands/collapses TOC
# - Active section still highlighted

# Cleanup
rm content/posts/toc-test.mdx
```

## Scenario 4: Schema.org Validation

```bash
# Build for production (schema only in production build)
npm run build
npm run start

# Open post in production mode
# Open: http://localhost:3000/blog/welcome-to-mdx

# View page source (Ctrl+U or right-click > View Source)
# Search for: <script type="application/ld+json">

# Extract JSON-LD
# Copy schema JSON from source

# Validate schema
# 1. Go to: https://search.google.com/test/rich-results
# 2. Paste post URL: http://localhost:3000/blog/welcome-to-mdx
# 3. Click "Test URL"
# 4. Expected: "Valid" with BlogPosting detected
# 5. Verify fields: headline, datePublished, author, image

# Alternative: Local validation
npm install -g jsonld
echo '{...schema...}' | jsonld format

# Check for required fields
# - @type: "BlogPosting"
# - headline: present
# - datePublished: ISO 8601 format
# - author.name: "Marcus Gollahon"
# - image: URL or array of URLs
```

## Scenario 5: Social Sharing

```bash
# Test on various devices/browsers

# Desktop Chrome/Firefox/Safari:
# 1. Open: http://localhost:3000/blog/welcome-to-mdx
# 2. Verify share buttons visible below title
# 3. Click Twitter button
#    - Expected: Opens twitter.com/intent/tweet?text=...&url=...
#    - Verify: Title and URL populated
# 4. Click LinkedIn button
#    - Expected: Opens linkedin.com/sharing/share-offsite?url=...
#    - Verify: URL populated
# 5. Click Copy Link button
#    - Expected: "✓ Copied" confirmation for 2 seconds
#    - Verify: navigator.clipboard.writeText() called
#    - Test paste: Should be full post URL

# Mobile Safari/Chrome:
# 1. Same post on mobile device
# 2. Verify Web Share API button appears
# 3. Click share icon
#    - Expected: Native share sheet opens
#    - Options: Messages, Mail, Twitter, etc.
#    - Verify: Title and URL pre-filled

# Fallback test (unsupported clipboard API)
# 1. Open DevTools > Console
# 2. Run: Object.defineProperty(navigator, 'clipboard', { value: null })
# 3. Click Copy Link button
# 4. Expected: Fallback UI shows "Press Ctrl+C to copy"
# 5. Verify: URL pre-selected in text input
```

## Scenario 6: Prev/Next Navigation

```bash
# Verify chronological ordering
# 1. Get all post dates
cat content/posts/*.mdx | grep "^date:" | sort

# 2. Open middle post (not first, not last)
# Example: http://localhost:3000/blog/interactive-mdx-demo

# 3. Scroll to bottom of post
# Expected: Both "← Previous" and "Next →" buttons visible

# 4. Click "← Previous"
# Expected: Navigate to post with next-older date

# 5. Go back, click "Next →"
# Expected: Navigate to post with next-newer date

# Edge case: First post (oldest)
# 1. Open oldest post by date
# Expected: Only "Next →" button visible
# Expected: No "← Previous" button

# Edge case: Last post (newest)
# 1. Open newest post by date
# Expected: Only "← Previous" button visible
# Expected: No "Next →" button
```

## Scenario 7: Breadcrumbs

```bash
# Test breadcrumb variations

# Case 1: Direct post access
# 1. Open: http://localhost:3000/blog/welcome-to-mdx
# Expected breadcrumbs: Home > Blog > Welcome to MDX
# Verify: "Home" links to /, "Blog" links to /blog

# Case 2: Access from tag page
# 1. Open: http://localhost:3000/blog/tag/mdx
# 2. Click on a post
# 3. Check URL: Should have ?from=tag/mdx query param
# Expected breadcrumbs: Home > Blog > MDX > [Post Title]
# Verify: Tag segment links to /blog/tag/mdx

# Case 3: Direct access with query param
# 1. Manually construct: http://localhost:3000/blog/welcome-to-mdx?from=tag/tutorial
# Expected breadcrumbs: Home > Blog > Tutorial > Welcome to MDX

# Validation: BreadcrumbList schema
# 1. View page source
# 2. Search for BreadcrumbList schema
# 3. Verify:
#    - @type: "BreadcrumbList"
#    - itemListElement array with correct positions (1, 2, 3...)
#    - Each item has name and url
```

## Scenario 8: Accessibility Validation

```bash
# Keyboard navigation test
# 1. Open any blog post
# 2. Press Tab repeatedly
# Expected tab order:
#    - Skip to content link
#    - Share buttons (Twitter, LinkedIn, Copy)
#    - TOC links (if present)
#    - Breadcrumb links
#    - Tag links
#    - Related post links
#    - Prev/Next buttons
# Verify: All interactive elements focusable
# Verify: Focus visible with outline

# Screen reader test (NVDA on Windows, VoiceOver on Mac)
# 1. Enable screen reader
# 2. Navigate through post
# Expected announcements:
#    - "Article, [Post Title]"
#    - "Navigation, table of contents"
#    - "Button, Share on Twitter"
#    - "Link, related post: [title]"
#    - "Navigation, breadcrumbs"

# Lighthouse accessibility audit
# 1. Open DevTools > Lighthouse
# 2. Select "Accessibility" category
# 3. Run audit
# Expected score: ≥95
# Check for:
#    - ARIA labels on buttons
#    - Alt text on images
#    - Heading hierarchy (H1 > H2 > H3)
#    - Color contrast ratios ≥4.5:1
```

## Scenario 9: Performance Validation

```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build -- --analyze  # If webpack-bundle-analyzer installed

# Check impact of enhancements
# Before: Check baseline bundle size
# After: Verify increase <10KB for TOC + social sharing

# Lighthouse performance audit
# 1. Production build: npm run start
# 2. Open DevTools > Lighthouse
# 3. Run "Performance" audit
# Expected:
#    - Performance score: ≥85
#    - FCP: <1.5s
#    - LCP: <2.5s
#    - CLS: <0.15
#    - Total Blocking Time: <300ms

# Verify client-side hydration
# 1. Disable JavaScript in DevTools
# 2. Reload page
# Expected: Content still visible (SSR working)
# Expected: TOC not functional (client-only)
# Expected: Share buttons disabled

# Re-enable JavaScript
# Expected: TOC becomes interactive
# Expected: Share buttons work
```

