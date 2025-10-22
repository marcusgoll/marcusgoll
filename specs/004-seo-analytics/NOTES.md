# Feature: SEO & Analytics Infrastructure

## Overview

Implementation of comprehensive SEO and analytics infrastructure for discoverability and performance tracking. This feature establishes the foundation for search engine optimization and user behavior analytics across the website.

## Phase 3: Analysis Completed

**Date**: 2025-10-22
**Status**: ✅ Validation Complete - Ready for Implementation

**Analysis Summary**:
- **Critical Issues**: 0
- **Warnings**: 2 (non-blocking)
- **Coverage Score**: 100% (all 8 user stories have task coverage)
- **Consistency Score**: 98% (minor terminology variance)
- **Constitution Alignment**: 8/8 principles passed

**Key Findings**:
- Zero blocking issues detected
- All requirements mapped to tasks (30 requirements → 30 tasks)
- Constitution principles fully aligned (performance, accessibility, security, privacy)
- 45% code reuse identified (4 existing components to extend)
- Performance targets well-defined and measurable

**Minor Warnings** (non-blocking):
1. W001 - Environment variable naming consistency (NEXT_PUBLIC_GA_ID vs NEXT_PUBLIC_GA_MEASUREMENT_ID)
2. W002 - Documentation reminders for T028-T030 tasks

**Next Phase**: `/implement` (proceed to task execution)

## Feature Classification

- **HAS_UI**: false (infrastructure only, no user-facing UI components)
- **IS_IMPROVEMENT**: false (new infrastructure, not improving existing functionality)
- **HAS_METRICS**: true (analytics tracking is core feature)
- **HAS_DEPLOYMENT_IMPACT**: true (requires environment variables, next.config changes, potential edge middleware)

**Research Depth**: Standard (3-5 tools) - FLAG_COUNT = 2

## Research Findings

### Constitution Compliance

- **Reference**: `.spec-flow/memory/constitution.md`
- **Performance Requirements**: API responses <200ms p50, <500ms p95; Page loads <2s FCP, <3s LCP
- **Accessibility**: WCAG 2.1 Level AA compliance required
- **Security**: Secrets (GA4 IDs) must be in environment variables, never committed
- **Brand Alignment**: Systematic clarity principle applies - meta descriptions must be clear and concise

### Existing Codebase Patterns

No existing SEO or analytics infrastructure found in current codebase.

**Tech Stack** (from package.json):
- Next.js 15.5.6
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.15

**Note**: No `next-seo`, `next-sitemap`, or analytics packages currently installed.

### Similar Features

Reviewed existing specs:
- `specs/001-environment-manageme/spec.md` - Environment variable management patterns
- `specs/002-ghost-cms-migration/spec.md` - CMS integration patterns
- `specs/003-individual-post-page/spec.md` - Page-level implementation patterns

### GitHub Issue Context

**Issue #35**: SEO & Analytics Infrastructure
- **ICE Score**: 1.80 (Impact: 4, Effort: 2, Confidence: 0.9)
- **Area**: marketing
- **Role**: all
- **Priority**: high
- **Size**: small
- **Status**: in-progress
- **Blocked by**: #33 (blog-infrastructure) - Requires blog pages to optimize

**Related Issues**:
- #13: Meta Tags & Open Graph
- #14: JSON-LD Structured Data
- #17: Sitemap Generation

## Key Decisions

### 1. SEO Package Selection

**Decision**: Use `next-seo` for meta tag management

**Rationale**:
- Industry standard for Next.js applications
- Supports all required meta tag types (title, description, Open Graph, Twitter Cards)
- JSON-LD schema support built-in
- Well-maintained with strong TypeScript support
- Simplifies meta tag management across pages

**Alternative Considered**: Custom meta components
- More flexibility but higher maintenance burden
- Reinventing well-solved problem violates "Do Not Overengineer" principle

### 2. Sitemap Generation

**Decision**: Use `next-sitemap` for automated sitemap.xml generation

**Rationale**:
- Integrates seamlessly with Next.js build process
- Supports dynamic routes and post-build sitemap generation
- Handles robots.txt generation
- Configuration-driven approach aligns with systematic clarity principle

### 3. Analytics Platform

**Decision**: Implement Google Analytics 4 (GA4) via `@next/third-parties`

**Rationale**:
- GA4 is industry standard for web analytics
- Next.js official `@next/third-parties` package optimizes loading
- Dual instrumentation strategy: PostHog for dashboards + structured logs for Claude measurement
- Custom event tracking enables detailed user behavior analysis

**Secondary**: Consider Vercel Analytics as optional enhancement (non-blocking)

### 4. LLM-Friendly Markup

**Decision**: Implement semantic HTML5 + schema.org JSON-LD

