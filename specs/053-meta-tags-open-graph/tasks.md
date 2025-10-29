# Tasks: Meta Tags & Open Graph

## [CODEBASE REUSE ANALYSIS]

Scanned: D:\coding\tech-stack-foundation-core\app\**\*.tsx

[EXISTING - REUSE]
- ✅ generateMetadata() pattern (app/blog/[slug]/page.tsx:72-127) - Complete OG/Twitter metadata structure
- ✅ getImageUrl() helper (app/blog/[slug]/page.tsx:84-89) - Absolute URL generation with fallback
- ✅ Static metadata export (app/aviation/page.tsx:11-15) - Simple const export for static pages
- ✅ Metadata type (Next.js built-in) - Type-safe metadata objects

[NEW - CREATE]
- 🆕 Default OG image (public/images/og/og-default.jpg) - Navy 900 + Emerald 600 brand design
- 🆕 Aviation OG image (public/images/og/og-aviation.jpg) - Aviation-themed with brand colors
- 🆕 Dev/Startup OG image (public/images/og/og-dev.jpg) - Coding-themed with brand colors
- 🆕 Root layout site-wide OG tags (app/layout.tsx) - og:site_name, og:locale, og:type

## [DEPENDENCY GRAPH]

Story completion order:
1. Phase 2: Foundational (default OG image - blocks all pages)
2. Phase 3: US1 [P1] - Open Graph tags on all pages (independent)
3. Phase 4: US2 [P1] - Twitter Card metadata on all pages (depends on US1 metadata structure)
4. Phase 5: US3 [P1] - Default OG image creation (independent, but needed for US1/US2)
5. Phase 6: US4 [P2] - Metadata helper utilities (depends on US1, US2)
6. Phase 7: US5 [P2] - Section-specific OG images (depends on US3)

## [PARALLEL EXECUTION OPPORTUNITIES]

- US1: T010, T011, T012, T013, T014, T015 (different page files, no dependencies)
- US2: T020, T021, T022, T023, T024, T025 (different page files, after US1 complete)
- US3: T030 (independent, can run anytime)
- US5: T050, T051 (different image files, after US3 complete)

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phase 3-5 (US1, US2, US3) - Comprehensive metadata on all pages with default OG image

**Incremental delivery**:
1. US1 + US3 → Add OG tags to all pages with default image
2. US2 → Add Twitter Card metadata to all pages
3. Validate via social platform debug tools (LinkedIn, Twitter, Facebook)
4. Optional: US4 (helper utilities) for maintainability
5. Optional: US5 (section-specific images) for enhanced branding

**Testing approach**: Manual validation via social platform validators (LinkedIn Post Inspector, Twitter Card Validator, Facebook Sharing Debugger)

---

## Phase 1: Setup

- [ ] T001 Create OG images directory structure
  - Directory: public/images/og/
  - Pattern: Standard Next.js public/ directory structure
  - From: plan.md [STRUCTURE]

- [ ] T002 [P] Verify NEXT_PUBLIC_SITE_URL environment variable
  - Check: .env.local and .env.production files
  - Expected: NEXT_PUBLIC_SITE_URL=https://marcusgoll.com (production)
  - Fallback: https://marcusgoll.com if not set
  - From: plan.md [CI/CD IMPACT]

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Infrastructure that blocks all user stories

