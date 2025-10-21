# Feature: Ghost CMS Migration to Next.js

## Overview

This feature involves migrating the personal website/blog (marcusgoll.com) from a standalone setup to a headless Ghost CMS + Next.js architecture. The migration will enable systematic content management for dual-track brand content (Aviation + Dev/Startup) while maintaining full control over frontend design and user experience.

## Research Findings

### Finding 1: Existing Implementation Documentation
**Source**: `docs/GHOST_NEXTJS_IMPLEMENTATION.md`
**Details**: Comprehensive implementation guide already exists covering:
- Ghost tag structure for dual-track content (aviation, dev-startup, cross-pollination)
- Component architecture with Next.js
- Ghost Content API integration patterns
- Analytics tracking for content tracks
- Week-by-week implementation timeline

**Decision**: Use existing implementation guide as reference architecture

### Finding 2: Current Tech Stack
**Source**: `package.json:14-19`
**Tech Stack**:
- Next.js 15.5.6 (frontend framework)
- React 19.2.0
- @tryghost/content-api 1.12.0 (already installed!)
- Tailwind CSS 4.1.15 for styling

**Decision**: Ghost Content API package already installed - integration layer exists

### Finding 3: Brand Standards
**Source**: `.spec-flow/memory/constitution.md:375-498`
**Brand Identity**:
- **Mission**: "I help pilots advance their aviation careers and teach developers to build with systematic thinking"
- **Colors**: Navy 900 `#0F172A` (primary), Emerald 600 `#059669` (secondary)
- **Typography**: Work Sans (headings/body), JetBrains Mono (code)
- **Content Strategy**: 40% aviation, 40% dev/startup, 20% cross-pollination
- **Accessibility**: WCAG 2.1 AA minimum (4.5:1 contrast, keyboard nav)

**Decision**: All UI components must adhere to defined brand standards

### Finding 4: Ghost API Client Already Exists
**Source**: `lib/ghost.ts:1-904`
**Existing Functions**:
- `getPostsByTag(tagSlug, limit)` - Filter posts by tag
- `getAviationPosts(limit)` - Aviation content
- `getDevStartupPosts(limit)` - Dev/Startup content
- `getAllPosts(limit)` - All content
- `getPostBySlug(slug)` - Single post retrieval
- `getPrimaryTrack(tags)` - Helper to determine content track

**Decision**: Ghost API integration layer already built - migration focuses on Ghost CMS setup and content organization

### Finding 5: Performance Budgets
**Source**: `.spec-flow/memory/constitution.md:543-558`
**Requirements**:
- Page loads: <2s First Contentful Paint, <3s Largest Contentful Paint
- API responses: <200ms p50, <500ms p95
- Database queries: <50ms reads, <100ms writes

**Decision**: Use ISR (Incremental Static Regeneration) to minimize API calls and meet performance targets

### Finding 6: Deployment Model
**Source**: `specs/002-ghost-cms-migration/workflow-state.yaml:13`
**Model**: remote-direct
**Implication**: Direct production deployment without staging environment

**Decision**: Pre-deployment testing critical - use preview gate rigorously

## System Components Analysis

**Reusable (from existing codebase)**:
- Ghost API client (`lib/ghost.ts`)
- Next.js page routing structure
- Tailwind CSS configuration
- Package dependencies (@tryghost/content-api)

**New Components Needed**:
- Ghost Admin configuration (tags, navigation)
- TrackBadge component (for aviation/dev/cross-pollination badges)
- DualTrackShowcase component (homepage feature sections)
- Aviation hub page (`pages/aviation.tsx`)
- Dev/Startup hub page (`pages/dev-startup.tsx`)
- Hero component with dual-track CTA
- PostCard component with track badges
- Analytics tracking functions (`lib/analytics.ts`)

**Rationale**: System-first approach - leverage existing Ghost API client, build UI components following brand guidelines

## Feature Classification

- UI screens: true (homepage, hub pages, post templates)
- Improvement: false (new architecture, not improving existing)
- Measurable: true (content track engagement, newsletter signups)
- Deployment impact: true (environment variables, content migration)

## Checkpoints

- Phase 0 (Specification): 2025-10-21
- Phase 1 (Planning): 2025-10-21
  - Artifacts: research.md, data-model.md, quickstart.md, plan.md, contracts/ghost-api.yaml, error-log.md
  - Research decisions: 5 (Ghost API reuse, Next.js App Router, Tailwind CSS, ISR 60s, GA4)
  - Components to reuse: 8
  - New components needed: 14
  - Migration required: Content migration only (manual tagging in Ghost Admin)

