# Quickstart: 050-image-optimization

## Scenario 1: Initial Setup & Configuration

```bash
# 1. Navigate to project root
cd /d/coding/tech-stack-foundation-core

# 2. Install dependencies (if not already)
npm install

# 3. Update next.config.ts with image optimization settings
# (Manual edit - see plan.md for configuration)

# 4. Create shimmer utility for blur placeholders
mkdir -p lib/utils
# (Create lib/utils/shimmer.ts - see data-model.md)

# 5. Start dev server to test
npm run dev
# Open http://localhost:3000
```

## Scenario 2: Validation & Testing

### Performance Baseline (Before Optimization)

```bash
# 1. Build production version
npm run build

# 2. Run Lighthouse audit (baseline)
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=specs/050-image-optimization/baseline-lighthouse.json \
  --preset=desktop \
  --only-categories=performance

# 3. Extract key metrics
jq '.audits["largest-contentful-paint"].numericValue / 1000' specs/050-image-optimization/baseline-lighthouse.json
jq '.audits["cumulative-layout-shift"].numericValue' specs/050-image-optimization/baseline-lighthouse.json
jq '.categories.performance.score * 100' specs/050-image-optimization/baseline-lighthouse.json

# 4. Measure image transfer size
# Open DevTools → Network → Img filter
# Record total KB transferred (document in NOTES.md)
```

### Component Testing

```bash
# 1. Test PostCard with blur placeholder
# Navigate to: http://localhost:3000
# Open DevTools → Network → Throttle to Slow 3G
# Verify: Blur placeholder appears before image loads

# 2. Test MagazineMasonry hero with priority
# Verify: Hero image loads immediately (no lazy load delay)
# Check Network tab: Hero image has <link rel="preload"> hint

# 3. Test MDXImage with external URL
# Open blog post with external image
# Verify: External image optimized (WebP/AVIF format served)
# Check Console: No "Unoptimized Image" warnings

# 4. Test responsive sizing
# Open DevTools → Device toolbar
# Resize viewport: Mobile (375px) → Tablet (768px) → Desktop (1200px)
# Check Network tab: Different image sizes downloaded for each viewport
```

### Performance Validation (After Optimization)

```bash
# 1. Rebuild with optimizations
npm run build

# 2. Run Lighthouse audit (after)
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=specs/050-image-optimization/optimized-lighthouse.json \
  --preset=desktop \
  --only-categories=performance

# 3. Compare metrics
echo "=== Before ===" && \
jq '.audits["largest-contentful-paint"].numericValue / 1000' specs/050-image-optimization/baseline-lighthouse.json && \
echo "=== After ===" && \
jq '.audits["largest-contentful-paint"].numericValue / 1000' specs/050-image-optimization/optimized-lighthouse.json

# 4. Calculate improvement percentage
# LCP: (baseline - optimized) / baseline * 100
# Target: ≥20% improvement

# 5. Verify image bytes reduction
# Compare Network tab total image KB (baseline vs optimized)
# Target: ≥30% reduction
```

## Scenario 3: Alt Text Audit

```bash
# 1. Find all Image components
grep -r "next/image" --include="*.tsx" components/ app/

# 2. Check for missing alt attributes
grep -r "<Image" --include="*.tsx" components/ app/ | \
  grep -v 'alt=' | \
  grep -v 'alt="' | \
  grep -v 'alt={'

# 3. Review alt text quality
# Open each component file
# Check: Alt text describes image content, not just repeats title
# Check: Decorative images use alt=""

# 4. Test with screen reader
# macOS: CMD+F5 to enable VoiceOver
# Windows: Win+Ctrl+Enter to enable Narrator
# Navigate to image, verify alt text is read aloud
```

## Scenario 4: Build Cache Inspection

```bash
# 1. Clear image cache
rm -rf .next/cache/images/

# 2. Rebuild
npm run build

# 3. Inspect generated images
ls -lh .next/cache/images/ | head -20

# 4. Check formats
file .next/cache/images/* | grep -E "(WebP|AVIF)"

# 5. Verify cache size
du -sh .next/cache/images/

# Expected: Multiple formats per image (AVIF, WebP, fallback)
```

## Scenario 5: Local Development Workflow

