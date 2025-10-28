# Implementation Plan: Performance Optimization (Lazy Loading & Code Splitting)

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15 built-in optimizations (no custom Webpack config)
- Components to reuse: 7 (GA4 integration, SSG pattern, Image optimization, analytics infrastructure)
- New components needed: 6 (Web Vitals tracking, font optimization, bundle analyzer, Lighthouse CI)

**Key Research Findings**:
- ✅ GA4 already optimized with next/script
- ✅ SSG already implemented for blog posts
- ✅ next/image used for local images
- ❌ No font optimization (critical gap)
- ❌ No bundle analysis tooling
- ❌ No Web Vitals RUM tracking
- ❌ No Lighthouse CI automation

---

## [ARCHITECTURE DECISIONS]

### Stack

**Frontend**: Next.js 15.5.6 (App Router) + React 19.2.0 + TypeScript 5.9.3
- **Why**: Already established, excellent built-in performance optimizations
- **Performance Features**: Automatic code splitting, Image optimization API, Font optimization API

**Styling**: Tailwind CSS 4.1.15
- **Why**: CSS-in-JS avoided for performance (no runtime style injection)
- **Optimization**: PurgeCSS built-in, minimal CSS bundle

**Build Tools**:
- **Bundle Analyzer**: @next/bundle-analyzer@^15.0.0
- **Web Vitals**: web-vitals@^4.2.0
- **Lighthouse CI**: @lhci/cli@^0.14.0

**Deployment**: Hetzner VPS + Docker + Caddy
- **Compression**: Caddy automatic Gzip/Brotli (verify in deployment)
- **HTTP/2**: Enabled via Caddy
- **Caching**: Static assets cached via Cache-Control headers

---

### Patterns

**Pattern 1: Dynamic Import for Below-the-Fold Components**
- **Description**: Use next/dynamic for non-critical UI components
- **Rationale**: Reduces initial bundle size, improves TTI/TBT
- **Implementation**:
  ```typescript
  import dynamic from 'next/dynamic';

  const NewsletterDialog = dynamic(() => import('@/components/ui/dialog'), {
    loading: () => <div>Loading...</div>,
    ssr: false, // Client-only for dialog interactions
  });
  ```
- **Target Components**: Dialog (Hero newsletter), SocialShare, TableOfContents (mobile)

**Pattern 2: Font Optimization via next/font**
- **Description**: Load fonts via Next.js Font API with automatic subsetting
- **Rationale**: Eliminates FOIT/FOUT, reduces font file size, enables font-display: swap
- **Implementation**:
  ```typescript
  import { Work_Sans, JetBrains_Mono } from 'next/font/google';

  const workSans = Work_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-work-sans',
  });

  const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono',
  });
  ```
- **Location**: New file `app/fonts.ts`, imported in `app/layout.tsx`

**Pattern 3: Web Vitals Real User Monitoring (RUM)**
- **Description**: Track Core Web Vitals using web-vitals package + GA4 custom events
- **Rationale**: Measure real user experience, detect performance regressions
- **Implementation**:
  ```typescript
  import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

  export function reportWebVitals() {
    onCLS((metric) => sendToGA4(metric));
    onFCP((metric) => sendToGA4(metric));
    onLCP((metric) => sendToGA4(metric));
    onTTFB((metric) => sendToGA4(metric));
    onINP((metric) => sendToGA4(metric));
  }
  ```
- **Location**: New file `lib/web-vitals-tracking.ts`, used in root layout

**Pattern 4: Bundle Analysis Integration**
- **Description**: Conditional bundle analyzer in next.config.ts via environment variable
- **Rationale**: Visualize bundle composition, identify optimization opportunities
- **Implementation**:
  ```typescript
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  module.exports = withBundleAnalyzer(withMDX(nextConfig));
  ```
- **Usage**: `ANALYZE=true npm run build` to generate bundle report

**Pattern 5: Lighthouse CI Automation**
- **Description**: Run Lighthouse audits on every PR and production deployment
- **Rationale**: Catch performance regressions before merge, enforce performance budgets
- **Implementation**: GitHub Actions workflow `.github/workflows/lighthouse-ci.yml`
- **Budgets**:
  - Performance: ≥90
  - FCP: <1.8s
  - LCP: <2.5s
  - TBT: <200ms

