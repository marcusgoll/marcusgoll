# Research & Discovery: 050-image-optimization

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website/blog for aviation, education, dev projects, and startups
- **Target Users**: Pilots, developers, students, and crossover audiences
- **Success Metrics**: Core Web Vitals (LCP <3.0s, CLS <0.15), Lighthouse Performance ≥85
- **Scope Boundaries**: Blog content site with dual-track focus (aviation + dev/startup)

### System Architecture (from system-architecture.md)
- **Components**: Next.js 15 monolith with MDX content, PostgreSQL database (minimal usage)
- **Integration Points**: Resend (newsletter), GA4 (analytics), GitHub (CI/CD)
- **Data Flows**: Static generation at build time, MDX files read from filesystem
- **Constraints**: Single VPS deployment, optimize for <10K visitors/month

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0, TypeScript 5.9.3
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL 15+ (self-hosted Supabase)
- **Deployment**: Hetzner VPS + Docker + Caddy reverse proxy

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (main → production)
- **Platform**: Hetzner VPS (self-hosted)
- **CI/CD Pipeline**: GitHub Actions (lint, type-check, build, deploy)
- **Environments**: Local dev, production (no staging yet)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro tier (1,000-10,000 monthly visitors)
- **Performance Targets**: FCP <2.0s, LCP <2.5s, CLS <0.1 (exceeding constitution)
- **Resource Limits**: Single VPS, optimize for low traffic scale
- **Cost Constraints**: <$50/mo total infrastructure

### API Strategy (from api-strategy.md)
- **API Style**: REST (Next.js API Routes)
- **Auth**: None (public content site, future: Supabase Auth for admin)
- **Versioning**: Not yet implemented (single API version)
- **Error Format**: Standard HTTP status codes with JSON responses

---

## Research Decisions

### Decision: Next.js Image Optimization (Built-in)
- **Decision**: Use Next.js built-in Image component (already in use) with enhanced configuration
- **Rationale**:
  - Already implemented across 21 files (PostCard, MagazineMasonry, MDXImage, etc.)
  - Zero additional dependencies required
  - Automatic WebP/AVIF conversion on Vercel or self-hosted with sharp
  - Responsive srcset generation built-in
  - Lazy loading and blur placeholder support out-of-box
- **Alternatives**:
  - Rejected: Custom image optimization pipeline (unnecessary complexity)
  - Rejected: Cloudinary/Imgix (adds cost and external dependency)
  - Rejected: Manual responsive images (too much maintenance)
- **Source**: tech-stack.md (lines 29-35), Next.js 15 documentation

### Decision: Configuration-Only Optimization Approach
- **Decision**: Optimize via next.config.ts settings and component props (no architectural changes)
- **Rationale**:
  - Existing implementation is solid foundation (Next.js Image already used)
  - Main gaps: external image fallback, missing placeholders, inconsistent sizing
  - Configuration changes are low-risk and fully reversible
  - No breaking changes to component APIs
- **Alternatives**:
  - Rejected: Complete rewrite of image components (unnecessary, existing code works)
  - Rejected: Third-party image service integration (adds complexity and cost)
- **Source**: spec.md analysis, NOTES.md current state analysis

### Decision: Blur Placeholder Strategy
- **Decision**: Use `placeholder="blur"` for local images (automatic), shimmer effect for remote images
- **Rationale**:
  - Next.js automatically generates blur placeholders for local images via static import
  - Remote images need blurDataURL (use shimmer placeholder utility)
  - Prevents CLS (Cumulative Layout Shift) by reserving space
  - Better perceived performance (progressive loading)
- **Alternatives**:
  - Rejected: LQIP generation (Low-Quality Image Placeholder) - too complex for MVP
  - Rejected: No placeholders (causes jarring layout shifts)
- **Source**: Next.js Image documentation, Core Web Vitals guidelines

### Decision: External Image Domains Configuration
- **Decision**: Configure `remotePatterns` in next.config.ts to support external images in MDXImage
- **Rationale**:
  - Currently external images fall back to `<img>` tags (MDXImage.tsx:44-49) - loses optimization
  - remotePatterns is security-safe (whitelist specific domains, not open proxy)
  - Enables full optimization for all images (local and external)
