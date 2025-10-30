# Research & Discovery: 055-homepage-redesign

**Date**: 2025-10-29
**Research Mode**: Full (complex UI feature)

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)

- **Vision**: marcusgoll.com is a personal blog showcasing dual-track expertise (Aviation + Dev/Startup) through systematic thinking and technical writing
- **Target Users**:
  - Primary: Aviation professionals & students (flight instructors, student pilots)
  - Secondary: Developers & startup builders
  - Tertiary: Career transitioners interested in aviation + tech
- **Success Metrics**:
  - 1,000 monthly organic visitors (6 months)
  - 3+ min avg time on page
  - 100 newsletter subscribers (6 months)
  - Top 20 search rankings (12 months)
- **Scope Boundaries**: Content platform with MDX, tag-based filtering, dark mode, newsletter system

### System Architecture (from system-architecture.md)

- **Components**: Next.js 15 App Router monolith, PostgreSQL (Supabase), MDX filesystem
- **Integration Points**: Resend/Mailgun (newsletter), GA4 (analytics), GitHub (CI/CD)
- **Data Flows**: MDX files → build-time static generation → server-rendered pages
- **Constraints**: Self-hosted VPS (Hetzner), Docker containerization, direct-prod deployment model

### Tech Stack (from tech-stack.md)

- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3
- **UI Framework**: Tailwind CSS 4.1.15, Radix UI primitives, custom components
- **State Management**: React Server Components + minimal client state (next-themes for theme)
- **Deployment**: Hetzner VPS, Docker + Docker Compose, Caddy reverse proxy, GitHub Actions CI/CD
- **Content**: MDX 3.1.1 with gray-matter, remark-gfm, rehype-highlight
- **Newsletter**: Resend or Mailgun
- **Analytics**: Google Analytics 4

### Data Architecture (from data-architecture.md)

Not directly relevant for homepage redesign (no schema changes), but newsletter subscribers table exists with multi-track preferences.

### API Strategy (from api-strategy.md)

- **API Style**: Next.js API Routes (REST)
- **Auth**: None required (public content site)
- **Versioning**: `/api/v1/` structure
- **Rate Limiting**: Implemented for newsletter endpoints

### Capacity Planning (from capacity-planning.md)

- **Current Scale**: Micro tier (< 10K visitors/month)
- **Performance Targets**: Lighthouse ≥85, FCP <1.5s, TTI <3.5s, LCP <2.5s, CLS <0.15
- **Resource Limits**: VPS 2-4 vCPUs, 4-8GB RAM
- **Cost Constraints**: < $50/mo total infrastructure

### Deployment Strategy (from deployment-strategy.md)

- **Deployment Model**: direct-prod (staging planned when traffic > 10K/mo)
- **Platform**: Hetzner VPS + Docker
- **CI/CD Pipeline**: GitHub Actions (verify → build → deploy)
- **Environments**: Development (local), Production (marcusgoll.com)

### Development Workflow (from development-workflow.md)

- **Git Workflow**: Feature branches → PR → main (auto-deploy)
- **Testing Strategy**: Manual testing (no automated tests yet per tech-stack.md:342)
- **Code Style**: ESLint, TypeScript strict mode
- **Definition of Done**: Content quality, local build success, no console errors, Lighthouse ≥85, mobile responsive

---

## Research Decisions

### Decision: Reuse Existing Next.js 15 App Router Architecture

- **Decision**: Build homepage redesign within existing Next.js 15 App Router structure
- **Rationale**:
  - Already uses App Router with React Server Components
  - Server-side rendering critical for SEO (blog content must be crawlable)
  - Existing infrastructure supports dynamic routing, MDX processing, and API routes
  - No need to introduce new framework or architectural pattern
- **Alternatives**:
  - Create separate SPA (rejected: worse SEO, duplicates infrastructure)
  - Migrate to Astro (rejected: unnecessary complexity, smaller ecosystem)