## Phase 1 Summary

**Research Depth**: 187 lines in research.md

**Key Decisions**:
- Reuse existing Ghost API client (lib/ghost.ts) - integration layer complete
- Next.js 15 App Router for all new pages
- Tailwind CSS with brand color customization
- ISR with 60-second revalidation for content freshness
- GA4 for custom event tracking

**Components to Reuse**: 8
- lib/ghost.ts (complete Ghost API client)
- package.json dependencies
- Next.js App Router structure
- Tailwind CSS configuration
- TypeScript configuration
- app/layout.tsx root layout
- app/globals.css global styles
- Existing brand standards

**New Components**: 14
- TrackBadge, PostCard, PostGrid, Hero, DualTrackShowcase (UI components)
- Header, Footer (layout components)
- Button, Container (UI primitives)
- Aviation hub page, Dev/Startup hub page, blog post template, tag archive page (App Router pages)
- lib/analytics.ts (GA4 tracking)
- Ghost Admin tag configuration (manual setup)

**Architectural Highlights**:
- Tag-based content organization (primary + secondary tags)
- ISR pattern for static generation + revalidation
- Component composition (small, focused components)
- Centralized analytics module
- Headless CMS architecture (Ghost backend, Next.js frontend)

**Risk Mitigation**:
- Ghost API rate limiting → ISR reduces calls by 95%
- Content tagging errors → Create tagging checklist
- Performance degradation → Pagination + ISR pre-generation
- Analytics failures → Null-safe gtag checks, GA4 Realtime testing

**Migration Required**: Content migration only (no database migration)
- Manual tagging of 35 aviation posts in Ghost Admin
- Create Ghost tag structure (aviation, dev-startup, cross-pollination + categories)
- Configure Ghost navigation and site settings

## Phase 2: Tasks (2025-10-21 13:55)

**Summary**:
- Total tasks: 30
- User story tasks: 20 (organized by priority P1-P5)
- Parallel opportunities: 16 tasks marked [P]
- Setup tasks: 3 (Phase 1)
- Foundational tasks: 4 (Phase 2 - blocks all stories)
- User story phases: 5 (Phases 3-7)
- Polish tasks: 7 (Phase 8)
- Task file: specs/002-ghost-cms-migration/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 30
- ✅ User story organization: Complete (5 stories mapped to tasks)
- ✅ Dependency graph: Created (8 phases with clear blocking relationships)
- ✅ MVP strategy: Defined (Phases 1-4 = 15 tasks for basic dual-track display)
- ✅ Reuse opportunities: 8 existing components identified (Ghost API client, Tailwind, Next.js structure)
- ✅ Parallel execution: 16 tasks can run in parallel (different files, no dependencies)
- 📋 Ready for: /analyze

**Task Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks - Tailwind config, CSS variables, .env.example
- Phase 2 (Foundational): 4 tasks - getPrimaryTrack helper, UI directory structure, Container, Button
- Phase 3 (US1 - Publishing): 4 tasks - TrackBadge, PostCard, PostGrid, Aviation hub page
- Phase 4 (US2 - Dual-Track): 4 tasks - Hero, DualTrackShowcase, Homepage update, Dev/Startup hub page
- Phase 5 (US3 - Organization): 2 tasks - Tag archive page, Ghost Admin checklist
- Phase 6 (US4 - Cross-Pollination): 3 tasks - Gradient badge, Analytics module, Button tracking
- Phase 7 (US5 - Performance): 3 tasks - Blog post template, Image optimization, ISR verification
- Phase 8 (Polish): 7 tasks - Header, Footer, Layout update, Analytics integration, Documentation

**Estimated Duration**: 26-34 hours total
- Foundation (Phases 1-2): 4-6 hours
- User Stories (Phases 3-7): 16-20 hours
- Polish (Phase 8): 6-8 hours

**MVP Scope**: Phases 1-4 (15 tasks) - Basic dual-track content display with hub pages

## Last Updated

2025-10-21T14:15:00Z

## Implementation Progress

### Phase 1: Setup ✅

✅ T001 [P]: Update Tailwind config with brand colors
  - Evidence: tailwind.config.ts updated with Navy 900, Emerald 600, Sky Blue
  - Added: Brand colors, Work Sans/JetBrains Mono fonts, 8px spacing base
  - Committed: dece260

✅ T002 [P]: Add brand color CSS variables to app/globals.css
  - Evidence: globals.css updated with CSS custom properties
  - Added: --navy-900, --emerald-600, --sky-blue, --spacing-base
  - Committed: dece260

