# Tasks: JSON-LD Structured Data

## [CODEBASE REUSE ANALYSIS]

Scanned: D:\Coding\marcusgoll (lib/schema.ts, lib/mdx.ts, app/**/*.tsx)

**[EXISTING - REUSE]**
- ✅ lib/schema.ts:generateBlogPostingSchema() (lines 108-150) - Pattern for new schema generators
- ✅ lib/schema.ts:BlogPostingSchema interface (lines 13-40) - Interface pattern to follow
- ✅ lib/schema.ts:generateBreadcrumbListSchema() (lines 160-173) - No changes needed
- ✅ lib/mdx.ts:getPostBySlug() - Extract tags from frontmatter for category mapping
- ✅ lib/mdx.ts:PostFrontmatter interface - Access tags field for mapping
- ✅ app/blog/[slug]/page.tsx:JSON-LD embedding pattern (generateBlogPostingSchema usage)
- ✅ .spec-flow/memory/constitution.md - Brand data source for Person/Organization schemas

**[NEW - CREATE]**
- 🆕 lib/schema.ts:generatePersonSchema() - No existing pattern (new schema type)
- 🆕 lib/schema.ts:generateWebsiteSchema() - No existing pattern (new schema type)
- 🆕 lib/schema.ts:generateOrganizationSchema() - No existing pattern (new schema type)
- 🆕 lib/schema.ts:mapTagsToCategory() - No existing utility (new mapping logic)
- 🆕 app/about/page.tsx - Page doesn't exist yet (need to create)

---

## [DEPENDENCY GRAPH]

Story completion order:
1. Phase 1: Setup (independent - project structure, no blocking deps)
2. Phase 2: Foundational Infrastructure (blocks all user stories)
   - T005: mapTagsToCategory() utility (blocks US1)
   - T006: Constitution data extraction utilities (blocks US3, US4)
3. Phase 3: US1 [P1] - BlogPosting with dual-track categories (depends on T005)
4. Phase 4: US2 [P1] - Website schema on homepage (independent after Phase 2)
5. Phase 5: US3 [P1] - Person schema on About page (depends on T006)
6. Phase 6: US4 [P2] - Organization schema (depends on US3 Person schema)
7. Phase 7: Polish & Validation (depends on all user stories)

---

## [PARALLEL EXECUTION OPPORTUNITIES]

- **Phase 2**: T005 [P] and T006 [P] (different utilities, no shared state)
- **Phase 3**: T010 [P], T011 [P] (unit tests can run in parallel with implementation planning)
- **Phase 4**: T020 [P] (US2 independent from US1 once mapTagsToCategory exists)
- **Phase 5**: T030 [P], T031 [P] (unit tests + About page creation)
- **Phase 6**: T040 [P] (independent from UI tasks)
- **Phase 7**: T051 [P], T052 [P], T053 [P] (validation tasks for different schema types)

---

## [IMPLEMENTATION STRATEGY]

**MVP Scope**: Phases 3-5 (US1, US2, US3 only)
- Core schemas for all page types (BlogPosting, Website, Person)
- Foundation for Organization schema (US4)
- Manual validation with Google Rich Results Test

**Incremental delivery**:
1. US1 (BlogPosting + articleSection) → Manual validation → Ship
2. US2 (Website schema) → Manual validation → Ship
3. US3 (Person schema) + US4 (Organization schema) → Manual validation → Ship

**Testing approach**: Unit tests required for schema generators and mapping utility (pure functions, easy to test, NFR-006 maintainability)

---

## Phase 1: Setup

- [ ] T001 Verify project structure matches plan.md expectations
  - Files: lib/schema.ts (exists), lib/mdx.ts (exists), app/ pages
  - Pattern: Existing Next.js App Router structure
  - From: plan.md [STRUCTURE]

- [ ] T002 [P] Verify no new dependencies required
  - Files: package.json
  - Check: gray-matter (line 30), zod (line 46) already installed
  - From: plan.md [ARCHITECTURE DECISIONS] Dependencies section

---

## Phase 2: Foundational Infrastructure

**Goal**: Core utilities that block user story implementations

- [ ] T005 [P] Create mapTagsToCategory() utility in lib/schema.ts
  - Function: Map blog post tags to dual-track categories
  - Logic: Aviation > Development > Leadership > Blog (priority order)
  - Case-insensitive matching
  - Pattern: Pure function like existing schema generators
  - From: plan.md [NEW INFRASTRUCTURE - CREATE], data-model.md lines 39-45
  - Acceptance: Returns "Aviation" for ["aviation", "cfi"], "Development" for ["coding"], "Blog" for unknown tags

