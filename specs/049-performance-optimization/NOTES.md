# Feature: Performance Optimization (Lazy Loading & Code Splitting)

## Overview

Comprehensive performance optimization feature implementing lazy loading, code splitting, and bundle optimization to achieve excellent Core Web Vitals (Lighthouse > 90, FCP < 1.8s, LCP < 2.5s, CLS < 0.1, TTI < 3.8s, TBT < 200ms).

**Feature**: 049-performance-optimization
**GitHub Issue**: #27
**ICE Score**: 1.50 (HIGH priority)
- Impact: 5/5 (Critical for UX, SEO, retention)
- Effort: 3/5 (Requires analysis, tuning, monitoring)
- Confidence: 0.9 (Well-documented patterns)

---

## Research Findings

### Project Documentation Findings

**Tech Stack** (from `docs/project/tech-stack.md`):
- Frontend: Next.js 15.5.6 (App Router) + TypeScript 5.9.3
- Runtime: React 19.2.0
- Styling: Tailwind CSS 4.1.15
- Deployment: Hetzner VPS + Docker + Caddy
- Analytics: Google Analytics 4
- Build Tool: Turbo (built into Next.js)

**Key Observations**:
- Next.js 15 provides automatic route-based code splitting (built-in)
- React 19 includes Server Components (reduces client-side JavaScript)
- Tailwind CSS 4 with utility-first approach (small bundle size)
- Caddy provides automatic HTTP/2 and compression (infrastructure ready)
- No custom Webpack config (use Next.js defaults)

**System Architecture** (from `docs/project/system-architecture.md`):
- Relevant components: Blog post pages (`app/blog/[slug]/page.tsx`), MDX content processing, layout components
- Integration points: MDX processing (gray-matter, reading-time), Prisma client (minimal usage), Newsletter API
- Current constraints:
  - Single VPS (no CDN yet)
  - Filesystem-based MDX content (static generation feasible)
  - < 100 blog posts (build times acceptable)

**Current Architecture Issues Identified**:
- Images likely using `<img>` tags (need migration to `next/image`)
- Fonts not optimized (no mention of `next/font` in tech stack)
- Analytics script loading strategy undefined (need `next/script` optimization)
- No bundle analysis configured (need `@next/bundle-analyzer`)

**Deployment Strategy** (from `docs/project/deployment-strategy.md`):
- Model: direct-prod (main branch → production VPS)
- Platform: Hetzner VPS (self-hosted)
- CI/CD: GitHub Actions (lint, type-check, build, deploy)
- No staging environment yet (acceptable for solo dev)

**Capacity Planning** (from `docs/project/capacity-planning.md`):
- Current tier: micro (< 1K visitors/month assumed)
- Performance targets: Lighthouse ≥ 85, FCP < 1.5s (spec targets more aggressive)
- Resource limits: Single VPS with 2-4 vCPUs, 4-8GB RAM

---

### Codebase Analysis

**Current Structure** (from Glob/Bash exploration):
```
app/
├── api/health/route.ts              # Health check endpoint
├── aviation/page.tsx                # Aviation content section
├── blog/
│   ├── page.tsx                     # Blog list page
│   ├── tag/[tag]/page.tsx           # Tag filtering
│   └── [slug]/page.tsx              # Blog post pages (key target)
├── dev-startup/page.tsx             # Dev/startup section
├── components/
│   └── layout-wrapper.tsx           # Layout component
├── layout.tsx                       # Root layout
├── page.tsx                         # Homepage
└── styleguide/page.tsx              # Design system page

Config Files:
- next.config.ts                     # Next.js configuration
- tailwind.config.ts                 # Tailwind configuration
- postcss.config.mjs                 # PostCSS configuration
```

**Key Optimization Targets Identified**:
1. **Blog post pages**: Dynamic routes at `app/blog/[slug]/page.tsx` (main traffic)
2. **Homepage**: Post feed at `app/page.tsx` (first impression)
3. **MDX components**: Custom components in `components/mdx/` (syntax highlighting, images)
4. **Layout components**: Header, footer, theme toggle (present on all pages)
5. **Newsletter component**: Likely below-the-fold (candidate for dynamic import)

---

### GitHub Issue Analysis

**Source**: Issue #27 (fetched via `gh issue view 27`)

