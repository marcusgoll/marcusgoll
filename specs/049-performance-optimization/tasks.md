# Tasks: Performance Optimization (Lazy Loading & Code Splitting)

## [CODEBASE REUSE ANALYSIS]
Scanned: D:/Coding/marcusgoll/**/*.{ts,tsx}

[EXISTING - REUSE]
- ✅ app/layout.tsx (lines 36-51): GA4 integration with next/script strategy="afterInteractive"
- ✅ lib/analytics.ts: GA4 event tracking infrastructure (trackPageView, trackContentTrackClick, etc.)
- ✅ app/blog/[slug]/page.tsx: SSG pattern with generateStaticParams
- ✅ components/mdx/mdx-image.tsx: next/image usage in MDX
- ✅ next.config.ts: MDX configuration with rehypeShiki and remarkGfm
- ✅ components/home/Hero.tsx: Dialog component for newsletter signup

[NEW - CREATE]
- 🆕 app/fonts.ts: Font optimization using next/font/google (no existing pattern)
- 🆕 lib/web-vitals-tracking.ts: Web Vitals → GA4 integration (no existing pattern)
- 🆕 components/providers/WebVitalsReporter.tsx: Client component for Web Vitals tracking (no existing pattern)
- 🆕 .github/workflows/lighthouse-ci.yml: Lighthouse CI workflow (no existing pattern)
- 🆕 lighthouserc.json: Lighthouse CI configuration (no existing pattern)
- 🆕 scripts/analyze-bundle.sh: Helper script for bundle analysis (no existing pattern)

## [DEPENDENCY GRAPH]
Task completion order:
1. Phase 1: Setup & Baseline (foundation - establishes metrics)
2. Phase 2: Font Optimization (quick win - independent)
3. Phase 3: Code Splitting (depends on baseline metrics)
4. Phase 4: Web Vitals RUM (depends on GA4 infrastructure - already exists)
5. Phase 5: Lighthouse CI (validation - depends on optimizations)

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 1: T001, T002, T003, T004 (different files, no dependencies)
- Phase 2: T010, T011 (font files and layout - can work simultaneously once fonts.ts created)
- Phase 3: T015, T016, T017 (different components - independent dynamic imports)
- Phase 4: T020, T021, T022 (Web Vitals tracking components - independent after lib created)
- Phase 5: T030, T031, T032 (Lighthouse CI files - independent)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phases 1-4 (measurement, fonts, code splitting, monitoring)
**Incremental delivery**:
  - Phase 1 → Baseline established (can validate current state)
  - Phase 2 → Font optimization deployed (immediate CLS improvement)
  - Phase 3 → Code splitting deployed (bundle size reduction)
  - Phase 4 → Web Vitals tracking (RUM monitoring)
  - Phase 5 → Lighthouse CI (automated validation)

**Testing approach**: Performance testing with Lighthouse audits, manual validation on slow 3G, cross-browser testing

---

## Phase 1: Setup & Baseline (Foundation)

**Goal**: Establish current performance metrics and tooling infrastructure

- [ ] T001 [P] Install bundle analyzer and web-vitals dependencies in package.json
  - Packages: @next/bundle-analyzer@^15.0.0, web-vitals@^4.2.0, @lhci/cli@^0.14.0 (devDependency)
  - Command: `npm install @next/bundle-analyzer@^15.0.0 web-vitals@^4.2.0 && npm install -D @lhci/cli@^0.14.0`
  - Verify: package.json includes all three dependencies
  - From: plan.md [ARCHITECTURE DECISIONS - Dependencies]

- [ ] T002 [P] Configure bundle analyzer wrapper in next.config.ts
  - File: next.config.ts
  - Add: `@next/bundle-analyzer` wrapper around `withMDX(nextConfig)`
  - Config: Enable via `process.env.ANALYZE === 'true'`
  - REUSE: Existing MDX configuration (withMDX)
  - Pattern: next.config.ts lines 20-27 (existing MDX wrapper pattern)
  - From: plan.md [Pattern 4: Bundle Analysis Integration]

- [ ] T003 [P] Run baseline bundle analysis and document results
  - Command: `ANALYZE=true npm run build`
  - Documentation: Create specs/049-performance-optimization/baseline-metrics.md
  - Capture: Total bundle size, largest chunks, dependencies breakdown
  - From: plan.md [Phase 1: Measurement & Baseline]

- [ ] T004 [P] Run baseline Lighthouse audit on production and document metrics
  - Command: `npx lighthouse https://marcusgoll.com --output=json --output-path=specs/049-performance-optimization/baseline-lighthouse.json`
  - Documentation: Add baseline scores to specs/049-performance-optimization/baseline-metrics.md
  - Capture: Performance score, FCP, LCP, CLS, TTI, TBT, INP
  - From: plan.md [Phase 1: Measurement & Baseline]

