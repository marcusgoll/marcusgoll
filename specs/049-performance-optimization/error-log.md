# Error Log: 049-performance-optimization

## Planning Phase (Phase 0-2)
None yet.

## Implementation Phase (Phase 3-4)
[Populated during /tasks and /implement]

## Testing Phase (Phase 5)
[Populated during /debug and /preview]

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

---

## Common Performance Issues Reference

### Issue Type: Font Loading (FOIT/FOUT)

**Symptoms**:
- Text invisible for 1-3 seconds (FOIT)
- Text renders in fallback font then swaps (FOUT)
- Layout shift when font loads (CLS increase)

**Root Causes**:
- `font-display: block` (causes FOIT)
- `font-display: auto` (browser default, inconsistent)
- Missing font preload hints
- Font file too large (>100KB)

**Resolution**:
- Use `font-display: swap` (prevents FOIT)
- Use next/font with automatic optimization
- Subset fonts to Latin characters only
- Use WOFF2 format (best compression)

**Prevention**:
- Always use next/font/google or next/font/local
- Test on slow 3G network throttling
- Monitor CLS in Web Vitals tracking

---

### Issue Type: Bundle Size Regression

**Symptoms**:
- Lighthouse Performance score drops
- Initial bundle > 200KB gzipped
- Slow TTI (Time to Interactive)

**Root Causes**:
- New dependency added without bundle analysis
- Importing entire library instead of specific components
- Duplicate dependencies (multiple versions)
- Unused code not tree-shaken

**Resolution**:
- Run bundle analyzer: `ANALYZE=true npm run build`
- Replace heavy dependency or lazy load it
- Use named imports: `import { specific } from 'lib'`
- Run `npm dedupe` to remove duplicates

**Prevention**:
- Add bundle size check to CI (future enhancement)
- Review bundle analyzer before merging PRs
- Use Import Cost VS Code extension
- Document bundle budget in lighthouserc.json

---

### Issue Type: Dynamic Import Hydration Mismatch

**Symptoms**:
- React hydration error in console
- Component renders differently on server vs client
- Warning: "Text content does not match server-rendered HTML"

**Root Causes**:
- SSR enabled for client-only component
- Conditional rendering based on window/document
- Using `useEffect` with `useState` incorrectly

**Resolution**:
- Set `ssr: false` in dynamic import:
  ```typescript
  const Component = dynamic(() => import('./Component'), {
    ssr: false,
  });
  ```
- Use `useEffect` to ensure client-only rendering
- Wrap in `{typeof window !== 'undefined' && <Component />}`

**Prevention**:
- Test SSR behavior in production build
- Use Next.js `<NoSSR>` wrapper for client-only components
- Document SSR requirements in component files

---

### Issue Type: Lighthouse CI Failing on GitHub Actions

**Symptoms**:
- Lighthouse CI workflow fails
- Error: "Port 3000 is already in use"
- Error: "Timed out waiting for page to load"

**Root Causes**:
- `npm start` doesn't exit before Lighthouse runs
- Port conflict from previous run
- Server takes too long to start
- Network timeout during build

**Resolution**:
- Use `npm start & npx wait-on http://localhost:3000` (run in background)
- Add timeout to wait-on: `--timeout 60000` (60 seconds)
- Kill port before starting: `npx kill-port 3000`
- Increase Lighthouse timeout: `--max-wait-for-load 60000`

**Prevention**:
- Test Lighthouse CI locally before pushing
- Use `workflow_dispatch` for manual testing
- Add retry logic to workflow (max 2 retries)
- Monitor GitHub Actions logs for patterns

---

### Issue Type: Web Vitals Not Tracking in GA4

**Symptoms**:
- No web_vitals events in GA4 DebugView
- No data in GA4 custom reports after 48 hours
- Browser console shows [Web Vitals] logs but no GA4 events

**Root Causes**:
- GA4 ID not set in environment variable
- gtag function not loaded (ad blocker)
- web-vitals package not installed
- Event name mismatch (GA4 vs code)

**Resolution**:
- Verify GA4 ID: `echo $NEXT_PUBLIC_GA_ID`
- Test with GA4 DebugView (Chrome extension + ?debug=1)
- Check browser console: `typeof window.gtag` → should be "function"
- Verify web-vitals package: `npm list web-vitals`

