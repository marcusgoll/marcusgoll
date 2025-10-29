# Feature Specification: Meta Tags & Open Graph

**Branch**: `feature/053-meta-tags-open-graph`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #13

## User Scenarios

### Primary User Story

When users share marcusgoll.com links on social media platforms (LinkedIn, Twitter, Facebook) or messaging apps, they see rich previews with brand-consistent images, clear titles, and compelling descriptions that accurately represent the content. Search engines index pages with comprehensive metadata, improving discoverability and click-through rates from search results.

### Acceptance Scenarios

1. **Given** a user shares the homepage link on LinkedIn, **When** LinkedIn fetches the Open Graph data, **Then** a rich preview displays with the site title, mission statement, default OG image with brand colors, and canonical URL

2. **Given** a user shares a blog post link on Twitter, **When** Twitter fetches the Twitter Card data, **Then** a large image card displays with the post title, excerpt, featured image, and author attribution

3. **Given** a user shares an aviation section page on Facebook, **When** Facebook fetches the Open Graph data, **Then** a preview displays with "Aviation" title, section description, aviation-specific OG image, and correct URL

4. **Given** a search engine crawler visits the dev-startup section, **When** it parses the page metadata, **Then** it indexes the page with unique title, description, keywords, and canonical URL

5. **Given** a user shares a tag page link (e.g., /blog/tag/cfi), **When** the social platform fetches metadata, **Then** a preview displays with "Posts tagged: CFI" title, tag description, and default OG image

### Edge Cases

- What happens when a blog post has no featured image? Use default OG image with brand colors
- How does the system handle special characters in titles/descriptions? Properly escape HTML entities and respect character limits
- What if NEXT_PUBLIC_SITE_URL is not set? Fallback to relative URLs or localhost (with warning)
- How are OG images served in self-hosted VPS environment? Static images in public/images/og/ folder, served via Caddy

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a content creator, I want all pages to have unique Open Graph tags so that social shares display rich previews with correct titles and descriptions
  - **Acceptance**: Homepage, aviation, dev-startup, blog, tag, and newsletter pages each have unique og:title, og:description, og:url, og:type
  - **Independent test**: Share each page type URL on LinkedIn/Twitter debug tools, verify rich preview appears
  - **Effort**: M (6 hours)

- **US2** [P1]: As a site owner, I want all pages to have Twitter Card metadata so that Twitter shares display large image cards with proper attribution
  - **Acceptance**: All pages have twitter:card, twitter:title, twitter:description, twitter:site (@marcusgoll), twitter:image
  - **Independent test**: Use Twitter Card Validator to verify all page types render correctly
  - **Effort**: S (3 hours)

- **US3** [P1]: As a site owner, I want a default OG image with brand colors so that pages without featured images still have professional social previews
  - **Acceptance**: Default OG image (1200x630px) with Navy 900 background, Emerald 600 accents, site logo/tagline exists at /images/og-default.jpg
  - **Independent test**: Share a non-blog page, verify default image displays with correct branding
  - **Effort**: M (4 hours - includes image design)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a developer, I want metadata helper utilities so that metadata generation is DRY and consistent across pages
  - **Acceptance**: Shared utility functions in `lib/metadata.ts` for generating base metadata, merging with page-specific overrides
  - **Depends on**: US1, US2
  - **Effort**: S (2 hours)

- **US5** [P2]: As a site owner, I want section-specific OG images (aviation, dev-startup) so that social shares for those sections reflect their distinct content focus
  - **Acceptance**: Aviation section uses og-aviation.jpg (aviation-themed), dev-startup uses og-dev.jpg (coding-themed), both 1200x630px with brand colors
  - **Depends on**: US3
  - **Effort**: M (5 hours - includes image design)

**Priority 3 (Nice-to-have)**

