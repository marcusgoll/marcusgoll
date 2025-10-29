# Implementation Plan: JSON-LD Structured Data

## [RESEARCH SUMMARY]

See: research.md for full research findings

**Summary**:
- Stack: Extend existing lib/schema.ts module, use Next.js SSG, extract from constitution.md
- Components to reuse: 6 (BlogPosting generator, frontmatter extraction, JSON-LD embedding pattern)
- New components needed: 4 (Person, Website, Organization schema generators, category mapping utility)
- Research mode: Minimal (backend/data feature, no UI changes)

---

## [ARCHITECTURE DECISIONS]

### Stack

- **Frontend**: Next.js 16.0.1 App Router (existing, no changes)
- **Content**: MDX with gray-matter frontmatter parsing (existing)
- **Schema Generation**: Build-time static generation (SSG)
- **Data Sources**:
  - MDX frontmatter (blog post data)
  - constitution.md (brand/author data)
  - Static configuration (URLs, constants)
- **Validation**: Google Rich Results Test + Schema.org validator
- **Testing**: Jest unit tests + manual validation

### Patterns

**Module Extension Pattern**:
- Extend lib/schema.ts with new generator functions
- Follow existing generateBlogPostingSchema() pattern (lines 108-150)
- Maintain consistent naming: generate[SchemaType]Schema()
- JSDoc comments with Schema.org reference links (NFR-006)

**Build-time Data Extraction**:
- Read constitution.md once per build, cache results
- Use Node.js fs/promises for file reading
- Parse with gray-matter if frontmatter exists
- No runtime file I/O (all generated at build time)

**Category Mapping Strategy** (FR-006):
- Create mapTagsToCategory() utility function
- Priority order: Aviation > Development > Leadership > Blog (default)
- Case-insensitive tag matching
- First matching category wins

**Schema Embedding Pattern**:
- Reuse existing pattern from app/blog/[slug]/page.tsx (lines 180-185)
- Embed in <script type="application/ld+json"> tags
- Place in HTML <head> section
- Multiple schemas per page allowed (BlogPosting + Organization)

### Dependencies

**No new dependencies required**:
- gray-matter: Already installed (package.json line 30)
- zod: Already installed for validation (package.json line 46)
- Node.js built-ins: fs/promises, path (standard library)

---

## [STRUCTURE]

**Directory Layout** (extends existing structure):

```
lib/
├── schema.ts (MODIFIED)
│   ├── generateBlogPostingSchema() [EXTEND with articleSection]
│   ├── generatePersonSchema() [NEW]
│   ├── generateWebsiteSchema() [NEW]
│   ├── generateOrganizationSchema() [NEW]
│   ├── mapTagsToCategory() [NEW utility]
│   └── BlogPostingSchema interface [EXTEND]
│
app/
├── page.tsx (MODIFIED)
│   └── Add Website schema to homepage
│
├── blog/[slug]/page.tsx (MODIFIED)
│   └── Add Organization schema, extend BlogPosting
│
└── about/page.tsx (MODIFIED - if exists, or CREATE)
    └── Add Person schema
```

**Module Organization**:
- **lib/schema.ts**: All schema generation logic (centralized, NFR-005)
- **app/**/page.tsx**: Schema consumption (embed JSON-LD in pages)
- **No new modules**: Extend existing files only

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- Entities: BlogPosting (extended), Person (new), Website (new), Organization (new)
- Relationships: Organization references Person for founder field
- Migrations required: No (no database, static generation only)
- Data sources: MDX frontmatter, constitution.md, static config

**Key Field Additions**:
- BlogPosting.articleSection: Dual-track category from tag mapping

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-001: Schema generation <10ms per page
- NFR-002: JSON-LD size <5KB per page
- NFR-003: Standards compliance with Schema.org 13.0+
- NFR-004: Google Search Central guidelines (in <head>, valid JSON)

**Measurement Strategy**:
- Build-time: Log generation duration per schema type
- Size: Measure JSON.stringify() output length
- Validation: Google Rich Results Test (100% pass rate, NFR-010)

**Performance Baseline**:
- Current BlogPosting: ~2KB, <5ms generation
- Target all schemas: ~4.5KB total, <10ms generation

---

## [SECURITY]

### Authentication Strategy

**N/A** - No authentication required. Public-facing static schemas.

### Authorization Model

**N/A** - All schemas are public data for search engines.

### Input Validation

**Data Sources** (all trusted):
- MDX frontmatter: Validated with Zod schema (existing)
- constitution.md: Static file, controlled by repo owner
- No user input

**Validation Points**:
1. **TypeScript**: Interface enforcement at compile time
2. **Unit Tests**: Validate schema structure and required fields
3. **Google Rich Results Test**: External validation (FR-010)
4. **Schema.org Validator**: Standards compliance (FR-011)

### Data Protection

**No PII**: All data is public-facing brand/content information
- Author name: Public (Marcus Gollahon)
- Social links: Public profiles
- Post content: Public blog posts

