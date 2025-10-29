# Feature Specification: SEO & Analytics Infrastructure

**Branch**: `feature/004-seo-analytics`
**Created**: 2025-10-22
**Status**: Draft
**GitHub Issue**: #35

## User Scenarios

### Primary User Story

As a **content creator** (Marcus), I want comprehensive SEO and analytics infrastructure so that my content is discoverable via search engines and I can track user engagement to inform content strategy.

### Acceptance Scenarios

1. **Given** a blog post is published, **When** a search engine crawler visits, **Then** it finds complete meta tags (title, description, Open Graph, Twitter Cards) and JSON-LD structured data

2. **Given** the website is deployed, **When** accessing `/sitemap.xml`, **Then** all public pages are listed with proper priority and change frequency

3. **Given** a user visits any page, **When** the page loads, **Then** Google Analytics 4 tracks the pageview without blocking page render

4. **Given** a user subscribes to the newsletter, **When** they submit the form, **Then** a custom GA4 event tracks the conversion with source attribution

5. **Given** an AI crawler (GPTBot, ClaudeBot, etc.) visits, **When** it checks `/robots.txt`, **Then** it finds explicit directives for allowed/disallowed paths

### Edge Cases

- What happens when GA4 script fails to load? → Page continues to function, analytics fails silently
- How does system handle missing meta tag data for a page? → Falls back to site-wide defaults (site title, generic description)
- What if sitemap generation exceeds build time limits? → Fails build with clear error message, requires pagination strategy
- How are analytics events handled for users with ad blockers? → Events fail silently, no error thrown

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a content creator, I want meta tags (title, description) on all pages so that search engines can properly index my content
  - **Acceptance**: Every page has unique meta title and description; defaults applied if page-specific values missing
  - **Independent test**: View page source, verify `<title>` and `<meta name="description">` tags present
  - **Effort**: S (2-4 hours)

- **US2** [P1]: As a content creator, I want Open Graph and Twitter Card meta tags so that links shared on social media display rich previews
  - **Acceptance**: All pages include og:title, og:description, og:image, og:url; Twitter Card equivalents present
  - **Independent test**: Use Twitter Card Validator and Facebook Sharing Debugger to verify rich previews
  - **Effort**: S (2-4 hours)

- **US3** [P1]: As a content creator, I want automated sitemap.xml generation so that search engines can discover all my content
  - **Acceptance**: `sitemap.xml` generated at build time, includes all public pages, excludes admin/draft pages
  - **Independent test**: Access `/sitemap.xml`, verify all blog posts and pages listed with `<lastmod>` dates
  - **Effort**: S (2-4 hours)

- **US4** [P1]: As a content creator, I want Google Analytics 4 tracking so that I can measure traffic and user behavior
  - **Acceptance**: GA4 tracks pageviews, session duration, bounce rate; loads asynchronously without blocking render
  - **Independent test**: Verify events appear in GA4 real-time dashboard within 60 seconds
  - **Effort**: M (4-8 hours)

**Priority 2 (Enhancement)**

- **US5** [P2]: As a content creator, I want JSON-LD structured data on blog posts so that search engines understand content type and authorship
  - **Acceptance**: Blog posts include Article schema with author, datePublished, headline, image
  - **Depends on**: US1
  - **Independent test**: Use Google Rich Results Test to validate schema markup
  - **Effort**: M (4-8 hours)

- **US6** [P2]: As a content creator, I want custom GA4 events for newsletter conversions so that I can track which content drives subscriptions
  - **Acceptance**: Events fire for newsletter_view, newsletter_submit, newsletter_success with page context
  - **Depends on**: US4
  - **Independent test**: Submit newsletter form, verify custom event in GA4 DebugView
  - **Effort**: S (2-4 hours)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a content creator, I want robots.txt with AI crawler directives so that I can control which content LLMs can access
  - **Acceptance**: robots.txt includes directives for GPTBot, Google-Extended, ClaudeBot, CCBot
  - **Depends on**: US3
  - **Independent test**: Access `/robots.txt`, verify AI-specific user-agents listed
  - **Effort**: XS (<2 hours)

