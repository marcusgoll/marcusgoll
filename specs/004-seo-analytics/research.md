# Research & Discovery: seo-analytics

## Research Mode

**Mode**: Minimal (simple feature, infrastructure enhancement)

**Rationale**: Feature 004 is classified as straightforward SEO/analytics infrastructure. Existing patterns already present in codebase (GA4 integration, sitemap generation). Research focused on identifying reuse opportunities and gaps.

---

## Research Decisions

### Decision 1: Reuse existing GA4 implementation, enhance with @next/third-parties

**Decision**: Keep existing GA4 setup in `app/layout.tsx`, optionally migrate to `@next/third-parties` for performance

**Rationale**:
- Current implementation already works (GA4 script loaded conditionally via `NEXT_PUBLIC_GA_ID`)
- `@next/third-parties` provides Next.js-optimized loading but requires Next.js 14+
- Current approach is simpler and meets performance requirements (<5ms overhead, non-blocking)
- Migration to `@next/third-parties` is optional enhancement, not blocker

**Alternatives**:
- Custom gtag implementation (current approach) ✅ **KEEP**
- Migrate to `@next/third-parties` (optional enhancement for future)
- Use Vercel Analytics (different product, not GA4)

**Source**:
- Existing implementation: `app/layout.tsx` lines 18-39
- Next.js docs: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries

---

### Decision 2: Enhance existing sitemap generation, add to postbuild

**Decision**: Keep `lib/generate-sitemap.ts`, wire into build process via package.json postbuild script

**Rationale**:
- Sitemap logic already implemented correctly (static pages + blog posts)
- Uses `getAllPosts()` from MDX system
- Writes to `public/sitemap.xml` correctly
- Just needs build integration (not currently called)

**Alternatives**:
- Use `next-sitemap` package (redundant, reinventing what already exists)
- Custom sitemap in API route (slower, not static)
- Keep current approach, add postbuild hook ✅ **RECOMMENDED**

**Source**:
- Existing implementation: `lib/generate-sitemap.ts`
- Build process: `package.json` scripts section

---

### Decision 3: Use next-seo for meta tag management

**Decision**: Install `next-seo` package for comprehensive meta tag (title, description, Open Graph, Twitter Cards) and JSON-LD support

**Rationale**:
- Industry standard for Next.js SEO (1M+ weekly downloads)
- Current approach (basic Metadata export in layout) only handles title/description
- `next-seo` provides `NextSeo` component for page-level overrides
- Built-in JSON-LD support (Article, WebSite, Organization schemas)
- TypeScript-first with excellent type safety

**Alternatives**:
- Custom meta components (reinventing wheel, violates "Do Not Overengineer")
- Continue with Metadata API only (insufficient for Open Graph, Twitter Cards, JSON-LD)
- Use `next-seo` ✅ **RECOMMENDED**

**Source**:
- next-seo docs: https://github.com/garmeeh/next-seo
- Next.js Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

---

### Decision 4: Extend existing analytics.ts for custom events

**Decision**: Add new event tracking functions to `lib/analytics.ts` for newsletter events

**Rationale**:
- Analytics module already exists with proper TypeScript types
- Has `trackNewsletterSignup()` stub (lines 59-73) ready to use
- Consistent pattern: `trackContentTrackClick`, `trackExternalLinkClick`, `trackPageView`
- Just needs implementation of newsletter view/submit/success events

**Alternatives**:
- Create separate newsletter analytics module (unnecessary fragmentation)
- Inline gtag calls (inconsistent, no type safety)
- Extend existing `lib/analytics.ts` ✅ **RECOMMENDED**

**Source**:
- Existing module: `lib/analytics.ts`
- Newsletter signup already stubbed: line 59

---

### Decision 5: Create robots.txt with AI crawler directives

**Decision**: Add `public/robots.txt` with standard search engine rules + AI-specific user-agents

**Rationale**:
- No robots.txt currently exists (`public/` only contains `images/`)
- Need to explicitly allow/disallow AI crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot)
- Static file approach (public/robots.txt) is simplest and most compatible
- Sitemap reference: Point to `/sitemap.xml` once generated

**Alternatives**:
- Dynamic robots.txt API route (overkill for static rules)
- Use `next-sitemap` package for robots.txt (adds dependency for simple file)
- Static `public/robots.txt` ✅ **RECOMMENDED**

