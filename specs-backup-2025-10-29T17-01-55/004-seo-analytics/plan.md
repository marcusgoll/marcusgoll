# Implementation Plan: SEO & Analytics Infrastructure

## Feature Summary

Comprehensive SEO and analytics infrastructure to improve search discoverability and track user engagement. Builds on existing GA4 and sitemap foundations, adds Open Graph meta tags, JSON-LD structured data, custom event tracking, and AI crawler directives.

**Complexity**: Medium (enhancing existing patterns, adding new meta tag/structured data layer)

**Estimated Duration**: 12-16 hours (US1-US8)

---

## [RESEARCH DECISIONS]

See: `research.md` for full research findings

**Summary**:
- **Stack**: Next.js 15 App Router + next-seo + existing analytics infrastructure
- **Components to reuse**: 4 (lib/analytics.ts, lib/generate-sitemap.ts, app/layout.tsx GA4 setup, PageViewTracker)
- **New components needed**: 5 (SEO config, robots.txt, JSON-LD generators, SEO wrapper, newsletter events)
- **Code reuse**: ~45% (existing analytics and sitemap generation cover core functionality)

**Key Research Decisions**:
1. Keep existing GA4 implementation (app/layout.tsx), optionally enhance with @next/third-parties
2. Reuse existing sitemap generator (lib/generate-sitemap.ts), wire into postbuild
3. Use next-seo for meta tag management (industry standard, 1M+ weekly downloads)
4. Extend lib/analytics.ts for newsletter event tracking (consistent patterns)
5. Create static public/robots.txt with AI crawler directives
6. Apply semantic HTML5 markup to blog post pages

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- **Frontend**: Next.js 15 App Router (existing)
- **SEO**: next-seo@^6.5.0 (new dependency)
- **Analytics**: Google Analytics 4 via gtag.js (existing in app/layout.tsx)
- **Sitemap**: Custom generator using lib/mdx.ts (existing, needs build integration)
- **Structured Data**: JSON-LD via next-seo ArticleJsonLd, next-seo-extra (if needed)
- **Deployment**: Vercel (existing, no changes)

**Patterns**:
- **Configuration over code**: Centralized SEO defaults in lib/seo-config.ts, page-level overrides
- **Build-time generation**: Sitemap generated during postbuild (no runtime cost)
- **Progressive enhancement**: SEO/analytics fail silently if disabled (NFR-008, NFR-009)
- **Composition**: NextSeo component wraps pages, doesn't replace Metadata API

**Dependencies** (new packages required):
- `next-seo@^6.5.0` - SEO meta tags and JSON-LD (peer dependencies: react, next already installed)

**Node Version**: 18+ (current: satisfies requirements per package.json)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
lib/
├── analytics.ts             # [EXISTING] Extend with newsletter events
├── generate-sitemap.ts      # [EXISTING] Wire into postbuild
├── seo-config.ts            # [NEW] Centralized SEO defaults
└── json-ld.ts               # [NEW] JSON-LD schema generators

components/
├── analytics/
│   └── PageViewTracker.tsx  # [EXISTING] Use in blog post pages
└── seo/
    └── DefaultSEO.tsx       # [NEW] Wrapper for DefaultSeo component

public/
└── robots.txt               # [NEW] AI crawler directives + sitemap reference

app/
├── layout.tsx               # [EXISTING] Add DefaultSEO component
├── blog/
│   ├── page.tsx             # [ENHANCE] Add NextSeo with blog index SEO
│   └── [slug]/
│       └── page.tsx         # [ENHANCE] Add NextSeo + JSON-LD for blog posts
└── page.tsx                 # [ENHANCE] Add NextSeo for homepage

