# Implementation Plan: Homepage Redesign

**Feature**: 055-homepage-redesign
**Date**: 2025-10-29
**Status**: Planning Complete

## [RESEARCH DECISIONS]

See: `research.md` for full research findings

**Summary**:
- Stack: Next.js 15 App Router, React 19, Tailwind CSS 4, Radix UI primitives
- Components to reuse: 10 (Hero, PostFeedFilter, PostCard, NewsletterSignupForm, Button, Container, Dialog, TrackBadge, analytics, shimmer utils)
- New components needed: 6 (Enhanced Hero, Featured Showcase, Project Card, Newsletter CTA placement, Mobile Nav [P3], Scroll Animations [P3])
- No database schema changes required (UI-only feature)
- No new API endpoints needed (reuse existing `/api/newsletter/subscribe`)

---

## [ARCHITECTURE DECISIONS]

### Stack

- **Frontend Framework**: Next.js 15.5.6 (App Router) with React 19.2.0
  - Rationale: Already in use, SSR critical for SEO, React Server Components reduce JS bundle
  - Source: `docs/project/tech-stack.md:26-42`

- **Language**: TypeScript 5.9.3 (strict mode)
  - Rationale: Type safety prevents runtime errors, excellent IDE support
  - Source: `docs/project/tech-stack.md:44-57`

- **UI Framework**: Tailwind CSS 4.1.15
  - Rationale: Utility-first, small bundle, responsive utilities, dark mode support
  - Brand Colors: Navy 900 `#0F172A` (primary bg), Emerald 600 `#059669` (accent/CTAs)
  - Source: `docs/project/tech-stack.md:59-74`, `.spec-flow/memory/constitution.md:410`

- **Component Library**: Radix UI primitives + custom components
  - Rationale: Accessible (WCAG 2.1 AA), unstyled, full Tailwind customization
  - Components: Dialog (newsletter modal), Slot (composition)
  - Source: `docs/project/tech-stack.md:77-89`

- **State Management**: React Server Components + minimal client state
  - Client state: URL search params (filter state), theme preference (next-themes)
  - Rationale: Most data server-rendered, no complex application state
  - Source: `docs/project/tech-stack.md:93-104`

- **Content Source**: MDX files (`content/posts/*.mdx`)
  - Processing: gray-matter (frontmatter), remark-gfm (GFM), rehype-highlight (syntax)
  - Rationale: Version-controlled, build-time static generation, no CMS complexity
  - Source: `docs/project/tech-stack.md:394-408`, `research.md:70-79`

- **Newsletter**: Resend API (existing integration)
  - Endpoint: `/api/newsletter/subscribe`
  - Multi-track support: aviation, dev-startup, education, all
  - Source: `docs/project/tech-stack.md:354-366`, `research.md:81-91`

- **Analytics**: Google Analytics 4
  - Events: `homepage.page_view`, `homepage.filter_click`, `homepage.post_click`, `homepage.newsletter_signup`
  - Source: `docs/project/tech-stack.md:369-381`, `specs/055-homepage-redesign/spec.md:323-345`

- **Deployment**: Hetzner VPS, Docker, Caddy, GitHub Actions (direct-prod model)
  - Rationale: Self-hosted, cost-effective, full control
  - Source: `docs/project/deployment-strategy.md:1-480`

### Patterns

**Pattern: Component Composition with Radix UI**
- Use Radix UI primitives (Dialog) for accessible modals
- Style with Tailwind utility classes
- Example: Newsletter signup in hero section uses Dialog + DialogContent + DialogTrigger
- Source: `components/home/Hero.tsx:10-37, 72-111`

**Pattern: URL State Synchronization for Filters**
- Use Next.js useSearchParams + useRouter for client-side filtering
- URL format: `/?track=aviation` (shareable links)
- Client-side filtering prevents page reloads (better UX)
- Analytics tracking on filter change
- Example: `components/home/PostFeedFilter.tsx:30-60`