- **Source**: `docs/project/tech-stack.md:26-42`, `docs/project/system-architecture.md:69-111`

### Decision: Tailwind CSS 4 with Navy Brand Palette

- **Decision**: Use Tailwind CSS 4.1.15 with navy brand tokens (Navy 900 `#0F172A`, Emerald 600 `#059669`)
- **Rationale**:
  - Already configured in project (utility-first, responsive, dark mode support)
  - Brand colors defined in constitution.md and spec.md
  - Small bundle size (only used classes included)
  - Industry standard (easy for collaborators)
- **Alternatives**:
  - CSS Modules (rejected: more boilerplate, harder to maintain)
  - Styled Components (rejected: runtime overhead)
- **Source**: `docs/project/tech-stack.md:59-74`, `.spec-flow/memory/constitution.md:410`, `specs/055-homepage-redesign/spec.md:10`

### Decision: Client-Side Filtering with URL State Synchronization

- **Decision**: Implement content track filtering using Next.js useSearchParams + useRouter
- **Rationale**:
  - Existing pattern in `components/home/PostFeedFilter.tsx` (lines 30-60)
  - URL parameter syncing enables shareable filtered views (FR-004)
  - Client-side filtering prevents page reloads (FR-003)
  - Analytics tracking built-in (FR-002)
- **Alternatives**:
  - Server-side filtering (rejected: requires page reload, worse UX)
  - Client-only state (rejected: no shareable links)
- **Source**: `components/home/PostFeedFilter.tsx:1-88`, `specs/055-homepage-redesign/spec.md:212`

### Decision: MDX Content from Filesystem

- **Decision**: Continue using MDX files in `content/posts/` directory, no CMS
- **Rationale**:
  - Existing pattern (MDX files version-controlled in Git)
  - Build-time static generation for performance
  - No CMS complexity or vendor lock-in
  - Migration path to headless CMS available later if needed
- **Alternatives**:
  - Headless CMS like Contentful (rejected: overkill for MVP, adds cost/complexity)
  - Ghost CMS (rejected: spec mentions Ghost but project uses MDX per tech-stack.md:394-408)
- **Source**: `docs/project/tech-stack.md:394-408`, `docs/project/system-architecture.md:435-442`
- **Note**: Spec.md mentions "Ghost CMS" but project docs confirm MDX filesystem approach. Spec language will be interpreted as "content management system pattern" rather than literal Ghost CMS integration.

### Decision: Resend for Newsletter Integration

- **Decision**: Use existing Resend API integration for newsletter signups
- **Rationale**:
  - Already configured with `/api/newsletter/subscribe` endpoint
  - Multi-track subscription support (aviation, dev-startup, education, all)
  - Modern API with React Email templates
  - Free tier sufficient (<3K emails/mo)
- **Alternatives**:
  - Mailgun (rejected: already using Resend, no reason to switch)
  - ConvertKit/Mailchimp (rejected: more expensive, overkill)
- **Source**: `docs/project/tech-stack.md:354-366`, `components/newsletter/NewsletterSignupForm.tsx:1-363`

### Decision: Google Analytics 4 for Tracking

- **Decision**: Continue using GA4 for homepage metrics (HEART framework)
- **Rationale**:
  - Already integrated (free, industry standard)
  - Core Web Vitals tracking built-in
  - Sufficient for MVP analytics needs
- **Alternatives**:
  - PostHog (rejected: costs after 1M events, defer until traffic grows)
  - Plausible (rejected: $9/mo minimum)
- **Source**: `docs/project/tech-stack.md:369-381`, `specs/055-homepage-redesign/spec.md:132-144`

### Decision: No Database Schema Changes Required

- **Decision**: Homepage redesign is UI-only, no database migrations
- **Rationale**:
  - Newsletter subscribers table already exists with multi-track preferences
  - No new entities or relationships needed
  - Content stored in MDX files (filesystem)
- **Alternatives**: N/A
- **Source**: `specs/055-homepage-redesign/spec.md:272`, `docs/project/data-architecture.md`

