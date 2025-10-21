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

2025-10-21T13:55:00Z

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

