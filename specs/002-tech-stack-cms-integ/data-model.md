# Data Model: tech-stack-cms-integ

Generated: 2025-10-21
Phase: Planning (Phase 1)

---

## Overview

This feature uses a **file-based content model** rather than a database schema. Blog posts are stored as MDX files in the filesystem with YAML frontmatter for metadata. No database tables are required for MVP.

---

## Entities

### BlogPost (MDX File)

**Purpose**: Individual blog post stored as MDX file with YAML frontmatter

**File Location**: `content/posts/[slug].mdx`

**Frontmatter Fields** (YAML):

```yaml
---
title: string           # Post title (required)
slug: string            # URL-friendly identifier (required, must match filename)
date: string            # ISO 8601 date (required, e.g., "2025-10-21")
excerpt: string         # Post summary/description (required, <200 chars)
author: string          # Author name (required, default: "Marcus Gollahon")
tags: string[]          # Array of tags (required, min 1 tag)
featuredImage: string   # Path to hero image (optional, e.g., "/images/posts/slug/hero.jpg")
publishedAt: string     # ISO 8601 date for scheduling (optional)
draft: boolean          # Hide from production (optional, default: false)
readingTime: number     # Calculated field (optional, auto-generated)
---
```

**Content Body**: MDX (Markdown + JSX)

**Example File** (`content/posts/intro-to-mdx.mdx`):
```mdx
---
title: "Introduction to MDX for Blog Posts"
slug: "intro-to-mdx"
date: "2025-10-21"
excerpt: "Learn how to write interactive blog posts using MDX and React components."
author: "Marcus Gollahon"
tags: ["dev", "tutorial", "mdx"]
featuredImage: "/images/posts/intro-to-mdx/hero.jpg"
publishedAt: "2025-10-21T10:00:00Z"
draft: false
---

# Introduction

This is my first MDX blog post with **Markdown** and React components!

<Callout type="info">
  MDX lets you embed React components directly in your content.
</Callout>

## Code Example

\`\`\`typescript
const greeting = "Hello, MDX!";
console.log(greeting);
\`\`\`
```

**Validation Rules**:
- `title`: Required, 1-200 characters (from FR-002)
- `slug`: Required, must match filename, lowercase alphanumeric + hyphens only
- `date`: Required, valid ISO 8601 date (from FR-002)
- `excerpt`: Required, 20-300 characters (from FR-002)
- `author`: Required, non-empty string (from FR-002)
- `tags`: Required array, min 1 tag, max 10 tags (from FR-014)
- `featuredImage`: Optional, must be valid path if provided
- `publishedAt`: Optional, must be ISO 8601 date if provided (for US7)
- `draft`: Optional boolean, default false

**State Transitions** (Publish Lifecycle):
- **Draft** (`draft: true`) → Not visible on site, excluded from build
- **Scheduled** (`publishedAt` in future) → Not visible until publish date
- **Published** (`draft: false`, `publishedAt` ≤ now) → Live on site
- **Archived** (move to `content/posts/archive/`) → Removed from index

**Relationships**:
- Has many: Tags (via `tags` array in frontmatter)
- Belongs to: Author (via `author` field, no separate author entity in MVP)

---

### PostMetadata (TypeScript Interface)

**Purpose**: Type-safe representation of parsed frontmatter

**TypeScript Definition** (from `lib/mdx-types.ts`):

```typescript
import { z } from 'zod';

// Zod schema for validation
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().datetime(),
  excerpt: z.string().min(20).max(300),
  author: z.string().min(1),
  tags: z.array(z.string()).min(1).max(10),
  featuredImage: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  draft: z.boolean().default(false),
  readingTime: z.number().optional(),
});

// TypeScript type inferred from schema
export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

// Full post data (frontmatter + content)
export interface PostData {
  frontmatter: PostFrontmatter;
  content: string;           // Raw MDX content
  slug: string;              // Derived from filename
  compiledContent?: MDXContent;  // Compiled JSX (for rendering)
}
```

**Validation**: Zod schema enforced at build time (throws error if invalid)

---

### Tag (Derived Entity)

**Purpose**: Category/topic for organizing posts (no separate storage)

**Derived From**: Extracted from all post frontmatter `tags` arrays

**TypeScript Definition**:

```typescript
export interface TagData {
  slug: string;          // Lowercase tag identifier (e.g., "aviation")
  displayName: string;   // Human-readable name (e.g., "Aviation")
  postCount: number;     // Number of posts with this tag
  posts: PostData[];     // Array of posts with this tag (for tag archive pages)
}
```

**Example Tags** (from spec.md and research):
- `aviation` (display: "Aviation")
- `dev` (display: "Development")
- `tutorial` (display: "Tutorials")
- `flight-training` (display: "Flight Training")
- `cfi-resources` (display: "CFI Resources")