- **Alternatives**:
  - Rejected: Keep `<img>` fallback (loses performance benefits)
  - Rejected: Download and host all images locally (not scalable, copyright concerns)
- **Source**: MDXImage.tsx analysis, Next.js security best practices

### Decision: Priority Prop for Above-the-Fold Images
- **Decision**: Add `priority={true}` to hero images (PostCard featured, MagazineMasonry hero)
- **Rationale**:
  - Disables lazy loading for critical images visible on initial page load
  - Improves LCP (Largest Contentful Paint) by loading hero images immediately
  - Already implemented in MagazineMasonry:44 (line 44: priority prop)
  - Need to add to PostCard featured images on homepage
- **Alternatives**:
  - Rejected: Lazy load all images (hurts LCP for above-the-fold content)
  - Rejected: Preload via `<link rel="preload">` (Next.js priority prop is simpler)
- **Source**: PostCard.tsx, MagazineMasonry.tsx analysis, Google Core Web Vitals

### Decision: Standardize on Fill Layout with Aspect Ratio
- **Decision**: Use `fill` layout with aspect-ratio container (PostCard pattern) across components
- **Rationale**:
  - PostCard.tsx (lines 30-38) uses best pattern: aspect-video container + fill + object-cover
  - MagazineMasonry uses width/height (lines 41-42, 111-112) - inconsistent
  - Fill layout is more responsive (adapts to container) and easier to maintain
  - Prevents CLS by reserving space with aspect-ratio
- **Alternatives**:
  - Rejected: Fixed width/height (not responsive, hard to maintain)
  - Rejected: Intrinsic layout (requires knowing dimensions at build time)
- **Source**: PostCard.tsx (lines 30-38), Next.js Image layout modes

### Decision: Sizes Prop for Responsive Images
- **Decision**: Define `sizes` prop for all images to optimize srcset generation
- **Rationale**:
  - PostCard already uses: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` (line 36)
  - MDXImage uses: `"(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"` (line 36)
  - Tells browser correct image size to download for viewport
  - Prevents oversized images on mobile (saves bandwidth)
- **Alternatives**:
  - Rejected: No sizes prop (browser downloads largest image, wastes bandwidth)
- **Source**: PostCard.tsx:36, MDXImage.tsx:36, responsive images best practices

---

## Components to Reuse (7 found)

- **components/mdx/mdx-image.tsx**: MDX image wrapper with local/external image support (needs external optimization fix)
- **components/blog/PostCard.tsx**: Blog card with fill layout + aspect-ratio pattern (best practice pattern)
- **components/home/MagazineMasonry.tsx**: Magazine grid with hero image (has priority prop, needs sizing standardization)
- **components/home/FeaturedPostsSection.tsx**: Featured posts display (uses Next.js Image)
- **components/home/Sidebar.tsx**: Sidebar with author/profile images (uses Next.js Image)
- **app/blog/[slug]/page.tsx**: Individual blog post page (likely uses MDXImage)
- **next.config.ts**: Next.js configuration (currently minimal image config on line 14-16)

---

## New Components Needed (0 required)

- None - all optimization can be done by enhancing existing components and configuration

---

## Unknowns & Questions

- ✅ Performance baseline: RESOLVED - Need to measure during /optimize phase (LCP, CLS, image bytes)
- ✅ External image domains: RESOLVED - Spec assumes minimal external images, configure on-demand
- ✅ Sizing patterns: RESOLVED - Standardize on PostCard's fill + aspect-ratio pattern
- ✅ Alt text coverage: RESOLVED - Audit during implementation (US5)
- ✅ Browser support: RESOLVED - 80%+ modern browsers support WebP (Next.js provides fallback)

---

## Architecture Pattern Analysis

### Current Implementation Quality Assessment

**Strengths**:
- ✅ Using Next.js Image (not raw `<img>` tags) across all components
- ✅ Responsive `sizes` prop defined (PostCard:36, MDXImage:36)
- ✅ Priority prop on hero images (MagazineMasonry:44)
- ✅ Aspect ratios preserved (aspect-video containers)
- ✅ Object-fit and transitions for polish

**Gaps**:
- ⚠️ External images fall back to `<img>` tags (MDXImage:44-49) - loses optimization
- ⚠️ No image configuration in next.config.ts (domains array empty, no formats/deviceSizes)
- ⚠️ Inconsistent sizing: PostCard uses fill, MagazineMasonry uses width/height
- ⚠️ No blur placeholders (causes layout shift on slow connections)
- ⚠️ Missing priority on PostCard featured images (homepage above-the-fold)

### Recommended Patterns (Based on Existing Code)

**Pattern 1: Fill Layout with Aspect Ratio** (from PostCard.tsx:30-38)
```tsx
<div className="relative aspect-video w-full overflow-hidden">
  <Image
    src={src}
    alt={alt}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```
- **Use for**: Cards, grids, hero sections
- **Benefits**: Responsive, maintains aspect ratio, no CLS

**Pattern 2: Priority Images** (from MagazineMasonry.tsx:38-45)
```tsx
<Image
  src={featuredPost.feature_image}
  alt={featuredPost.title}
  width={1200}
  height={600}
  className="w-full h-full object-cover"
  priority
