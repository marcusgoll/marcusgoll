# Feature Specification: Performance Optimization (Lazy Loading & Code Splitting)

**Created**: 2025-10-28
**Status**: Specification Complete
**GitHub Issue**: #27
**ICE Score**: 1.50 (HIGH priority)

---

## Overview

Implement comprehensive performance optimization strategies including lazy loading, code splitting, and bundle optimization to achieve excellent Core Web Vitals and provide exceptional user experience. This feature focuses on reducing initial bundle size, implementing strategic code splitting, optimizing asset loading, and ensuring the site meets industry-standard performance benchmarks.

**Target Outcomes**:
- Lighthouse Performance score > 90
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.8s
- Total Blocking Time (TBT) < 200ms
- Initial bundle size < 200KB

---

## Problem Statement

**Current State**:
The marcusgoll.com site currently lacks systematic performance optimization strategies. While Next.js provides automatic route-based code splitting, there are opportunities to:
- Lazy load non-critical components (newsletter signup, comments, social share widgets)
- Optimize third-party scripts (analytics, tracking)
- Implement strategic resource hints for external dependencies
- Monitor and track Core Web Vitals systematically
- Reduce initial JavaScript bundle size through dynamic imports

**User Impact**:
- Slower page loads affect user engagement and retention
- Poor Core Web Vitals negatively impact SEO rankings
- Large initial bundles increase Time to Interactive, especially on mobile/slower connections
- Unoptimized third-party scripts block main thread execution

**Business Impact**:
- Reduced SEO visibility due to Core Web Vitals being ranking factors
- Lower user retention from poor perceived performance
- Missed opportunities for content engagement from slower interactions

---

## User Scenarios

### Scenario 1: First-Time Visitor on Mobile

**Given** a first-time visitor accessing marcusgoll.com from a mobile device on 3G connection
**When** they navigate to the homepage
**Then** the page should achieve FCP < 1.8s and LCP < 2.5s
**And** the initial bundle size should be < 200KB (gzipped)
**And** non-critical components (newsletter signup, analytics) should load asynchronously without blocking rendering

**Acceptance**:
- Initial page load completes with core content visible within 1.8s
- Total Blocking Time (TBT) < 200ms
- Lighthouse Performance score > 90

### Scenario 2: Returning Visitor Navigating Between Pages

**Given** a returning visitor with cached assets
**When** they navigate from homepage to a blog post using Next.js Link
**Then** navigation should use prefetching for instant transitions
**And** route-specific code should be split into separate chunks
**And** page transition should feel instant (< 100ms)

**Acceptance**:
- Route prefetching works for all internal links
- Route-specific bundles are separate from main bundle
- Cumulative Layout Shift (CLS) < 0.1 during navigation

### Scenario 3: Blog Post Reader on Desktop

**Given** a reader viewing a blog post on desktop
**When** the page loads
**Then** critical content (text, images) should load immediately
**And** non-critical widgets (newsletter, social share, comments) should lazy load below the fold
**And** syntax highlighting should not block initial render

**Acceptance**:
- Above-the-fold content fully rendered within FCP target
- Below-the-fold components use Intersection Observer for lazy loading
- Font loading optimized (no FOIT/FOUT)

### Scenario 4: Performance Monitoring

**Given** the site is deployed to production
**When** real users interact with the site
**Then** Core Web Vitals should be tracked in Google Analytics 4
**And** performance metrics should be available in GA4 dashboard
**And** alerts should trigger if metrics degrade beyond thresholds

**Acceptance**:
- Web Vitals tracked: FCP, LCP, CLS, TTI, TBT, INP
- Metrics visible in GA4 custom reports
- 95th percentile values meet targets

---

## Functional Requirements

### FR-001: Route-Based Code Splitting
**Priority**: HIGH
**Description**: Leverage Next.js automatic route-based code splitting to ensure each route only loads necessary JavaScript.

**Acceptance Criteria**:
- Each route in `app/` directory generates separate JavaScript chunks
- Bundle analyzer shows clear separation of route-specific code
- Shared dependencies extracted into common chunk
- Route chunks load on-demand during navigation

