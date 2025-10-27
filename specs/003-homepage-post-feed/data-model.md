# Data Model: 003-homepage-post-feed

## Entities

### Post (Existing - No Changes)

**Purpose**: Represents a blog post with metadata, content, and track categorization

**Fields** (from `lib/posts.ts:9-30`):
- `id`: string (unique identifier)
- `uuid`: string (universal unique identifier)
- `title`: string (post title)
- `slug`: string (URL-friendly identifier)
- `html`: string (post content)
- `excerpt`: string (short description)
- `feature_image`: string | null (featured image URL)
- `featured`: boolean (⭐ **Used by this feature** for featured posts section)
- `visibility`: string (public/private)
- `created_at`: string (ISO timestamp)
- `updated_at`: string (ISO timestamp)
- `published_at`: string (ISO timestamp)
- `custom_excerpt`: string | null (custom excerpt override)
- `meta_title`: string | null (SEO title)
- `meta_description`: string | null (SEO description)
- `primary_author`: Author (main author)
- `primary_tag`: Tag | null (first tag)
- `authors`: Author[] (all authors)
- `tags`: Tag[] (⭐ **Used by this feature** for track filtering)
- `reading_time`: number (estimated minutes)

**Relationships**:
- Has many: Tags (aviation, dev-startup, cross-pollination)
- Belongs to: Primary Author
- Has many: Authors

**Validation Rules**:
- `featured`: boolean (from FR-003: Featured Posts Section)
- `tags`: Must include at least one track tag for proper categorization (from FR-002: Track Filtering)

**State Transitions**: N/A (no state changes for this feature)

---

### Tag (Existing - No Changes)

**Purpose**: Categorizes posts by content track (aviation, dev-startup, cross-pollination)

**Fields** (from `lib/posts.ts:42-49`):
- `id`: string (tag identifier)
- `name`: string (display name)
- `slug`: string (⭐ **Used by this feature** - aviation | dev-startup | cross-pollination)
- `description`: string | null (tag description)
- `visibility`: string (public/private)
- `url`: string (tag archive URL)

**Track Tag Slugs** (from spec.md and codebase):
- `aviation` - Aviation content track
- `dev-startup` - Dev/Startup content track
- `cross-pollination` - Hybrid content track

---

## Client-Side State (New)

### PostFeedState (Component State)

**Purpose**: Manages client-side filtering and pagination state for post feed

**State Shape**:
```typescript
interface PostFeedState {
  // View mode: dual-track (default) or unified feed
  view: 'dual-track' | 'unified';

  // Active filter: null (all), 'aviation', 'dev-startup', 'cross-pollination'
  activeTrack: string | null;

  // Pagination state
  displayedPosts: Post[];
  allPosts: Post[];
  hasMore: boolean;
  isLoading: boolean;

  // Featured posts (server-rendered, cached client-side)
  featuredPosts: Post[];
}
```

**State Transitions**:
- Initial Load → `view: 'dual-track'`, `activeTrack: null`, `displayedPosts: first 6`
- Filter Selection → Update `activeTrack`, filter `displayedPosts`, update URL params
- Load More Click → `isLoading: true` → Append next 6 to `displayedPosts` → `isLoading: false`
- View Toggle → Switch between `dual-track` and `unified`, update URL params

---

## URL State (Query Parameters)

**Purpose**: Enable shareable/bookmarkable filter states

**Parameters**:
```typescript
interface URLState {
  view?: 'unified';        // Optional: defaults to 'dual-track' if absent
  track?: string;          // Optional: 'aviation' | 'dev-startup' | 'cross-pollination' | 'all'
}
```

**Examples**:
- Default (dual-track): `/` (no params)
- Unified view: `/?view=unified`
- Aviation filter: `/?track=aviation`
- Unified + Aviation: `/?view=unified&track=aviation`

---

## Database Schema (No Changes)

No database migrations required. This feature uses existing Post and Tag data.

**Existing Schema**:
- Posts stored as MDX files in `content/posts/` directory
- Frontmatter includes: `title`, `date`, `excerpt`, `image`, `tags`, `featured`
- Read via `lib/posts.ts` functions: `getAllPosts()`, `getPostsByTag()`

---

## API Schemas (No New Endpoints)

**Existing Endpoints** (file-system based, via Next.js):
- `getAllPosts(limit)` - Fetch all posts sorted by date
- `getPostsByTag(tagSlug, limit)` - Fetch posts filtered by tag
- `getPrimaryTrack(tags)` - Determine primary track from tag list

**No New API Routes**: All data fetching uses existing `lib/posts.ts` functions.

---

## Data Flow

### Server-Side Rendering (Initial Load)
1. `app/page.tsx` calls `getPostsByTag('aviation', 3)` and `getPostsByTag('dev-startup', 3)`
2. Filter posts where `featured: true` for FeaturedPostsSection
3. Exclude featured posts from regular feed (no duplicates)
4. Render initial 6 posts + up to 2 featured posts
5. Pass remaining posts as JSON to client for pagination

### Client-Side Filtering
1. User selects track filter → Update URL params
2. Filter `allPosts` array by selected track slug
3. Re-render PostGrid with filtered results
4. Reset pagination (back to first 6 posts)

### Client-Side Pagination
1. User clicks "Load More" → Set `isLoading: true`
2. Slice next 6 posts from `allPosts` array
3. Append to `displayedPosts`
4. Update `hasMore` flag if more posts remain
5. Set `isLoading: false`

---

## Performance Considerations

**From NFR-001**:
- Initial server-rendered posts: 6 (3 aviation + 3 dev-startup) + 2 featured = 8 total max
- Client-side posts cached: All remaining posts (estimated 20-50 posts)
- Memory footprint: ~50 posts × 2KB per post = ~100KB (acceptable)
- ISR revalidation: 60 seconds (maintains fresh content without over-fetching)

**Optimization**:
- Use Next.js Image component for feature_image optimization
- Lazy load additional posts only when "Load More" clicked
- Pre-fetch featured posts server-side for optimal LCP
