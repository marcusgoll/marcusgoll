# Feature: Image Optimization (Next.js Image)

## Overview
Implementation of Next.js Image component for optimized image delivery, improving performance through automatic optimization, lazy loading, and responsive image sizing.

## Research Findings

### Current State Analysis
- **Existing Usage**: Next.js Image component is ALREADY used in 21 files across the codebase
- **Components Using Next.js Image**:
  - `PostCard.tsx`: Featured images with fill layout, responsive sizes
  - `MagazineMasonry.tsx`: Hero and masonry grid images with width/height
  - `MDXImage.tsx`: Custom component for MDX images with automatic optimization
  - `Sidebar.tsx`, `FeaturedPostsSection.tsx`: Additional usages

- **Current Implementation Quality**:
  - ✅ Using next/image (not img tags)
  - ✅ Responsive sizes defined
  - ✅ Priority prop on hero images
  - ✅ Aspect ratios preserved
  - ⚠️ External images fall back to img tags (MDXImage.tsx:44-49)
  - ⚠️ Inconsistent sizing patterns across components
  - ⚠️ Missing placeholder configuration

### GitHub Issue #26 Requirements
From issue body:
- ICE Score: 2.50 (HIGH priority)
- Impact: 5/5 (Critical for performance and Core Web Vitals)
- Effort: 2/5 (Straightforward)
- **All implementation checkboxes already marked complete in issue**
- Acceptance criteria defined but NOT checked off
- Target: LCP < 2.5s, CLS < 0.1

### Project Context
From constitution.md:
- **Performance Requirements** (lines 550-562):
  - Page loads: <2s First Contentful Paint, <3s Largest Contentful Paint
  - Define thresholds in spec, measure in /optimize phase
  - Use Lighthouse, Web Vitals for validation

- **Accessibility Standards** (lines 565-578):
  - WCAG 2.1 Level AA required
  - Alt text mandatory for all images
  - Semantic HTML required

From package.json:
- Next.js version: 15.5.6 (latest)
- React 19.2.0
- No image-specific dependencies besides Next.js built-in

### Technical Analysis
**What Still Needs to be Done**:
1. **Configuration Optimization**: Add next.config.js image optimization settings
2. **Placeholder Strategy**: Implement blur placeholders consistently
3. **External Image Support**: Configure remotePatterns for external domains
4. **Performance Validation**: Measure and document actual LCP/CLS metrics
5. **Standardization**: Create consistent sizing patterns across components
6. **Alt Text Audit**: Verify all images have descriptive alt text

**Not a Greenfield Implementation**: This is an IMPROVEMENT feature (HAS_OPTIMIZATION_OPPORTUNITY=true)

## System Components Analysis

### Reusable Components
From codebase scan:
- **MDXImage** (`components/mdx/mdx-image.tsx`): Custom wrapper for MDX images
  - Current: Handles local/external images with fallback
  - Improvement needed: External image optimization, consistent placeholders

- **PostCard** (`components/blog/PostCard.tsx`): Blog post card with featured image
  - Current: Uses fill layout with responsive sizes
  - Good pattern to replicate elsewhere

- **MagazineMasonry** (`components/home/MagazineMasonry.tsx`): Magazine-style grid
  - Current: Uses width/height with priority on hero
  - Inconsistent with PostCard's fill approach

### New Components Needed
- None (optimize existing patterns)

### Rationale
System is already using Next.js Image component. This is a refinement and standardization effort, not a new implementation.

## Feature Classification
- UI screens: true
- Improvement: true
- Measurable: false
- Deployment impact: false

## Checkpoints
- Phase 0 (Spec): 2025-10-28

## Last Updated
2025-10-28T21:45:00Z
