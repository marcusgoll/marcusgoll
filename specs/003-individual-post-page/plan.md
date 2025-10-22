# Implementation Plan: Individual Post Page Enhancements

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15.5.6 App Router + React 19 + TypeScript + Tailwind CSS 4.1.15
- Components to reuse: 7 (getAllPosts, getPostsByTag, PostCard, Image, generateMetadata pattern, Tailwind classes)
- New components needed: 6 (getRelatedPosts, TableOfContents, SocialShare, PrevNextNav, Breadcrumbs, generateBlogPostingSchema)
- Research mode: Full (complex feature with 6 user stories)
- All unknowns resolved during research phase

**Key Decisions**:
1. Tag overlap scoring for related posts (simple, effective for <100 posts)
2. Client-side TOC generation from DOM (simpler than remark plugin)
3. Schema.org JSON-LD in page component (co-located with metadata)
4. Web Share API + explicit buttons (best mobile/desktop UX)
5. Array indexing for prev/next (leverages existing date sort)
6. URL searchParams for breadcrumbs (privacy-friendly, reliable)
7. Reuse PostCard component for related posts (DRY principle)

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Frontend: Next.js 15.5.6 App Router (Server + Client Components)
- Rendering: React 19 with Server Components (RSC)
- Language: TypeScript 5.9.3
- Styling: Tailwind CSS 4.1.15 (existing design system)
- Content: MDX via next-mdx-remote@5.0.0 + gray-matter@4.0.3
- Validation: Zod 4.1.12 (existing for frontmatter schemas)

**Patterns**:
- **Server Components First**: All data fetching in Server Components (no client state for post data)
- **Progressive Enhancement**: Core content accessible without JavaScript, interactivity layered on
- **Component Composition**: Separate concerns (RelatedPosts, TOC, SocialShare, PrevNext, Breadcrumbs as distinct components)
- **Static Generation**: All posts pre-rendered at build time via `generateStaticParams()`
- **Type Safety**: TypeScript strict mode, Zod schemas for runtime validation

**Dependencies** (new packages required):
- None - all features use existing dependencies

**Architecture Rationale**:
- Server Components minimize client bundle (related posts, prev/next calculated server-side)
- Client Components only where needed (TOC scroll spy, social share clipboard)
- Static generation ensures fast page loads (<1.5s FCP target)
- Progressive enhancement maintains accessibility without JavaScript

---

## [STRUCTURE]

**Directory Layout** (follows existing Next.js App Router patterns):

```
app/blog/[slug]/
├── page.tsx                         # Enhanced with all new sections

components/blog/
├── post-card.tsx                    # EXISTS - reuse for related posts
├── related-posts.tsx                # NEW - Server Component
├── table-of-contents.tsx            # NEW - Client Component
├── social-share.tsx                 # NEW - Client Component
├── prev-next-nav.tsx                # NEW - Server Component
└── breadcrumbs.tsx                  # NEW - Server Component

lib/
├── mdx.ts                           # MODIFY - add getRelatedPosts()
├── mdx-types.ts                     # EXISTS - PostData, PostFrontmatter types
└── schema.ts                        # NEW - generateBlogPostingSchema()

specs/003-individual-post-page/
├── spec.md                          # EXISTS
├── research.md                      # CREATED
├── data-model.md                    # CREATED
├── quickstart.md                    # CREATED
├── plan.md                          # THIS FILE
└── error-log.md                     # INITIALIZED
```

**Module Organization**:
- **app/blog/[slug]/page.tsx**: Main post page - orchestrates all enhancement components
- **components/blog/related-posts.tsx**: Displays 3 related posts based on tag overlap
- **components/blog/table-of-contents.tsx**: Generates TOC from headings with scroll spy
- **components/blog/social-share.tsx**: Twitter/LinkedIn/Copy buttons with Web Share API
- **components/blog/prev-next-nav.tsx**: Chronological post navigation
- **components/blog/breadcrumbs.tsx**: Navigation breadcrumbs with schema.org markup
- **lib/mdx.ts**: Core MDX utilities - extended with getRelatedPosts() function
- **lib/schema.ts**: Schema.org JSON-LD generation utilities

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: 5 (RelatedPost, TOCHeading, BreadcrumbSegment, BlogPostingSchema, existing PostData)
- Relationships: All derived from PostData (no database, file-based content)
- Migrations required: No (enhancement to existing file-based system)

