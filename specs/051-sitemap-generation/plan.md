# Implementation Plan: Sitemap Generation

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15 App Router `sitemap.ts` (framework-native)
- Components to reuse: 3 (`getAllPosts()`, `PostData` type, `NEXT_PUBLIC_SITE_URL`)
- New components needed: 1 (`app/sitemap.ts`)

**Key Research Decisions**:
1. Use Next.js App Router `sitemap.ts` instead of custom script (framework-native, type-safe, automatic)
2. Reuse `getAllPosts()` from `lib/mdx.ts` (already handles draft filtering, frontmatter validation)
3. Use `NEXT_PUBLIC_SITE_URL` environment variable (already configured)
4. Priority scheme: Homepage 1.0, Blog list 0.9, Posts 0.8 (matches GitHub Issue #17)
5. Deprecate `lib/generate-sitemap.ts` after migration (remove duplication, simplify build)

---

## [ARCHITECTURE DECISIONS]

### Stack

**Frontend**: Next.js 15.5.6 (App Router)
- Sitemap generated via `app/sitemap.ts` (Next.js metadata API)
- Type-safe with `MetadataRoute.Sitemap` from `next/types`
- Automatic XML generation and `/sitemap.xml` route creation

**Content Source**: MDX filesystem (`content/posts/*.mdx`)
- Accessed via `getAllPosts()` from `lib/mdx.ts`
- Frontmatter validated with Zod schemas
- Draft posts automatically filtered in production

**Configuration**: Environment variables
- `NEXT_PUBLIC_SITE_URL`: Site base URL (default: `https://marcusgoll.com`)
- Already configured in deployment strategy

**No Backend/Database**: Static generation at build time (no runtime data fetching)

### Patterns

**Metadata Route Pattern** (Next.js App Router):
- Export default async function from `app/sitemap.ts`
- Return `MetadataRoute.Sitemap` array
- Next.js automatically converts to XML and serves at `/sitemap.xml`
- Generated once at build time (not on every request)

**Rationale**:
- Framework-native approach (no custom build scripts)
- Type-safe (TypeScript compilation catches errors)
- Automatic route generation (no manual XML writing)
- Integrates with Next.js build process (no manual script execution)

**Reuse Existing Utilities** (DRY principle):
- Use `getAllPosts()` for MDX data retrieval (already implements filtering, validation, sorting)
- Use existing environment variable configuration
- Use existing post types (`PostData`, `PostFrontmatter`)

**Rationale**:
- Avoid code duplication
- Leverage existing validation and error handling
- Consistent data access patterns

**Map-Transform Pattern**:
```typescript
const posts = await getAllPosts();

return [
  // Static pages (hardcoded)
  { url: baseUrl, lastModified: new Date(), ... },
  { url: `${baseUrl}/blog`, lastModified: new Date(), ... },

  // Dynamic posts (mapped)
  ...posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  })),
];
```

**Rationale**:
- Combine static and dynamic routes in single array
- Transform MDX post data to sitemap format
- Declarative, readable, maintainable

### Dependencies (New Packages Required)

**None** - All dependencies already installed:
- `next@15.5.6`: Provides `MetadataRoute.Sitemap` type and metadata API
- `lib/mdx.ts`: Provides `getAllPosts()` function
- No additional npm packages needed

---

## [STRUCTURE]

### Directory Layout (Follows Existing Patterns)

```
app/
├── sitemap.ts                    # NEW: Next.js sitemap route (generates /sitemap.xml)
└── (existing routes)/

lib/
├── mdx.ts                        # REUSE: getAllPosts() function
├── mdx-types.ts                  # REUSE: PostData, PostFrontmatter types
└── generate-sitemap.ts           # DELETE: Deprecated custom script

public/
├── robots.txt                    # KEEP: Already references /sitemap.xml
└── sitemap.xml                   # DELETE: Replaced by Next.js route
```

### Module Organization

**app/sitemap.ts** (New):
- Responsibility: Generate XML sitemap for all public pages
- Exports: Default async function returning `MetadataRoute.Sitemap`
- Dependencies: `getAllPosts()` from `lib/mdx.ts`, `process.env.NEXT_PUBLIC_SITE_URL`
- Error handling: Try-catch with build failure on MDX processing errors

**lib/mdx.ts** (Existing, Reused):
- Responsibility: MDX file reading and frontmatter parsing
- Exports: `getAllPosts()`, `getPostBySlug()`, `PostData` type
- Already implements: Draft filtering, Zod validation, date sorting

---

## [DATA MODEL]

See: data-model.md for complete entity definitions

**Summary**:
- No database entities (infrastructure feature)
- Data sources: MDX filesystem (`content/posts/`), environment variables, hardcoded static routes
- Runtime-only entities: Sitemap entries (not persisted)
- Type: `MetadataRoute.Sitemap` (Next.js built-in type)

**Key Fields**:
- `url`: Full URL (base URL + route path)
- `lastModified`: ISO 8601 timestamp or Date object
- `changeFrequency`: One of: always, hourly, daily, weekly, monthly, yearly, never
- `priority`: Number (0.0 to 1.0)

**Validation**:
- Input: MDX frontmatter validated by Zod schema (in `lib/mdx.ts`)
- Output: TypeScript enforces `MetadataRoute.Sitemap` type compliance
- Build-time: Next.js build fails if sitemap function throws error

---

## [PERFORMANCE TARGETS]

### From spec.md NFRs

**NFR-001**: Sitemap generation must not significantly increase build time
- Target: <5 seconds additional build time for 50 posts
- Constraint: Generation happens at build time, not runtime
- Measurement: Compare build time before/after implementation

**NFR-002**: Sitemap must be type-safe
- Target: TypeScript compilation catches malformed sitemap entries
- Constraint: Use Next.js `MetadataRoute.Sitemap` type
- Measurement: TypeScript compiler errors for invalid entries

**NFR-003**: Sitemap generation errors must fail the build
- Target: Build stops with clear error message on MDX processing failure
- Constraint: Prevents deployment with incomplete/stale sitemap
- Measurement: Test with invalid MDX file, verify build failure

### Lighthouse Targets (Not Applicable)

Sitemap is XML file, not user-facing page. No Lighthouse metrics.

### API Response Time (Not Applicable)

Sitemap generated at build time (static), not runtime API.

---

## [SECURITY]

### Authentication Strategy

**Not applicable** - Sitemap is public by design
- XML sitemap protocol requires public access for search engines
- No authentication or authorization needed
- No sensitive data exposed (only public URLs and metadata)

### Input Validation

**MDX Frontmatter**:
- Validated by `PostFrontmatterSchema` (Zod) in `lib/mdx.ts`
- Required fields: `slug`, `date`, `title`
- Invalid frontmatter throws error during build (fails fast)
- Prevents malformed data from reaching sitemap

**Environment Variables**:
- `NEXT_PUBLIC_SITE_URL`: Optional (fallback to production URL)
- Sanitization: Not needed (controlled by deployment configuration)

### Rate Limiting

**Not applicable** - Static file served by Next.js (no rate limiting needed)

### Data Protection

**No PII**: Sitemap contains only public URLs and metadata
- No user data, email addresses, or personal information
- All data intended for public search engine consumption

**robots.txt Integration**:
- Existing `public/robots.txt` already references `/sitemap.xml`
- AI crawler blocking rules already in place (ClaudeBot, GPTBot, etc.)
- No changes needed to robots.txt

---

## [EXISTING INFRASTRUCTURE - REUSE] (3 components)

### Functions

**lib/mdx.ts:getAllPosts()** (lines 49-80):
- Purpose: Retrieve all published MDX blog posts
- Features: Draft filtering, frontmatter validation, date sorting
- Returns: `PostData[]` (type-safe array)
- Error handling: Returns empty array if content directory missing
- Usage: `const posts = await getAllPosts();`

### Types

**lib/mdx-types.ts:PostData**:
- Purpose: Type-safe post data structure
- Fields: `frontmatter` (PostFrontmatter), `content` (string), `slug` (string)
- Usage: Type annotation for posts array

**lib/mdx-types.ts:PostFrontmatter**:
- Purpose: Type-safe frontmatter schema
- Key fields: `slug`, `title`, `date`, `draft`, `tags`
- Validation: Enforced by Zod schema at runtime

### Environment Variables

**process.env.NEXT_PUBLIC_SITE_URL**:
- Purpose: Base URL for all sitemap entries
- Default: `https://marcusgoll.com`
- Configuration: Already set in deployment strategy (from `deployment-strategy.md`)
- Usage: `const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';`

---

## [NEW INFRASTRUCTURE - CREATE] (1 component)

### Backend

**app/sitemap.ts** (New):
- Purpose: Generate XML sitemap for all public pages (homepage, blog list, blog posts)
- Type: Next.js App Router metadata route
- Exports: Default async function returning `MetadataRoute.Sitemap`
- Features:
  - Static pages: `/` (priority 1.0), `/blog` (priority 0.9)
  - Dynamic pages: `/blog/[slug]` (priority 0.8) for all published posts
  - Change frequency: Homepage/blog list (daily), posts (weekly)
  - Last modified: Posts use MDX `frontmatter.date`, static pages use current date
- Error handling: Try-catch with build failure on MDX processing errors
- Lines of code: ~50-60 (estimated)

---

## [CI/CD IMPACT]

### From spec.md Deployment Considerations

**Platform**: Hetzner VPS + Docker (self-hosted) - No changes
- Next.js App Router sitemap is framework-native (no platform-specific configuration)
- Works identically on Vercel, Hetzner VPS, or any Node.js hosting

**Environment Variables**: No new variables
- Uses existing `NEXT_PUBLIC_SITE_URL` (already configured)
- No changes to `.env.local` or production secrets

**Breaking Changes**: None
- Additive change: New `/sitemap.xml` route replaces static file
- No API contract changes
- No database schema changes
- robots.txt continues to work (already references `/sitemap.xml`)

**Migration**: Not required
- Old approach: Static `public/sitemap.xml` file
- New approach: Next.js route generates XML dynamically at build time
- Transition: Delete `public/sitemap.xml`, add `app/sitemap.ts`
- Rollback: Restore `lib/generate-sitemap.ts` and `public/sitemap.xml` from Git history

### Build Commands

**No changes** - Next.js automatically generates sitemap during build
- Existing: `npm run build` (Next.js build process)
- Change: Next.js detects `app/sitemap.ts` and generates `/sitemap.xml` route
- No new build steps required

### Environment Variables (No Changes)

**Existing**:
- `NEXT_PUBLIC_SITE_URL`: Base URL for sitemap entries (already configured)

**New**: None

### Database Migrations

**Not applicable** - No database schema changes

### Smoke Tests (For CI/CD)

**Route Accessibility**:
- URL: `https://marcusgoll.com/sitemap.xml`
- Expected: HTTP 200, valid XML response
- Check: `Content-Type: application/xml`

**Sitemap Content**:
- Expected: Contains `<urlset>` root element
- Expected: Contains at least 3 `<url>` entries (homepage, /blog, 1+ post)
- Expected: All URLs start with `https://marcusgoll.com`

**robots.txt Integration**:
- URL: `https://marcusgoll.com/robots.txt`
- Expected: Contains `Sitemap: https://marcusgoll.com/sitemap.xml`
- No changes needed (already configured)

**Automated Test Example**:
```bash
# In GitHub Actions workflow
curl -s https://marcusgoll.com/sitemap.xml | grep -q "<urlset" || exit 1
curl -s https://marcusgoll.com/sitemap.xml | grep -c "<url>" | test $(cat) -ge 3 || exit 1
```

### Platform Coupling

**Next.js**: Framework-native feature (no platform coupling)
- Uses Next.js App Router metadata API
- Works on Vercel, Hetzner VPS, AWS, or any Node.js hosting
- No Vercel-specific features used

**Dependencies**: No new dependencies
- Next.js 15.5.6 (already installed)
- `lib/mdx.ts` (already exists)

---

## [DEPLOYMENT ACCEPTANCE]

### Production Invariants (Must Hold True)

1. **Sitemap accessible at `/sitemap.xml`**
   - Verification: `curl https://marcusgoll.com/sitemap.xml` returns HTTP 200
   - Violation: 404 or 500 response

2. **All published posts included**
   - Verification: Count of `<url>` entries for `/blog/*` matches count of published MDX files
   - Violation: Missing posts or draft posts included in production

3. **Valid XML sitemap protocol**
   - Verification: XML validates against `http://www.sitemaps.org/schemas/sitemap/0.9` schema
   - Violation: Malformed XML or missing required fields

4. **robots.txt references sitemap**
   - Verification: `curl https://marcusgoll.com/robots.txt | grep "Sitemap: https://marcusgoll.com/sitemap.xml"`
   - Violation: Missing sitemap reference (NOTE: No changes needed, already configured)

### Staging Smoke Tests (Given/When/Then)

**Not applicable** - Deployment model is `direct-prod` (no staging environment)

**Manual Testing Before Deployment**:
```gherkin
Given local development server is running
When developer visits http://localhost:3000/sitemap.xml
Then sitemap returns valid XML with all published posts
  And no draft posts are included
  And homepage and /blog are present
  And all URLs use correct base URL
```

### Rollback Plan

**Deployment IDs**: Not applicable (no deployment platform IDs for static routes)

**Rollback Method**: Git revert
1. Revert commit that adds `app/sitemap.ts` and removes `lib/generate-sitemap.ts`
2. Manually run `npx tsx lib/generate-sitemap.ts` to regenerate `public/sitemap.xml`
3. Redeploy from main branch
4. Verify `https://marcusgoll.com/sitemap.xml` returns XML

**Special Considerations**:
- Keep `lib/generate-sitemap.ts` in Git history (don't force delete)
- Keep `public/sitemap.xml` in Git history as backup
- If Next.js sitemap fails, can restore old implementation quickly

**Rollback Time**: <5 minutes
- Git revert: <1 minute
- Regenerate sitemap: <1 minute
- Deploy: <3 minutes (Docker build + restart)

### Artifact Strategy (Build-Once-Promote-Many)

**Not applicable** - Deployment model is `direct-prod` (no staging→production promotion)

**Build Process**:
1. GitHub Actions triggers on push to `main`
2. Lint + type-check pass
3. `npm run build` generates production build (includes sitemap generation)
4. Docker image built with Next.js production build
5. Deploy to Hetzner VPS via SSH + docker-compose
6. No artifact promotion (single environment)

---

## [INTEGRATION SCENARIOS]

### Scenario 1: Initial Setup

```bash
# No additional setup required
# Next.js automatically generates sitemap during build

# Build production
npm run build

# Verify sitemap generated
curl http://localhost:3000/sitemap.xml
```

**Expected Output**:
- Valid XML sitemap with all published posts
- Homepage and /blog included
- Correct priority and change frequency values

### Scenario 2: Validation

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build (includes sitemap generation)
npm run build

# Manual testing
npm run dev
curl http://localhost:3000/sitemap.xml
```

**Expected Output**:
- No TypeScript errors
- No ESLint errors
- Build succeeds
- Sitemap accessible at http://localhost:3000/sitemap.xml

### Scenario 3: Testing New Post Addition

```bash
# Add new post to content/posts/
echo "---
title: Test Post
slug: test-post
date: $(date -I)
draft: false
tags: [\"Test\"]
---

# Test

This is a test post.
" > content/posts/test-post.mdx

# Rebuild
npm run build

# Verify new post in sitemap
curl http://localhost:3000/sitemap.xml | grep "test-post"
```

**Expected Output**:
- Sitemap includes new post URL: `https://marcusgoll.com/blog/test-post`
- Last modified date matches post date
- No manual script execution required

### Scenario 4: Draft Post Filtering

```bash
# Create draft post
echo "---
title: Draft Post
slug: draft-post
date: $(date -I)
draft: true
tags: [\"Test\"]
---

# Draft

This post is a draft.
" > content/posts/draft-post.mdx

# Build in production mode
NODE_ENV=production npm run build

# Verify draft NOT in sitemap
curl http://localhost:3000/sitemap.xml | grep "draft-post" || echo "✅ Draft correctly excluded"
```

**Expected Output**:
- Draft post NOT included in production sitemap
- Build succeeds
- No errors or warnings

### Scenario 5: Google Search Console Submission

```bash
# Deploy to production
git push origin main

# Wait for deployment (~3 minutes)

# Submit to Google Search Console
# Manual step:
# 1. Open https://search.google.com/search-console
# 2. Select property: marcusgoll.com
# 3. Go to Sitemaps section
# 4. Enter sitemap URL: https://marcusgoll.com/sitemap.xml
# 5. Click "Submit"

# Verify Google can access sitemap
curl https://marcusgoll.com/sitemap.xml
```

**Expected Output**:
- Sitemap accessible at production URL
- Google Search Console shows "Success" status
- No errors or warnings in Google Search Console

---

## [TESTING STRATEGY]

### Unit Tests (Optional - Not in MVP)

**If tests added**:
1. Test sitemap function returns valid `MetadataRoute.Sitemap` structure
2. Test priority values are correct for each page type
3. Test change frequency values are correct
4. Test last modified dates are correctly extracted from MDX frontmatter
5. Test fallback to production URL if `NEXT_PUBLIC_SITE_URL` not set

**Example Test** (Vitest):
```typescript
import { describe, it, expect, vi } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('returns valid sitemap structure', async () => {
    const entries = await sitemap();
    expect(entries).toBeInstanceOf(Array);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]).toHaveProperty('url');
    expect(entries[0]).toHaveProperty('lastModified');
  });

  it('includes homepage with priority 1.0', async () => {
    const entries = await sitemap();
    const homepage = entries.find(entry => entry.url.endsWith('/'));
    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1.0);
  });
});
```

### Integration Tests (Manual - MVP)

**Test 1**: Sitemap route accessibility
- Navigate to `http://localhost:3000/sitemap.xml`
- Verify: Returns XML (not 404)
- Verify: Content-Type is `application/xml`

**Test 2**: All published posts included
- Count MDX files in `content/posts/` (excluding drafts)
- Count `<url>` entries in sitemap for `/blog/*`
- Verify: Counts match

**Test 3**: Draft posts excluded in production
- Create draft post with `draft: true`
- Build in production mode: `NODE_ENV=production npm run build`
- Verify: Draft post URL not in sitemap

**Test 4**: XML sitemap validation
- Copy sitemap XML from http://localhost:3000/sitemap.xml
- Paste into https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Verify: No validation errors

### Manual Validation (Production)

**Step 1**: Deploy to production
- Push to main branch
- Wait for GitHub Actions deployment (~3 minutes)

**Step 2**: Verify sitemap accessible
- Visit https://marcusgoll.com/sitemap.xml
- Verify: XML loads without errors
- Verify: Contains expected entries (homepage, /blog, all posts)

**Step 3**: Submit to Google Search Console
- Open https://search.google.com/search-console
- Add sitemap: https://marcusgoll.com/sitemap.xml
- Wait for Google to process (~1-3 days)
- Verify: "Success" status, no errors

**Step 4**: Verify new posts appear automatically
- Create and deploy new blog post
- Wait for deployment
- Check sitemap includes new post (without manual script execution)

---

## [RISKS & MITIGATIONS]

### Risk 1: MDX Processing Failure During Build

**Probability**: Low
**Impact**: High (prevents deployment)

**Mitigation**:
- Add try-catch in `app/sitemap.ts`
- Log errors with actionable error messages
- Fail build explicitly (don't silently skip sitemap)
- Validate MDX frontmatter with Zod (already implemented in `lib/mdx.ts`)

**Implementation**:
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getAllPosts();
    // ... generate sitemap
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    throw new Error('Sitemap generation failed. Check MDX files for invalid frontmatter.');
  }
}
```

### Risk 2: Environment Variable Not Set in Production

**Probability**: Low (already configured)
**Impact**: Medium (wrong domain in sitemap URLs)

**Mitigation**:
- Use fallback to production domain: `process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com'`
- Add build-time validation warning if env var missing
- Document required env vars in deployment guide

**Implementation**:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcusgoll.com';

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using default: https://marcusgoll.com');
}
```

### Risk 3: Sitemap Not Accessible After Deployment

**Probability**: Low
**Impact**: High (search engines can't discover content)

**Mitigation**:
- Add automated smoke test in CI/CD: `curl https://marcusgoll.com/sitemap.xml | grep -q "<urlset"`
- Keep `public/sitemap.xml` as backup until Next.js sitemap validated
- Document rollback procedure (restore `lib/generate-sitemap.ts`)

**Implementation**:
- Add to `.github/workflows/verify.yml`:
```yaml
- name: Smoke test sitemap
  run: |
    npm run build
    npm run start &
    sleep 5
    curl http://localhost:3000/sitemap.xml | grep -q "<urlset" || exit 1
```

### Risk 4: Breaking Change to `getAllPosts()` API

**Probability**: Low
**Impact**: High (sitemap breaks)

**Mitigation**:
- `getAllPosts()` is stable (already used in blog pages)
- If API changes, TypeScript will catch breaking changes at build time
- Add integration test validating sitemap generation with mock posts (future)

**Monitoring**:
- TypeScript compilation errors will surface API changes
- Manual testing before deployment catches issues