**Requirements Status** (all marked done in issue):
- ✅ Code Splitting: Next.js automatic route-based code splitting
- ✅ Dynamic Imports: Lazy load heavy components
- ✅ Bundle Analysis: Use @next/bundle-analyzer
- ✅ Tree Shaking: Remove unused code
- ✅ Lazy Load Components: Defer non-critical UI
- ✅ Font Optimization: Use next/font
- ✅ Script Optimization: Use next/script
- ✅ Prefetching: Next.js Link prefetching
- ✅ Static Generation: Use SSG/ISR for blog posts
- ✅ Performance Monitoring: Lighthouse CI, Web Vitals
- ✅ Resource Hints: Preconnect to external domains
- ✅ Compression: Gzip/Brotli compression

**Acceptance Criteria** (from issue):
- Lighthouse Performance score > 90
- FCP < 1.8s
- LCP < 2.5s
- CLS < 0.1
- TTI < 3.8s
- TBT < 200ms
- Bundle size < 200KB (initial load)
- Dynamic imports functional
- Font loading optimized (no FOIT/FOUT)
- Web Vitals tracked in GA4

**Dependencies** (from issue):
- BLOCKED: tech-stack-foundation-core
- BLOCKED: image-optimization
- BLOCKED: google-analytics-4

**Note**: Issue marks all requirements as done, but specification treats this as planning phase (implementation verification needed)

---

### Industry Best Practices

**Next.js 15 Performance Patterns** (from Next.js documentation knowledge):
1. **Automatic Code Splitting**: App Router splits by route automatically
2. **React Server Components**: Default in App Router (reduces client JS)
3. **Streaming SSR**: Suspense boundaries for progressive rendering
4. **Image Optimization**: `next/image` with automatic WebP/AVIF
5. **Font Optimization**: `next/font` self-hosts Google Fonts
6. **Script Optimization**: `next/script` with loading strategies
7. **Bundle Analyzer**: `@next/bundle-analyzer` for visualization

**Core Web Vitals Optimization** (Google best practices):
- **FCP**: Minimize render-blocking resources, optimize critical CSS
- **LCP**: Optimize largest element (usually hero image or text block)
- **CLS**: Reserve space for images/ads, avoid dynamic content insertion
- **TTI**: Reduce JavaScript execution time, defer non-critical scripts
- **TBT**: Break up long tasks, use code splitting
- **INP**: Optimize event handlers, use debouncing/throttling

**Dynamic Import Patterns**:
- Use `next/dynamic` with `loading` prop for graceful fallbacks
- Use `ssr: false` for client-only components
- Use Intersection Observer for below-the-fold lazy loading
- Common candidates: Modals, carousels, comments, analytics widgets

---

## Feature Classification

- **UI screens**: FALSE (infrastructure feature, no new UI)
- **Improvement**: TRUE (optimizing existing performance)
- **Measurable**: TRUE (Lighthouse scores, Core Web Vitals, bundle sizes)
- **Deployment impact**: FALSE (no database migrations, no env vars required beyond existing GA4)

**Rationale**:
- Infrastructure feature focused on performance optimization
- Improves existing pages (no new features)
- Highly measurable with clear metrics (Lighthouse, Web Vitals, bundle size)
- No breaking changes (progressive enhancement)
- No new environment variables (uses existing GA4 integration)

---

## System Components Analysis

**Not Applicable**: This is an infrastructure/optimization feature, not a UI feature. No new components needed.

**Affected Components** (existing):
- All route pages (for code splitting verification)
- MDX components (for dynamic import candidates)
- Layout components (for font optimization)
- Root layout (for script optimization)
- Newsletter component (candidate for dynamic import)
- Social share widgets (candidate for dynamic import)
- Comment section (if exists, candidate for dynamic import)

---

## Key Decisions

### Decision 1: Use Next.js Built-in Optimizations (Not Custom Webpack)
**Rationale**: Next.js 15 provides excellent defaults for code splitting, tree shaking, and minification. Custom Webpack configuration adds complexity without measurable benefit for this use case.
**Trade-off**: Less control vs simpler maintenance and fewer upgrade issues
**Decision**: Leverage Next.js defaults, only customize if specific bottlenecks identified

### Decision 2: Bundle Analyzer as Development Tool (Not CI Blocker)
**Rationale**: Bundle analyzer provides valuable insights but should not block deployments. Use as diagnostic tool during development and monthly audits.
**Trade-off**: Proactive monitoring vs deployment speed
**Decision**: Run analyzer manually via `npm run analyze`, not in CI pipeline

### Decision 3: Dynamic Imports for Below-the-Fold Components Only
**Rationale**: Dynamic imports add complexity and slight delay. Only use for components that:
- Are below the fold (not immediately visible)
- Are heavy (> 20KB)
- Are not critical to initial user experience
**Candidates**: Newsletter signup, social share, comments (if implemented)
**Trade-off**: Complexity vs initial bundle size reduction
**Decision**: Target 3-5 components for dynamic imports based on size analysis

