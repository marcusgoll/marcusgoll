# Tasks: Homepage with Enhanced Post Feed

## [CODEBASE REUSE ANALYSIS]
Scanned: D:\Coding\marcusgoll\components\**\*.tsx, D:\Coding\marcusgoll\app\**\page.tsx, D:\Coding\marcusgoll\lib\**\*.ts

[EXISTING - REUSE]
- ✅ PostCard (components/blog/PostCard.tsx) - Individual post display with image, title, excerpt, metadata, track badge
- ✅ PostGrid (components/blog/PostGrid.tsx) - Responsive grid layout for posts
- ✅ TrackBadge (components/blog/TrackBadge.tsx) - Content track badge display
- ✅ Button (components/ui/Button.tsx) - Reusable button component with variants
- ✅ Container (components/ui/Container.tsx) - Page width container with responsive padding
- ✅ PageViewTracker (components/analytics/PageViewTracker.tsx) - Analytics event tracking
- ✅ DualTrackShowcase (components/home/DualTrackShowcase.tsx) - Existing dual-track post display
- ✅ lib/posts.ts - getAllPosts(), getPostsByTrack(), sortByDate() functions
- ✅ app/page.tsx - Homepage server component structure
- ✅ Post type (lib/posts.ts) - Existing post type definition with frontmatter fields

[NEW - CREATE]
- 🆕 FeaturedPostsSection (components/home/FeaturedPostsSection.tsx) - Hero-style featured posts display
- 🆕 PostFeedFilter (components/home/PostFeedFilter.tsx) - Filter UI with URL state sync
- 🆕 UnifiedPostFeed (components/home/UnifiedPostFeed.tsx) - Unified chronological feed with pagination
- 🆕 LoadMoreButton (components/home/LoadMoreButton.tsx) - Pagination button with loading state

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (prerequisite infrastructure)
2. Phase 2: Foundational Components (blocks all stories)
3. Phase 3: US1 [P1] - Unified feed view (independent)
4. Phase 4: US2 [P2] - Track filtering (depends on US1 UnifiedPostFeed)
5. Phase 5: US3 [P2] - Featured content (independent, can parallel with US2)
6. Phase 6: US4 [P1] - Load More pagination (depends on US1 UnifiedPostFeed)
7. Phase 7: US5 [P3] - Maintain dual-track view (verify backward compatibility)
8. Phase 8: Polish & Cross-Cutting Concerns

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 2: T002, T003, T004 (different files, independent components)
- Phase 3: T010, T011 (different concerns - URL handling vs display)
- Phase 5: T020, T021 (featured posts independent of filtering)
- Phase 6: T025, T026 (pagination logic vs button UI)
- Phase 8: T040, T041, T042, T043 (different testing/optimization concerns)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phases 1-4 (Setup → Foundational → Unified Feed → Filtering)
**Incremental delivery**:
- Phase 1-2: Foundation (components/infrastructure)
- Phase 3-4: Core functionality (unified feed + filtering) → staging validation
- Phase 5-6: Enhanced features (featured posts + pagination) → staging validation
- Phase 7-8: Polish + optimization → production deployment

**Testing approach**: Optional - manual testing only (no test directory found in codebase)
**Analytics**: Track filter selections, view mode changes, pagination clicks, featured post impressions

---

## Phase 1: Setup

- [ ] T001 Verify Post type supports featured field in lib/posts.ts
  - Check if `featured?: boolean` exists in Post type frontmatter
  - If missing, add to type definition
  - Verify MDX frontmatter parsing includes featured field
  - Pattern: lib/posts.ts existing type definitions
  - From: data-model.md Post entity

- [ ] T002 [P] Create components/home/ directory structure
  - Files: components/home/FeaturedPostsSection.tsx, PostFeedFilter.tsx, UnifiedPostFeed.tsx, LoadMoreButton.tsx
  - Follow existing components/ directory pattern
  - From: plan.md [STRUCTURE]

---

## Phase 2: Foundational Components (blocking prerequisites)

**Goal**: Reusable UI components that block all user stories

