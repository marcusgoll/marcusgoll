# Feature: SEO & Analytics Infrastructure

## Overview

Implementation of comprehensive SEO and analytics infrastructure for discoverability and performance tracking. This feature establishes the foundation for search engine optimization and user behavior analytics across the website.

## Feature Classification

- **HAS_UI**: false (infrastructure only, no user-facing UI components)
- **IS_IMPROVEMENT**: false (new infrastructure, not improving existing functionality)
- **HAS_METRICS**: true (analytics tracking is core feature)
- **HAS_DEPLOYMENT_IMPACT**: true (requires environment variables, next.config changes, potential edge middleware)

**Research Depth**: Standard (3-5 tools) - FLAG_COUNT = 2

## Research Findings

### Constitution Compliance

- **Reference**: `.spec-flow/memory/constitution.md`
- **Performance Requirements**: API responses <200ms p50, <500ms p95; Page loads <2s FCP, <3s LCP
- **Accessibility**: WCAG 2.1 Level AA compliance required
- **Security**: Secrets (GA4 IDs) must be in environment variables, never committed
- **Brand Alignment**: Systematic clarity principle applies - meta descriptions must be clear and concise

### Existing Codebase Patterns

No existing SEO or analytics infrastructure found in current codebase.

**Tech Stack** (from package.json):
- Next.js 15.5.6
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.15

**Note**: No `next-seo`, `next-sitemap`, or analytics packages currently installed.

### Similar Features

Reviewed existing specs:
- `specs/001-environment-manageme/spec.md` - Environment variable management patterns
- `specs/002-ghost-cms-migration/spec.md` - CMS integration patterns
- `specs/003-individual-post-page/spec.md` - Page-level implementation patterns

### GitHub Issue Context

**Issue #35**: SEO & Analytics Infrastructure
- **ICE Score**: 1.80 (Impact: 4, Effort: 2, Confidence: 0.9)
- **Area**: marketing
- **Role**: all
- **Priority**: high
- **Size**: small
- **Status**: in-progress
- **Blocked by**: #33 (blog-infrastructure) - Requires blog pages to optimize

**Related Issues**:
- #13: Meta Tags & Open Graph
- #14: JSON-LD Structured Data
- #17: Sitemap Generation

## Key Decisions

### 1. SEO Package Selection

**Decision**: Use `next-seo` for meta tag management

**Rationale**:
- Industry standard for Next.js applications
- Supports all required meta tag types (title, description, Open Graph, Twitter Cards)
- JSON-LD schema support built-in
- Well-maintained with strong TypeScript support
- Simplifies meta tag management across pages

**Alternative Considered**: Custom meta components
- More flexibility but higher maintenance burden
- Reinventing well-solved problem violates "Do Not Overengineer" principle

### 2. Sitemap Generation

**Decision**: Use `next-sitemap` for automated sitemap.xml generation

**Rationale**:
- Integrates seamlessly with Next.js build process
- Supports dynamic routes and post-build sitemap generation
- Handles robots.txt generation
- Configuration-driven approach aligns with systematic clarity principle

### 3. Analytics Platform

**Decision**: Implement Google Analytics 4 (GA4) via `@next/third-parties`

**Rationale**:
- GA4 is industry standard for web analytics
- Next.js official `@next/third-parties` package optimizes loading
- Dual instrumentation strategy: PostHog for dashboards + structured logs for Claude measurement
- Custom event tracking enables detailed user behavior analysis

**Secondary**: Consider Vercel Analytics as optional enhancement (non-blocking)

### 4. LLM-Friendly Markup

**Decision**: Implement semantic HTML5 + schema.org JSON-LD

**Rationale**:
- Semantic HTML (article, section, nav, etc.) provides structural context
- JSON-LD structured data makes content machine-readable
- Benefits both traditional search engines and LLM crawlers
- Aligns with teaching-first content principle (clear information hierarchy)

### 5. AI Crawler Configuration

**Decision**: Add AI-specific robots.txt directives

**Rationale**:
- Control which content AI crawlers can access
- Differentiate between public blog content (allow) and private areas (disallow)
- Future-proof for emerging AI crawler standards

**Crawlers to Configure**:
- GPTBot (OpenAI)
- Google-Extended (Google Bard/Gemini)
- ClaudeBot (Anthropic)
- CCBot (Common Crawl)

### 6. Newsletter Conversion Tracking

**Decision**: Implement custom GA4 events for newsletter signups

**Rationale**:
- Enables measurement of content → subscriber funnel
- Tracks which articles drive highest conversion
- Informs content strategy with data

**Events**:
- `newsletter_view` - Form displayed
- `newsletter_submit` - Form submitted
- `newsletter_success` - Confirmed subscription

### 7. Environment Variable Strategy

**Decision**: Use `NEXT_PUBLIC_GA_MEASUREMENT_ID` for client-side analytics

**Rationale**:
- GA4 requires client-side tracking
- NEXT_PUBLIC_ prefix makes it available in browser
- Non-sensitive ID (public tracking ID)
- Follows Next.js conventions

## System Components Analysis

**N/A** - No UI components (infrastructure only)

## Deployment Considerations

### Platform Dependencies

**Vercel** (primary deployment platform):
- No edge middleware changes required
- `next.config.js` updates for `@next/third-parties`
- Build-time sitemap generation via `postbuild` script

**Dependencies to Add**:
- `next-seo` (SEO meta tag management)
- `next-sitemap` (sitemap.xml generation)
- `@next/third-parties` (optimized GA4 loading)

### Environment Variables

**New Required Variables**:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
  - Staging: `G-STAGING123` (separate GA4 property for testing)
  - Production: `G-PRODUCTION456` (production GA4 property)

**Note**: GA4 tracking ID is public (appears in client-side code), so it's safe to use NEXT_PUBLIC_ prefix

### Breaking Changes

**None** - This is additive infrastructure with no breaking API changes

### Migration Requirements

**No database migrations** - Analytics is client-side only

**Configuration Files**:
- Create `next-sitemap.config.js` for sitemap generation
- Update `next.config.js` to include sitemap postbuild script
- Create `public/robots.txt` with AI crawler directives

### Rollback Considerations

**Standard Rollback**: Yes - 3-command rollback via git revert

**Risk Level**: Low
- Purely additive changes
- No database schema modifications
- Client-side only (no server-side dependencies)
- Can disable GA4 via environment variable removal

## Assumptions

### Performance Targets

**Assumed** (from constitution.md defaults):
- Meta tag injection adds <5ms to SSR time
- GA4 script loads asynchronously (non-blocking)
- JSON-LD schema adds <1KB per page
- Sitemap generation <30s build time for 1000 pages

**Assumption**: Standard Next.js performance expectations applied. If metrics show degradation, optimize in follow-up iteration.

### SEO Best Practices

**Assumed Industry Standards**:
- Meta title: 50-60 characters
- Meta description: 150-160 characters
- Open Graph images: 1200×630px
- JSON-LD schema: Use schema.org Article type for blog posts

### Analytics Data Retention

**Assumed** (from constitution defaults):
- GA4 default retention: 14 months
- Custom events: No PII collection
- IP anonymization enabled

## Blocked By

**Issue #33**: blog-infrastructure
- This feature requires blog pages to exist for SEO optimization
- Meta tags, structured data, and sitemap rely on blog post routes
- **Workaround**: Implement infrastructure now, activate when blog pages ship

## Checkpoints

- Phase 0 (Specification): 2025-10-22

## Last Updated

2025-10-22T18:30:00Z
