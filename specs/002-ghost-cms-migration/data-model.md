# Data Model: ghost-cms-migration

## Entities

### GhostPost (External - Ghost CMS)

**Purpose**: Blog post content managed in Ghost CMS, fetched via Content API

**Fields** (from lib/ghost.ts:11-40):
- `id`: string (PK from Ghost)
- `uuid`: string (unique identifier)
- `title`: string (post title)
- `slug`: string (URL-friendly identifier)
- `html`: string (post content HTML)
- `excerpt`: string (post summary)
- `feature_image`: string | null (featured image URL from Ghost CDN)
- `featured`: boolean (featured post flag)
- `published_at`: string (ISO timestamp)
- `reading_time`: number (estimated minutes)
- `primary_author`: GhostAuthor (author details)
- `primary_tag`: GhostTag | null (first tag)
- `tags`: GhostTag[] (all tags including track + category)

**Validation Rules**:
- `tags` must include at least one track tag (`aviation`, `dev-startup`, or `cross-pollination`) - enforced via getPrimaryTrack validation (FR-015)
- `slug` must be unique - enforced by Ghost
- `published_at` required for public posts - enforced by Ghost
- `feature_image` should exist for all posts - soft requirement (UX best practice)

**State Transitions**:
- Draft → Published (via Ghost Admin)
- Published → Updated (on edit, updated_at changes)
- Published → Unpublished (removes from Content API results)

---

### GhostTag (External - Ghost CMS)

**Purpose**: Content categorization for dual-track organization

**Fields** (from lib/ghost.ts:56-72):
- `id`: string (PK from Ghost)
- `name`: string (display name)
- `slug`: string (URL-friendly identifier)
- `description`: string | null (tag description)
- `feature_image`: string | null (tag header image)
- `visibility`: string (public | internal)

**Tag Hierarchy**:
- **Primary Tags** (content tracks): `aviation`, `dev-startup`, `cross-pollination`
- **Secondary Tags** (categories within tracks):
  - Aviation: `flight-training`, `cfi-resources`, `career-path`
  - Dev/Startup: `building-in-public`, `systematic-development`, `tutorials`

**Validation Rules**:
- Primary tags must have unique slugs matching spec (FR-001) - enforced by Ghost
- Tag colors configured in Ghost Admin: Aviation (#0EA5E9), Dev/Startup (#059669) - manual configuration (FR-009)

---

### GhostAuthor (External - Ghost CMS)

**Purpose**: Author metadata (single author: Marcus)

**Fields** (from lib/ghost.ts:42-54):
- `id`: string (PK from Ghost)
- `name`: string (author name)
- `slug`: string (URL-friendly identifier)
- `profile_image`: string | null (author photo)
- `bio`: string | null (author bio)
- `website`: string | null (author website URL)

**Validation Rules**:
- Single author site - `name` always "Marcus Gollahon" (Assumption #6)
- `profile_image` should be professional headshot (brand requirement)

---

## Frontend State Types

### PostCardProps (Component State)

**Purpose**: Props for PostCard component display

```typescript
interface PostCardProps {
  post: GhostPost
  track?: 'aviation' | 'dev-startup' | 'cross-pollination' | null
}
```

**Derivation**: `track` computed via `getPrimaryTrack(post.tags)` helper (lib/ghost.ts:898-903)

---

### HubPageData (Page State)

**Purpose**: Data shape for Aviation/Dev-Startup hub pages

```typescript
interface HubPageData {
  trackPosts: GhostPost[]        // All posts in track
  categorizedPosts: {
    [categorySlug: string]: GhostPost[]  // Posts grouped by secondary tag
  }
  totalCount: number
}
```

**Example** (Aviation hub):
```typescript
{
  trackPosts: [...],  // All aviation posts
  categorizedPosts: {
    'flight-training': [...],  // 5 most recent
    'cfi-resources': [...],    // 5 most recent
    'career-path': [...]       // 5 most recent
  },
  totalCount: 35
}
```

---

## Database Schema

**No database required** - This feature uses Ghost CMS as external data source (headless CMS architecture).

Ghost CMS manages its own database. Next.js frontend fetches data via read-only Content API.

---

## API Schemas

### Ghost Content API Endpoints (External)

Accessed via `@tryghost/content-api` client (lib/ghost.ts):

**Fetch Posts by Tag**:
```typescript
// Input
getPostsByTag(tagSlug: string, limit: number = 15)

// Ghost API Request
GET /ghost/api/v5.0/content/posts/?filter=tag:{tagSlug}&limit={limit}&include=tags,authors

// Output
Promise<GhostPost[]>
```

**Fetch Single Post**:
```typescript
// Input
getPostBySlug(slug: string)

// Ghost API Request
GET /ghost/api/v5.0/content/posts/slug/{slug}/?include=tags,authors

// Output
Promise<GhostPost>
```

**Fetch All Tags**:
```typescript
// Input
getTags()

// Ghost API Request
GET /ghost/api/v5.0/content/tags/?limit=all

// Output
Promise<GhostTag[]>
```

---

## Client-Side Analytics Events

### Custom GA4 Events (lib/analytics.ts)

**Event**: `content_track_click`
```typescript
{
  track: 'aviation' | 'dev-startup',
  location: 'homepage' | 'hub-page' | 'blog-post'
}
```

**Event**: `newsletter_signup`
```typescript
{
  track: 'aviation' | 'dev-startup' | 'both',
  location: 'homepage' | 'hub-page' | 'blog-post'
}
```

**Event**: `external_link_click`
```typescript
{
  destination: string,  // e.g., 'cfipros.com'
  location: string      // where link was clicked
}
```

**Event**: `page_view` (enhanced)
```typescript
{
  page_path: string,
  track?: 'aviation' | 'dev-startup' | 'general'
}
```

---

## Data Flow

```mermaid
graph TD
    A[Ghost Admin] -->|Publish Post| B[Ghost CMS Database]
    B -->|Content API| C[Ghost Content API]
    C -->|@tryghost/content-api| D[lib/ghost.ts]
    D -->|getPostsByTag| E[Aviation Hub Page]
    D -->|getPostsByTag| F[Dev/Startup Hub Page]
    D -->|getPostBySlug| G[Single Post Page]
    E -->|ISR 60s| H[Vercel Edge Cache]
    F -->|ISR 60s| H
    G -->|ISR 60s| H
    H -->|Serve| I[User Browser]
    I -->|GA4 Events| J[Google Analytics]
```

**ISR Flow**:
1. User requests page (e.g., `/aviation`)
2. Vercel checks cache (60s TTL)
3. If fresh: Serve cached HTML
4. If stale: Serve stale HTML + regenerate in background
5. Next request gets fresh data

---

## Relationships

**GhostPost** has many **GhostTag** (many-to-many)
- Managed by Ghost CMS
- Accessed via `post.tags` array

**GhostPost** belongs to **GhostAuthor** (many-to-one)
- Single author site (Marcus)
- Accessed via `post.primary_author`

**Track Detection** (computed relationship):
- `getPrimaryTrack(post.tags)` determines content track
- Checks for `aviation`, `dev-startup`, or `cross-pollination` in tags array
- Returns first match or null

---

## Migration Considerations

**No database migration required** - Ghost CMS is external system.

**Content migration**:
- Tag 35 existing aviation posts with `aviation` + category tags (manual in Ghost Admin)
- Create Ghost navigation structure (manual in Ghost Admin)
- Configure Ghost site settings (manual in Ghost Admin)

See migration steps in `docs/GHOST_NEXTJS_IMPLEMENTATION.md:27-153`
