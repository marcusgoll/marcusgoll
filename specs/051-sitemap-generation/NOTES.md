# Feature: Sitemap Generation

## Overview
Migrate from custom build-time sitemap generator to Next.js App Router native sitemap.ts for improved maintainability and automatic regeneration.

## Research Findings

### Current Implementation Analysis
**Source**: `lib/generate-sitemap.ts` (lines 1-90)

**Current Approach**:
- Custom sitemap generator using filesystem-based MDX processing
- Manual `generateSitemap()` call required in build process
- Static XML written to `public/sitemap.xml`
- Includes homepage, /blog, and all blog posts
- Priority: Homepage (1.0), /blog (0.9), Posts (0.8)
- Change frequency: Homepage/blog (daily), Posts (monthly)
- Last modified from post frontmatter date

**Issues with Current Approach**:
- Not integrated with Next.js build system (requires manual script execution)
- No automatic regeneration on ISR (Incremental Static Regeneration)
- Missing static pages (about, projects, contact, etc.)
- No image sitemap support
- No robots.txt integration (robots.txt exists separately at `public/robots.txt`)

### Project Documentation Findings

**Tech Stack** (from `docs/project/tech-stack.md`):
- Frontend: Next.js 15.5.6 (App Router)
- Language: TypeScript 5.9.3
- Deployment: Hetzner VPS + Docker (self-hosted)
- Content: MDX 3.1.1 (filesystem-based in `content/posts/`)
- Build: Turbo (built into Next.js)

**System Architecture** (from `docs/project/system-architecture.md`):
- MDX Content location: `content/posts/*.mdx`
- MDX processing: `lib/mdx.ts` with `getAllPosts()` function
- Static generation at build time (no runtime filesystem reads)
- Site URL: `https://marcusgoll.com` (from NEXT_PUBLIC_SITE_URL)

### Related Features

**From**: `specs/004-seo-analytics/spec.md`
- US3 [P1]: Automated sitemap.xml generation (already implemented with custom script)
- Acceptance criteria: sitemap.xml generated at build time, includes all public pages
- Current limitation: Only includes homepage, /blog, and posts (missing other static pages)

### Next.js App Router Sitemap Capabilities

**Standard Approach** (Next.js 15):
- Create `app/sitemap.ts` (or `sitemap.xml.ts`)
- Export default function returning MetadataRoute.Sitemap array
- Next.js automatically generates `/sitemap.xml` route
- Supports static and dynamic routes
- Integrates with ISR for automatic updates
- Built-in types: `MetadataRoute.Sitemap`

**Benefits over Custom Script**:
- Framework-native (no custom build step)
- Type-safe with Next.js types
- Automatic route generation
- ISR support for dynamic updates
- Better integration with App Router metadata

### GitHub Issue Analysis

**From**: GitHub Issue #17

**Requirements**:
- [x] Next.js sitemap API (use App Router `sitemap.ts`)
- [x] Dynamic MDX content (pull from `content/posts/`)
- [x] Static pages (homepage, about, projects, contact)
- [x] Priority settings (homepage 1.0, posts 0.8, static 0.7)
- [x] Change frequency (posts weekly, static monthly)
- [x] Last modified (MDX file timestamp or frontmatter date)
- [x] robots.txt entry (already exists: `Sitemap: https://marcusgoll.com/sitemap.xml`)
- [x] Image sitemap (featured images from MDX frontmatter)
- [x] Automatic updates (regenerate on build via Next.js)

**Acceptance Criteria**:
- [ ] Sitemap accessible at /sitemap.xml
- [ ] All published MDX posts included
- [ ] All static pages included
- [ ] Priority and change frequency properly set
- [ ] Last modified dates accurate
- [ ] robots.txt references sitemap (already done)
- [ ] Google Search Console validates sitemap
- [ ] Sitemap updates when new content published

**Dependencies** (BLOCKED):
- tech-stack-cms-integration (RESOLVED: using MDX filesystem)
- homepage-post-feed (RESOLVED: using `getAllPosts()`)
- individual-post-pages (RESOLVED: using dynamic routes)

## System Components Analysis

**No UI components needed** - Backend-only feature (sitemap generation)

**Existing Infrastructure**:
- `lib/mdx.ts`: `getAllPosts()` function for MDX content retrieval
- `lib/generate-sitemap.ts`: Current custom sitemap generator (to be deprecated)
- `public/robots.txt`: Already references sitemap URL
- `public/sitemap.xml`: Static XML file (to be replaced by Next.js route)

