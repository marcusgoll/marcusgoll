# Feature: Homepage with Post Feed

## Overview
The homepage currently exists (`app/page.tsx`) and displays aviation and dev/startup posts in separate sections via the `DualTrackShowcase` component. The feature description "Homepage with Post Feed" is ambiguous - it could mean:

1. Enhancing the existing homepage with additional features
2. Adding a unified post feed combining both tracks
3. Improving the current dual-track layout
4. Adding filtering/sorting capabilities

**Assumption**: Based on the existing implementation showing posts on the homepage, this spec will focus on enhancing the homepage post feed with improved functionality, unified display options, and better user experience.

## Research Findings

### Constitution Compliance
Source: `.spec-flow/memory/constitution.md`

- **Brand Principles**: Systematic Clarity, Multi-Passionate Integration, Teaching-First Content
- **Visual Brand**: Navy 900 (#0F172A) primary, Emerald 600 (#059669) secondary
- **Typography**: Work Sans (headings/body), JetBrains Mono (code)
- **Accessibility**: WCAG 2.1 AA minimum
- **Content Mix**: 40% aviation, 40% dev/startup, 20% cross-pollination
- **Performance**: FCP <2s, LCP <3s

### Existing Implementation Analysis
Source: Codebase inspection

**Current Homepage** (`app/page.tsx:22-46`):
- Fetches latest 3 posts per track (aviation, dev-startup)
- Uses `DualTrackShowcase` component for display
- Has ISR with 60-second revalidation
- Includes Hero section and PageViewTracker

**DualTrackShowcase** (`components/home/DualTrackShowcase.tsx:15-82`):
- Displays two separate sections (Aviation, Dev/Startup)
- Each section has heading, description, "View All" CTA
- Uses `PostGrid` component for post display
- Empty state messaging when no posts

**Post Data** (`lib/posts.ts:9-236`):
- MDX-based posts from `content/posts/` directory
- Supports tags: aviation, dev-startup, cross-pollination
- Post type includes: title, slug, excerpt, feature_image, published_at, reading_time
- Tag filtering via `getPostsByTag()` function

**UI Components**:
- `PostCard`: Displays individual post with image, title, excerpt, metadata, track badge
- `PostGrid`: Grid layout for multiple posts
- `TrackBadge`: Visual indicator for content track
- `Button`: Reusable with track-specific styling

Decision: Based on current implementation, this feature will enhance the homepage post feed with:
1. Unified view option (all posts chronologically)
2. Filtering by track (aviation, dev-startup, cross-pollination, all)
3. Pagination or "Load More" functionality
4. Featured posts highlighting
5. Search functionality (future consideration)

## System Components Analysis

**Reusable Components** (from codebase inspection):
- `PostCard` - Individual post display
- `PostGrid` - Grid layout for posts
- `TrackBadge` - Content track indicator
- `Button` - CTAs with track styling
- `Container` - Page width constraint
- `PageViewTracker` - Analytics integration

**New Components Needed**:
- `PostFeedFilter` - Filter UI for track selection
- `UnifiedPostFeed` - Combined chronological feed option
- `FeaturedPostsSection` - Highlight featured content
- `PostPagination` or `LoadMoreButton` - Navigate through posts

**Rationale**: Compose existing primitives where possible. New components needed for filter UI and pagination logic specific to this feature.

## Feature Classification
- UI screens: true (homepage enhancement with new UI elements)
- Improvement: false (enhancement, not fixing existing problem)
- Measurable: false (no specific user behavior tracking required beyond existing analytics)
- Deployment impact: false (no breaking changes, env vars, or migrations)

## Research Mode
Standard research (3-5 tools) - Single-aspect UI feature

## Key Decisions

1. **Dual-track vs Unified Display**: Provide both options
   - Keep existing dual-track sections for familiarity
   - Add optional unified feed view with track filtering
   - User preference could be saved (future enhancement)

2. **Pagination Strategy**: Implement "Load More" pattern
   - Better UX than traditional pagination for blog content
   - Maintains scroll position and context
   - Simpler implementation than infinite scroll
   - Initial load: 6 posts (3 aviation + 3 dev-startup for dual-track, or 6 total for unified)

3. **Featured Posts**: Leverage existing `featured` field from Post type
   - Display up to 2 featured posts prominently at top
   - Larger cards or hero-style layout
   - Falls back gracefully if no featured posts

4. **Filter Implementation**: Client-side filtering with URL state
   - URL params for shareable/bookmarkable filters
   - `?track=aviation` or `?track=dev-startup` or `?track=all`
   - Defaults to dual-track view (current behavior)
   - Filter persists across navigation

5. **Performance**: Maintain existing ISR pattern
   - Keep 60-second revalidation
   - Pre-fetch additional posts for "Load More"
   - Optimize images with Next.js Image component
   - Monitor Core Web Vitals (FCP <2s, LCP <3s)

## Checkpoints
- Phase 0 (Spec-flow): 2025-10-21T22:30:00Z

## Last Updated
2025-10-21T22:30:00Z