**Key Types**:
```typescript
// lib/mdx.ts
interface RelatedPost extends PostData {
  relevanceScore: number; // Tag overlap count
}

// components/blog/table-of-contents.tsx
interface TOCHeading {
  id: string;
  text: string;
  level: 2 | 3;
  slug: string;
  top: number;
}

// components/blog/breadcrumbs.tsx
interface BreadcrumbSegment {
  label: string;
  url: string;
  position: number;
}

// lib/schema.ts
type BlogPostingSchema = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  datePublished: string;
  author: { '@type': 'Person'; name: string; url: string };
  // ... see data-model.md for complete schema
};
```

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Performance: Related posts calculation <50ms, TOC generation <100ms
- NFR-002: Accessibility: WCAG 2.1 AA (keyboard nav, ARIA labels, screen reader support)
- NFR-003: Mobile: Responsive <768px, TOC collapsible, share buttons 44x44px min
- NFR-004: SEO: Schema.org validation passes Google Rich Results Test
- NFR-005: Error Handling: Clipboard fallback, null handling for first/last posts

**Lighthouse Targets** (from constitution.md):
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Core Web Vitals**:
- FCP (First Contentful Paint): <1.5s
- LCP (Largest Contentful Paint): <2.5s
- CLS (Cumulative Layout Shift): <0.15
- TTI (Time to Interactive): <3.5s

**Performance Optimizations**:
- Server-side data fetching (no client-side API calls)
- Static generation (build-time computation for all posts)
- Code splitting (TOC, SocialShare as separate client components)
- Image optimization (Next.js Image for thumbnails)
- Minimal client JavaScript (<15KB total for enhancements)

---

## [SECURITY]

**Authentication Strategy**:
- N/A (public blog posts, no authentication required)

**Authorization Model**:
- N/A (all content publicly accessible)

**Input Validation**:
- Frontmatter validation: Existing Zod schemas in lib/mdx-types.ts
- URL params: Sanitize `?from=` query param to prevent XSS
- Clipboard text: User-initiated (no security concerns)

**Data Protection**:
- No PII collected (client-side features only)
- No cookies/tracking (privacy-friendly)
- Schema.org author URL: Hardcoded (no user input)

**Client-Side Security**:
- Clipboard API: Requires user gesture (secure by design)
- Web Share API: Browser-sandboxed (no security concerns)
- Social share URLs: Properly encoded (prevent injection)

**XSS Prevention**:
- MDX content: Sanitized by next-mdx-remote
- User input: None (no forms, no comments)
- URL params: Escaped before insertion into breadcrumbs

---

## [EXISTING INFRASTRUCTURE - REUSE] (7 components)

**MDX Library (lib/mdx.ts)**:
- `getAllPosts()` (line 49-80): Get all posts sorted by date → Used for prev/next navigation
- `getPostsByTag()` (line 126-133): Filter posts by tag → Foundation for related posts algorithm
- `getPostBySlug()` (line 87-120): Fetch single post → Current post data
- `getAllTags()` (line 139-171): Get all unique tags → Tag metadata (optional use)

**UI Components**:
- `components/blog/post-card.tsx` (full file): Reusable post display → Related posts section
- `next/image` (imported in app/blog/[slug]/page.tsx:14): Optimized images → Post thumbnails
- Tailwind classes (used throughout): Design system → Consistent styling

**Patterns**:
- `generateMetadata()` pattern (app/blog/[slug]/page.tsx:37-68): SEO metadata → Schema.org template
- Server Component data fetching (app/blog/[slug]/page.tsx:73-83): Async data loading → Reusable pattern

---

## [NEW INFRASTRUCTURE - CREATE] (6 components)

