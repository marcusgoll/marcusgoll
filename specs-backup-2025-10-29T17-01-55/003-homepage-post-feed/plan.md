# Implementation Plan: Homepage with Enhanced Post Feed

## RESEARCH DECISIONS

See: `research.md` for full research findings

**Summary**:
- Stack: Next.js 15.5.6 App Router + React 19.2.0 (existing, no changes)
- State Management: URL params + React useState for client-side state
- Components to reuse: 6 (PostCard, PostGrid, TrackBadge, Button, Container, PageViewTracker)
- New components needed: 4 (PostFeedFilter, UnifiedPostFeed, FeaturedPostsSection, LoadMoreButton)
- Pattern: Server-rendered initial content + client-side progressive enhancement

---

## ARCHITECTURE DECISIONS

### Stack

- **Frontend**: Next.js 15.5.6 App Router, React 19.2.0, TypeScript 5.9.3
- **Styling**: TailwindCSS 4.1.15 (existing design system)
- **Data Fetching**: Server Components (RSC) for initial load, client-side for pagination
- **State Management**:
  - URL params (view/track state) - shareable/bookmarkable
  - React useState (pagination state) - component-local
  - No external state library needed (simple feature scope)
- **Content**: MDX files in `content/posts/` (existing)
- **Deployment**: Vercel with ISR (60-second revalidation)

### Patterns

**Server/Client Composition Pattern**:
- Server Component: `app/page.tsx` - Initial data fetch, featured posts filtering, SEO metadata
- Client Component: `UnifiedPostFeed` - Filtering UI, pagination state, "Load More" logic
- **Rationale**: Optimal FCP/LCP (server-rendered above-the-fold) + progressive enhancement

**URL State Management Pattern**:
- Read: `useSearchParams()` to get current filter/view state
- Write: `useRouter()` + `router.push()` to update URL params
- **Rationale**: Shareable URLs, browser back/forward support, no local storage complexity

**Progressive Enhancement Pattern**:
- Base experience: Server-rendered 6 posts (works without JS)
- Enhanced experience: Client-side filtering + pagination (requires JS)
- **Rationale**: Accessibility, resilience, SEO

**Component Composition Pattern**:
- Reuse existing atomic components (PostCard, TrackBadge, Button)
- Build feature-specific composite components (FeaturedPostsSection, UnifiedPostFeed)
- **Rationale**: DRY principle, consistent UI, maintainability

### Dependencies (new packages required)

**None** - All required functionality available in existing dependencies:
- Next.js 15.5.6 (useSearchParams, useRouter, Image)
- React 19.2.0 (useState, useEffect)
- TailwindCSS 4.1.15 (styling)
- Existing `lib/posts.ts` functions (data fetching)

---

## STRUCTURE

### Directory Layout (follow existing patterns)

```
app/
├── page.tsx (MODIFY - add featured posts logic, client/server split)

components/
├── home/
│   ├── DualTrackShowcase.tsx (EXISTING - may refactor for reuse)
│   ├── FeaturedPostsSection.tsx (NEW - featured posts display)
│   ├── PostFeedFilter.tsx (NEW - filter UI with URL state sync)
│   ├── UnifiedPostFeed.tsx (NEW - unified chronological feed)
│   └── LoadMoreButton.tsx (NEW - pagination button with loading state)
├── blog/
│   ├── PostCard.tsx (EXISTING - reuse)
│   ├── PostGrid.tsx (EXISTING - reuse)
│   └── TrackBadge.tsx (EXISTING - reuse)
└── ui/
    ├── Button.tsx (EXISTING - reuse)
    └── Container.tsx (EXISTING - reuse)

lib/
└── posts.ts (EXISTING - no changes, reuse existing functions)

content/posts/
└── [post-slug].mdx (EXISTING - may add featured: true to frontmatter)
```

### Module Organization

**`app/page.tsx` (Homepage Server Component)**:
- Responsibilities: Fetch initial posts, filter featured posts, render layout
- Changes: Add featured posts filtering, pass all posts to client component for pagination
- Pattern: Server Component (async/await data fetching)

**`components/home/FeaturedPostsSection.tsx` (New Server Component)**:
- Responsibilities: Display up to 2 featured posts in hero-style layout
- Props: `featuredPosts: Post[]`
- Pattern: Server Component (no interactivity)

