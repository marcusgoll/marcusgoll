# Feature Specification: Homepage Redesign

**Branch**: `quick/brand-color-tokens-core-hex`
**Created**: 2025-10-29
**Status**: Draft

## User Scenarios

### Primary User Story
A visitor lands on marcusgoll.com and immediately understands Marcus's dual expertise (Aviation + Dev/Startup), sees compelling content from both tracks, and can easily discover relevant posts based on their interests. The modern, polished design reflects brand quality and systematic thinking while providing clear navigation and engagement opportunities.

### Acceptance Scenarios
1. **Given** a new visitor lands on homepage, **When** they view above-the-fold content, **Then** they see a hero section with value proposition, brand identity, and primary CTA within 2 seconds
2. **Given** a visitor interested in aviation content, **When** they use content track filtering, **Then** they see only aviation-tagged posts without page reload
3. **Given** a visitor exploring the site, **When** they scroll the homepage, **Then** they encounter featured content showcase, recent posts grid, and "What I'm building" section in logical order
4. **Given** a mobile visitor, **When** they open navigation menu, **Then** they see responsive mobile menu with track filters and newsletter signup
5. **Given** a visitor wants to stay updated, **When** they see newsletter CTA, **Then** they can subscribe with email in prominent, accessible form

### Edge Cases
- What happens when Ghost CMS has no posts tagged with selected filter?
- How does system handle hero section with missing featured post data?
- What occurs when "What I'm building" project status is not "active"?
- How does layout adapt on screens between mobile and desktop breakpoints (768px-1024px)?
- What happens if newsletter signup form submission fails?

## User Stories (Prioritized)

> **Purpose**: Break down feature into independently deliverable stories for MVP-first delivery.
> **Format**: [P1] = MVP (ship first), [P2] = Enhancement, [P3] = Nice-to-have

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a visitor, I want to see a modern hero section with brand identity so that I immediately understand who Marcus is and what value he provides
  - **Acceptance**:
    - Hero displays headline, tagline, and primary CTA above fold (<600px height)
    - Navy background palette applied with proper contrast ratios (WCAG AA)
    - Responsive design works 320px-1440px+ viewports
    - Page loads with FCP <1.5s, LCP <2.5s
  - **Independent test**: Load homepage, verify hero displays without JavaScript, check accessibility tree
  - **Effort**: M (6 hours)

- **US2** [P1]: As a visitor, I want to filter posts by content track (Aviation/Dev) so that I can quickly find relevant content for my interests
  - **Acceptance**:
    - Filter buttons show post counts for each track
    - Clicking filter updates visible posts instantly (no page reload)
    - URL updates with filter parameter (shareable links)
    - "All" filter shows all posts
    - Clear visual feedback for active filter
  - **Independent test**: Click Aviation filter, verify only aviation posts visible, check URL param, test browser back/forward
  - **Effort**: M (5 hours)