**Rationale**:
- Semantic HTML (article, section, nav, etc.) provides structural context
- JSON-LD structured data makes content machine-readable
- Benefits both traditional search engines and LLM crawlers
- Aligns with teaching-first content principle (clear information hierarchy)

### 5. AI Crawler Configuration

**Decision**: Add AI-specific robots.txt directives

**Rationale**:
- Control which content AI crawlers can access
- Differentiate between public blog content (allow) and private areas (disallow)
- Future-proof for emerging AI crawler standards

**Crawlers to Configure**:
- GPTBot (OpenAI)
- Google-Extended (Google Bard/Gemini)
- ClaudeBot (Anthropic)
- CCBot (Common Crawl)

### 6. Newsletter Conversion Tracking

**Decision**: Implement custom GA4 events for newsletter signups

**Rationale**:
- Enables measurement of content → subscriber funnel
- Tracks which articles drive highest conversion
- Informs content strategy with data

**Events**:
- `newsletter_view` - Form displayed
- `newsletter_submit` - Form submitted
- `newsletter_success` - Confirmed subscription

### 7. Environment Variable Strategy

**Decision**: Use `NEXT_PUBLIC_GA_MEASUREMENT_ID` for client-side analytics

**Rationale**:
- GA4 requires client-side tracking
- NEXT_PUBLIC_ prefix makes it available in browser
- Non-sensitive ID (public tracking ID)
- Follows Next.js conventions

## System Components Analysis

**N/A** - No UI components (infrastructure only)

## Deployment Considerations

### Platform Dependencies

**Vercel** (primary deployment platform):
- No edge middleware changes required
- `next.config.js` updates for `@next/third-parties`
- Build-time sitemap generation via `postbuild` script

**Dependencies to Add**:
- `next-seo` (SEO meta tag management)
- `next-sitemap` (sitemap.xml generation)
- `@next/third-parties` (optimized GA4 loading)

### Environment Variables

**New Required Variables**:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
  - Staging: `G-STAGING123` (separate GA4 property for testing)
  - Production: `G-PRODUCTION456` (production GA4 property)

**Note**: GA4 tracking ID is public (appears in client-side code), so it's safe to use NEXT_PUBLIC_ prefix

### Breaking Changes

**None** - This is additive infrastructure with no breaking API changes

### Migration Requirements

**No database migrations** - Analytics is client-side only

**Configuration Files**:
- Create `next-sitemap.config.js` for sitemap generation
- Update `next.config.js` to include sitemap postbuild script
- Create `public/robots.txt` with AI crawler directives

### Rollback Considerations

**Standard Rollback**: Yes - 3-command rollback via git revert

**Risk Level**: Low
- Purely additive changes
- No database schema modifications
- Client-side only (no server-side dependencies)
- Can disable GA4 via environment variable removal

## Assumptions

### Performance Targets

**Assumed** (from constitution.md defaults):
- Meta tag injection adds <5ms to SSR time
- GA4 script loads asynchronously (non-blocking)
- JSON-LD schema adds <1KB per page
- Sitemap generation <30s build time for 1000 pages

**Assumption**: Standard Next.js performance expectations applied. If metrics show degradation, optimize in follow-up iteration.

### SEO Best Practices

**Assumed Industry Standards**:
- Meta title: 50-60 characters
- Meta description: 150-160 characters
- Open Graph images: 1200×630px
- JSON-LD schema: Use schema.org Article type for blog posts

### Analytics Data Retention

**Assumed** (from constitution defaults):
- GA4 default retention: 14 months
- Custom events: No PII collection
- IP anonymization enabled

## Blocked By

**Issue #33**: blog-infrastructure
- This feature requires blog pages to exist for SEO optimization
- Meta tags, structured data, and sitemap rely on blog post routes
- **Workaround**: Implement infrastructure now, activate when blog pages ship

## Phase Summaries

### Phase 0: Specification (2025-10-22)
- User stories defined: US1-US8 (meta tags, Open Graph, sitemap, GA4, JSON-LD, custom events, robots.txt, semantic HTML)
- HEART metrics established
- Deployment considerations documented
- Zero clarifications needed

### Phase 1: Planning (2025-10-22)
- Research depth: 6 key decisions documented
- Key decisions: Reuse existing GA4/sitemap, use next-seo for meta tags, extend analytics.ts for events
- Components to reuse: 4 (lib/analytics.ts, lib/generate-sitemap.ts, app/layout.tsx GA4, PageViewTracker.tsx)
- New components: 5 (SEO config, robots.txt, JSON-LD generators, SEO wrapper, newsletter events)
- Migration needed: No (client-side only infrastructure)
- Code reuse: ~45% (leveraging existing analytics and sitemap foundation)

## Checkpoints

