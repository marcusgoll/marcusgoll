# Feature Specification: Individual Post Page Enhancements

**Branch**: `feature/003-individual-post-page`
**Created**: 2025-10-22
**Status**: Draft
**Feature Type**: Enhancement to existing feature (002-tech-stack-cms-integ)

## Executive Summary

Individual blog post pages with dynamic routing (`/blog/[slug]`) already exist (implemented in feature 002). This specification defines **enhancements** to improve reader engagement, content discovery, and SEO performance.

**Current Implementation** (feature 002):
- ✅ Dynamic routing with static generation
- ✅ MDX content rendering with syntax highlighting
- ✅ SEO metadata (title, description, OG tags, Twitter cards)
- ✅ Featured images, author info, reading time, tags
- ✅ Mobile-responsive layout

**Proposed Enhancements** (this feature):
- 🎯 Related posts/suggested reading
- 🎯 Table of contents for long-form posts
- 🎯 Social sharing buttons (Twitter, LinkedIn, copy link)
- 🎯 Schema.org structured data (BlogPosting, Article)
- 🎯 Previous/Next post navigation
- 🎯 Breadcrumb navigation

## User Scenarios

### Primary User Story

As a blog reader, I want to easily discover related content and navigate between posts so that I can explore topics deeply without returning to the blog index.

### Acceptance Scenarios

1. **Given** I finish reading a blog post, **When** I scroll to the bottom, **Then** I see 3 related posts based on shared tags

2. **Given** I'm reading a post with 6+ headings (H2/H3), **When** the page loads, **Then** a table of contents appears in the sidebar with clickable section links

3. **Given** I want to share an interesting post, **When** I click a share button, **Then** I can share to Twitter, LinkedIn, or copy the URL to clipboard

4. **Given** I'm reading a post, **When** I scroll to the bottom, **Then** I see "Previous" and "Next" post navigation to browse chronologically

5. **Given** a search engine crawls a blog post, **When** it parses the HTML, **Then** Schema.org BlogPosting structured data is present for rich snippets

### Edge Cases

- What happens when a post has no related posts (too few shared tags)?
  → Show most recent posts instead, with label "Latest Posts"

- How does TOC behave on mobile devices (limited screen width)?
  → Collapsible toggle at top of article, expanded by default on desktop only

- What if a post has only 1-2 headings (short post)?
  → TOC not displayed (min 3 headings required)

- How are social share links generated for posts without featured images?
  → Use default OG image from site config (public/images/og-default.png)

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a reader, I want to see related posts at the end of articles so that I can discover similar content without navigating back
  - **Acceptance**: Related posts section displays 3 posts with shared tags
  - **Acceptance**: Falls back to "Latest Posts" if <3 related posts available
  - **Acceptance**: Each related post shows title, excerpt (truncated to 120 chars), date, and thumbnail
  - **Independent test**: Create 5 posts with overlapping tags, verify related posts match tag overlap
  - **Effort**: M (4-6 hours)

- **US2** [P1]: As a reader, I want previous/next post navigation so that I can browse posts chronologically without returning to index
  - **Acceptance**: "← Previous" and "Next →" buttons appear at bottom of post
  - **Acceptance**: Buttons link to chronologically adjacent posts (by publish date)
  - **Acceptance**: First/last post shows only one button (disable non-existent direction)
  - **Independent test**: Create 3 posts with different dates, verify navigation follows chronological order
  - **Effort**: S (2-3 hours)

