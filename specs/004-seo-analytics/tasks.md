# Tasks: SEO & Analytics Infrastructure

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\coding\tech-stack-foundation-core

[EXISTING - REUSE]
- ✅ lib/analytics.ts - GA4 event tracking utilities (lines 1-122)
- ✅ lib/generate-sitemap.ts - Sitemap XML generation (lines 1-85)
- ✅ app/layout.tsx - GA4 script loading setup (lines 18-39)
- ✅ components/analytics/PageViewTracker.tsx - Page view tracking component (lines 1-40)

[NEW - CREATE]
- 🆕 lib/seo-config.ts - Centralized SEO defaults and configuration
- 🆕 lib/json-ld.ts - JSON-LD schema generators for Article and WebSite
- 🆕 components/seo/DefaultSEO.tsx - Site-wide SEO wrapper component
- 🆕 public/robots.txt - AI crawler directives (GPTBot, ClaudeBot, etc.)
- 🆕 Newsletter event tracking functions (extend lib/analytics.ts)

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (install dependencies, no blocking)
2. Phase 2: Foundational (SEO config + DefaultSEO component, blocks US1-US3)
3. Phase 3: US1 [P1] - Meta tags (independent after Phase 2)
4. Phase 4: US2 [P1] - Open Graph tags (independent after Phase 2)
5. Phase 5: US3 [P1] - Sitemap automation (independent after Phase 2)
6. Phase 6: US4 [P1] - GA4 verification (independent, already exists)
7. Phase 7: US5 [P2] - JSON-LD structured data (depends on US1, US2)
8. Phase 8: US6 [P2] - Newsletter events (depends on US4)
9. Phase 9: US7 [P3] - robots.txt (depends on US3)
10. Phase 10: US8 [P3] - Semantic HTML (independent, blog post enhancement)

## [PARALLEL EXECUTION OPPORTUNITIES]
- Setup: T001, T002, T003 (dependency install, config files, verification)
- US1+US2: T008, T009, T010, T011, T012, T013 (different pages, no dependencies)
- US5: T018, T019, T020 (different schema types, independent files)
- Polish: T024, T025, T026 (different files, no dependencies)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phase 3-6 (US1-US4) - Core SEO and analytics infrastructure
**Incremental delivery**: US1-US4 → staging validation → US5-US6 → US7-US8
**Testing approach**: Manual validation (Google Rich Results Test, GA4 DebugView, Lighthouse CI)

---

## Phase 1: Setup

- [ ] T001 Install next-seo dependency for meta tag management
  - Command: `pnpm add next-seo@^6.5.0`
  - Verify: Check package.json for next-seo entry
  - From: plan.md [ARCHITECTURE DECISIONS] lines 49-51

- [ ] T002 [P] Verify environment variables configured
  - Files: .env.local (local), Vercel dashboard (staging/production)
  - Required: NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_SITE_URL
  - Staging: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-STAGING123, NEXT_PUBLIC_SITE_URL=https://app-staging.cfipros.vercel.app
  - Production: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PRODUCTION456, NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
  - From: plan.md [CI/CD IMPACT] lines 241-256

- [ ] T003 [P] Add postbuild script to package.json for sitemap generation
  - File: package.json
  - Add: `"postbuild": "tsx lib/generate-sitemap.ts"`
  - Requires: tsx package (install if missing: `pnpm add -D tsx`)
  - From: plan.md [CI/CD IMPACT] lines 264-267

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Core SEO infrastructure that all user stories depend on

- [ ] T004 Create lib/seo-config.ts with site-wide SEO defaults
  - File: lib/seo-config.ts
  - Exports: defaultSEO (object), getPageSEO(overrides) (helper function)
  - Config: Site title, description, OG image URL, Twitter handle, canonical URL
  - Size: ~50-80 lines
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 194-199

