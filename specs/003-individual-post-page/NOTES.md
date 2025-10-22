# Feature: Individual Post Pages (Dynamic Routes)

## Overview

**Feature Type**: Enhancement to existing feature 002-tech-stack-cms-integ

**Current State**: Individual blog post pages exist at `/blog/[slug]` with:
- Dynamic routing and static generation
- MDX rendering with syntax highlighting
- SEO metadata (OG tags, Twitter cards)
- Featured images, author, date, reading time, tags

**Enhancements Proposed**:
- Related posts/suggested reading (tag-based algorithm)
- Table of contents for long-form posts (H2/H3 headings)
- Social sharing buttons (Twitter, LinkedIn, Copy Link)
- Schema.org structured data (BlogPosting schema)
- Previous/Next post navigation (chronological)
- Breadcrumb navigation (Home > Blog > [Tag] > Post)

**Priority**: MVP = Related posts + Prev/Next + Schema.org
**Total Effort**: ~22-30 hours (M-L feature)

## Research Findings
[Populated during research phase]

## System Components Analysis
[Populated during system component check]

## Checkpoints
- Phase 0 (Spec-flow): 2025-10-22

## Last Updated
2025-10-22T00:00:00Z

## Feature Classification
- UI screens: true
- Improvement: false
- Measurable: false
- Deployment impact: false

## Research Findings

### Finding 1: Individual post pages already implemented in feature 002
- Source: app/blog/[slug]/page.tsx (lines 1-153)
- Implemented features:
  - Dynamic routing with `generateStaticParams()`
  - MDX content rendering with next-mdx-remote
  - SEO metadata generation (title, description, OG tags, Twitter cards)
  - Featured image display with Next.js Image
  - Author, date, reading time metadata
  - Tag links to `/blog/tag/[tag]`
  - Syntax highlighting (rehype-highlight)
  - GitHub Flavored Markdown support (remark-gfm)
- Decision: This feature is an ENHANCEMENT to existing implementation

### Finding 2: Existing MDX infrastructure
- Source: lib/mdx.ts (lines 1-192)
- Functions available:
  - `getAllPosts()` - Get all posts sorted by date
  - `getPostBySlug()` - Get single post with frontmatter validation
  - `getPostsByTag()` - Filter posts by tag
  - `getAllTags()` - Get tag list with counts
  - `searchPosts()` - Search by title, excerpt, tags
- Decision: Solid foundation for enhancements

### Finding 3: Available MDX components
- Source: components/mdx/mdx-components.tsx
- Existing components:
  - CodeBlock - Syntax highlighted code
  - Callout - Info/warning/error alerts
  - Demo - Interactive demo component
  - MDXImage - Optimized images
- Decision: Component system ready for additional interactive elements

### Finding 4: Tech stack (Next.js 15.5.6, React 19, MDX 3.1)
- Source: package.json
- Modern stack with:
  - App Router (Next.js 15+)
  - React Server Components
  - TypeScript
  - Tailwind CSS 4.1
  - Zod for validation
- Decision: Latest tech enables advanced features

### Finding 5: Blog structure from feature 002 spec
- Source: specs/002-tech-stack-cms-integ/spec.md
- Priority 3 features NOT YET implemented:
  - US6: Automatic Table of Contents (P3)
  - US7: Scheduled posts (P3)
- Potential enhancements not in original spec:
  - Related posts / suggested reading
  - Social share buttons
  - Comments integration
  - Prev/Next post navigation
  - Breadcrumbs
  - Schema.org structured data (Article, BlogPosting)
- Decision: Multiple enhancement opportunities available
