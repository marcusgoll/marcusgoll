# Implementation Plan: Ghost CMS Migration to Next.js

## Research Decisions Summary

See: `research.md` for full research findings

**Key Decisions**:
- Ghost Content API integration already complete (lib/ghost.ts)
- Next.js 15 App Router for all new pages
- Tailwind CSS with brand color customization
- ISR with 60-second revalidation for content freshness
- GA4 for custom event tracking

**Components to Reuse**: 8 (Ghost API client, Tailwind, Next.js structure, TypeScript config)

**New Components Needed**: 14 (TrackBadge, PostCard, Hero, hub pages, analytics)

---

## Architecture Decisions

### Stack

**Frontend Framework**:
- Next.js 15.5.6 (App Router)
- React 19.2.0
- TypeScript 5.9.3

**Styling**:
- Tailwind CSS 4.1.15
- Custom brand colors via Tailwind config
- CSS utility-first approach (existing pattern)

**Content Management**:
- Ghost CMS (headless mode)
- Ghost Content API v5.0
- @tryghost/content-api@1.12.0 (already installed)

**Data Fetching Strategy**:
- Incremental Static Regeneration (ISR)
- 60-second revalidation period
- Static generation at build time
- On-demand revalidation via webhooks (future enhancement)

**Analytics**:
- Google Analytics 4
- Custom event tracking via gtag.js
- Event categories: content_track_click, newsletter_signup, external_link_click, page_view

**Deployment Platform**:
- Vercel (remote-direct model)
- Edge caching for ISR
- Automatic deployments on push

---

### Patterns

**Tag-Based Content Organization**:
- Primary tags determine content track (aviation, dev-startup, cross-pollination)
- Secondary tags organize within tracks (flight-training, cfi-resources, etc.)
- Helper function `getPrimaryTrack(tags)` resolves track from tag array
- Enables flexible dual-track navigation and filtering

**Component Composition Pattern**:
- Small, focused components (TrackBadge, Button, PostCard)
- Composition over inheritance (DualTrackShowcase uses TrackBadge + PostCard)
- Props-based customization (variant props for Button)
- Follows brand consistency principles from constitution

**ISR (Incremental Static Regeneration) Pattern**:
- Static generation at build time for all published posts
- Stale-while-revalidate: Serve cached, update background
- 60-second revalidation balances freshness vs API calls
- Reduces Ghost API load while maintaining near-real-time updates

**Track Attribution Pattern**:
- Compute track once per post via `getPrimaryTrack(post.tags)`
- Pass track as prop through component tree
- TrackBadge component receives pre-computed track
- Enables consistent track display and analytics

**Client-Side Analytics Pattern**:
- Centralized analytics module (lib/analytics.ts)
- Wrapper functions for GA4 events
- Track parameter included in all content events
- Enables funnel analysis per content track

---

### Dependencies

**New Packages Required**: None (all dependencies already installed)

**Existing Dependencies**:
- `@tryghost/content-api@1.12.0` - Ghost API client (already installed)
- `next@15.5.6` - Next.js framework (already installed)
- `react@19.2.0` - React library (already installed)
- `tailwindcss@4.1.15` - Styling (already installed)
- `typescript@5.9.3` - Type safety (already installed)

---

## Structure

### Directory Layout

Following Next.js App Router conventions:

```
D:\Coding\marcusgoll\
├── app/
│   ├── layout.tsx                    [EXISTING] Root layout
│   ├── page.tsx                      [UPDATE] Homepage with dual-track hero
│   ├── globals.css                   [UPDATE] Add brand colors
│   ├── aviation/
│   │   └── page.tsx                  [NEW] Aviation hub with categories
│   ├── dev-startup/
│   │   └── page.tsx                  [NEW] Dev/Startup hub with categories
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx              [NEW] Single post template with ISR
│   └── tag/
│       └── [slug]/
│           └── page.tsx              [NEW] Tag archive pages
├── components/
│   ├── blog/
│   │   ├── TrackBadge.tsx            [NEW] Content track badge
│   │   ├── PostCard.tsx              [NEW] Post card with track badge
│   │   └── PostGrid.tsx              [NEW] Responsive grid layout
│   ├── home/
│   │   ├── Hero.tsx                  [NEW] Dual-track hero section
│   │   └── DualTrackShowcase.tsx     [NEW] Aviation + Dev sections
│   ├── layout/
│   │   ├── Header.tsx                [NEW] Navigation with dropdowns
│   │   └── Footer.tsx                [NEW] Footer with secondary nav
│   └── ui/
│       ├── Button.tsx                [NEW] Primary/Secondary/Outline buttons
│       └── Container.tsx             [NEW] Max-width wrapper
├── lib/
│   ├── ghost.ts                      [EXISTING] Ghost API client (REUSE)
│   └── analytics.ts                  [NEW] GA4 event tracking
└── tailwind.config.ts                [UPDATE] Add brand colors
```