- [ ] T005 Create components/seo/DefaultSEO.tsx wrapper component
  - File: components/seo/DefaultSEO.tsx
  - Purpose: Wrap next-seo DefaultSeo component with site-wide defaults
  - Imports: DefaultSeo from next-seo, defaultSEO from lib/seo-config.ts
  - Size: ~30-50 lines
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 213-219

- [ ] T006 Add DefaultSEO component to app/layout.tsx
  - File: app/layout.tsx
  - Import: DefaultSEO from components/seo/DefaultSEO.tsx
  - Place: Inside RootLayout, before {children}
  - REUSE: Existing GA4 setup in app/layout.tsx (lines 18-39)
  - Pattern: app/layout.tsx structure
  - From: plan.md [IMPLEMENTATION SEQUENCE] lines 433-434

---

## Phase 3: User Story 1 [P1] - Meta tags on all pages

**Story Goal**: Every page has unique meta title and description for search indexing

**Independent Test Criteria**:
- [ ] View page source on homepage, blog index, blog post
- [ ] Verify `<title>` and `<meta name="description">` tags present
- [ ] Verify page-specific values used (not just defaults)

### Implementation

- [ ] T007 [US1] Enhance app/page.tsx with NextSeo for homepage meta tags
  - File: app/page.tsx
  - Import: NextSeo from next-seo, getPageSEO from lib/seo-config.ts
  - Meta: Title "Marcus Gollahon - Aviation CFI & Startup Builder", Description "Aviation instructor and software engineer..."
  - Size: Add ~10-15 lines
  - From: spec.md US1 (lines 39-42), plan.md [IMPLEMENTATION SEQUENCE] line 435

- [ ] T008 [P] [US1] Enhance app/blog/page.tsx with NextSeo for blog index
  - File: app/blog/page.tsx
  - Import: NextSeo from next-seo, getPageSEO from lib/seo-config.ts
  - Meta: Title "Blog - Marcus Gollahon", Description "Insights on aviation training and startup development..."
  - Size: Add ~10-15 lines
  - Pattern: app/page.tsx (T007)
  - From: spec.md US1 (lines 39-42), plan.md [IMPLEMENTATION SEQUENCE] line 436

- [ ] T009 [P] [US1] Enhance app/blog/[slug]/page.tsx with NextSeo for blog posts
  - File: app/blog/[slug]/page.tsx
  - Import: NextSeo from next-seo, getPageSEO from lib/seo-config.ts
  - Meta: Title from post.frontmatter.title, Description from post.frontmatter.excerpt
  - Dynamic: Use post frontmatter data
  - Size: Add ~15-20 lines
  - Pattern: app/blog/page.tsx (T008)
  - From: spec.md US1 (lines 39-42), plan.md [IMPLEMENTATION SEQUENCE] line 437

---

## Phase 4: User Story 2 [P1] - Open Graph and Twitter Card tags

**Story Goal**: Links shared on social media display rich previews

**Independent Test Criteria**:
- [ ] Use Twitter Card Validator (https://cards-dev.twitter.com/validator)
- [ ] Use Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/)
- [ ] Verify og:title, og:description, og:image, og:url, og:type present
- [ ] Verify twitter:card, twitter:title, twitter:description, twitter:image present

### Implementation

- [ ] T010 [P] [US2] Add Open Graph tags to homepage (app/page.tsx)
  - File: app/page.tsx (enhance T007)
  - Add to NextSeo: openGraph={{ title, description, url, type: 'website', images: [{ url: ogImageURL }] }}
  - OG Image: Use site default from lib/seo-config.ts
  - Size: Add ~8-12 lines to existing NextSeo component
  - Pattern: next-seo documentation examples
  - From: spec.md US2 (lines 44-47)

- [ ] T011 [P] [US2] Add Open Graph tags to blog index (app/blog/page.tsx)
  - File: app/blog/page.tsx (enhance T008)
  - Add to NextSeo: openGraph={{ title, description, url, type: 'website', images: [{ url: ogImageURL }] }}
  - OG Image: Use site default or blog-specific image
  - Size: Add ~8-12 lines to existing NextSeo component
  - Pattern: app/page.tsx (T010)
  - From: spec.md US2 (lines 44-47)

