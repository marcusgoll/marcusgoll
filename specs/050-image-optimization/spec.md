# Feature Specification: Image Optimization (Next.js Image)

**Branch**: `feature/050-image-optimization`
**Created**: 2025-10-28
**Status**: Draft
**GitHub Issue**: #26

## User Scenarios

### Primary User Story
As a visitor to marcusgoll.com, I want images to load quickly and smoothly so that I can read blog posts without delays, layout shifts, or excessive data usage, especially on slower mobile connections.

### Acceptance Scenarios
1. **Given** I visit the homepage, **When** I scroll through the post feed, **Then** images load progressively as they enter the viewport with smooth placeholder transitions
2. **Given** I open a blog post with featured images, **When** the page loads, **Then** the hero image appears immediately above the fold without layout shift
3. **Given** I'm on a slow 3G connection, **When** I load any page with images, **Then** appropriately sized images are served for my viewport, and WebP/AVIF formats are automatically delivered if supported by my browser
4. **Given** I view a blog post with inline MDX images, **When** images load, **Then** they display with proper aspect ratios, alt text, and optimized formats without blocking page interactivity

### Edge Cases
- What happens when an external image URL fails to load? (Fallback to placeholder or broken image handler)
- How does the system handle images without explicit dimensions? (Default dimensions applied with aspect ratio preservation)
- What happens when an image is hosted on an unapproved external domain? (Configuration-based whitelist via remotePatterns)
- How are images handled during initial build vs. on-demand optimization? (Build-time optimization for local images, runtime for external/dynamic images)

## User Stories (Prioritized)

> **Context**: This is an IMPROVEMENT feature. Next.js Image component is already in use across 21 files. This specification focuses on optimization, standardization, and closing gaps in the current implementation.

### Story Prioritization

**Priority 1 (MVP) 🎯**
- **US1** [P1]: As a developer, I want Next.js image optimization properly configured in next.config.js so that all images are automatically converted to WebP/AVIF and properly sized for different viewports
  - **Acceptance**:
    - next.config.js includes image optimization configuration
    - remotePatterns configured for external image domains (if any)
    - Image formats preference set (WebP, AVIF)
    - Device sizes and image sizes defined for responsive images
  - **Independent test**: Run production build and verify optimized images in /.next/cache/images/
  - **Effort**: S (2-3 hours)

- **US2** [P1]: As a visitor, I want consistent blur placeholder behavior across all images so that I see smooth loading transitions instead of jarring content jumps
  - **Acceptance**:
    - All Next.js Image components have placeholder="blur" or placeholder="empty" consistently
    - Local images use automatic blur placeholders (via import)
    - Remote images use shimmer placeholder effect
    - No CLS (Cumulative Layout Shift) spikes on image load
  - **Independent test**: Load pages with DevTools Network throttled to Slow 3G, verify placeholders appear
  - **Effort**: M (4-6 hours)

- **US3** [P1]: As a visitor, I want above-the-fold images to load immediately so that I don't wait for lazy loading when images are already visible
  - **Acceptance**:
    - Hero images on homepage have priority={true}
    - Featured post images on blog index have priority={true}
    - Below-the-fold images retain lazy loading (default behavior)
    - LCP (Largest Contentful Paint) improves by at least 20%
  - **Independent test**: Run Lighthouse audit, verify LCP metric and priority resource hints
  - **Effort**: S (2-3 hours)

**Priority 2 (Enhancement)**
- **US4** [P2]: As a developer, I want consistent sizing patterns across components so that maintenance is easier and performance is predictable
  - **Acceptance**:
    - Document standard patterns: fill vs width/height
    - Update PostCard, MagazineMasonry to use consistent approach
    - Define standard sizes configuration for common use cases
    - Create component usage guide in NOTES.md
  - **Depends on**: US1
  - **Effort**: M (5-7 hours)