**Module Organization**:
- `app/` - Pages and route handlers (App Router)
- `components/` - Reusable UI components organized by feature
- `lib/` - Utility functions and API clients
- `public/` - Static assets (images, fonts)

---

## Data Model

See: `data-model.md` for complete entity definitions

**Summary**:
- **Entities**: 3 (GhostPost, GhostTag, GhostAuthor - all external from Ghost CMS)
- **Key Relationships**:
  - GhostPost has many GhostTag (many-to-many)
  - GhostPost belongs to GhostAuthor (many-to-one)
  - Track computed via getPrimaryTrack(tags)
- **Migrations Required**: No (Ghost CMS manages own database)

**Content Migration**:
- Tag 35 existing aviation posts in Ghost Admin (manual)
- Create tag structure: aviation, dev-startup, flight-training, cfi-resources, career-path, building-in-public, systematic-development, tutorials
- Configure Ghost navigation and site settings

---

## Performance Targets

**From Spec NFR-001 to NFR-004**:
- **First Contentful Paint (FCP)**: <2 seconds
- **Largest Contentful Paint (LCP)**: <3 seconds
- **Ghost API Response Time**: <200ms p50, <500ms p95
- **ISR Revalidation**: Every 60 seconds

**Lighthouse Targets** (from constitution performance requirements):
- **Performance**: ≥90
- **Accessibility**: ≥95
- **Best Practices**: ≥90
- **SEO**: ≥90

**Optimization Strategies**:
- ISR caching reduces API calls by ~95% (only revalidate every 60s)
- Static generation at build time for all published posts
- Image optimization via Next.js Image component
- Vercel Edge caching for global CDN distribution
- Minimal JavaScript bundles (Server Components where possible)

---

## Security

### Authentication Strategy

**Ghost Content API**:
- Read-only Content API (not Admin API) - NFR-014
- API key stored in environment variable `GHOST_CONTENT_API_KEY` - NFR-013
- Public content only (no authentication required for visitors)

**Environment Variables**:
- Never committed to version control (NFR-015)
- Managed via Vercel dashboard for production
- Local development via `.env.local` (gitignored)

### Authorization Model

**No user authentication required** - Public blog content

**Ghost CMS Access**:
- Ghost Admin login required for content management
- Single author (Marcus) - managed by Ghost
- Content API is read-only (prevents unauthorized modifications)

### Input Validation

**Ghost API Responses**:
- Type validation via TypeScript interfaces (GhostPost, GhostTag, GhostAuthor)
- Null checking for optional fields (feature_image, custom_excerpt)
- Error handling for API failures

**User Input**:
- No user-generated content in this feature
- Newsletter signup (future) will require email validation
- External links tracked but not user-submitted

### Data Protection

**Content Delivery**:
- Ghost CDN handles image delivery (HTTPS)
- Ghost API calls over HTTPS
- No PII collected in this feature (analytics anonymized)

**Analytics**:
- GA4 tracks anonymized user behavior
- No personally identifiable information
- Cookie consent (future enhancement)

---

## Existing Infrastructure - Reuse (8 components)

### Services/Modules

**`lib/ghost.ts`** - Complete Ghost Content API client
- `getPostsByTag(tagSlug, limit)` - Filter posts by tag (REUSE for hub pages)
- `getPostBySlug(slug)` - Single post retrieval (REUSE for blog post page)
- `getPrimaryTrack(tags)` - Determine content track (REUSE for track badges)
- `getAllPosts(limit)` - Fetch all posts (REUSE if needed)
- TypeScript interfaces: GhostPost, GhostTag, GhostAuthor (REUSE for type safety)

### Configuration

**`package.json`** - Dependencies already installed
- @tryghost/content-api@1.12.0 (REUSE)
- next@15.5.6 (REUSE)
- tailwindcss@4.1.15 (REUSE)
- typescript@5.9.3 (REUSE)

