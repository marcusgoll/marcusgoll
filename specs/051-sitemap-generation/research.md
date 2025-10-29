# Research & Discovery: sitemap-generation

## Project Documentation Context

**Source**: `docs/project/` (8 project-level documents)

### Overview (from overview.md)
- **Vision**: Personal website combining aviation career advancement content and systematic development teaching
- **Target Users**: Pilots (advancing careers), Developers (learning systematic thinking)
- **Success Metrics**: Content engagement, SEO visibility, thought leadership
- **Scope Boundaries**: Blog-focused MVP, future: course platform, CFIPros.com integration

### System Architecture (from system-architecture.md)
- **Components**: Next.js App Router (frontend + API routes), PostgreSQL (via Supabase self-hosted), MDX content processing
- **Integration Points**: MDX filesystem (`content/posts/`), Next.js metadata API, static file serving (`public/`)
- **Data Flows**: Build-time MDX processing → Static generation → Deployment
- **Constraints**: Self-hosted VPS (Hetzner), Docker deployment, Next.js 15 App Router patterns

### Tech Stack (from tech-stack.md)
- **Frontend**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5.9.3
- **Content**: MDX 3.1.1 (filesystem-based in `content/posts/`)
- **Deployment**: Hetzner VPS + Docker (self-hosted), Caddy reverse proxy

### Data Architecture (from data-architecture.md)
- **Existing Entities**: User (placeholder), future: Newsletter subscribers, Comments
- **MDX Content**: File-system based (not in database), frontmatter with Zod validation
- **Naming Conventions**: snake_case for DB, camelCase for TypeScript
- **Migration Strategy**: Prisma migrations (version-controlled)

### API Strategy (from api-strategy.md)
- **API Style**: Next.js API Routes (REST pattern)
- **Auth**: Not applicable (sitemap is public, no auth)
- **Versioning**: `/api/v1/` pattern (not used for sitemap - native Next.js route)
- **Error Format**: Standard HTTP status codes
- **Rate Limiting**: Not applicable (static file generation)

### Capacity Planning (from capacity-planning.md)
- **Current Scale**: micro tier (<1K visitors/mo)
- **Performance Targets**: FCP <1.5s, TTI <3s, Lighthouse ≥85
- **Resource Limits**: VPS with 2-4 vCPUs, 4-8GB RAM
- **Cost Constraints**: <$50/mo total infrastructure

### Deployment Strategy (from deployment-strategy.md)
- **Deployment Model**: direct-prod (MVP), planned: staging-prod when traffic >10K/mo
- **Platform**: Hetzner VPS with Docker + Caddy
- **CI/CD Pipeline**: GitHub Actions (lint → type-check → build → deploy)
- **Environments**: Development (local), Production (main branch → VPS)

### Development Workflow (from development-workflow.md)
- **Git Workflow**: GitHub Flow (feature branches → main)
- **Testing Strategy**: Not yet implemented (recommended: Vitest + React Testing Library + Playwright)
- **Code Style**: ESLint with Next.js config, TypeScript strict mode
- **Definition of Done**: Lint passes, type-check passes, build succeeds, manual testing complete

---

## Research Decisions

### Decision: Use Next.js App Router `sitemap.ts` instead of custom script

- **Decision**: Migrate from `lib/generate-sitemap.ts` to `app/sitemap.ts`
- **Rationale**:
  - Framework-native approach (no custom build step)
  - Type-safe with Next.js `MetadataRoute.Sitemap` type
  - Automatic route generation at `/sitemap.xml`
  - Integrates with Next.js build process (no manual script execution)
  - Better long-term maintainability
- **Alternatives**:
  - Keep custom script: Requires manual execution, not integrated with Next.js
  - Static XML file: Not dynamic, requires manual updates
  - Third-party sitemap generator: Adds dependency, Next.js has built-in support
- **Source**: Next.js documentation (https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), spec.md US1

### Decision: Reuse `getAllPosts()` from `lib/mdx.ts`

- **Decision**: Use existing `getAllPosts()` function to retrieve blog post data
- **Rationale**:
  - Already implements MDX frontmatter parsing with Zod validation
  - Filters drafts in production (`draft: true` frontmatter field)
  - Sorts by date descending
  - Returns type-safe `PostData[]` array
  - Handles edge cases (missing content directory, invalid frontmatter)
- **Alternatives**:
  - Duplicate MDX reading logic: Violates DRY principle
  - Create new abstraction: Unnecessary, existing function perfect for reuse
- **Source**: `lib/mdx.ts:49-80`, spec.md FR-002

### Decision: Use environment variable for site URL

- **Decision**: Read site URL from `process.env.NEXT_PUBLIC_SITE_URL` with fallback to `https://marcusgoll.com`
- **Rationale**:
  - Already configured in project (from tech-stack.md)
  - Allows different URLs for development/staging/production
  - Follows Next.js conventions (`NEXT_PUBLIC_` prefix for client-side access)
  - Fallback ensures build doesn't fail if env var missing
- **Alternatives**:
  - Hardcode URL: Less flexible, doesn't work for staging
  - Read from config file: Adds complexity, env vars simpler
- **Source**: `lib/generate-sitemap.ts:24`, deployment-strategy.md

### Decision: Static pages priority and change frequency

- **Decision**:
  - Homepage (`/`): priority 1.0, changefreq daily
  - Blog list (`/blog`): priority 0.9, changefreq daily
  - Blog posts (`/blog/[slug]`): priority 0.8, changefreq weekly
- **Rationale**:
  - Matches GitHub Issue #17 requirements
  - Homepage changes daily (new posts added)
  - Blog list changes daily (new posts appear)
  - Individual posts change weekly (updates, corrections)
  - Priorities reflect importance (homepage > blog list > posts)
- **Alternatives**:
  - All pages same priority: Doesn't help search engines prioritize
  - Posts higher priority than homepage: Conflicts with SEO best practices
- **Source**: GitHub Issue #17, `lib/generate-sitemap.ts:29-51`

### Decision: Deprecate `lib/generate-sitemap.ts` after migration

- **Decision**: Delete custom sitemap generator once Next.js sitemap.ts is validated
- **Rationale**:
  - Reduces code duplication
  - Removes manual script execution requirement
  - Simplifies build process
  - Follows constitution principle "Do Not Overengineer"
- **Alternatives**:
  - Keep both: Violates DRY, confuses future maintainers
  - Comment out instead of delete: Git history preserves old code, delete cleanly
- **Source**: spec.md US4, constitution.md "Do Not Overengineer"

---

## Components to Reuse (3 found)

- `lib/mdx.ts:getAllPosts()` - Retrieves all published blog posts with frontmatter validation
- `lib/mdx.ts:PostData` type - Type-safe post data structure (frontmatter + content + slug)
- `process.env.NEXT_PUBLIC_SITE_URL` - Site URL configuration (already set in deployment)

---

## New Components Needed (1 required)

- `app/sitemap.ts` - Next.js App Router sitemap route (exports MetadataRoute.Sitemap array)

---

## Unknowns & Questions

None - all technical questions resolved

**Resolved during research**:
- ✅ MDX frontmatter format: Uses `date` field (ISO 8601), validated by Zod schema
- ✅ Draft filtering: `getAllPosts()` already filters drafts in production
- ✅ Site URL configuration: `NEXT_PUBLIC_SITE_URL` already configured
- ✅ robots.txt integration: Already references `/sitemap.xml` at line 7
- ✅ Next.js sitemap type: `MetadataRoute.Sitemap` from `next/types`
- ✅ Change frequency values: Must be one of: always, hourly, daily, weekly, monthly, yearly, never