✅ T003 [P]: Create .env.example with Ghost API placeholders
  - Evidence: .env.example updated with Ghost CMS section
  - Added: GHOST_API_URL, GHOST_CONTENT_API_KEY, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SITE_URL
  - Committed: dece260


### Phase 2: Foundational Infrastructure ✅

✅ T005 [P]: Add getPrimaryTrack helper to lib/ghost.ts
  - Evidence: Function added to lib/ghost.ts:134-164
  - Logic: Priority order aviation → dev-startup → cross-pollination → null
  - Used by TrackBadge and PostGrid components
  - Committed: 5dfab34

✅ T006 [P]: Create UI components directory structure
  - Evidence: components/ui/, components/blog/, components/home/, components/layout/ created
  - Base structure for all component organization
  - Committed: 5dfab34

✅ T007 [P]: Create Container component
  - Evidence: components/ui/Container.tsx created
  - Max-width: 1280px, responsive padding (1rem/1.5rem)
  - Reusable wrapper for all pages
  - Committed: 5dfab34

✅ T008 [P]: Create Button component
  - Evidence: components/ui/Button.tsx created
  - Variants: primary (Emerald 600), secondary (Navy 900), outline
  - Sizes: sm, md, lg with full-width option
  - Committed: 5dfab34

### Phase 3: User Story 1 - Content Publishing ✅

✅ T015 [P] [US1]: Create TrackBadge component
  - Evidence: components/blog/TrackBadge.tsx created
  - Colors: Aviation (Sky Blue), Dev/Startup (Emerald), Cross-pollination (gradient)
  - WCAG AA contrast, aria-label for accessibility
  - Committed: eff53c9

✅ T016 [P] [US1]: Create PostCard component
  - Evidence: components/blog/PostCard.tsx created
  - Displays: featured image, title, excerpt, author, date, reading time, TrackBadge
  - Next.js Image optimization, hover effects, responsive layout
  - Committed: eff53c9

✅ T017 [P] [US1]: Create PostGrid component
  - Evidence: components/blog/PostGrid.tsx created
  - Responsive grid: 1/2/3 columns (mobile/tablet/desktop)
  - Auto-detects track using getPrimaryTrack
  - Committed: eff53c9

✅ T018 [US1]: Create Aviation hub page
  - Evidence: app/aviation/page.tsx created
  - ISR with 60-second revalidation
  - Categorized display: Flight Training, CFI Resources, Career Path
  - Static metadata for SEO
  - Committed: eff53c9

### Phase 4: User Story 2 - Dual-Track Display ✅

✅ T025 [P] [US2]: Create Hero component
  - Evidence: components/home/Hero.tsx created
  - Professional layout with headshot (right desktop, top mobile)
  - Headline: "Marcus Gollahon", Tagline: "Teaching Systematic Thinking from 30,000 Feet"
  - Mission subtitle and dual CTAs (Aviation/Dev-Startup)
  - Navy 900 gradient background, responsive design
  - Committed: [pending]

✅ T026 [P] [US2]: Create DualTrackShowcase component
  - Evidence: components/home/DualTrackShowcase.tsx created
  - Displays latest posts from both tracks with "View All" CTAs
  - Uses PostGrid for consistent layout
  - Empty state handling for each track
  - Committed: [pending]

✅ T027 [P] [US2]: Update homepage with dual-track design
  - Evidence: app/page.tsx completely rewritten
  - ISR with 60-second revalidation
  - Fetches 3 posts per track for homepage showcase
  - Replaces static content with Ghost CMS integration
  - Committed: [pending]

✅ T028 [P] [US2]: Create Dev/Startup hub page
  - Evidence: app/dev-startup/page.tsx created
  - ISR with 60-second revalidation
  - Categorized display: Software Development, Systematic Thinking, Startup Insights
  - Static metadata for SEO
  - Mirrors Aviation hub structure
  - Committed: [pending]

### Phase 5: User Story 3 - Content Organization ✅

✅ T035 [P] [US3]: Create tag archive page
  - Evidence: app/tag/[slug]/page.tsx created
  - Dynamic route for all Ghost tags
  - ISR with 60-second revalidation
  - 404 handling for non-existent tags
  - Dynamic metadata generation
  - Committed: [pending]

✅ T036 [US3]: Create Ghost Admin tag configuration checklist
  - Evidence: specs/002-ghost-cms-migration/ghost-admin-checklist.md created
  - Complete tag structure: 3 primary tags, 6 secondary tags
  - Tag application rules and examples
  - Content migration checklist (35 aviation posts)
  - Testing and performance verification steps
  - Committed: [pending]