---

## Phase 2: Font Optimization (Quick Wins)

**Goal**: Implement font optimization to eliminate FOIT/FOUT and improve CLS

- [ ] T010 Create font configuration in app/fonts.ts
  - File: app/fonts.ts (NEW)
  - Fonts: Work Sans (body/headings), JetBrains Mono (code blocks)
  - Config: subsets=['latin'], display='swap', CSS variables
  - Pattern: next/font/google API (see plan.md [Pattern 2])
  - From: plan.md [Pattern 2: Font Optimization via next/font]

- [ ] T011 Add font variables to root layout in app/layout.tsx
  - File: app/layout.tsx
  - Modify: Import fonts from app/fonts.ts, add className to <html> tag
  - Variables: --font-work-sans, --font-jetbrains-mono
  - REUSE: Existing layout structure (lines 27-58)
  - Pattern: app/layout.tsx lines 27-28 (html/body structure)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE #1]

- [ ] T012 Test font loading across browsers and verify no FOIT/FOUT
  - Browsers: Chrome, Firefox, Safari, Edge
  - Test: Slow 3G throttling (DevTools) - verify font-display: swap works
  - Verify: No invisible text during load, no unstyled text flash
  - Documentation: Add results to specs/049-performance-optimization/testing-log.md
  - From: plan.md [Phase 2: Quick Wins]

- [ ] T013 Run Lighthouse audit and verify CLS improvement
  - Command: `npx lighthouse http://localhost:3000 --output=json`
  - Verify: CLS < 0.1 (target from spec.md NFR-001)
  - Compare: Baseline CLS vs optimized CLS (document in baseline-metrics.md)
  - From: plan.md [Phase 2: Quick Wins - Acceptance]

---

## Phase 3: Code Splitting (Dynamic Imports)

**Goal**: Reduce initial bundle size by lazy loading non-critical components

- [ ] T015 [P] Implement dynamic import for Dialog in Hero.tsx
  - File: components/home/Hero.tsx
  - Modify: Line 6 - Replace static Dialog import with next/dynamic
  - Config: loading fallback (skeleton), ssr: false for client-only
  - Pattern: next/dynamic API (see plan.md [Pattern 1])
  - From: plan.md [Pattern 1: Dynamic Import for Below-the-Fold Components]

- [ ] T016 [P] Verify Dialog lazy loads correctly and test interactions
  - Test: Click "Subscribe to Newsletter" button → verify Dialog opens
  - Network tab: Verify separate chunk loads on interaction
  - Verify: No hydration mismatches, no console errors
  - Documentation: Add test results to specs/049-performance-optimization/testing-log.md
  - From: plan.md [Phase 3: Code Splitting - Tasks]

- [ ] T017 [P] Run bundle analyzer and verify chunk separation
  - Command: `ANALYZE=true npm run build`
  - Verify: Separate Dialog chunk created (not in main bundle)
  - Measure: Main bundle reduction (compare to baseline)
  - Target: Initial bundle < 200KB gzipped (spec.md NFR-002)
  - From: plan.md [Phase 3: Code Splitting - Acceptance]

- [ ] T018 Create helper script for bundle analysis in scripts/analyze-bundle.sh
  - File: scripts/analyze-bundle.sh (NEW)
  - Script: `ANALYZE=true npm run build && open .next/analyze/client.html`
  - Permissions: chmod +x scripts/analyze-bundle.sh
  - From: plan.md [NEW INFRASTRUCTURE - CREATE #7]

---

## Phase 4: Web Vitals RUM (Monitoring)

**Goal**: Track real user performance metrics in GA4

- [ ] T020 Create Web Vitals tracking module in lib/web-vitals-tracking.ts
  - File: lib/web-vitals-tracking.ts (NEW)
  - Functions: reportWebVitals() with onCLS, onFCP, onLCP, onTTFB, onINP
  - Integration: Call sendMetricToGA4(metric) for each Web Vital
  - Pattern: web-vitals package API (see plan.md [Pattern 3])
  - From: plan.md [Pattern 3: Web Vitals Real User Monitoring]

- [ ] T021 Add sendMetricToGA4 helper to lib/analytics.ts
  - File: lib/analytics.ts
  - Function: sendMetricToGA4(metric) → gtag('event', 'web_vitals', {...})
  - Integration: Use existing isGtagAvailable() check (line 48-50)
  - REUSE: Existing GA4 infrastructure (lib/analytics.ts)
  - Pattern: lib/analytics.ts lines 185-194 (trackPageView pattern)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE - lib/analytics.ts]

