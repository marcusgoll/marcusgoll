# Specification: Ghost CMS Migration to Next.js

**Feature**: Ghost CMS Migration to Next.js
**Slug**: ghost-cms-migration
**Number**: 002
**GitHub Issue**: #32
**Created**: 2025-10-21
**Status**: In Progress

---

## Purpose

Migrate marcusgoll.com to a headless Ghost CMS + Next.js architecture to enable systematic content management for dual-track brand content (Aviation + Dev/Startup) while maintaining full control over frontend design, user experience, and brand consistency.

---

## Context

### Current State

- Personal website built with Next.js 15.5.6
- Ghost Content API client already exists (`lib/ghost.ts`)
- 35 existing aviation posts need to be organized
- Brand identity established (Navy 900 + Emerald 600, Work Sans typography)
- Dual-track content strategy defined (40% aviation, 40% dev/startup, 20% cross-pollination)

### Problem

Without a CMS, content management requires code changes and deployments. There's no systematic way to organize dual-track content or enable non-technical content updates.

### Solution

Implement headless Ghost CMS as content backend while keeping Next.js frontend for complete design control. Use Ghost's tagging system to organize dual-track content, and leverage existing Ghost API client for seamless integration.

---

## User Scenarios

### Scenario 1: Content Creator Publishing Aviation Article

**Given** I am Marcus writing a new flight training article
**When** I publish the article in Ghost Admin with `aviation` and `flight-training` tags
**Then** the article appears on the Aviation hub page within 60 seconds
**And** the article displays the aviation track badge (Sky Blue)
**And** the article is indexed in the correct content track for analytics

### Scenario 2: Visitor Exploring Dual-Track Content

**Given** I am a visitor landing on the homepage
**When** I view the dual-track showcase section
**Then** I see clear separation between Aviation and Dev/Startup content
**And** I can click "Explore Aviation" to see flight training content
**And** I can click "Explore Dev/Startup" to see building-in-public content
**And** each section displays the most recent 5 posts from that track

### Scenario 3: Content Organization with Tags

**Given** I have 35 existing aviation posts in Ghost
**When** I bulk-tag them with `aviation` primary tag
**And** I add secondary category tags (`flight-training`, `cfi-resources`, `career-path`)
**Then** posts are automatically categorized by content track
**And** posts appear in appropriate hub page sections
**And** tag filtering works on archive pages

### Scenario 4: Cross-Pollination Content Discovery

**Given** I am writing an article about "Code Review Like a Flight Instructor"
**When** I tag it with both `aviation` and `dev-startup` tags plus `cross-pollination`
**Then** the article appears on both Aviation and Dev/Startup hub pages
**And** the article displays a gradient badge indicating cross-pollination
**And** analytics track engagement with cross-pollination content

### Scenario 5: Performance with Static Generation

**Given** Ghost CMS has 100+ published posts
**When** a visitor requests a hub page
**Then** the page loads in under 2 seconds (First Contentful Paint)
**And** content is statically generated with ISR (60-second revalidation)
**And** API calls to Ghost are minimized through caching

---

## Requirements

### Functional Requirements

#### Content Management

- **FR-001**: Ghost Admin shall be configured with primary content track tags: `aviation`, `dev-startup`, `cross-pollination`
- **FR-002**: Secondary category tags shall be created for each track (aviation: flight-training, cfi-resources, career-path; dev-startup: building-in-public, systematic-development, tutorials)
- **FR-003**: All 35 existing aviation posts shall be tagged with `aviation` + appropriate category tags
- **FR-004**: Ghost navigation shall be configured with dual-track structure (Aviation, Dev/Startup, Blog, About, Contact)
- **FR-005**: Tag hierarchy shall support both primary (track) + secondary (category) tagging on each post

#### Frontend Components

