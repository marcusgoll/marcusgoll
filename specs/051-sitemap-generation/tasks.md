# Tasks: Sitemap Generation

## [CODEBASE REUSE ANALYSIS]
Scanned: /d/Coding/marcusgoll

[EXISTING - REUSE]
- ✅ getAllPosts() (lib/mdx.ts) - MDX post retrieval with draft filtering
- ✅ PostData type (lib/mdx.ts) - TypeScript type for blog posts
- ✅ NEXT_PUBLIC_SITE_URL (env) - Site base URL configuration
- ✅ Test pattern (lib/__tests__/maintenance-utils.test.ts) - Manual test harness

[NEW - CREATE]
- 🆕 app/sitemap.ts - Next.js App Router metadata route (~50-60 LOC)

[DEPRECATE]
- 🗑️ lib/generate-sitemap.ts - Custom sitemap script (after migration)

## [DEPENDENCY GRAPH]
Story completion order:
1. Phase 1: Setup (environment validation)
2. Phase 2: US1 [P1] - Framework-native sitemap route (independent)
3. Phase 3: US2 [P1] - Blog posts in sitemap (depends on US1)
4. Phase 4: US3 [P1] - Static pages in sitemap (independent from US2, depends on US1)
5. Phase 5: US4 [P2] - Deprecate custom script (depends on US1, US2, US3 complete)
6. Phase 6: US5 [P2] - Priority/frequency metadata (depends on US1, US2, US3)

## [PARALLEL EXECUTION OPPORTUNITIES]
- US1: T005, T006, T007 (tests can run in parallel with implementation)
- US2+US3: T015, T020 (different user stories, no shared code)
- US4+US5: T025, T030 (cleanup vs enhancement, independent)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Phases 2-4 (US1, US2, US3) - Basic sitemap with posts and static pages
**Incremental delivery**: US1+US2+US3 → validate with Google Search Console → US4+US5 (cleanup + metadata)
**Testing approach**: Manual testing (no test framework configured) - validate XML structure, Google Search Console submission

---

## Phase 1: Setup