### Decision 4: Web Vitals Tracking via GA4 Custom Events (Not Separate Service)
**Rationale**: GA4 already integrated, supports custom events for Web Vitals. No need for separate service (PostHog, Sentry Performance) at current scale.
**Trade-off**: Limited analysis capabilities vs cost and complexity
**Decision**: Use `web-vitals` library + GA4 custom events for MVP, revisit at > 10K visitors/month

### Decision 5: Lighthouse CI in GitHub Actions (Soft Fail Initially)
**Rationale**: Lighthouse CI provides automated performance audits. Start with warning-only (not blocking) to establish baseline, then enforce thresholds.
**Trade-off**: Strict gates vs iterative improvement
**Decision**: Phase 1 - Warning only, Phase 2 - Block if score < 85 after optimization complete

### Decision 6: Font Strategy - next/font with System Font Fallbacks
**Rationale**: `next/font` self-hosts Google Fonts (eliminates external requests), system font fallbacks prevent FOIT/FOUT.
**Trade-off**: Brand identity vs performance
**Decision**: Use next/font for primary fonts, define system font stack as fallback

### Decision 7: Image Strategy - Migrate to next/image Progressively
**Rationale**: `next/image` provides automatic optimization (WebP, lazy loading, responsive sizing). Migrate images progressively during implementation.
**Trade-off**: Migration effort vs performance gains
**Decision**: Prioritize blog post images (high traffic), then homepage, then other pages

### Decision 8: Static Generation for Blog Posts (SSG, Not ISR Initially)
**Rationale**: Blog posts are immutable once published (rare edits). SSG provides fastest performance without ISR complexity.
**Trade-off**: Rebuild on edits vs instant updates
**Decision**: Use SSG with `generateStaticParams`, defer ISR until edit frequency justifies it

### Decision 9: Resource Hints for External Domains (Preconnect, Not Prefetch)
**Rationale**: `preconnect` establishes early connections to external domains (Supabase, Resend). `prefetch` downloads resources (unnecessary overhead).
**Trade-off**: Bandwidth vs latency reduction
**Decision**: Use `<link rel="preconnect">` for database, API, CDN (if added)

### Decision 10: No Service Worker / PWA for MVP
**Rationale**: Service workers add complexity and cache invalidation challenges. Defer PWA features until traffic justifies investment.
**Trade-off**: Offline support vs complexity
**Decision**: Out of scope for this feature, separate future feature if needed

---

## Clarifications Resolved

**No clarifications needed**. The GitHub issue provides comprehensive requirements, acceptance criteria, and clear performance targets. Project documentation clearly defines tech stack (Next.js 15, React 19, TypeScript). Deployment model is direct-prod (no staging complexity).

**Informed Guesses Made**:
1. **Analytics Integration**: Assumed GA4 already configured based on tech stack doc (verify during planning)
2. **Image Formats**: Assumed MDX content contains images (verify during codebase scan)
3. **Newsletter Component**: Assumed newsletter signup exists based on API routes (verify during planning)
4. **Font Usage**: Assumed Google Fonts or system fonts (verify in codebase)
5. **Third-Party Scripts**: Assumed only GA4 script (verify during planning)

---

## Deployment Considerations

**Platform Dependencies**: None (uses existing Next.js deployment to Hetzner VPS)

**Environment Variables**: None required (uses existing GA4 integration)

**Breaking Changes**: None (progressive enhancement, backward compatible)

**Migration Required**: No database migrations. Some code refactoring:
- Migrate `<img>` → `<Image>` (non-breaking)
- Add dynamic imports (non-breaking)
- Add `next/font` configuration (non-breaking)
- Add bundle analyzer (dev-only, non-breaking)

**Rollback Considerations**: Standard 3-command rollback (Git revert + Docker redeploy)
- Risk: Low (no database changes, no API changes)
- Rollback triggers: Lighthouse score < 70, build failures, chunk loading errors
- Rollback time: 15-30 minutes

---

## Performance Hypothesis

**Problem**: Current site lacks systematic performance optimization, resulting in suboptimal Core Web Vitals and user experience.

**Evidence**:
- No bundle analyzer configured (unknown bundle size)
- No dynamic imports (all JavaScript loaded upfront)
- No font optimization strategy (potential FOIT/FOUT)
- No systematic Web Vitals tracking (no performance visibility)

**Solution**: Implement comprehensive optimization strategy:
- Code splitting via dynamic imports (reduce initial bundle)
- Font optimization via next/font (eliminate FOIT/FOUT)
- Script optimization via next/script (reduce TTI/TBT)
- Bundle analysis via @next/bundle-analyzer (identify bottlenecks)
- Web Vitals tracking via GA4 (measure impact)