### FR-002: Dynamic Imports for Heavy Components
**Priority**: HIGH
**Description**: Implement dynamic imports (`next/dynamic`) for non-critical, heavy components.

**Target Components**:
- Newsletter signup form (below fold)
- Social share buttons (below fold)
- Comment section (if implemented)
- Search functionality (if implemented)
- Analytics tracking scripts

**Acceptance Criteria**:
- Components use `next/dynamic` with `loading` fallback
- Components do not block initial page render
- Bundle analyzer confirms separate chunks for dynamic components
- Loading states provide good UX (skeleton/spinner)

### FR-003: Bundle Size Analysis
**Priority**: HIGH
**Description**: Integrate `@next/bundle-analyzer` to visualize and monitor bundle composition.

**Acceptance Criteria**:
- Bundle analyzer configured in `next.config.ts`
- Analyzer runs via npm script: `npm run analyze`
- Identifies bundles > 100KB for optimization review
- Regular audits (monthly) documented in performance log

### FR-004: Tree Shaking & Unused Code Elimination
**Priority**: MEDIUM
**Description**: Ensure production builds eliminate unused code through tree shaking.

**Acceptance Criteria**:
- All imports use named imports (no wildcard `import *`)
- Production build eliminates dead code
- Bundle analyzer confirms no duplicate dependencies
- Side-effect-free modules marked in package.json

### FR-005: Font Optimization
**Priority**: HIGH
**Description**: Use `next/font` for automatic font optimization and elimination of layout shift.

**Acceptance Criteria**:
- Fonts loaded via `next/font/google` or `next/font/local`
- Font files self-hosted (no external font requests)
- Font display strategy prevents FOIT/FOUT
- CLS contribution from fonts < 0.01

### FR-006: Third-Party Script Optimization
**Priority**: HIGH
**Description**: Use `next/script` with appropriate loading strategies for third-party scripts.

**Target Scripts**:
- Google Analytics 4 (GA4)
- Any future analytics/tracking scripts

**Acceptance Criteria**:
- Scripts use `strategy="lazyOnload"` for non-critical
- Scripts use `strategy="afterInteractive"` for analytics
- No render-blocking scripts in document head
- Total script weight < 50KB

### FR-007: Image Optimization
**Priority**: MEDIUM
**Description**: Ensure all images use `next/image` with proper sizing and lazy loading.

**Acceptance Criteria**:
- All `<img>` tags replaced with `<Image>` component
- Images include width/height to prevent CLS
- Images use lazy loading (default Next.js behavior)
- Responsive images use `sizes` prop appropriately
- LCP image uses `priority` prop

### FR-008: Prefetching Strategy
**Priority**: MEDIUM
**Description**: Configure Next.js Link prefetching for optimal navigation performance.

**Acceptance Criteria**:
- All internal links use `next/link`
- Prefetching enabled for visible links
- Prefetch behavior configurable (viewport-based)
- Navigation feels instant for prefetched routes

### FR-009: Resource Hints
**Priority**: LOW
**Description**: Add resource hints (preconnect) for critical external domains.

**Target Domains**:
- Self-hosted Supabase instance (database)
- CDN for static assets (if applicable)
- Newsletter API (Resend/Mailgun)

**Acceptance Criteria**:
- `<link rel="preconnect">` added for external domains in root layout
- DNS resolution time reduced for external resources
- Lighthouse audit shows no missing resource hints warnings

### FR-010: Compression & Build Optimization
**Priority**: MEDIUM
**Description**: Ensure production builds use Gzip/Brotli compression for all text assets.

**Acceptance Criteria**:
- Next.js production build generates compressed assets
- Server (Caddy) serves pre-compressed Brotli/Gzip files
- Text assets (HTML, CSS, JS) compressed to ~30% of original size
- Compression headers present in HTTP responses

### FR-011: Static Generation (SSG/ISR)
**Priority**: MEDIUM
**Description**: Use Static Site Generation (SSG) or Incremental Static Regeneration (ISR) for blog posts.