**Tag Extraction Logic**:
```typescript
function getAllTags(posts: PostData[]): TagData[] {
  const tagMap = new Map<string, TagData>();

  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');

      if (!tagMap.has(tagSlug)) {
        tagMap.set(tagSlug, {
          slug: tagSlug,
          displayName: tag,
          postCount: 0,
          posts: []
        });
      }

      const tagData = tagMap.get(tagSlug)!;
      tagData.postCount++;
      tagData.posts.push(post);
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => b.postCount - a.postCount);
}
```

**Relationships**:
- Many-to-many with BlogPost (via frontmatter `tags` array)

---

## File System Structure

```
content/
├── posts/
│   ├── intro-to-mdx.mdx
│   ├── flight-training-101.mdx
│   ├── building-in-public.mdx
│   └── archive/                    # Archived/unpublished posts
│       └── old-post.mdx

public/
└── images/
    └── posts/
        ├── intro-to-mdx/
        │   ├── hero.jpg
        │   └── diagram.png
        ├── flight-training-101/
        │   └── hero.jpg
        └── building-in-public/
            └── hero.jpg
```

**File Naming Convention**:
- MDX files: `[slug].mdx` (must match frontmatter `slug` field)
- Images: `public/images/posts/[slug]/[image-name].ext`

**Reason for Structure**:
- Simple 1:1 mapping (one file = one post)
- Easy to find and edit posts
- Git-friendly (clear diffs, easy rollback)
- Next.js App Router compatible

---

## Data Flow Diagram

```mermaid
graph TD
    A[MDX Files in content/posts/] --> B[lib/mdx.ts: Parse Frontmatter]
    B --> C[Zod Validation]
    C -->|Valid| D[PostData Objects]
    C -->|Invalid| E[Build Error]
    D --> F[Next.js Static Generation]
    F --> G[app/blog/page.tsx: Blog Index]
    F --> H[app/blog/[slug]/page.tsx: Post Page]
    F --> I[app/blog/tag/[tag]/page.tsx: Tag Archive]
    D --> J[lib/generate-rss.ts: RSS Feed]
    D --> K[lib/generate-sitemap.ts: Sitemap]
    J --> L[public/rss.xml]
    K --> M[public/sitemap.xml]
```

---

## Database Schema (N/A)

**No database tables required** for blog content in MVP.

**Future Extensions** (Post-MVP):
- Comments: Prisma table with foreign key to post slug
- Analytics: Post views/engagement tracking
- Newsletter: Subscriber emails (separate from blog content)

**Current Prisma Schema**: Unchanged (no blog-related tables)

---

## API Schemas

### Internal API (TypeScript Functions)

No external HTTP API for blog content. All data fetched via TypeScript functions at build time.

**Key Functions** (in `lib/mdx.ts`):

```typescript
/**
 * Get all published posts, sorted by date descending
 */
export async function getAllPosts(includesDrafts = false): Promise<PostData[]>;

/**
 * Get single post by slug
 * @throws Error if post not found or invalid
 */
export async function getPostBySlug(slug: string): Promise<PostData>;

/**
 * Get posts with specific tag
 */
export async function getPostsByTag(tag: string): Promise<PostData[]>;

/**
 * Get all unique tags with post counts
 */
export async function getAllTags(): Promise<TagData[]>;

/**
 * Search posts by title, excerpt, or tags
 */
export function searchPosts(query: string, posts: PostData[]): PostData[];
```

### RSS Feed Schema (XML)

**Output**: `public/rss.xml`

**Format**: RSS 2.0

**Example**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Marcus Gollahon - Blog</title>
    <description>Aviation, Development, Education & Startups</description>
    <link>https://marcusgoll.com/blog</link>
    <item>
      <title>Introduction to MDX for Blog Posts</title>
      <link>https://marcusgoll.com/blog/intro-to-mdx</link>
      <description>Learn how to write interactive blog posts using MDX...</description>
      <pubDate>Thu, 21 Oct 2025 10:00:00 GMT</pubDate>
      <author>Marcus Gollahon</author>
      <category>dev</category>
      <category>tutorial</category>
      <guid>https://marcusgoll.com/blog/intro-to-mdx</guid>
    </item>
  </channel>
</rss>
```

**Mapping**:
- `<title>` → `frontmatter.title`
- `<link>` → `https://marcusgoll.com/blog/${frontmatter.slug}`
- `<description>` → `frontmatter.excerpt`
- `<pubDate>` → `frontmatter.date` (converted to RFC 822)
- `<author>` → `frontmatter.author`
- `<category>` → Each tag in `frontmatter.tags`
- `<guid>` → Post URL (same as link)

---

