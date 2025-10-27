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
- Phase 1 (Plan): 2025-10-21T23:15:00Z

## Phase Summaries

### Phase 1: Planning (2025-10-21T23:15:00Z)

**Research Depth**: 356 lines of research documentation

**Key Decisions Made**:
1. Client-side filtering with URL state management (shareable/bookmarkable URLs)
2. "Load More" button pattern (better UX than infinite scroll)
3. Reuse existing Post data model and lib/posts.ts functions (no breaking changes)
4. Maintain ISR with 60-second revalidation (proven pattern)
5. Server-rendered featured posts + client-side pagination (optimal FCP/LCP)

**Components to Reuse**: 6
- PostCard, PostGrid, TrackBadge, Button, Container, PageViewTracker

**New Components**: 4
- FeaturedPostsSection, PostFeedFilter, UnifiedPostFeed, LoadMoreButton

**Migration Needed**: No

**Artifacts Created**:
- research.md (research decisions + component reuse analysis)
- data-model.md (entity definitions + client state contracts)
- quickstart.md (integration scenarios + testing guide)
- plan.md (consolidated architecture + implementation plan)
- contracts/component-contracts.md (TypeScript interfaces + behavior contracts)
- error-log.md (initialized for error tracking)

**Git Commit**: 7c62bcd

## Phase 2: Tasks (2025-10-21 23:00)

**Summary**:
- Total tasks: 26
- User story phases: 5 (US1-US5)
- Parallel opportunities: 14
- Setup tasks: 2 (Phase 1)
- Foundational tasks: 2 (Phase 2)
- Story implementation: 15 tasks (Phases 3-7)
- Polish tasks: 7 (Phase 8)
- Task file: specs/003-homepage-post-feed/tasks.md

**Task Breakdown by Phase**:
- Phase 1 (Setup): 2 tasks - Post type verification, directory structure
- Phase 2 (Foundational): 2 tasks - LoadMoreButton, PostFeedFilter components
- Phase 3 (US1 - Unified Feed): 3 tasks - UnifiedPostFeed component, view toggle, page.tsx integration
- Phase 4 (US2 - Track Filtering): 3 tasks - Filter logic, component integration, dual-track filter support
- Phase 5 (US3 - Featured Content): 3 tasks - FeaturedPostsSection, filtering logic, sample content
- Phase 6 (US4 - Load More): 3 tasks - Pagination state, button integration, dual-track pagination
- Phase 7 (US5 - Backward Compat): 3 tasks - Verification, view toggle testing, filter persistence
- Phase 8 (Polish): 7 tasks - Loading states, validation, performance, analytics, accessibility, docs

**Reuse Analysis**:
- Existing components: 10 (PostCard, PostGrid, TrackBadge, Button, Container, PageViewTracker, DualTrackShowcase, lib/posts.ts functions, app/page.tsx, Post type)
- New components: 4 (FeaturedPostsSection, PostFeedFilter, UnifiedPostFeed, LoadMoreButton)

**MVP Strategy**:
- Phases 1-4: Core functionality (setup, foundational, unified feed, filtering)
- Phases 5-6: Enhanced features (featured posts, pagination)
- Phase 7: Backward compatibility verification
- Phase 8: Polish and optimization

**Parallel Execution Groups**:
- Phase 2: T002, T003, T004 (independent components)
- Phase 3: T010, T011 (URL handling vs display)
- Phase 5: T020, T021 (featured posts independent)
- Phase 6: T025, T026 (pagination logic vs button UI)
- Phase 8: T040, T041, T042, T043 (testing/optimization)

**Checkpoint**:
- ✅ Tasks generated: 26
- ✅ User story organization: Complete (5 stories mapped)
- ✅ Dependency graph: Created
- ✅ MVP strategy: Defined (Phases 1-4 for first release)
- ✅ Reuse analysis: 10 existing components identified
- ✅ Parallel opportunities: 14 tasks marked [P]
- 📋 Ready for: /analyze