```bash
# 1. Make changes to Image components
# (e.g., add blur placeholder to PostCard)

# 2. Hot reload (automatic in dev mode)
# Verify changes immediately in browser

# 3. Check for console warnings
# Open DevTools → Console
# Look for Next.js Image warnings:
#   - "Image with src X is missing width/height"
#   - "Image with src X is using an external domain without remotePatterns"

# 4. Type check
npx tsc --noEmit

# 5. Lint
npm run lint

# 6. Test locally before committing
# Run through all scenarios above
```

## Scenario 6: Rollback Testing

```bash
# 1. Document current state
git log -1 --oneline > specs/050-image-optimization/pre-rollback.txt

# 2. Simulate rollback
git stash # Save current changes

# 3. Test site without optimizations
npm run dev
# Verify site still works (images may be slower but functional)

# 4. Re-apply optimizations
git stash pop

# 5. Verify optimizations restored
npm run dev
# Check blur placeholders, priority loading, WebP formats
```

## Scenario 7: CI/CD Pre-Deployment Checks

```bash
# 1. Run all checks (as CI would)
npm run lint && \
npx tsc --noEmit && \
npm run build && \
echo "✅ All checks passed"

# 2. Verify no image optimization errors in build log
# Look for:
#   - "Error: Invalid src prop"
#   - "Error: Image optimization failed"
#   - "Warning: Using external domain without remotePatterns"

# 3. Check bundle size
npm run build | grep "First Load JS"
# Verify: No significant increase (image optimization should not bloat bundle)

# 4. Test production build locally
npm run start
# Open http://localhost:3000
# Verify: All images load correctly in production mode
```

## Scenario 8: Debugging Common Issues

### Issue: "Unoptimized Image" Warning

```bash
# Problem: External image domain not whitelisted
# Solution: Add domain to next.config.ts remotePatterns

# 1. Check warning message for domain
# Console: "Unoptimized Image Detected: https://example.com/image.jpg"

# 2. Add to next.config.ts
# images: {
#   remotePatterns: [
#     { protocol: 'https', hostname: 'example.com' }
#   ]
# }

# 3. Rebuild and verify
npm run build
```

### Issue: Layout Shift (High CLS)

```bash
# Problem: Image dimensions not specified or aspect ratio missing

# 1. Run Lighthouse CLS audit
npx lighthouse http://localhost:3000 --view

# 2. Identify problematic images
# DevTools → Performance → Record page load
# Look for "Layout Shift" events triggered by images

# 3. Fix: Add aspect-ratio container or specify dimensions
# Before: <Image src={src} alt={alt} fill />
# After:  <div className="relative aspect-video"><Image src={src} alt={alt} fill /></div>

# 4. Verify fix
# Reload page with Network throttling (Slow 3G)
# Verify: No layout shift when images load
```

### Issue: Slow LCP (>2.5s)

```bash
# Problem: Hero image is lazy loaded or oversized

# 1. Check if hero image has priority prop
grep -A5 "featured.*Image" components/home/MagazineMasonry.tsx | grep priority

# 2. Add priority prop if missing
# <Image src={hero} alt={alt} priority />

# 3. Verify sizes prop matches rendered size
# DevTools → Inspect hero image
# Check: Rendered size vs downloaded size (should be similar)

# 4. Run Lighthouse to confirm improvement
npx lighthouse http://localhost:3000 --only-categories=performance
```

## Environment Variables (if needed)

```bash
# No new environment variables required for image optimization
# Next.js Image Optimization works with default settings
```

## Quick Reference Commands

```bash
# Start dev server
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Lighthouse audit
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance

# Find all Image components
grep -r "next/image" --include="*.tsx" components/ app/

# Clear image cache
rm -rf .next/cache/images/

# Check build output
npm run build 2>&1 | grep -i "image"
```

## Useful DevTools Settings

**Network Tab**:
- Throttle: Slow 3G (for testing placeholders)
- Filter: Img (to see only images)
- Disable cache (to test fresh loads)

**Performance Tab**:
- Record page load
- Look for: Layout Shift events, LCP timing

**Console Tab**:
- Filter: "Image" or "Next" (for Next.js warnings)

**Elements Tab**:
- Inspect image → Styles
- Verify: aspect-ratio, object-fit applied correctly
