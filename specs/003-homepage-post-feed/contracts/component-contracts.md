# Component Contracts: 003-homepage-post-feed

This document defines the interfaces and contracts for all new components in this feature.

---

## FeaturedPostsSection Component

**Type**: Server Component
**File**: `components/home/FeaturedPostsSection.tsx`

### Props Interface

```typescript
interface FeaturedPostsSectionProps {
  featuredPosts: Post[];  // Array of posts where featured: true (max 2)
}
```

### Contract

**Input**:
- `featuredPosts`: Array of 0-2 Post objects with `featured: true`

**Output**:
- Renders hero-style cards for featured posts in 2-column grid (desktop)
- Renders single column on mobile
- Returns `null` if `featuredPosts.length === 0` (hidden gracefully)

**Guarantees**:
- Featured posts never duplicated in regular feed
- Section hidden when no featured posts
- Hero images optimized via Next.js Image component
- Semantic HTML (`<section>`, `<article>`)

---

## PostFeedFilter Component

**Type**: Client Component
**File**: `components/home/PostFeedFilter.tsx`

### Props Interface

```typescript
interface PostFeedFilterProps {
  // No props - reads URL params internally via useSearchParams()
}
```

### State Interface

```typescript
interface PostFeedFilterState {
  activeTrack: 'aviation' | 'dev-startup' | 'cross-pollination' | 'all' | null;
}
```

### Contract

**Input**:
- Reads URL search param: `?track=aviation` | `?track=dev-startup` | `?track=cross-pollination` | `?track=all`
- Defaults to `null` (show all, dual-track view) if no param

**Output**:
- Renders filter button group: Aviation, Dev/Startup, Cross-pollination, All
- Active filter highlighted with Emerald 600 background
- Updates URL on filter click (no page reload)

**Behavior**:
- Click filter → Update URL → Parent component re-renders with new filter
- URL update triggers browser history (back button works)
- Active state read from URL (not component state)

**Guarantees**:
- Keyboard accessible (Tab, Enter to activate)
- Focus states visible (WCAG 2.1 AA)
- ARIA labels for screen readers
- URL sanitized (reject invalid track values)

---

## UnifiedPostFeed Component

**Type**: Client Component
**File**: `components/home/UnifiedPostFeed.tsx`

### Props Interface

```typescript
interface UnifiedPostFeedProps {
  initialPosts: Post[];  // First 6 posts (server-rendered)
  allPosts: Post[];      // All posts for client-side pagination
  view: 'dual-track' | 'unified';  // View mode from URL params
}
```

### State Interface

```typescript
interface UnifiedPostFeedState {
  displayedPosts: Post[];  // Currently visible posts
  hasMore: boolean;        // More posts available
  isLoading: boolean;      // Loading state for "Load More"
  activeTrack: string | null;  // Current filter from URL
}
```

### Contract

**Input**:
- `initialPosts`: Array of 6 posts (3 aviation + 3 dev-startup for dual-track, or 6 chronological for unified)
- `allPosts`: Array of all posts (for client-side filtering and pagination)
- `view`: 'dual-track' | 'unified' (from URL param `?view=unified`)

**Output**:
- Renders `PostGrid` with filtered and paginated posts
- Renders `LoadMoreButton` when `hasMore: true`
- Renders empty state when no posts match filter

**Behavior**:
- Initial render: Display `initialPosts`
- Filter change: Filter `allPosts` by track, reset pagination to first 6
- "Load More" click: Append next 6 posts to `displayedPosts`, set `isLoading: true`
- After load: Set `isLoading: false`, update `hasMore` flag

**Guarantees**:
- Scroll position maintained after "Load More"
- No duplicate posts displayed
- Featured posts excluded from regular feed
- Empty state shown when `displayedPosts.length === 0`
- Client-side filtering completes <100ms (no network delay)

---

## LoadMoreButton Component

**Type**: Client Component
**File**: `components/home/LoadMoreButton.tsx`

### Props Interface

```typescript
interface LoadMoreButtonProps {
  onClick: () => void;      // Callback to load more posts
  isLoading: boolean;       // Loading state (show spinner)
  hasMore: boolean;         // More posts available (hide if false)
}
```

### Contract

**Input**:
- `onClick`: Function to call when button clicked
- `isLoading`: `true` during fetch operation
- `hasMore`: `false` when all posts loaded

**Output**:
- Renders primary Emerald 600 button with "Load More" text
- Shows loading spinner when `isLoading: true`
- Hidden when `hasMore: false`

