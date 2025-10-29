# Tasks: Individual Post Page Enhancements

## [CODEBASE REUSE ANALYSIS]

Scanned: `app/blog/**/*.tsx`, `components/**/*.tsx`, `lib/**/*.ts`

### [EXISTING - REUSE]

- ✅ `getAllPosts()` (lib/mdx.ts:49-80) - Get all posts sorted by date for prev/next navigation
- ✅ `getPostsByTag()` (lib/mdx.ts:126-133) - Foundation for related posts tag overlap algorithm
- ✅ `getPostBySlug()` (lib/mdx.ts:87-120) - Current post data retrieval
- ✅ `PostCard` component (components/blog/post-card.tsx) - Reusable post display for related posts
- ✅ `generateMetadata()` pattern (app/blog/[slug]/page.tsx:37-68) - Template for Schema.org generation
- ✅ `next/image` (Image component) - Already used for featured images
- ✅ Tailwind CSS design system - Existing utility classes for consistent styling
- ✅ `PostData`, `PostFrontmatter` types (lib/mdx-types.ts) - Core MDX type definitions

### [NEW - CREATE]

- 🆕 `getRelatedPosts()` function (lib/mdx.ts) - Tag overlap scoring algorithm
- 🆕 `TableOfContents` component (components/blog/table-of-contents.tsx) - Client component with scroll spy
- 🆕 `SocialShare` component (components/blog/social-share.tsx) - Share buttons with Web Share API
- 🆕 `PrevNextNav` component (components/blog/prev-next-nav.tsx) - Chronological navigation
- 🆕 `Breadcrumbs` component (components/blog/breadcrumbs.tsx) - Navigation breadcrumbs with schema
- 🆕 `generateBlogPostingSchema()` function (lib/schema.ts) - BlogPosting JSON-LD generator

---

## [DEPENDENCY GRAPH]

Story completion order:
1. **Phase 1: Setup** (infrastructure for all stories)
2. **Phase 2: Foundational** (shared utilities that block multiple stories)
3. **Phase 3: US1 [P1]** - Related posts (independent)
4. **Phase 4: US2 [P1]** - Prev/Next navigation (independent)
5. **Phase 5: US3 [P1]** - Schema.org structured data (independent)
6. **Phase 6: US4 [P2]** - Social sharing (independent, can parallel with Phase 7)
7. **Phase 7: US5 [P2]** - Table of contents (independent, can parallel with Phase 6)
8. **Phase 8: US6 [P2]** - Breadcrumbs (depends on US3 schema infrastructure)
9. **Phase 9: Polish** - Cross-cutting concerns

**MVP**: Phase 3, 4, 5 only (US1-US3)

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2**: T003, T004, T005 (different files, no dependencies)
- **Phase 3**: All tasks after T010 setup (US1 is self-contained)
- **Phase 4**: All tasks (US2 is self-contained)
- **Phase 5**: All tasks (US3 is self-contained)
- **Phase 6 + 7**: Can execute in parallel (US4 and US5 independent)
- **Phase 9**: T090, T091, T092, T093 (different files)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 3, 4, 5 (US1: Related posts, US2: Prev/Next, US3: Schema.org)

**Incremental delivery**:
1. Ship MVP (US1-US3) → staging validation → production
2. Add enhancements (US4-US6) → staging validation → production

**Testing approach**: Integration tests for related posts algorithm, E2E tests for user interactions (optional - not explicitly required in spec)

