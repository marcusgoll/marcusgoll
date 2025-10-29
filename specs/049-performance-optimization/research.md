# Research & Discovery: 049-performance-optimization

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal blog combining aviation and software development expertise
- **Target Users**: Pilots seeking career advancement, developers/founders seeking systematic thinking
- **Success Metrics**: Engagement rate, pages per session, newsletter signups
- **Scope Boundaries**: Dual-track content strategy (Aviation 40%, Dev/Startup 40%, Cross-pollination 20%)

### System Architecture (from system-architecture.md)
- **Components**: Next.js App Router, MDX processing pipeline, GA4 analytics integration
- **Integration Points**:
  - Blog posts: MDX files with gray-matter frontmatter parsing
  - Analytics: Google Analytics 4 via gtag script
  - Newsletter: Dialog component (API integration pending)
- **Data Flows**: Static generation (SSG/ISR) → Filesystem → Next.js compilation → Caddy server
- **Constraints**: Hetzner VPS with Docker, no CDN currently

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.15
- **Database**: PostgreSQL via Prisma 6.17.1
- **Deployment**: Hetzner VPS + Docker + Caddy (automatic SSL, HTTP/2)
- **Analytics**: Google Analytics 4

### Data Architecture (from data-architecture.md)
- **Existing Entities**: Blog posts (MDX files), user analytics events
- **Relationships**: Posts → Tags (many-to-many), Posts → Track (aviation/dev-startup)
- **Naming Conventions**: kebab-case for slugs, camelCase for TypeScript
- **Migration Strategy**: File-based MDX (no database migrations needed for content)

### API Strategy (from api-strategy.md)
- **API Style**: Next.js App Router API routes (minimal backend)
- **Auth**: Not currently implemented
- **Versioning**: N/A (simple blog, no versioned API)
- **Error Format**: Standard Next.js error handling
- **Rate Limiting**: Not currently implemented

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro (<10K monthly visitors, <100 blog posts)
- **Performance Targets**:
  - FCP < 1.8s, LCP < 2.5s, CLS < 0.1
  - Lighthouse Performance > 90
  - Initial bundle < 200KB gzipped
- **Resource Limits**: VPS resources (check with hosting provider)
- **Cost Constraints**: Optimize for minimal hosting costs

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (push to main → deploy to production)
- **Platform**: Hetzner VPS via SSH
- **CI/CD Pipeline**: GitHub Actions (lint, type-check, build, deploy via Docker)
- **Environments**: Production only (no dedicated staging environment)

### Development Workflow (from development-workflow.md)
- **Git Workflow**: Feature branch workflow with main as production
- **Testing Strategy**: Manual testing + Lighthouse CI (to be added)
- **Code Style**: ESLint + Next.js config
- **Definition of Done**: Lighthouse > 90, no console errors, manual QA passed

---

## Research Decisions

### Decision: Use Next.js built-in optimizations (not custom Webpack)

- **Decision**: Leverage Next.js automatic code splitting, built-in Image optimization, and font optimization
- **Rationale**: Next.js 15 provides excellent performance defaults without custom configuration
- **Alternatives**: Custom Webpack config (rejected: unnecessary complexity, breaks on Next.js updates)
- **Source**: next.config.ts (lines 11-18) shows minimal config, already using @next/mdx

### Decision: Add @next/bundle-analyzer for visibility

- **Decision**: Install @next/bundle-analyzer to visualize bundle composition
- **Rationale**: No bundle analysis tools currently installed (verified via npm list)
- **Alternatives**: webpack-bundle-analyzer (rejected: @next/bundle-analyzer is Next.js-specific wrapper)
- **Source**: package.json (lines 1-56), npm list output

### Decision: Dynamic imports for Dialog component (newsletter signup)

- **Decision**: Use next/dynamic to lazy load Dialog component in Hero
- **Rationale**: Newsletter dialog is below-the-fold interaction, not critical for initial render
- **Alternatives**: Keep inline (rejected: increases bundle size unnecessarily)
- **Source**: components/home/Hero.tsx (lines 5-13) imports Dialog eagerly

### Decision: Next.js Script optimization for GA4 already implemented

- **Decision**: No changes needed - already using next/script with strategy="afterInteractive"
- **Rationale**: app/layout.tsx (lines 36-51) correctly implements GA4 with proper loading strategy
- **Alternatives**: N/A (already optimal)
- **Source**: app/layout.tsx

### Decision: No next/font implementation yet (critical gap)

- **Decision**: Add next/font/google for font optimization
- **Rationale**: No font optimization detected (grep 'next/font' returned only spec references)
- **Alternatives**: System fonts (rejected: brand requires specific fonts per Visual Brand Guide)
- **Source**: Grep results, VISUAL_BRAND_GUIDE.md references Work Sans + JetBrains Mono

### Decision: Install web-vitals package for RUM tracking

- **Decision**: Add web-vitals package + custom GA4 event tracking
- **Rationale**: No web-vitals package installed (npm list check), need for FR-012
- **Alternatives**: Manual metric collection (rejected: web-vitals is standard library)
- **Source**: npm list output, lib/analytics.ts (no Web Vitals tracking currently)