**URL Safety**:
- All URLs validated to be absolute (https://)
- Social links restricted to known domains (twitter.com, linkedin.com, github.com)

---

## [EXISTING INFRASTRUCTURE - REUSE] (6 components)

### Schema Generation

**lib/schema.ts:generateBlogPostingSchema()** (lines 108-150)
- Purpose: BlogPosting JSON-LD generation
- Reuse: Pattern for new schema generators
- Extend: Add articleSection field with category mapping

**lib/schema.ts:generateBreadcrumbListSchema()** (lines 160-173)
- Purpose: BreadcrumbList JSON-LD generation
- Reuse: As-is, no changes needed

### Data Extraction

**lib/mdx.ts:getPostBySlug()** (lines 87-120)
- Purpose: Extract frontmatter and content from MDX files
- Reuse: Get tag data for category mapping
- No changes needed

**lib/mdx.ts:PostFrontmatter interface** (lib/mdx-types.ts)
- Purpose: Type-safe frontmatter access
- Reuse: Access tags field for category mapping
- No changes needed

### Schema Embedding

**app/blog/[slug]/page.tsx** (lines 180-185)
- Purpose: JSON-LD embedding pattern
- Reuse: Copy pattern to homepage, About page
- Code snippet:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(schema),
  }}
/>
```

### Brand Data

**constitution.md** (lines 1-759)
- Purpose: Brand mission, values, social links
- Reuse: Extract for Person and Organization schemas
- Read at build time, cache results

---

## [NEW INFRASTRUCTURE - CREATE] (4 components)

### Schema Generators

**lib/schema.ts:generatePersonSchema()**
```typescript
/**
 * Generate Person JSON-LD schema for About page and author references
 * FR-002: Person schema with professional identity
 * FR-007: Extract author data from constitution.md
 *
 * @returns PersonSchema object for JSON-LD
 */
export function generatePersonSchema(): PersonSchema {
  // Read constitution.md, extract brand data
  // Return Person schema with name, jobTitle, description, sameAs, knowsAbout
}
```

**lib/schema.ts:generateWebsiteSchema()**
```typescript
/**
 * Generate Website JSON-LD schema for homepage
 * FR-003: Website schema with search action
 *
 * @returns WebsiteSchema object for JSON-LD
 */
export function generateWebsiteSchema(): WebsiteSchema {
  // Return Website schema with name, url, description, potentialAction
}
```

**lib/schema.ts:generateOrganizationSchema()**
```typescript
/**
 * Generate Organization JSON-LD schema for brand identity
 * FR-004: Organization schema with founder reference
 *
 * @param includeFounder - Whether to include founder Person schema
 * @returns OrganizationSchema object for JSON-LD
 */
export function generateOrganizationSchema(includeFounder = true): OrganizationSchema {
  // Return Organization schema with name, url, logo, founder, sameAs
}
```

**lib/schema.ts:mapTagsToCategory()**
```typescript
/**
 * Map blog post tags to dual-track category for articleSection field
 * FR-006: Tag-to-category mapping
 *
 * Mapping logic:
 * - aviation, flight-training → "Aviation"
 * - development, startup, coding → "Development"
 * - leadership, teaching → "Leadership"
 * - default → "Blog"
 *
 * @param tags - Array of tags from post frontmatter
 * @returns Category string for articleSection
 */