- [ ] T003 [P] Create LoadMoreButton component in components/home/LoadMoreButton.tsx
  - Props: `onClick: () => void`, `isLoading: boolean`, `hasMore: boolean`
  - States: Default, loading (with spinner), hidden (when !hasMore)
  - REUSE: Button component (components/ui/Button.tsx)
  - Pattern: components/ui/Button.tsx for variants
  - Analytics: Track 'load_more_clicked' event
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T004 [P] Create PostFeedFilter component in components/home/PostFeedFilter.tsx
  - Props: None (reads from useSearchParams, writes to useRouter)
  - Filter options: All, Aviation, Dev/Startup, Cross-pollination
  - Client component: 'use client' directive
  - URL sync: Read from ?track=slug, write via router.push()
  - REUSE: Button component (components/ui/Button.tsx)
  - Pattern: components/home/DualTrackShowcase.tsx for track handling
  - Accessibility: aria-label, keyboard navigation, active state indication
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 3: User Story 1 [P1] - View All Posts in Unified Feed

**Story Goal**: Users can view all posts chronologically regardless of track

**Independent Test Criteria**:
- [ ] User visits /?view=unified → sees all posts chronologically
- [ ] URL parameter ?view=unified is present when unified view active
- [ ] Each post displays track badge for identification
- [ ] Default view (no params) shows dual-track layout (backward compatibility)

### Implementation

- [ ] T010 [P] Create UnifiedPostFeed component in components/home/UnifiedPostFeed.tsx
  - Props: `allPosts: Post[]`, `initialView: 'dual-track' | 'unified'`
  - Client component: 'use client' directive
  - State: useState for displayedPosts (pagination), view mode
  - URL sync: Read ?view param via useSearchParams
  - Display: Map posts to PostCard components in PostGrid layout
  - REUSE: PostCard (components/blog/PostCard.tsx), PostGrid (components/blog/PostGrid.tsx)
  - Pattern: components/home/DualTrackShowcase.tsx for post rendering
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T011 [P] Add view toggle UI to UnifiedPostFeed component
  - Buttons: "Dual-Track View" (default), "All Posts" (unified)
  - Active state: Highlight current view mode
  - Click handler: Update URL with ?view=unified or remove param
  - REUSE: Button component (components/ui/Button.tsx)
  - Accessibility: aria-pressed for toggle state
  - Analytics: Track 'view_mode_changed' event with mode value
  - From: spec.md FR-001

- [ ] T012 Modify app/page.tsx to support unified feed
  - Fetch: getAllPosts() for all posts (existing function)
  - Filter: Remove featured posts from allPosts for regular feed
  - Props: Pass allPosts to UnifiedPostFeed component
  - Default: Render DualTrackShowcase when ?view param absent
  - Conditional: Render UnifiedPostFeed when ?view=unified
  - REUSE: lib/posts.ts getAllPosts(), existing page.tsx structure
  - Pattern: app/aviation/page.tsx for server component data fetching
  - From: plan.md [STRUCTURE]

---

## Phase 4: User Story 2 [P2] - Filter Posts by Content Track

**Story Goal**: Users can filter posts by specific content track

**Independent Test Criteria**:
- [ ] User selects Aviation filter → sees only aviation posts
- [ ] URL parameter ?track=aviation reflects active filter
- [ ] Filter state persists when navigating back to homepage
- [ ] Filter works in both dual-track and unified view modes

### Implementation

- [ ] T015 Add track filtering logic to UnifiedPostFeed component
  - State: activeTrack from ?track URL param
  - Filter: allPosts.filter(post => post.track === activeTrack || activeTrack === 'all')
  - URL sync: Read ?track param via useSearchParams
  - Combine: Support both ?view and ?track params simultaneously
  - REUSE: Existing Post type track field
  - Pattern: lib/posts.ts getPostsByTrack() for reference
  - From: spec.md FR-002

- [ ] T016 Integrate PostFeedFilter component into UnifiedPostFeed
  - Position: Above post grid, below view toggle
  - Event handler: onFilterChange updates URL with ?track param
  - Active state: Pass activeTrack to PostFeedFilter for highlighting
  - Layout: Responsive (horizontal on desktop, stacked on mobile)
  - REUSE: PostFeedFilter component (T004)
  - Pattern: components/home/DualTrackShowcase.tsx for component composition
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T017 Update DualTrackShowcase to respect track filter
  - Conditional: Hide sections that don't match ?track param
  - Example: ?track=aviation hides Dev/Startup section
  - Graceful: Show both sections when ?track=all or no param
  - Maintain: Existing 3-posts-per-track limit
  - Pattern: Existing DualTrackShowcase.tsx component logic
  - From: spec.md FR-002 backward compatibility