### Decision: Static Generation (SSG) for blog posts without ISR

- **Decision**: Use generateStaticParams for all blog posts, no ISR revalidation
- **Rationale**: <100 blog posts, content updates infrequent, full rebuilds acceptable
- **Alternatives**: ISR with revalidation (rejected: homepage already uses ISR, unnecessary for posts)
- **Source**: app/blog/[slug]/page.tsx (lines 54-59) already implements generateStaticParams

### Decision: Lighthouse CI in GitHub Actions

- **Decision**: Add Lighthouse CI to existing .github/workflows
- **Rationale**: No automated performance monitoring currently, need for NFR-005
- **Alternatives**: Manual Lighthouse audits (rejected: not scalable, easy to forget)
- **Source**: GitHub Actions workflows (need to be created/updated)

---

## Components to Reuse (7 found)

- **app/layout.tsx**: GA4 integration with next/script (lines 36-51) - Already optimized with strategy="afterInteractive"
- **app/blog/[slug]/page.tsx**: Static generation pattern (generateStaticParams) - Reuse for ensuring all routes are pre-rendered
- **components/mdx/mdx-image.tsx**: Next.js Image usage in MDX - Already optimized with responsive images
- **lib/analytics.ts**: GA4 event tracking infrastructure - Extend with Web Vitals tracking
- **next.config.ts**: MDX configuration - Add bundle analyzer here
- **components/home/Hero.tsx**: Dialog component pattern - Good candidate for dynamic import
- **app/page.tsx**: ISR pattern (revalidate: 60) - Reference for caching strategy

---

## New Components Needed (6 required)

- **lib/web-vitals-tracking.ts**: Web Vitals integration with GA4 custom events (FR-012)
- **components/providers/WebVitalsReporter.tsx**: Client component to report Web Vitals on page load
- **next.config.ts**: Bundle analyzer configuration (FR-003)
- **app/fonts.ts**: Font optimization using next/font/google (FR-005)
- **.github/workflows/lighthouse-ci.yml**: Lighthouse CI workflow for automated performance checks
- **scripts/analyze-bundle.ts**: Helper script to run bundle analyzer and generate reports

---

## Unknowns & Questions

None - all technical questions resolved during research.

---

## Current Performance Baseline (Research Findings)

### Bundle Size
- **Current**: 1.3MB in .next/static (uncompressed)
- **Status**: ⚠️ No bundle analyzer configured to see breakdown
- **Action**: Install @next/bundle-analyzer to identify heavy dependencies

### Optimization Gaps Identified

**HIGH PRIORITY:**
1. ❌ No font optimization (next/font not implemented)
2. ❌ No bundle analysis tooling (@next/bundle-analyzer missing)
3. ❌ No Web Vitals tracking (web-vitals package missing)
4. ❌ No Lighthouse CI (no automated performance monitoring)
5. ❌ Dialog component loaded eagerly (Hero.tsx line 5-13)

**MEDIUM PRIORITY:**
6. ⚠️ External images use <img> tag (mdx-image.tsx line 42-50)
7. ⚠️ No resource hints (preconnect) for external domains
8. ⚠️ No compression verification (need to check Caddy config)

**LOW PRIORITY:**
9. ✅ GA4 already optimized (next/script with afterInteractive)
10. ✅ SSG already implemented for blog posts
11. ✅ next/image used for local images

---

## Dependency Analysis

**Potential Bundle Bloat:**
- `framer-motion@^12.23.24`: 64KB gzipped (check usage frequency)
- `@mdx-js/react@^3.1.1` + `@mdx-js/loader@^3.1.1`: Required for content, keep
- `shiki@^1.29.2`: Syntax highlighting, necessary but heavy (~200KB)
- `next-themes@^0.4.6`: Theme switching, lightweight (<10KB)

**Action**: Use bundle analyzer to confirm actual impact in production bundle

---

## Integration Points for Performance Optimization

1. **MDX Processing Pipeline**:
   - Current: rehypeShiki for syntax highlighting
   - Opportunity: Ensure shiki bundles are code-split per route

2. **Analytics Integration**:
   - Current: GA4 via gtag in root layout
   - Enhancement: Add Web Vitals reporting to existing analytics.ts

3. **Image Optimization**:
   - Current: next/image for local images, <img> for external
   - Enhancement: Investigate next/image remote patterns for external images

4. **Font Loading**:
   - Current: No font optimization (critical gap)
   - Enhancement: Implement next/font/google for Work Sans + JetBrains Mono

---

## Performance Budget Recommendations

Based on micro-scale tier from capacity-planning.md:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial JS Bundle | <200KB gzipped | Unknown (1.3MB uncompressed) | ⚠️ Needs measurement |
| FCP | <1.8s | Unknown | ⚠️ Needs measurement |
| LCP | <2.5s | Unknown | ⚠️ Needs measurement |
| CLS | <0.1 | Unknown | ⚠️ Needs measurement |
| Lighthouse | >90 | Unknown | ⚠️ Needs measurement |

**First Action**: Establish baseline metrics with Lighthouse audit before optimization.