## Session 2 Summary (2025-10-21 14:15)

**Tasks Completed**: 6 (T025-T028, T035-T036)
**Progress**: 17/50 tasks (34%)
**Time Estimate**: Session 2 added ~4-5 hours of work

**Files Created**:
- components/home/Hero.tsx - Homepage hero with dual-track CTAs
- components/home/DualTrackShowcase.tsx - Homepage content showcase
- app/dev-startup/page.tsx - Dev/Startup hub page
- app/tag/[slug]/page.tsx - Dynamic tag archive pages
- specs/002-ghost-cms-migration/ghost-admin-checklist.md - Ghost Admin setup guide

**Files Modified**:
- app/page.tsx - Replaced static content with Ghost CMS dual-track display

**Next Session Scope**:
- Session 3: US4 Cross-Pollination (T045-T047) - Gradient badge, Analytics module, Button tracking
- Session 3: US5 Performance & ISR (T055-T057) - Blog post template, Image optimization, ISR verification
- Session 3: Polish & Documentation (T080-T090) - Header, Footer, Layout, Analytics integration

**Remaining Tasks**: 33 tasks (Phases 4.6-4.8)

## Session 3 Summary (2025-10-21 14:45)

**Tasks Completed**: 11 (T045-T047, T055-T057, T080-T082)
**Progress**: 28/50 tasks (56%)
**Time Estimate**: Session 3 added ~5-6 hours of work

**Files Created**:
- lib/analytics.ts - GA4 analytics module with track-specific events
- app/blog/[slug]/page.tsx - Blog post template with ISR
- components/layout/Header.tsx - Sticky header with dropdown navigation
- components/layout/Footer.tsx - Footer with social links and category navigation

**Files Modified**:
- components/ui/Button.tsx - Added analytics tracking support
- app/layout.tsx - Added Header, Footer, and Google Analytics integration

**Key Achievements**:
- Analytics tracking infrastructure complete (trackContentTrackClick, trackPageView, etc.)
- Blog post template with full content display, SEO optimization, and ISR
- Site navigation complete (desktop dropdowns, mobile hamburger menu)
- Google Analytics integration with GA4 script tags

**Tasks Already Complete** (discovered during session):
- T045: TrackBadge gradient already implemented (Session 1)
- T056: PostCard Image optimization already implemented (Session 1)
- T057: ISR revalidation already configured on all pages (Sessions 1-2)

**Remaining Tasks**: 22 tasks (T085-T090 + additional polish)

## Session 4 Summary (2025-10-21 15:00)

**Tasks Completed**: 4 (T085-T086, T090-T091)
**Progress**: 32/50 tasks (64%)
**Time Estimate**: Session 4 added ~2-3 hours of work

**Files Created**:
- components/analytics/PageViewTracker.tsx - Client component for page view tracking

**Files Modified**:
- components/home/DualTrackShowcase.tsx - Added analytics tracking to CTAs
- app/page.tsx - Added PageViewTracker
- app/aviation/page.tsx - Added PageViewTracker with 'aviation' track
- app/dev-startup/page.tsx - Added PageViewTracker with 'dev-startup' track
- app/blog/[slug]/page.tsx - Added PageViewTracker with dynamic track detection

**Key Achievements**:
- Analytics integration complete across all key pages
- Button CTAs now track content track engagement
- Page view tracking with content track segmentation
- Ghost Admin setup documentation already complete (ghost-admin-checklist.md)

**Ghost Admin Setup Documentation** (T090):
Complete setup guide available at: `specs/002-ghost-cms-migration/ghost-admin-checklist.md`

Key sections:
1. **Prerequisites**: Ghost Admin access, Content API key generation
2. **Primary Tags** (3 tags):
   - `aviation` (Sky Blue #0EA5E9)
   - `dev-startup` (Emerald #059669)
   - `cross-pollination` (Purple #8B5CF6)
3. **Secondary Tags** (6 category tags):
   - Aviation: flight-training, cfi-resources, career-path
   - Dev/Startup: software-development, systematic-thinking, startup-insights
4. **Tag Application Rules**: Every post must have exactly one primary tag + zero or more secondary tags
5. **Content Migration**: 35 aviation posts need manual tagging
6. **Ghost Site Settings**: Site title, description, navigation configuration
7. **Testing Checklist**: Verify all pages, tag archive functionality, ISR revalidation
8. **Performance Verification**: API response times, page load times, LCP targets

**Implementation Complete**: 32/50 tasks (64%)
**Remaining**: 18 tasks (primarily additional polish and optimization)

