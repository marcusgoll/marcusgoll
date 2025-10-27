# Research & Discovery: 003-homepage-post-feed

## Research Decisions

### Decision: Client-side filtering with URL state management

- **Decision**: Use URL search params (?view=unified, ?track=aviation) for filter state
- **Rationale**: Enables shareable/bookmarkable URLs, maintains state across navigation, SEO-friendly
- **Alternatives**: Local state (loses state on refresh), cookies (complexity), server-side (ISR breaks)
- **Source**: Next.js App Router best practices, existing `revalidate = 60` ISR pattern in `app/page.tsx`

### Decision: Load More button pattern (not infinite scroll)

- **Decision**: Implement "Load More" button with client-side state management
- **Rationale**: Better UX for blog content (user control), maintains scroll position, simpler than infinite scroll, accessible
- **Alternatives**: Traditional pagination (loses scroll context), infinite scroll (complex, accessibility issues)
- **Source**: Constitution principle "Systematic Clarity" - predictable, user-controlled interactions

### Decision: Reuse existing Post data model and lib/posts.ts functions

- **Decision**: No changes to Post type or data fetching logic
- **Rationale**: Post type already includes `featured: boolean` field (line 17 in `lib/posts.ts`), existing tag filtering via `getPostsByTag()` works perfectly
- **Alternatives**: Create new data model (unnecessary complexity), modify Post type (breaking change)
- **Source**: Codebase analysis - `lib/posts.ts:17-236`

### Decision: Maintain ISR with 60-second revalidation

- **Decision**: Keep existing `export const revalidate = 60` pattern
- **Rationale**: Balances fresh content with performance, already proven in production
- **Alternatives**: Static (stale content), on-demand revalidation (complexity), SSR (slow)
- **Source**: `app/page.tsx:9`, NFR-001 performance requirements

### Decision: Featured posts rendered server-side, pagination client-side

- **Decision**: Initial 6 posts + featured posts fetched server-side, additional posts loaded client-side
- **Rationale**: Optimal FCP/LCP (server-rendered initial content), progressive enhancement for "Load More"
- **Alternatives**: Full client-side (slow FCP), full server-side (no dynamic loading)
- **Source**: Next.js App Router RSC patterns, NFR-001 (FCP <2s, LCP <3s)

---

## Components to Reuse (6 found)

- `components/blog/PostCard.tsx` - Individual post display with image, title, excerpt, metadata, track badge
- `components/blog/PostGrid.tsx` - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
- `components/blog/TrackBadge.tsx` - Visual track indicator (Aviation/Dev-Startup/Cross-pollination colors)
- `components/ui/Button.tsx` - Reusable button with variants (primary, secondary, outline) and analytics tracking
- `components/ui/Container.tsx` - Page width constraint wrapper
- `components/analytics/PageViewTracker.tsx` - Analytics integration (already on homepage)

---

## New Components Needed (4 required)

- `components/home/PostFeedFilter.tsx` - Filter UI for track selection (Aviation/Dev-Startup/Cross-pollination/All) with URL state sync
- `components/home/UnifiedPostFeed.tsx` - Chronological feed view with client-side filtering and "Load More" pagination
- `components/home/FeaturedPostsSection.tsx` - Featured posts display (up to 2 posts, larger hero-style cards, hidden if none)
- `components/home/LoadMoreButton.tsx` - "Load More" button with loading state, hidden when no more posts

---

## Unknowns & Questions

None - all technical questions resolved during research phase.

---

## Research Tools Used

1. Read `app/page.tsx` - Verified existing homepage structure, ISR pattern, data fetching
2. Read `components/home/DualTrackShowcase.tsx` - Analyzed dual-track section layout, empty states
3. Read `lib/posts.ts` - Confirmed Post type includes `featured` field, tag filtering exists
4. Read `components/blog/PostCard.tsx` - Verified reusable card component with track badge support
5. Read `components/blog/PostGrid.tsx` - Confirmed responsive grid layout with empty states
6. Read `components/ui/Button.tsx` - Verified analytics tracking support in Button component
7. Read `components/blog/TrackBadge.tsx` - Confirmed track color coding (Aviation: sky-blue, Dev: emerald)
8. Read `.spec-flow/memory/constitution.md` - Verified brand principles (Systematic Clarity, Multi-Passionate Integration)
9. Read `package.json` - Confirmed Next.js 15.5.6, React 19.2.0, no new dependencies needed

---

## Reuse Opportunities Summary

**High Reuse Rate**: 6 existing components can be directly reused without modification. Only 4 new components needed for feature-specific logic (filtering, pagination, featured posts).

**Pattern Consistency**: Existing patterns align perfectly with feature requirements:
- `getPostsByTag()` supports filtering
- Post type includes `featured` field
- PostCard/PostGrid already handle track badges
- Button component has analytics tracking built-in

**No Breaking Changes**: Feature can be implemented without modifying existing components or data models.
