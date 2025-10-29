# Tasks: Homepage Redesign

**Feature**: 055-homepage-redesign
**Generated**: 2025-10-29
**Total Tasks**: 28

## [CODEBASE REUSE ANALYSIS]

Scanned: D:\coding\tech-stack-foundation-core

### [EXISTING - REUSE]

**UI Components** (10 reusable):
- ✅ Hero (components/home/Hero.tsx) - Enhance with navy brand palette
- ✅ PostFeedFilter (components/home/PostFeedFilter.tsx) - Track filtering with URL state
- ✅ PostCard (components/blog/PostCard.tsx) - Post preview cards
- ✅ PostGrid (components/blog/PostGrid.tsx) - Grid layout for posts
- ✅ FeaturedPostsSection (components/home/FeaturedPostsSection.tsx) - Featured content showcase
- ✅ NewsletterSignupForm (components/newsletter/NewsletterSignupForm.tsx) - Multi-track subscription
- ✅ Button (components/ui/Button.tsx) - CTA buttons with variants
- ✅ Container (components/ui/Container.tsx) - Section wrapper
- ✅ Dialog (components/ui/dialog.tsx) - Accessible modals
- ✅ TrackBadge (components/blog/TrackBadge.tsx) - Track badges for posts

**Utilities**:
- ✅ getAllPosts (lib/posts.ts) - MDX post fetching with frontmatter
- ✅ analytics (lib/analytics.ts) - GA4 event tracking
- ✅ shimmer (lib/utils/shimmer.ts) - Image blur placeholders

**API Endpoints**:
- ✅ /api/newsletter/subscribe - Newsletter subscription (Resend integration)

### [NEW - CREATE]

**UI Components** (1 new):
- 🆕 ProjectCard (components/home/ProjectCard.tsx) - "What I'm building" showcase

**Enhancements**:
- 🔧 app/page.tsx - Reorganize layout for new design
- 🔧 components/home/Hero.tsx - Apply navy brand palette, update messaging

## [DEPENDENCY GRAPH]

Story completion order:
1. **Phase 1: Setup** (T001-T003) - Brand tokens, project structure
2. **Phase 2: Foundational** (T004-T006) - Shared infrastructure
3. **Phase 3: US1 [P1]** (T007-T011) - Hero section (MVP blocker)
4. **Phase 4: US2 [P1]** (T012-T015) - Content track filtering (MVP blocker)
5. **Phase 5: US3 [P1]** (T016-T019) - Recent posts grid (MVP blocker)
6. **Phase 6: US4 [P2]** (T020-T021) - Featured posts (Enhancement)
7. **Phase 7: US5 [P2]** (T022-T023) - Project card (Enhancement)
8. **Phase 8: US6 [P2]** (T024-T025) - Newsletter CTA (Enhancement)
9. **Phase 9: Polish** (T026-T028) - Performance, deployment prep

**MVP Delivery**: Phases 1-5 (US1-US3) = Functional homepage with hero, filtering, and recent posts

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2**: T004, T005, T006 (independent utilities)
- **Phase 3 (US1)**: T008, T009 (tests can run parallel to implementation prep)
- **Phase 4 (US2)**: T013, T014 (different components)
- **Phase 5 (US3)**: T017, T018 (grid layout vs card component)
- **Phase 6-8**: All enhancement user stories are independent (US4, US5, US6 can be implemented in parallel)
- **Phase 9**: T026, T027 (performance vs deployment tasks)

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 1-5 (US1-US3 only)
- Hero section with brand identity
- Content track filtering (no page reload)
- Recent posts grid (responsive)

**Incremental Delivery**:
1. MVP (US1-US3) → Local preview → Staging validation
2. Enhancement (US4-US6) → Feature posts, project card, newsletter
3. Polish (Phase 9) → Performance optimization, mobile nav [P3], animations [P3]

**Testing Approach**: Manual testing focus (Lighthouse, browser testing, responsive checks)
- Automated tests for newsletter API integration only
- Performance budgets enforced via Lighthouse CI

---

## Phase 1: Setup

