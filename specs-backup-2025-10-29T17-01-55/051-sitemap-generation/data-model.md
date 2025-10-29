# Data Model: sitemap-generation

## Overview

This feature generates an XML sitemap from existing data sources. It does not introduce new database entities or schema changes.

**Data Sources**:
1. MDX blog posts (filesystem: `content/posts/*.mdx`)
2. Static routes (hardcoded: `/`, `/blog`)
3. Environment variables (`NEXT_PUBLIC_SITE_URL`)

---

## Entities

### Sitemap Entry (Runtime Only, Not Persisted)

**Purpose**: Represents a single URL in the generated XML sitemap

**Type Definition** (Next.js `MetadataRoute.Sitemap`):
```typescript
type SitemapEntry = {
  url: string              // Full URL (e.g., "https://marcusgoll.com/blog/post-slug")
  lastModified?: string | Date  // ISO 8601 timestamp or Date object
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number        // 0.0 to 1.0 (decimal)
}
```

**Source**: Next.js `MetadataRoute.Sitemap` type from `next/types`

**Lifecycle**:
- Created at build time by `app/sitemap.ts` function
- Returned as array from sitemap function
- Next.js converts to XML and serves at `/sitemap.xml` route
- Not persisted to database or filesystem

**Field Mapping**:
- `url`: Constructed from `NEXT_PUBLIC_SITE_URL` + route path
- `lastModified`: For posts, from MDX `frontmatter.date`; for static pages, current date
- `changeFrequency`: Based on page type (homepage/blog list: daily, posts: weekly)
- `priority`: Based on page type (homepage: 1.0, blog list: 0.9, posts: 0.8)

---

## Data Sources

### MDX Post Frontmatter

**Source**: `content/posts/*.mdx` files
**Access**: Via `getAllPosts()` from `lib/mdx.ts`

**Relevant Fields**:
- `slug`: string (used to construct URL: `/blog/${slug}`)
- `date`: string (ISO 8601, used for `lastModified`)
- `draft`: boolean (posts with `draft: true` excluded in production)

**Example**:
```yaml
---
title: "How to Build a Sitemap"
slug: "build-sitemap"
date: "2025-10-29"
draft: false
tags: ["SEO", "Next.js"]
---
```

**Validation**: Enforced by Zod schema in `lib/mdx-types.ts` (PostFrontmatterSchema)

### Static Routes

**Source**: Hardcoded in `app/sitemap.ts`

**Routes**:
1. Homepage: `/`
2. Blog list: `/blog`

**Properties**:
- `lastModified`: Current date (pages change when new posts added)
- `changeFrequency`: daily
- `priority`: 1.0 (homepage), 0.9 (blog list)

### Environment Configuration

**Source**: `process.env.NEXT_PUBLIC_SITE_URL`

**Default**: `https://marcusgoll.com`
**Usage**: Base URL for all sitemap entries

**Example URLs**:
- `https://marcusgoll.com/`
- `https://marcusgoll.com/blog`
- `https://marcusgoll.com/blog/interactive-mdx-demo`

---

## Database Schema

**Not applicable** - This feature does not use database storage.

All data is:
1. Sourced from filesystem (MDX files) at build time
2. Generated transiently in memory during build
3. Served by Next.js as XML route (no static file)

---

## State Shape

### Build-time Function Return

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts(); // From lib/mdx.ts
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.frontmatter.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
```

---

## Data Validation

### Input Validation

**MDX Frontmatter**:
- Validated by `PostFrontmatterSchema` (Zod) in `lib/mdx.ts`
- `date` field required (ISO 8601 format)
- `slug` field required (matches filename)
- Invalid posts throw error during build (fails fast)

**Environment Variables**:
- `NEXT_PUBLIC_SITE_URL`: Optional (fallback to production URL)
- If missing, defaults to `https://marcusgoll.com`

### Output Validation

**XML Sitemap Protocol**:
- Next.js automatically generates valid XML from returned array
- Schema: `http://www.sitemaps.org/schemas/sitemap/0.9`
- Validated against XML sitemap protocol 0.9 specification

**Build-time Validation**:
- TypeScript ensures `MetadataRoute.Sitemap` type compliance
- Invalid entries caught at build time (TypeScript compilation fails)
- Next.js build fails if sitemap function throws error

---

## Performance Considerations

**Build-time Generation**:
- Sitemap generated once at build time (not on every request)
- No runtime performance impact
- Build time increase: <5 seconds for 50 posts (NFR-001)

**Memory Usage**:
- Minimal: Array of ~50-100 entries (current post count)
- Each entry: ~200 bytes (URL + metadata)
- Total: <20KB in memory during build

**Scalability**:
- Current: 5-10 posts → <1KB sitemap XML
- Target: 50 posts → <10KB sitemap XML
- Sitemap protocol limit: 50,000 URLs (well within capacity)
- If >50K URLs needed: Sitemap index pattern (future, not needed for MVP)

---

## Migration Plan

**Not applicable** - No database migrations required.

**Deployment Changes**:
1. Add `app/sitemap.ts` file (new route)
2. Delete `lib/generate-sitemap.ts` (deprecated)
3. Remove `public/sitemap.xml` (replaced by Next.js route)
4. Keep `public/robots.txt` unchanged (already references `/sitemap.xml`)

**Rollback Plan**:
- If Next.js sitemap fails, restore `lib/generate-sitemap.ts`
- Manually run script to regenerate `public/sitemap.xml`
- Git history preserves old implementation