- **US8** [P3]: As a content creator, I want semantic HTML5 markup so that content structure is clear to LLM crawlers
  - **Acceptance**: Blog posts use `<article>`, `<section>`, `<nav>` tags appropriately
  - **Depends on**: Blog infrastructure (#33)
  - **Independent test**: Run HTML validator, verify no structural warnings
  - **Effort**: S (2-4 hours)

**MVP Strategy**: Ship US1-US4 first (core SEO + analytics), validate search indexing and traffic tracking work, then add US5-US6 (structured data + custom events) based on initial data. US7-US8 are future enhancements once blog infrastructure (#33) is complete.

## Visual References

N/A - Infrastructure feature with no user-facing UI components

## Success Metrics (HEART Framework)

> **Purpose**: Track SEO performance and analytics implementation effectiveness

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Users find content easily | Search traffic increases | Organic search visits/month | +50% growth over 3 months | <2% 404 rate from search |
| **Engagement** | Content resonates with visitors | Time on page increases | Avg. session duration | >2 minutes | Bounce rate <60% |
| **Adoption** | New visitors discover site | Search impressions grow | Google Search Console impressions | +100/day baseline | Click-through rate >2% |
| **Retention** | Visitors return | Repeat traffic | 7-day return rate | 15% of visitors return | <80% new vs returning |
| **Task Success** | Analytics tracks all events | Data completeness | GA4 event capture rate | >95% of pageviews tracked | <5% tracking errors |

**Performance Targets** (from `design/systems/budgets.md`):
- Meta tag SSR overhead: <5ms
- GA4 script load: Asynchronous, non-blocking
- JSON-LD size: <1KB per page
- Sitemap generation: <30s build time (for <1000 pages)
- Page performance: FCP <1.5s, TTI <3.5s (unaffected by SEO/analytics)

**Measurement Sources**:
- Google Search Console: Impressions, clicks, CTR, average position
- Google Analytics 4: Pageviews, session duration, bounce rate, events
- Lighthouse CI: Performance impact validation
- Server logs: Crawler access patterns

## Screens Inventory (UI Features Only)

N/A - No UI screens (backend infrastructure only)

## Hypothesis

N/A - Not improving existing flow (new infrastructure)

## Context Strategy & Signal Design

**System prompt altitude**: Low-level implementation (package installation, configuration files, meta tag injection)

**Tool surface**:
- `package.json` - Add dependencies (next-seo, next-sitemap, @next/third-parties)
- `next.config.js` - Configure sitemap postbuild
- `next-sitemap.config.js` - Sitemap generation rules
- `public/robots.txt` - AI crawler directives
- Page components - Inject NextSeo components

**Examples in scope**:
1. Blog post with full SEO (meta + OG + JSON-LD)
2. Homepage with site-wide defaults
3. Custom GA4 event (newsletter conversion)

**Context budget**: 75k tokens (planning phase)

**Retrieval strategy**: JIT (Just-In-Time) - Load Next.js SEO docs and GA4 setup guides when needed

**Memory artifacts**:
- `NOTES.md` - Track SEO best practices, GA4 property IDs, robots.txt rules
- Update after each user story completion

**Compaction cadence**: After US4 completion (before structured data work)

**Sub-agents**: None required (single-domain feature)

## Requirements

### Functional (testable only)

**SEO - Meta Tags**

- **FR-001**: System MUST inject unique meta title on every page (page-specific if available, site default otherwise)
- **FR-002**: System MUST inject meta description on every page (150-160 characters, page-specific or default)
- **FR-003**: System MUST include Open Graph tags (og:title, og:description, og:image, og:url, og:type) on all pages
- **FR-004**: System MUST include Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) on all pages
- **FR-005**: Meta titles MUST be 50-60 characters; descriptions 150-160 characters

**SEO - Structured Data**

- **FR-006**: Blog posts MUST include JSON-LD Article schema with author, datePublished, dateModified, headline, image properties
- **FR-007**: Homepage MUST include JSON-LD WebSite schema with name, url, description
- **FR-008**: All JSON-LD MUST validate against schema.org specifications

**SEO - Sitemap & Robots**

- **FR-009**: System MUST generate sitemap.xml at build time including all public pages
- **FR-010**: Sitemap MUST include `<lastmod>` timestamps for all entries
- **FR-011**: Sitemap MUST exclude admin routes, draft posts, and development-only pages
- **FR-012**: System MUST provide robots.txt with AI crawler directives (GPTBot, Google-Extended, ClaudeBot, CCBot)

**Analytics - Core Tracking**

- **FR-013**: System MUST load Google Analytics 4 script asynchronously without blocking page render
- **FR-014**: System MUST track pageview events automatically for all page loads
- **FR-015**: GA4 script MUST only load when `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable is set (production/staging only)

**Analytics - Custom Events**

- **FR-016**: System MUST fire custom GA4 event `newsletter_view` when newsletter form is displayed
- **FR-017**: System MUST fire custom GA4 event `newsletter_submit` when form is submitted
- **FR-018**: System MUST fire custom GA4 event `newsletter_success` when subscription is confirmed
- **FR-019**: All custom events MUST include page context (URL, title, referrer)

**LLM-Friendly Markup**

- **FR-020**: Blog posts MUST use semantic HTML5 elements (article, section, header, nav, footer)
- **FR-021**: Headings MUST follow hierarchical structure (h1 → h2 → h3, no skipping levels)

### Non-Functional

- **NFR-001**: Performance: Meta tag injection MUST add <5ms to server-side rendering time
- **NFR-002**: Performance: GA4 script MUST load asynchronously and not block First Contentful Paint
- **NFR-003**: Performance: JSON-LD schema MUST not exceed 1KB per page
- **NFR-004**: Build Time: Sitemap generation MUST complete within 30 seconds for up to 1000 pages
- **NFR-005**: Accessibility: Meta tags and structured data MUST not interfere with screen reader functionality
- **NFR-006**: Privacy: GA4 MUST have IP anonymization enabled
- **NFR-007**: Privacy: Custom events MUST NOT include Personally Identifiable Information (PII)
- **NFR-008**: Error Handling: Analytics failures MUST fail silently without breaking page functionality
- **NFR-009**: Error Handling: Missing meta tag data MUST fall back to site-wide defaults

### Key Entities

**Meta Configuration**:
- **Purpose**: Site-wide SEO defaults
- **Attributes**: defaultTitle, defaultDescription, defaultOGImage, twitterHandle, canonicalURL
- **Relationships**: Referenced by all page-level meta overrides

**Analytics Event**:
- **Purpose**: Track user actions
- **Attributes**: eventName, eventParams (page, source, value), timestamp
- **Relationships**: Sent to GA4, logged to structured logs for Claude measurement

**Sitemap Entry**:
- **Purpose**: Inform search engines of page existence
- **Attributes**: url, lastmod, changefreq, priority
- **Relationships**: Generated from Next.js route manifest

**JSON-LD Schema**:
- **Purpose**: Machine-readable content metadata
- **Attributes**: @type (Article, WebSite), author, datePublished, headline, image
- **Relationships**: Embedded in page HTML, validated by Google Rich Results Test

## Deployment Considerations

### Platform Dependencies

**Vercel** (marketing/app):
- Next.js configuration updates (`next.config.js` for sitemap postbuild)
- No edge middleware changes required
- Build-time sitemap generation via `postbuild` script

**Dependencies to Add**:
- `next-seo@^6.5.0` - SEO meta tag management (peer dependency: react, next)
- `next-sitemap@^4.2.3` - Sitemap.xml generation (peer dependency: next)
- `@next/third-parties@^15.0.0` - Optimized Google Analytics loading (Next.js official package)

**Node Version**: Requires Node.js 18+ (current: 18.x per package.json)

### Environment Variables

**New Required Variables**:

```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Staging: G-STAGING123 (separate GA4 property for testing)
# Production: G-PRODUCTION456 (production GA4 property)
```

**Variable Details**:
- **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Type**: String (format: `G-[A-Z0-9]{10}`)
- **Sensitivity**: Public (appears in client-side code)
- **Required for**: Production and Staging deployments
- **Optional for**: Local development (tracking disabled if not set)

**Schema Update Required**: No - Environment variable is public tracking ID, not a secret

### Breaking Changes

**API Contract Changes**: None (additive infrastructure)

**Database Schema Changes**: None (client-side only)

**Auth Flow Modifications**: None

**Client Compatibility**: Fully backward compatible

### Migration Requirements

**Database Migrations**: Not required

**Data Backfill**: Not required

**RLS Policy Changes**: Not required

**Configuration Files** (new):
- `next-sitemap.config.js` - Sitemap generation rules
- `public/robots.txt` - AI crawler directives
- Updates to `next.config.js` - Postbuild sitemap script

**Reversibility**: Fully reversible (remove packages, revert config changes)

### Rollback Considerations

**Standard Rollback**: Yes - 3-command rollback via git revert

**Special Rollback Needs**: None

**Risk Level**: Low
- Purely additive changes
- No database dependencies
- Client-side analytics (no server-side impact)
- Can disable via environment variable removal

**Deployment Metadata**: Deploy IDs tracked in `specs/004-seo-analytics/NOTES.md` (Deployment Metadata section)

---

## Measurement Plan

### Data Collection

**Analytics Events** (dual instrumentation):
- **PostHog** (dashboards): `posthog.capture('seo.newsletter_submit', { page, source })`
- **Structured logs** (Claude measurement): `logger.info({ event: 'newsletter_submit', page, source })`
- **GA4** (user behavior): `gtag('event', 'newsletter_submit', { page, source })`

**Key Events to Track**:
1. `page_view` - Automatic (GA4 default)
2. `newsletter_view` - Form displayed (custom event)
3. `newsletter_submit` - Form submitted (custom event)
4. `newsletter_success` - Subscription confirmed (custom event)
5. `404_error` - Page not found (for SEO health monitoring)

### Measurement Queries

**Google Search Console** (manual export):
- Organic impressions: Total search impressions over time
- Organic clicks: Total clicks from search results
- Average CTR: Clicks / impressions * 100
- Average position: Mean search result ranking

**Google Analytics 4** (GA4 dashboard + API):
- Pageviews: `SELECT event_name, COUNT(*) WHERE event_name='page_view' GROUP BY page_location`
- Bounce rate: `SELECT (single_page_sessions / total_sessions) * 100`
- Avg session duration: `SELECT AVG(session_duration_seconds)`
- Custom event count: `SELECT event_name, COUNT(*) WHERE event_name IN ('newsletter_view', 'newsletter_submit', 'newsletter_success')`

**Lighthouse CI** (`.lighthouseci/results/*.json`):
- Performance impact: `jq '.categories.performance.score' | compare to baseline`
- SEO score: `jq '.categories.seo.score'` (should be ≥95 after implementation)
- Meta tag validation: `jq '.audits["meta-description"].score'`

**Structured Logs** (`logs/metrics/*.jsonl`):
- Event counts: `grep '"event":"newsletter_submit"' logs/metrics/*.jsonl | wc -l`
- Error rate: `grep '"level":"error"' | wc -l / total events`

### Experiment Design

**N/A** - Infrastructure rollout, not A/B test (no control/treatment variants)

**Ramp Plan**:
1. **Staging** (Days 1-3): Deploy to staging, verify GA4 events in DebugView, validate meta tags
2. **Production** (Day 4): Deploy to production, monitor real-time analytics
3. **Validation** (Days 5-14): Monitor Google Search Console for indexing improvements
4. **Baseline** (Days 15-30): Establish baseline metrics for future content experiments

**Kill Switch**: Disable GA4 tracking by removing `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable if performance degrades

**Sample Size**: N/A (infrastructure, not experiment)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, security, privacy, brand)
- [x] No implementation details (specific package versions in spec, general approach only)

### Conditional: Success Metrics
- [x] HEART metrics defined with Claude Code-measurable sources (GSC, GA4, Lighthouse)
- N/A Hypothesis (not improving existing flow)

### Conditional: UI Features
- N/A All screens identified (no UI components)
- N/A System components planned (infrastructure only)

### Conditional: Deployment Impact
- [x] Breaking changes identified (none - additive infrastructure)
- [x] Environment variables documented (NEXT_PUBLIC_GA_MEASUREMENT_ID with staging/production values)
- [x] Rollback plan specified (standard 3-command git revert)

---

## Dependencies and Blockers

**Blocked By**:
- **Issue #33**: blog-infrastructure - Blog pages required for full SEO optimization
  - **Impact**: Can implement meta tag infrastructure now, but full value realized when blog posts exist
  - **Workaround**: Apply to homepage and static pages initially, extend to blog when available

**Blocks**:
- None - This is foundational infrastructure

**Related Issues**:
- **#13**: Meta Tags & Open Graph (covered by US1-US2)
- **#14**: JSON-LD Structured Data (covered by US5)
- **#17**: Sitemap Generation (covered by US3)

---

## Out of Scope

**Explicitly Excluded** (future enhancements):
- Vercel Analytics integration (optional, evaluate after GA4 baseline)
- A/B testing framework (separate feature)
- Heatmaps and session recording (separate feature, consider Hotjar/PostHog)
- Custom SEO dashboard (use Google Search Console + GA4 initially)
- Automated meta description generation via AI (future enhancement)
- International SEO (hreflang tags) - single language site currently

---

## Success Criteria (Technology-Agnostic, Measurable)

1. **Search Indexing**: All public pages appear in Google Search Console within 7 days of deployment
2. **Rich Previews**: Links shared on Twitter and Facebook display rich previews (image, title, description)
3. **Analytics Tracking**: 95%+ of pageviews tracked in GA4 within 60 seconds
4. **Performance**: Page load time (FCP) unaffected by SEO/analytics implementation (<1.5s maintained)
5. **Sitemap**: `/sitemap.xml` accessible and validates in Google Search Console
6. **Structured Data**: Blog posts pass Google Rich Results Test with zero errors
7. **Custom Events**: Newsletter conversion events appear in GA4 DebugView within 60 seconds of submission
8. **Privacy**: GA4 configured with IP anonymization enabled (verified in GA4 admin)

---

## Assumptions

### Performance Assumptions
- Meta tag injection adds <5ms to SSR (industry standard for Next.js SEO packages)
- GA4 script loads asynchronously, does not block FCP/TTI
- JSON-LD schema size <1KB per page (typical for Article schema)
- Sitemap generation <30s for <1000 pages (next-sitemap performance baseline)

### SEO Best Practices
- Meta titles: 50-60 characters (Google SERP display limit)
- Meta descriptions: 150-160 characters (Google SERP snippet length)
- Open Graph images: 1200×630px (Facebook recommended size)
- JSON-LD schema: schema.org Article type for blog posts

### Analytics Configuration
- GA4 data retention: 14 months (GA4 default)
- IP anonymization: Enabled (privacy compliance)
- No PII in custom events (privacy compliance)
- Tracking disabled in development (NEXT_PUBLIC_GA_MEASUREMENT_ID not set locally)

### AI Crawler Behavior
- Respects robots.txt directives (assumes compliance)
- Prefers JSON-LD over meta tags for structured data
- Benefits from semantic HTML5 markup

**Note**: All assumptions documented here can be overridden during planning if requirements differ. Industry-standard defaults applied to avoid over-clarification.

---

## Next Steps

1. **Approved**: Proceed to `/plan` phase to design implementation approach
2. **Needs Clarification**: Run `/clarify` if any ambiguities remain (currently: none)
3. **Blocked**: Wait for Issue #33 (blog-infrastructure) if full blog SEO is priority (or implement for homepage/static pages first)