**Prevention**:
- Add GA4 ID validation to build process
- Test Web Vitals tracking in preview environment
- Document GA4 setup in quickstart.md
- Use GA4 DebugView for all new tracking features

---

### Issue Type: CLS Regression After Font Changes

**Symptoms**:
- CLS > 0.1 (fails Lighthouse)
- Layout shifts during page load
- Text reflows when font loads

**Root Causes**:
- Fallback font metrics don't match web font
- Missing width/height on images
- Dynamic content insertion without size reservation

**Resolution**:
- Use `@next/font` with automatic fallback generation
- Add `width` and `height` to all images
- Reserve space for dynamic content (skeleton loaders)
- Use CSS `aspect-ratio` for responsive elements

**Prevention**:
- Monitor CLS in Web Vitals RUM
- Test on slow 3G (font loading delay)
- Use Lighthouse CI to catch regressions
- Review layout shift annotations in DevTools

---

### Issue Type: Compression Not Enabled in Production

**Symptoms**:
- Large file sizes in Network tab
- No `Content-Encoding: gzip` or `br` header
- Slow page loads despite small bundle

**Root Causes**:
- Caddy not configured for compression
- Nginx missing gzip directives
- Reverse proxy stripping compression headers

**Resolution**:
- Check Caddy config: `encode gzip zstd` should be present
- Verify compression headers: `curl -I https://marcusgoll.com`
- Test with: `curl -H "Accept-Encoding: gzip" https://marcusgoll.com | gzip -d`

**Prevention**:
- Add compression check to deployment smoke tests
- Document server configuration in deployment docs
- Monitor response headers in GA4 (custom dimension)

---

## Error Escalation Matrix

| Severity | Response Time | Escalation | Rollback Threshold |
|----------|---------------|------------|-------------------|
| Critical | Immediate (< 15 min) | Deploy hotfix | Lighthouse < 50, site down |
| High | < 4 hours | Schedule fix in next release | Lighthouse < 70, CLS > 0.25 |
| Medium | < 1 business day | Add to backlog | Lighthouse < 85, minor UX issues |
| Low | < 1 week | Document for future sprint | Cosmetic only |

**Critical Examples**:
- Site completely inaccessible
- JavaScript errors breaking core functionality
- CLS > 0.5 (unusable on mobile)

**High Examples**:
- Lighthouse Performance < 70
- FCP > 3s (very poor UX)
- Font loading broken (FOIT for 3+ seconds)

**Medium Examples**:
- Lighthouse Performance 85-90 (slightly below target)
- Bundle size 220KB (above 200KB budget)
- Web Vitals not tracking (missing data)

**Low Examples**:
- Minor console warnings
- Bundle analyzer report formatting issues
- Documentation typos

---

## Performance Regression Checklist

When performance regresses after deployment, follow this checklist:

### 1. Identify Regression
- [ ] Compare current Lighthouse score to baseline (specs/049-performance-optimization/baseline-lighthouse.json)
- [ ] Check Web Vitals in GA4 (compare last 7 days to previous 7 days)
- [ ] Review bundle analyzer report (compare to previous build)
- [ ] Check GitHub Actions Lighthouse CI results (identify failing commit)

### 2. Diagnose Root Cause
- [ ] Run `git bisect` to find commit that introduced regression
- [ ] Review code changes in failing commit (focus on imports, dependencies)
- [ ] Run bundle analyzer on failing commit: `git checkout <commit> && ANALYZE=true npm run build`
- [ ] Compare bundle report to previous good build

### 3. Determine Impact
- [ ] Severity: Critical/High/Medium/Low (use matrix above)
- [ ] Affected users: All users or specific pages/browsers
- [ ] Business impact: SEO, conversions, user satisfaction

### 4. Fix or Rollback
- [ ] If Critical: Rollback immediately (see plan.md rollback procedure)
- [ ] If High: Create hotfix PR with fix
- [ ] If Medium/Low: Schedule fix in next sprint

### 5. Prevent Recurrence
- [ ] Document error in error-log.md
- [ ] Add regression test to Lighthouse CI
- [ ] Update performance budget if needed
- [ ] Review with team in retrospective

---

## Notes

- This error log will be populated during implementation, testing, and deployment phases
- Use error IDs (ERR-001, ERR-002, etc.) to reference errors across documents
- Link errors to specific commits, files, and requirements for traceability
- Update Common Performance Issues Reference as new patterns emerge