/>
```
- **Use for**: Above-the-fold hero images
- **Benefits**: Improves LCP, no lazy loading delay

**Pattern 3: MDX Images with Blur Placeholder** (enhancement to MDXImage.tsx)
```tsx
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  placeholder="blur" // ADD THIS
  blurDataURL={shimmer(width, height)} // ADD THIS for remote
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
/>
```
- **Use for**: Inline blog post images
- **Benefits**: Smooth loading, no CLS

---

## Dependencies Analysis

**Existing**:
- `next` 15.5.6 (includes next/image optimization)
- `sharp` (peer dependency for image optimization on self-hosted)
- `react` 19.2.0
- `typescript` 5.9.3

**New**:
- None required (all features built into Next.js)

**Optional**:
- `plaiceholder` (for advanced blur placeholder generation) - NOT NEEDED (use built-in)

---

## Performance Targets (From Constitution & Spec)

| Metric | Constitution Target | Spec Target | Strategy |
|--------|---------------------|-------------|----------|
| LCP | <3.0s | <2.5s | Priority prop, WebP/AVIF, responsive sizing |
| CLS | <0.15 | <0.1 | Blur placeholders, aspect ratios |
| FCP | <2.0s | <2.0s | Priority images, optimized formats |
| Image Bytes | N/A | -30% reduction | WebP/AVIF, responsive srcset |
| Lighthouse | ≥85 | ≥90 | All optimizations combined |

---

## Security & Privacy Considerations

**External Image Domains**:
- Use `remotePatterns` with protocol, hostname, pathname restrictions
- Never use wildcard domains (security risk - open proxy)
- Example: `{protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*'}`

**User Privacy**:
- No image tracking pixels
- No third-party CDN that tracks users (Vercel Image Optimization respects privacy)
- Alt text should not contain PII

---

## Migration Path

**Phase 1: Configuration (US1)** - 2-3 hours
- Add next.config.ts image optimization settings
- Configure remotePatterns for external domains
- Define deviceSizes and imageSizes

**Phase 2: Placeholders (US2)** - 4-6 hours
- Add blur placeholders to all Image components
- Create shimmer utility for remote images
- Test CLS improvements

**Phase 3: Priority Loading (US3)** - 2-3 hours
- Add priority prop to above-the-fold images
- Test LCP improvements with Lighthouse

**Phase 4: Standardization (US4)** - 5-7 hours
- Convert MagazineMasonry to fill layout
- Document sizing patterns in NOTES.md
- Create component usage guide

**Phase 5: Accessibility (US5)** - 3-4 hours
- Audit all images for alt text
- Fix missing/poor alt text
- Verify WCAG 2.1 AA compliance

**Phase 6: Advanced (US6)** - 6-8 hours (OPTIONAL)
- Implement automatic dimension detection for MDX images
- Add fallback logic for missing dimensions
- Test with various image sources

Total MVP (US1-US3): **8-12 hours**
Total Full Implementation (US1-US6): **22-31 hours**