## State Shape (Frontend)

### Blog Index Page State

```typescript
interface BlogIndexState {
  posts: PostData[];
  selectedTag: string | null;
  searchQuery: string;
  filteredPosts: PostData[];
  loading: boolean;
  error: Error | null;
}
```

### Blog Post Page State

```typescript
interface BlogPostState {
  post: PostData | null;
  relatedPosts: PostData[];
  tableOfContents: ToCItem[];
  loading: boolean;
  error: Error | null;
}

interface ToCItem {
  id: string;
  title: string;
  level: number;  // h2 = 2, h3 = 3
}
```

### Tag Archive Page State

```typescript
interface TagArchiveState {
  tag: TagData | null;
  posts: PostData[];
  loading: boolean;
  error: Error | null;
}
```

**Note**: All state is server-side (static generation). No client-side state management needed in MVP.

---

## Migration Mapping (Ghost → MDX)

### Ghost Post Fields → MDX Frontmatter

| Ghost Field | MDX Frontmatter | Transformation |
|-------------|-----------------|----------------|
| `title` | `title` | Direct copy |
| `slug` | `slug` | Direct copy |
| `published_at` | `date` | Convert to ISO 8601 |
| `custom_excerpt` or `excerpt` | `excerpt` | Direct copy or generate from content |
| `primary_author.name` | `author` | Direct copy |
| `tags[].name` | `tags` | Array of tag names |
| `feature_image` | `featuredImage` | Download image, update path |
| `html` | MDX content | Convert HTML to Markdown using turndown.js |
| `meta_title` | N/A | Use `title` for meta tags |
| `meta_description` | N/A | Use `excerpt` for meta tags |

### Ghost API Response Example

```json
{
  "id": "6a8f2d4b",
  "title": "Introduction to MDX",
  "slug": "intro-to-mdx",
  "html": "<p>This is content...</p>",
  "excerpt": "Learn how to write...",
  "published_at": "2025-10-21T10:00:00.000Z",
  "custom_excerpt": null,
  "feature_image": "https://ghost.example.com/content/images/hero.jpg",
  "primary_author": {
    "name": "Marcus Gollahon"
  },
  "tags": [
    { "name": "Dev" },
    { "name": "Tutorial" }
  ]
}
```

### Resulting MDX File

```mdx
---
title: "Introduction to MDX"
slug: "intro-to-mdx"
date: "2025-10-21T10:00:00Z"
excerpt: "Learn how to write..."
author: "Marcus Gollahon"
tags: ["dev", "tutorial"]
featuredImage: "/images/posts/intro-to-mdx/hero.jpg"
---

This is content...

(Converted from HTML to Markdown)
```

---

## Validation & Error Handling

### Build-Time Validation

**Zod Schema Validation**:
- Runs during `getAllPosts()` in `lib/mdx.ts`
- Throws error if frontmatter invalid
- Fails Next.js build (prevents invalid content from deploying)

**Error Examples**:
```
❌ Error: Invalid frontmatter in intro-to-mdx.mdx
  - title: Required field missing
  - date: Invalid ISO 8601 date format
  - tags: Array must contain at least 1 element
```

### Runtime Error Handling

**Post Not Found**:
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return { title: post.frontmatter.title };
  } catch (error) {
    return { title: 'Post Not Found' };
  }
}
```

**Invalid MDX Syntax**:
- Caught during MDX compilation
- Returns 500 error page with syntax error details
- Spec requirement NFR-008 (line 167)

---

## Performance Considerations

### Static Generation Strategy

**Build Time**:
- All MDX files read and parsed during `next build`
- Pre-render all blog pages as static HTML
- No runtime MDX compilation (fast page loads)

**Incremental Static Regeneration (ISR)**:
```typescript
// app/blog/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

**Estimated Build Time**:
- 50 posts × ~100ms per post = ~5 seconds
- Total build time: <10 seconds (acceptable)

### Image Optimization

**Next.js Image Component**:
- Automatic WebP conversion
- Responsive srcset generation
- Lazy loading
- Size optimization

**Example Usage in MDX**:
```mdx
![Hero Image](/images/posts/my-post/hero.jpg)
```

**Rendered HTML**:
```html
<img
  src="/_next/image?url=/images/posts/my-post/hero.jpg&w=1920&q=75"
  srcset="..."
  alt="Hero Image"
  loading="lazy"
/>
```

---

## Summary

- **No database tables**: File-based content model
- **3 core entities**: BlogPost (MDX file), PostMetadata (TypeScript), Tag (derived)
- **Zod validation**: Build-time safety
- **Static generation**: Pre-render all pages for performance
- **Migration mapping**: Clear Ghost → MDX transformation rules

**Next**: Generate quickstart.md with integration scenarios