- **US6** [P3]: As a site owner, I want dynamic OG images for tag pages so that each tag has a custom OG image with the tag name overlaid
  - **Acceptance**: Tag pages dynamically generate OG images with "Posts tagged: [Tag Name]" text on brand-colored background
  - **Depends on**: US1, US3
  - **Effort**: L (10 hours - requires OG image generation library or API)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1, US2, US3 first to ensure all pages have professional social previews. Add US4 for code maintainability, then US5 for enhanced branding. Defer US6 (dynamic OG images) to future iteration based on analytics feedback.

## Success Metrics (HEART Framework)

> **Purpose**: Define quantified success criteria using Google's HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (SQL, logs, Lighthouse).

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Visitors get accurate social previews | Social share clicks vs impressions | Click-through rate from social platforms | >5% CTR from LinkedIn/Twitter | <1% broken preview errors |
| **Engagement** | Improved content discoverability | Social shares increase | Social share button clicks (tracked via GA4 events) | +30% share clicks vs baseline (2 weeks pre/post) | >0 shares per 100 page views |
| **Adoption** | Search engine indexing | Google Search Console impressions | Search impressions for key pages | +20% impressions within 30 days | No drop in average position |
| **Retention** | Repeat visitors from social | Return visits from social referrals | 7-day return rate from social traffic source | >15% return rate | <30% bounce rate from social |
| **Task Success** | Social preview validation | LinkedIn/Twitter debug tools pass | 100% pass rate on social platform validators | 10/10 page types validate successfully | 0 validation errors |

**Performance Targets** (from `design/systems/budgets.md`):
- No performance impact (metadata is server-side, no client JS)
- OG images: <200KB each, served via Caddy with caching
- Lighthouse Performance ≥85, SEO ≥95

**Measurement Plan**:
- Social share CTR: Google Analytics 4 → Acquisition → Social → Platform comparison (impressions vs clicks)
- Share button clicks: GA4 custom events → `select_content` with `content_type: 'social_share'`
- Search impressions: Google Search Console API → Performance report → Compare date ranges (30 days pre/post)
- Social platform validation: Manual test via LinkedIn Post Inspector, Twitter Card Validator, Facebook Sharing Debugger

## Hypothesis

> **Purpose**: State the problem, solution, and predicted improvement.

**Problem**: Currently, only blog posts have comprehensive Open Graph and Twitter Card metadata. Other pages (homepage, aviation, dev-startup, tag pages) lack this metadata, resulting in poor social sharing previews (generic titles, no images, missing descriptions). This reduces click-through rates from social media and limits content discoverability.

- **Evidence**: LinkedIn Post Inspector shows "No image available" for homepage; Twitter Card Validator shows "Summary" card instead of "Summary with Large Image" for aviation page
- **Impact**: All site visitors sharing non-blog content; estimated 40% of social shares are from section pages and homepage

**Solution**: Implement comprehensive Open Graph and Twitter Card metadata on all pages using Next.js Metadata API, following the established pattern from blog posts. Create brand-consistent default OG image and section-specific images.

- **Change**: Add `generateMetadata` or `export const metadata` to all route pages (homepage, aviation, dev-startup, tag pages, newsletter)
- **Mechanism**: Rich social previews increase perceived professionalism and trustworthiness, leading to higher click-through rates from social platforms

**Prediction**: Comprehensive metadata on all pages will increase social share click-through rate from 3% to >5% by providing rich previews with images and clear descriptions.

- **Primary metric**: Social share CTR +67% (3% → 5%)
- **Expected improvement**: +30% social share button clicks within 2 weeks of deployment
- **Confidence**: High (industry standard practice, proven effective on blog posts)

## Context Strategy & Signal Design

Not applicable (no LLM/AI agent context involved - standard web development feature)

## Requirements

### Functional (testable only)

**Root Layout Metadata**

- **FR-001**: Root layout (`app/layout.tsx`) MUST export metadata object with site-wide Open Graph tags including og:site_name ("Marcus Gollahon"), og:locale ("en_US"), og:type ("website")

**Homepage Metadata**

- **FR-002**: Homepage (`app/page.tsx`) MUST export metadata with unique og:title ("Marcus Gollahon | Aviation & Software Development"), og:description (brand mission statement), og:image (default OG image), og:url (site root)

