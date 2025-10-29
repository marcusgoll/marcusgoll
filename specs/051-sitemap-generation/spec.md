# Feature Specification: Sitemap Generation

**Branch**: `feature/051-sitemap-generation`
**Created**: 2025-10-29
**Status**: Draft
**GitHub Issue**: #17

## User Scenarios

### Primary User Story

As a **search engine crawler** (Googlebot, Bing), I want a comprehensive XML sitemap so that I can efficiently discover and index all content on marcusgoll.com.

As a **content creator** (Marcus), I want an automatically updated sitemap so that new content is immediately discoverable without manual intervention.

### Acceptance Scenarios

1. **Given** a new blog post is published, **When** the site is deployed, **Then** the sitemap automatically includes the new post without manual script execution

2. **Given** a search engine crawler visits `/sitemap.xml`, **When** it parses the XML, **Then** it finds all published blog posts with correct priority, change frequency, and last modified dates

3. **Given** the homepage and blog list page are frequently updated, **When** the sitemap is generated, **Then** these pages show daily change frequency and priority 1.0/0.9 respectively

4. **Given** robots.txt already references the sitemap, **When** a crawler checks robots.txt, **Then** it finds the correct sitemap URL and can follow it

### Edge Cases

- What happens when MDX post frontmatter is missing a date? → Falls back to current date or file modified timestamp
- How does system handle 100+ blog posts? → Next.js handles pagination automatically (50K URL limit)
- What if MDX processing fails during sitemap generation? → Build fails with clear error message, prevents deployment with stale sitemap
- How are draft posts excluded? → Filter by `published: true` in frontmatter (or exclude posts without dates)

## User Stories (Prioritized)

### Story Prioritization

**Priority 1 (MVP) 🎯**

- **US1** [P1]: As a developer, I want to migrate from custom sitemap script to Next.js App Router `sitemap.ts` so that sitemap generation is framework-native and automatic
  - **Acceptance**: `app/sitemap.ts` file created, exports MetadataRoute.Sitemap array, accessible at `/sitemap.xml`
  - **Independent test**: Visit `/sitemap.xml`, verify XML structure matches sitemap protocol
  - **Effort**: S (2-4 hours)

- **US2** [P1]: As a search engine, I want all published blog posts in the sitemap so that I can index all content
  - **Acceptance**: Sitemap includes all MDX posts from `content/posts/`, uses frontmatter date for lastModified
  - **Independent test**: Count posts in sitemap matches count of published MDX files
  - **Effort**: S (2-4 hours)

- **US3** [P1]: As a search engine, I want static pages (homepage, blog list) in the sitemap so that I can discover all site sections
  - **Acceptance**: Sitemap includes `/` (priority 1.0) and `/blog` (priority 0.9)
  - **Independent test**: Verify homepage and blog list URLs present in sitemap XML
  - **Effort**: XS (<2 hours)

**Priority 2 (Enhancement)**

- **US4** [P2]: As a developer, I want to deprecate the custom sitemap script so that the codebase doesn't have redundant implementations
  - **Acceptance**: `lib/generate-sitemap.ts` deleted, no references in codebase
  - **Depends on**: US1, US2, US3
  - **Effort**: XS (<1 hour)

- **US5** [P2]: As a search engine, I want accurate priority and change frequency metadata so that I can optimize my crawl schedule
  - **Acceptance**: Homepage (1.0, daily), Blog list (0.9, daily), Posts (0.8, weekly)
  - **Depends on**: US1, US2, US3
  - **Effort**: XS (<1 hour)

**Priority 3 (Nice-to-have)**

- **US6** [P3]: As a search engine, I want featured images in the sitemap (image sitemap extension) so that I can index visual content
  - **Acceptance**: Sitemap includes `<image:image>` tags for posts with featured images in frontmatter
  - **Depends on**: US1, US2 (plus featured image support in content)
  - **Effort**: M (4-8 hours, includes adding featured images to MDX frontmatter schema)

**Effort Scale**:
- XS: <2 hours
- S: 2-4 hours
- M: 4-8 hours (½ day)
- L: 8-16 hours (1-2 days)
- XL: 16+ hours (>2 days, consider breaking down)

**MVP Strategy**: Ship US1-US3 first (basic sitemap with posts and static pages), validate with Google Search Console, then add US4-US5 for cleanup and metadata refinement. US6 deferred until featured image support added to content.

## Visual References

Not applicable (backend-only feature, no UI components)

## Success Metrics (HEART Framework)

**SKIP**: No user behavior tracking needed (infrastructure feature)

**Technical Success Criteria**:
- Sitemap validates against XML sitemap protocol schema
- Google Search Console shows "Success" status for sitemap submission
- All published blog posts appear in sitemap within 24 hours of deployment
- No manual script execution required for sitemap updates

