# Error Log: Image Optimization (Next.js Image)

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

## Known Potential Issues (Preventive Documentation)

### Issue 1: "Unoptimized Image Detected" Warning
**Severity**: Medium
**Phase**: Implementation
**Component**: MDXImage component with external URLs

**Description**:
Next.js logs warning: "Image with src 'https://example.com/image.jpg' is missing required remotePatterns configuration"

**Root Cause**:
External image domain not whitelisted in next.config.ts remotePatterns array

**Resolution**:
1. Identify domain from warning message
2. Add to next.config.ts:
   ```typescript
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: 'example.com' }
     ]
   }
   ```
3. Rebuild: `npm run build`
4. Verify warning resolved

**Prevention**:
- Document common external image domains in NOTES.md
- Add remotePatterns preemptively for known domains (Unsplash, etc.)
- Monitor console for warnings during development

**Related**:
- Spec: FR-008 (support external image URLs)
- Code: next.config.ts:14-16, components/mdx/mdx-image.tsx:42-49

---

### Issue 2: High CLS (Layout Shift) After Implementation
**Severity**: High
**Phase**: Testing
**Component**: PostCard, MagazineMasonry

**Description**:
Lighthouse reports CLS >0.1, images cause layout shift when loading

**Root Cause**:
- Missing aspect-ratio container for fill layout
- Or missing width/height props for intrinsic layout
- Or blur placeholder not working (missing blurDataURL)

**Resolution**:
1. Run Lighthouse CLS audit to identify problematic images
2. Check Image component:
   - If using fill: Verify parent has `aspect-{ratio}` class
   - If using width/height: Verify dimensions match actual image
3. Check blur placeholder:
   - Local images: Verify static import (automatic blur)
   - Remote images: Verify blurDataURL prop present
4. Test with Network throttling (Slow 3G)
5. Re-run Lighthouse to verify CLS <0.1

**Prevention**:
- Always wrap fill layout Images in aspect-ratio containers
- Test with Network throttling during development
- Run Lighthouse CLS audit before deploying

**Related**:
- Spec: NFR-002 (CLS <0.1)
- Code: components/blog/PostCard.tsx:30-38, lib/utils/shimmer.ts

---

### Issue 3: Sharp Library Installation Fails on VPS
**Severity**: Critical
**Phase**: Deployment
**Component**: Docker build on VPS

**Description**:
Docker build fails with error: "sharp installation failed" or "Cannot find module 'sharp'"

**Root Cause**:
- Sharp native dependencies incompatible with VPS architecture
- Or npm install failed to rebuild native modules
- Or Docker image missing build tools (gcc, make)

**Resolution**:
1. Check Dockerfile for sharp peer dependency: `npm install sharp`
2. Ensure Docker base image has build tools:
   ```dockerfile
   FROM node:20-alpine
   RUN apk add --no-cache libc6-compat
   ```
3. Rebuild Docker image locally and test before deploying
4. If still fails, use Vercel Image Optimization API (cloud fallback)

**Prevention**:
- Test Docker build locally before deploying to VPS
- Include sharp in package.json dependencies (not just peer)
- Use multi-stage Dockerfile with builder stage for native deps

**Related**:
- Spec: Deployment Considerations (Hetzner VPS)
- Code: Dockerfile, package.json

---

### Issue 4: Slow LCP Despite Priority Prop
**Severity**: Medium
**Phase**: Testing/Optimization
**Component**: Homepage hero image

**Description**:
Lighthouse reports LCP >2.5s even with priority prop on hero image

**Root Cause**:
- Hero image file size too large (>500KB)
- Or oversized image dimensions (downloading 4K when 1920px sufficient)
- Or Caddy reverse proxy not caching optimized images
- Or sizes prop incorrect (downloading larger variant than needed)

**Resolution**:
1. Check hero image file size:
   - Network tab: Original image size
   - Target: <500KB for hero images
2. Check downloaded variant size:
   - Network tab: `/_next/image?url=...&w=XXX`
   - Verify w (width) matches rendered size
3. Verify sizes prop:
   - Inspect hero image element
   - Check rendered width vs downloaded width
   - Adjust sizes prop if mismatch
4. Check Caddy caching:
   - Response headers: `Cache-Control`, `X-Cache`
   - Configure Caddy to cache `/_next/image/*` paths

**Prevention**:
- Optimize source images before committing (<500KB each)
- Set realistic sizes prop (no larger than 1920px for desktop)
- Enable Caddy caching for optimized images

**Related**:
- Spec: NFR-001 (LCP <2.5s)
- Code: components/home/MagazineMasonry.tsx:38-45, Caddyfile

---

### Issue 5: Alt Text Missing for Decorative Images
**Severity**: Low
**Phase**: Implementation/Testing
**Component**: Multiple components with decorative images

**Description**:
Lighthouse Accessibility audit flags images with missing alt attributes

**Root Cause**:
- Decorative images (backgrounds, spacers) use alt={undefined} or no alt prop
- Should use alt="" (empty string) for decorative images

**Resolution**:
1. Run Lighthouse Accessibility audit
2. Identify images flagged for missing alt
3. Determine if image is decorative:
   - Decorative: alt="" (empty string)
   - Informative: alt="Descriptive text"
4. Update component with appropriate alt

**Prevention**:
- Use alt="" explicitly for decorative images
- Run Lighthouse Accessibility audit before deploying
- Add ESLint rule: `jsx-a11y/alt-text`

**Related**:
- Spec: NFR-004 (WCAG 2.1 AA alt text requirement)
- Code: All Image components

---

## Debugging Commands

```bash
# Check for unoptimized images
npm run build 2>&1 | grep -i "unoptimized"

# Verify sharp installed
npm list sharp

# Check optimized image cache
ls -lh .next/cache/images/ | head -20

# Run Lighthouse audit
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility

# Find images missing alt
grep -r "<Image" --include="*.tsx" components/ | grep -v 'alt='

# Check image formats in cache
file .next/cache/images/* | grep -E "(WebP|AVIF)"

# Monitor image optimization in dev
npm run dev
# Open DevTools → Network → Img filter
# Check for /_next/image?url= requests
```

### Entry 1: 2025-10-28 - React Hydration Mismatch from Browser Extensions

**Failure**: React hydration warning in console during preview testing
**Symptom**: Console error "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties" pointing to app/layout.tsx:28 body tag. Browser extensions (Grammarly) were injecting `data-gr-ext-installed` and `data-new-gr-c-s-check-loaded` attributes into the body tag on client side, causing mismatch with server-rendered HTML.
**Learning**: Browser extensions can inject attributes/elements into the DOM, causing hydration mismatches. Solution is to add `suppressHydrationWarning` prop to elements that may be modified by extensions. The html tag already had this, but body tag was missing it.
**Ghost Context Cleanup**: None - this is a new error encountered during preview phase

**During preview phase** - Image optimization feature (050)

