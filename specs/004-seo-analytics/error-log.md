# Error Log: SEO & Analytics Infrastructure

## Purpose

This log tracks all errors, blockers, and resolutions encountered during the planning, implementation, testing, and deployment phases of the SEO & Analytics Infrastructure feature.

---

## Planning Phase (Phase 0-2)

**Status**: Complete

**Errors**: None

**Notes**:
- Research conducted successfully (4 reusable components identified, 5 new components needed)
- Architecture decisions documented in plan.md
- Data model defined (no database changes required)
- All planning artifacts created: research.md, data-model.md, plan.md, quickstart.md, contracts/api.yaml

---

## Implementation Phase (Phase 3-4)

**Status**: Not started

**Errors**: [Will be populated during /tasks and /implement phases]

---

## Testing Phase (Phase 5)

**Status**: Not started

**Errors**: [Will be populated during /debug and /preview phases]

---

## Deployment Phase (Phase 6-7)

**Status**: Not started

**Errors**: [Will be populated during staging validation and production deployment]

---

## Error Template

Use this template when logging errors:

### Error ID: ERR-[NNN]

**Phase**: [Planning/Implementation/Testing/Deployment]

**Date**: YYYY-MM-DD HH:MM

**Component**: [api/frontend/database/deployment/build]

**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened - be specific]

**Root Cause**:
[Why it happened - technical explanation]

**Resolution**:
[How it was fixed - steps taken]

**Prevention**:
[How to prevent in future - process improvement]

**Related**:
- Spec: [Link to requirement, e.g., FR-001]
- Code: [File path and line number, e.g., lib/analytics.ts:45]
- Commit: [Git commit SHA]
- Issue: [GitHub issue number if applicable]

---

## Common Error Scenarios (Anticipated)

### Potential Error 1: Sitemap generation fails during build

**Scenario**: Postbuild script errors if MDX parsing fails

**Detection**: Build logs show "❌ Failed to generate sitemap"

**Mitigation**: Script uses try/catch, allows build to continue (NFR-009)

**Resolution Steps**:
1. Check `lib/generate-sitemap.ts` error logs
2. Verify MDX files valid (no syntax errors)
3. Check `lib/mdx.ts` getAllPosts() function
4. Manually run: `node -e "require('./lib/generate-sitemap').generateSitemap()"`

---

### Potential Error 2: next-seo TypeScript compilation errors

**Scenario**: Type conflicts between next-seo and Next.js 15 Metadata API

**Detection**: TypeScript compilation fails during `pnpm build`

**Mitigation**: Use next-seo@latest with Next.js 15 support

**Resolution Steps**:
1. Check next-seo version: `pnpm list next-seo`
2. Verify Next.js version: `pnpm list next`
3. Update next-seo if needed: `pnpm update next-seo`
4. Check next-seo GitHub issues for Next.js 15 compatibility

---

### Potential Error 3: GA4 events not firing in staging

**Scenario**: GA4 Measurement ID incorrect or ad blocker interfering

**Detection**: GA4 DebugView shows no events

**Mitigation**: Separate staging/production GA4 properties

**Resolution Steps**:
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel environment variables
2. Check browser console for gtag errors
3. Disable ad blocker and test again
4. Verify gtag script loaded: View-source → Search "googletagmanager.com"

---

### Potential Error 4: JSON-LD validation errors

**Scenario**: Google Rich Results Test shows missing required fields

**Detection**: Rich Results Test shows "Error: Missing required field"

**Mitigation**: Validate schemas during development

**Resolution Steps**:
1. Extract JSON-LD from page source
2. Validate at schema.org validator: https://validator.schema.org/
3. Check error message (e.g., "headline required", "datePublished invalid")
4. Update `lib/json-ld.ts` to include missing fields
5. Re-test with Rich Results Test

---

### Potential Error 5: Meta tags not rendering on blog posts

**Scenario**: NextSeo component not imported or configured incorrectly

**Detection**: View-source shows no Open Graph tags on blog post pages

**Mitigation**: Follow NextSeo component pattern consistently

**Resolution Steps**:
1. Verify NextSeo imported: `grep -r "NextSeo" app/blog/`
2. Check `lib/seo-config.ts` exports `getPageSEO` helper
3. Ensure blog post page calls `getPageSEO({ title, description, ... })`
4. Verify page is server component (NextSeo works in both server and client components)

---

## Error Tracking Guidelines

**When to log an error**:
- Build failures (compilation, type errors, postbuild script failures)
- Runtime errors (component crashes, analytics failures)
- Performance regressions (Lighthouse score drops)
- Validation errors (Rich Results Test failures, sitemap invalid XML)
- Deployment blockers (environment variable missing, staging smoke test failures)

**Error severity classification**:
- **Critical**: Blocks deployment, breaks production (e.g., build fails, site crashes)
- **High**: Major feature broken, but site functional (e.g., sitemap 404, GA4 not tracking)
- **Medium**: Minor feature degraded (e.g., one page missing meta tags, JSON-LD warning)
- **Low**: Cosmetic or non-blocking (e.g., meta description 161 chars instead of 160)

**Resolution verification**:
- Always verify fix in local environment first
- Run relevant test scenario from quickstart.md
- Deploy to staging for integration testing
- Update error log with resolution details

---

## Notes

**Error log maintenance**:
- Update this log immediately when errors occur (don't wait until end of day)
- Include enough detail for future reference (6 months later, will you remember the context?)
- Link to related spec requirements (traceability)
- Document prevention strategies (improve process, not just fix symptom)

**Post-deployment**:
- Review error log during retrospective
- Extract common issues for documentation/troubleshooting guide
- Update quickstart.md with new troubleshooting scenarios if needed