**`components/home/PostFeedFilter.tsx` (New Client Component)**:
- Responsibilities: Render filter buttons, sync URL params, highlight active filter
- Props: `activeTrack: string | null`, `onFilterChange: (track: string | null) => void`
- Pattern: Client Component ('use client', useSearchParams, useRouter)

**`components/home/UnifiedPostFeed.tsx` (New Client Component)**:
- Responsibilities: Client-side filtering, pagination state, "Load More" logic
- Props: `initialPosts: Post[]`, `allPosts: Post[]`, `view: 'dual-track' | 'unified'`
- Pattern: Client Component ('use client', useState for pagination)

**`components/home/LoadMoreButton.tsx` (New Client Component)**:
- Responsibilities: Render "Load More" button with loading state, hidden when no more posts
- Props: `onClick: () => void`, `isLoading: boolean`, `hasMore: boolean`
- Pattern: Client Component ('use client', analytics tracking)

---

## DATA MODEL

See: `data-model.md` for complete entity definitions

**Summary**:
- Entities: Post (existing, no changes), Tag (existing, no changes)
- Client-side state: PostFeedState (view, activeTrack, displayedPosts, allPosts, hasMore, isLoading)
- URL state: `?view=unified`, `?track=aviation`
- No database migrations required (uses existing MDX files)

---

## PERFORMANCE TARGETS

### From spec.md NFRs (NFR-001)

- **NFR-001**: API response time <500ms (95th percentile) - N/A (no API routes)
- **NFR-001**: Frontend FCP <2s, LCP <3s
  - Target: FCP <1.5s (10% improvement buffer)
  - Target: LCP <2.5s (10% improvement buffer)
- **NFR-001**: "Load More" fetch completes <1s
  - Target: <500ms (client-side array slicing, no network)
- **NFR-001**: Bundle size increase limited to 20KB (gzipped)
  - New components: ~15KB uncompressed (estimated ~5KB gzipped)

### Lighthouse Targets (from Constitution)

- **Performance**: ≥85 (maintain current baseline)
- **Accessibility**: ≥95 (WCAG 2.1 AA minimum)
- **Best Practices**: ≥90
- **SEO**: ≥90

### Core Web Vitals Monitoring

- **FCP (First Contentful Paint)**: <1.5s (target), <2s (max)
- **LCP (Largest Contentful Paint)**: <2.5s (target), <3s (max)
- **CLS (Cumulative Layout Shift)**: <0.1 (no layout shift from pagination)
- **FID (First Input Delay)**: <100ms (filter button responsiveness)

**Measurement**: Use Lighthouse CI in GitHub Actions workflow, log to specs/003-homepage-post-feed/performance-metrics.md

---

## SECURITY

### Authentication Strategy

**Not Required** - Homepage is public, no authentication needed.

### Authorization Model

**Not Required** - All posts publicly accessible, no authorization checks.

### Input Validation

**URL Parameter Validation**:
- `view` param: Must be 'unified' or undefined (sanitize, reject invalid values)
- `track` param: Must be 'aviation' | 'dev-startup' | 'cross-pollination' | 'all' or undefined
- **Implementation**: Validate in `UnifiedPostFeed` component before filtering

**Client-Side Sanitization**:
- Sanitize URL params before using in filters
- Prevent XSS via React's built-in escaping (JSX)

### Data Protection

**No PII Handling** - No user data collected or stored.

**Analytics**:
- Track filter selections, "Load More" clicks, featured post impressions
- Use existing `PageViewTracker` component
- No sensitive data logged

---

## EXISTING INFRASTRUCTURE - REUSE (6 components)

### UI Components

- **`components/blog/PostCard.tsx`**: Individual post display with image, title, excerpt, metadata, track badge
  - Reuse: Exact fit for both dual-track and unified feed
  - Location: `components/blog/PostCard.tsx:1-76`

- **`components/blog/PostGrid.tsx`**: Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
  - Reuse: Perfect for displaying filtered posts
  - Location: `components/blog/PostGrid.tsx:1-31`