**Prediction**: Optimizations will achieve Lighthouse > 90 and meet Core Web Vitals "Good" thresholds.

**Primary Metrics**:
- Lighthouse Performance: Target > 90 (excellent)
- Initial Bundle Size: Target < 200KB (gzipped)
- FCP: Target < 1.8s (good)
- LCP: Target < 2.5s (good)
- CLS: Target < 0.1 (good)
- TTI: Target < 3.8s (good)
- TBT: Target < 200ms (good)

**Expected Improvements**:
- Bundle size: 30-50% reduction via dynamic imports
- FCP: 20-30% improvement via font/script optimization
- LCP: 15-25% improvement via image optimization
- CLS: Near-zero via font-display and image sizing

**Confidence**: HIGH (0.9) - Well-documented patterns in Next.js ecosystem

---

## Checkpoints

- **Phase 0 (Specification)**: 2025-10-28
  - Specification complete (12 functional requirements, 5 non-functional requirements)
  - GitHub Issue #27 analyzed
  - Project documentation reviewed (tech stack, architecture, deployment)
  - Codebase structure explored
  - Performance baseline targets defined
  - No clarifications needed (comprehensive issue)

---

## Phase 1: Planning (2025-10-28)

**Summary**:
- Architecture decisions: 5 key patterns (dynamic imports, next/font, web-vitals RUM, bundle analyzer, Lighthouse CI)
- Reuse opportunities: 7 existing components (GA4 integration, SSG pattern, Image optimization, analytics infrastructure)
- New components: 6 (app/fonts.ts, lib/web-vitals-tracking.ts, components/providers/WebVitalsReporter.tsx, Lighthouse CI workflow, lighthouserc.json, analyze-bundle.sh)
- Critical gaps: 5 identified (no font optimization, no bundle analysis tooling, no Web Vitals RUM tracking, no Lighthouse CI, Dialog component loaded eagerly)

**Checkpoint**:
- ✅ Planning complete: Implementation plan documented
- ✅ Research complete: Codebase patterns identified
- ✅ Reuse analysis: 7 existing components to extend
- ✅ Architecture: 5 optimization patterns defined
- 📋 Ready for: /tasks

---

## Phase 2: Tasks (2025-10-28)

**Summary**:
- Total tasks: 33
- Parallel opportunities: 10 tasks marked [P]
- Phased approach: 7 phases (Setup & Baseline, Font Optimization, Code Splitting, Web Vitals RUM, Lighthouse CI, Validation & Testing, Documentation & Deployment)
- MVP scope: Phases 1-4 (measurement, fonts, code splitting, monitoring)
- Task file: specs/049-performance-optimization/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 33
- ✅ Dependency graph: Created (7 phases, sequential with parallel opportunities)
- ✅ MVP strategy: Defined (Phases 1-4 for core optimizations)
- ✅ Parallel execution: 10 tasks can run simultaneously
- 📋 Ready for: /analyze

**Task Breakdown by Phase**:
- Phase 1 (Setup & Baseline): 4 tasks (T001-T004)
- Phase 2 (Font Optimization): 4 tasks (T010-T013)
- Phase 3 (Code Splitting): 4 tasks (T015-T018)
- Phase 4 (Web Vitals RUM): 6 tasks (T020-T025)
- Phase 5 (Lighthouse CI): 5 tasks (T030-T034)
- Phase 6 (Validation & Testing): 6 tasks (T040-T045)
- Phase 7 (Documentation & Deployment): 4 tasks (T050-T053)

**Key Task Sequencing Decisions**:
1. Baseline metrics first (Phase 1) - establishes comparison baseline
2. Font optimization next (Phase 2) - quick win with immediate CLS impact
3. Code splitting follows (Phase 3) - depends on baseline bundle analysis
4. Web Vitals tracking (Phase 4) - extends existing GA4 infrastructure
5. Lighthouse CI last (Phase 5) - validates optimizations automatically

---

## Last Updated

2025-10-28T16:30:00Z (Task Breakdown Phase)

---

## Phase 3: Cross-Artifact Analysis (2025-10-28)

### Analysis Execution

Performed comprehensive cross-artifact consistency validation:
- ✅ Verified all 12 functional requirements mapped to plan architecture
- ✅ Confirmed all 5 plan patterns have corresponding task sequences
- ✅ Validated dependency ordering and parallelization strategy
- ✅ Checked terminology consistency across artifacts
- ✅ Analyzed reuse opportunities (7 components correctly identified)

### Key Findings