**`app/layout.tsx`** - Root layout wrapper
- HTML structure (REUSE)
- Metadata configuration (UPDATE with brand metadata)

**`app/globals.css`** - Global styles
- Tailwind directives (REUSE)
- Will extend with brand color CSS variables

**`tailwind.config.ts`** - Tailwind configuration
- Existing setup (UPDATE with brand colors)

---

## New Infrastructure - Create (14 components)

### Frontend Pages (App Router)

**`app/page.tsx`** - Homepage Redesign
- Replace existing 4-card layout with dual-track hero
- Add DualTrackShowcase component
- Integrate Hero component with professional headshot
- Add newsletter CTA section

**`app/aviation/page.tsx`** - Aviation Hub Page
- Fetch aviation posts via `getPostsByTag('aviation', 50)`
- Categorize by secondary tags (flight-training, cfi-resources, career-path)
- Display 5 most recent per category
- ISR with 60-second revalidation: `export const revalidate = 60`

**`app/dev-startup/page.tsx`** - Dev/Startup Hub Page
- Fetch dev-startup posts via `getPostsByTag('dev-startup', 50)`
- Categorize by secondary tags (building-in-public, systematic-development, tutorials)
- Display 5 most recent per category
- ISR with 60-second revalidation: `export const revalidate = 60`

**`app/blog/[slug]/page.tsx`** - Single Post Template
- Dynamic route for individual blog posts
- Fetch post via `getPostBySlug(slug)`
- Display full post HTML content
- Show TrackBadge based on post tags
- ISR with 60-second revalidation: `export const revalidate = 60`
- Generate static params at build time: `generateStaticParams()`

**`app/tag/[slug]/page.tsx`** - Tag Archive Pages
- Dynamic route for tag filtering
- Fetch posts via `getPostsByTag(slug)`
- Display PostGrid of all posts in tag
- ISR with 60-second revalidation: `export const revalidate = 60`

### UI Components