---

### Dependencies (new packages required)

- `@next/bundle-analyzer@^15.0.0`: Bundle visualization and analysis
- `web-vitals@^4.2.0`: Core Web Vitals measurement library
- `@lhci/cli@^0.14.0`: Lighthouse CI for automated audits (devDependency)

**Rationale**:
- `@next/bundle-analyzer`: Official Next.js tool, zero-config
- `web-vitals`: Google's official library, <2KB gzipped
- `@lhci/cli`: Industry standard for automated Lighthouse testing

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
D:/Coding/marcusgoll/
├── app/
│   ├── fonts.ts                         # NEW: Font optimization config
│   ├── layout.tsx                       # MODIFIED: Add font variables, Web Vitals reporter
│   ├── page.tsx                         # MODIFIED: Verify ISR setup
│   └── blog/[slug]/page.tsx            # MODIFIED: Verify SSG, add priority to LCP image
│
├── components/
│   ├── providers/
│   │   └── WebVitalsReporter.tsx       # NEW: Client component for Web Vitals tracking
│   ├── home/
│   │   └── Hero.tsx                    # MODIFIED: Dynamic import for Dialog
│   └── blog/
│       ├── social-share.tsx            # MODIFIED: Dynamic import (optional)
│       └── table-of-contents.tsx       # MODIFIED: Dynamic import for mobile (optional)
│
├── lib/
│   ├── web-vitals-tracking.ts          # NEW: Web Vitals → GA4 integration
│   └── analytics.ts                    # MODIFIED: Add sendMetricToGA4 helper
│
├── next.config.ts                       # MODIFIED: Add bundle analyzer
│
├── .github/workflows/
│   ├── lighthouse-ci.yml               # NEW: Lighthouse CI workflow
│   └── deploy.yml                      # MODIFIED: Add bundle size check (optional)
│
├── scripts/
│   └── analyze-bundle.sh               # NEW: Helper script for bundle analysis
│
└── lighthouserc.json                    # NEW: Lighthouse CI configuration
```

**Module Organization**:
- **app/fonts.ts**: Font configuration using next/font/google (Work Sans, JetBrains Mono)
- **lib/web-vitals-tracking.ts**: Core Web Vitals tracking logic, integrates with lib/analytics.ts
- **components/providers/WebVitalsReporter.tsx**: Client component wrapper for Web Vitals
- **scripts/analyze-bundle.sh**: Convenience script: `ANALYZE=true npm run build && open .next/analyze/client.html`

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: 0 (no database changes)
- Relationships: N/A
- Migrations required: No

**Note**: This is a pure frontend performance optimization feature. No backend/database changes needed.

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Lighthouse Performance score > 90
- NFR-001: FCP < 1.8s (95th percentile)
- NFR-001: LCP < 2.5s (95th percentile)
- NFR-001: CLS < 0.1 (95th percentile)
- NFR-001: TTI < 3.8s (95th percentile)
- NFR-001: TBT < 200ms (95th percentile)
- NFR-001: INP < 200ms (95th percentile)
- NFR-002: Initial JavaScript bundle < 200KB (gzipped)
- NFR-002: Main CSS bundle < 50KB (gzipped)
- NFR-002: Total initial download < 500KB (gzipped)

**Lighthouse CI Budgets** (enforced via lighthouserc.json):
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    }
  }
}
```

---

## [SECURITY]

**Authentication Strategy**:
- N/A (public blog, no authentication)

**Authorization Model**:
- N/A (public content)

**Input Validation**:
- N/A (no user inputs in this feature)

**Data Protection**:
- **PII Handling**: Web Vitals metrics do NOT include PII
- **GA4 Compliance**: Metrics sent as events, no personally identifiable data
- **Security Note**: Ensure GA4 ID is in environment variable (already done in app/layout.tsx)

---

## [EXISTING INFRASTRUCTURE - REUSE] (7 components)

### Services/Modules
- **app/layout.tsx** (lines 36-51): GA4 integration with next/script strategy="afterInteractive"
  - **Reuse**: Keep existing GA4 setup, extend with Web Vitals tracking
- **lib/analytics.ts**: GA4 event tracking infrastructure (trackPageView, trackContentTrackClick, etc.)
  - **Reuse**: Add new function `sendMetricToGA4(metric)` for Web Vitals

