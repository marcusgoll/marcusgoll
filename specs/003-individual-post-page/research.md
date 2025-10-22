# Research & Discovery: individual-post-page

## Research Decisions

### Decision: Use existing lib/mdx.ts functions for related posts calculation
- **Decision**: Extend lib/mdx.ts with `getRelatedPosts(slug, limit)` function using tag overlap scoring
- **Rationale**: Existing getAllPosts() and getPostsByTag() functions (lib/mdx.ts:49, 126) already implement tag-based filtering. Tag overlap is a proven relevance algorithm for small-medium blogs.
- **Alternatives**:
  - ML/NLP-based similarity: Rejected (over-engineering for <100 posts, adds dependencies)
  - Content-based (TF-IDF): Rejected (computationally expensive at build time)
  - Manual curation: Rejected (requires content creator maintenance)
- **Source**: lib/mdx.ts:126-133 (getPostsByTag implementation)

### Decision: Client-side TOC generation from DOM
- **Decision**: Extract headings client-side using `useEffect` + `querySelectorAll('h2, h3')` after MDX renders
- **Rationale**: MDX content is rendered server-side by next-mdx-remote, but heading IDs/slugs need to be generated for anchor links. Client-side extraction is simpler than parsing MDX AST.
- **Alternatives**:
  - Remark/rehype plugin for TOC: Rejected (adds build complexity, harder to customize)
  - Server-side HTML parsing: Rejected (requires additional dependencies)
  - Manual TOC in frontmatter: Rejected (requires content creator maintenance)
- **Source**: MDXRemote usage in app/blog/[slug]/page.tsx:139-148

### Decision: Schema.org JSON-LD in page component
- **Decision**: Add JSON-LD script tag to BlogPostPage component (app/blog/[slug]/page.tsx) with BlogPosting schema
- **Rationale**: Next.js supports script tags in Server Components. Keeps schema generation close to metadata for consistency.
- **Alternatives**:
  - Separate schema file: Rejected (unnecessary abstraction for single use case)
  - Third-party library (next-seo): Rejected (adds dependency for simple JSON-LD)
- **Source**: generateMetadata pattern in app/blog/[slug]/page.tsx:37-68

### Decision: Use Web Share API with clipboard fallback
- **Decision**: Implement navigator.share() for mobile, explicit share buttons for desktop (Twitter, LinkedIn, Copy)
- **Rationale**: Native share is best UX on mobile. Desktop users prefer explicit platform buttons.
- **Alternatives**:
  - Share buttons only: Rejected (misses native mobile UX)
  - Web Share API only: Rejected (not supported in all desktop browsers)
- **Source**: MDN Web Share API documentation

### Decision: Prev/Next navigation via sequential array indexing
- **Decision**: In BlogPostPage, get allPosts array, find current index, link to [index-1] and [index+1]
- **Rationale**: getAllPosts() already sorts by date (lib/mdx.ts:70-72), so array order = chronological order
- **Alternatives**:
  - Database query with date filters: Rejected (no database, file-based content)
  - Link list in frontmatter: Rejected (requires manual maintenance)
- **Source**: lib/mdx.ts:70-72 (date sorting implementation)

### Decision: Breadcrumbs from URL params (no referrer tracking)
- **Decision**: Detect tag breadcrumb segment from URL searchParams (?from=tag/aviation), default to "Blog"
- **Rationale**: Avoids referrer tracking (privacy-friendly), works with direct links, persists through refresh
- **Alternatives**:
  - Referrer header: Rejected (unreliable, privacy concerns)
  - Session storage: Rejected (doesn't persist across tabs)
  - Server-side route tracking: Rejected (adds complexity)
- **Source**: Next.js useSearchParams documentation

### Decision: Reuse PostCard component for related posts
- **Decision**: Use existing PostCard component (components/blog/post-card.tsx) with minor variant for compact layout
- **Rationale**: DRY principle - PostCard already displays title, excerpt, date, tags (lines 14-57)
- **Alternatives**:
  - New RelatedPostCard component: Rejected (duplicates code)
  - Inline HTML in BlogPostPage: Rejected (not reusable, harder to maintain)
- **Source**: components/blog/post-card.tsx:14-57

---

## Components to Reuse (7 found)

- **lib/mdx.ts:getAllPosts()** - Get all posts sorted by date for prev/next navigation
- **lib/mdx.ts:getPostsByTag()** - Foundation for related posts tag overlap algorithm
- **lib/mdx.ts:getPostBySlug()** - Current post data retrieval
- **components/blog/post-card.tsx** - Reusable post display for related posts section
- **app/blog/[slug]/page.tsx:generateMetadata()** - Pattern for Schema.org metadata generation
- **next/image (Image component)** - Already used for featured images, can use for thumbnails
- **Tailwind CSS classes** - Existing design system (bg-gray-100, rounded-full, etc.)

---

## New Components Needed (6 required)

- **lib/mdx.ts:getRelatedPosts(slug, limit)** - Tag overlap scoring algorithm (returns sorted array)
- **components/blog/table-of-contents.tsx** - Client component with heading extraction, scroll spy, responsive layout
- **components/blog/social-share.tsx** - Share buttons (Twitter, LinkedIn, Copy) with Web Share API integration
- **components/blog/prev-next-nav.tsx** - Previous/Next post navigation with null handling for first/last
- **components/blog/breadcrumbs.tsx** - Breadcrumb navigation with BreadcrumbList schema
- **lib/schema.ts:generateBlogPostingSchema()** - Helper function to generate BlogPosting JSON-LD from PostData

---

## Unknowns & Questions

None - all technical questions resolved during research phase

**Resolved during research:**
- ✅ Related posts algorithm: Tag overlap scoring (simple, effective for small corpus)
- ✅ TOC generation: Client-side DOM extraction (simpler than remark plugin)
- ✅ Schema.org placement: JSON-LD in page component (co-located with metadata)
- ✅ Social sharing: Web Share API + explicit buttons (best of both worlds)
- ✅ Prev/Next logic: Array indexing on sorted getAllPosts() (leverages existing sort)
- ✅ Breadcrumb source: URL searchParams (privacy-friendly, reliable)
- ✅ Component reuse: PostCard for related posts (DRY principle)