**`components/blog/TrackBadge.tsx`** - Content Track Badge
- Props: `track: 'aviation' | 'dev-startup' | 'cross-pollination'`
- Styling: Sky Blue (#0EA5E9) for aviation, Emerald 600 (#059669) for dev-startup, gradient for cross-pollination
- Uppercase text, rounded corners, small padding
- WCAG AA contrast compliant (NFR-008)

**`components/blog/PostCard.tsx`** - Blog Post Card
- Props: `post: GhostPost`
- Display: Featured image, title, excerpt, author, date, reading time, TrackBadge
- Hover effect for interactivity
- Responsive layout (mobile, tablet, desktop)
- Link to `/blog/[slug]`

**`components/blog/PostGrid.tsx`** - Responsive Post Grid
- Props: `posts: GhostPost[]`
- Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Maps posts to PostCard components
- Gap spacing follows 8px base unit (constitution NFR-011)

**`components/home/Hero.tsx`** - Dual-Track Hero Section
- Professional headshot (right side on desktop, top on mobile)
- Headline: "Marcus Gollahon"
- Tagline: "Teaching Systematic Thinking from 30,000 Feet"
- Subtitle: Mission statement from constitution
- Dual CTAs: "Explore Aviation" (primary), "Explore Dev/Startup" (secondary)
- Background: Navy 900 gradient
- Responsive layout

**`components/home/DualTrackShowcase.tsx`** - Content Track Sections
- Aviation section: 5 most recent aviation posts
- Dev/Startup section: 5 most recent dev-startup posts
- Section headers with track colors (Sky Blue, Emerald)
- PostGrid layout
- "View All" links to hub pages
- Analytics tracking on CTA clicks

**`components/layout/Header.tsx`** - Navigation Header
- Logo: "Marcus Gollahon" (left)
- Desktop nav: Home, Aviation (dropdown), Dev/Startup (dropdown), Blog, About, Contact
- Dropdown menus for Aviation/Dev-Startup with category links
- Mobile: Hamburger menu
- Sticky header on scroll
- Navy 900 background, white text

**`components/layout/Footer.tsx`** - Site Footer
- Secondary navigation: Category links
- Social links (LinkedIn, Twitter, GitHub)
- Copyright notice
- Newsletter signup (future enhancement)
- Navy 900 background

**`components/ui/Button.tsx`** - Reusable Button Component
- Variants: `primary` (Navy 900), `secondary` (Emerald 600), `outline` (transparent with border)
- Props: `href`, `variant`, `onClick`, `children`
- Next.js Link integration for client-side navigation
- Hover effects, focus states (keyboard accessible - NFR-007)
- 4.5:1 contrast ratio (NFR-006)

**`components/ui/Container.tsx`** - Max-Width Container
- Max-width: 1280px
- Centered horizontally
- Horizontal padding: 1rem (mobile), 1.5rem (desktop)
- Reusable across pages

### Utilities

**`lib/analytics.ts`** - GA4 Event Tracking
- `trackContentTrackClick(track, location)` - Track Aviation vs Dev/Startup clicks
- `trackNewsletterSignup(location, track)` - Track signup attribution
- `trackExternalLinkClick(destination, location)` - Track CFIPros.com links
- `trackPageView(path, track)` - Enhanced page views with track metadata
- Type-safe parameters (TypeScript enums)
- Null-safe gtag checks (`typeof window !== 'undefined'`)

### Configuration Updates

**`tailwind.config.ts`** - Brand Color Customization
```typescript
theme: {
  extend: {
    colors: {
      'navy': {
        900: '#0F172A',
        700: '#334155',
      },
      'emerald': {
        600: '#059669',
        500: '#10B981',
      },
      'sky': {
        blue: '#0EA5E9',
      },
    },
    fontFamily: {
      sans: ['Work Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
}
```

**`app/globals.css`** - CSS Variables
```css
:root {
  --navy-900: #0F172A;
  --emerald-600: #059669;
  --sky-blue: #0EA5E9;
  --spacing-base: 8px;
}
```

### Ghost Admin Configuration

**Primary Tags** (manual creation in Ghost Admin):
- `aviation` - "Flight training, CFI resources, pilot career content" - Color: #0EA5E9
- `dev-startup` - "Building in public, systematic development, tutorials" - Color: #059669
- `cross-pollination` - "Aviation principles applied to development" - Color: #0F172A

**Secondary Tags** (manual creation in Ghost Admin):
- Aviation: `flight-training`, `cfi-resources`, `career-path`
- Dev/Startup: `building-in-public`, `systematic-development`, `tutorials`

**Navigation Structure** (manual configuration in Ghost Admin):
- Primary: Home, Aviation, Dev/Startup, Blog, About, Contact
- Secondary (footer): Flight Training, CFI Resources, Career Path, Building in Public, Systematic Dev, Tutorials

---

## CI/CD Impact

**From Spec Deployment Considerations**:

### Platform Dependencies

**Vercel** (remote-direct model):
- No changes to deployment configuration needed
- ISR automatically supported by Vercel
- Edge caching for global distribution
- Automatic preview deployments on PR

**Next.js Build**:
- Build process includes static generation of all post pages
- `next build` generates static HTML for all routes
- ISR enabled via `revalidate: 60` exports

### Environment Variables

**New Variables Required**:
```bash
# Ghost CMS
GHOST_API_URL=https://ghost.marcusgoll.com
GHOST_CONTENT_API_KEY=<content-api-key>

# Analytics (may already exist)
NEXT_PUBLIC_GA_ID=G-SE02S59BZW

# Site URL (may already exist)
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
```

**Configuration Steps**:
1. Add to `.env.local` for local development (gitignored)
2. Add to Vercel dashboard: Settings > Environment Variables
3. Create `.env.example` with placeholder values (committed to repo)

### Breaking Changes

**None** - This is a new integration that doesn't modify existing Next.js functionality.

Existing homepage will be redesigned, but no API changes or breaking routing changes.

### Migration Required

**Content Migration** (manual steps in Ghost Admin):
1. Create primary tags: `aviation`, `dev-startup`, `cross-pollination`
2. Create secondary tags: `flight-training`, `cfi-resources`, `career-path`, `building-in-public`, `systematic-development`, `tutorials`
3. Bulk tag all 35 existing aviation posts with `aviation` + appropriate category tags
4. Configure Ghost navigation: Primary (Home, Aviation, Dev/Startup, Blog, About, Contact), Secondary (category links)
5. Update Ghost site settings: Site title "Marcus Gollahon", Site description from constitution mission

**No database migration** - Ghost CMS manages its own database. Next.js is read-only consumer via Content API.

### Rollback Considerations

**Standard Vercel rollback** - If issues arise, rollback to previous Next.js deployment using Vercel deployment ID.

**3-Command Rollback Process**:
```bash
# 1. Get previous deployment ID from Vercel dashboard or CLI
vercel ls

# 2. Alias previous deployment to production domain
vercel alias set <previous-deployment-id> marcusgoll.com --token=$VERCEL_TOKEN

# 3. Verify rollback successful
curl -I https://marcusgoll.com
```

**Content Rollback** - Ghost Admin has post revision history for manual content rollback if tagging errors occur.

### Smoke Tests

**Deployment Acceptance Criteria**:
- [ ] Homepage loads with dual-track hero
- [ ] Aviation hub page displays categorized posts
- [ ] Dev/Startup hub page displays categorized posts
- [ ] Single post pages render with TrackBadge
- [ ] Tag archive pages filter correctly
- [ ] Ghost API connection successful (no 401/403 errors)
- [ ] ISR revalidation works (update post in Ghost, verify appears within 60s)
- [ ] Analytics events fire in GA4 Realtime
- [ ] Lighthouse Performance ≥90
- [ ] Mobile responsive (test on 375px, 768px, 1280px widths)

---

## Integration Scenarios

See: `quickstart.md` for complete integration scenarios

**Summary**:
- Local development setup documented (Ghost API connection)
- Build and deployment process defined
- Manual testing checklist provided (preview gate)

---

## Implementation Strategy

**Phase 1: Foundation (Ghost Admin + Tailwind)**
- Configure Ghost tags and navigation (manual)
- Tag 35 existing aviation posts (manual)
- Update Tailwind config with brand colors
- Create UI foundation components (Button, Container, TrackBadge)

**Phase 2: Core Components**
- Build PostCard, PostGrid
- Build Hero, DualTrackShowcase
- Build Header, Footer
- Update homepage with dual-track design

**Phase 3: Pages**
- Create Aviation hub page (`app/aviation/page.tsx`)
- Create Dev/Startup hub page (`app/dev-startup/page.tsx`)
- Create single post template (`app/blog/[slug]/page.tsx`)
- Create tag archive page (`app/tag/[slug]/page.tsx`)
- Configure ISR revalidation on all pages

**Phase 4: Analytics & Polish**
- Implement `lib/analytics.ts` with GA4 tracking
- Add analytics events to buttons and links
- Test analytics in GA4 Realtime
- Lighthouse audit and performance optimization
- Cross-browser testing
- Mobile responsive testing

---

## Testing Strategy

**Unit Tests** (not in spec, but recommended):
- `getPrimaryTrack()` helper function
- Analytics tracking functions (mock gtag)

**Integration Tests**:
- Ghost API client functions (getPostsByTag, getPostBySlug)
- ISR revalidation behavior (manual testing in preview)

**E2E Tests** (manual during preview gate):
- Navigation flow: Homepage → Aviation Hub → Single Post
- Tag filtering: Tag archive pages show correct posts
- Track badges display correct colors
- Analytics events fire on button clicks
- Mobile responsive behavior

**Performance Tests** (during optimize phase):
- Lighthouse CI audit
- Core Web Vitals monitoring (FCP, LCP, CLS)
- Ghost API response time monitoring

---

## Risk Mitigation

**Risk: Ghost API Rate Limiting** (from spec Risks section)
- Mitigation: ISR with 60-second revalidation minimizes API calls (~95% reduction)
- Monitor: Ghost API usage metrics in production
- Fallback: Increase ISR revalidation period to 120s if needed

**Risk: Content Track Tagging Errors** (from spec Risks section)
- Mitigation: Create tagging checklist for Ghost Admin
- Validation: Add logging for posts without track tags (warn in console)
- Documentation: Document tag structure in Ghost Admin tag descriptions

**Risk: Performance Degradation with Large Content Volume** (from spec Risks section)
- Mitigation: Implement pagination on hub pages (10-15 posts per page)
- ISR pre-generates popular pages
- Lighthouse monitoring in CI/CD (future enhancement)

**Risk: Analytics Event Tracking Failures** (from spec Risks section)
- Mitigation: Test analytics events in GA4 Realtime during development
- Error handling: Null-safe gtag checks in analytics.ts
- Validation: Analytics validation checklist during preview phase

---

**Last Updated**: 2025-10-21
**Next Phase**: `/tasks` (generate TDD task breakdown)