- [ ] T001 Verify brand color tokens in Tailwind config
  - File: tailwind.config.ts
  - Verify: Navy 900 (#0F172A), Emerald 600 (#059669) defined
  - Pattern: Existing color definitions in config
  - From: plan.md:32-36

- [ ] T002 [P] Audit existing component inventory
  - Files: components/home/*.tsx, components/blog/*.tsx
  - Check: Hero, PostFeedFilter, PostCard, PostGrid, FeaturedPostsSection exist
  - Document: Any missing components in NOTES.md
  - From: plan.md:345-417

- [ ] T003 [P] Create project constants file
  - File: lib/constants.ts (or update existing)
  - Constants: SITE_TAGLINE, HERO_HEADLINE, ACTIVE_PROJECT (CFIPros.com data)
  - Pattern: lib/env-schema.ts structure
  - From: spec.md:38-42, 74-81

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that supports all user stories

- [ ] T004 [P] Verify MDX frontmatter supports featured flag
  - File: lib/mdx.ts, lib/posts.ts
  - Add: `featured: boolean` to Post type
  - Test: Parse sample MDX with `featured: true`
  - Pattern: Existing tag parsing in lib/posts.ts
  - From: plan.md:226-248

- [ ] T005 [P] Verify analytics tracking functions
  - File: lib/analytics.ts
  - Functions: trackEvent('homepage.filter_click'), trackEvent('homepage.newsletter_signup')
  - Test: Events fire in browser console
  - Pattern: Existing analytics implementation
  - From: spec.md:323-345

- [ ] T006 [P] Verify image shimmer utility
  - File: lib/utils/shimmer.ts
  - Function: shimmerDataURL() returns base64 blur placeholder
  - Usage: PostCard image lazy loading
  - From: plan.md:408-411

---

## Phase 3: User Story 1 [P1] - Modern hero section

**Story Goal**: Visitor sees modern hero with brand identity and value proposition above fold

**Acceptance Criteria** (from spec.md:38-42):
- Hero displays headline, tagline, and primary CTA above fold (<600px height)
- Navy background palette applied with proper contrast ratios (WCAG AA)
- Responsive design works 320px-1440px+ viewports
- Page loads with FCP <1.5s, LCP <2.5s

### Implementation

- [ ] T007 [US1] Update Hero component with navy brand palette
  - File: components/home/Hero.tsx
  - Changes:
    - Background: bg-[#0F172A] (Navy 900)
    - CTA buttons: bg-[#059669] (Emerald 600)
    - Text contrast: Verify ≥4.5:1 with WebAIM tool
  - REUSE: Existing Hero component structure
  - Pattern: components/home/Hero.tsx:44-117
  - From: plan.md:424-431

- [ ] T008 [US1] Update hero headline and tagline
  - File: components/home/Hero.tsx
  - Headline: "Systematic thinking from 30,000 feet" (or spec-aligned)
  - Tagline: Dual-track value prop (Aviation + Dev/Startup)
  - CTAs: "Read Latest Posts" (primary), "Subscribe" (secondary)
  - From: spec.md:10-11, plan.md:424-431

- [ ] T009 [US1] Verify hero responsive breakpoints
  - File: components/home/Hero.tsx
  - Test viewports: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px+
  - Verify: No horizontal scroll, text readable, CTAs accessible
  - Tool: Browser DevTools responsive mode
  - From: spec.md:38-42 (NFR-003)

### Integration

- [ ] T010 [US1] Test hero section performance
  - Route: http://localhost:3000/
  - Lighthouse: FCP <1.5s, LCP <2.5s
  - Above fold: Hero visible within 600px viewport height
  - From: spec.md:38-42 (NFR-001)

- [ ] T011 [US1] Test hero accessibility
  - Tool: axe DevTools or Lighthouse Accessibility
  - Verify: Color contrast ≥4.5:1, keyboard navigation (Tab to CTAs)
  - Screen reader: Headline, tagline, CTAs announced correctly
  - From: spec.md:38-42 (NFR-002)

---

## Phase 4: User Story 2 [P1] - Content track filtering

**Story Goal**: Visitor filters posts by track (Aviation/Dev) without page reload

**Acceptance Criteria** (from spec.md:44-52):
- Filter buttons show post counts for each track
- Clicking filter updates visible posts instantly (no page reload)
- URL updates with filter parameter (shareable links)
- "All" filter shows all posts
- Clear visual feedback for active filter

### Implementation

- [ ] T012 [US2] Verify PostFeedFilter component
  - File: components/home/PostFeedFilter.tsx
  - Features: Track buttons, URL state sync, analytics tracking
  - Test: Click "Aviation" → URL updates to /?track=aviation
  - REUSE: Existing PostFeedFilter component
  - Pattern: components/home/PostFeedFilter.tsx:30-88
  - From: plan.md:374-378

- [ ] T013 [US2] Add post count display to filter buttons
  - File: components/home/PostFeedFilter.tsx
  - Display: "Aviation (12)" format for each track
  - Logic: Count posts by tag (aviation, dev-startup, cross-pollination)
  - Pattern: Existing filter button rendering
  - From: spec.md:44-52

- [ ] T014 [US2] Verify filter analytics tracking
  - File: components/home/PostFeedFilter.tsx
  - Event: trackEvent('homepage.filter_click', { track: 'aviation' })
  - Verify: GA4 event fires in browser console
  - REUSE: lib/analytics.ts
  - From: spec.md:323-345

### Integration

- [ ] T015 [US2] Test content track filtering end-to-end
  - Route: http://localhost:3000/
  - Test:
    1. Click "Aviation" → Only aviation posts visible
    2. URL shows /?track=aviation
    3. Browser back/forward works
    4. "All" filter resets to show all posts
  - From: spec.md:44-52

---

## Phase 5: User Story 3 [P1] - Recent posts grid

**Story Goal**: Visitor sees grid of recent blog posts with metadata

**Acceptance Criteria** (from spec.md:54-61):
- Grid displays 6-9 most recent posts with thumbnails, titles, excerpts
- Posts show metadata (date, track tag, read time)
- Responsive: 1 column mobile, 2 tablet, 3 desktop
- Links to full blog post

### Implementation

- [ ] T016 [US3] Verify PostGrid component exists
  - File: components/blog/PostGrid.tsx
  - Layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Props: posts[] array
  - REUSE: Existing PostGrid component
  - Pattern: components/blog/PostGrid.tsx
  - From: plan.md:379-383

- [ ] T017 [US3] Verify PostCard component displays all metadata
  - File: components/blog/PostCard.tsx
  - Metadata: Date, track badge, reading time
  - Image: Lazy loaded with shimmer placeholder
  - REUSE: Existing PostCard component
  - Pattern: components/blog/PostCard.tsx:16-79
  - From: plan.md:379-383

- [ ] T018 [US3] Integrate PostGrid into homepage
  - File: app/page.tsx
  - Logic: Filter recent 6-9 posts from allPosts
  - Position: After hero section, before footer
  - Pattern: Existing homepage layout structure
  - From: plan.md:122-170

### Integration

- [ ] T019 [US3] Test recent posts grid responsive design
  - Route: http://localhost:3000/
  - Test viewports:
    - 375px (mobile): 1 column
    - 768px (tablet): 2 columns
    - 1024px+ (desktop): 3 columns
  - Verify: Images lazy load, metadata visible
  - From: spec.md:54-61

---

## Phase 6: User Story 4 [P2] - Featured posts showcase

**Story Goal**: Visitor sees 1-3 featured posts prominently displayed

**Acceptance Criteria** (from spec.md:66-72):
- Featured posts have larger cards or hero treatment
- Manual curation via MDX frontmatter (featured: true)
- Different visual treatment from recent posts grid
- Featured section appears before recent posts

### Implementation

- [ ] T020 [US4] Verify FeaturedPostsSection component
  - File: components/home/FeaturedPostsSection.tsx
  - Logic: Filter posts where featured === true
  - Layout: Larger cards or 2-column grid
  - Fallback: Hide section if no featured posts
  - REUSE: Existing FeaturedPostsSection component
  - Pattern: components/home/FeaturedPostsSection.tsx
  - From: plan.md:436-439

### Integration

- [ ] T021 [US4] Integrate featured posts into homepage
  - File: app/page.tsx
  - Position: Between hero and recent posts grid
  - Logic: Pass posts with featured=true to FeaturedPostsSection
  - Verify: Section hidden if no featured posts
  - From: spec.md:66-72

---

## Phase 7: User Story 5 [P2] - "What I'm building" project card

**Story Goal**: Visitor sees current project (CFIPros.com) with status

**Acceptance Criteria** (from spec.md:74-81):
- Card displays project name, tagline, status (active/shipped)
- Status indicator visually distinct (green for active)
- Includes CTA to visit project or read build log
- Only displays when status is "active"

### Implementation

- [ ] T022 [US5] Create ProjectCard component
  - File: components/home/ProjectCard.tsx
  - Props: { name, tagline, status, url, ctaText }
  - Conditional: Only render if status === 'active'
  - Status indicator: Green dot (bg-[#059669]) for active
  - CTA: Button with href to external project URL
  - Pattern: components/blog/PostCard.tsx structure
  - From: plan.md:442-448

### Integration

- [ ] T023 [US5] Integrate ProjectCard into homepage
  - File: app/page.tsx
  - Position: After featured posts, before or after recent posts grid
  - Data: Hardcoded ACTIVE_PROJECT from lib/constants.ts
  - Verify: Only renders when status='active'
  - From: spec.md:74-81

---

## Phase 8: User Story 6 [P2] - Newsletter signup CTA

**Story Goal**: Visitor sees prominent newsletter signup CTA

**Acceptance Criteria** (from spec.md:83-91):
- Newsletter form appears in hero section or dedicated section
- Form has email input and submit button
- Success/error feedback messages
- Integrates with existing newsletter system
- GDPR-compliant (privacy policy link)

### Implementation

- [ ] T024 [US6] Verify NewsletterSignupForm component
  - File: components/newsletter/NewsletterSignupForm.tsx
  - Variants: 'inline' for homepage section, Dialog for hero modal
  - API: POST /api/newsletter/subscribe
  - REUSE: Existing NewsletterSignupForm component
  - Pattern: components/newsletter/NewsletterSignupForm.tsx:69-362
  - From: plan.md:384-388

### Integration

- [ ] T025 [US6] Add newsletter CTA to homepage
  - File: app/page.tsx
  - Placement options:
    1. Hero Dialog (existing in Hero.tsx)
    2. Dedicated section between featured and recent posts (use 'inline' variant)
  - Decision: Use both (Dialog primary, inline section secondary)
  - From: spec.md:83-91, plan.md:450-455

---

## Phase 9: Polish & Cross-Cutting Concerns

### Performance Optimization

- [ ] T026 Verify performance budget compliance
  - Tool: npm run build && npm run start, then Lighthouse
  - Targets:
    - JavaScript bundle: <500KB
    - CSS: <100KB
    - Total page weight: <2MB
    - FCP <1.5s, LCP <2.5s, CLS <0.15
  - Fix: Optimize images to WebP, code splitting if needed
  - From: spec.md:NFR-001, NFR-006

### Deployment Preparation

- [ ] T027 Update NOTES.md with deployment checklist
  - File: specs/055-homepage-redesign/NOTES.md
  - Sections:
    - Smoke tests: Homepage loads, hero visible, filters work
    - Rollback commands: Git revert + Docker rollback
    - Performance targets: Lighthouse ≥85
  - Pattern: .spec-flow/templates/deployment-tracking-template.md
  - From: plan.md:506-620

- [ ] T028 Add homepage smoke test to CI
  - File: Add note to NOTES.md (CI update deferred to /ship phase)
  - Test: GET / returns 200, HTML contains "Systematic thinking"
  - Lighthouse: Performance ≥85, Accessibility ≥95
  - From: plan.md:506-511

---

## [DEFERRED TO FUTURE ITERATIONS]

**Priority 3 (Nice-to-have)** - Not included in initial implementation:

- **US7 [P3]**: Mobile navigation menu (hamburger, slide-out)
  - Complexity: Medium (5 hours)
  - Defer to: Polish phase after MVP validation

- **US8 [P3]**: Scroll animations (intersection observer)
  - Complexity: Small (3 hours)
  - Defer to: Polish phase after MVP validation

---

## Summary

**Total Tasks**: 28
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - Hero): 5 tasks
- Phase 4 (US2 - Filtering): 4 tasks
- Phase 5 (US3 - Recent Posts): 4 tasks
- Phase 6 (US4 - Featured): 2 tasks
- Phase 7 (US5 - Project Card): 2 tasks
- Phase 8 (US6 - Newsletter): 2 tasks
- Phase 9 (Polish): 3 tasks

**MVP Tasks** (Phases 1-5): 19 tasks (US1-US3)
**Enhancement Tasks** (Phases 6-8): 6 tasks (US4-US6)
**Polish Tasks** (Phase 9): 3 tasks

**Parallel Execution**: 14 tasks marked [P] can run in parallel

**Component Reuse**: 10 existing components, 1 new component (ProjectCard)
**Reuse Ratio**: 10/11 = 90.9%

**Next**: Run `/analyze` to validate architecture and identify risks