**Pattern: Responsive Grid Layouts**
- Tailwind responsive classes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Mobile-first approach (1 col default, expand at breakpoints)
- Example: `components/blog/PostCard.tsx` in grid layout

**Pattern: Server-Side Rendering with React Server Components**
- Homepage route renders server-side for SEO
- Client components only for interactive elements (filter buttons, newsletter form, theme toggle)
- Use `'use client'` directive sparingly
- Example: `app/page.tsx` (server component) wraps `PostFeedFilter` (client component)

**Pattern: Lazy Loading Below-the-Fold Content**
- Dynamic imports for Dialog components (reduces initial bundle)
- Images lazy-loaded with blur placeholder (shimmerDataURL)
- Example: `components/home/Hero.tsx:10-37` (Dialog lazy imported)

**Pattern: Brand Consistency via Tailwind Config**
- Navy brand palette defined in `tailwind.config.ts`
- Use semantic class names: `bg-dark-bg`, `text-foreground`, `text-muted-foreground`
- Ensures consistency across all components
- Source: `.spec-flow/memory/constitution.md:410-420`

### Dependencies (new packages required)

**None** - All required dependencies already installed:
- `next@15.5.6` - Framework
- `react@19.2.0` - UI runtime
- `tailwindcss@4.1.15` - Styling
- `@radix-ui/react-dialog@^1.x` - Accessible dialog
- `@radix-ui/react-slot@^1.x` - Composition primitive
- `class-variance-authority` - Type-safe variants
- `clsx` / `tailwind-merge` - Conditional classes
- `lucide-react` - Icons (if needed)
- `gray-matter` - MDX frontmatter parsing
- `reading-time` - Reading time calculation
- `rehype-highlight` - Code syntax highlighting

Source: `docs/project/tech-stack.md`, `package.json` (not read but referenced in tech-stack.md)

---

## [STRUCTURE]

### Directory Layout (follow existing patterns)

```
app/
├── page.tsx                           # ✏️ MODIFY - Homepage route (server component)
│                                      #    Current: Renders basic homepage
│                                      #    New: Hero + Featured + Filter + Recent Posts Grid + Project Card + Newsletter CTA
│
components/
├── home/
│   ├── Hero.tsx                       # ✏️ ENHANCE - Update brand colors, messaging, CTAs
│   ├── PostFeedFilter.tsx             # ✅ REUSE - Already implements track filtering
│   ├── FeaturedPostsSection.tsx       # ❓ VERIFY OR CREATE - Featured content showcase
│   ├── ProjectCard.tsx                # ➕ CREATE - "What I'm building" project card
│   ├── Sidebar.tsx                    # ❓ VERIFY - Check if used for newsletter CTA placement
│   ├── UnifiedPostFeed.tsx            # ❓ VERIFY - May need modification for filter integration
│   └── HomePageClient.tsx             # ❓ VERIFY - Client wrapper if needed for interactivity
│
├── blog/
│   ├── PostCard.tsx                   # ✅ REUSE - Post preview cards (perfect for recent grid)
│   ├── PostGrid.tsx                   # ❓ VERIFY - Grid layout component (may need creation)
│   └── TrackBadge.tsx                 # ✅ REUSE - Track badges for post metadata
│
├── newsletter/
│   ├── NewsletterSignupForm.tsx       # ✅ REUSE - Use 'inline' or 'comprehensive' variant
│   ├── CompactNewsletterSignup.tsx    # ❓ VERIFY - May use for sidebar placement
│   └── InlineNewsletterCTA.tsx        # ❓ VERIFY - May use for homepage section
│
├── layout/
│   ├── Header.tsx                     # ✏️ ENHANCE (P3) - Add mobile navigation (hamburger menu)
│   └── Footer.tsx                     # ✅ REUSE - No changes needed
│
└── ui/
    ├── Button.tsx                     # ✅ REUSE - CTAs throughout
    ├── Container.tsx                  # ✅ REUSE - Section wrapper for consistent layout
    ├── dialog.tsx                     # ✅ REUSE - Newsletter modal in hero
    └── theme-toggle.tsx               # ✅ REUSE - Dark mode toggle (existing)

lib/
├── posts.ts                           # ❓ VERIFY - Post fetching/filtering utilities
├── analytics.ts                       # ✅ REUSE - GA4 tracking for filter/newsletter events
└── utils/
    └── shimmer.ts                     # ✅ REUSE - Image blur placeholders

content/
└── posts/                             # ❓ VERIFY - Ensure MDX frontmatter supports `featured: true` flag
    └── *.mdx
```

