# Feature Specification: Tech Stack CMS Integration (MDX)

**Branch**: `feature/002-tech-stack-cms-integ`
**Created**: 2025-10-21
**Status**: Draft

## User Scenarios

### Primary User Story

As a content creator and developer, I want to write blog posts using MDX (Markdown + JSX) stored locally in version control, so that I can include interactive React components in my content, track content history with Git, and eliminate dependencies on external CMS platforms.

### Acceptance Scenarios

1. **Given** I create an MDX file in `content/posts/` with frontmatter, **When** I commit and deploy, **Then** the post appears on the blog at `/blog/[slug]`

2. **Given** an existing blog post URL from Ghost CMS, **When** a user visits that URL after migration, **Then** the same content loads with identical formatting and metadata

3. **Given** I embed a React component in MDX content, **When** the page renders, **Then** the component is interactive and fully functional

4. **Given** I add tags and categories to frontmatter, **When** viewing the blog index, **Then** posts are filterable by tags and categories

5. **Given** a user visits the blog, **When** posts load, **Then** performance metrics meet or exceed Ghost CMS baseline (FCP <1.5s, LCP <2.5s)

### Edge Cases

- What happens when frontmatter is missing required fields (title, date, slug)?
  → Build should fail with clear error message indicating missing fields

- How does the system handle invalid MDX syntax?
  → Build-time error with line number and syntax issue details

- What happens to existing Ghost CMS URLs after migration?
  → Redirects preserve SEO; Ghost API remains available during transition period

- How are images referenced in MDX content resolved?
  → Relative paths from `public/images/posts/` directory with Next.js Image optimization

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want to create blog posts using MDX files in a local directory so that my content is version-controlled
  - **Acceptance**: MDX files in `content/posts/` render as blog posts at `/blog/[slug]`
  - **Acceptance**: Frontmatter metadata (title, date, excerpt, tags, author) is parsed and displayed
  - **Acceptance**: Build fails with clear errors if frontmatter validation fails
  - **Independent test**: Create `test-post.mdx`, verify it appears at `/blog/test-post` with correct metadata
  - **Effort**: L (10-12 hours)

- **US2** [P1]: As a content creator, I want to use standard Markdown syntax with YAML frontmatter so that my content is portable and readable
  - **Acceptance**: Standard Markdown (headings, lists, links, images, code blocks) renders correctly
  - **Acceptance**: Syntax highlighting works for code blocks with language specification
  - **Acceptance**: Images use Next.js Image component for optimization
  - **Independent test**: Create post with all Markdown features, verify rendering matches expectations
  - **Effort**: M (6-8 hours)

