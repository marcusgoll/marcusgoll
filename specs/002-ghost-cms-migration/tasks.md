# Tasks: Ghost CMS Migration to Next.js

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\Coding\marcusgoll

[EXISTING - REUSE]
- ✅ Ghost Content API client (lib/ghost.ts)
  - getPostsByTag(tagSlug, limit) - complete
  - getPostBySlug(slug) - complete
  - getPosts(options) - complete
  - getTags() - complete
  - TypeScript interfaces: GhostPost, GhostTag, GhostAuthor - complete
- ✅ Next.js 15 App Router structure (app/)
- ✅ Tailwind CSS 4.1.15 (configured)
- ✅ TypeScript 5.9.3 (configured)
- ✅ Root layout (app/layout.tsx)
- ✅ Global styles (app/globals.css)

[NEW - CREATE]
- 🆕 getPrimaryTrack(tags) helper - not in lib/ghost.ts
- 🆕 TrackBadge component (no existing badge pattern)
- 🆕 PostCard component (no existing card pattern)
- 🆕 PostGrid component (no existing grid pattern)
- 🆕 Hero component (no existing hero pattern)
- 🆕 DualTrackShowcase component (new pattern)
- 🆕 Header/Footer navigation components
- 🆕 Analytics tracking module (lib/analytics.ts)
- 🆕 Hub pages (aviation, dev-startup)
- 🆕 Blog post template
- 🆕 Tag archive pages

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (foundation, non-blocking)
2. Phase 2: Foundational (Ghost configuration, helper functions - blocks all stories)
3. Phase 3: US1 [P1] - Content Creator Publishing (independent)
4. Phase 4: US2 [P2] - Visitor Exploring Content (depends on US1 components)
5. Phase 5: US3 [P3] - Content Organization (independent, can run parallel with US4)
6. Phase 6: US4 [P4] - Cross-Pollination Discovery (depends on US2 components)
7. Phase 7: US5 [P5] - Performance with Static Generation (depends on all pages existing)
8. Phase 8: Polish & Cross-Cutting Concerns

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 1 Setup: T001, T002, T003 (independent configurations)
- Phase 3 (US1): T015, T016, T017 (different components, no deps)
- Phase 4 (US2): T025, T026, T027, T028 (different components)
- Phase 5 (US3): Can run in parallel with Phase 6 (different pages)
- Phase 8 Polish: T080, T081, T082 (different concerns)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phase 3 (US1) + Phase 4 (US2) - Basic content display with dual-track organization
**Incremental delivery**:
- MVP: US1 + US2 (homepage + hub pages + single post)
- Iteration 2: US3 + US4 (tag filtering + cross-pollination badges)
- Iteration 3: US5 + Polish (ISR optimization + analytics)
**Testing approach**: Manual E2E during preview phase (no automated tests in spec)

---

## Phase 1: Setup

