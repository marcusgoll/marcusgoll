# Research & Discovery: 053-meta-tags-open-graph

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router) with React 19.2.0
- **Language**: TypeScript 5.9.3
- **Metadata**: Next.js Metadata API (built-in, no additional packages needed)
- **Image Serving**: Static assets via public/ folder, served by Caddy reverse proxy

### Deployment Strategy (from deployment-strategy.md)
- **Model**: direct-prod (MVP phase, solo developer)
- **Platform**: Hetzner VPS with Docker + Caddy
- **CI/CD**: GitHub Actions → Production on push to main
- **No staging environment yet** (will add when traffic > 10K/mo)

### System Architecture
- **Component**: Frontend-only feature (metadata lives in page.tsx files)
- **Integration**: No backend services, no database changes
- **Static assets**: OG images stored in public/images/og/

---

## Research Decisions

### Decision 1: Use Next.js Metadata API (existing pattern)

- **Decision**: Use built-in Next.js Metadata API with `export const metadata` for static pages and `generateMetadata()` for dynamic pages
- **Rationale**:
  - Already implemented for blog posts (app/blog/[slug]/page.tsx lines 72-127)
  - Type-safe with TypeScript
  - Server-side rendering (no client JS overhead)
  - Automatic meta tag generation by Next.js framework
- **Alternatives Rejected**:
  - react-helmet: Client-side, adds bundle size, deprecated pattern
  - next-seo package: Unnecessary abstraction over built-in API
  - Manual meta tags in Head: Not type-safe, error-prone
- **Source**: Existing implementation in `app/blog/[slug]/page.tsx:72-127`

### Decision 2: Reuse blog post metadata helper pattern

- **Decision**: Extract and reuse the `getImageUrl()` helper function for consistent image URL generation
- **Rationale**:
  - Blog posts already handle absolute URLs correctly (lines 84-89)
  - Handles NEXT_PUBLIC_SITE_URL fallback
  - Supports both absolute HTTP URLs and relative paths
- **Alternatives Rejected**:
  - Inline URL construction: Duplicates logic across 7 pages
  - Separate metadata utility library: Overkill for simple helper (defer to US4 if needed)
- **Source**: `app/blog/[slug]/page.tsx:84-89`

### Decision 3: Static OG images (MVP approach)

- **Decision**: Create 3-5 static OG images (1200x630px JPEG) with brand colors, serve from public/images/og/
- **Rationale**:
  - Simpler implementation (no image generation library)
  - Faster delivery (static files, cached by Caddy)
  - Sufficient for MVP (homepage, sections, default fallback)
  - Design images using Figma or similar tool before implementation
- **Alternatives Rejected**:
  - @vercel/og (dynamic generation): Adds complexity, requires Edge runtime, overkill for ~7 pages
  - Puppeteer/Playwright screenshots: Server-side overhead, slow generation
  - Cloudinary/Imgix transformation: External dependency, cost, network latency
- **Source**: spec.md US3, US5 requirements

### Decision 4: Extend root layout metadata

- **Decision**: Add site-wide Open Graph tags in root layout (app/layout.tsx), pages inherit and override
- **Rationale**:
  - Next.js metadata merging: Child pages inherit parent, override specific fields
  - Reduces duplication (og:site_name, og:locale only defined once)
  - Matches Next.js recommended pattern
- **Alternatives Rejected**:
  - Repeat all tags in every page: Violates DRY, error-prone
  - Centralized metadata config file: Not the Next.js way, loses type safety
- **Source**: Next.js Metadata API documentation

### Decision 5: Tag page dynamic metadata

- **Decision**: Implement `generateMetadata()` for tag pages (app/blog/tag/[tag]/page.tsx) to generate unique OG titles per tag
- **Rationale**:
  - Tag names are dynamic route params
  - Pattern already used in blog post pages (lines 72-127)
  - Type-safe with TypeScript async function
- **Alternatives Rejected**:
  - Static metadata: Can't access route params, would be generic
  - Client-side meta tags: SEO ineffective, not server-rendered
- **Source**: Existing implementation in `app/blog/[slug]/page.tsx:72`

---

## Components to Reuse (4 found)

- **app/blog/[slug]/page.tsx:84-89** — `getImageUrl()` helper function for absolute image URLs with fallback
- **app/blog/[slug]/page.tsx:100-117** — Open Graph metadata structure (openGraph object shape)
- **app/blog/[slug]/page.tsx:118-126** — Twitter Card metadata structure (twitter object shape)
- **app/layout.tsx:1-50** — Root layout metadata pattern (will extend with site-wide OG tags)

---

## New Components Needed (3 required)

- **public/images/og-default.jpg** — Default OG image (1200x630px, Navy 900 background, Emerald 600 accents, site logo + tagline)
- **public/images/og-aviation.jpg** — Aviation section OG image (aviation-themed with brand colors)
- **public/images/og-dev.jpg** — Dev/Startup section OG image (coding-themed with brand colors)

---

## Unknowns & Questions

None - all technical questions resolved. Metadata API pattern is proven, image specifications are clear, deployment has no special requirements.