- [ ] T012 [P] [US2] Add Open Graph tags to blog posts (app/blog/[slug]/page.tsx)
  - File: app/blog/[slug]/page.tsx (enhance T009)
  - Add to NextSeo: openGraph={{ title, description, url, type: 'article', images: [{ url: post.frontmatter.image }] }}
  - Dynamic: Use post.frontmatter.image if available, fallback to default
  - Size: Add ~10-15 lines to existing NextSeo component
  - Pattern: app/blog/page.tsx (T011)
  - From: spec.md US2 (lines 44-47)

- [ ] T013 [P] [US2] Add Twitter Card tags to all pages with NextSeo
  - Files: app/page.tsx, app/blog/page.tsx, app/blog/[slug]/page.tsx (enhance T010-T012)
  - Add to NextSeo: twitter={{ cardType: 'summary_large_image', handle: '@marcusgoll' }}
  - Size: Add ~3-5 lines per file
  - Pattern: next-seo Twitter Card examples
  - From: spec.md US2 (lines 44-47)

---

## Phase 5: User Story 3 [P1] - Automated sitemap.xml generation

**Story Goal**: Search engines can discover all content via sitemap.xml

**Independent Test Criteria**:
- [ ] Run `pnpm build` locally
- [ ] Verify public/sitemap.xml exists
- [ ] Access /sitemap.xml in browser, verify XML is valid
- [ ] Verify all blog posts listed with `<lastmod>` dates
- [ ] Verify admin/draft pages excluded

### Implementation

- [ ] T014 [US3] Wire lib/generate-sitemap.ts into postbuild script
  - File: package.json (already added in T003)
  - Verify: Run `pnpm build`, check console for "✅ Sitemap generated successfully"
  - REUSE: lib/generate-sitemap.ts (lines 1-85, already implements sitemap generation)
  - From: spec.md US3 (lines 49-52), plan.md [IMPLEMENTATION SEQUENCE] line 438

- [ ] T015 [US3] Test sitemap generation with blog posts
  - Command: `pnpm build`
  - Verify: public/sitemap.xml contains homepage, blog index, all blog posts
  - Verify: Each entry has <loc>, <lastmod>, <changefreq>, <priority>
  - From: spec.md US3 (lines 49-52)

---

## Phase 6: User Story 4 [P1] - Google Analytics 4 tracking

**Story Goal**: Track pageviews and user behavior in GA4

**Independent Test Criteria**:
- [ ] Visit site with GA4 DebugView enabled (add `?debug_mode=true` to URL)
- [ ] Verify page_view events appear in GA4 real-time dashboard within 60 seconds
- [ ] Verify GA4 script loads asynchronously (check Network tab, no blocking)

### Implementation

- [ ] T016 [US4] Verify existing GA4 implementation in app/layout.tsx
  - File: app/layout.tsx (lines 18-39)
  - REUSE: Existing GA4 gtag.js script loading
  - Verify: Conditional loading via NEXT_PUBLIC_GA_MEASUREMENT_ID
  - Verify: Async script loading, non-blocking FCP
  - From: spec.md US4 (lines 54-57), plan.md [EXISTING INFRASTRUCTURE - REUSE] lines 175-182

- [ ] T017 [P] [US4] Add PageViewTracker to blog post pages if not present
  - File: app/blog/[slug]/page.tsx
  - Import: PageViewTracker from components/analytics/PageViewTracker.tsx
  - Usage: `<PageViewTracker track={post.frontmatter.track || 'general'} />`
  - REUSE: components/analytics/PageViewTracker.tsx (lines 1-40)
  - Pattern: app/aviation/page.tsx or app/dev-startup/page.tsx (check existing usage)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] lines 183-188

---

## Phase 7: User Story 5 [P2] - JSON-LD structured data

**Story Goal**: Search engines understand content type and authorship