**Acceptance Criteria**:
- Blog post pages use `generateStaticParams` for pre-rendering
- Homepage uses ISR with revalidation period (if needed)
- Static pages serve instantly from CDN/cache
- Build time remains reasonable (< 5 minutes for 100 posts)

### FR-012: Performance Monitoring & Tracking
**Priority**: HIGH
**Description**: Implement Web Vitals tracking in Google Analytics 4.

**Metrics to Track**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Interaction to Next Paint (INP)

**Acceptance Criteria**:
- Web Vitals library integrated (`web-vitals` package)
- Metrics sent to GA4 via custom events
- Custom GA4 report created for Core Web Vitals
- 95th percentile values tracked and monitored

---

## Non-Functional Requirements

### NFR-001: Performance Benchmarks
**Description**: Site must meet Google's Core Web Vitals thresholds.

**Targets** (95th percentile):
- FCP < 1.8s (Good: < 1.8s, Needs Improvement: 1.8-3.0s, Poor: > 3.0s)
- LCP < 2.5s (Good: < 2.5s, Needs Improvement: 2.5-4.0s, Poor: > 4.0s)
- CLS < 0.1 (Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25)
- TTI < 3.8s (Good: < 3.8s, Needs Improvement: 3.8-7.3s, Poor: > 7.3s)
- TBT < 200ms (Good: < 200ms, Needs Improvement: 200-600ms, Poor: > 600ms)
- INP < 200ms (Good: < 200ms, Needs Improvement: 200-500ms, Poor: > 500ms)

**Verification**: Lighthouse CI, WebPageTest, Real User Monitoring (RUM) via GA4

### NFR-002: Bundle Size Constraints
**Description**: Initial bundle size must remain minimal.

**Targets**:
- Initial JavaScript bundle < 200KB (gzipped)
- Main CSS bundle < 50KB (gzipped)
- Total initial download < 500KB (gzipped)

**Verification**: `npm run analyze`, bundle-analyzer reports

### NFR-003: Browser Compatibility
**Description**: Performance optimizations must not break older browsers.

**Targets**:
- Support last 2 versions of major browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers (no JavaScript errors)
- Polyfills included only when necessary (via Next.js automatic polyfilling)

**Verification**: BrowserStack testing, sentry.io error tracking (if implemented)

### NFR-004: Accessibility (WCAG 2.1 AA)
**Description**: Performance optimizations must not degrade accessibility.

**Requirements**:
- Lazy-loaded components must not break keyboard navigation
- Loading states must be announced to screen readers (aria-live)
- Font loading must not cause text to disappear (font-display: swap)
- Focus management maintained during dynamic imports

**Verification**: Lighthouse accessibility audit, manual screen reader testing

### NFR-005: Monitoring & Alerting
**Description**: Performance degradation must be detectable.

**Requirements**:
- Web Vitals tracked for 100% of user sessions
- GA4 dashboard shows trends over time
- Manual monthly review of performance metrics
- Alerts configured for major regressions (future: automated)

**Verification**: GA4 custom reports, monthly performance review checklist

---

## Success Criteria

**Measurable Outcomes** (Technology-agnostic):

1. **Lighthouse Performance Score**: Site achieves score > 90 on production homepage and blog post pages
   - Measured via: Lighthouse CI in GitHub Actions, manual audits
   - Baseline: Current unknown (measure first)
   - Target: > 90 (excellent)

2. **Core Web Vitals Compliance**: 95th percentile of real users meet "Good" thresholds
   - FCP < 1.8s
   - LCP < 2.5s
   - CLS < 0.1
   - Measured via: GA4 Real User Monitoring (RUM)

3. **Bundle Size Reduction**: Initial JavaScript bundle reduced to < 200KB (gzipped)
   - Measured via: Bundle analyzer reports, network tab inspection
   - Baseline: Current unknown (measure first)
   - Target: < 200KB initial load

4. **Page Load Time**: 95th percentile of users experience page load < 3s
   - Measured via: GA4 page timing events
   - Includes: Server response + render + interactive
   - Target: < 3s end-to-end