- [ ] T006 [P] Create constitution data extraction utility
  - Function: Read constitution.md at build time, cache brand data
  - Extract: name, jobTitle, description, social links (sameAs)
  - File: lib/schema.ts or separate lib/constitution.ts
  - Use: Node.js fs/promises for file reading
  - Pattern: Build-time static generation (no runtime I/O)
  - From: plan.md [BUILD-TIME DATA EXTRACTION], data-model.md lines 56-75
  - Acceptance: Returns { name, jobTitle, description, sameAs } from constitution

---

## Phase 3: User Story 1 [P1] - BlogPosting with dual-track categories

**Story Goal**: Blog posts display correct aviation/dev category in Schema.org articleSection field

**Independent Test Criteria**:
- [ ] Visit /blog/[any-post], view page source, verify BlogPosting schema includes articleSection field
- [ ] Aviation posts (tags: aviation, flight-training) → articleSection: "Aviation"
- [ ] Development posts (tags: coding, startup) → articleSection: "Development"
- [ ] Google Rich Results Test passes with 0 errors for BlogPosting schema

### Tests

- [ ] T010 [P] [US1] Write unit test: mapTagsToCategory() returns correct categories
  - File: lib/__tests__/schema.test.ts (create if not exists)
  - Test cases: Aviation tags → "Aviation", Dev tags → "Development", Unknown → "Blog"
  - Pattern: lib/__tests__/maintenance-utils.test.ts (existing test structure)
  - From: plan.md [VALIDATION STRATEGY] lines 402-416
  - Coverage: 100% (simple pure function, all branches tested)

- [ ] T011 [P] [US1] Write unit test: generateBlogPostingSchema() includes articleSection
  - File: lib/__tests__/schema.test.ts
  - Test: Mock post with tags → verify articleSection field present and correct
  - Pattern: Existing unit test structure in lib/__tests__/
  - From: plan.md [TESTING STRATEGY] lines 440-452
  - Coverage: articleSection field present for all tag combinations

### Implementation

- [ ] T015 [US1] Extend BlogPostingSchema interface with articleSection field
  - File: lib/schema.ts (lines 13-40)
  - Add: articleSection: string; (after mainEntityOfPage)
  - Pattern: Existing BlogPostingSchema interface
  - From: data-model.md lines 13-40
  - Acceptance: TypeScript compiles, articleSection field in interface

- [ ] T016 [US1] Extend generateBlogPostingSchema() to include articleSection
  - File: lib/schema.ts (lines 108-150)
  - Logic: Call mapTagsToCategory(post.frontmatter.tags || [])
  - Add field: articleSection: mapTagsToCategory(post.frontmatter.tags || []),
  - REUSE: Existing generateBlogPostingSchema() pattern
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] lines 170-174
  - Acceptance: BlogPosting schema includes articleSection with correct category

---

## Phase 4: User Story 2 [P1] - Website schema on homepage

**Story Goal**: Homepage displays Website schema with SearchAction for Google SERP search box

**Independent Test Criteria**:
- [ ] Visit homepage (https://marcusgoll.com), view page source, verify Website schema present
- [ ] Website schema includes potentialAction with SearchAction type
- [ ] SearchAction target includes {search_term_string} placeholder
- [ ] Google Rich Results Test passes with 0 errors for Website schema

### Tests

- [ ] T020 [P] [US2] Write unit test: generateWebsiteSchema() returns valid Website schema
  - File: lib/__tests__/schema.test.ts
  - Test: All required fields present (@context, @type, name, url, potentialAction)
  - Pattern: Existing schema test structure
  - From: plan.md [VALIDATION STRATEGY] lines 392-416
  - Coverage: 100% (pure function, all fields validated)

### Implementation

- [ ] T025 [US2] Create WebsiteSchema interface in lib/schema.ts
  - Fields: @context, @type, name, url, description, potentialAction (SearchAction)
  - Pattern: Existing BlogPostingSchema interface (lines 13-40)
  - From: data-model.md lines 78-99
  - Acceptance: TypeScript compiles, WebsiteSchema interface complete

- [ ] T026 [US2] Create generateWebsiteSchema() function in lib/schema.ts
  - Return: WebsiteSchema with SearchAction
  - SearchAction target: "https://marcusgoll.com/search?q={search_term_string}"
  - query-input: "required name=search_term_string"
  - Pattern: generateBlogPostingSchema() structure (lines 108-150)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 234-244
  - Acceptance: Function returns valid Website schema with search action

- [ ] T027 [US2] Embed Website schema in app/page.tsx (homepage)
  - File: app/page.tsx (lines 1-47)
  - Location: In metadata or as JSON-LD script tag in component
  - Pattern: app/blog/[slug]/page.tsx JSON-LD embedding
  - REUSE: Existing JSON-LD embedding pattern from blog post page
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] lines 193-204
  - Acceptance: Homepage HTML includes Website schema in <head>

---

## Phase 5: User Story 3 [P1] - Person schema on About page