- **US3** [P1]: As a content creator, I want Schema.org structured data on posts so that search engines display rich snippets
  - **Acceptance**: BlogPosting schema includes headline, datePublished, author, image, articleBody
  - **Acceptance**: Validates with Google's Rich Results Test
  - **Acceptance**: Author schema includes name and URL (https://marcusgoll.com)
  - **Independent test**: Run https://search.google.com/test/rich-results against post URL
  - **Effort**: S (2-4 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a reader, I want social sharing buttons so that I can easily share posts on Twitter, LinkedIn, or copy link
  - **Acceptance**: Share buttons for Twitter, LinkedIn, and "Copy Link" appear below post title
  - **Acceptance**: Twitter share includes post title and URL with via @yourusername
  - **Acceptance**: LinkedIn share opens LinkedIn share dialog with URL
  - **Acceptance**: Copy Link button copies URL to clipboard and shows "✓ Copied" confirmation
  - **Depends on**: US1 (uses same layout area)
  - **Effort**: S (3-4 hours)

- **US5** [P2]: As a reader, I want a table of contents for long posts so that I can quickly navigate to specific sections
  - **Acceptance**: TOC auto-generates from H2 and H3 headings (excludes H1 title)
  - **Acceptance**: TOC shows as fixed sidebar on desktop (>1024px width)
  - **Acceptance**: TOC shows as collapsible accordion on mobile (<1024px), collapsed by default
  - **Acceptance**: Clicking TOC link smoothly scrolls to section with 80px offset (for fixed header)
  - **Acceptance**: Active section is highlighted in TOC as user scrolls
  - **Acceptance**: TOC only appears if post has 3+ headings
  - **Depends on**: US1 (layout coordination)
  - **Effort**: M (6-8 hours)

- **US6** [P2]: As a reader, I want breadcrumb navigation so that I understand my location and can navigate back easily
  - **Acceptance**: Breadcrumbs show: Home > Blog > [Tag] > [Post Title]
  - **Acceptance**: Each breadcrumb segment is clickable link
  - **Acceptance**: If accessed via tag page, breadcrumbs include tag; otherwise show Blog
  - **Acceptance**: Uses structured data markup (BreadcrumbList schema)
  - **Depends on**: US3 (schema.org infrastructure)
  - **Effort**: S (3-4 hours)

**Priority 3 (Nice-to-have)**

- **US7** [P3]: As a reader, I want estimated time remaining indicator so that I can plan my reading session
  - **Acceptance**: Progress bar at top shows scroll progress (0-100%)
  - **Acceptance**: Estimated time remaining updates as user scrolls (e.g., "3 min remaining")
  - **Acceptance**: Calculated from total reading time minus scrolled percentage
  - **Depends on**: US5 (scroll position tracking)
  - **Effort**: S (2-3 hours)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (related posts, prev/next nav, schema.org), validate engagement metrics, then add US4-US6 based on user feedback.

## Visual References

See `./visuals/README.md` for UI research and design patterns (if applicable)

## Context Strategy & Signal Design

- **System prompt altitude**: Component-level (specific UI patterns for blog posts)
- **Tool surface**: Read, Glob, Edit (modify existing files), Test (verify related post logic)
- **Examples in scope**:
  1. Related posts algorithm (tag overlap scoring)
  2. TOC generation from headings
  3. Schema.org JSON-LD structure
- **Context budget**: 35k tokens (standard enhancement, existing codebase)
- **Retrieval strategy**: JIT - load existing `app/blog/[slug]/page.tsx` on demand
- **Memory artifacts**: Update `specs/003-individual-post-page/NOTES.md` with implementation decisions
- **Compaction cadence**: After each user story completion
- **Sub-agents**: None (single-file enhancements)

## Requirements

### Functional (testable only)

- **FR-001**: System MUST display 3 related posts at bottom of each blog post, ranked by tag overlap count
- **FR-002**: System MUST display previous/next post navigation based on chronological publish date
- **FR-003**: System MUST generate Schema.org BlogPosting structured data in JSON-LD format
- **FR-004**: System MUST generate table of contents from H2/H3 headings when post has 3+ headings
- **FR-005**: System MUST provide social sharing for Twitter, LinkedIn, and clipboard copy
- **FR-006**: System MUST display breadcrumb navigation showing: Home > Blog > [Tag?] > [Post]
- **FR-007**: Related posts MUST show title, excerpt (max 120 chars), date, and thumbnail
- **FR-008**: TOC MUST highlight active section based on scroll position
- **FR-009**: TOC MUST be fixed sidebar on desktop (>1024px), collapsible on mobile
- **FR-010**: Breadcrumbs MUST use BreadcrumbList schema.org markup
- **FR-011**: Copy Link button MUST show "✓ Copied" confirmation for 2 seconds after click

### Non-Functional

- **NFR-001**: Performance: Related posts calculation <50ms, client-side TOC generation <100ms
- **NFR-002**: Accessibility: TOC keyboard navigable, ARIA labels on share buttons, skip links for navigation
- **NFR-003**: Mobile: All elements responsive <768px, TOC collapsible, share buttons touch-friendly (44x44px min)
- **NFR-004**: SEO: Schema.org validation passes Google Rich Results Test, breadcrumbs validated
- **NFR-005**: Error Handling: Failed clipboard API shows fallback "Press Ctrl+C to copy" with pre-selected URL

### Key Entities (if data involved)

- **RelatedPost**: Derived from PostData with relevance score (tag overlap count)
  - Attributes: `slug`, `title`, `excerpt`, `thumbnail`, `publishDate`, `relevanceScore`
  - Computation: Server-side during static generation

- **TOCHeading**: Extracted from MDX content
  - Attributes: `id`, `text`, `level` (2 or 3), `slug` (for anchor links)
  - Computation: Client-side from DOM on mount

- **BreadcrumbSegment**: Navigation path element
  - Attributes: `label`, `url`, `position`
  - Source: Route params (tag param if from tag page, else blog index)

## Deployment Considerations

**Platform Dependencies**: None (pure enhancement to existing pages)

**Environment Variables**: None

**Breaking Changes**: None - backward compatible

**Migration Requirements**: None

**Rollback Considerations**: Standard 3-command rollback (Vercel alias change)

---

## Quality Gates *(Must pass before `/plan`)*

### Core (Always Required)
- [x] Requirements testable, no [NEEDS CLARIFICATION] markers (all defaults reasonable)
- [x] Constitution aligned (performance <50ms, a11y WCAG 2.1 AA, mobile responsive)
- [x] No implementation details (technology-agnostic requirements)

### Conditional: Success Metrics
- [ ] Not required (no behavioral tracking for this enhancement - focus on implementation)

### Conditional: UI Features
- [ ] Screens not applicable (enhancements to existing screen)
- [ ] System components: Will use existing typography, buttons, links from Tailwind

### Conditional: Deployment Impact
- [x] No breaking changes
- [x] No environment variables
- [x] Standard rollback process

---

## Assumptions

1. **Related Posts Algorithm**: Tag overlap scoring is sufficient for relevance (no ML/NLP needed)
2. **TOC Heading Depth**: H2 and H3 only (H4+ would create excessive nesting)
3. **Social Platforms**: Twitter and LinkedIn cover 90% of professional sharing use cases
4. **Breadcrumb Source**: Tag breadcrumb requires referrer detection or state management (assume from URL params)
5. **Schema.org Author**: Single author (Marcus Gollahon) - no multi-author support needed yet
6. **Share Button Placement**: Below title is conventional and doesn't interrupt reading flow
7. **Mobile TOC Behavior**: Collapsed by default prevents content shift on page load
8. **Related Posts Fallback**: Latest posts ensure section is never empty

## Out of Scope

- Comments system (third-party integration like Disqus, considered future feature)
- Reactions/likes (requires backend state management)
- Print-optimized layout (niche use case)
- Dark mode toggle per-post (site-wide dark mode already exists)
- Reading progress syncing across devices (requires authentication)
- Email sharing (covered by clipboard copy + paste into email client)
- PDF export (requires specialized rendering)

## Success Criteria (Technology-Agnostic, Measurable, Verifiable)

1. **Related Posts Engagement**: Readers click on at least one related post in 25% of sessions with completion (baseline: unknown, target: establish baseline)

2. **Navigation Usage**: Previous/Next buttons account for 15%+ of internal blog navigation events

3. **TOC Interaction**: Table of contents links clicked in 40%+ of long-form posts (>1500 words, 5+ sections)

4. **Social Sharing**: Share buttons used in 5%+ of blog post views (industry avg: 2-3%)

5. **Rich Snippet Appearance**: Google Rich Results Test validates with zero errors for all published posts

6. **Performance**: Page load time remains <2.5s LCP with all enhancements (no regression from current 2.1s baseline)

7. **Accessibility**: Lighthouse accessibility score remains ≥95 with all interactive elements keyboard navigable

8. **Mobile Usability**: All enhancement features functional on viewport sizes 320px-1920px

9. **Clipboard Success**: Copy Link functionality works in 95%+ of modern browsers (Chrome, Firefox, Safari, Edge)

10. **SEO Validation**: Structured data passes validation in Google Search Console with zero warnings