**Independent Test Criteria**:
- [ ] Use Google Rich Results Test (https://search.google.com/test/rich-results)
- [ ] Enter blog post URL, verify Article schema detected
- [ ] Verify zero errors, zero warnings
- [ ] Verify author, datePublished, headline, image properties present

### Implementation

- [ ] T018 [US5] Create lib/json-ld.ts with schema generators
  - File: lib/json-ld.ts
  - Exports: generateArticleSchema(post), generateWebSiteSchema()
  - Article schema: author, datePublished, dateModified, headline, image, publisher
  - WebSite schema: name, url, description
  - Size: ~80-120 lines
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 200-206

- [ ] T019 [P] [US5] Add ArticleJsonLd to blog post pages
  - File: app/blog/[slug]/page.tsx
  - Import: ArticleJsonLd from next-seo, generateArticleSchema from lib/json-ld.ts
  - Usage: `<ArticleJsonLd {...generateArticleSchema(post)} />`
  - Size: Add ~10-15 lines
  - Pattern: next-seo ArticleJsonLd examples
  - From: spec.md US5 (lines 61-65), plan.md [IMPLEMENTATION SEQUENCE] line 449

- [ ] T020 [P] [US5] Add WebSite JSON-LD to homepage
  - File: app/page.tsx
  - Import: generateWebSiteSchema from lib/json-ld.ts
  - Usage: Embed JSON-LD script tag with generateWebSiteSchema() output
  - Size: Add ~8-12 lines
  - Pattern: lib/json-ld.ts generateWebSiteSchema function
  - From: plan.md [IMPLEMENTATION SEQUENCE] line 450

---

## Phase 8: User Story 6 [P2] - Newsletter conversion events

**Story Goal**: Track which content drives newsletter subscriptions

**Independent Test Criteria**:
- [ ] Use GA4 DebugView (add `?debug_mode=true` to URL)
- [ ] Trigger newsletter form view, submit, success
- [ ] Verify custom events (newsletter_view, newsletter_submit, newsletter_success) appear in DebugView
- [ ] Verify page context included (url, referrer)

### Implementation

- [ ] T021 [US6] Extend lib/analytics.ts with newsletter event functions
  - File: lib/analytics.ts (lines 1-122, extend existing)
  - New exports: trackNewsletterView(), trackNewsletterSubmit(params), trackNewsletterSuccess(params)
  - Pattern: Existing trackContentTrackClick (lines 39-53), trackNewsletterSignup (lines 59-73)
  - Interface: TrackNewsletterViewParams, TrackNewsletterSubmitParams, TrackNewsletterSuccessParams
  - Size: Add ~40-60 lines
  - REUSE: isGtagAvailable() function (line 31), window.gtag interface (lines 114-121)
  - From: spec.md US6 (lines 67-70), plan.md [NEW INFRASTRUCTURE - CREATE] lines 207-212

- [ ] T022 [US6] Test newsletter events in GA4 DebugView
  - Method: Browser console, manually call trackNewsletterView(), trackNewsletterSubmit(), trackNewsletterSuccess()
  - Verify: Events appear in GA4 DebugView within 60 seconds
  - Verify: Event parameters include page context (location, content_track if applicable)
  - From: spec.md US6 (lines 67-70)

---

## Phase 9: User Story 7 [P3] - robots.txt with AI crawler directives

**Story Goal**: Control which content LLMs can access

**Independent Test Criteria**:
- [ ] Access /robots.txt in browser
- [ ] Verify AI-specific user-agents listed (GPTBot, Google-Extended, ClaudeBot, CCBot)
- [ ] Verify sitemap reference included (Sitemap: https://marcusgoll.com/sitemap.xml)
- [ ] Verify Allow/Disallow rules appropriate

### Implementation

- [ ] T023 [US7] Create public/robots.txt with AI crawler directives
  - File: public/robots.txt
  - User-agents: Googlebot, GPTBot, ClaudeBot, Google-Extended, CCBot
  - Rules: Allow: /, Disallow: /api/ (block API routes)
  - Sitemap: Sitemap: https://marcusgoll.com/sitemap.xml
  - Size: ~20-30 lines
  - From: spec.md US7 (lines 75-79), plan.md [NEW INFRASTRUCTURE - CREATE] lines 220-226

---

## Phase 10: User Story 8 [P3] - Semantic HTML5 markup

**Story Goal**: Content structure clear to LLM crawlers

**Independent Test Criteria**:
- [ ] Run HTML validator (https://validator.w3.org/)
- [ ] Verify blog posts use <article>, <section>, <header>, <nav>, <footer> appropriately
- [ ] Verify heading hierarchy (h1 → h2 → h3, no skipping levels)
- [ ] Zero structural warnings

### Implementation

- [ ] T024 [P] [US8] Audit app/blog/[slug]/page.tsx for semantic HTML5
  - File: app/blog/[slug]/page.tsx
  - Check: Does layout use <article>, <header>, <section>, <nav>, <footer>?
  - Check: Is heading hierarchy correct (h1 for title, h2 for sections)?
  - Document: Note current structure in NOTES.md
  - From: spec.md US8 (lines 81-85)

- [ ] T025 [P] [US8] Enhance blog post layout with semantic elements if needed
  - File: app/blog/[slug]/page.tsx
  - Replace: Generic <div> wrappers with <article> (blog post), <header> (title/meta), <section> (content)
  - Replace: Navigation <div> with <nav>
  - Verify: Heading hierarchy correct (h1 → h2 → h3, no skips)
  - Size: Refactor ~10-20 lines
  - From: spec.md US8 (lines 81-85)

---

## Phase 11: Polish & Cross-Cutting Concerns

### Error Handling & Resilience

- [ ] T026 [P] Verify analytics fail silently if GA4 unavailable
  - Files: lib/analytics.ts (already implements isGtagAvailable check)
  - Test: Disable GA4 (remove NEXT_PUBLIC_GA_MEASUREMENT_ID), verify site still works
  - Test: Block gtag.js with ad blocker, verify no errors in console
  - From: spec.md NFR-008 (line 206)

- [ ] T027 [P] Verify sitemap generation fails gracefully
  - File: lib/generate-sitemap.ts (lines 72-78, already implements try/catch)
  - Test: Run postbuild with missing blog posts directory
  - Verify: Build continues, error logged but non-blocking
  - From: spec.md NFR-009 (line 207), plan.md [RISKS & MITIGATION] lines 405-410

### Deployment Preparation

- [ ] T028 Update NOTES.md with deployment metadata
  - File: specs/004-seo-analytics/NOTES.md
  - Add: Environment variables (NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_SITE_URL)
  - Add: Rollback procedure (standard 3-command git revert)
  - Add: Smoke tests (access /sitemap.xml, verify meta tags in view-source)
  - From: plan.md [DEPLOYMENT ACCEPTANCE] lines 290-342

- [ ] T029 [P] Add smoke test commands to NOTES.md
  - File: specs/004-seo-analytics/NOTES.md
  - Smoke test 1: `curl https://app-staging.cfipros.vercel.app/sitemap.xml` (200 status, valid XML)
  - Smoke test 2: `curl https://app-staging.cfipros.vercel.app/ | grep "og:title"` (verify Open Graph tags)
  - From: plan.md [CI/CD IMPACT] lines 277-281

- [ ] T030 [P] Document SEO validation checklist
  - File: specs/004-seo-analytics/NOTES.md
  - Checklist: Google Rich Results Test (blog posts), Twitter Card Validator (all pages), Facebook Sharing Debugger (all pages)
  - Checklist: GA4 DebugView (verify events), Google Search Console (submit sitemap)
  - Checklist: Lighthouse CI (Performance ≥90, SEO ≥95, no regression)
  - From: plan.md [QUALITY GATES] lines 359-378