package.json                 # [ENHANCE] Add postbuild script for sitemap
```

**Module Organization**:
- `lib/seo-config.ts` - SEO configuration and defaults (export: defaultSEO, getPageSEO helper)
- `lib/json-ld.ts` - JSON-LD schema generators (exports: generateArticleSchema, generateWebSiteSchema)
- `lib/analytics.ts` - Analytics event tracking (extend with: trackNewsletterView, trackNewsletterSubmit, trackNewsletterSuccess)
- `components/seo/DefaultSEO.tsx` - Site-wide SEO wrapper (wraps DefaultSeo from next-seo)

---

## [DATA MODEL]

See: `data-model.md` for complete entity definitions

**Summary**:
- **Entities**: 5 (SEO Configuration, Sitemap Entry, JSON-LD Schema, Analytics Event, Robots Directive)
- **Relationships**: Configuration-driven (no database, no foreign keys)
- **Migrations required**: No (client-side only, no persistent storage)

**Key Data Structures**:
- SEO Configuration: Site defaults + page overrides (lib/seo-config.ts)
- Sitemap Entry: URL, lastModified, changeFrequency, priority (generated at build time)
- JSON-LD Schema: Article (blog posts), WebSite (homepage) (embedded in HTML)
- Analytics Event: page_view, newsletter_view, newsletter_submit, newsletter_success (sent to GA4)
- Robots Directive: User-agent rules for search engines and AI crawlers (public/robots.txt)

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Meta tag injection <5ms SSR overhead
- NFR-002: GA4 script asynchronous, non-blocking FCP
- NFR-003: JSON-LD schema <1KB per page
- NFR-004: Sitemap generation <30s for 1000 pages

**Constitution defaults**:
- API response time: Not applicable (no API endpoints modified)
- Page loads: FCP <1.5s, LCP <3s (must maintain current performance)
- Database queries: Not applicable (no database)

**Lighthouse Targets** (after implementation):
- Performance: ≥90 (no regression from current baseline)
- Accessibility: ≥95 (semantic HTML5 improvements)
- Best Practices: ≥90
- **SEO: ≥95** (up from current, new focus area)

**Measurement**:
- Lighthouse CI: Run before/after to verify no performance regression
- GA4 Real-Time: Verify events fire within 60 seconds
- Google Search Console: Monitor indexing improvements over 7-14 days
- Rich Results Test: Validate JSON-LD schemas pass with zero errors

---

## [SECURITY]

**Authentication Strategy**:
- Not applicable - Public SEO/analytics infrastructure (no auth required)

**Authorization Model**:
- Not applicable - All features client-side, no protected routes

**Input Validation**:
- SEO config: TypeScript types enforce string lengths (50-60 chars title, 150-160 chars description)
- Analytics events: No user input directly accepted (parameters set by code, not forms)
- JSON-LD: Schema validation via Google Rich Results Test

**Data Protection** (from NFR-006, NFR-007):
- PII handling: No PII in analytics events (NFR-007 explicit requirement)
- Encryption: Not applicable (no sensitive data)
- IP anonymization: GA4 IP anonymization enabled (NFR-006)

**Secrets Management**:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Public tracking ID (safe to expose client-side)
- `NEXT_PUBLIC_SITE_URL` - Public site URL (no secret)
- No sensitive secrets required for this feature

---

## [EXISTING INFRASTRUCTURE - REUSE] (4 components)

**Services/Modules**:
1. **lib/analytics.ts** - GA4 event tracking utilities
   - Location: `lib/analytics.ts` lines 1-122
   - Reuse: Extend with newsletter_view, newsletter_submit, newsletter_success functions
   - Pattern: Existing `trackContentTrackClick`, `trackExternalLinkClick`, `trackPageView` show consistent interface

2. **lib/generate-sitemap.ts** - Sitemap XML generation
   - Location: `lib/generate-sitemap.ts` lines 1-85
   - Reuse: Wire into postbuild script (add `"postbuild": "node -e \"require('./lib/generate-sitemap').generateSitemap()\"` to package.json)
   - Already implements: Static pages + blog posts, `<lastmod>` timestamps, priority calculation

3. **app/layout.tsx** - GA4 script loading
   - Location: `app/layout.tsx` lines 18-39
   - Reuse: Keep existing implementation (conditional loading via NEXT_PUBLIC_GA_ID)
   - Note: Can optionally migrate to `@next/third-parties` for performance (not required)

**UI Components**:
4. **components/analytics/PageViewTracker.tsx** - Page view tracking
   - Location: `components/analytics/PageViewTracker.tsx` lines 1-40
   - Reuse: Add to blog post pages for content track segmentation
   - Already supports: aviation/dev-startup/cross-pollination track parameter

---

## [NEW INFRASTRUCTURE - CREATE] (5 components)

**Backend/Utilities**:
1. **lib/seo-config.ts** - SEO configuration and defaults
   - Purpose: Centralize site-wide SEO settings (title, description, OG image, Twitter handle)
   - Exports: `defaultSEO` (object for DefaultSeo), `getPageSEO(overrides)` (helper for page-level SEO)
   - Size: ~50-80 lines
   - Dependencies: None (pure config)