- [ ] T022 Create Web Vitals client component in components/providers/WebVitalsReporter.tsx
  - File: components/providers/WebVitalsReporter.tsx (NEW)
  - Component: Client component ('use client') that calls reportWebVitals()
  - Mounting: Call in useEffect (client-side only)
  - Pattern: ThemeProvider pattern (app/layout.tsx line 29-34)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE #2]

- [ ] T023 Integrate WebVitalsReporter in app/layout.tsx
  - File: app/layout.tsx
  - Modify: Import WebVitalsReporter, add inside ThemeProvider (after GA4 scripts)
  - REUSE: Existing ThemeProvider wrapper (lines 29-55)
  - Pattern: app/layout.tsx lines 36-51 (GA4 conditional rendering pattern)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE #2 - Integration]

- [ ] T024 Test Web Vitals tracking locally and verify GA4 events
  - Test: Open GA4 DebugView, load localhost:3000, verify events fire
  - Events: web_vitals events with FCP, LCP, CLS, TTI, TBT, INP metrics
  - Verify: Metrics have correct names and values (numeric, not string)
  - Documentation: Add GA4 DebugView screenshots to specs/049-performance-optimization/testing-log.md
  - From: plan.md [Phase 4: Monitoring - Tasks]

- [ ] T025 Deploy to production and create GA4 custom report for Web Vitals
  - Deploy: Standard deployment workflow (push to main)
  - GA4: Create custom report with Web Vitals metrics (FCP, LCP, CLS, INP)
  - Report: 95th percentile values, trends over 30 days
  - Documentation: Add GA4 report link to specs/049-performance-optimization/NOTES.md
  - From: plan.md [Phase 4: Monitoring - Acceptance]

---

## Phase 5: Lighthouse CI (Validation & Automation)

**Goal**: Automate performance monitoring and enforce performance budgets

- [ ] T030 [P] Create Lighthouse CI configuration in lighthouserc.json
  - File: lighthouserc.json (NEW)
  - Budgets: Performance >90, FCP <1800ms, LCP <2500ms, CLS <0.1, TBT <200ms
  - Config: ci.assert.assertions with error thresholds
  - From: plan.md [PERFORMANCE TARGETS - Lighthouse CI Budgets]

- [ ] T031 [P] Create Lighthouse CI workflow in .github/workflows/lighthouse-ci.yml
  - File: .github/workflows/lighthouse-ci.yml (NEW)
  - Triggers: pull_request, push to main, workflow_dispatch
  - Steps: Checkout, install deps, build, run lhci autorun
  - Artifacts: Upload Lighthouse HTML report
  - From: plan.md [NEW INFRASTRUCTURE - CREATE #5]

- [ ] T032 [P] Test Lighthouse CI workflow manually via workflow_dispatch
  - Trigger: GitHub Actions → lighthouse-ci workflow → Run workflow
  - Verify: Workflow completes successfully, performance budgets met
  - Verify: HTML report uploaded to artifacts
  - Documentation: Add workflow results to specs/049-performance-optimization/testing-log.md
  - From: plan.md [Phase 5: Validation - Tasks]

- [ ] T033 Verify Lighthouse CI runs on PR and fails if performance < 90
  - Test: Create test PR with intentional performance regression (add large library)
  - Verify: Workflow fails with clear error message
  - Verify: PR blocked until performance fixed
  - Rollback: Remove test regression after verification
  - From: plan.md [Phase 5: Validation - Acceptance]

- [ ] T034 Document Lighthouse CI setup and usage in specs/049-performance-optimization/NOTES.md
  - Documentation: How to run locally (`npx lhci autorun`), how to interpret results
  - Budgets: Document performance thresholds and rationale
  - Troubleshooting: Common issues (build failures, performance regressions)
  - From: plan.md [Phase 5: Validation - Tasks]

---

## Phase 6: Validation & Testing (Cross-Cutting)

**Goal**: Comprehensive validation across browsers, devices, and network conditions

- [ ] T040 Run comprehensive Lighthouse audit on localhost and production
  - Localhost: `npx lighthouse http://localhost:3000 --view`
  - Production: `npx lighthouse https://marcusgoll.com --view`
  - Verify: Performance > 90 on both environments
  - Documentation: Add scores to specs/049-performance-optimization/final-metrics.md
  - From: plan.md [TESTING STRATEGY - Manual Testing Checklist]

- [ ] T041 Test slow 3G throttling and verify performance targets
  - DevTools: Network tab → Slow 3G preset
  - Verify: FCP < 1.8s, LCP < 2.5s (even on slow connection)
  - Verify: Critical content visible quickly, non-critical lazy loads
  - Documentation: Add throttling test results to specs/049-performance-optimization/testing-log.md
  - From: plan.md [TESTING STRATEGY - Manual Testing Checklist]

- [ ] T042 Test across browsers (Chrome, Firefox, Safari, Edge)
  - Browsers: Latest versions of Chrome, Firefox, Safari, Edge
  - Test: Homepage, blog post page
  - Verify: Fonts load correctly, Dialog lazy loads, no console errors
  - Verify: Web Vitals events fire in all browsers (check GA4)
  - From: plan.md [TESTING STRATEGY - Manual Testing Checklist]

- [ ] T043 Test mobile responsiveness (iPhone, Android)
  - Devices: iPhone (Safari), Android (Chrome)
  - Test: Homepage, blog post page
  - Verify: Mobile Lighthouse Performance > 85
  - Verify: Touch interactions work (Dialog opens, buttons responsive)
  - From: plan.md [TESTING STRATEGY - Manual Testing Checklist]

- [ ] T044 Verify all images use next/image with proper sizing
  - Audit: Search codebase for `<img>` tags (should be none or minimal)
  - Verify: components/mdx/mdx-image.tsx uses next/image
  - Verify: LCP image has priority prop (featured image in blog posts)
  - Pattern: components/mdx/mdx-image.tsx (existing implementation)
  - From: spec.md FR-007 (Image Optimization)

- [ ] T045 Verify SSG is working for all blog posts
  - Command: `npm run build` → check .next/server/app/blog/[slug]/
  - Verify: Static HTML files generated for all blog posts
  - Verify: No dynamic server-side rendering (SSR) for blog posts
  - REUSE: app/blog/[slug]/page.tsx (existing SSG pattern)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE - app/blog/[slug]/page.tsx]