**Behavior**:
- Click → Call `onClick()` → Parent sets `isLoading: true`
- Disabled during loading (prevent double-click)
- Track analytics: `trackContentTrackClick({ track: 'general', location: 'homepage-load-more' })`

**Guarantees**:
- Keyboard accessible (Tab, Enter)
- Focus state visible
- Loading state announced to screen readers (ARIA live region)
- Centered below post grid (Flexbox/Grid centering)

---

## Data Flow Contracts

### Server → Client Data Handoff

**Homepage Server Component** (`app/page.tsx`):
```typescript
// Server-side data fetch
const allPosts = await getAllPosts();
const featuredPosts = allPosts.filter(post => post.featured).slice(0, 2);
const regularPosts = allPosts.filter(post => !post.featured);
const aviationPosts = regularPosts.filter(post => post.tags.some(tag => tag.slug === 'aviation')).slice(0, 3);
const devStartupPosts = regularPosts.filter(post => post.tags.some(tag => tag.slug === 'dev-startup')).slice(0, 3);

// Pass to client components
<FeaturedPostsSection featuredPosts={featuredPosts} />
<UnifiedPostFeed
  initialPosts={[...aviationPosts, ...devStartupPosts]}
  allPosts={regularPosts}
  view={view}
/>
```

**Contract Guarantees**:
- `featuredPosts` never includes posts from `regularPosts` (no duplicates)
- `allPosts` sorted by `published_at` DESC (newest first)
- `initialPosts` limited to 6 posts (performance)

---

### Client-Side Filter Logic

**Filter Function** (in `UnifiedPostFeed`):
```typescript
function filterPostsByTrack(posts: Post[], track: string | null): Post[] {
  if (!track || track === 'all') {
    return posts;
  }

  return posts.filter(post =>
    post.tags.some(tag => tag.slug === track)
  );
}
```

**Contract Guarantees**:
- Null or 'all' track returns all posts
- Invalid track values rejected (sanitized)
- Filter completes synchronously (no async delay)

---

### Client-Side Pagination Logic

**Pagination Function** (in `UnifiedPostFeed`):
```typescript
function loadMore(currentPosts: Post[], allPosts: Post[], pageSize: number = 6): Post[] {
  const startIndex = currentPosts.length;
  const endIndex = startIndex + pageSize;
  return [...currentPosts, ...allPosts.slice(startIndex, endIndex)];
}
```

