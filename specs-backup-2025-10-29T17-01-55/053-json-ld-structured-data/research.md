# Research & Discovery: 053-json-ld-structured-data

## Research Mode

**Mode**: Minimal (backend/data feature, no UI components)

**Rationale**: Simple feature extending existing schema.ts module with new schema types. No new UI, no new architecture patterns needed.

---

## Research Decisions

### Decision: Extend lib/schema.ts module

- **Decision**: Add new schema generator functions to existing lib/schema.ts
- **Rationale**: BlogPosting schema already exists (line 108-150). Follow established pattern for consistency.
- **Alternatives**:
  - Create new lib/json-ld.ts (rejected - already exists at D:\Coding\marcusgoll\lib\json-ld.ts but uses different pattern)
  - Create separate lib/structured-data.ts (rejected - creates duplication)
- **Source**: lib/schema.ts:1-174, lib/json-ld.ts:1-122

### Decision: Extract author data from constitution.md

- **Decision**: Read D:\Coding\marcusgoll\.spec-flow\memory\constitution.md for Person schema fields
- **Rationale**: FR-007 requires extracting brand profile from constitution. Constitution lines 19-22 define brand mission and essence.
- **Alternatives**:
  - Hardcode in schema.ts (rejected - violates DRY, makes updates error-prone)
  - Store in separate config file (rejected - constitution already exists as SSOT)
- **Source**: constitution.md:1-759

### Decision: Dual-track category mapping from tags

- **Decision**: Map tags to articleSection using spec-defined categories
- **Rationale**: FR-006 specifies exact mapping: aviation/flight-training → Aviation, development/startup/coding → Development, leadership/teaching → Leadership
- **Alternatives**:
  - Use first tag as-is (rejected - tags too specific, need broader categories for schema)
  - Create separate category field in frontmatter (rejected - adds complexity, tags sufficient)
- **Source**: spec.md FR-006

### Decision: No new dependencies required

- **Decision**: Use Node.js built-in fs/promises for reading constitution.md
- **Rationale**: All required packages already installed (gray-matter for MDX, zod for validation)
- **Alternatives**: N/A
- **Source**: package.json:17-46

### Decision: Use existing BlogPosting schema as foundation

- **Decision**: Extend generateBlogPostingSchema() to add articleSection field
- **Rationale**: Schema already exists with correct structure (lines 108-150). Just need to add articleSection mapping.
- **Alternatives**:
  - Rewrite from scratch (rejected - unnecessary, existing code works)
  - Use lib/json-ld.ts pattern (rejected - different naming convention, less complete)
- **Source**: lib/schema.ts:108-150

### Decision: Static generation at build time

- **Decision**: Generate all schemas during Next.js build (SSG), no runtime generation
- **Rationale**: NFR-001 requires <10ms per page. Static generation = 0ms runtime cost.
- **Alternatives**:
  - Runtime generation on each request (rejected - violates performance requirement)
  - Edge middleware generation (rejected - over-engineered for simple data transformation)
- **Source**: spec.md NFR-001

---

## Components to Reuse (6 found)

- `lib/schema.ts`: BlogPosting schema generation (line 108-150) - extend with articleSection
- `lib/schema.ts`: BreadcrumbList schema generation (line 160-173) - reuse for all pages
- `lib/mdx.ts`: Frontmatter extraction (line 87-120) - use getPostBySlug() for tag data
- `app/blog/[slug]/page.tsx`: JSON-LD embedding pattern (line 180-185) - copy for new schemas
- `constitution.md`: Brand profile data (lines 19-22, 379-501) - extract for Person schema
- `package.json`: gray-matter library (line 30) - parse constitution frontmatter if needed

---

## New Components Needed (4 required)

- `lib/schema.ts:generatePersonSchema()`: New function for Person JSON-LD (About page)
- `lib/schema.ts:generateWebsiteSchema()`: New function for Website JSON-LD with SearchAction (homepage)
- `lib/schema.ts:generateOrganizationSchema()`: New function for Organization JSON-LD (all pages)
- `lib/schema.ts:mapTagsToCategory()`: Utility function for dual-track category mapping (FR-006)

---

## Unknowns & Questions

None - all technical questions resolved. Spec is unambiguous with clear defaults.

---

## Constitution Alignment Check

✅ **Aligned with constitution**

- **Systematic Clarity** (Principle 1): Structured data improves SEO systematically, follows Schema.org standards
- **Teaching-First Content** (Principle 5): Rich snippets help users find educational content faster
- **Documentation Standards** (Principle 6): JSDoc comments required for all schema functions (NFR-006)
- **Specification First** (Engineering Principle 1): Feature has complete spec with testable requirements
- **Performance Requirements** (Engineering Principle 3): <10ms generation time specified (NFR-001)
- **Do Not Overengineer** (Engineering Principle 8): Extends existing module, no new abstractions

No constitution violations detected.

---

## Technical Stack Context

**Frontend Framework**: Next.js 16.0.1 (package.json line 32)
- App Router architecture (app/ directory structure)
- Server Components for data fetching
- Static Site Generation (SSG) for blog posts

**Content Management**: MDX with gray-matter (package.json line 30)
- Frontmatter validation with Zod (package.json line 46)
- Content stored in content/posts/ directory

**Deployment**: Hetzner VPS with PM2
- No Vercel-specific features used
- Standard Node.js server deployment
- Build-time generation for all static content

**Testing**: Jest + React Testing Library (package.json lines 60-61)
- Unit tests for schema generators required
- Google Rich Results Test for validation (FR-010)

---

## Performance Baseline

**Current BlogPosting generation**: <5ms per post (estimated from existing implementation)
- Simple object creation, no external API calls
- All data from frontmatter (already parsed)

**Target for new schemas**: <10ms per page (NFR-001)
- Person schema: Static data from constitution (1 file read at build time)
- Website schema: Static data, no file reads
- Organization schema: Static data, no file reads

**Build time impact**: Negligible
- 4 new functions, all synchronous object creation
- Constitution read once per build (cached)
- No network requests, no heavy computation