## Feature Classification
- UI screens: false (backend-only, no UI)
- Improvement: true (migrating from custom script to Next.js native)
- Measurable: false (no user behavior tracking, infrastructure)
- Deployment impact: false (no platform changes, env vars, or breaking changes)

## Key Decisions

1. **Use Next.js App Router `sitemap.ts`** instead of custom script
   - Rationale: Framework-native, type-safe, automatic route generation
   - Impact: Simpler maintenance, automatic updates on build

2. **Deprecate `lib/generate-sitemap.ts`**
   - Rationale: Replaced by `app/sitemap.ts`, no longer needed
   - Impact: Remove custom script, update build process

3. **Keep `public/robots.txt` unchanged**
   - Rationale: Already correctly references `/sitemap.xml`
   - Impact: No changes needed to robots.txt

4. **Static pages to include**
   - Homepage (`/`)
   - Blog list (`/blog`)
   - Individual blog posts (`/blog/[slug]`)
   - Future: about, projects, contact (when implemented)

5. **Priority scheme** (from GitHub issue):
   - Homepage: 1.0
   - Blog list: 0.9
   - Blog posts: 0.8
   - Static pages: 0.7 (future)

6. **Change frequency**:
   - Homepage: daily (new posts added)
   - Blog list: daily (new posts added)
   - Blog posts: weekly (may be updated)
   - Static pages: monthly (future)

7. **Last modified dates**:
   - Use MDX frontmatter `date` field for posts
   - Use current date for homepage and blog list (dynamic content)

8. **Image sitemap** (deferred to Phase 2):
   - Requires featured image support in MDX frontmatter
   - Current MDX posts don't have featured images
   - Implement when featured images added to content

## Hypothesis

**Problem**: Custom sitemap script requires manual execution and doesn't integrate with Next.js build system
- Evidence: `lib/generate-sitemap.ts` exists but not called in `package.json` scripts
- Impact: Sitemap may become stale if script not run before deployment

**Solution**: Migrate to Next.js App Router native `sitemap.ts` for automatic generation
- Change: Replace custom script with `app/sitemap.ts` that returns MetadataRoute.Sitemap
- Mechanism: Next.js automatically generates `/sitemap.xml` route on every build

**Prediction**: Sitemap will always be up-to-date without manual intervention
- Primary metric: Sitemap includes all published posts after deployment
- Expected improvement: 100% sitemap freshness (vs current manual process)
- Confidence: High (Next.js feature, well-documented, standard implementation)

## Checkpoints
- Phase 0 (Spec): 2025-10-29T04:00:28Z
- Phase 0 (Spec) completed: 2025-10-29T04:15:00Z (estimated)

## Last Updated
2025-10-29T04:15:00Z

## Phase 2: Tasks (2025-10-28 23:15)

**Summary**:
- Total tasks: 21
- User story tasks: 14
- Parallel opportunities: 13
- Setup tasks: 3
- Task file: specs/051-sitemap-generation/tasks.md

**Task Breakdown**:
- Phase 1 (Setup): 3 tasks - Environment validation
- Phase 2 (US1 - Framework route): 4 tasks - Next.js App Router sitemap.ts
- Phase 3 (US2 - Blog posts): 3 tasks - MDX posts in sitemap
- Phase 4 (US3 - Static pages): 2 tasks - Homepage + blog list
- Phase 5 (US4 - Deprecate): 3 tasks - Remove lib/generate-sitemap.ts
- Phase 6 (US5 - Metadata): 2 tasks - Priority/frequency refinement
- Phase 7 (Validation): 6 tasks - Google Search Console + XML validation

**Checkpoint**:
- ✅ Tasks generated: 21 concrete tasks
- ✅ User story organization: Complete (US1-US5)
- ✅ Dependency graph: Created (US1 blocks US2-US3, US1+US2+US3 block US4-US5)
- ✅ MVP strategy: Defined (Phases 1-4: US1+US2+US3 only)
- ✅ Parallel opportunities: 13 tasks marked [P] for concurrent execution
- 📋 Ready for: /analyze

**Key Decisions**:
- Manual testing approach (no automated test framework configured)
- Reuse existing MDX infrastructure (getAllPosts, PostData)
- Framework-native implementation (Next.js App Router metadata route)
- Incremental delivery: MVP (US1-US3) → validate → enhancement (US4-US5)

