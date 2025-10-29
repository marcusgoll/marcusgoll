# Implementation Plan: Meta Tags & Open Graph

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15 Metadata API (built-in, type-safe)
- Components to reuse: 4 (blog post metadata pattern, getImageUrl helper, OG/Twitter structures)
- New components needed: 3 (static OG images for default, aviation, dev sections)

**Key Decisions**:
1. Reuse blog post metadata pattern (app/blog/[slug]/page.tsx lines 72-127)
2. Static OG images for MVP (defer dynamic generation to future iteration)
3. Extend root layout with site-wide OG tags (og:site_name, og:locale)
4. Dynamic metadata for tag pages using generateMetadata()
5. No new dependencies required (use built-in Next.js API)

---

## [ARCHITECTURE DECISIONS]

### Stack

- **Frontend**: Next.js 15.5.6 App Router (existing)
- **Language**: TypeScript 5.9.3 (existing)
- **Metadata API**: Next.js built-in Metadata type (no new packages)
- **Image Format**: JPEG 1200x630px (static assets)
- **Deployment**: Hetzner VPS with Caddy (existing, serves static images)

### Patterns

**Pattern 1: Static Metadata Export**
- **Description**: Export const metadata object for pages with fixed content (homepage, sections)
- **Rationale**: Simpler than generateMetadata() for static pages, type-safe, server-rendered
- **Example**: `app/page.tsx`, `app/aviation/page.tsx`, `app/dev-startup/page.tsx`
- **Reference**: Already used in aviation/dev-startup pages (lines 11-15)

**Pattern 2: Dynamic Metadata Generation**
- **Description**: Export async generateMetadata() for pages with route params (tag pages)
- **Rationale**: Access route params to generate unique titles per tag
- **Example**: `app/blog/tag/[tag]/page.tsx`
- **Reference**: Already used in blog post pages (app/blog/[slug]/page.tsx:72-127)

**Pattern 3: Metadata Inheritance**
- **Description**: Root layout defines site-wide tags, child pages inherit and override specific fields
- **Rationale**: Next.js merges metadata automatically, reduces duplication
- **Example**: Root layout has og:site_name, pages override og:title, og:url
- **Reference**: Next.js Metadata API documentation

**Pattern 4: Image URL Helper**
- **Description**: Reuse getImageUrl() helper for absolute URL generation with fallback
- **Rationale**: Consistent URL handling across all pages, handles NEXT_PUBLIC_SITE_URL
- **Example**: Extract from blog post page, use in all metadata objects
- **Reference**: app/blog/[slug]/page.tsx:84-89

### Dependencies (new packages required)

None - uses built-in Next.js Metadata API and static image assets.

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
app/
├── layout.tsx                     # MODIFY: Add site-wide OG tags
├── page.tsx                       # MODIFY: Add complete OG/Twitter metadata
├── aviation/
│   └── page.tsx                   # MODIFY: Add OG/Twitter metadata, aviation image
├── dev-startup/
│   └── page.tsx                   # MODIFY: Add OG/Twitter metadata, dev image
├── blog/
│   ├── page.tsx                   # MODIFY: Add OG/Twitter metadata
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx           # MODIFY: Add generateMetadata() for dynamic tags
│   └── [slug]/
│       └── page.tsx               # VERIFY: No changes needed (already has metadata)
└── newsletter/
    └── page.tsx                   # MODIFY: Add OG/Twitter metadata

public/images/og/
├── og-default.jpg                 # NEW: Default OG image (Navy 900 + Emerald 600)
├── og-aviation.jpg                # NEW: Aviation OG image (aviation-themed)
└── og-dev.jpg                     # NEW: Dev/Startup OG image (coding-themed)
```

**Module Organization**:
- **Metadata exports**: Located at top of page.tsx files (after imports)
- **OG images**: Static assets in public/images/og/ (served by Caddy)
- **Helper functions**: getImageUrl() extracted to lib/metadata.ts (if US4 implemented)

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: 3 (Metadata, OpenGraph, Twitter objects - Next.js types)
- No database changes (metadata defined in code)
- OG images: 3 static JPEG files (1200x630px, <200KB each)

**Type Definitions**:
```typescript
import type { Metadata } from 'next';

