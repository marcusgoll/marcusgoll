# Error Log: Homepage Redesign (055-homepage-redesign)

**Purpose**: Track all errors, blockers, and resolutions throughout feature lifecycle

**Usage**: Update this log when errors occur during implementation, testing, or deployment

---

## Planning Phase (Phase 0-2)

**Status**: ✅ No errors

- Research completed successfully (10 reusable components identified)
- Architecture decisions made (Next.js 15, Tailwind CSS 4, Radix UI)
- Plan created with high reuse ratio (62.5%)

---

## Implementation Phase (Phase 3-4)

**Status**: ⏳ Pending (will be populated during `/tasks` and `/implement`)

### Error Template (use when errors occur)

**Error ID**: ERR-001
**Phase**: Implementation
**Date**: YYYY-MM-DD HH:MM
**Component**: [app/page.tsx | components/home/Hero.tsx | etc.]
**Severity**: [Critical | High | Medium | Low]

**Description**:
[What happened - be specific]

**Root Cause**:
[Why it happened - technical explanation]

**Resolution**:
[How it was fixed - step-by-step]

**Prevention**:
[How to prevent in future - process improvement]

**Related**:
- Spec: [link to requirement, e.g., FR-003]
- Code: [file:line, e.g., components/home/Hero.tsx:45]
- Commit: [sha, e.g., abc1234]

---

## Testing Phase (Phase 5)

**Status**: ⏳ Pending (will be populated during `/debug` and `/preview`)

---

## Deployment Phase (Phase 6-7)

**Status**: ⏳ Pending (will be populated during staging validation and production deployment)

---

## Example Errors (Reference Only)

### Example 1: Lighthouse Performance Score Below Target

**Error ID**: ERR-EXAMPLE-001
**Phase**: Testing
**Date**: 2025-10-XX 14:30
**Component**: app/page.tsx
**Severity**: Medium

**Description**:
Lighthouse performance score 78 (target: ≥85). LCP 3.2s (target: <2.5s). Issue identified: Hero background image 2.5MB causing slow LCP.

**Root Cause**:
Hero background image not optimized. Using PNG instead of WebP. Image dimensions larger than needed (4000x3000px vs required 1920x1080px).

**Resolution**:
1. Converted image to WebP format (2.5MB → 180KB)
2. Resized to 1920x1080px (largest viewport size)
3. Added explicit width/height to next/image
4. Result: LCP 1.8s, Lighthouse score 92

**Prevention**:
- Add image optimization checklist to PR template
- Use automated image optimization in CI (sharp, imagemin)
- Set max image size policy (< 500KB per spec.md NFR-006)

**Related**:
- Spec: NFR-001 (LCP <2.5s)
- Code: components/home/Hero.tsx:line-57 (background image)
- Commit: abc1234

---

### Example 2: Newsletter API 500 Error

**Error ID**: ERR-EXAMPLE-002
**Phase**: Implementation
**Date**: 2025-10-XX 16:45
**Component**: app/api/newsletter/subscribe/route.ts
**Severity**: High

**Description**:
POST /api/newsletter/subscribe returns 500 Internal Server Error. Form submission fails with "Failed to subscribe" message.

**Root Cause**:
DATABASE_URL environment variable missing in .env.local. Prisma client unable to connect to PostgreSQL.

**Resolution**:
1. Added DATABASE_URL to .env.local (copied from .env.example)
2. Verified connection: `npx prisma db push`
3. Restarted dev server: `npm run dev`
4. Tested form submission: Success (200 OK)

**Prevention**:
- Update quickstart.md with clear env var setup instructions
- Add env var validation script (lib/validate-env.ts)
- Check for missing env vars on server startup (throw error if critical vars missing)

**Related**:
- Spec: FR-009 (Newsletter signup form)
- Code: app/api/newsletter/subscribe/route.ts:line-12 (Prisma client init)
- Commit: def5678

---

### Example 3: Content Track Filter Not Updating URL

**Error ID**: ERR-EXAMPLE-003
**Phase**: Implementation
**Date**: 2025-10-XX 10:15
**Component**: components/home/PostFeedFilter.tsx
**Severity**: Medium

**Description**:
Clicking "Aviation" filter button does not update URL from `/?track=all` to `/?track=aviation`. Browser URL remains unchanged, filtered posts do not display.

**Root Cause**:
useRouter hook from 'next/router' instead of 'next/navigation'. In Next.js 13+ App Router, must use 'next/navigation' for client components.

**Resolution**:
1. Changed import: `import { useRouter } from 'next/navigation'`
2. Updated router.push call to use router.push(newUrl) instead of router.push({pathname, query})
3. Tested: URL updates correctly, posts filter as expected

**Prevention**:
- Code review checklist: Verify 'next/navigation' imports for App Router
- ESLint rule: Warn if 'next/router' imported in app/ directory
- Update component templates to use correct imports

**Related**:
- Spec: FR-003 (Filter without page reload), FR-004 (Update URL)
- Code: components/home/PostFeedFilter.tsx:line-32
- Commit: ghi9012

---

## Error Categories

Track errors by category for pattern detection:

### Category: Performance (0 errors)

**Common Issues**:
- Large images causing slow LCP
- Unoptimized JS bundles
- Blocking resources

### Category: API Integration (0 errors)

**Common Issues**:
- Missing environment variables
- Database connection failures
- Rate limiting errors

### Category: State Management (0 errors)

**Common Issues**:
- useRouter import errors (App Router vs Pages Router)
- useSearchParams not working (missing Suspense boundary)
- State not persisting in URL

### Category: Styling (0 errors)

**Common Issues**:
- Brand colors not applied (missing Tailwind config)
- Dark mode contrast issues
- Layout shift (missing image dimensions)

### Category: Accessibility (0 errors)

**Common Issues**:
- Missing ARIA labels
- Keyboard navigation broken
- Low contrast ratios

---

## Severity Definitions

**Critical**: Blocks deployment, breaks core functionality, security vulnerability
- Examples: Site doesn't load, API returning 500 errors, XSS vulnerability

**High**: Major feature broken, poor user experience, performance regression
- Examples: Newsletter signup fails, Lighthouse score <70, CLS >0.25

**Medium**: Minor feature issue, doesn't block deployment, workaround available
- Examples: Filter animation janky, Lighthouse score 75-84, missing alt text

**Low**: Cosmetic issue, edge case, nice-to-have improvement
- Examples: Hover state slightly off, tooltip positioning imperfect

---

## Metrics Summary

**Total Errors**: 0
**By Phase**:
- Planning: 0
- Implementation: TBD
- Testing: TBD
- Deployment: TBD

**By Severity**:
- Critical: 0
- High: 0
- Medium: 0
- Low: 0

**By Category**:
- Performance: 0
- API Integration: 0
- State Management: 0
- Styling: 0
- Accessibility: 0

**Mean Time to Resolution** (MTTR): TBD

---

## Notes

- This error log initialized during planning phase (Phase 1)
- Update as errors occur during implementation, testing, and deployment
- Reference this log during retrospectives to identify patterns
- Use error IDs (ERR-XXX) in commits and PR descriptions for traceability