**Legend**:
- ✅ REUSE - Existing component, no changes needed
- ✏️ MODIFY/ENHANCE - Existing component, needs updates
- ➕ CREATE - New component required
- ❓ VERIFY - Exists in glob but not read, needs verification

### Module Organization

**`app/page.tsx` (Homepage Route)**
- Responsibilities: Server-rendered homepage layout, compose all sections
- Data fetching: Load recent posts, featured posts, project data (server-side)
- Children: Hero, FeaturedPostsSection, PostFeedFilter (sidebar), PostGrid, ProjectCard, NewsletterCTA

**`components/home/Hero.tsx`**
- Responsibilities: Hero section with headline, tagline, primary CTAs, newsletter Dialog
- State: Newsletter modal open/close (client component)
- Interactions: "Read Latest" CTA (scroll to posts), "Subscribe" CTA (open modal)

**`components/home/PostFeedFilter.tsx`**
- Responsibilities: Content track filter buttons with URL state sync
- State: Current track from URL search params
- Interactions: Click filter → update URL → trigger re-render with filtered posts

**`components/home/FeaturedPostsSection.tsx` (or create)**
- Responsibilities: Display 1-3 featured posts with larger card treatment
- Data: Posts with `featured: true` frontmatter flag
- Layout: Horizontal layout or 2-column grid (different from 3-col recent posts)

**`components/home/ProjectCard.tsx` (CREATE)**
- Responsibilities: Showcase current project (CFIPros.com) with status, tagline, CTA
- Data: Hardcoded or from config file (single active project)
- Conditional: Only render when `status === 'active'`

**`components/blog/PostCard.tsx`**
- Responsibilities: Post preview card with image, title, excerpt, metadata, track badge
- Props: `post` object, optional `track` for badge display
- Used in: Recent posts grid, featured posts section

**`components/newsletter/NewsletterSignupForm.tsx`**
- Responsibilities: Newsletter signup with multi-track selection
- Variants: Use 'inline' for homepage section, 'compact' for sidebar (if used)
- API: POST `/api/newsletter/subscribe`

---

## [DATA MODEL]

See: `data-model.md` for complete entity definitions

**Summary**:
- Entities: Post (from MDX frontmatter), Project (hardcoded/config), NewsletterSubscriber (existing DB table)
- Relationships: Posts have many tags, NewsletterSubscriber has many preferences
- Migrations required: **No** (UI-only feature, no schema changes)

**Post Entity** (MDX frontmatter):
```yaml
title: string
slug: string
excerpt: string
feature_image: string (URL)
published_at: string (ISO date)
tags: string[] (aviation | dev-startup | cross-pollination)
reading_time: number (minutes)
featured: boolean (new field for featured posts)
```

**Project Entity** (hardcoded/config):
```typescript
interface Project {
  name: string             // "CFIPros.com"
  tagline: string          // Brief description
  status: 'active' | 'shipped' | 'paused'
  url: string              // External link
  description: string      // Longer description
  cta_text: string         // "Visit Project" or "Read Build Log"
}
```

**NewsletterSubscriber Entity** (existing Prisma model):
- Table: `newsletter_subscribers`
- Fields: `id`, `email`, `preferences` (JSON: aviation, dev-startup, education, all), `unsubscribe_token`, `created_at`
- No changes required