- [ ] T001 Validate environment variables
  - Check: NEXT_PUBLIC_SITE_URL is set (fallback: https://marcusgoll.com)
  - File: Check .env.local, .env.production
  - From: plan.md [ENVIRONMENT CONFIGURATION]

- [ ] T002 [P] Verify MDX infrastructure exists
  - Check: lib/mdx.ts exports getAllPosts() and PostData type
  - Check: content/posts/*.mdx files exist
  - Pattern: Existing MDX setup
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE]

- [ ] T003 [P] Verify Next.js version supports App Router sitemap
  - Check: Next.js >= 13.3 (current: 15.5.6)
  - Check: next/types exports MetadataRoute.Sitemap
  - From: plan.md [ARCHITECTURE DECISIONS]

---

## Phase 2: User Story 1 [P1] - Framework-native sitemap route

**Story Goal**: Migrate from custom sitemap script to Next.js App Router `sitemap.ts`

**Independent Test Criteria**:
- [ ] Visit /sitemap.xml, verify XML structure matches sitemap protocol
- [ ] Sitemap served with correct Content-Type: application/xml
- [ ] Build succeeds with sitemap generation (no errors)

### Tests (Manual - No Framework)

- [ ] T005 [P] [US1] Create manual test checklist for sitemap validation
  - File: specs/051-sitemap-generation/TESTING.md
  - Checklist: XML structure, content-type, URL format, priority range
  - Pattern: Manual QA checklist (no automated framework)
  - From: spec.md acceptance scenarios

### Implementation

- [ ] T006 [US1] Create app/sitemap.ts with Next.js metadata route
  - File: app/sitemap.ts
  - Export: default async function returning MetadataRoute.Sitemap
  - Return: Empty array (placeholder) with TypeScript type
  - REUSE: MetadataRoute.Sitemap from next/types
  - Pattern: Next.js App Router metadata routes
  - From: plan.md [IMPLEMENTATION STEPS]

- [ ] T007 [US1] Add baseUrl configuration to sitemap
  - File: app/sitemap.ts
  - Logic: const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com'
  - REUSE: NEXT_PUBLIC_SITE_URL environment variable
  - From: plan.md [ENVIRONMENT CONFIGURATION]

### Integration

- [ ] T010 [US1] Test sitemap route locally
  - Action: npm run dev, visit http://localhost:3000/sitemap.xml
  - Verify: XML response, correct Content-Type header
  - Verify: Build succeeds (npm run build)
  - From: spec.md acceptance scenarios

---

## Phase 3: User Story 2 [P1] - Blog posts in sitemap

**Story Goal**: Include all published blog posts in sitemap with lastModified dates

**Independent Test Criteria**:
- [ ] Count posts in sitemap matches count of published MDX files
- [ ] Each post URL format: {baseUrl}/blog/{slug}
- [ ] lastModified date from frontmatter or file timestamp

### Implementation

- [ ] T015 [P] [US2] Add getAllPosts() call to sitemap function
  - File: app/sitemap.ts
  - Import: getAllPosts from '@/lib/mdx'
  - Logic: const posts = await getAllPosts()
  - REUSE: getAllPosts() (lib/mdx.ts) - handles draft filtering
  - From: plan.md [IMPLEMENTATION STEPS]

- [ ] T016 [P] [US2] Map posts to sitemap entries
  - File: app/sitemap.ts
  - Logic: posts.map(post => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.date, changeFrequency: 'weekly', priority: 0.8 }))
  - REUSE: PostData type (lib/mdx.ts)
  - From: plan.md [PRIORITY SCHEME]

### Integration

- [ ] T017 [US2] Verify all posts appear in sitemap
  - Action: Count MDX files in content/posts/, count URLs in sitemap
  - Verify: Counts match (excluding drafts)
  - Verify: Date format is ISO 8601 (YYYY-MM-DD)
  - From: spec.md acceptance scenarios

---

## Phase 4: User Story 3 [P1] - Static pages in sitemap

**Story Goal**: Include homepage and blog list page with high priority

**Independent Test Criteria**:
- [ ] Homepage URL present: / (priority 1.0, daily)
- [ ] Blog list URL present: /blog (priority 0.9, daily)

### Implementation

- [ ] T020 [P] [US3] Add static pages to sitemap
  - File: app/sitemap.ts
  - Add entries: [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 }, { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 }]
  - From: plan.md [PRIORITY SCHEME]

### Integration

- [ ] T021 [US3] Verify static pages in sitemap
  - Action: Visit /sitemap.xml, search for homepage and /blog URLs
  - Verify: Priority values (1.0 and 0.9)
  - Verify: changeFrequency is 'daily'
  - From: spec.md acceptance scenarios

---

## Phase 5: User Story 4 [P2] - Deprecate custom script

**Story Goal**: Remove redundant sitemap implementation

**Depends on**: US1, US2, US3 complete and validated

### Implementation

- [ ] T025 [P] [US4] Delete lib/generate-sitemap.ts
  - File: lib/generate-sitemap.ts (DELETE)
  - Verify: No imports/references in codebase
  - Search: grep -r "generate-sitemap" across project
  - From: plan.md [DEPRECATION PLAN]

- [ ] T026 [P] [US4] Remove sitemap script from package.json
  - File: package.json
  - Remove: Any npm scripts referencing generate-sitemap
  - Verify: Build scripts don't call custom sitemap generation
  - From: plan.md [DEPRECATION PLAN]

### Integration

- [ ] T027 [US4] Verify build still succeeds without custom script
  - Action: npm run build
  - Verify: Sitemap still generated via Next.js (no errors)
  - Verify: /sitemap.xml accessible in production build
  - From: spec.md acceptance scenarios

---

## Phase 6: User Story 5 [P2] - Priority/frequency metadata

**Story Goal**: Refine SEO metadata for optimal crawl scheduling

**Depends on**: US1, US2, US3 (already implemented in previous phases)

### Implementation

- [ ] T030 [P] [US5] Verify priority scheme implementation
  - File: app/sitemap.ts
  - Verify: Homepage (1.0), Blog list (0.9), Posts (0.8)
  - Verify: changeFrequency values (daily for static, weekly for posts)
  - From: plan.md [PRIORITY SCHEME]

- [ ] T031 [P] [US5] Add comments documenting priority rationale
  - File: app/sitemap.ts
  - Comments: Explain why homepage=1.0, blog=0.9, posts=0.8
  - Comments: Link to GitHub Issue #17 for context
  - From: spec.md GitHub Issue reference

---

## Phase 7: Validation & Deployment

### Pre-deployment Validation

- [ ] T035 Validate sitemap against XML schema
  - Tool: https://www.xml-sitemaps.com/validate-xml-sitemap.html
  - Upload: Local sitemap.xml from build output
  - Verify: No schema errors, all URLs valid
  - From: spec.md technical success criteria

- [ ] T036 [P] Submit sitemap to Google Search Console
  - Action: Submit https://marcusgoll.com/sitemap.xml
  - Verify: "Success" status (no errors)
  - Verify: All URLs discovered within 24 hours
  - From: spec.md technical success criteria

### Deployment

- [ ] T040 Document rollback procedure in NOTES.md
  - Procedure: Revert commit (standard 3-command rollback)
  - Feature flag: Not applicable (framework feature, no kill switch needed)
  - Database: Not applicable (no schema changes)
  - From: plan.md [DEPLOYMENT ACCEPTANCE]

- [ ] T041 [P] Update robots.txt verification
  - File: public/robots.txt (verify only, don't modify)
  - Verify: Sitemap: https://marcusgoll.com/sitemap.xml line exists
  - From: spec.md acceptance scenarios

---

## [TASK SUMMARY]

**Total Tasks**: 23
- Phase 1 (Setup): 3 tasks
- Phase 2 (US1 - Framework route): 4 tasks
- Phase 3 (US2 - Blog posts): 3 tasks
- Phase 4 (US3 - Static pages): 2 tasks
- Phase 5 (US4 - Deprecate): 3 tasks
- Phase 6 (US5 - Metadata): 2 tasks
- Phase 7 (Validation): 6 tasks

**Parallel Opportunities**: 11 tasks marked [P]
- Setup: T002, T003
- US1: T005, T006 (tests + implementation)
- US2: T015, T016
- US3: T020
- US4: T025, T026
- US5: T030, T031
- Validation: T036, T041

**REUSE Count**: 4 existing components
- getAllPosts() from lib/mdx.ts
- PostData type from lib/mdx.ts
- NEXT_PUBLIC_SITE_URL environment variable
- Test pattern from lib/__tests__/

**MVP**: Phases 1-4 (US1, US2, US3) - 12 tasks
**Enhancement**: Phases 5-6 (US4, US5) - 5 tasks
**Deployment**: Phase 7 - 6 tasks