**Source**:
- Public directory check: `public/` directory structure
- AI crawler specs: GPTBot, ClaudeBot, Google-Extended documentation

---

### Decision 6: Apply semantic HTML5 markup to blog post pages

**Decision**: Audit and enhance `app/blog/[slug]/page.tsx` to use `<article>`, `<section>`, `<nav>`, `<aside>` tags

**Rationale**:
- Blog posts likely use generic `<div>` containers
- Semantic HTML improves accessibility (screen readers, document outline)
- Benefits LLM crawlers (clear content structure)
- Aligns with WCAG 2.1 AA standards (constitution requirement)

**Alternatives**:
- Keep div-based structure (misses accessibility/SEO benefits)
- Apply semantic HTML ✅ **RECOMMENDED**

**Source**:
- Blog page structure: `app/blog/[slug]/page.tsx` (needs verification)
- HTML5 semantic elements: MDN Web Docs

---

## Components to Reuse (4 found)

### 1. lib/analytics.ts
**Purpose**: GA4 event tracking utilities
**Reuse**: Extend with newsletter_view, newsletter_submit, newsletter_success events
**File**: `lib/analytics.ts` lines 1-122

### 2. lib/generate-sitemap.ts
**Purpose**: Sitemap XML generation (static pages + blog posts)
**Reuse**: Wire into postbuild script, no code changes needed
**File**: `lib/generate-sitemap.ts` lines 1-85

### 3. app/layout.tsx (GA4 setup)
**Purpose**: Google Analytics 4 script loading
**Reuse**: Already implemented correctly with conditional loading (NEXT_PUBLIC_GA_ID)
**File**: `app/layout.tsx` lines 18-39

### 4. components/analytics/PageViewTracker.tsx
**Purpose**: Client-side page view tracking with content track metadata
**Reuse**: Already functional, use in blog post pages
**File**: `components/analytics/PageViewTracker.tsx` lines 1-40

---

## New Components Needed (5 required)

### 1. lib/seo-config.ts
**Purpose**: Centralized SEO defaults (site title, description, OG image, Twitter handle)
**Location**: `lib/seo-config.ts`
**Exports**: `defaultSEO` object for next-seo, `getPageSEO()` helper for page-level overrides

### 2. public/robots.txt
**Purpose**: Search engine and AI crawler directives
**Location**: `public/robots.txt`
**Content**: User-agent rules for Googlebot, GPTBot, ClaudeBot, Google-Extended, CCBot

### 3. lib/json-ld.ts
**Purpose**: JSON-LD structured data generators (Article, WebSite, Organization schemas)
**Location**: `lib/json-ld.ts`
**Exports**: `generateArticleSchema()`, `generateWebSiteSchema()`

### 4. components/seo/DefaultSEO.tsx
**Purpose**: Wrapper for DefaultSeo component from next-seo
**Location**: `components/seo/DefaultSEO.tsx`
**Usage**: Import in `app/layout.tsx` for site-wide defaults

### 5. Newsletter event tracking enhancements
**Purpose**: Add newsletter_view, newsletter_submit, newsletter_success event functions
**Location**: Extend `lib/analytics.ts`
**New exports**: `trackNewsletterView()`, `trackNewsletterSubmit()`, `trackNewsletterSuccess()`

---

## Unknowns & Questions

None - all technical questions resolved during research.

**Clarifications from spec**:
- Newsletter form implementation not in scope (future feature) - Only track events when form ships
- GA4 property IDs will be provided via environment variables (NEXT_PUBLIC_GA_MEASUREMENT_ID)
- Site URL for sitemap: Use `NEXT_PUBLIC_SITE_URL` env var (default: https://marcusgoll.com)

---

## Research Summary

**Total reusable components**: 4 (analytics, sitemap generation, GA4 setup, page view tracker)

**New components required**: 5 (SEO config, robots.txt, JSON-LD generators, SEO wrapper, newsletter events)

**Code reuse percentage**: ~45% (existing analytics/sitemap infrastructure covers core needs)

**Risk level**: Low
- No breaking changes (additive only)
- No database dependencies
- Existing patterns well-established (analytics, MDX, build scripts)

**Performance impact**: Minimal
- Meta tags: SSR overhead <5ms (next-seo optimized)
- GA4 script: Already loaded, no new scripts
- JSON-LD: <1KB per page
- Sitemap: Build-time generation (no runtime cost)