5. **User Engagement**: Improved engagement metrics correlate with performance improvements
   - Measured via: GA4 engagement rate, pages per session, bounce rate
   - Hypothesis: 10% improvement in performance → 5% improvement in engagement
   - Track before/after metrics

6. **SEO Impact**: Improved Core Web Vitals lead to measurable SEO gains
   - Measured via: Google Search Console rankings, impressions, click-through rate
   - Hypothesis: Meeting "Good" thresholds → improved rankings
   - Track 30 days post-deployment

---

## Assumptions

1. **Infrastructure**: Site hosted on Hetzner VPS with Docker, Caddy serves assets with compression enabled
2. **Framework**: Next.js 15 with App Router is current foundation (no framework migration needed)
3. **Content Volume**: < 100 blog posts initially (static generation feasible without long build times)
4. **Traffic**: < 10K monthly visitors initially (performance targets based on typical blog scale)
5. **Third-Party Scripts**: Google Analytics 4 is primary third-party script (minimal external dependencies)
6. **Browser Support**: Modern browsers (last 2 versions) are primary target, older browsers degrade gracefully
7. **Analytics**: GA4 already integrated for tracking (no new analytics service needed)
8. **Fonts**: System fonts or Google Fonts via next/font (no custom font files)
9. **Images**: MDX content contains images served via next/image (no image migration needed)
10. **Build Process**: CI/CD via GitHub Actions already configured (can add Lighthouse CI)

---

## Dependencies