- **`components/blog/TrackBadge.tsx`**: Visual track indicator with brand colors
  - Reuse: Already used in PostCard, displays Aviation/Dev-Startup/Cross-pollination
  - Location: `components/blog/TrackBadge.tsx:1-38`

- **`components/ui/Button.tsx`**: Reusable button with variants (primary, secondary, outline) and analytics tracking
  - Reuse: Use for "Load More" button, filter buttons
  - Analytics: Built-in `trackContentTrackClick()` function
  - Location: `components/ui/Button.tsx:1-83`

- **`components/ui/Container.tsx`**: Page width constraint wrapper
  - Reuse: Wrap new components for consistent max-width
  - Location: Referenced in `app/page.tsx:4`

- **`components/analytics/PageViewTracker.tsx`**: Analytics integration for page views
  - Reuse: Already on homepage, tracks general page views
  - Location: Referenced in `app/page.tsx:5`

### Data Functions

- **`lib/posts.ts:getAllPosts(limit)`**: Fetch all posts sorted by date
  - Reuse: Fetch all posts for client-side pagination
  - Location: `lib/posts.ts:142-153`

- **`lib/posts.ts:getPostsByTag(tagSlug, limit)`**: Fetch posts filtered by tag
  - Reuse: Fetch initial posts per track for server-side rendering
  - Location: `lib/posts.ts:182-188`

- **`lib/posts.ts:getPrimaryTrack(tags)`**: Determine primary track from tag list
  - Reuse: Already used in PostGrid, consistent track logic
  - Location: `lib/posts.ts:212-236`

---

## NEW INFRASTRUCTURE - CREATE (4 components)

### Frontend Components

**`components/home/FeaturedPostsSection.tsx`** (New Server Component):
- **Purpose**: Display up to 2 featured posts in hero-style layout
- **Props**: `featuredPosts: Post[]`
- **Functionality**:
  - Filter posts where `featured: true`
  - Display in larger cards (hero-style, 2-column grid on desktop)
  - Hide section if no featured posts
  - Exclude featured posts from regular feed (no duplicates)
- **Styling**: Navy 900 background, larger images, prominent typography
- **Accessibility**: Semantic HTML (`<section>`, `<article>`), ARIA labels

**`components/home/PostFeedFilter.tsx`** (New Client Component):
- **Purpose**: Filter UI for track selection with URL state sync
- **Props**: None (reads URL params internally)
- **Functionality**:
  - Render filter buttons: Aviation, Dev/Startup, Cross-pollination, All
  - Sync active filter with URL params (`?track=`)
  - Highlight active filter button
  - Update URL on filter click (no page reload)
- **Styling**: Button group with active state highlighting (Emerald 600 for active)
- **Accessibility**: Keyboard navigable, focus states, ARIA labels

**`components/home/UnifiedPostFeed.tsx`** (New Client Component):
- **Purpose**: Unified chronological feed with client-side filtering and pagination
- **Props**: `initialPosts: Post[]`, `allPosts: Post[]`, `view: 'dual-track' | 'unified'`
- **State**:
  - `displayedPosts: Post[]` - Currently visible posts
  - `hasMore: boolean` - More posts available
  - `isLoading: boolean` - Loading state for "Load More"
- **Functionality**:
  - Display posts chronologically (newest first)
  - Client-side filter by active track (from URL params)
  - "Load More" button appends next 6 posts
  - Maintain scroll position after loading more
- **Empty State**: Show helpful message when no posts match filter

**`components/home/LoadMoreButton.tsx`** (New Client Component):
- **Purpose**: "Load More" button with loading state
- **Props**: `onClick: () => void`, `isLoading: boolean`, `hasMore: boolean`
- **Functionality**:
  - Show loading spinner when `isLoading: true`
  - Hide button when `hasMore: false`
  - Track analytics on click (button location: "homepage")
- **Styling**: Emerald 600 primary button, centered below posts
- **Accessibility**: Disabled state when loading, keyboard accessible

---

## CI/CD IMPACT

### From spec.md deployment considerations

- **Platform**: Vercel (existing)
- **Env vars**: No new environment variables required
- **Breaking changes**: No - backward compatible enhancement
- **Migration**: No database migrations required

### Build Commands

**No changes** - Existing build commands work:
```bash
npm run build   # Next.js build (no changes)
npm run dev     # Development server (no changes)
npm run start   # Production server (no changes)
```