- **FR-006**: Homepage shall display dual-track hero section with clear value proposition for both tracks
- **FR-007**: Aviation hub page shall display content organized by category (Flight Training, CFI Resources, Career Path)
- **FR-008**: Dev/Startup hub page shall display content organized by category (Building in Public, Systematic Development, Tutorials)
- **FR-009**: TrackBadge component shall display track indicator with brand colors (Aviation: Sky Blue #0EA5E9, Dev/Startup: Emerald 600 #059669, Cross-Pollination: gradient)
- **FR-010**: PostCard component shall display post title, excerpt, featured image, author, date, and track badge
- **FR-011**: All new components shall follow brand guidelines (Navy 900 primary, Emerald 600 secondary, Work Sans typography)

#### Data Integration

- **FR-012**: Ghost Content API client shall fetch posts filtered by tag using existing `getPostsByTag()` function
- **FR-013**: Hub pages shall use Incremental Static Regeneration (ISR) with 60-second revalidation
- **FR-014**: Single post pages shall be statically generated at build time with ISR fallback
- **FR-015**: Helper function `getPrimaryTrack(tags)` shall determine content track from post tags

#### Analytics & Tracking

- **FR-016**: Custom analytics events shall track content track engagement (aviation vs dev-startup clicks)
- **FR-017**: Analytics events shall track newsletter signups with track attribution
- **FR-018**: Analytics events shall track external link clicks (e.g., to CFIPros.com)
- **FR-019**: Page views shall be tracked with content track metadata

### Non-Functional Requirements

#### Performance

- **NFR-001**: First Contentful Paint shall be under 2 seconds
- **NFR-002**: Largest Contentful Paint shall be under 3 seconds
- **NFR-003**: Ghost API response times shall be under 200ms p50, 500ms p95
- **NFR-004**: ISR revalidation shall occur every 60 seconds to balance freshness and performance

#### Accessibility

- **NFR-005**: All components shall meet WCAG 2.1 Level AA standards
- **NFR-006**: Color contrast ratios shall be minimum 4.5:1 for text, 3:1 for UI components
- **NFR-007**: All interactive elements shall support keyboard navigation
- **NFR-008**: Track badges shall have sufficient contrast against backgrounds

#### Brand Consistency

- **NFR-009**: All visual elements shall use defined brand colors (Navy 900, Emerald 600, Sky Blue for aviation)
- **NFR-010**: Typography shall use Work Sans for headings/body, JetBrains Mono for code
- **NFR-011**: Spacing shall follow 8px base unit increments
- **NFR-012**: Component design shall reflect systematic clarity (aviation checklist-inspired)

#### Security

- **NFR-013**: Ghost Content API key shall be stored in environment variables
- **NFR-014**: API calls shall use read-only Content API (not Admin API)
- **NFR-015**: Environment variables shall not be committed to version control

#### Maintainability

- **NFR-016**: Component code shall be under 50 lines per function, 300 lines per component
- **NFR-017**: CSS modules shall be used for component styling (scoped, no conflicts)
- **NFR-018**: Ghost tag structure shall be documented in Ghost Admin descriptions

---

## Context Strategy & Signal Design

### Content Track Attribution

**Problem**: How do we determine which content track a post belongs to when it has multiple tags?

**Strategy**: Use primary tag hierarchy with fallback logic
- Check for `aviation` tag first
- Check for `dev-startup` tag second
- Check for `cross-pollination` tag third
- Return null if no track tag found

**Signal**: `getPrimaryTrack(tags)` helper function returns string: 'aviation' | 'dev-startup' | 'cross-pollination' | null

**Rationale**: Explicit tag-based attribution allows flexible content organization and clear analytics tracking

### ISR Revalidation Timing

**Problem**: How do we balance content freshness with performance and Ghost API rate limits?

**Strategy**: 60-second ISR revalidation
- Static generation at build time for all published posts
- On-demand revalidation every 60 seconds
- Stale-while-revalidate pattern (serve cached, update in background)

**Signal**: `revalidate: 60` in getStaticProps

**Rationale**: 60 seconds provides near-real-time updates without excessive API calls; blog posts don't require instant publishing

### Analytics Event Naming

**Problem**: How do we structure custom events for dual-track content analysis?

**Strategy**: Structured event names with track parameter
- Event: `content_track_click` with parameters: `{track: 'aviation', location: 'homepage'}`
- Event: `newsletter_signup` with parameters: `{track: 'aviation', location: 'hub-page'}`
- Event: `external_link_click` with parameters: `{destination: 'cfipros.com', location: 'blog-post'}`

**Signal**: Google Analytics 4 custom events with structured parameters

**Rationale**: Enables detailed funnel analysis per content track while maintaining consistent event structure

---

## Success Criteria

### Content Management Success

1. All 35 existing aviation posts are tagged and categorized in Ghost Admin
2. New posts can be published through Ghost Admin without code changes
3. Content appears on appropriate hub pages within 60 seconds of publishing
4. Tag structure is documented and maintainable by non-technical users

### User Experience Success

1. Visitors can clearly distinguish between Aviation and Dev/Startup content on homepage
2. Hub pages display content organized by meaningful categories
3. Track badges provide clear visual indicators of content type
4. Navigation allows easy filtering by content track and category

### Performance Success

1. Homepage loads in under 2 seconds (First Contentful Paint)
2. Hub pages load in under 2 seconds despite displaying 15+ posts
3. Ghost API calls are minimized through static generation and ISR
4. Lighthouse performance score is 90+ across all pages

### Analytics Success

1. Custom events track content track engagement separately
2. Analytics dashboard shows conversion funnel per content track
3. Newsletter signup attribution identifies which track drove the conversion
4. Cross-pollination content engagement is measurable

---

## Out of Scope

The following items are explicitly excluded from this feature:

1. **Ghost Theme Development**: Using Ghost's built-in theming system (we're using headless mode with custom Next.js frontend)
2. **Comment System**: Post comments/discussion features (can be added later)
3. **Newsletter Integration**: Ghost's built-in newsletter features (using external service like ConvertKit)
4. **Member/Subscription Management**: Ghost's membership/paywall features (content is free)
5. **Content Migration Automation**: Automated scripts to migrate existing posts (manual tagging is acceptable for 35 posts)
6. **Multi-Author Support**: Multiple author accounts in Ghost (single author: Marcus)
7. **Content Scheduling**: Advanced publish scheduling beyond Ghost's basic features
8. **Search Functionality**: Full-text search across posts (can be added in future feature)
9. **Related Posts**: Algorithmic related post suggestions (simple tag-based related posts acceptable)
10. **Ghost Admin Customization**: Custom Ghost Admin UI or workflows

