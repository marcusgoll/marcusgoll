# Error Log: Individual Post Page Enhancements

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)

### ERR-001: ENOENT File Path Error During Preview

**Error ID**: ERR-001
**Phase**: Testing (Preview)
**Date**: 2025-10-22 09:50
**Component**: frontend/build-cache
**Severity**: High (blocked preview testing)

**Description**:
Dev server failed to load blog posts at `/blog/interactive-mdx-demo` with ENOENT error:
```
ENOENT: no such file or directory, open 'D:\Coding\marcusgoll\content\posts\interactive-mdx-demo.md'
at getPostBySlug (lib\posts.ts:91:20)
```

Error trace showed:
- Old file path (`lib\posts.ts` instead of current `lib\mdx.ts`)
- Wrong project directory (`D:\Coding\marcusgoll\` instead of `D:\coding\tech-stack-foundation-core\`)
- Wrong file extension (`.md` instead of `.mdx`)

**Root Cause**:
Next.js dev server caches compiled code in `.next/` directory. When files are refactored/renamed (e.g., `lib/posts.ts` → `lib/mdx.ts`), the cache may contain stale references to:
- Old file paths and import statements
- Previous project directory locations
- Deprecated fallback logic (trying `.md` when only `.mdx` exists)

**Resolution**:
1. Stopped dev server (`kill $(cat /tmp/preview-server-pid.txt)`)
2. Removed `.next/` directory (`rm -rf .next`)
3. Cleaned npm cache (`npm cache clean --force`)
4. Killed all processes on ports 3000-3002 (`npx kill-port 3000 3001 3002`)
5. Restarted dev server (`npm run dev`)
6. Verified routes work: HTTP 200 on both test URLs

**Prevention**:
- Add cache cleaning step to `/preview` workflow (Step 0: Clean caches)
- Document cache issues in troubleshooting guide
- Consider adding `npm run clean` script that removes `.next/` and cleans npm cache
- When refactoring file paths, always clean cache before testing

**Related**:
- Spec: US1-US6 (all user stories depend on blog post rendering)
- Code: lib/mdx.ts:87-119 (getPostBySlug function)
- Resolution commit: [pending]

**Verification**:
- ✅ http://localhost:3000/blog/interactive-mdx-demo returns HTTP 200
- ✅ http://localhost:3000/blog/welcome-to-mdx returns HTTP 200
- ✅ Page renders with all components (breadcrumbs, TOC, social share, related posts)
- ✅ No ENOENT errors in dev server logs (`tail -f /tmp/preview-dev.log`)

---

## Deployment Phase (Phase 6-7)
[Populated during staging validation and production deployment]

---

## Error Template

**Error ID**: ERR-[NNN]
**Phase**: [Planning/Implementation/Testing/Deployment]
**Date**: YYYY-MM-DD HH:MM
**Component**: [api/frontend/database/deployment]
**Severity**: [Critical/High/Medium/Low]

**Description**:
[What happened]

**Root Cause**:
[Why it happened]

**Resolution**:
[How it was fixed]

**Prevention**:
[How to prevent in future]

**Related**:
- Spec: [link to requirement]
- Code: [file:line]
- Commit: [sha]