**Story Goal**: About page displays Person schema with professional identity and social profiles

**Independent Test Criteria**:
- [ ] Visit /about, view page source, verify Person schema present
- [ ] Person schema includes name, jobTitle, description, sameAs with 3+ social links
- [ ] knowsAbout includes "Aviation" and "Software Development"
- [ ] Google Rich Results Test passes with 0 errors for Person schema

### Tests

- [ ] T030 [P] [US3] Write unit test: generatePersonSchema() returns valid Person schema
  - File: lib/__tests__/schema.test.ts
  - Test: All required fields present (name, jobTitle, sameAs, knowsAbout)
  - Pattern: Existing schema test structure
  - From: plan.md [VALIDATION STRATEGY] lines 392-400
  - Coverage: 100% (pure function, all required fields validated)

### Implementation

- [ ] T035 [US3] Create PersonSchema interface in lib/schema.ts
  - Fields: @context, @type, name, jobTitle, description, url, image, sameAs, knowsAbout
  - Pattern: Existing BlogPostingSchema interface
  - From: data-model.md lines 49-76
  - Acceptance: TypeScript compiles, PersonSchema interface complete

- [ ] T036 [US3] Create generatePersonSchema() function in lib/schema.ts
  - Logic: Call constitution extraction utility (T006)
  - Return: PersonSchema with all required fields
  - Data source: constitution.md (brand mission line 19, brand essence line 21)
  - Pattern: generateBlogPostingSchema() structure (lines 108-150)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 219-231
  - Acceptance: Function returns valid Person schema with constitution data