2. **lib/json-ld.ts** - JSON-LD schema generators
   - Purpose: Generate structured data for Article (blog posts) and WebSite (homepage)
   - Exports: `generateArticleSchema(post)`, `generateWebSiteSchema()`
   - Size: ~80-120 lines
   - Dependencies: Uses post frontmatter from lib/mdx.ts
   - Validation: Must pass Google Rich Results Test (FR-008)

3. **Newsletter event tracking** (extend lib/analytics.ts)
   - Purpose: Track newsletter view/submit/success events
   - New exports: `trackNewsletterView()`, `trackNewsletterSubmit()`, `trackNewsletterSuccess()`
   - Size: ~30-50 lines added to existing file
   - Pattern: Follow existing `trackContentTrackClick` interface

**Frontend**:
4. **components/seo/DefaultSEO.tsx** - Site-wide SEO wrapper
   - Purpose: Wrap DefaultSeo component from next-seo for consistent site-wide meta tags
   - Usage: Import in `app/layout.tsx`
   - Size: ~30-50 lines
   - Props: None (uses defaultSEO from lib/seo-config.ts)

**Static Files**:
5. **public/robots.txt** - AI crawler directives
   - Purpose: Control search engine and AI crawler access (FR-012)
   - User-agents: Googlebot, GPTBot, ClaudeBot, Google-Extended, CCBot
   - Content: Allow/disallow rules + sitemap reference
   - Size: ~20-30 lines

**Enhancements to Existing Files**:
- `app/blog/[slug]/page.tsx` - Add NextSeo component + ArticleJsonLd for blog posts
- `app/blog/page.tsx` - Add NextSeo for blog index page
- `app/page.tsx` - Add NextSeo for homepage
- `package.json` - Add postbuild script: `"postbuild": "tsx lib/generate-sitemap.ts"`

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**

**Platform**: Vercel (no changes to deployment platform)

**Env vars** (new required):
```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL for sitemap generation
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com

# Staging values:
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-STAGING123
NEXT_PUBLIC_SITE_URL=https://app-staging.cfipros.vercel.app

# Production values:
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PRODUCTION456
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
```

**Note**: `NEXT_PUBLIC_GA_ID` currently used in `app/layout.tsx` should be migrated to `NEXT_PUBLIC_GA_MEASUREMENT_ID` for consistency with GA4 naming conventions.

**Breaking changes**: None (additive infrastructure)

**Migration**: Not required (no database, no data backfill)

**Build Commands**:
- Changed: `package.json` scripts section
  - Add: `"postbuild": "tsx lib/generate-sitemap.ts"` (generates sitemap.xml after Next.js build)
  - Existing: `"build": "next build"` (unchanged)