### UI Components
- **app/blog/[slug]/page.tsx** (lines 54-59): Static generation pattern with generateStaticParams
  - **Reuse**: Verify all routes use SSG, no dynamic rendering
- **components/mdx/mdx-image.tsx**: Next.js Image usage in MDX
  - **Reuse**: Already optimized, ensure all local images use this component

### Configuration
- **next.config.ts**: MDX configuration with rehypeShiki and remarkGfm
  - **Reuse**: Extend with bundle analyzer, preserve existing config
- **app/page.tsx** (line 9): ISR pattern with revalidate: 60
  - **Reuse**: Keep ISR for homepage, ensure blog posts use SSG

### Infrastructure
- **Caddy**: Web server with automatic compression and HTTP/2
  - **Reuse**: Verify compression headers, ensure Brotli/Gzip enabled

---

## [NEW INFRASTRUCTURE - CREATE] (6 components)

### Frontend
1. **app/fonts.ts**: Font optimization using next/font/google
   - **Purpose**: Load Work Sans (headings/body) and JetBrains Mono (code) with automatic subsetting
   - **Integration**: Import in app/layout.tsx, add CSS variables to <html> tag

2. **components/providers/WebVitalsReporter.tsx**: Client component for Web Vitals tracking
   - **Purpose**: Track Core Web Vitals and send to GA4
   - **Integration**: Import in app/layout.tsx, render inside ThemeProvider

3. **lib/web-vitals-tracking.ts**: Web Vitals integration logic
   - **Purpose**: Use web-vitals package to measure FCP, LCP, CLS, TTI, TBT, INP
   - **Integration**: Called by WebVitalsReporter component

### Configuration
4. **next.config.ts** (bundle analyzer): Add @next/bundle-analyzer wrapper
   - **Purpose**: Visualize bundle composition, identify heavy dependencies
   - **Usage**: `ANALYZE=true npm run build`

### CI/CD
5. **.github/workflows/lighthouse-ci.yml**: Lighthouse CI workflow
   - **Purpose**: Automated performance audits on PRs and deployments
   - **Triggers**: On pull_request, push to main, manual dispatch
   - **Outputs**: Lighthouse report, performance budget enforcement

6. **lighthouserc.json**: Lighthouse CI configuration
   - **Purpose**: Define performance budgets and assertion thresholds
   - **Budgets**: Performance >90, FCP <1.8s, LCP <2.5s, CLS <0.1, TBT <200ms

### Scripts
7. **scripts/analyze-bundle.sh**: Helper script for bundle analysis
   - **Purpose**: Convenience wrapper for running bundle analyzer
   - **Usage**: `./scripts/analyze-bundle.sh` → opens HTML report in browser

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Hetzner VPS + Docker + Caddy
- Env vars: NEXT_PUBLIC_GA_ID (already configured)
- Breaking changes: No
- Migration: No

### Build Commands
**No changes** - existing build process remains:
```bash
npm install
npm run build
npm start
```

**New optional command** for bundle analysis:
```bash
ANALYZE=true npm run build  # Generates bundle report
```

### Environment Variables
**No new required variables** - all existing:
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 measurement ID (already configured)
- `NEXT_PUBLIC_SITE_URL`: Site URL for canonical links (already configured)

**New optional variable**:
- `ANALYZE=true`: Enable bundle analyzer during build (development only, not needed in production)

### Database Migrations
**No database changes** - pure frontend optimization

### Smoke Tests
**No new smoke tests** - performance validated via Lighthouse CI

**Existing smoke tests remain**:
- Homepage loads: `curl https://marcusgoll.com` → 200 OK
- Blog post loads: `curl https://marcusgoll.com/blog/[slug]` → 200 OK
- Static assets served: `curl https://marcusgoll.com/_next/static/...` → 200 OK with compression headers

### Platform Coupling
**Next.js specific**:
- Uses `next/dynamic` for code splitting (Next.js built-in)
- Uses `next/font` for font optimization (Next.js built-in)
- Uses `@next/bundle-analyzer` (Next.js ecosystem)

**Caddy specific**:
- Assumes Caddy handles Gzip/Brotli compression automatically
- Verification step: Check Caddy config for compression directives

**GitHub Actions specific**:
- Lighthouse CI workflow uses GitHub Actions
- Alternative: Can run locally with `npx lhci autorun`

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants (must hold true)