- [ ] T037 [US3] Create app/about/page.tsx (page doesn't exist yet)
  - Component: Server Component with metadata and Person schema
  - Content: About page content (bio, experience, contact)
  - Pattern: app/page.tsx (homepage) structure
  - From: plan.md [STRUCTURE] lines 85-86
  - Acceptance: /about route exists, renders page with Person schema

- [ ] T038 [US3] Embed Person schema in app/about/page.tsx
  - Location: JSON-LD script tag in page component
  - Pattern: app/blog/[slug]/page.tsx JSON-LD embedding
  - REUSE: Existing JSON-LD embedding pattern
  - From: plan.md [EXISTING INFRASTRUCTURE - REUSE] lines 193-204
  - Acceptance: About page HTML includes Person schema in <head>

---

## Phase 6: User Story 4 [P2] - Organization schema on all pages

**Story Goal**: All pages display Organization schema with unified brand entity

**Independent Test Criteria**:
- [ ] Visit any page, view page source, verify Organization schema present
- [ ] Organization schema includes founder field referencing Person schema
- [ ] sameAs links match Person schema social links (consistency)
- [ ] Google Rich Results Test passes with 0 errors for Organization schema

### Tests

- [ ] T040 [P] [US4] Write unit test: generateOrganizationSchema() returns valid Organization schema
  - File: lib/__tests__/schema.test.ts
  - Test: All required fields present (name, url, logo, founder, sameAs)
  - Test: Founder field references Person schema (same data)
  - Pattern: Existing schema test structure
  - From: plan.md [VALIDATION STRATEGY] lines 392-416
  - Coverage: 100% (pure function, founder reference validated)

### Implementation

- [ ] T045 [US4] Create OrganizationSchema interface in lib/schema.ts
  - Fields: @context, @type, name, url, logo (ImageObject), description, founder (PersonSchema), sameAs
  - Pattern: Existing BlogPostingSchema interface
  - From: data-model.md lines 103-128
  - Acceptance: TypeScript compiles, OrganizationSchema interface complete

- [ ] T046 [US4] Create generateOrganizationSchema() function in lib/schema.ts
  - Logic: Call constitution extraction utility (T006) for brand data
  - includeFounder parameter: boolean (default true) for founder Person reference
  - Return: OrganizationSchema with all required fields
  - Pattern: generateBlogPostingSchema() structure (lines 108-150)
  - From: plan.md [NEW INFRASTRUCTURE - CREATE] lines 247-259
  - Acceptance: Function returns valid Organization schema with founder reference

- [ ] T047 [US4] Embed Organization schema in app/blog/[slug]/page.tsx
  - File: app/blog/[slug]/page.tsx (existing blog post page)
  - Location: Add Organization schema alongside existing BlogPosting schema
  - Pattern: Existing generateBlogPostingSchema usage in same file
  - From: plan.md [SCHEMA EMBEDDING PATTERN] lines 49-53
  - Acceptance: Blog post pages include both BlogPosting and Organization schemas

- [ ] T048 [US4] Embed Organization schema in app/page.tsx (homepage)
  - File: app/page.tsx (lines 1-47)
  - Location: Add Organization schema alongside Website schema (T027)
  - Pattern: Same JSON-LD embedding pattern
  - From: plan.md [SCHEMA EMBEDDING PATTERN] lines 49-53
  - Acceptance: Homepage includes both Website and Organization schemas

---

## Phase 7: Polish & Cross-Cutting Concerns

### Manual Validation

- [ ] T051 [P] Validate all schemas with Google Rich Results Test
  - Tool: https://search.google.com/test/rich-results
  - Test: Homepage (Website + Organization), Blog post (BlogPosting + Organization), About (Person)
  - Target: 100% pass rate, 0 errors (NFR-010, FR-010)
  - From: plan.md [VALIDATION STRATEGY] lines 420-423
  - Documentation: Record results in NOTES.md

- [ ] T052 [P] Validate all schemas with Schema.org validator
  - Tool: https://validator.schema.org/
  - Test: Copy JSON-LD output from page source, paste into validator
  - Target: 0 warnings (NFR-003, FR-011)
  - From: plan.md [VALIDATION STRATEGY] lines 425-428
  - Documentation: Record results in NOTES.md

- [ ] T053 [P] Measure JSON-LD size for all page types
  - Measure: Homepage, blog post, About page JSON-LD size
  - Target: <5KB per page (NFR-002)
  - Method: View source, copy JSON-LD, measure with JSON.stringify().length
  - From: plan.md [PERFORMANCE TARGETS] lines 111-127
  - Documentation: Record sizes in NOTES.md

### Documentation

- [ ] T055 Document schema validation results in NOTES.md
  - Content: Google Rich Results Test pass/fail, Schema.org validator results
  - Sizes: JSON-LD size per page type
  - Errors: Any validation errors found and how they were fixed
  - From: plan.md [VALIDATION STRATEGY] lines 419-434

- [ ] T056 Update error-log.md with any issues encountered
  - Issues: Build errors, validation failures, schema generation bugs
  - Resolutions: How each issue was resolved
  - Pattern: Existing error-log.md structure in feature directory
  - From: Workflow standard practice

### Deployment Preparation

- [ ] T060 Add JSDoc comments to all new schema generator functions
  - Functions: generatePersonSchema, generateWebsiteSchema, generateOrganizationSchema, mapTagsToCategory
  - Include: Schema.org reference links, required/optional property lists
  - Pattern: Existing JSDoc on generateBlogPostingSchema (lines 100-107)
  - From: plan.md [ARCHITECTURE DECISIONS] NFR-006 lines 139

- [ ] T061 Document rollback procedure in NOTES.md
  - Command: Standard 3-command rollback (git revert, deploy.sh)
  - Feature flag: N/A (no runtime flag needed, build-time only)
  - Database: N/A (no migrations)
  - From: plan.md [DEPLOYMENT ACCEPTANCE] lines 363-371

- [ ] T062 Add smoke test checklist to NOTES.md
  - Tests: Homepage Website schema, Blog post BlogPosting + Organization, About Person schema
  - Validation: Google Rich Results Test for each page type
  - Manual: View source, verify JSON-LD present and valid
  - From: plan.md [CI/CD IMPACT] lines 310-320

---

## [TEST GUARDRAILS]

**Speed Requirements**:
- Unit tests: <2s each (pure functions, no I/O)
- Full test suite: <30s total (5-6 unit tests × 2-5s each)

**Coverage Requirements**:
- New code: 100% coverage (all new schema generators and utilities)
- Schema generators: All required fields tested
- mapTagsToCategory: All mapping rules tested (Aviation, Development, Leadership, Blog)
- Constitution extraction: All data fields extracted correctly

**Measurement**:
- TypeScript: `npm test -- lib/__tests__/schema.test.ts`
- Coverage: `npm test -- --coverage lib/schema.ts`

**Quality Gates**:
- All tests must pass before manual validation (T051-T053)
- 100% coverage for mapTagsToCategory (simple function, easy to test)
- All schema generators tested for required fields

**Clarity Requirements**:
- One behavior per test
- Descriptive names: `test_mapTagsToCategory_aviation_tags_return_Aviation_category()`
- Given-When-Then structure in test body

**Examples**:
```typescript
// ✅ Good: Behavior test (tests output)
describe('mapTagsToCategory', () => {
  it('should return Aviation for aviation-related tags', () => {
    expect(mapTagsToCategory(['aviation', 'cfi'])).toBe('Aviation');
  });

  it('should return Blog for unrecognized tags', () => {
    expect(mapTagsToCategory(['random-tag'])).toBe('Blog');
  });
});

// ✅ Good: Schema structure test
describe('generatePersonSchema', () => {
  it('should include all required Schema.org fields', () => {
    const schema = generatePersonSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Marcus Gollahon');
    expect(schema.sameAs).toHaveLength(3); // Twitter, LinkedIn, GitHub
  });
});
```

**Reference**: Existing unit tests in lib/__tests__/ for patterns