- **US3** [P1]: As a developer, I want existing `/blog/[slug]` URLs to continue working so that SEO and bookmarks are preserved
  - **Acceptance**: Existing Ghost CMS post URLs remain accessible during transition
  - **Acceptance**: URL structure `/blog/[slug]` is identical for MDX posts
  - **Acceptance**: Metadata (title, description, OG tags) matches Ghost CMS structure
  - **Independent test**: Compare 5 existing Ghost URLs with MDX equivalents for URL structure and metadata consistency
  - **Effort**: S (3-4 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a content creator, I want to embed React components in my blog posts so that I can create interactive content experiences
  - **Acceptance**: Import and use custom React components within MDX content
  - **Acceptance**: Components are interactive (state, events work as expected)
  - **Acceptance**: Component props can be passed from MDX
  - **Depends on**: US1, US2
  - **Effort**: M (5-7 hours)

- **US5** [P2]: As a reader, I want to filter blog posts by tags and categories so that I can find relevant content
  - **Acceptance**: Blog index page displays all available tags
  - **Acceptance**: Clicking a tag filters posts to show only that tag
  - **Acceptance**: URL updates to `/blog/tag/[tag-slug]` for shareable filtered views
  - **Depends on**: US1
  - **Effort**: M (6-8 hours)

**Priority 3 (Nice-to-have)**

- **US6** [P3]: As a developer, I want automatic Table of Contents generation so that readers can navigate long-form posts
  - **Acceptance**: TOC generated from H2/H3 headings in MDX content
  - **Acceptance**: TOC links scroll smoothly to sections
  - **Acceptance**: Active section is highlighted in TOC as user scrolls
  - **Depends on**: US1, US2
  - **Effort**: M (4-6 hours)

- **US7** [P3]: As a content creator, I want to schedule posts for future publication so that I can prepare content in advance
  - **Acceptance**: Posts with `publishedAt` date in future do not appear on blog
  - **Acceptance**: Scheduled posts become visible automatically on publish date
  - **Acceptance**: ISR revalidation updates blog index when post goes live
  - **Depends on**: US1
  - **Effort**: S (3-4 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (local MDX rendering with Ghost URL compatibility), validate with users, then incrementally add US4-US7 based on feedback.

## Hypothesis

> **Purpose**: Migrating from Ghost CMS to MDX-based content management

**Problem**: Ghost CMS creates external dependency and API overhead
- Evidence: `@tryghost/content-api` dependency in package.json; README.md states planned MDX approach (line 13)
- Impact: External hosting costs, API latency, limited content customization (no React components in posts)
- Current limitation: Cannot embed interactive components in blog content

**Solution**: Migrate to local MDX files with Git version control
- Change: Replace Ghost Content API calls with file-system MDX parsing
- Mechanism: `@next/mdx` + `gray-matter` for frontmatter parsing
- Benefit: Zero external dependencies, version-controlled content, React components in posts

**Prediction**: Local MDX will improve build performance and enable richer content
- Primary metric: Build time reduction (remove API calls)
- Expected improvement: -50% reduction in blog page generation time (currently ~300ms with Ghost API)
- Confidence: High (Next.js ISR + local file reads >> external API calls)

## Requirements

### Functional (testable only)

**Content Management**

- **FR-001**: System MUST parse MDX files from `content/posts/` directory during build
- **FR-002**: System MUST extract YAML frontmatter from each MDX file (required fields: title, slug, date, excerpt, author)
- **FR-003**: System MUST generate routes dynamically at `/blog/[slug]` for each MDX file
- **FR-004**: System MUST validate frontmatter schema and fail build with clear errors if invalid

**Content Rendering**

- **FR-005**: System MUST render standard Markdown syntax (headings, lists, links, blockquotes, code blocks)
- **FR-006**: System MUST apply syntax highlighting to code blocks based on language specification
- **FR-007**: System MUST optimize images referenced in MDX using Next.js Image component
- **FR-008**: System MUST support React components imported and used within MDX content

**Metadata & SEO**

- **FR-009**: System MUST generate meta tags (title, description, OG image, canonical URL) from frontmatter
- **FR-010**: System MUST preserve existing URL structure `/blog/[slug]` for SEO continuity
- **FR-011**: System MUST generate RSS feed from MDX post metadata
- **FR-012**: System MUST generate sitemap including all blog posts

**Discovery & Navigation**

- **FR-013**: System MUST list all blog posts on `/blog` index page sorted by date descending
- **FR-014**: System MUST extract unique tags from all posts and provide tag-based filtering
- **FR-015**: System MUST support search/filter on blog index by title, tags, or author

### Non-Functional

- **NFR-001**: Performance: Blog post pages MUST achieve Lighthouse score ≥90 (Performance category)
- **NFR-002**: Performance: First Contentful Paint (FCP) MUST be <1.5s on 3G connection
- **NFR-003**: Performance: Largest Contentful Paint (LCP) MUST be <2.5s on 3G connection
- **NFR-004**: Performance: Blog index page MUST load all posts metadata in <200ms (p95)
- **NFR-005**: Accessibility: All blog pages MUST meet WCAG 2.1 Level AA standards
- **NFR-006**: Accessibility: Code blocks MUST be keyboard-navigable with tab/shift+tab
- **NFR-007**: Mobile: Blog posts MUST be responsive and readable on 320px width screens
- **NFR-008**: Error Handling: Build MUST fail with actionable error message if MDX syntax is invalid
- **NFR-009**: Error Handling: Build MUST fail if required frontmatter fields are missing
- **NFR-010**: Security: User-provided content (comments, if added) MUST be sanitized to prevent XSS

### Key Entities

- **BlogPost**: Individual MDX file representing a blog post
  - Attributes: slug (unique identifier), title, date, excerpt, content (MDX body), tags[], author, featuredImage, publishedAt
  - Relationships: Many-to-many with Tags (via frontmatter array)
  - Storage: File system at `content/posts/[slug].mdx`

- **PostMetadata**: Frontmatter data extracted from MDX
  - Attributes: title (string), slug (string), date (ISO 8601 date), excerpt (string), tags (string[]), author (string), featuredImage (string, optional), publishedAt (ISO 8601 date, optional)
  - Validation: Schema validation at build time using Zod

- **Tag**: Category/topic for organizing posts
  - Attributes: slug (string), displayName (string), postCount (number)
  - Relationships: Many-to-many with BlogPost
  - Derived: Extracted from post frontmatter, no separate storage

## Deployment Considerations

### Platform Dependencies

**Vercel** (marcusgoll.com):
- No platform changes required (Next.js App Router already supports MDX natively)
- Build step: No changes (Next.js handles MDX compilation automatically with `@next/mdx`)

**Railway** (API):
- Not applicable (blog content is frontend-only, no API changes)

**Dependencies**:
- **New**: `@next/mdx@^15.0.0` (MDX support for Next.js 15)
- **New**: `@mdx-js/loader@^3.0.0` (MDX Webpack loader)
- **New**: `@mdx-js/react@^3.0.0` (MDX React runtime)
- **New**: `gray-matter@^4.0.3` (YAML frontmatter parsing)
- **New**: `rehype-highlight@^7.0.0` (syntax highlighting)
- **New**: `remark-gfm@^4.0.0` (GitHub Flavored Markdown)
- **New**: `zod@^3.22.0` (frontmatter schema validation)
- **Optional**: `reading-time@^1.5.0` (reading time estimation)
- **Removed**: `@tryghost/content-api@1.12.0` (Ghost CMS client - remove after migration complete)

### Environment Variables

**Changed Variables**:
- `GHOST_API_URL`: Can be removed after migration complete (keep during transition)
- `GHOST_CONTENT_API_KEY`: Can be removed after migration complete (keep during transition)

**New Variables** (optional):
- None required for basic MDX functionality
- `NEXT_PUBLIC_CONTENT_DIR`: Path to content directory (default: `content/posts`) - only if customization needed

**Schema Update Required**: No (no new secrets, only dependency changes)

### Breaking Changes

**API Contract Changes**:
- No external API (Ghost CMS API is being replaced, not versioned)

**Database Schema Changes**:
- No (blog content is file-based, not database-stored)

**Auth Flow Modifications**:
- No (blog is public content, no auth involved)

**Client Compatibility**:
- Backward compatible: Existing `/blog/[slug]` URLs continue working with identical HTML structure
- RSS feed format preserved for feed readers

### Migration Requirements

**Database Migrations**:
- Not required (no database schema changes)

**Data Backfill**:
- **Required**: Export all existing Ghost CMS posts to MDX files
- Process:
  1. Use Ghost Admin API to export all posts (JSON format)
  2. Convert each post to MDX file with frontmatter
  3. Save to `content/posts/[slug].mdx`
  4. Validate all posts render correctly in local environment
- Estimated count: ~30-50 posts (assumption based on typical blog size)

**Content Migration Script**:
- Create `scripts/migrate-ghost-to-mdx.ts` to automate export
- Preserve: title, slug, excerpt, HTML content (convert to Markdown), tags, author, published date, featured image
- Handle: Special characters in frontmatter, Ghost-specific HTML/shortcodes

**RLS Policy Changes**:
- Not applicable (no database RLS involved)

**Reversibility**:
- Fully reversible: Keep Ghost CMS integration code in place until MDX is production-validated
- Rollback: Toggle feature flag or revert deployment to Ghost-based version
- Transition period: 7-14 days with both Ghost and MDX available

### Rollback Considerations

**Standard Rollback**:
- Yes: 3-command rollback via standard Vercel/Railway deployment rollback

**Special Rollback Needs**:
- Feature flag recommended: `NEXT_PUBLIC_USE_MDX_BLOG=true/false` to toggle between Ghost and MDX during validation
- Ghost CMS must remain operational during transition period (7-14 days)
- Content freeze during migration: No new posts in Ghost after export to avoid sync issues

**Deployment Metadata**:
- Deploy IDs tracked in `specs/002-tech-stack-cms-integ/NOTES.md` (Deployment Metadata section)

---

## Measurement Plan

> **SKIPPED**: No HEART metrics required (infrastructure change with no direct user behavior tracking)
>
> **Performance validation**: Use Lighthouse CI to compare Ghost vs MDX page load times
> - Baseline: Ghost CMS blog post load time (FCP, LCP, TTI)
> - Target: MDX blog post ≤ Ghost baseline (ideally 20-30% faster due to no API calls)
> - Measurement: `.lighthouseci/results/*.json` before and after migration

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)

- [x] Requirements testable, no [NEEDS CLARIFICATION] markers
- [x] Constitution aligned (performance, UX, data, access)
- [x] No implementation details (tech stack, APIs, code)

### Conditional: Success Metrics (Skip if no user tracking)

- [ ] ~~HEART metrics defined~~ (Skipped: Infrastructure change, no user behavior tracking)
- [x] Hypothesis stated (Problem → Solution → Prediction)

### Conditional: UI Features (Skip if backend-only)

- [ ] ~~All screens identified~~ (Skipped: Backend/content infrastructure, no UI components)
- [ ] ~~System components planned~~ (Skipped: No UI components needed)

### Conditional: Deployment Impact (Skip if no infrastructure changes)

- [x] Breaking changes identified (None - backward compatible URL structure)
- [x] Environment variables documented (Ghost env vars can be removed post-migration)
- [x] Rollback plan specified (Feature flag + Ghost CMS kept active during transition)