- [ ] T001 [P] Update Tailwind config with brand colors in tailwind.config.ts
  - Colors: Navy 900 (#0F172A), Emerald 600 (#059669), Sky Blue (#0EA5E9)
  - Fonts: Work Sans (sans), JetBrains Mono (mono)
  - Spacing: 8px base unit
  - Pattern: Existing tailwind.config.ts structure
  - From: plan.md:392-414

- [ ] T002 [P] Add brand color CSS variables to app/globals.css
  - Variables: --navy-900, --emerald-600, --sky-blue, --spacing-base
  - From: plan.md:417-424

- [ ] T003 [P] Create .env.example with Ghost API placeholders
  - Variables: GHOST_API_URL, GHOST_CONTENT_API_KEY, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SITE_URL
  - No sensitive values (just placeholders)
  - From: plan.md:462-474

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that blocks all user stories

- [ ] T005 [P] Add getPrimaryTrack helper to lib/ghost.ts
  - Function signature: getPrimaryTrack(tags: GhostTag[]): 'aviation' | 'dev-startup' | 'cross-pollination' | null
  - Logic: Check for aviation tag first, dev-startup second, cross-pollination third, return null if none
  - REUSE: GhostTag interface (lib/ghost.ts:56-72)
  - From: spec.md:160-170, data-model.md:92

- [ ] T006 [P] Create basic UI components directory structure
  - Directories: components/ui/, components/blog/, components/home/, components/layout/
  - No existing components/ directory found
  - From: plan.md:106-144

- [ ] T007 [P] Create Container component in components/ui/Container.tsx
  - Max-width: 1280px, centered, horizontal padding 1rem/1.5rem
  - Reusable wrapper for all pages
  - From: plan.md:373-377

- [ ] T008 [P] Create Button component in components/ui/Button.tsx
  - Variants: primary (Navy 900), secondary (Emerald 600), outline (transparent border)
  - Props: href, variant, onClick, children
  - Next.js Link integration, keyboard accessible
  - Contrast ratio: 4.5:1 minimum (NFR-006, NFR-007)
  - From: plan.md:367-371

---

## Phase 3: User Story 1 [P1] - Content Creator Publishing Article

**Story Goal**: Marcus publishes aviation article in Ghost, appears on site within 60s

**Independent Test Criteria** (manual during preview):
- [ ] Publish article in Ghost Admin with aviation + flight-training tags → appears on Aviation hub within 60s
- [ ] Article displays Sky Blue track badge
- [ ] Article is indexed correctly (appears in right category section)

### Implementation

- [ ] T015 [P] [US1] Create TrackBadge component in components/blog/TrackBadge.tsx
  - Props: track: 'aviation' | 'dev-startup' | 'cross-pollination' | null
  - Colors: Aviation (Sky Blue #0EA5E9), Dev/Startup (Emerald #059669), Cross-pollination (gradient)
  - Styling: Uppercase text, rounded corners, small padding, WCAG AA contrast (NFR-008)
  - From: plan.md:315-320, spec.md:99-103

- [ ] T016 [P] [US1] Create PostCard component in components/blog/PostCard.tsx
  - Props: post: GhostPost, track?: string
  - Display: Featured image, title, excerpt, author name, date, reading time, TrackBadge
  - Link to /blog/[slug]
  - Hover effect, responsive layout (mobile/tablet/desktop)
  - REUSE: GhostPost interface (lib/ghost.ts:11-40)
  - Pattern: Card-based layout with image-title-excerpt structure
  - From: plan.md:321-327, spec.md:106-111

- [ ] T017 [P] [US1] Create PostGrid component in components/blog/PostGrid.tsx
  - Props: posts: GhostPost[]
  - Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
  - Maps posts to PostCard components
  - Gap spacing: 8px increments (NFR-011)
  - REUSE: PostCard component (T016)
  - From: plan.md:328-333

- [ ] T018 [US1] Create Aviation hub page in app/aviation/page.tsx
  - Fetch aviation posts: getPostsByTag('aviation', 50)
  - Categorize by secondary tags: flight-training, cfi-resources, career-path
  - Display 5 most recent per category using PostGrid
  - ISR: export const revalidate = 60
  - Static metadata: title "Aviation | Marcus Gollahon", description from constitution
  - REUSE: getPostsByTag (lib/ghost.ts:110-116), getPrimaryTrack (T005), PostGrid (T017)
  - From: plan.md:284-291, spec.md:99-103

---

## Phase 4: User Story 2 [P2] - Visitor Exploring Dual-Track Content

**Story Goal**: Visitor lands on homepage, sees clear Aviation vs Dev/Startup separation, can navigate to either track

**Independent Test Criteria** (manual during preview):
- [ ] Homepage displays dual-track hero with Aviation and Dev/Startup sections
- [ ] "Explore Aviation" button links to /aviation
- [ ] "Explore Dev/Startup" button links to /dev-startup
- [ ] Each section shows 5 most recent posts from that track
- [ ] Track badges visually distinguish content types

### Implementation

- [ ] T025 [P] [US2] Create Hero component in components/home/Hero.tsx
  - Professional headshot (right on desktop, top on mobile)
  - Headline: "Marcus Gollahon"
  - Tagline: "Teaching Systematic Thinking from 30,000 Feet"
  - Subtitle: Mission from constitution
  - Dual CTAs: "Explore Aviation" (primary), "Explore Dev/Startup" (secondary)
  - Background: Navy 900 gradient, responsive layout
  - REUSE: Button component (T008)
  - From: plan.md:334-342, spec.md:42-46

- [ ] T026 [P] [US2] Create DualTrackShowcase component in components/home/DualTrackShowcase.tsx
  - Aviation section: 5 most recent aviation posts
  - Dev/Startup section: 5 most recent dev-startup posts
  - Section headers with track colors (Sky Blue, Emerald)
  - "View All" links to /aviation and /dev-startup
  - REUSE: PostGrid (T017), Button (T008)
  - From: plan.md:343-350, spec.md:50-55

- [ ] T027 [P] [US2] Update app/page.tsx with dual-track homepage design
  - Import Hero and DualTrackShowcase components
  - Fetch aviation posts: getPostsByTag('aviation', 5)
  - Fetch dev-startup posts: getPostsByTag('dev-startup', 5)
  - Pass data to DualTrackShowcase
  - ISR: export const revalidate = 60
  - REUSE: getPostsByTag (lib/ghost.ts), Hero (T025), DualTrackShowcase (T026)
  - From: plan.md:281-284, spec.md:42-55

- [ ] T028 [P] [US2] Create Dev/Startup hub page in app/dev-startup/page.tsx
  - Fetch dev-startup posts: getPostsByTag('dev-startup', 50)
  - Categorize by secondary tags: building-in-public, systematic-development, tutorials
  - Display 5 most recent per category using PostGrid
  - ISR: export const revalidate = 60
  - Static metadata: title "Dev/Startup | Marcus Gollahon", description from constitution
  - REUSE: getPostsByTag (lib/ghost.ts), getPrimaryTrack (T005), PostGrid (T017)
  - Pattern: app/aviation/page.tsx (T018) structure
  - From: plan.md:293-297, spec.md:100-103

---

## Phase 5: User Story 3 [P3] - Content Organization with Tags

**Story Goal**: 35 existing aviation posts are bulk-tagged, automatically categorized, filterable

**Independent Test Criteria** (manual during preview):
- [ ] Posts with aviation + flight-training tags appear in Flight Training category
- [ ] Posts with aviation + cfi-resources tags appear in CFI Resources category
- [ ] Tag archive pages filter correctly (/tag/flight-training shows only flight-training posts)
- [ ] Hub pages organize posts by secondary tags

### Implementation

- [ ] T035 [P] [US3] Create tag archive page in app/tag/[slug]/page.tsx
  - Dynamic route for tag filtering
  - Fetch posts: getPostsByTag(slug)
  - Display PostGrid of all posts with that tag
  - ISR: export const revalidate = 60
  - Static metadata: title "[Tag Name] | Marcus Gollahon"
  - Generate static params: generateStaticParams() using getTags()
  - REUSE: getPostsByTag (lib/ghost.ts), getTags (lib/ghost.ts), PostGrid (T017)
  - From: plan.md:307-312, spec.md:59-64

- [ ] T036 [US3] Create Ghost Admin tag configuration checklist in specs/002-ghost-cms-migration/ghost-admin-checklist.md
  - Primary tags: aviation, dev-startup, cross-pollination with colors
  - Secondary tags: flight-training, cfi-resources, career-path, building-in-public, systematic-development, tutorials
  - Tag descriptions documenting hierarchy
  - Bulk tagging instructions for 35 aviation posts
  - From: plan.md:426-440, spec.md:90-94

---

## Phase 6: User Story 4 [P4] - Cross-Pollination Content Discovery

**Story Goal**: Posts tagged with both aviation + dev-startup display gradient badge, appear on both hub pages

**Independent Test Criteria** (manual during preview):
- [ ] Article tagged with aviation + dev-startup + cross-pollination → appears on both hub pages
- [ ] Article displays gradient badge (not single-track badge)
- [ ] Analytics track engagement with cross-pollination content

### Implementation

- [ ] T045 [P] [US4] Update TrackBadge component to handle cross-pollination gradient
  - Add gradient CSS: linear-gradient(to right, #0EA5E9, #059669)
  - Update component to detect cross-pollination track
  - File: components/blog/TrackBadge.tsx (update from T015)
  - From: spec.md:69-72, plan.md:315-320

- [ ] T046 [P] [US4] Create analytics module in lib/analytics.ts
  - trackContentTrackClick(track, location) - GA4 event
  - trackNewsletterSignup(location, track) - GA4 event
  - trackExternalLinkClick(destination, location) - GA4 event
  - trackPageView(path, track) - Enhanced page view
  - Type-safe parameters, null-safe gtag checks (typeof window !== 'undefined')
  - From: plan.md:380-388, spec.md:114-119

- [ ] T047 [US4] Add analytics tracking to Button component
  - onClick handler fires trackContentTrackClick if track prop provided
  - File: components/ui/Button.tsx (update from T008)
  - REUSE: analytics.ts (T046)
  - From: plan.md:367-371, spec.md:114-119

---

## Phase 7: User Story 5 [P5] - Performance with Static Generation

**Story Goal**: Pages load in <2s FCP, ISR revalidates every 60s, minimal Ghost API calls

**Independent Test Criteria** (manual during preview):
- [ ] Homepage FCP <2s (Lighthouse audit)
- [ ] Hub pages load <2s despite 15+ posts
- [ ] Ghost API calls minimized (check Network tab - should see cache hits)
- [ ] Lighthouse Performance score ≥90

### Implementation

- [ ] T055 [P] [US5] Create single blog post template in app/blog/[slug]/page.tsx
  - Dynamic route for individual posts
  - Fetch post: getPostBySlug(slug)
  - Display full post HTML content (dangerouslySetInnerHTML with sanitization)
  - Show TrackBadge based on getPrimaryTrack(post.tags)
  - ISR: export const revalidate = 60
  - Generate static params: generateStaticParams() using getPosts()
  - Static metadata: title from post.title, description from post.excerpt
  - REUSE: getPostBySlug (lib/ghost.ts), getPrimaryTrack (T005), TrackBadge (T015)
  - From: plan.md:299-306, spec.md:75-80

- [ ] T056 [US5] Add Next.js Image optimization to PostCard featured images
  - Replace img tags with next/image Image component
  - Sizes: (max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw
  - Priority: false (lazy loading)
  - File: components/blog/PostCard.tsx (update from T016)
  - From: plan.md:188-193, spec.md:120-127

- [ ] T057 [US5] Configure ISR revalidation on all pages
  - Verify all pages export: const revalidate = 60
  - Files: app/page.tsx, app/aviation/page.tsx, app/dev-startup/page.tsx, app/blog/[slug]/page.tsx, app/tag/[slug]/page.tsx
  - From: plan.md:39-43, spec.md:75-80, NFR-004

---

## Phase 8: Polish & Cross-Cutting Concerns

### Navigation & Layout

- [ ] T080 [P] Create Header component in components/layout/Header.tsx
  - Logo: "Marcus Gollahon" (left)
  - Desktop nav: Home, Aviation (dropdown), Dev/Startup (dropdown), Blog, About, Contact
  - Dropdown menus with category links (flight-training, cfi-resources, etc.)
  - Mobile: Hamburger menu
  - Sticky header, Navy 900 background, white text
  - Keyboard accessible (NFR-007)
  - REUSE: Button component (T008) for CTAs
  - From: plan.md:351-358

- [ ] T081 [P] Create Footer component in components/layout/Footer.tsx
  - Secondary navigation: Category links
  - Social links (LinkedIn, Twitter, GitHub)
  - Copyright notice
  - Newsletter signup placeholder (future enhancement)
  - Navy 900 background
  - From: plan.md:359-365

- [ ] T082 [US2] Update app/layout.tsx to include Header and Footer
  - Wrap children with Header (top) and Footer (bottom)
  - Update metadata: Site title "Marcus Gollahon", description from constitution
  - Add GA4 script tag (NEXT_PUBLIC_GA_ID)
  - REUSE: Header (T080), Footer (T081)
  - From: plan.md:262-267

### Analytics Integration

- [ ] T085 [P] Add analytics events to DualTrackShowcase CTAs
  - Track "Explore Aviation" clicks: trackContentTrackClick('aviation', 'homepage')
  - Track "Explore Dev/Startup" clicks: trackContentTrackClick('dev-startup', 'homepage')
  - File: components/home/DualTrackShowcase.tsx (update from T026)
  - REUSE: analytics.ts (T046)
  - From: spec.md:114-119, plan.md:343-350

- [ ] T086 [P] Add analytics page view tracking to all pages
  - Track page views with track metadata
  - Files: app/page.tsx, app/aviation/page.tsx, app/dev-startup/page.tsx, app/blog/[slug]/page.tsx
  - Use useEffect client component wrapper for client-side tracking
  - REUSE: trackPageView (T046)
  - From: spec.md:119, data-model.md:205-211

### Environment & Documentation

- [ ] T090 Document Ghost Admin setup in NOTES.md
  - Ghost CMS URL configuration
  - Content API key generation steps
  - Tag structure and descriptions
  - Navigation configuration
  - 35-post bulk tagging process
  - From: plan.md:426-494, T036 checklist

- [ ] T091 Create deployment checklist in specs/002-ghost-cms-migration/deployment-checklist.md
  - Environment variables verification (GHOST_API_URL, GHOST_CONTENT_API_KEY)
  - Ghost Admin tag configuration complete
  - 35 aviation posts tagged
  - Build succeeds (next build)
  - Lighthouse audit ≥90 performance
  - ISR revalidation tested (publish post, verify appears within 60s)
  - Analytics events fire in GA4 Realtime
  - Rollback procedure documented
  - From: plan.md:516-528, spec.md:287-322

- [ ] T092 Add performance monitoring setup in NOTES.md
  - Lighthouse CI configuration (future enhancement)
  - Core Web Vitals targets (FCP <2s, LCP <3s)
  - Ghost API response time monitoring strategy
  - ISR cache hit rate tracking
  - From: plan.md:175-193, spec.md:120-127

---

## [TASK SUMMARY]

**Total Tasks**: 30
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US1 - Publishing): 4 tasks
- Phase 4 (US2 - Dual-Track): 4 tasks
- Phase 5 (US3 - Organization): 2 tasks
- Phase 6 (US4 - Cross-Pollination): 3 tasks
- Phase 7 (US5 - Performance): 3 tasks
- Phase 8 (Polish): 7 tasks

**Parallel Opportunities**: 16 tasks marked [P]
**User Story Tasks**: 20 tasks (marked [US1] through [US5])
**Blocking Prerequisites**: Phase 2 (4 tasks) must complete before user story phases

**Estimated Duration**:
- Phase 1-2 (Foundation): 4-6 hours
- Phase 3-7 (User Stories): 16-20 hours
- Phase 8 (Polish): 6-8 hours
- **Total**: 26-34 hours

**MVP Scope**: Phase 1-4 (15 tasks) - Basic dual-track content display with hub pages
**Full Feature**: All 30 tasks - Complete Ghost CMS integration with analytics and performance optimization
