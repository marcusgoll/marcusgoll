# Data Model: 053-meta-tags-open-graph

## Entities

### Metadata Object (Next.js Type)

**Purpose**: TypeScript type for page metadata, auto-generated meta tags by Next.js framework

**Fields**:
- `title`: string - Page title (also used for og:title, twitter:title)
- `description`: string - Page description (also used for og:description, twitter:description)
- `openGraph`: OpenGraph - Open Graph protocol tags
- `twitter`: Twitter - Twitter Card tags
- `alternates.canonical`: string - Canonical URL for SEO
- `authors`: Array<{name: string}> - Content authors (optional)

**Type Definition** (from Next.js):
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
  alternates: { canonical: 'https://...' }
};
```

**Relationships**:
- Extends Next.js Metadata type (from 'next')
- Merges with parent layout metadata (inheritance)

---

### OpenGraph Object (Next.js OpenGraph Type)

**Purpose**: Open Graph protocol metadata for social media previews

**Fields**:
- `title`: string - Social media preview title
- `description`: string - Social media preview description
- `type`: 'website' | 'article' - Content type
- `url`: string - Canonical URL
- `siteName`: string - Site name (e.g., "Marcus Gollahon")
- `locale`: string - Locale code (e.g., "en_US")
- `images`: Array<OpenGraphImage> - Social preview images

**OpenGraphImage Shape**:
```typescript
{
  url: string,        // Absolute URL to image
  width: number,      // 1200
  height: number,     // 630
  alt: string         // Alt text for accessibility
}
```

**Validation Rules**:
- `images[0].url`: Must be absolute URL (from requirement FR-010)
- `images[0].width`: 1200px (optimal Open Graph size)
- `images[0].height`: 630px (1.91:1 aspect ratio)
- `type`: 'article' for blog posts, 'website' for other pages (from requirement FR-001)

---

### Twitter Object (Next.js Twitter Type)

**Purpose**: Twitter Card metadata for Twitter previews

**Fields**:
- `card`: 'summary_large_image' - Twitter card type
- `site`: string - Twitter handle (e.g., "@marcusgoll")
- `creator`: string - Content creator handle (e.g., "@marcusgoll")
- `title`: string - Twitter card title
- `description`: string - Twitter card description
- `images`: Array<string> - Array of image URLs (absolute)

**Validation Rules**:
- `card`: Must be 'summary_large_image' (from requirement FR-008)
- `site`, `creator`: Must start with '@' (Twitter handle format)
- `images[0]`: Must be absolute URL, 1200x630px recommended (from requirement FR-008)

---

### OG Image Asset

**Purpose**: Static image file for social media previews

**Properties**:
- `filename`: string - File name (e.g., "og-default.jpg", "og-aviation.jpg")
- `dimensions`: {width: 1200, height: 630} - Pixel dimensions (1.91:1 ratio)
- `format`: 'jpg' - JPEG format (smaller file size vs PNG)
- `size`: number - File size in bytes (<200KB target)
- `background`: string - Navy 900 (#0F172A) brand color
- `accent`: string - Emerald 600 (#059669) brand color

**Location**: `/public/images/og/*.jpg`

**Usage**: Referenced in `metadata.openGraph.images[0].url` and `metadata.twitter.images[0]`

**Validation Rules**:
- `dimensions`: Exactly 1200x630px (from requirement FR-009)
- `format`: JPEG for optimal compression (from Technical Notes)
- `size`: <200KB for fast loading (from NFR-001)
- `background`, `accent`: Brand colors from constitution.md (Brand Principle #2)

---

## Database Schema

Not applicable - no database changes. Metadata is static, defined in page.tsx files.

---

## API Schemas

Not applicable - no API changes. Metadata is rendered server-side by Next.js framework.

---

## State Shape (Frontend)

Not applicable - metadata is server-rendered, no client state. Social platforms fetch metadata server-side during link scraping.