**Contract Guarantees**:
- Loads exactly 6 posts per click (or remaining if <6)
- Maintains existing posts (appends, doesn't replace)
- Returns copy of array (immutable)

---

## URL State Contract

### URL Parameter Schema

```typescript
interface URLParams {
  view?: 'unified';  // Optional: defaults to 'dual-track' if absent
  track?: 'aviation' | 'dev-startup' | 'cross-pollination' | 'all';  // Optional
}
```

### URL Examples

- Default (dual-track, all posts): `/`
- Unified view: `/?view=unified`
- Aviation filter: `/?track=aviation`
- Unified + Aviation: `/?view=unified&track=aviation`
- Invalid param: `/?track=invalid` → Sanitized to `/?track=all`

### Reading URL Params (Client Component)

```typescript
'use client';
import { useSearchParams } from 'next/navigation';

function MyComponent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'unified' ? 'unified' : 'dual-track';
  const track = searchParams.get('track') || null;

  // Sanitize track value
  const validTracks = ['aviation', 'dev-startup', 'cross-pollination', 'all'];
  const sanitizedTrack = track && validTracks.includes(track) ? track : null;

  // Use sanitized values...
}
```

### Writing URL Params (Client Component)

```typescript
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(track: string | null) {
    const params = new URLSearchParams(searchParams);

    if (track && track !== 'all') {
      params.set('track', track);
    } else {
      params.delete('track');
    }

    router.push(`/?${params.toString()}`);
  }
}
```

**Contract Guarantees**:
- URL updates don't trigger full page reload
- Browser history works (back/forward buttons)
- URL is shareable/bookmarkable
- Invalid params sanitized or ignored

---

## Analytics Contract

### Events to Track

**Filter Selection**:
```typescript
trackContentTrackClick({
  track: 'aviation' | 'dev-startup' | 'cross-pollination' | 'general',
  location: 'homepage-filter'
});
```

**Load More Click**:
```typescript
trackContentTrackClick({
  track: 'general',
  location: 'homepage-load-more'
});
```

**Featured Post Click** (via existing PostCard analytics):
```typescript
// Tracked automatically when PostCard clicked
// Location: 'featured-section'
```

**View Mode Toggle**:
```typescript
trackContentTrackClick({
  track: 'general',
  location: 'homepage-view-toggle',
  metadata: { view: 'unified' | 'dual-track' }
});
```

---

## Error Handling Contract

### Client Component Error Boundaries

**Wrap client components** in error boundaries:
```typescript
<ErrorBoundary fallback={<div>Failed to load post feed. Please refresh.</div>}>
  <UnifiedPostFeed {...props} />
</ErrorBoundary>
```

### Graceful Degradation

**If JavaScript fails**:
- Server-rendered dual-track view still visible
- Initial 6 posts displayed
- Filter and pagination unavailable (progressive enhancement)

**If filtering fails**:
- Fall back to showing all posts
- Log error to console
- Display error message to user

**If pagination fails**:
- Hide "Load More" button
- Show all remaining posts (if <50 total)
- Log error to console

---

## Accessibility Contract (WCAG 2.1 AA)

### Keyboard Navigation

- **Tab**: Navigate between filter buttons and "Load More" button
- **Enter/Space**: Activate filter or load more posts
- **Escape**: Clear active filter (return to "All")

### Screen Reader Announcements

- **Filter change**: "Filtered posts by Aviation. Showing X posts."
- **Load more**: "Loading more posts..." → "Loaded X additional posts."
- **Empty state**: "No posts found for selected filter."

### Focus Management

- **Active filter**: Focus remains on filter button after activation
- **Load more**: Focus remains on button during loading
- **After load**: Focus moves to first newly loaded post (optional enhancement)

### Color Contrast

- **Filter buttons**: Active state ≥4.5:1 contrast (Emerald 600 on white)
- **Post text**: ≥4.5:1 contrast (Navy 900 on white)
- **Track badges**: ≥4.5:1 contrast (white on Sky Blue/Emerald)

### Semantic HTML

- `<section>` for featured posts
- `<article>` for individual posts
- `<nav>` for filter buttons (optional)
- `<button>` for interactive elements (not `<div>` with onClick)

---

## Testing Contract

### Unit Tests

**PostFeedFilter**:
- ✅ Renders all filter buttons (Aviation, Dev/Startup, Cross-pollination, All)
- ✅ Highlights active filter based on URL param
- ✅ Updates URL on filter click
- ✅ Sanitizes invalid track values

**UnifiedPostFeed**:
- ✅ Displays initial posts on render
- ✅ Filters posts by track
- ✅ Loads more posts on button click
- ✅ Hides "Load More" when no more posts
- ✅ Shows empty state when no posts match filter

**LoadMoreButton**:
- ✅ Shows loading spinner when `isLoading: true`
- ✅ Hidden when `hasMore: false`
- ✅ Calls `onClick` when clicked
- ✅ Disabled during loading

### Integration Tests

**Full Filter Flow**:
1. Click "Aviation" filter
2. Verify: Only aviation posts displayed
3. Verify: URL updates to `/?track=aviation`
4. Refresh page
5. Verify: Filter state persists (aviation posts still shown)

**Full Pagination Flow**:
1. Load homepage
2. Scroll to bottom
3. Click "Load More"
4. Verify: Next 6 posts appended
5. Verify: Scroll position maintained
6. Verify: Button hidden when all posts loaded

### Accessibility Tests

- ✅ Keyboard navigation (axe-core, Lighthouse)
- ✅ Screen reader compatibility (NVDA/JAWS)
- ✅ Color contrast (WCAG 2.1 AA)
- ✅ Focus states visible
- ✅ ARIA labels correct

---

## Performance Contract

### Bundle Size

- **FeaturedPostsSection**: ~3KB uncompressed
- **PostFeedFilter**: ~4KB uncompressed
- **UnifiedPostFeed**: ~6KB uncompressed
- **LoadMoreButton**: ~2KB uncompressed
- **Total**: ~15KB uncompressed (~5KB gzipped)

### Runtime Performance

- **Initial render**: <100ms (server-rendered)
- **Filter change**: <50ms (client-side array filter)
- **Load more**: <100ms (array slicing + re-render)
- **No layout shift**: CLS <0.1

### Memory Usage

- **All posts cached**: ~50 posts × 2KB = ~100KB (acceptable)
- **No memory leaks**: Cleanup event listeners on unmount