---

## Phase 5: User Story 3 [P2] - Discover Featured Content

**Story Goal**: Users see featured posts prominently at top of homepage

**Independent Test Criteria**:
- [ ] Homepage loads → up to 2 featured posts displayed at top
- [ ] Featured posts use hero-style layout (larger cards)
- [ ] Featured posts filtered from regular feed (no duplicates)
- [ ] Section hidden gracefully when no featured posts exist

### Implementation

- [ ] T020 [P] Create FeaturedPostsSection component in components/home/FeaturedPostsSection.tsx
  - Props: `featuredPosts: Post[]` (max 2 posts)
  - Server component: No 'use client' needed (static display)
  - Layout: Hero-style cards (larger images, prominent titles)
  - Conditional: Return null if featuredPosts.length === 0
  - REUSE: PostCard or create FeaturedPostCard variant with larger styling
  - Pattern: components/home/Hero.tsx for hero-style layout
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T021 [P] Add featured posts filtering to app/page.tsx
  - Fetch: getAllPosts() and filter where featured === true
  - Limit: Take first 2 featured posts (slice(0, 2))
  - Remove: Filter featured posts out of allPosts for regular feed
  - Pass: featuredPosts to FeaturedPostsSection component
  - Position: Render FeaturedPostsSection before DualTrackShowcase/UnifiedPostFeed
  - REUSE: lib/posts.ts getAllPosts()
  - Pattern: app/page.tsx existing data fetching
  - From: spec.md FR-003

- [ ] T022 Add featured: true to 1-2 sample posts in content/posts/
  - Select: Choose 1-2 high-quality posts for featuring
  - Edit: Add `featured: true` to frontmatter
  - Verify: Posts appear in featured section on homepage
  - Test: Remove featured field to verify section hides gracefully
  - From: spec.md FR-003 acceptance criteria

---

## Phase 6: User Story 4 [P1] - Load More Posts

**Story Goal**: Users can load additional posts without leaving page

**Independent Test Criteria**:
- [ ] Initial load shows 6 posts (3+3 dual-track or 6 unified)
- [ ] Click "Load More" → next 6 posts appended to feed
- [ ] Button shows loading spinner during fetch
- [ ] Button hidden when no more posts available
- [ ] Scroll position maintained after loading more posts

### Implementation

- [ ] T025 [P] Add pagination state to UnifiedPostFeed component
  - State: displayedCount (useState, initial 6)
  - State: isLoading (useState, for button feedback)
  - Handler: handleLoadMore() → increment displayedCount by 6
  - Slice: displayedPosts = filteredPosts.slice(0, displayedCount)
  - Computed: hasMore = displayedCount < filteredPosts.length
  - Pattern: React useState for local pagination
  - From: spec.md FR-004

- [ ] T026 [P] Integrate LoadMoreButton into UnifiedPostFeed component
  - Position: Below PostGrid
  - Props: onClick={handleLoadMore}, isLoading, hasMore
  - Analytics: Track 'load_more_clicked' with posts_loaded count
  - Accessibility: Announce new posts loaded to screen readers
  - REUSE: LoadMoreButton component (T003)
  - Pattern: components/home/DualTrackShowcase.tsx for component integration
  - From: spec.md FR-004

- [ ] T027 Add pagination to DualTrackShowcase component
  - Initial: Show 3 posts per track (existing behavior)
  - Load More: Fetch next 3 posts per track when button clicked
  - State: Separate displayedCount for each track (aviation, dev-startup)
  - Button: One LoadMoreButton per track section
  - REUSE: LoadMoreButton component (T003)
  - Pattern: Similar to UnifiedPostFeed pagination logic (T025)
  - From: spec.md FR-004 (applies to both views)

---

## Phase 7: User Story 5 [P3] - Maintain Dual-Track View

**Story Goal**: Verify backward compatibility with existing dual-track layout