- **US3** [P1]: As a visitor, I want to see a grid of recent blog posts so that I can browse latest content
  - **Acceptance**:
    - Grid displays 6-9 most recent posts with thumbnails, titles, excerpts
    - Posts show metadata (date, track tag, read time)
    - Responsive: 1 column mobile, 2 tablet, 3 desktop
    - Links to full blog post
  - **Independent test**: Render recent posts, verify images lazy load, check responsive breakpoints
  - **Effort**: S (4 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a visitor, I want to see 1-3 featured posts prominently so that I discover Marcus's best content
  - **Acceptance**:
    - Featured posts have larger cards or hero treatment
    - Manual curation via Ghost CMS (featured flag or specific tag)
    - Different visual treatment from recent posts grid
    - Featured section appears before recent posts
  - **Depends on**: US1, US3
  - **Effort**: M (5 hours)

- **US5** [P2]: As a visitor, I want to see a "What I'm building" project card so that I understand Marcus's current startup projects
  - **Acceptance**:
    - Card displays project name (CFIPros.com), tagline, status (active/shipped)
    - Includes CTA to visit project or read build log
    - Status indicator visually distinct (green for active)
    - Only displays when status is "active"
  - **Depends on**: US3
  - **Effort**: S (3 hours)

- **US6** [P2]: As a visitor, I want a prominent newsletter signup CTA so that I can stay updated with Marcus's content
  - **Acceptance**:
    - Newsletter form appears in hero section or sticky sidebar
    - Form has email input and submit button
    - Success/error feedback messages
    - Integrates with existing newsletter system
    - GDPR-compliant (privacy policy link)
  - **Depends on**: US1
  - **Effort**: M (4 hours)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a mobile visitor, I want an improved navigation menu so that I can easily navigate and filter content on small screens
  - **Acceptance**:
    - Hamburger menu icon in header
    - Slide-out or overlay menu with smooth animation
    - Menu includes content track filters
    - Keyboard accessible (Esc to close, focus trap)
    - Close on navigation or filter selection
  - **Depends on**: US1, US2
  - **Effort**: M (5 hours)

- **US8** [P3]: As a visitor, I want smooth scroll animations so that page feels polished and professional
  - **Acceptance**:
    - Sections fade in on scroll (intersection observer)
    - Respects prefers-reduced-motion
    - Animations add <50ms to interaction time
    - Graceful degradation if JS disabled
  - **Depends on**: US1, US3, US4
  - **Effort**: S (3 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (hero + filtering + recent posts grid = functional homepage), validate with users, then incrementally add US4-US6 (featured posts + project card + newsletter) based on feedback. US7-US8 are polish for Phase 6.

## Visual References

See `./visuals/README.md` for UI research and design patterns (if applicable)

## Success Metrics (HEART Framework)

> **Purpose**: Define quantified success criteria using Google's HEART framework.
> **Constraint**: All metrics MUST be Claude Code-measurable (SQL, logs, Lighthouse).

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Reduce bounce rate | Time on site increases | Avg session duration | >2min (currently ~1.2min) | <3s LCP, <0.15 CLS |
| **Engagement** | Increase content discovery | Track filter usage | Filter click rate | >40% visitors use filters | <5% filter errors |
| **Adoption** | Grow newsletter subscribers | Newsletter signups | Signup conversion rate | >5% of visitors (currently 2%) | <$3 CAC via newsletter |
| **Retention** | Increase repeat visitors | Return visits within 30 days | 30-day return rate | >25% (currently ~15%) | <20%/month churn |
| **Task Success** | Improve content findability | Post click-through | Homepage → blog CTR | >35% (currently ~20%) | <10s to find relevant post |

**Performance Targets** (from `design/systems/budgets.md`):
- FCP <1.5s, TTI <3.5s, CLS <0.15, LCP <2.5s
- Lighthouse Performance ≥85, Accessibility ≥95

See `.spec-flow/templates/heart-metrics-template.md` for full measurement plan.

## Screens Inventory (UI Features Only)

> **Purpose**: Define screens for `/design-variations` workflow (Phase 1).

Screens to design:
1. **homepage-hero**: Hero section - Primary action: "Read Latest" or "Subscribe"
2. **homepage-filter-bar**: Content track filter - Primary action: Select filter
3. **homepage-featured**: Featured content showcase - Primary action: "Read Article"
4. **homepage-grid**: Recent posts grid - Primary action: Click post card
5. **homepage-project-card**: "What I'm building" section - Primary action: "Visit Project"
6. **homepage-newsletter**: Newsletter signup CTA - Primary action: "Subscribe"
7. **homepage-mobile-nav**: Mobile navigation menu - Primary action: Filter selection

States per screen: `default`, `loading`, `empty`, `error`

See `.spec-flow/templates/screens-yaml-template.yaml` for full screen definitions.

## Hypothesis

> **Purpose**: State the problem, solution, and predicted improvement.
> **Format**: Problem → Solution → Prediction (with magnitude)

**Problem**: Current homepage design is outdated and doesn't effectively surface dual-track content (Aviation + Dev/Startup), leading to high bounce rates and poor content discovery
- Evidence:
  - Bounce rate ~55% (industry avg ~40%)
  - Avg session duration ~1.2min (target >2min)
  - No clear content filtering → visitors miss relevant content
  - Outdated visual design doesn't reflect brand quality
- Impact: Visitors don't understand value proposition, can't find relevant content, don't convert to newsletter subscribers

**Solution**: Modernize homepage with brand tokens (navy palette), add hero section with clear value proposition, implement content track filtering (Aviation/Dev), showcase featured posts, and prominently display newsletter CTA
- Change:
  - Hero section with brand identity + primary CTA
  - Content track filtering (client-side, no reload)
  - Featured posts section (manual curation)
  - Recent posts grid with improved layout
  - "What I'm building" project card
  - Prominent newsletter signup
- Mechanism: Clear value proposition reduces confusion, filtering improves content discovery, modern design builds trust, newsletter CTA increases conversions

**Prediction**: New homepage design will reduce bounce rate from 55% to <45% and increase newsletter signups from 2% to >5% by improving content discovery and brand perception
- Primary metric: Newsletter signup conversion rate: 2% → >5% (+150% increase)
- Secondary metric: Bounce rate: 55% → <45% (-18% reduction)
- Tertiary metric: Homepage → blog CTR: 20% → >35% (+75% increase)
- Expected improvement: +150% newsletter signups, -18% bounce rate, +75% blog CTR
- Confidence: High (similar pattern in design-inspirations.md, proven track filtering UX pattern)

## Context Strategy & Signal Design

- **System prompt altitude**: Component-level UI implementation with brand token awareness
- **Tool surface**: Read (brand docs, UI components), Edit (components), Glob (find existing patterns), Grep (find usage examples) - token-efficient tools only
- **Examples in scope**: ≤3 canonical examples (Hero component, filter bar, post card)
- **Context budget**: Target 50k tokens for planning phase (homepage redesign = high UI complexity)
- **Retrieval strategy**: JIT (just-in-time) for component patterns, upfront for brand tokens and color palette
- **Memory artifacts**: `NOTES.md` updated after each phase checkpoint (design decisions, component choices), no TODO.md (use tasks.md from /tasks phase)
- **Compaction cadence**: After research if >40k tokens, preserve brand decisions and component inventory
- **Sub-agents**: None (single-page UI redesign, no backend/API changes)

## Requirements

### Functional (testable only)

- **FR-001**: System MUST display hero section with headline, tagline, and primary CTA above fold (<600px viewport height)
- **FR-002**: System MUST render content track filter bar with "All", "Aviation", and "Dev/Startup" options showing post counts
- **FR-003**: Users MUST be able to filter posts by clicking track filter buttons without page reload (client-side filtering)
- **FR-004**: System MUST update URL query parameter when filter is selected to enable shareable filtered views
- **FR-005**: System MUST display 6-9 most recent blog posts in responsive grid (1 col mobile, 2 tablet, 3 desktop)
- **FR-006**: System MUST render post cards with thumbnail, title, excerpt, date, track tag, and read time
- **FR-007**: System MUST display 1-3 manually curated featured posts with larger card treatment before recent posts grid
- **FR-008**: System MUST render "What I'm building" project card when project status is "active" with project name, tagline, status indicator, and CTA
- **FR-009**: System MUST display newsletter signup form with email input, submit button, and success/error feedback
- **FR-010**: System MUST apply navy background brand palette (Navy 900 #0F172A, Emerald 600 #059669) consistently across all homepage sections
- **FR-011**: System MUST render responsive mobile navigation menu with track filters accessible via hamburger icon on <768px viewports
- **FR-012**: System MUST lazy-load post thumbnail images below fold to improve initial page load performance

### Non-Functional

- **NFR-001**: Performance: First Contentful Paint (FCP) <1.5s, Largest Contentful Paint (LCP) <2.5s, Cumulative Layout Shift (CLS) <0.15 on 3G connection
- **NFR-002**: Accessibility: Meet WCAG 2.1 Level AA standards (color contrast ≥4.5:1 for text, keyboard navigation support, screen reader compatibility)
- **NFR-003**: Mobile: Fully responsive design supporting 320px-1440px+ viewports with touch-friendly tap targets (≥44x44px)
- **NFR-004**: Error Handling: Graceful degradation if JavaScript disabled (hero and posts grid still visible), clear error messages for newsletter signup failures
- **NFR-005**: SEO: Maintain existing schema.org markup (WebSite, Organization), preserve meta tags, ensure semantic HTML
- **NFR-006**: Performance Budget: Total page weight <2MB, JavaScript bundle <500KB, CSS <100KB
- **NFR-007**: Browser Support: Latest 2 versions of Chrome, Firefox, Safari, Edge + iOS Safari 14+, Chrome Android

### Key Entities (if data involved)

- **Post**: Content item from Ghost CMS with title, slug, excerpt, feature_image, published_at, tags (aviation|dev-startup), reading_time
  - Attributes: `id`, `title`, `slug`, `excerpt`, `feature_image`, `published_at`, `tags[]`, `reading_time`, `featured` (boolean)
  - Relationships: Belongs to author (Marcus), has many tags

- **Project**: Current startup project (CFIPros.com) with name, tagline, status, URL
  - Attributes: `name`, `tagline`, `status` (active|shipped|paused), `url`, `description`
  - Hardcoded in config or CMS (single active project at a time)

- **Newsletter Subscription**: Email subscription for content updates
  - Attributes: `email`, `subscribed_at`, `status` (active|unsubscribed), `source` (homepage-hero|homepage-sidebar)
  - Integration: Existing newsletter system (ConvertKit/Mailchimp)

## Deployment Considerations

> **SKIP IF**: No infrastructure changes (cosmetic UI, documentation-only)
> **Purpose**: Document deployment constraints and dependencies for planning phase.

### Platform Dependencies

**Vercel** (marcusgoll.com):
- No platform dependency changes (static site generation with ISR)
- Deployment: Standard Next.js build

**Railway** (API):
- Not applicable (no API changes)

**Dependencies**:
- No new dependencies required (use existing Next.js, React, Ghost Content API client)

### Environment Variables

**New Required Variables**:
- None (uses existing Ghost CMS API credentials)

**Changed Variables**:
- None

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**:
- No API changes (uses existing Ghost Content API read-only endpoints)

**Database Schema Changes**:
- No database changes (Ghost CMS schema unchanged)

**Auth Flow Modifications**:
- No auth changes (public homepage, no authentication required)

**Client Compatibility**:
- Backward compatible (progressive enhancement approach, works without JS for core content)

### Migration Requirements

**Database Migrations**:
- No migrations required

**Data Backfill**:
- Not required (uses existing Ghost CMS post data)

**RLS Policy Changes**:
- Not applicable (no database changes)

**Reversibility**:
- Fully reversible via git revert (UI-only changes, no data migrations)

### Rollback Considerations

**Standard Rollback**:
- Yes: Standard 3-command rollback via Vercel deployment history or git revert

**Special Rollback Needs**:
- None (UI-only changes, no breaking changes, no data migrations)

**Deployment Metadata**:
- Deploy IDs tracked in specs/055-homepage-redesign/NOTES.md (Deployment Metadata section)

---

## Measurement Plan

> **Purpose**: Define how success will be measured using Claude Code-accessible sources.
> **Sources**: SQL queries, structured logs, Lighthouse CI, database aggregates.

### Data Collection

**Analytics Events** (dual instrumentation):
- PostHog (dashboards): `posthog.capture(event_name, properties)`
- Structured logs (Claude measurement): `logger.info({ event, ...props })`
- Database (A/B tests): `db.featureMetrics.create({ feature, variant, outcome, value })`

**Key Events to Track**:
1. `homepage.page_view` - Engagement (track source: direct, organic, referral)
2. `homepage.filter_click` - Task Success (track: filter selected, post count)
3. `homepage.post_click` - Task Success (track: post slug, position, filtered view)
4. `homepage.newsletter_signup` - Adoption (primary metric)
5. `homepage.project_card_click` - Engagement (track: project name, CTA clicked)
6. `homepage.error` - Happiness (inverse) (track: error type, component)

### Measurement Queries

**SQL** (`specs/055-homepage-redesign/design/queries/*.sql`):
- Newsletter signup conversion: `SELECT COUNT(*) FILTER (WHERE event='homepage.newsletter_signup') * 100.0 / COUNT(*) FILTER (WHERE event='homepage.page_view') FROM analytics_events WHERE date >= '2025-11-01'`
- Filter usage rate: `SELECT COUNT(DISTINCT session_id) FILTER (WHERE event='homepage.filter_click') * 100.0 / COUNT(DISTINCT session_id) FILTER (WHERE event='homepage.page_view') FROM analytics_events WHERE date >= '2025-11-01'`
- Homepage → blog CTR: `SELECT COUNT(*) FILTER (WHERE event='homepage.post_click') * 100.0 / COUNT(*) FILTER (WHERE event='homepage.page_view') FROM analytics_events WHERE date >= '2025-11-01'`

**Logs** (`logs/metrics/*.jsonl`):
- Event counts: `grep '"feature":"homepage-redesign"' logs/metrics/*.jsonl | jq -r '.event' | sort | uniq -c`
- Error rate: `grep '"event":"homepage.error"' logs/metrics/*.jsonl | wc -l` / total events * 100
- Session duration P50/P95: `jq -r 'select(.event=="homepage.page_view") | .session_duration' logs/metrics/*.jsonl | sort -n | awk '{a[NR]=$1} END {print "P50:", a[int(NR*0.50)], "P95:", a[int(NR*0.95)]}'`

**Lighthouse** (`.lighthouseci/results/*.json`):
- Performance: `jq '.categories.performance.score' .lighthouseci/results/lhr-*.json | awk '{sum+=$1; count++} END {print sum/count}'`
- FCP/LCP/CLS: `jq '.audits["first-contentful-paint"].numericValue, .audits["largest-contentful-paint"].numericValue, .audits["cumulative-layout-shift"].numericValue' .lighthouseci/results/lhr-*.json`

### Experiment Design (A/B Test)

**Variants**:
- Control: Current homepage (outdated design, no filtering, old layout)
- Treatment: New homepage (hero section, track filtering, featured posts, project card, newsletter CTA)

**Ramp Plan**:
1. Internal (Days 1-3): Test with personal devices, ~5 users, monitor errors
2. 10% (Days 4-7): Random 10%, monitor filter usage and newsletter signups
3. 50% (Days 8-14): Accumulate statistical power for conversion metrics
4. 100% (Days 15+): Full rollout if newsletter signups >4% and no critical errors

**Kill Switch**: Error rate >5% OR LCP >4s OR newsletter signup rate <1.5% → instant rollback

**Sample Size**: ~385 visitors per variant (5% → 7% MDE, 80% power, α=0.05) - estimated 7-10 days to reach

See `.spec-flow/templates/experiment-design-template.md` for full plan.

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, UX, data, access)
- [x] No implementation details (tech stack, APIs, code)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources
- [x] Hypothesis stated (Problem → Solution → Prediction)

### Conditional: UI Features (Skip if backend-only)
- [x] All screens identified with states (default, loading, error)
- [x] System components from ui-inventory.md planned (to be checked in planning phase)

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (API, schema, migrations) - None identified
- [x] Environment variables documented (staging + production values) - None required
- [x] Rollback plan specified - Standard rollback via git revert