- **US5** [P2]: As a visitor using a screen reader, I want all images to have descriptive alt text so that I understand the visual content
  - **Acceptance**:
    - All images have non-empty alt attributes
    - Alt text describes image content, not just repeats title
    - Decorative images use alt="" (empty string)
    - MDX images pull alt text from Markdown syntax
  - **Depends on**: US1
  - **Effort**: S (3-4 hours - audit + fixes)

**Priority 3 (Nice-to-have)**
- **US6** [P3]: As a content creator, I want automatic aspect ratio detection for MDX images so that I don't need to manually specify dimensions in every blog post
  - **Acceptance**:
    - MDXImage component attempts to read dimensions from local files
    - Falls back to sensible defaults (16:9) if dimensions unavailable
    - Logs warnings for images missing dimension data
    - No breaking changes to existing MDX image syntax
  - **Depends on**: US1, US2, US4
  - **Effort**: M (6-8 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (configuration, placeholders, priority), validate with Lighthouse before adding US4-US5 (standardization, accessibility audit).

## Visual References

N/A - This is an infrastructure/optimization feature without new UI components. Visual changes are performance improvements (placeholders, faster loading) rather than design changes.

## Success Metrics (HEART Framework)

> **Rationale**: Performance optimization that directly impacts user experience and Core Web Vitals. Measurable via Lighthouse CI.

| Dimension | Goal | Signal | Metric | Target | Guardrail |
|-----------|------|--------|--------|--------|-----------|
| **Happiness** | Smooth visual experience | Layout shift on image load | CLS (Cumulative Layout Shift) | <0.1 (Good) | <0.25 (Needs Improvement) |
| **Engagement** | Fast page interactivity | Time to Interactive | TTI (Lighthouse) | <3.5s | <5s (acceptable) |
| **Task Success** | Content loads quickly | Largest Contentful Paint | LCP | <2.5s (Good) | <4.0s (Needs Improvement) |
| **Performance** | Efficient image delivery | Transfer size reduction | Image bytes transferred | -30% reduction | Maintain <2MB page weight |
| **Performance** | Browser format support | WebP/AVIF adoption rate | % images served as WebP/AVIF | >80% modern browsers | 100% fallback to JPEG/PNG |

**Performance Targets** (from constitution.md):
- FCP <2.0s (currently targeting <1.5s stretch goal)
- LCP <2.5s (constitution: <3.0s - we're exceeding)
- CLS <0.1 (constitution: <0.15 - we're exceeding)
- Lighthouse Performance ≥90 (constitution: ≥85)

**Measurement Sources** (Claude Code-accessible):
- Lighthouse CI: `.lighthouseci/results/*.json` (automated on every build)
- Web Vitals: Manual measurement via Chrome DevTools Performance panel
- Network panel: Transfer size before/after optimization
- Build logs: Next.js image optimization cache analysis

## Screens Inventory (UI Features Only)

> **SKIP** - No new screens. This feature optimizes existing image rendering across all pages. Affected components:
> - PostCard (blog card featured images)
> - MagazineMasonry (homepage hero and grid images)
> - MDXImage (inline blog post images)
> - Sidebar (author/profile images)
> - FeaturedPostsSection (homepage featured images)

## Hypothesis

> **Context**: This is an IMPROVEMENT feature targeting Core Web Vitals and perceived performance.

**Problem**: Current image implementation has gaps that hurt performance and user experience
- Evidence:
  - External images in MDXImage.tsx fall back to unoptimized `<img>` tags (line 44-49)
  - No consistent placeholder strategy causes jarring layout shifts
  - Mixed sizing approaches (fill vs width/height) create maintenance burden
  - Missing next.config.js image optimization settings
  - Unknown: Current LCP/CLS baseline (need to measure in /optimize phase)
- Impact: All visitors, especially mobile users on slower connections, experience slower load times and visual instability

**Solution**: Standardize and optimize Next.js Image usage across all components
- Change:
  1. Add next.config.js with image optimization settings (formats, sizes, domains)
  2. Implement consistent blur placeholder strategy
  3. Add priority prop to above-the-fold images
  4. Standardize sizing patterns across components
  5. Audit and fix alt text gaps
- Mechanism: Next.js automatic image optimization reduces bytes transferred, lazy loading reduces initial page weight, blur placeholders eliminate layout shift, priority images improve LCP

**Prediction**: Properly configured image optimization will improve Core Web Vitals to "Good" thresholds
- Primary metrics:
  - LCP: Target <2.5s (expect 20-30% improvement from baseline)
  - CLS: Target <0.1 (expect 50%+ improvement from current layout shifts)
  - Transfer size: -30% image bytes via WebP/AVIF + responsive sizing
- Secondary impact: Lighthouse Performance score ≥90 (from unknown baseline)
- Confidence: High - Well-documented Next.js feature with proven performance benefits

## Context Strategy & Signal Design

> **Context**: This spec is created by the Specification Phase Agent with orchestration from /spec-flow.

- **System prompt altitude**: Implementation-focused - No abstract planning needed, concrete optimization tasks
- **Tool surface**: Read (components), Bash (config), Edit (components + config), Lighthouse (measurement)
- **Examples in scope**:
  1. next.config.js with images.remotePatterns, formats, deviceSizes
  2. Image component with placeholder="blur" and blurDataURL for remote images
  3. Priority prop on PostCard featured image
- **Context budget**: 75k tokens (planning phase), 100k (implementation) - Low context needs (config + component updates)
- **Retrieval strategy**: JIT - Pull components as needed during implementation, not upfront
- **Memory artifacts**:
  - NOTES.md: Document sizing patterns, alt text audit results, performance baseline/improvements
  - tasks.md: Track component updates, config changes, measurement tasks
- **Compaction cadence**: Not needed - Low context feature (<30k estimated)
- **Sub-agents**: None - Single implementation agent can handle all tasks

## Requirements

### Functional (testable only)

- **FR-001**: System MUST optimize all images using Next.js Image component (no `<img>` tags except for decorative/SVG)
- **FR-002**: System MUST automatically serve WebP or AVIF format to browsers that support them, with fallback to JPEG/PNG for older browsers
- **FR-003**: System MUST generate responsive image sizes (srcset) appropriate for mobile, tablet, and desktop viewports
- **FR-004**: System MUST lazy-load images below the fold by default (loading="lazy" behavior)
- **FR-005**: System MUST load above-the-fold images immediately with priority prop (no lazy loading for hero images)
- **FR-006**: System MUST display blur or shimmer placeholders while images load to prevent layout shift
- **FR-007**: System MUST preserve aspect ratios for all images to prevent Cumulative Layout Shift (CLS)
- **FR-008**: System MUST support external image URLs from configured domains via next.config.js remotePatterns
- **FR-009**: System MUST provide descriptive alt text for all non-decorative images (WCAG 2.1 requirement)
- **FR-010**: MDXImage component MUST optimize both local and external images referenced in Markdown

### Non-Functional

- **NFR-001**: Performance: LCP (Largest Contentful Paint) MUST be <2.5s on 3G connection (Google "Good" threshold)
- **NFR-002**: Performance: CLS (Cumulative Layout Shift) MUST be <0.1 (Google "Good" threshold)
- **NFR-003**: Performance: Image transfer size MUST reduce by at least 30% compared to unoptimized baseline
- **NFR-004**: Accessibility: All images MUST have alt attributes per WCAG 2.1 Level AA (decorative images use alt="")
- **NFR-005**: Mobile: Images MUST adapt to viewport size using responsive srcset (no oversized images on mobile)
- **NFR-006**: Build: Production build MUST succeed without image optimization errors or warnings
- **NFR-007**: Compatibility: Image optimization MUST work with Vercel deployment platform
- **NFR-008**: Compatibility: Image formats MUST fall back gracefully for browsers without WebP/AVIF support

### Key Entities (if data involved)

N/A - No database entities. Image optimization is purely client-side rendering concern.

## Deployment Considerations

> **Context**: No infrastructure changes required. Configuration-only changes to Next.js settings.

### Platform Dependencies

**Vercel** (marcusgoll.com production):
- None - Next.js Image optimization works automatically on Vercel with built-in Image Optimization API
- Vercel's CDN handles WebP/AVIF conversion and caching automatically
- No edge middleware changes required

**Dependencies**:
- None - Image optimization is built into Next.js 15.5.6 (already installed)

### Environment Variables

**New Required Variables**:
- None

**Changed Variables**:
- None

**Schema Update Required**: No

### Breaking Changes

**API Contract Changes**:
- No

**Database Schema Changes**:
- No

**Component API Changes**:
- Potentially: MDXImage component props might change if adding automatic dimension detection (US6 - Priority 3)
- Breaking impact: Low - Internal component only, not public API

**Client Compatibility**:
- Fully backward compatible - Progressive enhancement (modern browsers get WebP/AVIF, older browsers get JPEG/PNG)

### Migration Requirements

**Code Migration**:
- Yes: Update existing `<img>` tags to Next.js Image components (if any found during audit)
- Impact: Low - Grep shows 0 raw `<img>` tags in `.tsx` files (already using Next.js Image)

**Configuration Migration**:
- Yes: Add next.config.js image configuration (new file or update existing)
- Impact: Low - Additive change, no breaking modifications

**Data Backfill**:
- Not required

**Reversibility**:
- Fully reversible - Can remove next.config.js image settings or revert component changes without data loss

### Rollback Considerations

**Standard Rollback**:
- Yes: 3-command git revert rollback
  ```bash
  git revert <commit-sha>
  npm run build
  vercel --prod
  ```

**Special Rollback Needs**:
- None - Configuration and component changes are self-contained
- No database, no environment variables, no external service dependencies

**Deployment Metadata**:
- Deploy IDs tracked in specs/050-image-optimization/NOTES.md (Deployment Metadata section after /ship)

---

## Measurement Plan

> **Purpose**: Validate performance improvements using Lighthouse CI and Web Vitals.

### Data Collection

**Lighthouse CI** (automated on every build):
- `.lighthouseci/results/*.json` - Performance, Accessibility, Best Practices scores
- Focus metrics: LCP, CLS, FCP, TTI, Performance score

**Web Vitals** (manual verification):
- Chrome DevTools → Performance panel
- Measure Core Web Vitals: LCP, FID, CLS
- Compare before/after optimization

**Network Analysis** (manual verification):
- Chrome DevTools → Network panel
- Filter: Img
- Compare total image bytes transferred before/after
- Verify WebP/AVIF delivery in modern browsers

### Measurement Queries

**Lighthouse** (`.lighthouseci/results/*.json`):
```bash
# Performance score
jq '.categories.performance.score * 100' .lighthouseci/results/latest.json

# LCP (target: <2.5s)
jq '.audits["largest-contentful-paint"].numericValue / 1000' .lighthouseci/results/latest.json

# CLS (target: <0.1)
jq '.audits["cumulative-layout-shift"].numericValue' .lighthouseci/results/latest.json

# FCP (target: <2.0s)
jq '.audits["first-contentful-paint"].numericValue / 1000' .lighthouseci/results/latest.json
```

**Build Output** (Next.js optimization cache):
```bash
# Check optimized images generated during build
ls -lh .next/cache/images/
# Verify WebP/AVIF files created

# Build log analysis (transfer size)
grep "Total size" .next/build-manifest.json
```

**Network Panel** (manual):
1. Open DevTools → Network → Img filter
2. Load homepage
3. Record total image bytes transferred
4. Compare to baseline (expect -30%)
5. Verify Content-Type: image/webp or image/avif in response headers

### Baseline Measurement (Before Optimization)

**To be captured during /optimize phase**:
- [ ] Current LCP value
- [ ] Current CLS value
- [ ] Current FCP value
- [ ] Current total image transfer size (KB)
- [ ] Current Lighthouse Performance score
- [ ] Screenshot of Web Vitals from homepage
- [ ] Document in NOTES.md → Performance Baseline section

### Success Criteria Validation

**After implementation, verify**:
- [ ] LCP <2.5s (20-30% improvement from baseline)
- [ ] CLS <0.1 (50%+ improvement from baseline)
- [ ] Image bytes reduced by ≥30%
- [ ] Lighthouse Performance ≥90
- [ ] All images have alt attributes (Accessibility score ≥95)
- [ ] WebP/AVIF served to 80%+ of visitors (modern browser adoption)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance <2.5s LCP target, accessibility WCAG 2.1 AA)
- [x] No implementation details (specific Next.js APIs, code samples kept to examples only)

### Conditional: Success Metrics (Skip if no user tracking)
- [x] HEART metrics defined with Claude Code-measurable sources (Lighthouse CI, Web Vitals)
- [x] Hypothesis stated (Problem: gaps in current implementation → Solution: standardization + optimization → Prediction: 20-30% LCP improvement, <0.1 CLS)

### Conditional: UI Features (Skip if backend-only)
- [x] All affected components identified (PostCard, MagazineMasonry, MDXImage, Sidebar, FeaturedPostsSection)
- [x] System components from existing codebase documented in NOTES.md

### Conditional: Deployment Impact (Skip if no infrastructure changes)
- [x] Breaking changes identified (None - backward compatible configuration changes)
- [x] Environment variables documented (None required)
- [x] Rollback plan specified (Standard 3-command rollback)

---

## Assumptions

1. **Next.js Image Optimization API**: Vercel automatically handles image optimization without additional configuration beyond next.config.js
2. **Browser Support**: 80%+ of visitors use modern browsers supporting WebP (based on typical web traffic in 2025)
3. **External Images**: Minimal or no external image domains need to be whitelisted (most images are local in `/public/images/`)
4. **Performance Baseline**: Current LCP is likely >3.0s on 3G (typical unoptimized site), providing room for 20-30% improvement
5. **Alt Text**: Most images already have alt text from Ghost CMS migration (frontmatter), audit will find gaps rather than starting from zero
6. **Sizing Patterns**: Standardizing on fill layout with aspect ratio container is feasible for all use cases (no fixed-size image requirements)

---

## Out of Scope

- **CDN Configuration**: Vercel's built-in Image Optimization API is sufficient (no Cloudflare or custom CDN setup)
- **Image Upload/CMS**: Not changing how images are added to blog posts (Ghost CMS workflow unchanged)
- **Image Editing**: No client-side image editing, cropping, or filters
- **Animated Images**: GIF optimization not prioritized (low usage, Next.js handles basic optimization)
- **Video Optimization**: Separate feature (videos use different optimization strategies)
- **Art Direction**: No `<picture>` element with multiple sources for art direction (use Next.js responsive sizing instead)
- **LQIP Generation**: No custom Low-Quality Image Placeholder generation (Next.js blur placeholder sufficient)

---

## Success Criteria

> **User-focused, technology-agnostic, measurable outcomes**

1. **Performance**: Page load time for blog posts decreases by at least 20% on 3G connections
2. **Visual Stability**: Users experience zero layout shift (CLS <0.1) when images load on any page
3. **Accessibility**: 100% of images have descriptive text alternatives for screen reader users
4. **Efficiency**: Image data transferred to users reduces by at least 30% compared to unoptimized baseline
5. **Compatibility**: Images display correctly in all major browsers (Chrome, Firefox, Safari, Edge) with appropriate format fallbacks
6. **User Experience**: Above-the-fold images appear immediately without lazy loading delay
7. **Quality**: Lighthouse Performance score improves to 90 or above (from unknown baseline)
8. **Smoothness**: Users see smooth placeholder-to-image transitions instead of blank space or sudden image pops

---

## Next Steps

1. **Run `/plan`** to generate technical implementation plan with:
   - next.config.js configuration details
   - Component update strategy
   - Measurement baseline capture approach
   - Alt text audit checklist

2. **Clarifications** (if needed): Run `/clarify` if any requirements need user input (currently none - all decisions have reasonable defaults)

3. **Implementation**: Run `/tasks` to generate TDD task breakdown after plan is approved
