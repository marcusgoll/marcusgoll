# Feature: Meta Tags & Open Graph

## Overview

Comprehensive meta tags and Open Graph protocol implementation for all pages to optimize social sharing and SEO. This feature extends existing metadata implementation on blog posts to cover all site pages (homepage, aviation, dev-startup, tag pages, newsletter) with complete Open Graph and Twitter Card support.

## Research Findings

### Existing Implementation Analysis

**Current State** (from `app/blog/[slug]/page.tsx`):
- Blog posts already have comprehensive metadata (lines 72-127)
- Implementation uses Next.js 15 Metadata API
- Open Graph tags implemented for article type
- Twitter Cards implemented (summary_large_image)
- Dynamic metadata from MDX frontmatter working
- Featured images with proper dimensions (1200x630)

**Gaps Identified**:
1. Root layout has minimal metadata (only title/description)
2. No Open Graph tags in root layout
3. Section pages (aviation, dev-startup) lack metadata
4. Tag pages lack metadata
5. Newsletter page lacks metadata
6. No fallback OG image for pages without featured images
7. Homepage lacks proper Open Graph tags

**Sources**:
- `app/layout.tsx` (lines 9-17) - Basic metadata only
- `app/blog/[slug]/page.tsx` (lines 72-127) - Full metadata implementation
- GitHub Issue #13 - Feature requirements

### Tech Stack Validation

**From `docs/project/tech-stack.md`**:
- Next.js 15.5.6 with App Router (confirmed)
- Next.js Metadata API is the standard approach (not next-seo)
- TypeScript 5.9.3 for type safety
- Self-hosted on Hetzner VPS with Caddy (auto SSL/TLS)

**Implementation Approach**:
- Use Next.js built-in Metadata API (`generateMetadata` function)
- Type-safe with TypeScript interfaces
- Server-side metadata generation (no client-side overhead)

### Brand Standards

**From `.spec-flow/memory/constitution.md`**:
- Brand colors: Navy 900 #0F172A (primary), Emerald 600 #059669 (secondary)
- Typography: Work Sans (headings/body), JetBrains Mono (code)
- Brand mission: "I help pilots advance their aviation careers and teach developers to build with systematic thinking—bringing discipline, clarity, and proven teaching methods to everything I create."
- Dual-track content strategy: 40% aviation, 40% dev/startup, 20% cross-pollination

**OG Image Requirements**:
- Dimensions: 1200x630px (standard)
- Brand colors: Navy 900 background, Emerald 600 accents
- Typography: Work Sans for text
- Include logo/brand identifier

### Industry Best Practices

**Open Graph Protocol**:
- `og:title` - Page title (50-60 chars optimal)
- `og:description` - Page description (150-200 chars optimal)
- `og:image` - Image URL (1200x630px minimum)
- `og:url` - Canonical URL
- `og:type` - Content type (website, article, profile)
- `og:site_name` - Site name
- `og:locale` - Language locale (en_US)

**Twitter Cards**:
- `twitter:card` - Card type (summary_large_image)
- `twitter:site` - Site Twitter handle
- `twitter:creator` - Creator Twitter handle
- `twitter:title` - Title (max 70 chars)
- `twitter:description` - Description (max 200 chars)
- `twitter:image` - Image URL (1200x630px)

**Article-Specific** (already implemented for blog posts):
- `article:published_time` - ISO 8601 date
- `article:author` - Author name
- `article:tag` - Content tags

## System Components Analysis

**Reusable (from existing implementation)**:
- Next.js Metadata API pattern (from `app/blog/[slug]/page.tsx`)
- Image optimization with next/image
- Type-safe metadata interfaces (from `next`)

**New Components Needed**:
- Default OG image generator utility (or static default image)
- Metadata helper functions for consistent metadata across pages
- Type definitions for shared metadata properties

**Rationale**: Extend existing blog post pattern to all pages, ensuring consistency and maintainability.

## Feature Classification

- UI screens: false (metadata only, no visual UI changes)
- Improvement: true (enhancing SEO and social sharing for existing pages)
- Measurable: true (SEO metrics, social share click-through rates)
- Deployment impact: false (no infrastructure changes, code-only)

## Checkpoints

- Phase 0 (Spec): 2025-10-29

## Last Updated

2025-10-29T02:15:00Z

## Phase 2: Tasks (2025-10-29 02:45)

**Summary**:
- Total tasks: 32
- User story tasks: 20 (US1: 7, US2: 6, US3: 1, US4: 2, US5: 4)
- Parallel opportunities: 26 tasks marked [P]
- Setup tasks: 2
- Task file: specs/053-meta-tags-open-graph/tasks.md

**Task Breakdown**:
- Phase 1 (Setup): 2 tasks - Directory structure, environment variables
- Phase 2 (Foundational): 1 task - Default OG image creation
- Phase 3 (US1 - Open Graph): 7 tasks - Add OG tags to all pages
- Phase 4 (US2 - Twitter Cards): 6 tasks - Add Twitter metadata to all pages
- Phase 5 (US3 - Default Image): 1 task - Verify default OG image
- Phase 6 (US4 - Helper Utils): 2 tasks - Extract shared utilities (optional)
- Phase 7 (US5 - Section Images): 4 tasks - Create section-specific OG images (optional)
- Phase 8 (Polish): 9 tasks - Validation, testing, deployment prep

**MVP Strategy**:
- Ship Phases 1-5 (US1, US2, US3) first: 17 tasks
- All pages get OG tags, Twitter Cards, and default image
- Validate via LinkedIn Post Inspector, Twitter Card Validator, Facebook Sharing Debugger
- Optional: Add US4 (helper utilities) and US5 (section images) if time permits

**Checkpoint**:
- ✅ Tasks generated: 32
- ✅ User story organization: Complete (organized by US1-US5)
- ✅ Dependency graph: Created (foundational → US1 → US2 → US3)
- ✅ MVP strategy: Defined (US1-US3 for first release)
- 📋 Ready for: /analyze