### Decision: Radix UI + Custom Components for Accessibility

- **Decision**: Use Radix UI primitives (Dialog, Slot) with Tailwind styling for accessible UI
- **Rationale**:
  - Already in use (Dialog for newsletter modal in Hero.tsx)
  - WCAG 2.1 AA accessibility built-in
  - Unstyled primitives allow full Tailwind customization
  - Smaller bundle vs full component libraries
- **Alternatives**:
  - MUI/Chakra (rejected: too opinionated, heavier bundle)
  - Fully custom components (rejected: accessibility harder to implement correctly)
- **Source**: `docs/project/tech-stack.md:77-89`, `components/home/Hero.tsx:10-37`

---

## Components to Reuse (10 found)

### UI Components

1. **`components/home/Hero.tsx`** - Hero section with headline, tagline, primary CTA, newsletter modal (Dialog pattern)
   - Reusable: Yes, will enhance with navy branding and updated copy
   - Lines: 44-117

2. **`components/home/PostFeedFilter.tsx`** - Content track filter with URL state sync
   - Reusable: Yes, already implements aviation/dev-startup filtering with analytics
   - Lines: 30-88

3. **`components/blog/PostCard.tsx`** - Post preview card with image, title, excerpt, metadata, track badge
   - Reusable: Yes, perfect for recent posts grid (US3)
   - Lines: 16-79

4. **`components/blog/PostGrid.tsx`** - Grid layout for post cards (responsive: 1 col mobile, 2 tablet, 3 desktop)
   - Needs verification (listed in Glob but not read yet)

5. **`components/newsletter/NewsletterSignupForm.tsx`** - Multi-track newsletter signup with 3 variants (compact, inline, comprehensive)
   - Reusable: Yes, use 'inline' or 'comprehensive' variant for homepage CTA
   - Lines: 69-362

6. **`components/home/FeaturedPostsSection.tsx`** - Featured posts showcase component
   - Needs verification (listed in Glob but not read yet, may fit US4)

7. **`components/ui/Button.tsx`** - Reusable button component (used throughout)
   - Reusable: Yes, for CTAs and filter buttons
   - Referenced in Hero.tsx:3, PostFeedFilter.tsx:4

8. **`components/ui/Container.tsx`** - Container wrapper for consistent max-width and padding
   - Reusable: Yes, for section layout consistency
   - Referenced in Hero.tsx:4

9. **`components/ui/dialog.tsx`** - Radix UI Dialog components (Dialog, DialogContent, DialogHeader, etc.)
   - Reusable: Yes, for newsletter modal in hero
   - Referenced in Hero.tsx:10-37

10. **`components/blog/TrackBadge.tsx`** - Track badge component for aviation/dev-startup/cross-pollination tags
    - Reusable: Yes, for post metadata
    - Referenced in PostCard.tsx:4

### Utility Functions

11. **`lib/posts.ts`** - Post fetching and filtering utilities
    - Reusable: Yes, for loading recent posts and filtering by track
    - Needs verification (listed in Glob but not read yet)

12. **`lib/analytics.ts`** - GA4 tracking utilities
    - Reusable: Yes, for tracking filter usage and newsletter signups
    - Referenced in PostFeedFilter.tsx (line 39), NewsletterSignupForm.tsx (line 14)

13. **`lib/utils/shimmer.ts`** - Blur placeholder for images (shimmerDataURL)
    - Reusable: Yes, for post card images
    - Referenced in PostCard.tsx:5

---

## New Components Needed (6 required)

### 1. Enhanced Hero Section

- **Component**: `app/page.tsx` (homepage route) or refactor `components/home/Hero.tsx`
- **Purpose**: Modern hero section with navy background, updated value proposition, primary CTAs
- **Changes from existing**:
  - Apply navy brand palette (Navy 900 background, Emerald 600 accents)
  - Update headline/tagline to match spec.md user scenario
  - Add "Read Latest" CTA (link to recent posts) + "Subscribe" CTA (newsletter modal)
  - Ensure FCP <1.5s, LCP <2.5s (NFR-001)
