# Research & Discovery: ghost-cms-migration

## Research Decisions

### Decision: Ghost Content API Already Integrated

**Decision**: Use existing `lib/ghost.ts` Ghost API client

**Rationale**: Ghost Content API package (@tryghost/content-api@1.12.0) is already installed and configured with complete helper functions (getPostsByTag, getPrimaryTrack, etc.). Implementation guide exists at `docs/GHOST_NEXTJS_IMPLEMENTATION.md`. No need to rebuild integration layer from scratch.

**Alternatives**:
- Build new Ghost API client from scratch (rejected - duplication)
- Use different CMS (rejected - spec requires Ghost)
- Use Ghost's built-in theme system (rejected - need Next.js frontend control)

**Source**: `lib/ghost.ts:1-133`, `package.json:16`, `docs/GHOST_NEXTJS_IMPLEMENTATION.md`

---

### Decision: Next.js 15 App Router Architecture

**Decision**: Use Next.js App Router (`app/` directory) for all new pages

**Rationale**: Project uses Next.js 15.5.6 with App Router structure. Homepage already uses `app/page.tsx`. ISR (Incremental Static Regeneration) supported in App Router via revalidate option. Consistent with existing patterns.

**Alternatives**:
- Pages Router (rejected - existing project uses App Router)
- Server Components only (rejected - need client components for analytics)
- Static export (rejected - ISR requirement from spec)

**Source**: `app/page.tsx:1-56`, `package.json:17`

---

### Decision: Tailwind CSS for Styling

**Decision**: Use Tailwind CSS 4.1.15 for component styling with brand color variables

**Rationale**: Tailwind already configured in project. Existing homepage uses Tailwind utility classes. Brand colors (Navy 900, Emerald 600) can be added as custom colors in Tailwind config.

**Alternatives**:
- CSS Modules (rejected - inconsistent with existing homepage)
- Styled Components (rejected - not installed)
- Plain CSS (rejected - less maintainable)

**Source**: `package.json:30`, `app/page.tsx:3-54`

---

### Decision: ISR with 60-Second Revalidation

**Decision**: Implement ISR (Incremental Static Regeneration) with 60-second revalidation for all Ghost content pages

**Rationale**: Spec requirement NFR-004 states "ISR revalidation shall occur every 60 seconds to balance freshness and performance". Next.js App Router supports ISR via `revalidate: 60` export in route handlers. Minimizes Ghost API calls while providing near-real-time updates.

**Alternatives**:
- Static generation only (rejected - content updates require rebuild)
- Server-side rendering (rejected - slower, more API calls)
- On-demand revalidation (rejected - complex webhook setup)

**Source**: Spec NFR-004, `docs/GHOST_NEXTJS_IMPLEMENTATION.md:976`

---

### Decision: Google Analytics 4 for Custom Event Tracking

**Decision**: Create `lib/analytics.ts` with GA4 event tracking functions

**Rationale**: Spec requires custom events for content track engagement (FR-016, FR-017, FR-018). GA4 already configured (NEXT_PUBLIC_GA_ID in env vars). Implementation guide provides analytics.ts template.

**Alternatives**:
- Segment (rejected - overkill for personal site)
- Plausible/Fathom (rejected - spec requires GA4)
- No analytics (rejected - spec requirement)

**Source**: Spec FR-016-019, `docs/GHOST_NEXTJS_IMPLEMENTATION.md:985-1039`, `.env.local:3`

---

## Components to Reuse (8 found)

- `lib/ghost.ts` - Complete Ghost API client with getPostsByTag, getPrimaryTrack, getAllPosts, getPostBySlug
- `lib/ghost.ts:98-109` - getPrimaryTrack helper function (determines aviation vs dev-startup track)
- `package.json` - @tryghost/content-api@1.12.0 dependency
- `app/layout.tsx` - Root layout wrapper
- `app/globals.css` - Global styles (will extend with brand colors)
- Tailwind CSS configuration
- Next.js 15 App Router structure
- TypeScript configuration

---

## New Components Needed (14 required)

### UI Components
- `components/blog/TrackBadge.tsx` - Content track badge (Aviation: Sky Blue, Dev/Startup: Emerald, Cross-Pollination: gradient)
- `components/blog/PostCard.tsx` - Blog post card with featured image, title, excerpt, track badge
- `components/blog/PostGrid.tsx` - Responsive grid layout for post cards
- `components/home/Hero.tsx` - Dual-track hero section with professional headshot
- `components/home/DualTrackShowcase.tsx` - Aviation + Dev/Startup content sections
- `components/ui/Button.tsx` - Primary, Secondary, Outline button variants
- `components/layout/Header.tsx` - Navigation with Aviation/Dev-Startup dropdowns
- `components/layout/Footer.tsx` - Footer with secondary navigation

### Pages (App Router)
- `app/aviation/page.tsx` - Aviation hub page with categories (Flight Training, CFI Resources, Career Path)
- `app/dev-startup/page.tsx` - Dev/Startup hub page with categories (Building in Public, Systematic Development, Tutorials)
- `app/blog/[slug]/page.tsx` - Single post template with ISR
- `app/tag/[slug]/page.tsx` - Tag archive pages

### Utilities
- `lib/analytics.ts` - GA4 custom event tracking (trackContentTrackClick, trackNewsletterSignup, trackExternalLinkClick)

### Configuration
- Ghost Admin tag structure (aviation, dev-startup, cross-pollination + secondary tags)

---

## Unknowns & Questions

None - all technical questions resolved via existing implementation guide and codebase analysis.

---

## Reuse Analysis

**High Reuse Opportunity**: Ghost API integration already complete. Focus shifts from API integration to:
1. Ghost Admin configuration (tagging 35 posts)
2. UI component development (TrackBadge, PostCard, Hero)
3. Page creation (aviation, dev-startup hub pages)
4. Analytics tracking implementation

**Estimated Work Distribution**:
- Ghost Admin setup: 15% (manual tagging)
- UI component development: 40% (new components)
- Page routing: 25% (hub pages + blog template)
- Analytics: 10% (tracking functions)
- Testing/polish: 10%

**Complexity Assessment**: Medium complexity. Ghost API integration (highest risk) already done. Primary work is UI development following brand guidelines.