---

## [PERFORMANCE TARGETS]

### From spec.md NFRs (or defaults from design/systems/budgets.md)

**NFR-001: Performance**
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.15
- Time to Interactive (TTI): <3.5s
- Network: 3G connection baseline

**NFR-002: Accessibility**
- WCAG 2.1 Level AA standards
- Color contrast: ≥4.5:1 for text, ≥3:1 for UI components
- Keyboard navigation support (Tab, Enter, Esc)
- Screen reader compatibility (semantic HTML, ARIA labels)

**NFR-003: Mobile Responsiveness**
- Viewports: 320px-1440px+ supported
- Touch-friendly tap targets: ≥44x44px
- Responsive breakpoints: 1 col (mobile), 2 col (tablet 768px), 3 col (desktop 1024px)

**NFR-006: Performance Budget**
- Total page weight: <2MB
- JavaScript bundle: <500KB
- CSS: <100KB
- Images: Lazy-loaded, WebP format, <500KB each

**Lighthouse Targets** (from capacity-planning.md):
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Measurement**:
- Lighthouse CI: Run on PR, block merge if < 85
- Core Web Vitals: Monitor via GA4
- Manual testing: Test on phone (real device, not emulator)

---

## [SECURITY]

### Authentication Strategy

**Current**: None (public content site)
**Future**: Supabase Auth if admin panel added (not in scope for this feature)

**Protected Routes**: None (all content public)

### Authorization Model

**Current**: None (public read-only access)
**Future**: RBAC (admin role for Marcus) if content management UI added

### Input Validation

**Newsletter Form**:
- Email validation: Zod schema (format, required)
- Newsletter types validation: At least 1 selected (unless compact variant)
- Rate limiting: Implemented in API route (100 req/min per IP)
- Source: `lib/newsletter/validation-schemas.ts`, `lib/newsletter/rate-limiter.ts`

**Content Track Filter**:
- URL param validation: Enum check ('all' | 'aviation' | 'dev-startup' | 'cross-pollination')
- No user input (predefined filter buttons)

**CORS**:
- Same-origin (Next.js app serves both frontend and API)
- Newsletter API: Accept requests from marcusgoll.com only

### Data Protection

**PII Handling**:
- Email addresses: Stored in PostgreSQL (newsletter subscribers)
- No sensitive data beyond email (no passwords, payment info)
- Scrubbing: Email addresses never logged, not sent to GA4