## Screens Inventory (UI Features Only)

**SKIP**: Backend-only feature (no UI components)

## Hypothesis

**Problem**: Custom sitemap generator (`lib/generate-sitemap.ts`) requires manual execution and doesn't integrate with Next.js build system
- Evidence: Script exists but not called in `package.json` build process
- Impact: Sitemap may become stale if developer forgets to run script before deployment

**Solution**: Migrate to Next.js App Router native `sitemap.ts` for automatic generation on every build
- Change: Replace custom script with `app/sitemap.ts` returning `MetadataRoute.Sitemap` array
- Mechanism: Next.js automatically generates `/sitemap.xml` route during build process

**Prediction**: Sitemap will always be up-to-date without manual intervention
- Primary metric: 100% of published posts appear in sitemap after deployment
- Expected improvement: From manual/inconsistent to automatic/always fresh
- Confidence: High (Next.js built-in feature, well-documented, standard implementation)

## Requirements

### Functional Requirements

**FR-001**: Sitemap must be generated automatically during Next.js build process
- Implementation: Create `app/sitemap.ts` that exports default function returning `MetadataRoute.Sitemap`
- Next.js automatically generates `/sitemap.xml` route from this file

**FR-002**: Sitemap must include all published blog posts
- Source: `getAllPosts()` from `lib/mdx.ts`
- Last modified: Use MDX frontmatter `date` field
- Priority: 0.8
- Change frequency: weekly

**FR-003**: Sitemap must include static pages (homepage, blog list)
- Homepage (`/`): priority 1.0, changefreq daily
- Blog list (`/blog`): priority 0.9, changefreq daily

**FR-004**: Sitemap must use correct site URL from environment variable
- Read from `process.env.NEXT_PUBLIC_SITE_URL` or default to `https://marcusgoll.com`

**FR-005**: Sitemap must follow XML sitemap protocol 0.9 specification
- Root element: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
- Each URL element contains: `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`

**FR-006**: Custom sitemap script must be deprecated after migration
- Delete `lib/generate-sitemap.ts`
- Remove any references in build scripts or documentation

### Non-Functional Requirements

**NFR-001**: Sitemap generation must not significantly increase build time
- Target: <5 seconds additional build time for 50 posts
- Constraint: Sitemap generation happens during build, not runtime

**NFR-002**: Sitemap must be type-safe
- Use Next.js `MetadataRoute.Sitemap` type from `next/types`
- TypeScript compilation must catch malformed sitemap entries

**NFR-003**: Sitemap generation errors must fail the build
- If MDX processing fails, build should stop with clear error message
- Prevents deployment with incomplete or stale sitemap

**NFR-004**: Sitemap must be accessible at `/sitemap.xml` (canonical URL)
- Next.js App Router automatically handles this from `app/sitemap.ts`

**NFR-005**: Solution must be maintainable by solo developer
- Use framework-native features (no additional dependencies)
- Clear code comments explaining sitemap structure
- No complex build pipeline modifications

## Context Strategy & Signal Design

### Context for Decision Making

**Available Context**:
1. MDX post metadata (title, date, slug) from `getAllPosts()`
2. Site URL from environment variable (`NEXT_PUBLIC_SITE_URL`)
3. Static route structure (known pages: `/`, `/blog`)

**Context Quality**:
- MDX frontmatter is authoritative source for post dates
- Static routes are hard-coded (predictable, no dynamic discovery needed)
- File system is read at build time (no runtime filesystem access)

### Signal Design

**Signals to Track** (for validation):
- Google Search Console sitemap submission status (external signal)
- Count of URLs in sitemap matches count of published posts (internal signal)
- Sitemap accessibility test (HTTP 200 response at `/sitemap.xml`)

**Signal Sources**:
- Google Search Console (manual validation post-deployment)
- Automated test: `curl https://marcusgoll.com/sitemap.xml | grep -c "<url>"`
- Build logs (sitemap generation success/failure)

## Success Criteria

1. **Sitemap is accessible**: Visiting `https://marcusgoll.com/sitemap.xml` returns valid XML with HTTP 200
2. **All posts are included**: Number of `<url>` entries for `/blog/*` matches count of published MDX files
3. **Correct metadata**: Homepage has priority 1.0, blog posts have priority 0.8, lastmod dates match frontmatter
4. **Build-time generation**: Sitemap updates automatically on every deployment without manual script execution
5. **Google validation**: Google Search Console reports sitemap as valid (no errors or warnings)
6. **robots.txt integration**: robots.txt continues to reference sitemap URL correctly (already implemented)

## Scope

### In Scope

