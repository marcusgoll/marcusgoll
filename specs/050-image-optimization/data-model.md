# Data Model: 050-image-optimization

## Overview

This feature is purely frontend/configuration optimization with no database entities. Image optimization is handled entirely by Next.js Image component and configuration.

## Entities

N/A - No database entities required for image optimization

## Configuration State

### next.config.ts Image Configuration
**Purpose**: Configure Next.js Image Optimization API settings

**Fields**:
```typescript
images: {
  formats: ['image/avif', 'image/webp'], // Preferred formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Breakpoints
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
  remotePatterns: RemotePattern[], // Allowed external domains
  minimumCacheTTL: 60, // Cache duration (seconds)
  dangerouslyAllowSVG: false, // Security: block SVG
  contentDispositionType: 'attachment', // Security: download SVGs
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // SVG CSP
}
```

**Validation Rules**:
- formats: Must include at least one modern format (webp or avif)
- deviceSizes: Must be in ascending order
- remotePatterns: Must not use wildcard hostnames (security risk)

**State Transitions**: N/A (static configuration)

---

## Component Props State

### Image Component Props (next/image)
**Purpose**: Control image rendering behavior

**Props**:
```typescript
interface ImageProps {
  src: string | StaticImageData // Image source
  alt: string // Alt text (required for a11y)
  width?: number // Intrinsic width
  height?: number // Intrinsic height
  fill?: boolean // Fill parent container (mutually exclusive with width/height)
  sizes?: string // Responsive sizes hint
  quality?: number // 1-100 (default: 75)
  priority?: boolean // Disable lazy loading, improve LCP
  placeholder?: 'blur' | 'empty' // Placeholder strategy
  blurDataURL?: string // Base64 blur image (for remote)
  loading?: 'lazy' | 'eager' // Loading strategy (auto-set by priority)
  className?: string // Tailwind classes
  onLoadingComplete?: () => void // Callback when loaded
}
```

**Validation Rules**:
- alt: Must not be empty for non-decorative images (WCAG 2.1)
- fill: Requires parent with `position: relative` and defined dimensions
- priority: Use only for above-the-fold images (max 2-3 per page)
- sizes: Should match actual rendered sizes to optimize srcset

---

## Shimmer Placeholder Utility

**Purpose**: Generate blur placeholder for remote images

**Function Signature**:
```typescript
function shimmer(width: number, height: number): string {
  // Returns base64-encoded SVG shimmer effect
  // Example output: "data:image/svg+xml;base64,..."
}
```

**Usage**:
```typescript
<Image
  src="https://example.com/image.jpg"
  alt="Example"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={shimmer(800, 600)}
/>
```

**Implementation**:
```typescript
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const shimmerDataURL = (w: number, h: number) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
```

---

## Database Schema

N/A - No database changes required

## API Schemas

N/A - No API changes required

## State Shape (Frontend)

### Image Loading State (React component)
```typescript
interface ImageLoadingState {
  isLoading: boolean // Image is loading
  hasError: boolean // Image failed to load
  isLoaded: boolean // Image successfully loaded
}
```

**Usage**: Optional for advanced loading states (not required for MVP)

---

## File System State

### Build-Time Optimization Cache
**Location**: `.next/cache/images/`

**Purpose**: Store optimized image variants generated during build

**Structure**:
```
.next/cache/images/
├── <hash>.<format> (e.g., abc123.webp)
├── <hash>.<format> (e.g., abc123.avif)
└── ...
```

**Lifecycle**:
- **Creation**: On first request (or build for static images)
- **Invalidation**: After `minimumCacheTTL` expires or cache cleared
- **Cleanup**: Manual (`rm -rf .next/cache/images/`) or on redeploy

---

## Measurement Data Model

### Performance Metrics (from Lighthouse CI)
**Source**: `.lighthouseci/results/*.json`

**Schema**:
```json
{
  "audits": {
    "largest-contentful-paint": {
      "numericValue": 2100 // milliseconds
    },
    "cumulative-layout-shift": {
      "numericValue": 0.05 // score
    },
    "first-contentful-paint": {
      "numericValue": 1500 // milliseconds
    }
  },
  "categories": {
    "performance": {
      "score": 0.92 // 0-1 (multiply by 100 for percentage)
    }
  }
}
```

**Validation Targets** (from spec.md):
- LCP: <2500ms (numericValue < 2500)
- CLS: <0.1 (numericValue < 0.1)
- FCP: <2000ms (numericValue < 2000)
- Performance Score: ≥0.90 (score >= 0.90)

---

## Image Sizing Patterns

### Pattern 1: Fill Layout (Recommended)
**Use Case**: Cards, grids, responsive containers

**Container**:
```tsx
<div className="relative aspect-video w-full overflow-hidden">
  {/* aspect-video = 16:9 */}
  {/* Other ratios: aspect-square, aspect-[4/3], aspect-[2/1] */}
</div>
```

**Image**:
```tsx
<Image
  src={src}
  alt={alt}
  fill // No width/height needed
  className="object-cover" // or object-contain
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Pattern 2: Fixed Dimensions
**Use Case**: Icons, avatars, known sizes

**Image**:
```tsx
<Image
  src={src}
  alt={alt}
  width={64}
  height={64}
  className="rounded-full"
/>
```

### Pattern 3: Intrinsic with Max Width
**Use Case**: Blog content images, variable sizes

**Container**:
```tsx
<div className="max-w-3xl mx-auto">
```

**Image**:
```tsx
<Image
  src={src}
  alt={alt}
  width={800}
  height={600}
  className="w-full h-auto" // Responsive but preserves ratio
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

---

## External Image Domain Whitelist

**Configuration**: `next.config.ts` → `images.remotePatterns`

**Example**:
```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/photo-*', // Optional: restrict to specific paths
  },
  {
    protocol: 'https',
    hostname: 'cdn.example.com',
    port: '', // Optional: specify port
  },
]
```

**Security Rules**:
- ❌ Never use `{hostname: '**'}` (wildcard) - security risk
- ✅ Always specify protocol (https only)
- ✅ Optionally restrict pathname for tighter security
- ✅ Add domains on-demand (don't pre-emptively allow unknown domains)

---

## Summary

**Data Entities**: 0 (no database changes)
**Configuration Files**: 1 (next.config.ts)
**Component Props**: Image component props (next/image)
**Utility Functions**: 1 (shimmer placeholder generator)
**File System State**: Build cache (.next/cache/images/)
**Measurement Schema**: Lighthouse CI JSON (performance metrics)