**Coverage Analysis**:
- Explicit coverage: 8/12 functional requirements (67%)
- Implicit coverage: 4/12 via existing infrastructure (33%)
- Total coverage: 12/12 (100%)
- Non-functional requirements: 5/5 covered (100%)

**Requirements with Explicit Tasks**:
1. FR-001 (Route-Based Code Splitting) → T017
2. FR-002 (Dynamic Imports) → T015-T017
3. FR-003 (Bundle Analysis) → T001-T003, T018
4. FR-005 (Font Optimization) → T010-T013
5. FR-010 (Compression) → T037
6. FR-011 (Static Generation) → T036
7. FR-012 (Performance Monitoring) → T020-T025
8. Lighthouse CI → T030-T033

**Requirements with Implicit Coverage** (via verified existing infrastructure):
1. FR-004 (Tree Shaking): Next.js production builds (automatic)
2. FR-006 (Third-Party Scripts): GA4 already uses next/script strategy="afterInteractive"
3. FR-007 (Image Optimization): Existing mdx-image.tsx uses next/image
4. FR-008/FR-009 (Prefetching/Resource Hints): Next.js Link components (automatic)

### Consistency Validation

**Architecture Alignment**: ✅ PASS
- Stack consistent across spec/plan/tasks (Next.js 15.5.6, React 19.2.0, TypeScript 5.9.3)
- All required dependencies identified and versioned
- No conflicting technology choices

**Terminology Consistency**: ✅ PASS
- next/dynamic, next/font, next/script, next/image used consistently
- Bundle analyzer, Web Vitals, Lighthouse CI terminology aligned
- No terminology drift detected

**Metric Consistency**: ✅ PASS
- Performance targets (Lighthouse >90, FCP <1.8s, LCP <2.5s, etc.) consistent across spec/plan/tasks
- Bundle size constraints (<200KB) verified in multiple tasks
- Core Web Vitals thresholds aligned with Google standards

**Reuse Analysis**: ✅ EXCELLENT
- 7 existing components correctly identified for reuse
- No duplication of effort detected
- Plan correctly extends existing GA4 infrastructure rather than replacing

### Issues & Recommendations

**Critical Issues**: 0
**High Priority Issues**: 0

**Medium Priority Issues**: 4 (optional enhancements)
- M1: Add explicit tree shaking validation task
- M2: Add GA4 script timing measurement task
- M3: Add image tag audit task (<img> vs next/image)
- M4: Add preconnect tag verification task

**Note**: These are **recommendations for additional verification**, not blockers. The plan correctly identifies that these features are already implemented. Adding explicit verification tasks would increase coverage from 67% explicit to 100% explicit, but total coverage is already 100%.

### Risk Assessment

**High-Risk Areas**: None

**Medium-Risk Areas**:
1. Dialog lazy loading (potential hydration issues) - Mitigated by T016 interaction testing
2. Font loading strategy (2 font families) - Mitigated by next/font subsetting + T013 CLS validation
3. Web Vitals sampling (100% of sessions) - Acceptable, web-vitals package is <2KB
4. Lighthouse CI strict budgets - Mitigated by median of 3 runs

**Low-Risk Areas**: All other optimizations leverage Next.js built-ins

### Task Structure Validation

**Phase Organization**: ✅ EXCELLENT
- 7 logical phases with clear dependencies
- Baseline → Optimize → Monitor → Validate → Document sequence
- Phase 2 (fonts) can run in parallel with Phase 1 (setup)

**Parallelization**: ✅ OPTIMAL
- 10/33 tasks marked [P] (30%)
- Reduces implementation time by ~30%
- Independent tasks correctly identified

**Testing Strategy**: ✅ APPROPRIATE
- Measurement-based validation (Lighthouse, bundle analysis, manual testing)
- No TDD markers (correct for infrastructure/config work)
- Automated CI checks via Lighthouse CI (T030-T033)

### Analysis Artifacts

Generated:
- `specs/049-performance-optimization/analysis-report.md` (comprehensive 450+ line report)

### Decision: Ready for Implementation

**Status**: ✅ **READY FOR IMPLEMENTATION**

**Rationale**:
1. All requirements covered (8 explicit + 4 verified implicit = 12/12)
2. Zero critical or high-priority issues
3. Strong architecture alignment across artifacts
4. Excellent reuse analysis (no duplication)
5. Optimal task structure with clear dependencies
6. 4 medium issues are optional verification tasks, not blockers

**Recommendation**: Proceed with `/implement`

**Next Phase**: Implementation (33 tasks, estimated 3-4 hours with parallelization)

---

## Last Updated

2025-10-28T17:45:00Z (Analysis Phase Complete)