**Environment Variables** (update Vercel project settings):
- New required: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (replace or alias `NEXT_PUBLIC_GA_ID`)
- New optional: `NEXT_PUBLIC_SITE_URL` (defaults to https://marcusgoll.com if not set)
- Staging values: Separate GA4 property for testing (NEXT_PUBLIC_GA_MEASUREMENT_ID=G-STAGING123)
- Production values: Production GA4 property (NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PRODUCTION456)

**Database Migrations**: Not required (no database changes)

**Smoke Tests** (for deploy-staging.yml and promote.yml):
- Route: `/sitemap.xml`
- Expected: 200 status, valid XML with blog post entries
- Additional check: `curl https://app-staging.cfipros.vercel.app/ | grep "og:title"` (verify Open Graph tags present)

**Platform Coupling**:
- Vercel: No edge middleware changes
- Vercel: No ignored build step changes
- Dependencies: New `next-seo@^6.5.0` (peer dependencies: react, next already satisfied)
- Build: Postbuild script runs after `next build` (non-blocking, sitemap generation)

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- Meta tags present on all pages (verify view-source on homepage, blog index, blog post)
- Sitemap.xml accessible and contains all public pages
- GA4 tracking fires within 60 seconds (verify in GA4 Real-Time dashboard)
- JSON-LD validates with zero errors (Google Rich Results Test)
- No performance regression (Lighthouse CI: Performance ≥90, SEO ≥95)

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given user visits https://app-staging.cfipros.vercel.app/
When page loads
Then Open Graph meta tags are present in HTML head
  And Google Analytics 4 script loads asynchronously
  And page performance (FCP) is <1.5s

Given user visits https://app-staging.cfipros.vercel.app/sitemap.xml
When sitemap loads
Then XML is valid
  And contains homepage, blog index, and all blog posts
  And each entry has <lastmod> timestamp

Given user visits https://app-staging.cfipros.vercel.app/blog/test-post
When page loads
Then Article JSON-LD schema is present
  And schema validates in Google Rich Results Test
  And page view event fires in GA4 DebugView within 60 seconds
```

**Rollback Plan**:
- Deploy IDs tracked in: `specs/004-seo-analytics/NOTES.md` (Deployment Metadata section)
- Rollback commands: Standard 3-command git revert (from constitution.md)
  ```bash
  git revert <commit-sha>
  git push
  # Vercel auto-deploys on push
  ```
- Special considerations: None (fully reversible, no database dependencies)
- Risk level: Low (additive changes, no breaking API modifications)

**Artifact Strategy** (build-once-promote-many):
- Web (App): Vercel prebuilt artifact (`.vercel/output/`)
- Build in: `.github/workflows/verify.yml` (or local build)
- Deploy to staging: `.github/workflows/deploy-staging.yml` (uses prebuilt artifact)
- Promote to production: `.github/workflows/promote.yml` (same artifact)
- Sitemap generation: Runs during postbuild (part of artifact)

**Rollback Capability**:
- Standard Vercel rollback: `vercel alias set <previous-deployment-id> marcusgoll.com --token=$VERCEL_TOKEN`
- No database rollback needed (no schema changes)
- Environment variables: Can disable GA4 by removing `NEXT_PUBLIC_GA_MEASUREMENT_ID` if needed

---

## [INTEGRATION SCENARIOS]

See: `quickstart.md` for complete integration scenarios

**Summary**:
- Initial setup: Install dependencies, configure environment variables
- Build validation: Run `pnpm build` and verify sitemap.xml generated
- Local testing: Start dev server, verify meta tags in browser DevTools
- Staging validation: Deploy to staging, test in GA4 DebugView and Google Rich Results Test
- Production deployment: Promote to production, monitor Google Search Console for indexing improvements

---

## [QUALITY GATES]

**Pre-implementation**:
- ✅ Research complete (research.md)
- ✅ Data model defined (data-model.md)
- ✅ Architecture decisions documented (plan.md)
- ✅ Reuse opportunities identified (4 existing components)

**During implementation**:
- Meta tags: Verify present in HTML head on all page types (homepage, blog index, blog posts)
- JSON-LD: Pass Google Rich Results Test with zero errors
- Sitemap: Valid XML, contains all expected pages, excludes admin/draft routes
- Analytics: Events fire in GA4 DebugView within 60 seconds
- Performance: Lighthouse CI shows no regression (Performance ≥90, SEO ≥95)

**Pre-deployment**:
- Build succeeds with postbuild sitemap generation
- robots.txt accessible at `/robots.txt`
- sitemap.xml accessible at `/sitemap.xml`
- Environment variables configured in Vercel (staging and production)

---

## [DEPENDENCIES]

**Blocked by**:
- None - Can implement infrastructure now
- Note: Full value realized when blog posts exist (currently some blog content available per existing blog/ routes)

**Blocks**:
- None - This is foundational infrastructure for future content growth

**Related features**:
- Blog infrastructure (#33) - SEO optimizations most valuable with blog content
- Newsletter feature (future) - Custom event tracking prepared for when newsletter form ships

---

## [RISKS & MITIGATION]

**Risk 1: GA4 Measurement ID mismatch**
- **Description**: Using wrong GA4 property (staging vs production)
- **Likelihood**: Medium
- **Impact**: Medium (pollutes production analytics with staging data)
- **Mitigation**: Separate environment variables (NEXT_PUBLIC_GA_MEASUREMENT_ID per environment)
- **Validation**: Verify events in correct GA4 property during staging smoke tests

**Risk 2: Sitemap generation fails on build**
- **Description**: Postbuild script errors if blog posts missing or MDX parsing fails
- **Likelihood**: Low
- **Impact**: Medium (sitemap.xml not generated, SEO impact)
- **Mitigation**: Postbuild script uses try/catch, logs error but doesn't fail build (NFR-009)
- **Validation**: Test locally with `pnpm build`, verify sitemap.xml in public/ directory

**Risk 3: next-seo TypeScript conflicts**
- **Description**: next-seo types conflict with Next.js 15 Metadata API
- **Likelihood**: Low (next-seo actively maintained, Next.js 15 support)
- **Impact**: Low (compilation errors, not runtime)
- **Mitigation**: Use next-seo@latest, verify compatibility with Next.js 15
- **Validation**: TypeScript compilation succeeds with `pnpm build`

**Risk 4: Performance regression from meta tag injection**
- **Description**: SSR overhead from next-seo exceeds 5ms target (NFR-001)
- **Likelihood**: Very Low (next-seo is optimized for performance)
- **Impact**: Medium (violates performance NFR)
- **Mitigation**: Measure SSR time before/after with Vercel Analytics or custom logging
- **Validation**: Lighthouse CI Performance score ≥90 (no regression)

---

## [IMPLEMENTATION SEQUENCE]

**Phase 1: Core SEO Infrastructure (US1-US3)**
1. Install next-seo dependency
2. Create lib/seo-config.ts with site-wide defaults
3. Create components/seo/DefaultSEO.tsx wrapper
4. Enhance app/layout.tsx with DefaultSEO component
5. Enhance app/page.tsx with NextSeo for homepage (meta title, description, OG tags)
6. Enhance app/blog/page.tsx with NextSeo for blog index
7. Enhance app/blog/[slug]/page.tsx with NextSeo for blog posts (US1, US2)
8. Wire lib/generate-sitemap.ts into package.json postbuild script (US3)
9. Test: Build locally, verify sitemap.xml generated, meta tags present

**Phase 2: Analytics Enhancement (US4, US6)**
10. Verify existing GA4 implementation in app/layout.tsx (US4 already complete)
11. Extend lib/analytics.ts with newsletter event functions (US6)
12. Test: Fire custom events in browser console, verify in GA4 DebugView

**Phase 3: Structured Data (US5)**
13. Create lib/json-ld.ts with Article and WebSite schema generators
14. Add ArticleJsonLd to blog post pages (app/blog/[slug]/page.tsx)
15. Add WebSite JSON-LD to homepage (app/page.tsx)
16. Test: Validate schemas with Google Rich Results Test (zero errors)

**Phase 4: AI Crawlers & Semantic HTML (US7, US8)**
17. Create public/robots.txt with AI crawler directives (US7)
18. Audit app/blog/[slug]/page.tsx for semantic HTML5 (article, section, nav, aside) (US8)
19. Enhance blog post layout with semantic elements if needed
20. Test: Access /robots.txt, verify AI user-agents listed

**Phase 5: Integration & Testing**
21. Update environment variables in Vercel (staging and production)
22. Deploy to staging, run smoke tests
23. Verify GA4 events in DebugView
24. Validate JSON-LD in Rich Results Test
25. Monitor Lighthouse CI (Performance ≥90, SEO ≥95)
26. Sign off for production deployment

---

## [SUCCESS CRITERIA]

**Functional** (from spec.md):
1. All public pages have unique meta titles and descriptions (FR-001, FR-002)
2. Open Graph and Twitter Card tags present on all pages (FR-003, FR-004)
3. Blog posts include JSON-LD Article schema passing Rich Results Test (FR-006, FR-008)
4. Sitemap.xml accessible with all public pages and `<lastmod>` timestamps (FR-009, FR-010)
5. GA4 tracks pageviews and custom newsletter events within 60 seconds (FR-013, FR-014, FR-016-FR-018)
6. robots.txt includes AI crawler directives (FR-012)

**Non-Functional** (from spec.md NFRs):
- Meta tag injection <5ms SSR overhead (NFR-001) - Measure via server timing
- GA4 script non-blocking (NFR-002) - Verify FCP <1.5s maintained
- JSON-LD <1KB per page (NFR-003) - Check payload size in Network tab
- Sitemap generation <30s (NFR-004) - Time postbuild script
- No accessibility regressions (NFR-005) - Lighthouse Accessibility ≥95
- IP anonymization enabled in GA4 (NFR-006) - Verify in GA4 admin settings
- No PII in custom events (NFR-007) - Code review analytics.ts
- Silent failures (NFR-008, NFR-009) - Test with GA4 disabled, verify site still works

**Business Outcomes** (from HEART metrics):
- Google Search Console shows indexing of all blog posts within 7 days
- Organic search impressions baseline established for future tracking
- GA4 event capture rate >95% (pageviews tracked successfully)

---

## NOTES

**Implementation Notes**:
- next-seo and Next.js Metadata API can coexist - NextSeo component overrides Metadata export
- Sitemap generation happens at build time (postbuild script), not runtime
- GA4 property IDs must differ between staging and production to separate analytics data
- robots.txt is static file (no dynamic generation needed for this feature)

**Future Enhancements** (out of scope for this feature):
- Migrate GA4 loading to @next/third-parties for optimized performance (optional)
- Add Vercel Analytics integration (separate feature decision)
- Automated meta description generation via AI (future enhancement)
- International SEO (hreflang tags) if multi-language support added