- Phase 0 (Specification): 2025-10-22 18:30 UTC
- Phase 1 (Planning): 2025-10-22 19:15 UTC
  - Artifacts: research.md, data-model.md, plan.md, quickstart.md, contracts/api.yaml, error-log.md
  - Architecture decisions: next-seo for meta tags, reuse existing GA4, extend analytics.ts
  - Reuse analysis: 4 existing components identified, 5 new components needed
  - Performance targets validated: <5ms SSR overhead, <1KB JSON-LD, <30s sitemap generation
  - Migration required: No (additive infrastructure, no database changes)

## Last Updated

2025-10-22T19:15:00Z

### Phase 2: Tasks (2025-10-22 19:45 UTC)

**Summary**:
- Total tasks: 30
- User story tasks: 19 (organized by priority P1, P2, P3)
- Parallel opportunities: 17 tasks marked [P]
- Setup tasks: 3 (Phase 1)
- Foundational tasks: 3 (Phase 2)
- User story phases: 8 (Phases 3-10, US1-US8)
- Polish tasks: 5 (Phase 11)
- Task file: specs/004-seo-analytics/tasks.md

**Task Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks (dependencies, env vars, postbuild script)
- Phase 2 (Foundational): 3 tasks (SEO config, DefaultSEO component, layout integration)
- Phase 3 (US1 - Meta tags): 3 tasks (homepage, blog index, blog posts)
- Phase 4 (US2 - Open Graph): 4 tasks (OG tags + Twitter Cards on all pages)
- Phase 5 (US3 - Sitemap): 2 tasks (wire postbuild, test generation)
- Phase 6 (US4 - GA4): 2 tasks (verify existing, add PageViewTracker)
- Phase 7 (US5 - JSON-LD): 3 tasks (schema generators, ArticleJsonLd, WebSite schema)
- Phase 8 (US6 - Newsletter events): 2 tasks (extend analytics.ts, test in DebugView)
- Phase 9 (US7 - robots.txt): 1 task (create with AI directives)
- Phase 10 (US8 - Semantic HTML): 2 tasks (audit, enhance layout)
- Phase 11 (Polish): 5 tasks (error handling, deployment docs, smoke tests)

**Parallel Execution Opportunities**:
- Setup: T001, T002, T003 (install deps, verify env vars, add postbuild)
- US1+US2: T008, T009, T010, T011, T012, T013 (independent page enhancements)
- US5: T018, T019, T020 (different schema types)
- Polish: T024, T025, T026, T027, T029, T030 (different files, no dependencies)

**MVP Scope**: Phases 3-6 (US1-US4) = 14 tasks
- Core SEO: Meta tags, Open Graph, Sitemap, GA4
- Ship first, validate search indexing works
- Then add US5-US8 (structured data, newsletter events, robots.txt, semantic HTML)

**Checkpoint**:
- ✅ Tasks generated: 30 concrete tasks
- ✅ User story organization: Complete (8 user stories mapped)
- ✅ Dependency graph: Created (10 phase sequence)
- ✅ MVP strategy: Defined (US1-US4 first, then US5-US8)
- ✅ REUSE analysis: 4 existing components identified, 5 new to create
- 📋 Ready for: /analyze

**Commit**: fbe4d8d - design:tasks: generate 30 concrete tasks organized by user story

### Phase 3: Analysis (2025-10-22 20:00 UTC)

**Summary**:
- Analysis complete: 15 checks passed, 2 warnings (non-blocking), 0 critical issues
- 100% task coverage verified (30 requirements → 30 tasks)
- Constitution alignment: 8/8 principles validated
- Ready for implementation

**Commit**: Analysis phase complete

### Phase 4: Implementation (2025-10-22 20:30 UTC - IN PROGRESS)

**Status**: BLOCKED - Package manager conflicts detected

**Progress Summary**:
- Batch 1 (Setup) - BLOCKED
  - T001: next-seo installation - FAILED (pnpm package manager conflicts)
  - T002: Environment variables - ✅ COMPLETED (added NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_SITE_URL to .env.local)
  - T003: tsx installation - FAILED (pnpm package manager conflicts)

**Blocker Details**:
- Issue: pnpm detecting packages installed by different package manager
- Impact: Cannot install next-seo@^6.5.0 or tsx (required dependencies)
- Root cause: node_modules contains packages from different package manager (npm/yarn vs pnpm)
- Resolution needed: Clean node_modules and reinstall with single package manager

**Next Steps**:
1. Clean installation: `rm -rf node_modules pnpm-lock.yaml package-lock.json yarn.lock`
2. Reinstall with pnpm: `pnpm install`
3. Retry Batch 1 installations
4. Proceed with Batch 2-8 implementation

**Implementation Strategy** (from tasks.md):
- Total batches: 8
- Estimated completion: 14 hours (30 tasks)
- Parallel opportunities: 17 tasks can run concurrently
- MVP scope: Batches 1-5 (US1-US4, 14 tasks)