### Environment Variables

**No new environment variables** - Feature uses existing setup.

**Existing variables** (no changes):
- `NEXT_PUBLIC_SITE_URL` - Used for canonical URLs (already set)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Analytics (optional, already set)

### Database Migrations

**Not Required** - No database changes. Feature uses existing MDX files in `content/posts/`.

**Content Changes** (optional):
- Add `featured: true` to frontmatter of 1-2 posts for testing
- Example:
  ```yaml
  ---
  title: "Post Title"
  date: "2025-01-15"
  tags: ["aviation"]
  featured: true
  ---
  ```

### Smoke Tests (for deploy-staging.yml and promote.yml)

**Route**: `/` (homepage)

**Expected**:
- Status: 200
- Content includes: "Aviation" and "Dev/Startup" section headings
- If featured posts exist: Featured section visible
- No console errors
- Lighthouse Performance ≥85

**Playwright Smoke Test** (@smoke tag):
```typescript
test('homepage loads with enhanced post feed', async ({ page }) => {
  await page.goto('/');

  // Verify dual-track sections
  await expect(page.locator('h2:has-text("Aviation")')).toBeVisible();
  await expect(page.locator('h2:has-text("Dev/Startup")')).toBeVisible();

  // Verify filter UI
  await expect(page.locator('button:has-text("Aviation")')).toBeVisible();

  // Verify posts load
  const posts = page.locator('[data-testid="post-card"]');
  await expect(posts).toHaveCountGreaterThan(0);
});
```

**Location**: `tests/smoke/homepage-post-feed.spec.ts`

### Platform Coupling

**Vercel**:
- **ISR Configuration**: Uses existing `export const revalidate = 60` pattern in `app/page.tsx`
- **Image Optimization**: Uses Next.js Image component (Vercel optimizes automatically)
- **Edge Middleware**: Not required for this feature

**Dependencies**: No new npm packages required.

---

## DEPLOYMENT ACCEPTANCE

### Production Invariants (must hold true)

1. **No breaking changes to existing routes**:
   - `/` (homepage) continues to work
   - `/aviation` and `/dev-startup` track pages continue to work
   - Post detail pages (`/blog/[slug]`) continue to work

2. **Backward compatibility**:
   - Users without URL params see default dual-track view
   - Existing Post type and data model unchanged
   - ISR revalidation (60 seconds) maintained

3. **Performance baseline maintained**:
   - FCP <2s (current baseline)
   - LCP <3s (current baseline)
   - Lighthouse Performance ≥85

4. **No data loss**:
   - All existing posts continue to display
   - Featured posts gracefully hidden if none exist
   - Empty states handle no posts scenario

### Staging Smoke Tests (Given/When/Then)

```gherkin
Scenario: Featured posts display prominently
  Given at least 1 post has featured: true in frontmatter
  When user visits https://marcusgoll.vercel.app/
  Then featured posts section visible at top
  And featured posts use larger hero-style cards
  And featured posts excluded from regular feed

Scenario: Track filtering works
  Given user visits homepage
  When user clicks "Aviation" filter button
  Then only aviation posts displayed
  And URL updates to /?track=aviation
  And filter state persists on refresh

Scenario: Load More pagination works
  Given more than 6 posts exist
  When user scrolls to bottom and clicks "Load More"
  Then next 6 posts append below
  And scroll position maintained
  And button shows loading state
  And button hidden when all posts loaded

Scenario: Mobile responsiveness
  Given user on mobile device (375px width)
  When user visits homepage
  Then filter UI accessible and usable
  And post grid displays single column
  And no horizontal scroll occurs

Scenario: Performance meets targets
  Given user visits homepage
  When Lighthouse audit runs
  Then FCP <2s
  And LCP <3s
  And Performance score ≥85
```

### Rollback Plan

**Deploy IDs tracked in**: `specs/003-homepage-post-feed/deployment-metadata.json`

**Rollback commands**:
```bash
# Vercel rollback (example)
vercel alias set <previous-deployment-id> marcusgoll.com --token=$VERCEL_TOKEN

# Verify rollback
curl -I https://marcusgoll.com | grep -i x-vercel-id
```