- Create `app/sitemap.ts` using Next.js App Router metadata API
- Include all published blog posts from `content/posts/*.mdx`
- Include static pages (homepage, blog list)
- Set priority and change frequency per GitHub issue requirements
- Use MDX frontmatter dates for lastmod timestamps
- Deprecate `lib/generate-sitemap.ts` after migration

### Out of Scope

- Image sitemap (deferred to Phase 2, requires featured image support)
- Sitemap index files (not needed until 50K+ URLs)
- News sitemap (not applicable, not a news site)
- Video sitemap (no video content currently)
- Additional static pages (about, projects, contact - add when pages exist)
- Dynamic route discovery (only hardcoded static routes for MVP)

## Dependencies

### Technical Dependencies

- Next.js 15.5.6 (already installed) - provides `MetadataRoute.Sitemap` type
- `lib/mdx.ts` `getAllPosts()` function (already exists) - provides blog post data
- `NEXT_PUBLIC_SITE_URL` environment variable (already configured)

### Blocked By

- ~~tech-stack-cms-integration~~ (RESOLVED: using MDX filesystem)
- ~~homepage-post-feed~~ (RESOLVED: `getAllPosts()` exists)
- ~~individual-post-pages~~ (RESOLVED: dynamic routes exist)

### Blocks

- None (independent feature, doesn't block other work)

## Assumptions

1. All blog posts have valid `date` field in MDX frontmatter
   - If missing, fallback to file modified timestamp or current date

2. MDX posts without published dates are considered drafts and excluded
   - Filter logic: `post.frontmatter.date` exists

3. Site URL is stable at `https://marcusgoll.com`
   - Environment variable `NEXT_PUBLIC_SITE_URL` already configured

4. No pagination needed for sitemap (under 50K URL limit)
   - Current post count: ~5-10 posts, well under limit

5. Static routes are known and hardcoded
   - Future: Dynamic route discovery can be added if needed

6. Google Search Console access available for validation
   - Marcus has admin access to verify sitemap submission

## Risks & Mitigations

### Risk 1: MDX Processing Failure During Build
**Probability**: Low
**Impact**: High (prevents deployment)
**Mitigation**: Add try-catch in sitemap.ts, log errors, fail build explicitly with actionable error message

### Risk 2: Missing Date Fields in MDX Frontmatter
**Probability**: Medium
**Impact**: Medium (posts excluded from sitemap or have incorrect dates)
**Mitigation**: Add fallback to file modified timestamp, document required frontmatter schema

### Risk 3: Environment Variable Not Set in Production
**Probability**: Low (already configured)
**Impact**: Medium (wrong domain in sitemap URLs)
**Mitigation**: Add build-time validation, fail if NEXT_PUBLIC_SITE_URL not set, default to production domain

### Risk 4: Breaking Change to `getAllPosts()` API
**Probability**: Low
**Impact**: High (sitemap breaks)
**Mitigation**: Add integration test that validates sitemap generation with mock posts

## Testing Strategy

### Unit Tests

1. Test sitemap.ts function returns valid MetadataRoute.Sitemap structure
2. Test priority and changefreq values are correct for each page type
3. Test lastmod dates are correctly extracted from MDX frontmatter
4. Test fallback behavior when frontmatter date missing

### Integration Tests

1. Test `/sitemap.xml` route returns valid XML
2. Test sitemap includes all published posts from `getAllPosts()`
3. Test sitemap excludes draft posts (posts without dates)
4. Test sitemap validates against XML sitemap schema

### Manual Validation

1. Deploy to staging/production
2. Visit `/sitemap.xml` and verify XML structure
3. Submit sitemap to Google Search Console
4. Verify Google reports no errors
5. Check that new posts appear in sitemap after deployment

## Deployment Considerations

**Platform Dependencies**: None (Next.js built-in feature)

**Environment Variables**: Uses existing `NEXT_PUBLIC_SITE_URL` (no changes)

**Breaking Changes**: None (additive change, `/sitemap.xml` route replaces static file)

**Migration Required**: No (simply replace static file with dynamic route)

**Rollback Considerations**:
- Keep `public/sitemap.xml` as backup until Next.js sitemap validated
- If Next.js sitemap fails, can revert to custom script temporarily

## Related Documentation

- Next.js Sitemap Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- XML Sitemap Protocol: https://www.sitemaps.org/protocol.html
- Google Search Central - Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- GitHub Issue #17: https://github.com/[owner]/marcusgoll/issues/17
- Related Spec: `specs/004-seo-analytics/spec.md` (US3: Automated sitemap generation)

## Notes

See `./NOTES.md` for detailed research findings, implementation decisions, and system component analysis.

## Approval

- [ ] Product Owner: Marcus Gollahon
- [ ] Technical Lead: Marcus Gollahon
- [ ] Ready for Planning: Yes (no clarifications needed)