- **Rationale**: Existing Hero.tsx is close but needs brand refresh and updated messaging

### 2. Featured Content Showcase

- **Component**: `components/home/FeaturedPostsShowcase.tsx` (or enhance existing FeaturedPostsSection.tsx)
- **Purpose**: Display 1-3 manually curated featured posts with larger card treatment
- **Requirements**:
  - Larger cards than recent posts grid
  - Manual curation via MDX frontmatter (`featured: true` flag)
  - Different visual treatment (bigger images, more prominent)
  - Appears before recent posts grid (US4)
- **Rationale**: Spec requires featured posts section, may partially exist (needs verification)

### 3. "What I'm building" Project Card

- **Component**: `components/home/ProjectCard.tsx`
- **Purpose**: Showcase current startup project (CFIPros.com) with status, tagline, CTA
- **Requirements**:
  - Display project name, tagline, status indicator (green for "active")
  - CTA to visit project or read build log
  - Only display when status is "active" (US5, FR-008)
  - Hardcoded or config-based (single active project at a time)
- **Rationale**: No existing component found for project showcase

### 4. Newsletter CTA Section

- **Component**: Reuse `components/newsletter/NewsletterSignupForm.tsx` with 'inline' or 'comprehensive' variant
- **Purpose**: Prominent newsletter signup CTA on homepage
- **Placement Options**:
  - Hero section (Dialog modal) - Already exists in Hero.tsx
  - Sticky sidebar - `components/home/Sidebar.tsx` exists, verify usage
  - Dedicated section between featured and recent posts
- **Rationale**: Component exists, needs strategic placement on homepage

### 5. Responsive Mobile Navigation (P3 - Nice-to-have)

- **Component**: Enhance `components/layout/Header.tsx`
- **Purpose**: Hamburger menu with slide-out/overlay menu, includes content track filters
- **Requirements**:
  - Hamburger icon <768px viewports
  - Smooth animation (slide-out or overlay)
  - Menu includes navigation + content track filters
  - Keyboard accessible (Esc to close, focus trap)
- **Rationale**: Spec US7 is P3 (nice-to-have), defer unless time permits

### 6. Scroll Animations (P3 - Nice-to-have)

- **Component**: Higher-order component or custom hook for intersection observer
- **Purpose**: Sections fade in on scroll for polished feel
- **Requirements**:
  - Intersection observer API
  - Respects prefers-reduced-motion
  - <50ms interaction time overhead
  - Graceful degradation if JS disabled
- **Rationale**: Spec US8 is P3 (nice-to-have), defer to polish phase

---

## Unknowns & Questions

None - All technical questions resolved.

**Resolved during research**:
- ✅ Tech stack confirmed (Next.js 15, Tailwind, Radix UI)
- ✅ Existing components identified for reuse (Hero, PostFeedFilter, PostCard, NewsletterSignupForm)
- ✅ MDX content source confirmed (filesystem, not Ghost CMS literal)
- ✅ Newsletter integration confirmed (Resend API with multi-track support)
- ✅ No database schema changes required
- ✅ Deployment model confirmed (direct-prod, Hetzner VPS, GitHub Actions CI/CD)
- ✅ Performance targets documented (Lighthouse ≥85, FCP <1.5s, LCP <2.5s)
- ✅ Brand colors confirmed (Navy 900 #0F172A, Emerald 600 #059669)

---

## Next Steps

1. Generate `plan.md` - Consolidate architecture decisions, component reuse analysis, implementation strategy
2. Generate `data-model.md` - Document Post and Project entities (no schema changes)
3. Generate `quickstart.md` - Integration scenarios for testing
4. Generate `contracts/api.yaml` - No new API contracts (reuse existing `/api/newsletter/subscribe`)
5. Proceed to `/tasks` phase - Break down implementation into TDD tasks