---

## Phase 7: Documentation & Deployment

**Goal**: Finalize documentation and prepare for production deployment

- [ ] T050 Create final performance comparison report in specs/049-performance-optimization/final-metrics.md
  - Comparison: Baseline vs optimized metrics (side-by-side)
  - Metrics: Performance score, FCP, LCP, CLS, TTI, TBT, bundle size
  - Improvements: Calculate % improvement for each metric
  - From: plan.md [SUCCESS METRICS]

- [ ] T051 Update NOTES.md with Phase 5 deployment checklist
  - Checklist: Pre-deployment verification, rollback plan, post-deployment validation
  - Rollback: Document triggers and 3-step rollback procedure
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T052 Document rollback procedure in specs/049-performance-optimization/NOTES.md
  - Triggers: Performance score < 70, build failures, CLS > 0.25
  - Procedure: Revert commit, redeploy, verify metrics
  - Expected time: 10-15 minutes
  - From: plan.md [DEPLOYMENT ACCEPTANCE - Rollback Plan]

- [ ] T053 Create monitoring dashboard in GA4 for ongoing performance tracking
  - Report: Custom report with Web Vitals dimensions
  - Dimensions: Content track, device category, page path
  - Metrics: FCP, LCP, CLS, INP (95th percentile)
  - Alert: Manual monthly review (document in calendar)
  - From: plan.md [MONITORING & ALERTING]

---

## [TEST GUARDRAILS]

**Speed Requirements:**
- Lighthouse audit: <60s per URL
- Bundle analysis: <120s (full build)
- Web Vitals tracking: Real-time (< 1s to send event)

**Performance Requirements:**
- Lighthouse Performance score: ≥90 (homepage and blog posts)
- FCP: <1.8s (95th percentile)
- LCP: <2.5s (95th percentile)
- CLS: <0.1 (95th percentile)
- Initial bundle: <200KB (gzipped)

**Measurement:**
- Lighthouse: `npx lighthouse [url] --output=json`
- Bundle: `ANALYZE=true npm run build`
- Web Vitals: GA4 custom report (95th percentile)

**Quality Gates:**
- All Lighthouse audits must pass before merge
- Bundle size cannot increase (must decrease or stay same)
- No console errors in any browser
- Web Vitals events must fire in GA4

**Manual Testing Checklist:**
- [ ] Lighthouse audit on localhost (Performance > 90)
- [ ] Lighthouse audit on production (Performance > 90)
- [ ] Slow 3G throttling test (FCP < 1.8s, LCP < 2.5s)
- [ ] Fonts load without FOIT/FOUT
- [ ] Dialog lazy loads (Network tab shows separate chunk)
- [ ] Web Vitals tracked in GA4 (check DebugView)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iPhone, Android)