export function mapTagsToCategory(tags: string[]): string {
  // Normalize tags (lowercase), check priority order, return first match
}
```

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Hetzner VPS with PM2 (no Vercel-specific features)
- Env vars: No new variables required
- Breaking changes: No (additive feature only)
- Migration: No database changes

### Build Commands

**No changes required**:
- Build: `npm run build` (existing)
- Start: `npm start` (existing)
- All schema generation happens during Next.js build (SSG)

### Environment Variables

**No new variables required**:
- NEXT_PUBLIC_SITE_URL: Already exists (used for absolute URLs)
- All other data from local files (MDX, constitution.md)

### Database Migrations

**N/A** - No database. All data from static files.

### Smoke Tests

**Manual validation during /preview phase**:
1. Visit homepage → View source → Verify Website schema present
2. Visit blog post → View source → Verify BlogPosting + Organization schemas
3. Visit About page → View source → Verify Person schema
4. Run Google Rich Results Test → Verify 0 errors
5. Run Schema.org validator → Verify 0 warnings

**Automated validation** (US5, FR-010):
- Build-time validation: Jest tests for schema structure
- Post-deployment: Google Rich Results Test API integration (optional)

### Platform Coupling

**None**: Standard Next.js SSG, works on any Node.js hosting
- No Vercel Edge functions
- No platform-specific APIs
- No external services required

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants

**Must hold true post-deployment**:
1. All pages load with valid HTML (schemas don't break rendering)
2. BlogPosting schemas include articleSection field
3. Homepage includes Website schema with SearchAction
4. Google Rich Results Test passes with 0 errors (NFR-010)
5. JSON-LD size <5KB per page (NFR-002)
6. Build time increase <10 seconds (negligible impact)

### Staging Smoke Tests

```gherkin
Given user visits blog post page
When viewing page source
Then BlogPosting schema present with articleSection field
  And Organization schema present
  And all URLs are absolute (https://)
  And JSON validates with Google Rich Results Test

Given user visits homepage
When viewing page source
Then Website schema present with SearchAction
  And SearchAction has {search_term_string} placeholder

Given user visits About page (if exists)
When viewing page source
Then Person schema present with sameAs social links
  And knowsAbout includes Aviation and Software Development
```

### Rollback Plan

**Standard rollback** (no special considerations):
- Deploy IDs tracked in: specs/053-json-ld-structured-data/NOTES.md
- Rollback command: `ssh hetzner && cd /path/to/marcusgoll && git revert <commit-sha> && ./deploy.sh`
- No data migrations to reverse
- No env var changes to revert

**Risk**: Low - additive feature only, doesn't modify existing functionality

### Artifact Strategy

**Build-once, deploy-once** (direct-prod model):
- Build locally or in CI: `npm run build`
- Deploy to Hetzner VPS: `./deploy.sh` (custom script)
- No staging environment (direct production deployment)
- Schemas embedded in static HTML, no separate artifacts

---

## [VALIDATION STRATEGY]

### Build-time Validation

**TypeScript Type Checking**:
- Interfaces enforce schema structure
- Compile-time errors for missing required fields

**Jest Unit Tests** (specs/053-json-ld-structured-data/tests/):
```typescript
describe('generatePersonSchema', () => {
  it('should include all required Schema.org fields', () => {
    const schema = generatePersonSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Marcus Gollahon');
    expect(schema.sameAs).toHaveLength(3); // Twitter, LinkedIn, GitHub
  });
});

describe('mapTagsToCategory', () => {
  it('should map aviation tags to Aviation category', () => {
    expect(mapTagsToCategory(['aviation', 'cfi'])).toBe('Aviation');
  });

  it('should map development tags to Development category', () => {
    expect(mapTagsToCategory(['coding', 'typescript'])).toBe('Development');
  });

  it('should return Blog for unrecognized tags', () => {
    expect(mapTagsToCategory(['random-tag'])).toBe('Blog');
  });
});
```

### Post-deployment Validation

**Google Rich Results Test** (FR-010):
- API: https://search.google.com/test/rich-results
- Manual testing during /preview phase
- Target: 100% pass rate, 0 errors

**Schema.org Validator** (FR-011):
- URL: https://validator.schema.org/
- Paste JSON-LD output, validate against Schema.org spec
- Target: 0 warnings

**Visual Inspection**:
- View page source, locate <script type="application/ld+json">
- Verify JSON is valid (prettify with JSON formatter)
- Check all required fields present

---

## [TESTING STRATEGY]

### Unit Tests

**Coverage target**: 100% for schema generators (simple pure functions)

**Test files**:
- `lib/__tests__/schema.test.ts` (extend existing or create)

**Test cases**:
1. generatePersonSchema(): All required fields present
2. generateWebsiteSchema(): SearchAction structure correct
3. generateOrganizationSchema(): Founder reference valid
4. mapTagsToCategory(): All mapping rules correct
5. generateBlogPostingSchema(): articleSection field added

### Integration Tests

**Manual testing during /preview**:
1. Build site locally: `npm run build && npm start`
2. Visit each page type: homepage, blog post, About
3. View source, verify schemas present
4. Copy JSON-LD to Google Rich Results Test
5. Verify 0 errors, all rich result features available

### Validation Tests

**Automated validation** (optional enhancement for US5):
- Script: `scripts/validate-schemas.js`
- Run: `npm run validate:schemas`
- Logic: Fetch all pages, extract JSON-LD, call Google API
- Report: List pages with errors, fail if any found

---

## [SUCCESS CRITERIA]

**MVP (P1 User Stories)**:
- ✅ US1: BlogPosting schema includes articleSection with dual-track mapping
- ✅ US2: Website schema on homepage with SearchAction
- ✅ US3: Person schema on About page with social profiles

**Quality Gates**:
- ✅ All schemas pass Google Rich Results Test (0 errors)
- ✅ All schemas validate with Schema.org validator (0 warnings)
- ✅ JSON-LD size <5KB per page
- ✅ Build time increase <10 seconds
- ✅ Unit test coverage >95%

**HEART Metrics** (measured post-deployment, 30-60 days):
- Happiness: >60% blog posts show rich snippets in SERP
- Engagement: +15% CTR from organic search
- Adoption: 80% posts indexed with rich results in GSC
- Retention: +25% organic search impressions
- Task Success: 100% schema validation pass rate

---

## [NEXT STEPS]

**After /plan approval**:
1. Run `/tasks` to generate implementation task list
2. Implement schema generators in lib/schema.ts
3. Update page.tsx files to embed new schemas
4. Write Jest unit tests
5. Run `/preview` for manual validation
6. Deploy to production

**Estimated effort**: 6-8 hours total (S-M size)
- Schema generators: 3-4 hours
- Page integration: 1-2 hours
- Testing: 2 hours
- Validation: 1 hour