**Backend Functions (lib/)**:
1. **lib/mdx.ts:getRelatedPosts(slug, limit = 3)**
   - Purpose: Calculate related posts using tag overlap scoring
   - Input: Current post slug, optional limit (default 3)
   - Output: Array of PostData with relevanceScore, sorted DESC
   - Algorithm:
     1. Get current post tags
     2. Get all posts except current
     3. Score each by counting shared tags
     4. Sort by score DESC, then date DESC
     5. Take top N, fallback to latest if <N with score >0
   - Performance: O(n) where n = total posts (~50-100)

2. **lib/schema.ts:generateBlogPostingSchema(post: PostData)**
   - Purpose: Generate BlogPosting JSON-LD for SEO
   - Input: PostData object
   - Output: JSON-LD object conforming to schema.org/BlogPosting
   - Fields: headline, datePublished, author, image, articleBody, wordCount
   - Validation: Ensure all required fields present

**Frontend Components (components/blog/)**:
3. **components/blog/related-posts.tsx** (Server Component)
   - Props: `currentSlug: string, limit?: number`
   - Data: Calls `getRelatedPosts()` server-side
   - UI: Grid of 3 PostCard components
   - Fallback: "Latest Posts" if <3 related
   - Styling: Tailwind grid, responsive

4. **components/blog/table-of-contents.tsx** (Client Component)
   - Props: None (extracts from DOM)
   - State: `{ headings: TOCHeading[], activeId: string | null, isCollapsed: boolean }`
   - Hooks:
     - `useEffect`: Extract H2/H3 on mount
     - `useEffect`: Intersection Observer for scroll spy
     - `useState`: Collapse state (mobile)
   - UI: Fixed sidebar (desktop), collapsible (mobile)
   - Behavior: Smooth scroll with offset, active highlight

5. **components/blog/social-share.tsx** (Client Component)
   - Props: `url: string, title: string`
   - State: `{ copied: boolean }`
   - Features:
     - Twitter: Opens `twitter.com/intent/tweet?text=${title}&url=${url}`
     - LinkedIn: Opens `linkedin.com/sharing/share-offsite?url=${url}`
     - Copy: Uses `navigator.clipboard.writeText(url)` with fallback
     - Web Share: Mobile-only, uses `navigator.share()` if available
   - Feedback: "✓ Copied" for 2 seconds after copy

6. **components/blog/prev-next-nav.tsx** (Server Component)
   - Props: `currentSlug: string`
   - Data:
     1. Call `getAllPosts()` to get sorted array
     2. Find current post index
     3. Get posts at [index-1] and [index+1]
   - UI: Two buttons (prev/next) with conditional rendering
   - Null handling: Hide button if prev/next doesn't exist

7. **components/blog/breadcrumbs.tsx** (Server Component)
   - Props: `currentPost: PostData, fromTag?: string`
   - Data: Build segments array from props
   - UI: Linked breadcrumb trail with separators
   - Schema: Embedded BreadcrumbList JSON-LD
   - Logic:
     - Segment 1: Home (/)
     - Segment 2: Blog (/blog)
     - Segment 3: Tag if fromTag provided (/blog/tag/${fromTag})
     - Segment N: Current post title (truncated to 60 chars)

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: No changes (standard Vercel deployment)
- Env vars: None required
- Breaking changes: None (backward compatible enhancement)
- Migration: None (no database, no data changes)

**Build Commands**:
- No changes to build process
- Static generation automatically includes new components
- Incremental Static Regeneration (ISR) not needed (static content)

**Environment Variables**:
- No new variables required
- No changes to existing variables
- No secrets needed

**Database Migrations**:
- N/A (file-based content system)

**Smoke Tests** (for deploy-staging.yml):
- Existing test: Visit /blog/welcome-to-mdx → 200 OK
- New checks (add to Playwright tests):
  - Related posts section renders → 3 posts visible
  - TOC appears on long posts → heading links work
  - Share buttons present → click triggers navigation/clipboard
  - Prev/Next buttons render → links are valid
  - Breadcrumbs display → schema.org JSON-LD present