---

## Assumptions

1. **Ghost CMS Instance**: A Ghost CMS instance is already provisioned and accessible (self-hosted or Ghost Pro)
2. **Content API Access**: Ghost Content API key is available for authentication
3. **Existing Posts Format**: 35 aviation posts are already in Ghost in a format compatible with tagging
4. **Image Hosting**: Ghost handles image uploads and CDN delivery for post featured images
5. **Analytics Account**: Google Analytics 4 account is set up and tracking code installed
6. **Domain Configuration**: marcusgoll.com domain is configured to point to Next.js deployment
7. **Performance Baseline**: Current Next.js site performance is acceptable and will not degrade with Ghost integration
8. **Brand Assets**: Professional headshot and brand imagery are available in required formats

---

## Dependencies

### External Services

- **Ghost CMS**: Content management backend (self-hosted or Ghost Pro)
- **Vercel**: Deployment platform for Next.js (based on remote-direct deployment model)
- **Google Analytics 4**: Analytics and event tracking
- **Ghost CDN**: Image hosting and delivery

### Technical Dependencies

- `@tryghost/content-api@^1.12.0`: Ghost Content API client (already installed)
- `next@^15.5.6`: Next.js framework (already installed)
- `react@^19.2.0`: React library (already installed)
- Node.js 18+ runtime environment

