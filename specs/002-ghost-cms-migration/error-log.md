# Error Log: Ghost CMS Migration to Next.js

## Planning Phase (Phase 0-2)

None yet.

---

## Implementation Phase (Phase 3-4)

[Populated during /tasks and /implement]

---

## Testing Phase (Phase 5)

[Populated during /debug and /preview]

---

## Deployment Phase (Phase 6-7)

[Populated during optimize, ship-staging, and ship-prod]

---

## Error Template

Use this template when logging errors:

```markdown
**Error ID**: ERR-NNN
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [ghost-api/ui-components/analytics/deployment]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened - observed behavior]

**Root Cause**:
[Why it happened - underlying issue]

**Resolution**:
[How it was fixed - steps taken]

**Prevention**:
[How to prevent in future - process improvement]

**Related**:
- Spec: [link to requirement, e.g., FR-012]
- Code: [file:line, e.g., lib/ghost.ts:110]
- Commit: [sha if applicable]
```

---

## Common Error Patterns

### Ghost API Errors

**Pattern**: 401 Unauthorized
- **Cause**: Invalid or missing GHOST_CONTENT_API_KEY
- **Fix**: Verify environment variable set correctly
- **Prevention**: Add pre-flight check in quickstart.md

**Pattern**: 404 Not Found
- **Cause**: Post slug doesn't exist in Ghost
- **Fix**: Check post published in Ghost Admin
- **Prevention**: Add error handling in getPostBySlug

**Pattern**: Rate Limiting (429)
- **Cause**: Excessive API calls to Ghost
- **Fix**: Increase ISR revalidation period
- **Prevention**: Monitor API usage, implement exponential backoff

### ISR/Caching Errors

**Pattern**: Stale content persists >60 seconds
- **Cause**: ISR not configured correctly
- **Fix**: Add `export const revalidate = 60` to page
- **Prevention**: Template checklist for new pages

**Pattern**: Build fails with "Cannot read property 'tags' of undefined"
- **Cause**: Missing post data from Ghost API
- **Fix**: Add null checking in page components
- **Prevention**: TypeScript strict mode, optional chaining

### Analytics Errors

**Pattern**: Events not appearing in GA4 Realtime
- **Cause**: NEXT_PUBLIC_GA_ID not set or incorrect
- **Fix**: Verify measurement ID in .env.local
- **Prevention**: Add analytics testing to quickstart

**Pattern**: gtag is not defined
- **Cause**: GA4 script not loaded
- **Fix**: Check layout.tsx includes GA4 script tag
- **Prevention**: Add typeof window !== 'undefined' check

---

**Last Updated**: 2025-10-21
**Next Update**: During /implement or /debug phases