**Encryption**:
- At rest: AES-256 (Supabase managed)
- In transit: TLS 1.3 (Caddy auto-managed Let's Encrypt certs)

**Privacy**:
- GA4: No PII tracked (page views, events only)
- Newsletter: Unsubscribe link in every email, preferences management page

---

## [EXISTING INFRASTRUCTURE - REUSE] (10 components)

### Services/Modules

1. **Newsletter API** - `/api/newsletter/subscribe`
   - Multi-track subscription (aviation, dev-startup, education, all)
   - Resend email delivery
   - Rate limiting, Zod validation
   - Source: `app/api/newsletter/subscribe/route.ts` (not read but exists per system-architecture.md)

2. **MDX Processing** - `lib/mdx.ts`, `lib/posts.ts`
   - Read MDX files from `content/posts/`
   - Parse frontmatter (gray-matter)
   - Calculate reading time
   - Filter by tags (track filtering)
   - Source: `docs/project/tech-stack.md:394-408`

3. **Analytics** - `lib/analytics.ts`
   - GA4 event tracking (gtag)
   - Event types: page_view, filter_changed, newsletter_success
   - Source: `components/home/PostFeedFilter.tsx:38-45`, `components/newsletter/NewsletterSignupForm.tsx:157-162`

### UI Components

4. **Hero** - `components/home/Hero.tsx`
   - Headline, tagline, CTAs, newsletter Dialog
   - Will enhance: Apply navy branding, update messaging
   - Source: `components/home/Hero.tsx:44-117`

5. **PostFeedFilter** - `components/home/PostFeedFilter.tsx`
   - Track filter buttons (All, Aviation, Dev/Startup, Cross-pollination)
   - URL state sync, analytics tracking
   - Source: `components/home/PostFeedFilter.tsx:30-88`

6. **PostCard** - `components/blog/PostCard.tsx`
   - Post preview with image, title, excerpt, metadata, track badge
   - Responsive, hover effects
   - Source: `components/blog/PostCard.tsx:16-79`

7. **NewsletterSignupForm** - `components/newsletter/NewsletterSignupForm.tsx`
   - 3 variants: compact, inline, comprehensive
   - Multi-track selection
   - API integration
   - Source: `components/newsletter/NewsletterSignupForm.tsx:69-362`

8. **Button** - `components/ui/Button.tsx`
   - Primary, secondary, outline, ghost variants
   - Size variants (default, small, large)
   - Used for CTAs, filter buttons
   - Source: Referenced throughout

9. **Container** - `components/ui/Container.tsx`
   - Max-width wrapper (consistent section padding)
   - Responsive breakpoints
   - Source: `components/home/Hero.tsx:58`

10. **Dialog** - `components/ui/dialog.tsx`
    - Radix UI Dialog primitives (accessible modal)
    - Used for newsletter signup modal in hero
    - Source: `components/home/Hero.tsx:10-37`

### Utilities

11. **shimmerDataURL** - `lib/utils/shimmer.ts`
    - Blur placeholder for lazy-loaded images
    - Improves LCP (placeholder while image loads)
    - Source: `components/blog/PostCard.tsx:39`

12. **TrackBadge** - `components/blog/TrackBadge.tsx`
    - Track badges (Aviation ✈️, Dev/Startup 💻, Cross-pollination 🔄)
    - Color-coded (Sky Blue for aviation, Emerald for dev)
    - Source: `components/blog/PostCard.tsx:47-50`

---

## [NEW INFRASTRUCTURE - CREATE] (6 components)

### UI Components

1. **Enhanced Hero Section** - Modify `components/home/Hero.tsx`
   - Apply navy brand palette (Navy 900 bg, Emerald 600 CTAs)
   - Update headline: "Systematic thinking from 30,000 feet" → spec-aligned messaging
   - Update tagline to match dual-track value prop
   - Primary CTA: "Read Latest Posts" (scroll to posts or link to /blog)
   - Secondary CTA: "Subscribe to Newsletter" (Dialog modal)
   - Performance: Ensure hero loads <1.5s FCP, optimize background if animated
   - Source: `specs/055-homepage-redesign/spec.md:38-42`

2. **Featured Posts Showcase** - `components/home/FeaturedPostsShowcase.tsx` (or enhance existing)
   - Display 1-3 posts with `featured: true` frontmatter flag
   - Larger card treatment (bigger images, more prominent)
   - Layout: Horizontal or 2-column grid (different from 3-col recent posts)
   - Appears before recent posts grid
   - Fallback: If no featured posts, hide section (don't show empty state)
   - Source: `specs/055-homepage-redesign/spec.md:66-72`

3. **Project Card** - `components/home/ProjectCard.tsx`
   - Display project name (CFIPros.com), tagline, status (active/shipped/paused)
   - Status indicator: Green dot for "active"
   - CTA: "Visit Project" (external link) or "Read Build Log" (internal link)
   - Conditional render: Only show when `status === 'active'`
   - Data source: Hardcoded or config file (single active project)
   - Styling: Card with border, hover effect, emerald accent for CTA
   - Source: `specs/055-homepage-redesign/spec.md:74-81`

4. **Newsletter CTA Placement** - Strategic placement of existing `NewsletterSignupForm`
   - Option 1: Hero section (Dialog modal) - Already exists
   - Option 2: Sidebar (sticky) - Use `components/home/Sidebar.tsx` or create
   - Option 3: Dedicated section (between featured and recent posts) - Use 'inline' variant
   - Decision: Use hero Dialog (primary) + dedicated section (secondary for visibility)
   - Source: `specs/055-homepage-redesign/spec.md:83-91`

5. **Mobile Navigation (P3 - Deferred)** - Enhance `components/layout/Header.tsx`
   - Hamburger menu icon <768px
   - Slide-out or overlay menu
   - Includes navigation links + content track filters
   - Keyboard accessible (Esc to close, focus trap)
   - Smooth animation (CSS transitions)
   - Priority: P3 (nice-to-have), defer to polish phase
   - Source: `specs/055-homepage-redesign/spec.md:95-103`

6. **Scroll Animations (P3 - Deferred)** - Intersection observer HOC or hook
   - Fade-in on scroll for sections
   - Respects `prefers-reduced-motion` media query
   - <50ms interaction time overhead
   - Graceful degradation (works without JS)
   - Priority: P3 (nice-to-have), defer to polish phase
   - Source: `specs/055-homepage-redesign/spec.md:105-112`

### Backend/Data

**None** - No new backend services or database changes required.
- Reuse: `/api/newsletter/subscribe` endpoint
- Reuse: MDX file processing pipeline
- Reuse: PostgreSQL newsletter_subscribers table

---

## [CI/CD IMPACT]

### From spec.md deployment considerations

**Platform**: Hetzner VPS with Docker, GitHub Actions CI/CD, direct-prod deployment model
- No platform changes required
- Source: `docs/project/deployment-strategy.md:1-480`

**Environment Variables**: None required
- Reuse existing: `RESEND_API_KEY`, `GA4_MEASUREMENT_ID`, `DATABASE_URL`
- No new secrets needed

**Breaking Changes**: None
- Backward compatible (UI-only changes, no API contract changes)
- No database migrations

**Database Migrations**: None
- No schema changes (UI-only feature)

**Build Commands**: No changes
- Continue using: `npm run build`
- Docker multi-stage build: base → builder → production

**Smoke Tests** (for deploy-production.yml):
- Route: `GET /` (homepage)
- Expected: 200 OK, HTML response contains "Systematic thinking" (hero headline)
- Lighthouse: Performance ≥85, Accessibility ≥95
- Manual: Verify hero, filter buttons, recent posts grid, newsletter form visible

**Platform Coupling**:
- Hetzner VPS: No changes (Docker deployment remains same)
- Caddy: No changes (reverse proxy config unchanged)
- GitHub Actions: No changes (existing CI/CD pipeline sufficient)

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants (must hold true)

1. ✅ No breaking NEXT_PUBLIC_* env var changes (none changed)
2. ✅ Backward-compatible API changes only (no API changes)
3. ✅ Database migrations are reversible (no migrations)
4. ✅ Feature flags default to 0% in production (no feature flags used)
5. ✅ Homepage loads with hero section visible above fold (<600px height)
6. ✅ Newsletter signup API functional (existing endpoint)
7. ✅ Content track filter updates URL without page reload
8. ✅ Lighthouse Performance ≥85, Accessibility ≥95

### Staging Smoke Tests (direct-prod: manual testing in local dev)

**Test Scenario 1: Homepage Loads**
```gherkin
Given user visits http://localhost:3000/
When page loads
Then hero section displays within 1.5s (FCP)
  And headline "Systematic thinking from 30,000 feet" is visible
  And primary CTA "Read Latest Posts" is clickable
  And secondary CTA "Subscribe to Newsletter" is clickable
  And no console errors
```

**Test Scenario 2: Content Track Filtering**
```gherkin
Given user is on homepage
When user clicks "Aviation" filter button
Then URL updates to /?track=aviation
  And only aviation posts display
  And filter button shows active state
  And GA4 event 'filter_changed' fires with label 'aviation'
  And no page reload occurs
```

**Test Scenario 3: Newsletter Signup**
```gherkin
Given user clicks "Subscribe to Newsletter" in hero
When newsletter Dialog opens
  And user enters "test@example.com"
  And user clicks "Subscribe"
Then API POST /api/newsletter/subscribe succeeds (200 OK)
  And success message displays
  And Dialog closes after 3s
  And GA4 event 'newsletter_signup' fires
```

**Test Scenario 4: Mobile Responsive**
```gherkin
Given user visits homepage on 375px viewport (iPhone SE)
When page loads
Then hero section displays (no horizontal scroll)
  And recent posts grid shows 1 column
  And filter buttons stack vertically (or in sidebar)
  And tap targets ≥44x44px
  And Lighthouse Mobile Performance ≥85
```

**Test Scenario 5: Performance Budget**
```gherkin
Given homepage is built for production (npm run build)
When analyzing bundle
Then JavaScript bundle <500KB
  And CSS <100KB
  And total page weight <2MB (including images)
  And LCP <2.5s on 3G
```

### Rollback Plan

**Deploy IDs tracked in**: `specs/055-homepage-redesign/NOTES.md` (Deployment Metadata section)

**Rollback Commands**:
```bash
# Via Git revert (recommended)
git revert <commit-sha>
git push origin main
# CI auto-deploys reverted code (~5-7 min)

# Via Docker image rollback (faster, ~2 min)
ssh marcus@marcusgoll.com
docker images ghcr.io/marcusgoll/marcusgoll
docker-compose pull # Pull previous image tag
docker-compose up -d --force-recreate
```

**Special Considerations**:
- No database rollback needed (no migrations)
- No config changes (no new env vars)
- UI-only changes (fully reversible via Git revert)
- **RTO** (Recovery Time Objective): <10 minutes
- **RPO** (Recovery Point Objective): 0 (no data loss, UI-only)

**Artifact Strategy** (build-once-promote-many):
- Build: GitHub Actions builds Docker image on push to `main`
- Tag: `latest` (rolling) + `<commit-sha>` (specific version)
- Deploy: Pull `latest` to Hetzner VPS via SSH
- Rollback: Pull previous `<commit-sha>` tag
- No artifact promotion needed (direct-prod model)

---

## [INTEGRATION SCENARIOS]

See: `quickstart.md` for complete integration scenarios

**Summary**:
- Initial setup: Clone repo, install deps, start local dev server
- Validation workflow: Run build, check Lighthouse, manual testing
- Manual testing: Navigate to localhost:3000, verify hero/filter/posts/newsletter

---

## Reuse Opportunities Summary

**Component Reuse**:
- 10 existing components identified for reuse (no changes or minor enhancements)
- 6 new components needed (3 P1 MVP, 2 P2 enhancement, 1 P3 nice-to-have)
- **Reuse ratio**: 10/(10+6) = 62.5% component reuse

**API Reuse**:
- 100% reuse (no new endpoints needed)
- Existing `/api/newsletter/subscribe` handles all newsletter signup needs

**Infrastructure Reuse**:
- 100% reuse (no deployment changes, no new services)
- Hetzner VPS, Docker, Caddy, GitHub Actions all remain unchanged

**Performance Optimization via Reuse**:
- Existing patterns (lazy loading, shimmer placeholders, responsive grids) proven performant
- No need to reinvent patterns, just apply consistently

---

## Next Steps

1. Generate `data-model.md` - Document Post and Project entities (no DB changes)
2. Generate `quickstart.md` - Integration and testing scenarios
3. Initialize `error-log.md` - Error tracking template
4. Commit planning artifacts to Git
5. Proceed to `/tasks` phase - Break down into TDD implementation tasks (20-30 tasks)

---

**Planning Duration**: ~30 minutes
**Confidence Level**: High (clear requirements, proven tech stack, high reuse ratio)
**Risk Level**: Low (UI-only, no breaking changes, fully reversible)