**Section Pages Metadata**

- **FR-003**: Aviation section (`app/aviation/page.tsx`) MUST export metadata with og:title ("Aviation | Marcus Gollahon"), og:description (aviation-focused description), og:image (aviation OG image or default), og:url (/aviation)

- **FR-004**: Dev-startup section (`app/dev-startup/page.tsx`) MUST export metadata with og:title ("Dev & Startup | Marcus Gollahon"), og:description (dev/startup-focused description), og:image (dev OG image or default), og:url (/dev-startup)

**Blog Section Metadata**

- **FR-005**: Blog index (`app/blog/page.tsx`) MUST export metadata with og:title ("Blog | Marcus Gollahon"), og:description (blog description), og:image (default OG image), og:url (/blog)

**Tag Pages Metadata**

- **FR-006**: Tag pages (`app/blog/tag/[tag]/page.tsx`) MUST generate metadata dynamically with og:title ("Posts tagged: [Tag Name] | Marcus Gollahon"), og:description ("Explore all posts about [Tag Name]"), og:image (default OG image), og:url (/blog/tag/[tag])

**Newsletter Page Metadata**

- **FR-007**: Newsletter page (`app/newsletter/page.tsx`) MUST export metadata with og:title ("Newsletter | Marcus Gollahon"), og:description (newsletter value proposition), og:image (default OG image), og:url (/newsletter)

**Twitter Card Metadata**

- **FR-008**: All pages MUST include Twitter Card metadata with twitter:card ("summary_large_image"), twitter:site ("@marcusgoll"), twitter:creator ("@marcusgoll"), twitter:title, twitter:description, twitter:image

**Default OG Image**

