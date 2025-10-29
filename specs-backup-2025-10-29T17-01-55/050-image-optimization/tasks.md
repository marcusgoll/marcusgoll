# Tasks: Image Optimization (Next.js Image)

## [CODEBASE REUSE ANALYSIS]

Scanned: components/**/*.tsx, lib/utils/*.ts, next.config.ts

**[EXISTING - REUSE]**
- ✅ Next.js Image component (next/image) - already imported in 7+ components
- ✅ PostCard.tsx (components/blog/PostCard.tsx) - **BEST PRACTICE PATTERN** - fill + aspect-ratio layout
- ✅ MagazineMasonry.tsx (components/home/MagazineMasonry.tsx) - priority prop pattern (line 44)
- ✅ MDXImage.tsx (components/mdx/mdx-image.tsx) - local/external image handling
- ✅ next.config.ts - Next.js configuration file (currently minimal image config)

**[NEW - CREATE]**
- 🆕 lib/utils/shimmer.ts - Shimmer placeholder generator (no existing pattern)
- 🆕 Image optimization configuration in next.config.ts (enhance existing)

---

## [DEPENDENCY GRAPH]

Story completion order:
1. Phase 1: Setup (T001-T003) - Independent setup tasks
2. Phase 2: US1 [P1] - Configuration (T004-T006) - Blocks US2, US3
3. Phase 3: US2 [P1] - Blur Placeholders (T007-T011) - Depends on US1, blocks layout tests
4. Phase 4: US3 [P1] - Priority Loading (T012-T014) - Depends on US1, independent from US2
5. Phase 5: US4 [P2] - Sizing Standardization (T015-T018) - Depends on US1, US2
6. Phase 6: US5 [P2] - Accessibility Audit (T019-T022) - Independent, can run parallel with US4
7. Phase 7: Polish & Validation (T023-T026) - Depends on all stories

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- US1 Configuration: T004 [P], T005 [P] (different files)
- US2 Placeholders: T008 [P], T009 [P], T010 [P] (different component files)
- US3 Priority: T013 [P], T014 [P] (different component files)
- US4 Standardization: T016 [P], T017 [P] (different components)
- US5 Accessibility: T020 [P], T021 [P], T022 [P] (different audit areas)
- Polish: T024 [P], T025 [P] (different measurement approaches)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 2-4 (US1-US3: Configuration → Placeholders → Priority loading)
**Incremental delivery**: MVP → staging validation → Enhancement (US4-US5) → Advanced (US6 optional)
**Testing approach**: Manual performance testing required (Lighthouse, DevTools Network panel)
**Estimated total time**: 8-12 hours (MVP), +8-11 hours (Enhancement), +6-8 hours (US6 optional)

---

## Phase 1: Setup

- [ ] T001 Create baseline performance capture checklist in specs/050-image-optimization/NOTES.md
  - Section: "## Performance Baseline (Before Optimization)"
  - Metrics: Current LCP, CLS, FCP, TTI, image bytes transferred, Lighthouse score
  - Template: Copy from data-model.md "Baseline Capture" section
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T002 [P] Verify Next.js Image component usage across codebase
  - Command: `grep -r "next/image" components/ --include="*.tsx"`
  - Expected: 7+ files already using Image component
  - Document findings in NOTES.md (list files)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T003 [P] Verify no raw img tags exist in components
  - Command: `grep -r "<img" components/ --include="*.tsx" | grep -v "next/image"`
  - Expected: 0 results (all images using Next.js Image)
  - If found: Add to tasks list for conversion
  - From: spec.md FR-001

---

## Phase 2: User Story 1 [P1] - Configure Next.js image optimization

**Story Goal**: Enable automatic WebP/AVIF conversion and responsive sizing via next.config.ts

**Independent Test Criteria**:
- [ ] Production build succeeds without image optimization errors
- [ ] `.next/cache/images/` directory contains optimized WebP/AVIF variants
- [ ] DevTools Network shows images served as WebP/AVIF in modern browsers
- [ ] Image srcset includes multiple sizes for responsive loading

### Implementation

- [ ] T004 [P] [US1] Add image optimization configuration to next.config.ts
  - File: next.config.ts
  - Add: images.formats = ['image/avif', 'image/webp']
  - Add: images.deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  - Add: images.imageSizes = [16, 32, 48, 64, 96, 128, 256, 384]
  - Add: images.minimumCacheTTL = 60 (seconds)
  - Pattern: Standard Next.js 15 image config
  - From: data-model.md ImageConfig schema

- [ ] T005 [P] [US1] Add security configuration for images in next.config.ts
  - File: next.config.ts (continue from T004)
  - Add: images.dangerouslyAllowSVG = false (block XSS risk)
  - Add: images.contentDispositionType = 'attachment' (force download SVGs)
  - Add: images.remotePatterns = [] (empty array initially, add domains on-demand)
  - Pattern: Security-first configuration
  - From: plan.md [SECURITY]

- [ ] T006 [US1] Rebuild application and verify image optimization works
  - Command: `npm run build`
  - Verify: No "Unoptimized Image" warnings in build output
  - Verify: `.next/cache/images/` directory created with optimized files
  - Test: Open homepage in browser, check DevTools Network tab for WebP/AVIF
  - From: spec.md FR-002, FR-003

---

## Phase 3: User Story 2 [P1] - Implement blur placeholders for smooth loading

**Story Goal**: Add blur placeholders to prevent layout shift and improve perceived performance

**Independent Test Criteria**:
- [ ] Load homepage with DevTools Network throttled to "Slow 3G"
- [ ] Verify shimmer/blur placeholders appear before images load
- [ ] Run Lighthouse audit, verify CLS <0.1
- [ ] Visual inspection: No jarring content jumps during image load

### Setup

- [ ] T007 [US2] Create shimmer placeholder utility in lib/utils/shimmer.ts
  - File: lib/utils/shimmer.ts (NEW)
  - Function: `export const shimmerDataURL = (width: number, height: number): string`
  - Returns: Base64-encoded SVG shimmer effect for blur placeholders
  - Implementation: Copy from data-model.md ShimmerUtility
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

### Implementation

- [ ] T008 [P] [US2] Add blur placeholder to PostCard component
  - File: components/blog/PostCard.tsx
  - Import: `import { shimmerDataURL } from '@/lib/utils/shimmer'`
  - Add: `placeholder="blur"` prop to Image component
  - Add: `blurDataURL={shimmerDataURL(800, 600)}` for remote images
  - Keep: Existing fill layout and sizes prop (lines 30-38)
  - Pattern: PostCard is BEST PRACTICE - reuse this approach
  - From: plan.md US2 implementation

- [ ] T009 [P] [US2] Update MDXImage component to add blur placeholders
  - File: components/mdx/mdx-image.tsx
  - Import: `import { shimmerDataURL } from '@/lib/utils/shimmer'`
  - Add: `placeholder="blur"` to both Image components (local + external)
  - Add: `blurDataURL={shimmerDataURL(width, height)}` to external image (lines 56+)
  - REMOVE: img tag fallback for external images (lines 44-49) - use Image only
  - Reason: Next.js Image handles external optimization via remotePatterns
  - From: plan.md US2 implementation + plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T010 [P] [US2] Add blur placeholder to MagazineMasonry hero image
  - File: components/home/MagazineMasonry.tsx
  - Import: `import { shimmerDataURL } from '@/lib/utils/shimmer'`
  - Add: `placeholder="blur"` to hero Image component (line 44+)
  - Add: `blurDataURL={shimmerDataURL(width, height)}` using existing width/height props
  - Keep: Existing priority prop (already correct)
  - From: plan.md US2 implementation

- [ ] T011 [US2] Test blur placeholders with network throttling
  - Open: http://localhost:3000 in Chrome DevTools
  - Set: Network → Throttling → Slow 3G
  - Reload: Homepage and blog post
  - Verify: Shimmer placeholders appear during image load
  - Measure: Run Lighthouse audit, check CLS score (target: <0.1)
  - From: spec.md Acceptance Scenario 1

---

## Phase 4: User Story 3 [P1] - Add priority loading for above-the-fold images

**Story Goal**: Improve LCP by immediately loading visible images without lazy loading delay

**Independent Test Criteria**:
- [ ] Run Lighthouse audit, check for preload resource hints in HTML
- [ ] DevTools Network shows above-the-fold images loaded immediately (not deferred)
- [ ] LCP metric improves by 20-30% from baseline
- [ ] Below-the-fold images still lazy load (scroll to trigger loading)

### Implementation

- [ ] T012 [US3] Identify above-the-fold images requiring priority prop
  - Audit: Homepage components (FeaturedPostsSection, MagazineMasonry)
  - List: Hero image (already has priority), first 2-3 featured post cards
  - Document: In NOTES.md → "Above-the-fold Images" section
  - Criteria: Images visible without scrolling (above viewport fold)
  - From: plan.md US3 implementation

- [ ] T013 [P] [US3] Add priority prop to featured posts in FeaturedPostsSection
  - File: components/home/FeaturedPostsSection.tsx
  - Modify: PostCard components (first 3 cards only)
  - Add: `priority={index < 3}` to conditional priority loading
  - Keep: Existing layout and sizes
  - Reason: First 3 cards visible above fold on desktop
  - From: plan.md US3 implementation

- [ ] T014 [P] [US3] Verify MagazineMasonry hero already has priority prop
  - File: components/home/MagazineMasonry.tsx
  - Check: Line 44 has priority={true} on hero Image
  - Action: If missing, add priority={true}
  - If present: Mark task complete (no changes needed)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T015 [US3] Measure LCP improvement after priority loading
  - Capture: Baseline LCP from NOTES.md (Phase 1 baseline)
  - Run: Lighthouse audit on homepage
  - Compare: New LCP vs baseline (expect 20-30% improvement)
  - Document: Results in NOTES.md → "US3 Performance Impact"
  - Target: LCP <2.5s (spec.md NFR-001)
  - From: spec.md Success Metrics

---

## Phase 5: User Story 4 [P2] - Standardize sizing patterns across components

**Story Goal**: Document and apply consistent sizing approach for maintainability and predictability

**Independent Test Criteria**:
- [ ] NOTES.md contains sizing pattern documentation (fill vs width/height)
- [ ] All card/grid components use fill + aspect-ratio pattern
- [ ] Fixed-size images (icons, avatars) use width/height props
- [ ] Visual regression test: Compare before/after screenshots (no layout breaks)

### Implementation

- [ ] T016 [P] [US4] Document sizing patterns in NOTES.md
  - File: specs/050-image-optimization/NOTES.md
  - Section: "## Image Sizing Patterns"
  - Pattern 1: Fill + aspect-ratio (cards, grids, responsive layouts)
  - Pattern 2: Fixed dimensions (icons, avatars, logos)
  - Pattern 3: Intrinsic + max-width (blog content, MDX images)
  - Examples: PostCard (fill), Sidebar avatar (fixed), MDXImage (intrinsic)
  - From: plan.md US4 implementation

- [ ] T017 [P] [US4] Standardize MagazineMasonry hero to fill layout
  - File: components/home/MagazineMasonry.tsx
  - Current: width/height props (lines 41-42)
  - Change: Remove width/height, add fill={true}
  - Add: Parent div with `className="relative aspect-[2/1]"` (hero aspect ratio)
  - Keep: priority prop, blur placeholder from T010
  - Reason: Consistent with PostCard pattern (fill + aspect-ratio)
  - From: plan.md US4 implementation

- [ ] T018 [P] [US4] Standardize MagazineMasonry grid images to fill layout
  - File: components/home/MagazineMasonry.tsx
  - Current: width/height props (lines 111-112)
  - Change: Remove width/height, add fill={true}
  - Add: Parent div with `className="relative aspect-video"` (grid card ratio)
  - Keep: blur placeholders, lazy loading (no priority for grid)
  - Test: Verify grid layout responsive across mobile/tablet/desktop
  - From: plan.md US4 implementation

---

## Phase 6: User Story 5 [P2] - Audit and fix alt text for accessibility

**Story Goal**: Ensure 100% of images have descriptive alt text per WCAG 2.1 Level AA

**Independent Test Criteria**:
- [ ] Run Lighthouse audit, verify Accessibility score ≥95
- [ ] No images missing alt attributes (grep check)
- [ ] Screen reader test: VoiceOver reads meaningful descriptions
- [ ] Decorative images use alt="" (empty string, not missing)

### Implementation

- [ ] T019 [US5] Audit all Image components for missing alt attributes
  - Command: `grep -r "Image" components/ --include="*.tsx" -A 5 | grep -v "alt="`
  - Document: List components with missing alt in NOTES.md
  - Expected: 0-5 components (most should have alt from Ghost CMS frontmatter)
  - From: spec.md FR-009, NFR-004

- [ ] T020 [P] [US5] Audit alt text quality (descriptive vs generic)
  - Review: All Image components in components/blog/, components/home/
  - Check: Alt text describes content, not just repeats title
  - Examples:
    - ❌ Bad: alt="Blog post image"
    - ✅ Good: alt="Developer debugging code in Visual Studio Code terminal"
  - Document: Components needing alt text improvements in NOTES.md
  - From: spec.md NFR-004

- [ ] T021 [P] [US5] Fix missing or generic alt text in identified components
  - Files: (List from T019 and T020 audits)
  - Action: Add descriptive alt attributes
  - Decorative: Use alt="" for purely decorative images
  - Dynamic: Pull alt from post frontmatter or metadata
  - Estimate: 5-10 components to fix
  - From: spec.md FR-009

- [ ] T022 [P] [US5] Verify accessibility with screen reader
  - Tool: VoiceOver (macOS) or Narrator (Windows)
  - Test: Navigate homepage and blog post with screen reader
  - Verify: All images announce meaningful descriptions
  - Run: Lighthouse audit, check Accessibility score (target: ≥95)
  - From: spec.md Success Criteria 3

---

## Phase 7: Polish & Cross-Cutting Concerns

### Performance Measurement & Validation

- [ ] T023 Capture final Lighthouse performance metrics
  - Run: `npx lighthouse http://localhost:3000 --output=json --output-path=specs/050-image-optimization/final-lighthouse.json`
  - Metrics: LCP, CLS, FCP, TTI, Performance score
  - Compare: Against baseline from T001 (expect 20-30% improvement)
  - Document: Results in NOTES.md → "Final Performance Results"
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T024 [P] Measure image transfer size reduction
  - Open: Chrome DevTools → Network → Img filter
  - Load: Homepage and blog post
  - Record: Total KB transferred (sum of all images)
  - Compare: Against baseline (target: -30% reduction)
  - Verify: WebP/AVIF formats in Content-Type header
  - Document: Results in NOTES.md
  - From: spec.md NFR-003

- [ ] T025 [P] Validate Core Web Vitals in multiple scenarios
  - Test scenarios:
    1. Homepage load (first visit, cold cache)
    2. Blog post load (with featured image)
    3. Fast 3G connection (DevTools throttling)
    4. Slow 3G connection (DevTools throttling)
  - Metrics: LCP <2.5s, CLS <0.1 in all scenarios
  - Document: Results in NOTES.md → "Core Web Vitals Validation"
  - From: spec.md Acceptance Scenarios

### Documentation & Rollback Preparation

- [ ] T026 Document rollback procedure in NOTES.md
  - Section: "## Rollback Plan"
  - Commands: Standard 3-command git revert
  - Feature flag: Not applicable (configuration changes)
  - Reversibility: Fully reversible (revert next.config.ts, component changes)
  - Impact: No database state, no environment variables
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

### Deployment Preparation

- [ ] T027 Update deployment checklist for staging validation
  - File: specs/050-image-optimization/NOTES.md
  - Section: "## Staging Validation Checklist"
  - Items:
    1. Verify homepage loads with blur placeholders
    2. Verify hero image loads immediately (priority)
    3. Check DevTools for WebP/AVIF delivery
    4. Run Lighthouse audit (Performance ≥90)
    5. Test on mobile device (responsive sizing)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

---

## [TEST GUARDRAILS]

**Note**: This feature does not require unit/integration tests (infrastructure optimization only). Testing approach is manual performance measurement.

**Manual Testing Requirements**:
- Performance: Lighthouse CI automated on every build (`.lighthouseci/results/*.json`)
- Visual: Manual inspection with DevTools Network throttling (Slow 3G)
- Accessibility: Screen reader testing (VoiceOver on macOS, Narrator on Windows)
- Regression: Before/after screenshot comparison for layout changes

**Quality Gates**:
- LCP <2.5s (Google "Good" threshold)
- CLS <0.1 (Google "Good" threshold)
- Lighthouse Performance ≥90
- Lighthouse Accessibility ≥95
- No "Unoptimized Image" warnings in build output
- All images have alt attributes

**Measurement Tools**:
- Lighthouse: `npx lighthouse http://localhost:3000 --output=json`
- DevTools Network: Chrome → DevTools → Network → Img filter
- DevTools Performance: Chrome → DevTools → Performance → Record page load
- Build output: `npm run build` (check for warnings)

---

## Summary

**Total Tasks**: 27 tasks
**MVP Tasks (US1-US3)**: T001-T015 (15 tasks, 8-12 hours)
**Enhancement Tasks (US4-US5)**: T016-T022 (7 tasks, 8-11 hours)
**Polish Tasks**: T023-T027 (5 tasks, 2-3 hours)
**Parallel Opportunities**: 14 tasks marked [P]
**REUSE**: 5 existing components identified
**NEW**: 1 utility (shimmer.ts) + configuration updates

**Implementation Order**:
1. Phase 1: Setup (baseline, audits) → 1-2 hours
2. Phase 2: US1 Configuration → 2-3 hours
3. Phase 3: US2 Blur Placeholders → 4-6 hours
4. Phase 4: US3 Priority Loading → 2-3 hours
5. Phase 5: US4 Standardization → 5-7 hours (optional for MVP)
6. Phase 6: US5 Accessibility → 3-4 hours (optional for MVP)
7. Phase 7: Polish & Validation → 2-3 hours

**MVP Delivery**: Phases 1-4 (US1-US3) = 9-14 hours total
**Full Delivery**: All phases = 19-28 hours total