// Static metadata example
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description',
  openGraph: {
    title: 'Page Title',
    description: 'Description',
    type: 'website',
    url: 'https://marcusgoll.com/...',
    siteName: 'Marcus Gollahon',
    locale: 'en_US',
    images: [{
      url: 'https://marcusgoll.com/images/og-default.jpg',
      width: 1200,
      height: 630,
      alt: 'Page Title'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marcusgoll',
    creator: '@marcusgoll',
    title: 'Page Title',
    description: 'Description',
    images: ['https://marcusgoll.com/images/og-default.jpg']
  },
  alternates: {
    canonical: 'https://marcusgoll.com/...'
  }
};
```

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- **NFR-001**: Metadata generation <10ms added to SSR time (measured via console.time in dev)
- **NFR-002**: Accessibility - OG images have meaningful alt text
- **NFR-003**: SEO - 100% pass rate on LinkedIn/Twitter/Facebook validators
- **NFR-004**: Maintainability - DRY principle with shared utilities (if US4 implemented)

**Lighthouse Targets** (unchanged):
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**OG Image Performance**:
- File size: <200KB each (JPEG compression)
- Dimensions: 1200x630px (optimal for all platforms)
- Format: JPEG (smaller than PNG for photos/gradients)
- Caching: Served by Caddy with cache headers (1 year)

---

## [SECURITY]

### Authentication Strategy

Not applicable - metadata is public, no authentication required.

### Authorization Model

Not applicable - all metadata is publicly readable (required for social platform scraping).

### Input Validation

Not applicable - no user input (metadata is static, defined in code).

### Data Protection

- **PII handling**: No PII in metadata (public site information only)
- **Sensitive data**: Twitter handle @marcusgoll is public (not sensitive)
- **Environment variables**: NEXT_PUBLIC_SITE_URL is public (prefixed with NEXT_PUBLIC_)

**Security Considerations**:
- OG images are static assets (no dynamic generation = no injection risk)
- Metadata is hardcoded in TypeScript (compile-time type checking)
- No user-generated content in metadata (all controlled by developers)

---

## [EXISTING INFRASTRUCTURE - REUSE] (4 components)

### Metadata Patterns

1. **app/blog/[slug]/page.tsx:72-127** - Complete generateMetadata() implementation
   - **Reuse**: Structure of Metadata object, OpenGraph fields, Twitter Card fields
   - **Pattern**: Async function, type-safe return, image URL handling

2. **app/blog/[slug]/page.tsx:84-89** - getImageUrl() helper function
   - **Reuse**: Absolute URL generation with NEXT_PUBLIC_SITE_URL fallback
   - **Pattern**: Handles relative paths, absolute HTTP URLs, missing images
   - **Code**:
   ```typescript
   const getImageUrl = (imagePath?: string) => {
     if (!imagePath) return `${SITE_URL}/images/og-default.jpg`;
     if (imagePath.startsWith('http')) return imagePath;
     return `${SITE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
   };
   ```

3. **app/aviation/page.tsx:11-15** - Static metadata export pattern
   - **Reuse**: Export const metadata structure for pages without route params
   - **Pattern**: Simple object export, no async/await needed

4. **app/layout.tsx** - Root layout structure
   - **Extend**: Add site-wide Open Graph tags (og:site_name, og:locale, og:type)
   - **Pattern**: Base metadata inherited by all child pages

---

## [NEW INFRASTRUCTURE - CREATE] (3 components)

### OG Image Assets

1. **public/images/og-default.jpg** - Default OG image
   - **Specs**: 1200x630px JPEG, <200KB
   - **Design**: Navy 900 (#0F172A) background, Emerald 600 (#059669) accent
   - **Content**: Site logo + tagline "Teaching systematic thinking from 30,000 feet"
   - **Usage**: Fallback for all pages without specific OG image

2. **public/images/og-aviation.jpg** - Aviation section OG image
   - **Specs**: 1200x630px JPEG, <200KB
   - **Design**: Navy 900 background, aviation-themed (aircraft silhouette or instrument panel)
   - **Content**: "Aviation" title + Emerald 600 accent
   - **Usage**: /aviation page metadata

3. **public/images/og-dev.jpg** - Dev/Startup section OG image
   - **Specs**: 1200x630px JPEG, <200KB
   - **Design**: Navy 900 background, coding-themed (code snippet or terminal)
   - **Content**: "Dev & Startup" title + Emerald 600 accent
   - **Usage**: /dev-startup page metadata

**Design Requirements** (from constitution.md Brand Principle #2):
- Colors: Navy 900 (#0F172A), Emerald 600 (#059669)
- Typography: Work Sans (headings), JetBrains Mono (code if shown)
- Accessibility: High contrast text (WCAG 2.1 AA), readable at small thumbnail sizes
- Branding: Include site identifier (logo or "Marcus Gollahon" text)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**

### Platform Dependencies

- **Platform**: Hetzner VPS with Caddy (no changes)
- **Static assets**: OG images served from public/images/og/ via Caddy
- **No platform-specific features**: Works on any Next.js deployment

### Environment Variables

**New Required Variables**: None

**Existing Variables Used**:
- `NEXT_PUBLIC_SITE_URL` - Already exists, used for canonical URLs and absolute image URLs
- **Value (production)**: `https://marcusgoll.com`
- **Value (development)**: `http://localhost:3000`
- **Fallback**: Defaults to `https://marcusgoll.com` if not set (line 38 of blog post page)

**Schema Update Required**: No (NEXT_PUBLIC_SITE_URL already in environment)

### Breaking Changes

**API Contract Changes**: No (no API involved)

**Database Schema Changes**: No (no database changes)

**Auth Flow Modifications**: No (no authentication)

**Client Compatibility**: Backward compatible (metadata is server-side, no client changes)

### Migration Requirements

**Database Migrations**: No

**Data Backfill**: Not required

**RLS Policy Changes**: No

**Reversibility**: Fully reversible (git revert removes metadata exports, OG images can be deleted)

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants

- No breaking changes to existing metadata (blog posts keep their metadata)
- OG images load successfully (200 status, <200KB file size)
- All pages pass social platform validators (LinkedIn, Twitter, Facebook)
- NEXT_PUBLIC_SITE_URL is set in production (required for absolute URLs)

### Staging Smoke Tests

**Note**: No staging environment yet (direct-prod deployment model). Manual testing required before merging to main.

**Local Testing Checklist** (Before PR):
```gherkin
Given developer has built project locally (npm run build)
When developer visits http://localhost:3000
Then homepage displays without errors
  And og:title meta tag is present in HTML source
  And og:image points to /images/og-default.jpg
  And image file loads successfully (200 status)

Given developer enters homepage URL in LinkedIn Post Inspector
When LinkedIn fetches metadata
Then rich preview displays with title, description, and default OG image
  And no validation errors are shown

Given developer enters aviation page URL in Twitter Card Validator
When Twitter fetches metadata
Then summary_large_image card displays
  And aviation OG image loads at 1200x630
  And no validation warnings are shown
```

### Rollback Plan

**Standard Rollback**: Yes - 3-command rollback via git revert

**Rollback Commands**:
```bash
# Find commit hash
git log --oneline | grep "meta-tags"

# Revert commit
git revert <commit-hash>

# Push to main (auto-deploys via GitHub Actions)
git push origin main
```

**Special Rollback Needs**: None

**Deployment Metadata**: Deploy IDs tracked in specs/053-meta-tags-open-graph/NOTES.md

### Artifact Strategy

**Build Artifacts**:
- **Next.js build output**: .next/ directory (includes metadata in HTML)
- **Docker image**: ghcr.io/marcusgoll/marcusgoll:<commit-sha>
- **OG images**: Included in Docker image (COPY public/ in Dockerfile)

**Build-Once Strategy**:
- Build Docker image in GitHub Actions on push to main
- Tag image with commit SHA
- Deploy same image to production VPS
- OG images bundled in image (no separate asset deployment needed)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- **Scenario 1**: Initial setup (no new dependencies, verify NEXT_PUBLIC_SITE_URL)
- **Scenario 2**: Validation (npm run build, social platform validators)
- **Scenario 3**: Manual testing (test all 7 page types, verify metadata in DevTools)
- **Scenario 4**: Post-deployment validation (clear social caches, monitor Search Console)

---

## [REUSE OPPORTUNITIES]

**Components to Reuse** (4 identified):
1. Blog post metadata pattern (app/blog/[slug]/page.tsx:72-127)
2. getImageUrl() helper function (app/blog/[slug]/page.tsx:84-89)
3. Static metadata export (app/aviation/page.tsx:11-15)
4. Root layout metadata structure (app/layout.tsx)

**Patterns to Follow**:
- Next.js Metadata API (built-in, type-safe)
- OpenGraph object shape (from blog posts)
- Twitter Card structure (from blog posts)
- Absolute URL generation (SITE_URL helper)

**Code Reuse Strategy**:
- **Copy-paste for MVP** (US1-US3): Inline getImageUrl() in each page for speed
- **Extract to utility (US4 Enhancement)**: Create lib/metadata.ts with shared helpers if time permits
- **Rationale**: DRY principle vs MVP speed trade-off (acceptable to duplicate for initial implementation)