- **FR-009**: System MUST provide default OG image at `/images/og-default.jpg` with dimensions 1200x630px, Navy 900 (#0F172A) background, Emerald 600 (#059669) accents, site logo and tagline text

**Canonical URLs**

- **FR-010**: All pages MUST include canonical URL in metadata using NEXT_PUBLIC_SITE_URL environment variable or fallback to relative URL

### Non-Functional

- **NFR-001**: Performance: Metadata generation MUST NOT add >10ms to server-side render time (measured via console.time in development)

- **NFR-002**: Accessibility: OG images MUST have meaningful alt text in metadata for screen reader users

- **NFR-003**: SEO: All metadata MUST validate successfully on LinkedIn Post Inspector, Twitter Card Validator, Facebook Sharing Debugger

- **NFR-004**: Maintainability: Metadata implementation MUST follow DRY principle with shared utility functions in `lib/metadata.ts`

### Key Entities

**Metadata Object** (Next.js type):
- Properties: title, description, openGraph, twitter, alternates.canonical, authors, icons
- Usage: Exported from page.tsx or layout.tsx files
- Relationships: Extends Next.js Metadata type

**OG Image Asset**:
- Properties: filename, dimensions (1200x630), format (JPEG/PNG), size (<200KB)
- Location: `/public/images/og-*.jpg`
- Usage: Referenced in metadata.openGraph.images and metadata.twitter.images

## Deployment Considerations

> **SKIP IF**: No infrastructure changes (cosmetic UI, documentation-only)

**Assessment**: This is a code-only feature with minimal deployment considerations. No infrastructure changes required.

### Platform Dependencies

**Vercel** (not applicable - self-hosted):
- N/A

**Railway** (not applicable - using Hetzner VPS):
- N/A

**Dependencies**:
- None (uses built-in Next.js Metadata API)

### Environment Variables

**New Required Variables**:
- None (NEXT_PUBLIC_SITE_URL already exists for canonical URLs)

**Changed Variables**:
- None

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**:
- No

**Database Schema Changes**:
- No

**Auth Flow Modifications**:
- No

**Client Compatibility**:
- Backward compatible (metadata is server-side, no client changes)

### Migration Requirements

**Database Migrations**:
- No

**Data Backfill**:
- Not required

**RLS Policy Changes**:
- No

**Reversibility**:
- Fully reversible (remove metadata exports, revert to previous state)

### Rollback Considerations

**Standard Rollback**:
- Yes: 3-command rollback via git revert

**Special Rollback Needs**:
- None

**Deployment Metadata**:
- Deploy IDs tracked in specs/053-meta-tags-open-graph/NOTES.md (Deployment Metadata section)

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: Google Analytics 4 API, Google Search Console API, social platform debug tools.

### Data Collection

**Analytics Events** (Google Analytics 4):
- Existing: Page views (automatic)
- Existing: Social share button clicks (if tracked via `select_content` event)
- New: Track social referral source for attribution

**Social Platform Validation** (manual):
- LinkedIn Post Inspector: Test 10 page types before and after deployment
- Twitter Card Validator: Test all page types
- Facebook Sharing Debugger: Verify previews render correctly

**Search Console** (API access):
- Impressions: Track search impressions for key pages over 30-day periods
- Average position: Monitor average position for target keywords
- CTR: Track click-through rate from search results

### Measurement Queries

**Google Analytics 4** (GA4 Data API):
```javascript
// Social share click-through rate
// Metric: (social referral page views / social platform impressions) * 100
// Source: GA4 → Acquisition → Traffic acquisition → Source/medium breakdown
// Filter: source = (linkedin / twitter / facebook)
// Calculation: Manually compare clicks (GA4 sessions) vs platform impressions (LinkedIn/Twitter analytics)
```

**Google Search Console API**:
```javascript
// Search impressions comparison (30 days pre/post deployment)
const query = {
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  dimensions: ['page'],
  metrics: ['impressions', 'clicks', 'ctr', 'position']
};
// Compare with baseline: 2025-10-01 to 2025-10-31
// Target: +20% impressions for homepage, aviation, dev-startup pages
```

**Social Platform Debug Tools** (manual validation):
```bash
# LinkedIn Post Inspector
# URL: https://www.linkedin.com/post-inspector/
# Input: Test all 10 page types
# Expected: Rich preview with title, description, image for all

# Twitter Card Validator
# URL: https://cards-dev.twitter.com/validator
# Input: Test all page types
# Expected: summary_large_image card with 1200x630 image

# Facebook Sharing Debugger
# URL: https://developers.facebook.com/tools/debug/
# Input: Test homepage, blog, sections
# Expected: og:image renders at 1200x630, all tags present
```

### Experiment Design (A/B Test)

**Not applicable**: This is an infrastructure feature (metadata), not a user-facing experiment. All pages will receive metadata updates simultaneously. Success measured via before/after comparison (30 days pre-deployment vs 30 days post-deployment).

**Validation Approach**:
1. **Baseline measurement** (1 week before deployment):
   - Social share CTR from GA4
   - Search impressions from Search Console
   - Manual validation: Run all page URLs through LinkedIn/Twitter validators (expect failures)

2. **Deployment** (single release):
   - Deploy metadata updates to all pages
   - Clear social platform caches (LinkedIn/Twitter/Facebook debug tools)
   - Manual validation: Re-run all URLs through validators (expect success)

3. **Post-deployment monitoring** (30 days):
   - Daily: Monitor GA4 social referral traffic
   - Weekly: Check Search Console impressions trends
   - End of period: Compare metrics to baseline, calculate improvement percentage

**Kill Switch**: Not required (metadata is non-breaking, can be reverted without user impact)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, UX, data, access) - Brand colors and mission used in OG images
- [x] No implementation details (tech stack, APIs, code) - Spec focuses on requirements, not how to implement

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources - GA4, Search Console API, social validators
- [x] Hypothesis stated (Problem → Solution → Prediction) - CTR improvement from 3% to 5%

### Conditional: UI Features (Skip if backend-only)
- [x] Skipped - No UI changes (metadata only)

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Skipped - No infrastructure changes (code-only, fully reversible)

## Out of Scope

The following are explicitly **not** included in this feature and may be considered for future iterations:

1. **Dynamic OG image generation**: Generating unique OG images for each blog post or tag page using libraries like `@vercel/og` or Puppeteer (deferred to US6, P3)

2. **Article schema beyond blog posts**: Implementing `article` type Open Graph tags for non-blog content (aviation guides, dev tutorials if added as structured content later)

3. **Multi-language metadata**: Implementing alternate language tags (og:locale:alternate) for future internationalization

4. **JSON-LD structured data for non-blog pages**: Adding Schema.org Organization, Person, or WebSite schemas to homepage (may be added in future SEO iteration)

5. **Preview image customization UI**: Admin interface to upload custom OG images per page (would require CMS integration)

6. **A/B testing of OG images**: Testing different OG image designs to optimize CTR (requires experimentation framework)

7. **Social media meta pixel integration**: Facebook Pixel, LinkedIn Insight Tag, Twitter conversion tracking (separate analytics feature)

## Assumptions

1. **NEXT_PUBLIC_SITE_URL is set**: Assumes production environment has `NEXT_PUBLIC_SITE_URL=https://marcusgoll.com` configured for canonical URLs and absolute image URLs

2. **Static OG images sufficient**: Assumes default and section-specific OG images (3-5 static images) are sufficient for MVP; dynamic generation deferred to future iteration

3. **Twitter handle is @marcusgoll**: Assumes site owner's Twitter handle for twitter:site and twitter:creator tags

4. **Social platform caching**: Assumes understanding that social platforms cache OG data; updates require using debug tools to refresh cache (LinkedIn Post Inspector, Facebook Sharing Debugger)

5. **Self-hosted image serving**: Assumes Caddy reverse proxy on Hetzner VPS can efficiently serve OG images (<200KB) with appropriate caching headers

6. **No CMS integration needed**: Assumes content creators are comfortable adding/updating metadata in code (Next.js page files) rather than via CMS UI

## Dependencies

**Blocked by**: None (GitHub Issue #13 lists `tech-stack-cms-integration`, `homepage-post-feed`, `individual-post-pages` as blockers, but these are already completed - blog posts have full metadata implementation)

**Blocks**: Future SEO enhancements (structured data for Organization, breadcrumbs on non-blog pages)

**Related Features**:
- **002-blog-post-enhancements**: Blog posts already have comprehensive metadata (reference implementation)
- **051-newsletter-signup**: Newsletter page will receive metadata as part of this feature

## Technical Notes

**Next.js Metadata API Patterns**:

1. **Static metadata** (for pages with fixed content):
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: { /* OG tags */ },
  twitter: { /* Twitter tags */ }
};
```

2. **Dynamic metadata** (for pages with route params):
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch data based on params
  return {
    title: `Dynamic Title`,
    openGraph: { /* OG tags */ }
  };
}
```

3. **Metadata inheritance**:
- Root layout metadata serves as base
- Page-specific metadata merges with and overrides parent
- Use `metadataBase` in root layout for absolute URL resolution

**OG Image Best Practices**:
- Dimensions: 1200x630px (1.91:1 aspect ratio) for optimal display
- Format: JPEG (smaller file size) or PNG (if transparency needed)
- File size: <200KB for fast loading
- Content: High contrast text, readable at small sizes (preview thumbnails)
- Branding: Include logo or site identifier for recognition

**Social Platform Cache Invalidation**:
- LinkedIn: Use Post Inspector (https://www.linkedin.com/post-inspector/)
- Twitter: Use Card Validator (https://cards-dev.twitter.com/validator)
- Facebook: Use Sharing Debugger (https://developers.facebook.com/tools/debug/)
- Force refresh by entering URL and clicking "Fetch new information" or "Request new scrape"

## References

- **Next.js Metadata API**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Open Graph Protocol**: https://ogp.me/
- **Twitter Card Documentation**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Google Search Console**: https://search.google.com/search-console
- **Existing Implementation**: `app/blog/[slug]/page.tsx` (lines 72-127) - Reference for metadata structure