1. ✅ No breaking NEXT_PUBLIC_* env var changes (no changes)
2. ✅ Backward-compatible (no API/data structure changes)
3. ✅ No database migrations required
4. ✅ Feature flags: N/A (performance is universal)
5. ✅ Bundle size must decrease or remain same (not increase)

### Staging Smoke Tests (Given/When/Then)

**Note**: direct-prod deployment model (no staging environment)

**Production validation after deployment**:
```gherkin
Given user visits https://marcusgoll.com
When page loads
Then Lighthouse Performance score ≥ 90
  And FCP < 1.8s
  And LCP < 2.5s
  And CLS < 0.1
  And no console errors
  And fonts load without FOIT/FOUT
  And Web Vitals tracked in GA4

Given user visits https://marcusgoll.com/blog/[any-slug]
When page loads
Then static page serves instantly
  And featured image uses priority loading
  And bundle size < 200KB (gzipped)
  And Lighthouse Performance ≥ 85

Given developer runs bundle analyzer
When ANALYZE=true npm run build
Then bundle report generates successfully
  And identifies largest chunks
  And no duplicate dependencies
  And total bundle < 200KB gzipped
```

### Rollback Plan

**Triggers for Rollback**:
- Lighthouse Performance score drops below 70
- Build failures due to bundle analyzer or dynamic imports
- Critical components fail to load (404 errors on chunks)
- CLS > 0.25 (layout shift regression)
- Font loading causes FOIT (invisible text)

**Rollback Procedure**:
1. Identify failing commit via GitHub Actions logs
2. Revert specific changes:
   ```bash
   ssh hetzner
   cd /path/to/marcusgoll
   git revert <commit-sha>
   docker-compose up --build -d
   ```
3. Verify performance metrics return to baseline (run Lighthouse manually)
4. Document issue in specs/049-performance-optimization/error-log.md
5. Fix issue in new PR, re-test locally before deployment

**Expected Rollback Time**: 10-15 minutes (SSH + Docker rebuild + verification)

**Special Considerations**:
- Font loading: If fonts cause FOIT, temporarily revert to system fonts
- Dynamic imports: If chunks fail to load, revert to static imports
- Bundle analyzer: If build breaks, disable via env var (ANALYZE=false)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup: Install dependencies, run baseline Lighthouse audit
- Development workflow: Use bundle analyzer to identify optimizations
- Validation workflow: Run Lighthouse CI locally before pushing
- Deployment workflow: Automated Lighthouse checks in GitHub Actions

---

## [PHASED IMPLEMENTATION APPROACH]

### Phase 1: Measurement & Baseline (Foundation)
**Goal**: Establish current performance metrics before optimizations

**Tasks**:
1. Install @next/bundle-analyzer, configure next.config.ts
2. Run baseline bundle analysis: `ANALYZE=true npm run build`
3. Document current bundle size and composition
4. Run baseline Lighthouse audit on production site
5. Document current metrics (FCP, LCP, CLS, TTI, TBT)
6. Create performance baseline document

**Acceptance**: Baseline metrics documented, bundle composition understood

### Phase 2: Quick Wins (Low-hanging fruit)
**Goal**: Implement optimizations with minimal code changes

**Tasks**:
1. Implement font optimization (app/fonts.ts)
2. Add font variables to app/layout.tsx
3. Verify font-display: swap eliminates FOIT/FOUT
4. Test across browsers (Chrome, Firefox, Safari)
5. Run Lighthouse audit, verify CLS improvement

**Acceptance**: Fonts optimized, CLS < 0.1, no FOIT/FOUT

### Phase 3: Code Splitting (Dynamic imports)
**Goal**: Reduce initial bundle size via lazy loading

**Tasks**:
1. Identify candidates: Dialog component in Hero.tsx
2. Implement dynamic imports with loading states
3. Verify components load correctly on interaction
4. Test SSR behavior (ensure no hydration mismatches)
5. Run bundle analyzer, verify separate chunks created
6. Measure bundle size reduction

**Acceptance**: Initial bundle < 200KB gzipped, chunks load on-demand

### Phase 4: Monitoring (Web Vitals RUM)
**Goal**: Track real user performance metrics