**Special considerations**:
- No database migration to downgrade
- No feature flags required (graceful degradation built-in)
- Content changes (featured: true) backward compatible (ignored if feature not deployed)

### Artifact Strategy (build-once-promote-many)

**Not Applicable** - This project uses Vercel's built-in deployment model, not manual artifact promotion.

**Vercel Workflow**:
1. Build triggered on git push to `staging` branch
2. Deploy to staging URL: `https://marcusgoll-staging.vercel.app/`
3. Manual validation on staging
4. Promote to production by pushing to `main` branch (or Vercel dashboard promotion)
5. Production URL: `https://marcusgoll.com/`

**Deployment metadata tracked**:
- Deployment ID (Vercel URL)
- Git commit SHA
- Deployment timestamp
- Environment (staging/production)

---

## INTEGRATION SCENARIOS

See: `quickstart.md` for complete integration scenarios

**Summary**:
- **Scenario 1**: Initial setup and development (npm install, npm run dev)
- **Scenario 2**: Feature testing (featured posts, filtering, pagination, mobile)
- **Scenario 3**: Validation and quality checks (performance, accessibility, browser compat)
- **Scenario 4**: SEO validation (canonical URLs, structured data)
- **Scenario 5**: Manual integration testing (end-to-end user flows)
- **Scenario 6**: Rollback testing (verify previous version works)

---

## IMPLEMENTATION SEQUENCE

### Phase 1: Foundation (Server-Side)
1. Modify `app/page.tsx` to fetch all posts and filter featured posts
2. Create `components/home/FeaturedPostsSection.tsx` (server component)
3. Test: Featured posts display, hidden when none exist

### Phase 2: Filtering UI (Client-Side)
1. Create `components/home/PostFeedFilter.tsx` (client component)
2. Implement URL param sync (useSearchParams, useRouter)
3. Test: Filter buttons update URL, active state highlighting

### Phase 3: Unified Feed (Client-Side)
1. Create `components/home/UnifiedPostFeed.tsx` (client component)
2. Implement client-side filtering by track
3. Implement view toggle (dual-track vs unified)
4. Test: Filtering works, view toggle works, URL state syncs

### Phase 4: Pagination (Client-Side)
1. Create `components/home/LoadMoreButton.tsx` (client component)
2. Implement "Load More" logic in UnifiedPostFeed
3. Test: Pagination works, loading state, button hidden when done

### Phase 5: Integration & Testing
1. Integrate all components in `app/page.tsx`
2. Add analytics tracking (filter clicks, "Load More" clicks, featured post impressions)
3. Test: Full user flows, mobile responsiveness, accessibility
4. Run Lighthouse audit, verify performance targets

### Phase 6: Optimization & QA
1. Optimize images (verify Next.js Image component usage)
2. Add error boundaries for graceful failure
3. Test edge cases (no posts, no featured posts, filter with no results)
4. Final accessibility audit (WCAG 2.1 AA)

---

## RISK MITIGATION

### Risk: Performance degradation with large post count (20+ posts)

**Mitigation**:
- Limit initial server render to 6 posts (3 per track)
- Client-side pagination loads in batches of 6 (not all at once)
- Monitor bundle size (target: <20KB gzipped increase)
- Use React.memo() for PostCard if re-rendering issues

### Risk: SEO impact from URL parameters

**Mitigation**:
- Canonical URL points to default homepage (no params)
- Test Google Search Console for crawl issues post-launch
- Monitor organic traffic for 2 weeks post-deployment
- Add `noindex` to filtered views if duplicate content detected

### Risk: Client-side filtering breaks without JS

**Mitigation**:
- Server-rendered dual-track view works without JS (progressive enhancement)
- Provide `<noscript>` message for filter/pagination features
- Ensure core content (initial 6 posts) always visible

---

## OPEN QUESTIONS & DECISIONS LOG

All questions resolved during research phase. See `research.md` for decision log.

**Key Decisions**:
1. ✅ Client-side filtering with URL state (shareable, bookmarkable)
2. ✅ "Load More" button (better UX than infinite scroll)
3. ✅ Server/client composition (optimal FCP/LCP)
4. ✅ Reuse existing Post type (no breaking changes)
5. ✅ Featured posts server-rendered (optimal LCP for hero images)