**TDD**: Optional (spec doesn't mandate TDD, focus on implementation correctness)

---

## Phase 1: Setup

- [ ] T001 Create components/blog/ directory for new blog components
  - Files: `components/blog/` (directory)
  - Pattern: Existing `components/mdx/` structure
  - From: plan.md:56-67 [STRUCTURE]

- [ ] T002 Create lib/schema.ts for Schema.org utilities
  - Files: `lib/schema.ts`
  - Pattern: `lib/mdx.ts` (utility functions for content)
  - From: plan.md:72 [STRUCTURE]

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Shared utilities used by multiple user stories

- [ ] T003 [P] Implement getRelatedPosts() in lib/mdx.ts
  - Function signature: `getRelatedPosts(slug: string, limit = 3): Promise<RelatedPost[]>`
  - Algorithm:
    1. Get current post tags from `getPostBySlug(slug)`
    2. Get all posts via `getAllPosts()`, exclude current
    3. Score each by counting shared tags (tag overlap)
    4. Sort by score DESC, then date DESC
    5. Take top N, fallback to latest if <N with score >0
  - REUSE: `getAllPosts()` (lib/mdx.ts:49-80), `getPostBySlug()` (lib/mdx.ts:87-120)
  - Pattern: `getPostsByTag()` (lib/mdx.ts:126-133) for filtering logic
  - From: plan.md:222-232 [NEW INFRASTRUCTURE - CREATE]

- [ ] T004 [P] Create RelatedPost type definition in lib/mdx-types.ts
  - Type: `interface RelatedPost extends PostData { relevanceScore: number }`
  - REUSE: Existing `PostData` type (lib/mdx-types.ts)
  - From: data-model.md:5-25 (RelatedPost entity)

- [ ] T005 [P] Implement generateBlogPostingSchema() in lib/schema.ts
  - Function signature: `generateBlogPostingSchema(post: PostData): BlogPostingSchema`
  - Fields: `@context`, `@type: "BlogPosting"`, `headline`, `datePublished`, `author`, `image`, `articleBody`, `wordCount`
  - Author schema: `{ @type: "Person", name: post.frontmatter.author, url: "https://marcusgoll.com" }`
  - REUSE: `PostData` type (lib/mdx-types.ts)
  - Pattern: `generateMetadata()` (app/blog/[slug]/page.tsx:37-68) for metadata structure
  - From: plan.md:234-240 [NEW INFRASTRUCTURE - CREATE]

---

## Phase 3: User Story 1 [P1] - Related posts at end of articles

**Story Goal**: Display 3 related posts based on tag overlap, fallback to latest posts

**Acceptance Criteria** (from spec.md:66-69):
- Related posts section displays 3 posts with shared tags
- Falls back to "Latest Posts" if <3 related posts available
- Each related post shows title, excerpt (truncated to 120 chars), date, and thumbnail

### Implementation

- [ ] T010 Create RelatedPosts component in components/blog/related-posts.tsx
  - Component type: Server Component (async)
  - Props: `{ currentSlug: string; limit?: number }`
  - Data fetching: Call `getRelatedPosts(currentSlug, limit)` server-side
  - UI: Grid layout with 3 `PostCard` components
  - Fallback: Display "Latest Posts" heading if no related posts with score >0
  - REUSE: `PostCard` component (components/blog/post-card.tsx), `getRelatedPosts()` (lib/mdx.ts)
  - Pattern: `PostCard` grid layout from app/blog/page.tsx
  - From: plan.md:242-247 [NEW INFRASTRUCTURE - CREATE]

- [ ] T011 [US1] Add RelatedPosts section to app/blog/[slug]/page.tsx
  - Location: After MDX content, before closing article tag
  - Import: `RelatedPosts from '@/components/blog/related-posts'`
  - Usage: `<RelatedPosts currentSlug={params.slug} />`
  - Styling: Tailwind classes for spacing and responsive layout
  - From: plan.md:59-60 [STRUCTURE]

---

## Phase 4: User Story 2 [P1] - Previous/Next post navigation

**Story Goal**: Chronological navigation between posts

**Acceptance Criteria** (from spec.md:73-76):
- "← Previous" and "Next →" buttons appear at bottom of post
- Buttons link to chronologically adjacent posts (by publish date)
- First/last post shows only one button (disable non-existent direction)

### Implementation

- [ ] T020 Create PrevNextNav component in components/blog/prev-next-nav.tsx
  - Component type: Server Component (async)
  - Props: `{ currentSlug: string }`
  - Logic:
    1. Call `getAllPosts()` to get sorted array (by date DESC)
    2. Find current post index: `posts.findIndex(p => p.slug === currentSlug)`
    3. Get prev: `posts[index + 1]` (older post), next: `posts[index - 1]` (newer post)
  - UI: Two buttons with conditional rendering (hide if prev/next is undefined)
  - Button text: "← Previous: [title]" and "Next: [title] →"
  - REUSE: `getAllPosts()` (lib/mdx.ts:49-80) - already sorted by date
  - Pattern: Navigation button pattern from existing components
  - From: plan.md:269-277 [NEW INFRASTRUCTURE - CREATE]

- [ ] T021 [US2] Add PrevNextNav section to app/blog/[slug]/page.tsx
  - Location: After RelatedPosts section, before closing article tag
  - Import: `PrevNextNav from '@/components/blog/prev-next-nav'`
  - Usage: `<PrevNextNav currentSlug={params.slug} />`
  - Styling: Tailwind classes for horizontal layout with space-between
  - From: plan.md:59-60 [STRUCTURE]

---

## Phase 5: User Story 3 [P1] - Schema.org structured data

**Story Goal**: Rich snippets for search engines

**Acceptance Criteria** (from spec.md:80-83):
- BlogPosting schema includes headline, datePublished, author, image, articleBody
- Validates with Google's Rich Results Test
- Author schema includes name and URL (https://marcusgoll.com)

### Implementation

- [ ] T030 Add BlogPosting JSON-LD script to app/blog/[slug]/page.tsx
  - Location: Inside `<head>` section (via Next.js metadata API or inline `<script>`)
  - Data: Call `generateBlogPostingSchema(post)` to get JSON-LD object
  - Format: `<script type="application/ld+json">{JSON.stringify(schema)}</script>`
  - REUSE: `generateBlogPostingSchema()` (lib/schema.ts), existing `generateMetadata()` pattern
  - Pattern: app/blog/[slug]/page.tsx:37-68 (metadata generation)
  - From: plan.md:234-240 [NEW INFRASTRUCTURE - CREATE]

---

## Phase 6: User Story 4 [P2] - Social sharing buttons

**Story Goal**: Share posts on Twitter, LinkedIn, or copy link

**Acceptance Criteria** (from spec.md:89-93):
- Share buttons for Twitter, LinkedIn, and "Copy Link" appear below post title
- Twitter share includes post title and URL
- LinkedIn share opens LinkedIn share dialog with URL
- Copy Link button copies URL to clipboard and shows "✓ Copied" confirmation

### Implementation

- [ ] T040 Create SocialShare component in components/blog/social-share.tsx
  - Component type: Client Component (`'use client'`)
  - Props: `{ url: string; title: string }`
  - State: `{ copied: boolean }` (for copy feedback)
  - Features:
    - Twitter: `window.open('https://twitter.com/intent/tweet?text=${title}&url=${url}')`
    - LinkedIn: `window.open('https://linkedin.com/sharing/share-offsite?url=${url}')`
    - Copy: `navigator.clipboard.writeText(url)`, show "✓ Copied" for 2 seconds
    - Web Share (mobile): `navigator.share({ title, url })` if available
  - Styling: Horizontal button group, 44x44px min touch targets
  - Pattern: Button component from existing UI
  - From: plan.md:259-268 [NEW INFRASTRUCTURE - CREATE]

- [ ] T041 [US4] Add SocialShare section to app/blog/[slug]/page.tsx
  - Location: Below post title, above post content
  - Import: `SocialShare from '@/components/blog/social-share'`
  - Usage: `<SocialShare url={absoluteUrl} title={post.frontmatter.title} />`
  - URL construction: `const absoluteUrl = \`https://marcusgoll.com/blog/${params.slug}\``
  - From: plan.md:59-60 [STRUCTURE]

---

## Phase 7: User Story 5 [P2] - Table of contents for long posts

**Story Goal**: Navigate to specific sections in long-form content

**Acceptance Criteria** (from spec.md:97-103):
- TOC auto-generates from H2 and H3 headings (excludes H1 title)
- TOC shows as fixed sidebar on desktop (>1024px width)
- TOC shows as collapsible accordion on mobile (<1024px), collapsed by default
- Clicking TOC link smoothly scrolls to section with 80px offset (for fixed header)
- Active section is highlighted in TOC as user scrolls
- TOC only appears if post has 3+ headings

### Implementation

- [ ] T050 Create TOCHeading type in components/blog/table-of-contents.tsx
  - Type: `interface TOCHeading { id: string; text: string; level: 2 | 3; slug: string; top: number }`
  - From: data-model.md:28-50 (TOCHeading entity)

- [ ] T051 Create TableOfContents component in components/blog/table-of-contents.tsx
  - Component type: Client Component (`'use client'`)
  - Props: None (extracts headings from DOM)
  - State:
    - `headings: TOCHeading[]` (extracted from DOM)
    - `activeId: string | null` (current section)
    - `isCollapsed: boolean` (mobile only, default true)
  - Hooks:
    - `useEffect`: Extract H2/H3 headings via `document.querySelectorAll('h2, h3')` on mount
    - `useEffect`: Intersection Observer to track active section (scroll spy)
  - UI:
    - Desktop (>1024px): Fixed sidebar on right
    - Mobile (<1024px): Collapsible section at top of article
    - Active link: Highlighted with different background color
  - Behavior: Smooth scroll with 80px offset for fixed header
  - Conditional render: Only if `headings.length >= 3`
  - Pattern: Sidebar layout from existing components
  - From: plan.md:249-257 [NEW INFRASTRUCTURE - CREATE]

- [ ] T052 [US5] Add TableOfContents to app/blog/[slug]/page.tsx
  - Location: Inside article wrapper, positioned as sidebar (desktop) or above content (mobile)
  - Import: `TableOfContents from '@/components/blog/table-of-contents'`
  - Usage: `<TableOfContents />`
  - Layout: CSS Grid or Flexbox to position TOC sidebar on desktop
  - From: plan.md:59-60 [STRUCTURE]

---

## Phase 8: User Story 6 [P2] - Breadcrumb navigation

**Story Goal**: Understand location and navigate back easily

**Acceptance Criteria** (from spec.md:107-111):
- Breadcrumbs show: Home > Blog > [Tag] > [Post Title]
- Each breadcrumb segment is clickable link
- If accessed via tag page, breadcrumbs include tag; otherwise show Blog
- Uses structured data markup (BreadcrumbList schema)

### Implementation

- [ ] T060 Create BreadcrumbSegment type in components/blog/breadcrumbs.tsx
  - Type: `interface BreadcrumbSegment { label: string; url: string; position: number }`
  - From: data-model.md:52-70 (BreadcrumbSegment entity)

- [ ] T061 Add generateBreadcrumbListSchema() to lib/schema.ts
  - Function signature: `generateBreadcrumbListSchema(segments: BreadcrumbSegment[]): BreadcrumbListSchema`
  - Schema type: `@type: "BreadcrumbList"`, `itemListElement` array with positions
  - REUSE: Similar JSON-LD structure pattern from `generateBlogPostingSchema()`
  - From: plan.md:278-288 [NEW INFRASTRUCTURE - CREATE]

- [ ] T062 Create Breadcrumbs component in components/blog/breadcrumbs.tsx
  - Component type: Server Component (async)
  - Props: `{ currentPost: PostData; fromTag?: string }`
  - Logic:
    - Segment 1: Home (url: "/", position: 1)
    - Segment 2: Blog (url: "/blog", position: 2)
    - Segment 3 (conditional): Tag (url: `/blog/tag/${fromTag}`, position: 3) if fromTag provided
    - Segment N: Current post title truncated to 60 chars (no link, position: N)
  - UI: Linked breadcrumb trail with " > " separators
  - Schema: Embedded BreadcrumbList JSON-LD via `<script>` tag
  - REUSE: `generateBreadcrumbListSchema()` (lib/schema.ts)
  - Pattern: Navigation pattern from existing components
  - From: plan.md:278-288 [NEW INFRASTRUCTURE - CREATE]

- [ ] T063 [US6] Add Breadcrumbs to app/blog/[slug]/page.tsx
  - Location: Above post title
  - Import: `Breadcrumbs from '@/components/blog/breadcrumbs'`
  - Usage: `<Breadcrumbs currentPost={post} fromTag={searchParams.from} />`
  - Query param: Extract `from` from searchParams (e.g., "tag/aviation")
  - From: plan.md:59-60 [STRUCTURE]

---

## Phase 9: Polish & Cross-Cutting Concerns

### Responsive Design & Mobile Optimization

- [ ] T090 [P] Add responsive styles for all new components
  - Components: RelatedPosts, PrevNextNav, SocialShare, TableOfContents, Breadcrumbs
  - Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
  - Touch targets: Minimum 44x44px for all interactive elements (NFR-003)
  - Pattern: Existing responsive patterns in components/blog/post-card.tsx
  - From: spec.md:170 NFR-003 (Mobile responsiveness)

### Accessibility

- [ ] T091 [P] Add ARIA labels and keyboard navigation
  - Share buttons: `aria-label="Share on Twitter"`, `aria-label="Share on LinkedIn"`, `aria-label="Copy link"`
  - TOC links: `aria-label="Jump to section: [heading text]"`
  - Prev/Next buttons: `aria-label="Previous post: [title]"`, `aria-label="Next post: [title]"`
  - Keyboard: All interactive elements focusable with Tab, activatable with Enter/Space
  - Pattern: Existing ARIA patterns in components
  - From: spec.md:169 NFR-002 (Accessibility WCAG 2.1 AA)

### Performance Optimization

- [ ] T092 [P] Optimize related posts algorithm performance
  - Target: <50ms calculation time (NFR-001)
  - Approach: Cache getAllPosts() result during static generation (no runtime cost)
  - Verify: Add console.time/timeEnd during build to measure
  - From: spec.md:168 NFR-001 (Performance targets)

- [ ] T093 [P] Optimize TOC generation and scroll spy
  - Target: <100ms client-side generation (NFR-001)
  - Approach: Throttle Intersection Observer callbacks, use `useCallback` for handlers
  - Verify: Chrome DevTools Performance tab, measure on low-end device
  - From: spec.md:168 NFR-001 (Performance targets)

### Error Handling

- [ ] T094 Add clipboard API fallback for unsupported browsers
  - Fallback: Show "Press Ctrl+C to copy" with pre-selected URL in text input
  - Detection: Check `if (!navigator.clipboard)`
  - Pattern: Progressive enhancement pattern
  - From: spec.md:172 NFR-005 (Error handling)

### Documentation

- [ ] T095 Update app/blog/[slug]/page.tsx with comments
  - Document: Component integration points, data flow, conditional rendering logic
  - Format: JSDoc comments for exported functions/components
  - Pattern: Existing comment style in codebase

---

## [TASK SUMMARY]

**Total tasks**: 30

**By phase**:
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - Related posts): 2 tasks
- Phase 4 (US2 - Prev/Next): 2 tasks
- Phase 5 (US3 - Schema.org): 1 task
- Phase 6 (US4 - Social sharing): 2 tasks
- Phase 7 (US5 - TOC): 3 tasks
- Phase 8 (US6 - Breadcrumbs): 4 tasks
- Phase 9 (Polish): 6 tasks

**User story tasks**: 11 tasks (marked with [US1]-[US6])

**Parallel opportunities**: 16 tasks (marked with [P])

**REUSE references**: 8 existing modules/components

**MVP scope**: Phase 1, 2, 3, 4, 5 (13 tasks total for US1-US3)

---

## [TESTING NOTES]

**Manual validation scenarios** (from quickstart.md):
1. Related posts algorithm: Visit post, verify 3 related posts with shared tags
2. Prev/Next navigation: Test on first/middle/last post, verify chronological order
3. Schema.org validation: Run https://search.google.com/test/rich-results on post URL
4. Social sharing: Click Twitter/LinkedIn buttons, verify URLs; test Copy Link with clipboard
5. TOC: Create long post (6+ headings), verify TOC appears, test scroll spy
6. Breadcrumbs: Access post from tag page, verify tag in breadcrumbs
7. Accessibility: Test keyboard navigation (Tab through all interactive elements)
8. Mobile: Test responsive behavior on <768px viewport
9. Performance: Run Lighthouse audit, verify Performance ≥85, Accessibility ≥95

**No automated tests required** (spec.md doesn't mandate test files)