- [ ] T005 [P] Create default OG image design
  - File: public/images/og/og-default.jpg
  - Specs: 1200x630px JPEG, <200KB
  - Design: Navy 900 (#0F172A) background, Emerald 600 (#059669) accents
  - Content: Site logo + tagline "Teaching systematic thinking from 30,000 feet"
  - Tools: Figma, Canva, or Photoshop
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

---

## Phase 3: User Story 1 [P1] - Open Graph tags on all pages

**Story Goal**: All pages have unique Open Graph tags for rich social sharing previews

**Independent Test Criteria**:
- [ ] Homepage has unique og:title, og:description, og:url, og:type, og:image
- [ ] Aviation section has unique og:title with "Aviation" identifier
- [ ] Dev-startup section has unique og:title with "Dev & Startup" identifier
- [ ] Blog index has og:title "Blog | Marcus Gollahon"
- [ ] Tag pages generate dynamic og:title with "Posts tagged: [Tag Name]"
- [ ] Newsletter page has unique og:title and description
- [ ] All pages validate successfully on LinkedIn Post Inspector

### Implementation

- [ ] T010 [P] [US1] Add root layout site-wide OG tags in app/layout.tsx
  - Add: og:site_name ("Marcus Gollahon"), og:locale ("en_US"), og:type ("website")
  - REUSE: Metadata type (Next.js built-in)
  - Pattern: app/blog/[slug]/page.tsx:100-117 (openGraph structure)
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T011 [P] [US1] Add homepage metadata in app/page.tsx
  - Add: og:title, og:description, og:url, og:image (default)
  - Title: "Marcus Gollahon | Aviation & Software Development"
  - Description: Brand mission statement
  - REUSE: Static metadata export pattern (app/aviation/page.tsx:11-15)
  - Pattern: app/aviation/page.tsx:11-15 (export const metadata)
  - From: spec.md FR-002

- [ ] T012 [P] [US1] Add aviation section metadata in app/aviation/page.tsx
  - Add: og:title, og:description, og:url, og:image (default)
  - Title: "Aviation | Marcus Gollahon"
  - Description: "Aviation career guidance, flight training resources, and CFI insights"
  - REUSE: Existing metadata export (extend with openGraph fields)
  - Pattern: app/blog/[slug]/page.tsx:100-117 (openGraph structure)
  - From: spec.md FR-003

- [ ] T013 [P] [US1] Add dev-startup section metadata in app/dev-startup/page.tsx
  - Add: og:title, og:description, og:url, og:image (default)
  - Title: "Dev & Startup | Marcus Gollahon"
  - Description: "Software development, startup insights, and systematic thinking"
  - REUSE: Existing metadata export (extend with openGraph fields)
  - Pattern: app/blog/[slug]/page.tsx:100-117 (openGraph structure)
  - From: spec.md FR-004

- [ ] T014 [P] [US1] Add blog index metadata in app/blog/page.tsx
  - Add: og:title, og:description, og:url, og:image (default)
  - Title: "Blog | Marcus Gollahon"
  - Description: "Aviation and software development insights"
  - REUSE: Static metadata export pattern
  - Pattern: app/aviation/page.tsx:11-15 (export const metadata)
  - From: spec.md FR-005

- [ ] T015 [P] [US1] Add tag page dynamic metadata in app/blog/tag/[tag]/page.tsx
  - Add: generateMetadata() function with og:title, og:description, og:url, og:image
  - Title: "Posts tagged: [Tag Name] | Marcus Gollahon"
  - Description: "Explore all posts about [Tag Name]"
  - REUSE: generateMetadata() pattern (app/blog/[slug]/page.tsx:72-127)
  - Pattern: app/blog/[slug]/page.tsx:72-127 (async generateMetadata)
  - From: spec.md FR-006

- [ ] T016 [P] [US1] Add newsletter page metadata in app/newsletter/page.tsx
  - Add: og:title, og:description, og:url, og:image (default)
  - Title: "Newsletter | Marcus Gollahon"
  - Description: "Weekly insights on aviation, software development, and systematic thinking"
  - REUSE: Static metadata export pattern
  - Pattern: app/aviation/page.tsx:11-15 (export const metadata)
  - From: spec.md FR-007

---

## Phase 4: User Story 2 [P1] - Twitter Card metadata on all pages

**Story Goal**: All pages have Twitter Card metadata for large image cards on Twitter

**Independent Test Criteria**:
- [ ] All pages have twitter:card "summary_large_image"
- [ ] All pages have twitter:site "@marcusgoll"
- [ ] All pages have twitter:creator "@marcusgoll"
- [ ] All pages have twitter:title, twitter:description, twitter:image
- [ ] All pages validate successfully on Twitter Card Validator

### Implementation

- [ ] T020 [P] [US2] Add Twitter Card metadata to homepage in app/page.tsx
  - Add: twitter.card, twitter.site, twitter.creator, twitter.title, twitter.description, twitter.images
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

- [ ] T021 [P] [US2] Add Twitter Card metadata to aviation section in app/aviation/page.tsx
  - Add: twitter object to existing metadata export
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

- [ ] T022 [P] [US2] Add Twitter Card metadata to dev-startup section in app/dev-startup/page.tsx
  - Add: twitter object to existing metadata export
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

- [ ] T023 [P] [US2] Add Twitter Card metadata to blog index in app/blog/page.tsx
  - Add: twitter object to existing metadata export
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

- [ ] T024 [P] [US2] Add Twitter Card metadata to tag pages in app/blog/tag/[tag]/page.tsx
  - Add: twitter object to generateMetadata() return
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

- [ ] T025 [P] [US2] Add Twitter Card metadata to newsletter page in app/newsletter/page.tsx
  - Add: twitter object to existing metadata export
  - REUSE: Twitter Card structure (app/blog/[slug]/page.tsx:118-125)
  - Pattern: app/blog/[slug]/page.tsx:118-125 (twitter object)
  - From: spec.md FR-008

---

## Phase 5: User Story 3 [P1] - Default OG image with brand colors

**Story Goal**: Default OG image exists for pages without featured images

**Independent Test Criteria**:
- [ ] Default OG image exists at public/images/og/og-default.jpg
- [ ] Image is 1200x630px JPEG format
- [ ] Image file size is <200KB
- [ ] Image has Navy 900 (#0F172A) background
- [ ] Image has Emerald 600 (#059669) accents
- [ ] Image includes site logo or "Marcus Gollahon" text
- [ ] Image displays correctly when shared on LinkedIn/Twitter

### Implementation

- [ ] T030 [US3] Verify default OG image meets specifications
  - Check: public/images/og/og-default.jpg exists
  - Verify: Dimensions 1200x630px, format JPEG, size <200KB
  - Verify: Brand colors Navy 900 and Emerald 600 present
  - Test: Share homepage URL on LinkedIn Post Inspector, verify image loads
  - From: spec.md FR-009

---

## Phase 6: User Story 4 [P2] - Metadata helper utilities (OPTIONAL)

**Story Goal**: Metadata generation is DRY and consistent across pages

**Independent Test Criteria**:
- [ ] Shared utility function exists in lib/metadata.ts
- [ ] getImageUrl() helper extracted from blog post page
- [ ] createBaseMetadata() helper creates consistent metadata structure
- [ ] All pages use helper functions (no duplicated getImageUrl)
- [ ] No functional changes (metadata output identical to before)

### Implementation

- [ ] T040 [P] [US4] Create metadata utility file lib/metadata.ts
  - Export: getImageUrl() function (extracted from app/blog/[slug]/page.tsx:84-89)
  - Export: createBaseMetadata() function (site-wide defaults)
  - REUSE: getImageUrl() logic (app/blog/[slug]/page.tsx:84-89)
  - Pattern: lib/posts.ts (utility function structure)
  - From: spec.md US4

- [ ] T041 [US4] Update all page metadata to use lib/metadata helpers
  - Update: app/page.tsx, app/aviation/page.tsx, app/dev-startup/page.tsx
  - Update: app/blog/page.tsx, app/blog/tag/[tag]/page.tsx, app/newsletter/page.tsx
  - Replace: Inline getImageUrl() calls with import from lib/metadata
  - Verify: npm run build succeeds, no TypeScript errors
  - From: spec.md NFR-004

---

## Phase 7: User Story 5 [P2] - Section-specific OG images (OPTIONAL)

**Story Goal**: Aviation and dev-startup sections have custom OG images

**Independent Test Criteria**:
- [ ] Aviation OG image exists at public/images/og/og-aviation.jpg
- [ ] Dev OG image exists at public/images/og/og-dev.jpg
- [ ] Both images are 1200x630px JPEG, <200KB
- [ ] Aviation image has aviation theme (aircraft silhouette or instrument panel)
- [ ] Dev image has coding theme (code snippet or terminal)
- [ ] Both images have Navy 900 background and Emerald 600 accents
- [ ] Aviation section uses og-aviation.jpg in metadata
- [ ] Dev-startup section uses og-dev.jpg in metadata

### Implementation

- [ ] T050 [P] [US5] Create aviation OG image
  - File: public/images/og/og-aviation.jpg
  - Specs: 1200x630px JPEG, <200KB
  - Design: Navy 900 background, aviation-themed (aircraft silhouette)
  - Content: "Aviation" title + Emerald 600 accent
  - Tools: Figma, Canva, or Photoshop
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T051 [P] [US5] Create dev-startup OG image
  - File: public/images/og/og-dev.jpg
  - Specs: 1200x630px JPEG, <200KB
  - Design: Navy 900 background, coding-themed (code snippet or terminal)
  - Content: "Dev & Startup" title + Emerald 600 accent
  - Tools: Figma, Canva, or Photoshop
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T052 [P] [US5] Update aviation section to use custom OG image
  - Update: app/aviation/page.tsx openGraph.images
  - Change: og-default.jpg → og-aviation.jpg
  - Verify: LinkedIn Post Inspector shows aviation-themed image
  - From: spec.md US5

- [ ] T053 [P] [US5] Update dev-startup section to use custom OG image
  - Update: app/dev-startup/page.tsx openGraph.images
  - Change: og-default.jpg → og-dev.jpg
  - Verify: LinkedIn Post Inspector shows dev-themed image
  - From: spec.md US5

---

## Phase 8: Polish & Cross-Cutting Concerns

### Validation & Testing

- [ ] T080 Validate metadata on LinkedIn Post Inspector
  - Test: Homepage, aviation, dev-startup, blog, newsletter pages
  - Tool: https://www.linkedin.com/post-inspector/
  - Expected: Rich preview with title, description, image for all pages
  - Expected: No validation errors or warnings
  - From: spec.md NFR-003

- [ ] T081 [P] Validate metadata on Twitter Card Validator
  - Test: All page types (homepage, sections, blog, tag, newsletter)
  - Tool: https://cards-dev.twitter.com/validator
  - Expected: summary_large_image card displays correctly
  - Expected: Image shows at 1200x630 resolution
  - From: spec.md NFR-003

- [ ] T082 [P] Validate metadata on Facebook Sharing Debugger
  - Test: Homepage, aviation, dev-startup, blog index
  - Tool: https://developers.facebook.com/tools/debug/
  - Expected: OG image renders at 1200x630
  - Expected: All og: tags present and correct
  - From: spec.md NFR-003

### Performance & Accessibility

- [ ] T085 Verify OG image file sizes
  - Check: All images in public/images/og/ are <200KB
  - Command: ls -lh public/images/og/
  - Expected: og-default.jpg <200KB, og-aviation.jpg <200KB, og-dev.jpg <200KB
  - From: spec.md NFR-001

- [ ] T086 [P] Verify metadata generation performance
  - Test: Measure SSR time with console.time() in development
  - Expected: Metadata generation adds <10ms to render time
  - Command: Check Next.js build output for page generation times
  - From: spec.md NFR-001

- [ ] T087 [P] Add alt text to OG images in metadata
  - Update: All openGraph.images[0].alt fields with meaningful descriptions
  - Verify: Screen reader users get context for social preview images
  - From: spec.md NFR-002

### Deployment Preparation

- [ ] T090 Document social platform cache invalidation process
  - Document: How to clear LinkedIn/Twitter/Facebook caches after deployment
  - Location: specs/053-meta-tags-open-graph/NOTES.md
  - Content: Links to debug tools, "Fetch new information" instructions
  - From: spec.md Technical Notes

- [ ] T091 [P] Verify NEXT_PUBLIC_SITE_URL in production environment
  - Check: Production .env has NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
  - Test: Absolute URLs resolve correctly (not localhost)
  - Fallback: Code defaults to https://marcusgoll.com if unset
  - From: plan.md [CI/CD IMPACT]

- [ ] T092 [P] Run production build and verify metadata in HTML
  - Command: npm run build
  - Check: .next/server/app/*.html files contain og: meta tags
  - Verify: og:image paths are absolute URLs (https://marcusgoll.com/...)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]