**Blocked By** (from GitHub Issue #27):
- [BLOCKED: tech-stack-foundation-core] - Requires core tech stack (Next.js, TypeScript, Tailwind) to be stable
- [BLOCKED: image-optimization] - Requires image optimization strategy to be defined
- [BLOCKED: google-analytics-4] - Requires GA4 integration to be complete for Web Vitals tracking

**Blocks**:
- Future: Advanced analytics features (performance dashboards)
- Future: Progressive Web App (PWA) implementation
- Future: Edge caching strategies

---

## Out of Scope

**Explicitly Excluded**:
- Server-side performance optimization (database query tuning, API caching) - separate feature
- Hosting infrastructure changes (CDN migration, multi-region deployment) - separate feature
- Progressive Web App (PWA) features (service workers, offline support) - future feature
- Image format migration (WebP, AVIF) - handled by next/image automatically
- Custom build tooling (Webpack/Turbopack configuration) - use Next.js defaults
- A/B testing for performance variations - future feature
- Real-time performance monitoring dashboard - future feature (use GA4 for MVP)

---

## Technical Context

### Current Tech Stack
**Source**: `docs/project/tech-stack.md`, `package.json`

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.15
- **Deployment**: Hetzner VPS + Docker
- **Web Server**: Caddy (automatic SSL, HTTP/2)
- **Database**: PostgreSQL via Prisma 6.17.1
- **Analytics**: Google Analytics 4

### System Architecture
**Source**: `docs/project/system-architecture.md`

**Current Structure**:
```
app/
├── (routes)
│   ├── page.tsx                 # Homepage (post feed)
│   ├── blog/
│   │   └── [slug]/page.tsx      # Dynamic blog post pages
│   └── aviation/                # Aviation content section
│   └── dev-startup/             # Dev/startup content section
│
├── api/
│   └── newsletter/              # Newsletter API routes
│
components/
├── layout/                      # Header, footer, nav
├── blog/                        # Post cards, content wrappers
├── mdx/                         # Custom MDX components
└── ui/                          # Reusable primitives
```

**Key Integration Points**:
- Blog posts: MDX files processed server-side with gray-matter
- Images: Currently using standard `<img>` tags (need migration to `next/image`)
- Fonts: Currently unoptimized (need migration to `next/font`)
- Analytics: GA4 script (need optimization with `next/script`)

### Deployment Strategy
**Source**: `docs/project/deployment-strategy.md`

- **Model**: direct-prod (push to main → deploy to production)
- **CI/CD**: GitHub Actions (lint, type-check, build, deploy)
- **Rollback**: Docker image tags (can redeploy previous version)
- **Monitoring**: Manual + GA4 (no automated alerts yet)

---

## Risk Assessment

### Technical Risks

**Risk 1: Dynamic Import Breaking SSR**
- **Severity**: MEDIUM
- **Probability**: LOW
- **Impact**: Components fail to render on server-side
- **Mitigation**: Test all dynamic imports thoroughly, use `ssr: false` only when necessary
- **Fallback**: Revert specific dynamic imports if SSR breaks

**Risk 2: Bundle Analyzer Configuration Issues**
- **Severity**: LOW
- **Probability**: MEDIUM
- **Impact**: Unable to analyze bundle composition
- **Mitigation**: Test bundle analyzer locally before committing config
- **Fallback**: Use webpack-bundle-analyzer directly as backup

**Risk 3: Font Loading Causing FOIT/FOUT**
- **Severity**: MEDIUM
- **Probability**: LOW
- **Impact**: Text invisible or unstyled during font load (poor UX)
- **Mitigation**: Use `next/font` with proper font-display strategy
- **Fallback**: Use system fonts as backup

**Risk 4: Third-Party Script Blocking Render**
- **Severity**: MEDIUM
- **Probability**: MEDIUM
- **Impact**: Analytics scripts block main thread, degrade TTI
- **Mitigation**: Use `next/script` with `strategy="lazyOnload"` for non-critical scripts
- **Fallback**: Remove or defer problematic scripts

### Business Risks

**Risk 5: Performance Regression in Future Deployments**
- **Severity**: MEDIUM
- **Probability**: HIGH (without monitoring)
- **Impact**: Performance gains lost over time without continuous monitoring
- **Mitigation**: Add Lighthouse CI to GitHub Actions, monthly performance audits
- **Fallback**: Manual monthly reviews of bundle sizes and Lighthouse scores

---

## Rollback Plan

**Triggers for Rollback**:
- Lighthouse Performance score drops below 70
- Build failures due to bundle analyzer or dynamic imports
- Critical components fail to load (404 errors on chunks)
- CLS > 0.25 (layout shift regression)

**Rollback Procedure**:
1. Identify failing commit via GitHub Actions logs
2. Revert specific changes: `git revert <commit-sha>`
3. Redeploy via CI/CD pipeline
4. Validate performance metrics return to baseline
5. Document issue for future reference

**Expected Rollback Time**: 15-30 minutes

---

## Implementation Notes

**Phase Approach**:
1. **Phase 1 - Measurement & Baseline**: Bundle analyzer, current metrics, identify bottlenecks
2. **Phase 2 - Quick Wins**: Font optimization, script optimization, tree shaking
3. **Phase 3 - Code Splitting**: Dynamic imports for heavy components
4. **Phase 4 - Monitoring**: Web Vitals tracking, GA4 custom reports
5. **Phase 5 - Validation**: Lighthouse CI, real user monitoring, documentation

**Key Design Patterns**:
- Use `next/dynamic` with `loading` prop for graceful fallbacks
- Use Intersection Observer API for below-the-fold lazy loading
- Use `next/script` with appropriate strategies for all third-party scripts
- Use `next/font` for all font loading
- Use `next/image` for all images with proper sizing

**Testing Strategy**:
- Lighthouse CI in GitHub Actions (fail if score < 85)
- Manual testing on slow 3G throttling
- BrowserStack for cross-browser validation
- Real user monitoring via GA4 for 30 days post-launch

---

## Related Documentation

- **GitHub Issue**: #27 (detailed requirements and acceptance criteria)
- **Tech Stack**: `docs/project/tech-stack.md`
- **System Architecture**: `docs/project/system-architecture.md`
- **Deployment Strategy**: `docs/project/deployment-strategy.md`
- **Capacity Planning**: `docs/project/capacity-planning.md` (performance targets)

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2025-10-28 | Initial specification created | Claude Code (Specification Phase Agent) |

---

**Next Steps**: `/plan` - Generate detailed design artifacts (implementation plan, research, component inventory)