**Platform Coupling**:
- Vercel: No changes (standard Next.js App Router deployment)
- Railway: N/A (frontend-only feature)
- Dependencies: No new packages (uses existing stack)

**Backward Compatibility**:
- ✅ Existing blog posts continue to work
- ✅ URLs unchanged (/blog/[slug])
- ✅ SEO metadata preserved and enhanced (additive)
- ✅ No breaking changes to public API

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants**:
- No breaking changes to existing post URLs
- No breaking changes to frontmatter schema
- All new components optional (posts work if components fail)
- Schema.org JSON-LD validation passes for all posts

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Given user visits https://app-staging.cfipros.vercel.app/blog/welcome-to-mdx
When user scrolls to bottom of post
Then related posts section displays 3 posts
  And each related post has title, excerpt, date
  And clicking related post navigates to that post

Given user visits a long-form post (>5 headings)
When page loads
Then table of contents appears in sidebar (desktop) or collapsible (mobile)
  And TOC lists all H2 and H3 headings
  And clicking TOC link scrolls to section smoothly
  And active section is highlighted in TOC

Given user wants to share a post
When user clicks Twitter share button
Then Twitter intent URL opens in new tab
  And post title and URL are pre-populated

Given user is on any post (not first, not last)
When user scrolls to bottom
Then "← Previous" and "Next →" buttons are visible
  And clicking Previous navigates to older post
  And clicking Next navigates to newer post

Given search engine crawler visits post
When crawler parses HTML
Then BlogPosting JSON-LD is present in <head>
  And schema passes Google Rich Results Test
  And BreadcrumbList schema is present
```

**Rollback Plan**:
- Deploy IDs tracked in: specs/003-individual-post-page/NOTES.md
- Rollback commands: Standard 3-command Vercel alias change
- Special considerations: None (pure enhancement, no breaking changes)
- Rollback testing: Verify in staging before production (standard process)

**Artifact Strategy** (build-once-promote-many):
- Web (App): Vercel prebuilt artifact (.vercel/output/)
- Build in: .github/workflows/verify.yml (on PR)
- Deploy to staging: .github/workflows/deploy-staging.yml (on merge to feature branch)
- Promote to production: .github/workflows/promote.yml (manual trigger after validation)
- No separate artifacts (integrated into existing blog page bundle)

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup: No new dependencies, use existing stack
- Validation workflow: 9 scenarios covering all user stories
- Manual testing: Keyboard nav, screen reader, mobile, performance
- Automated testing: Lighthouse, schema.org validation, Playwright tests

**Key Integration Points**:
1. app/blog/[slug]/page.tsx: Main integration point for all components
2. lib/mdx.ts: Extended with getRelatedPosts() function
3. lib/schema.ts: New file for schema.org utilities
4. components/blog/: New components folder for all enhancements

**Testing Strategy**:
- Unit tests: getRelatedPosts() algorithm, schema generation
- Integration tests: Component rendering, props passing
- E2E tests: Playwright for user flows (Lighthouse CI integration)
- Accessibility tests: axe-core, keyboard nav, screen reader
- Performance tests: Lighthouse CI, bundle size monitoring

---

## [RISK ASSESSMENT]

**Low Risk**:
- ✅ No breaking changes (additive enhancements only)
- ✅ No database migrations (file-based content)
- ✅ No new dependencies (uses existing stack)
- ✅ No authentication changes (public content)
- ✅ Backward compatible (existing posts continue to work)

**Medium Risk**:
- ⚠️  Client bundle size increase (~10-15KB for TOC + social share)
  - Mitigation: Code splitting, lazy loading if needed
- ⚠️  TOC scroll spy performance (Intersection Observer)
  - Mitigation: Throttle observers, test on low-end devices
- ⚠️  Related posts algorithm accuracy (small corpus)
  - Mitigation: Fallback to latest posts, manual testing with real content

**High Risk**:
- None identified

**Unknowns Remaining**:
- None (all resolved during research phase)