**Tasks**:
1. Install web-vitals package
2. Create lib/web-vitals-tracking.ts
3. Create components/providers/WebVitalsReporter.tsx
4. Integrate in app/layout.tsx
5. Test locally, verify GA4 events fire
6. Deploy to production, verify GA4 dashboard shows metrics
7. Create GA4 custom report for Web Vitals

**Acceptance**: Web Vitals tracked in GA4, custom report created

### Phase 5: Validation & CI (Lighthouse CI)
**Goal**: Automate performance monitoring

**Tasks**:
1. Install @lhci/cli
2. Create .github/workflows/lighthouse-ci.yml
3. Create lighthouserc.json with budgets
4. Test workflow on PR (manual trigger)
5. Verify workflow runs on push to main
6. Document Lighthouse CI setup in README

**Acceptance**: Lighthouse CI runs automatically, fails on performance regressions

---

## [TESTING STRATEGY]

### Unit Tests
- **Scope**: Web Vitals tracking logic (lib/web-vitals-tracking.ts)
- **Framework**: Jest + React Testing Library
- **Coverage**: Test sendMetricToGA4 function, mock gtag

### Integration Tests
- **Scope**: Font loading, dynamic imports
- **Framework**: Playwright (if E2E suite exists, otherwise manual)
- **Coverage**: Verify fonts load without FOIT, verify Dialog loads on click

### Performance Tests
- **Scope**: Lighthouse audits (automated via Lighthouse CI)
- **Framework**: @lhci/cli
- **Coverage**: Performance >90, FCP <1.8s, LCP <2.5s, CLS <0.1, TBT <200ms

### Manual Testing Checklist
- [ ] Run Lighthouse audit on localhost:3000
- [ ] Verify Lighthouse Performance > 90
- [ ] Test slow 3G throttling (DevTools)
- [ ] Verify fonts load without FOIT/FOUT
- [ ] Verify Dialog lazy loads (Network tab shows separate chunk)
- [ ] Verify Web Vitals tracked in GA4 (check GA4 DebugView)
- [ ] Test across browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness (iPhone, Android)

---

## [MONITORING & ALERTING]

### Lighthouse CI
- **Frequency**: On every PR and push to main
- **Alerts**: GitHub Actions fails if performance < 90
- **Reports**: HTML report uploaded to GitHub Actions artifacts

### Web Vitals (GA4)
- **Frequency**: 100% of user sessions
- **Dashboard**: GA4 custom report (create after Phase 4)
- **Alerts**: Manual monthly review (automated alerts future enhancement)

### Bundle Size Monitoring
- **Frequency**: On every build (optional: add to CI)
- **Tracking**: Bundle analyzer report in .next/analyze/
- **Alerts**: Manual review of bundle size trends

---

## [ROLLBACK CAPABILITY]

**Git-based rollback** (preferred):
```bash
ssh hetzner
cd /path/to/marcusgoll
git log --oneline  # Find commit before performance changes
git revert <commit-sha>
docker-compose up --build -d
```

**Docker image rollback** (if git revert not feasible):
```bash
ssh hetzner
cd /path/to/marcusgoll
docker images  # Find previous image tag
docker-compose down
docker tag marcusgoll:previous marcusgoll:latest
docker-compose up -d
```

**Verification after rollback**:
1. Visit https://marcusgoll.com → Verify site loads
2. Run Lighthouse audit → Verify no critical errors
3. Check GA4 → Verify events still tracking
4. Monitor error logs for 30 minutes

---

## [SUCCESS METRICS]

**Quantitative** (from spec.md):
1. Lighthouse Performance score > 90 (homepage and blog posts)
2. FCP < 1.8s (95th percentile, GA4 RUM)
3. LCP < 2.5s (95th percentile, GA4 RUM)
4. CLS < 0.1 (95th percentile, GA4 RUM)
5. Initial bundle < 200KB gzipped (bundle analyzer)

**Qualitative**:
1. No visual regressions (fonts render correctly)
2. No broken interactions (Dialog loads on click)
3. No console errors (no chunk loading failures)
4. Positive user feedback (faster perceived performance)

**Validation Timeline**:
- Week 1: Baseline metrics documented
- Week 2: Optimizations deployed
- Week 3-6: Monitor GA4 RUM data (30-day window)
- Week 7: Final report comparing before/after metrics