### Content Dependencies

- 35 existing aviation posts need to be accessible in Ghost Admin
- Professional headshot image for hero section
- Brand logo/favicon assets

---

## Deployment Considerations

### Platform Dependencies

- **Vercel**: No changes to deployment configuration needed
- **Next.js Build**: Build process includes static generation of all post pages
- **ISR Configuration**: Incremental Static Regeneration enabled (already supported by Vercel)

### Environment Variables

**New Variables Required**:
- `GHOST_API_URL`: Ghost CMS instance URL (e.g., `https://your-ghost-site.com`)
- `GHOST_CONTENT_API_KEY`: Ghost Content API key for authentication
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 measurement ID (may already exist)
- `NEXT_PUBLIC_SITE_URL`: Production site URL (e.g., `https://marcusgoll.com`)

**Configuration**: Add to Vercel environment variables dashboard

### Breaking Changes

**None**: This is a new integration that doesn't modify existing Next.js functionality

### Migration Required

**Content Migration**:
1. Tag all 35 existing aviation posts with `aviation` + category tags in Ghost Admin (manual)
2. Create Ghost navigation structure matching new dual-track design
3. Update Ghost site settings (title, description, branding)

**No database migration**: Ghost CMS manages its own database

### Rollback Considerations

**Standard 3-command rollback**: If issues arise, rollback to previous Next.js deployment using Vercel deployment ID

**Content Rollback**: Ghost Admin has post revision history for manual content rollback if needed

---

## Risks & Mitigations

### Risk: Ghost API Rate Limiting

**Impact**: High traffic could exceed Ghost API rate limits, causing failed page loads

**Probability**: Low (ISR caching minimizes API calls)

**Mitigation**:
- Use ISR with 60-second revalidation to cache responses
- Monitor Ghost API usage in production
- Upgrade to Ghost Pro if rate limits become an issue

### Risk: Content Track Tagging Errors

**Impact**: Posts without proper tags won't appear on hub pages, breaking content organization

**Probability**: Medium (manual tagging of 35+ posts)

**Mitigation**:
- Create tagging checklist for content creators
- Document tag structure in Ghost Admin tag descriptions
- Add validation to Ghost API client to log posts without track tags

### Risk: Performance Degradation with Large Content Volume

**Impact**: As post count grows beyond 100+, page load times could increase

**Probability**: Medium (long-term issue)

**Mitigation**:
- Implement pagination on hub pages (10-15 posts per page)
- Use ISR to pre-generate popular pages
- Monitor Lighthouse scores in CI/CD pipeline

### Risk: Analytics Event Tracking Failures

**Impact**: Custom events don't fire, breaking dual-track conversion funnel analysis

**Probability**: Low (Google Analytics 4 is reliable)

**Mitigation**:
- Test analytics events in GA4 Realtime during development
- Add error handling to analytics tracking functions
- Create analytics validation checklist for preview phase

---

## Open Questions

None - all critical decisions have been made with informed assumptions documented in Assumptions section.

---

## References

### Implementation Documentation

- `docs/GHOST_NEXTJS_IMPLEMENTATION.md` - Comprehensive implementation guide with component code examples
- `lib/ghost.ts` - Existing Ghost API client implementation
- `.spec-flow/memory/constitution.md` - Brand standards and engineering principles

### Brand Guidelines

- Colors: Navy 900 #0F172A (primary), Emerald 600 #059669 (secondary), Sky Blue #0EA5E9 (aviation accent)
- Typography: Work Sans (body/headings), JetBrains Mono (code)
- Content Strategy: 40% aviation, 40% dev/startup, 20% cross-pollination

### External Resources

- [Ghost Content API Documentation](https://ghost.org/docs/content-api/)
- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Google Analytics 4 Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

**Last Updated**: 2025-10-21
**Next Phase**: /clarify (if ambiguities found) or /plan (proceed to planning)