**Independent Test Criteria**:
- [ ] Visit homepage with no URL params → see dual-track sections
- [ ] Each section shows 3 recent posts (Aviation, Dev/Startup)
- [ ] Toggle to unified view works from dual-track view
- [ ] URL params preserve filter/view state across navigation

### Verification Tasks

- [ ] T030 Verify DualTrackShowcase backward compatibility
  - Test: Visit / with no params → dual-track layout renders
  - Test: Each section shows 3 posts from correct track
  - Test: Existing links to homepage work correctly
  - Test: No visual regressions (compare before/after screenshots)
  - From: spec.md US5

- [ ] T031 Test view toggle between dual-track and unified modes
  - Test: Click "All Posts" from dual-track → switches to unified view
  - Test: Click "Dual-Track View" from unified → switches to dual-track
  - Test: URL updates correctly (?view=unified)
  - Test: Browser back/forward preserves view state
  - From: spec.md FR-001

- [ ] T032 Test filter persistence across navigation
  - Test: Select ?track=aviation → navigate away → back button → filter persists
  - Test: Share URL with ?track param → opens with filter active
  - Test: Combine ?view=unified&track=aviation → both states applied
  - From: spec.md FR-002

---

## Phase 8: Polish & Cross-Cutting Concerns

### Error Handling & Resilience

- [ ] T040 [P] Add loading states to UnifiedPostFeed component
  - Skeleton: Show skeleton cards while posts loading (if async)
  - Empty state: "No posts found" message when filteredPosts.length === 0
  - Error state: "Failed to load posts" with retry button
  - Pattern: React Suspense boundaries or conditional rendering
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T041 [P] Add URL parameter validation to PostFeedFilter
  - Validate: ?track param must be 'aviation' | 'dev-startup' | 'cross-pollination' | 'all'
  - Validate: ?view param must be 'unified' or undefined
  - Sanitize: Remove invalid params, default to safe values
  - Security: Prevent XSS via param injection (React handles via JSX)
  - From: plan.md [SECURITY]

### Performance Optimization

- [ ] T042 [P] Optimize UnifiedPostFeed rendering performance
  - Memoization: useMemo for filteredPosts computation
  - Key props: Ensure unique keys for PostCard components (post.slug)
  - Lazy loading: Consider lazy-loading images in PostCard (existing or add)
  - Bundle: Verify code-splitting for client components
  - Target: FCP <1.5s, LCP <2.5s
  - Pattern: React.memo, useMemo for expensive computations
  - From: plan.md [PERFORMANCE TARGETS]

- [ ] T043 [P] Add analytics instrumentation
  - Events: 'view_mode_changed', 'track_filter_changed', 'load_more_clicked', 'featured_post_clicked'
  - Properties: Include mode/track/count values
  - PostHog: Use existing PageViewTracker pattern for event tracking
  - Logs: Console log for development debugging
  - REUSE: PageViewTracker component (components/analytics/PageViewTracker.tsx)
  - Pattern: Existing analytics implementation in codebase
  - From: plan.md [SECURITY - Analytics]

### Accessibility Audit

- [ ] T044 [P] Verify WCAG 2.1 AA compliance for new components
  - Keyboard: Tab navigation through filters, buttons
  - Screen readers: aria-label on filter buttons, aria-pressed on toggles
  - Focus: Visible focus indicators on interactive elements
  - Contrast: Verify text/background contrast ratios ≥4.5:1
  - Announcements: Announce filter changes, new posts loaded
  - Test: Use axe DevTools or Lighthouse accessibility audit
  - From: plan.md [PERFORMANCE TARGETS - Accessibility]

### Documentation

- [ ] T045 Update NOTES.md with implementation decisions
  - Document: Component architecture decisions
  - Document: URL parameter schema (?view, ?track)
  - Document: Pagination strategy (client-side slicing)
  - Document: Known limitations (no infinite scroll, no search)
  - From: Standard practice

- [ ] T046 Create quickstart testing guide in specs/003-homepage-post-feed/
  - Steps: How to test each user story manually
  - URLs: Example URLs with different param combinations
  - Edge cases: Empty states, no featured posts, all posts loaded
  - From: spec.md user stories
