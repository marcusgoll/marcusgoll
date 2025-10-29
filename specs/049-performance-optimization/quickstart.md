# Quickstart: 049-performance-optimization

## Scenario 1: Initial Setup & Baseline Measurement

**Goal**: Install dependencies and establish performance baseline before optimizations.

```bash
# Navigate to project root
cd D:/Coding/marcusgoll

# Install new dependencies
npm install @next/bundle-analyzer@^15.0.0 web-vitals@^4.2.0
npm install --save-dev @lhci/cli@^0.14.0

# Verify installations
npm list @next/bundle-analyzer web-vitals @lhci/cli

# Run baseline bundle analysis
ANALYZE=true npm run build

# Open bundle analyzer report (manual step)
# Windows: start .next/analyze/client.html
# macOS: open .next/analyze/client.html
# Linux: xdg-open .next/analyze/client.html

# Start development server for baseline Lighthouse audit
npm run dev

# In another terminal: Run Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Document baseline metrics (save Lighthouse JSON report)
npx lighthouse http://localhost:3000 --output json --output-path ./specs/049-performance-optimization/baseline-lighthouse.json

# Document current bundle size
du -sh .next/static
# Expected: ~1.3MB uncompressed

# Check gzipped size (if already built)
gzip -c .next/static/chunks/main-app-*.js | wc -c
# Expected: Document for comparison after optimizations
```

**Expected Output**:
- ✅ Dependencies installed successfully
- ✅ Bundle analyzer report generated at `.next/analyze/client.html`
- ✅ Baseline Lighthouse report saved to `baseline-lighthouse.json`
- ✅ Current bundle size documented

**Troubleshooting**:
- If `ANALYZE=true npm run build` fails: Check `next.config.ts` has bundle analyzer wrapper
- If Lighthouse times out: Increase timeout with `--max-wait-for-load 60000`

---

## Scenario 2: Development Workflow (Implementing Optimizations)

**Goal**: Implement font optimization, dynamic imports, and Web Vitals tracking.

### Step 1: Font Optimization

```bash
# Create font configuration file
# File: app/fonts.ts
```

```typescript
import { Work_Sans, JetBrains_Mono } from 'next/font/google';

export const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['400', '600', '700'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400'],
});
```

### Step 2: Update Root Layout

```bash
# Edit app/layout.tsx
# Add font imports and variables
```

```typescript
import { workSans, jetbrainsMono } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {/* ... rest of layout */}
      </body>
    </html>
  );
}
```

### Step 3: Dynamic Import for Dialog

```bash
# Edit components/home/Hero.tsx
# Replace eager import with dynamic import
```

```typescript
import dynamic from 'next/dynamic';

const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => ({
  default: mod.Dialog,
})), {
  ssr: false,
});

const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => ({
  default: mod.DialogContent,
})), {
  ssr: false,
});

// ... rest of Dialog subcomponents
```

### Step 4: Web Vitals Tracking

```bash
# Create Web Vitals tracking module
# File: lib/web-vitals-tracking.ts
```

```typescript
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';

export function sendMetricToGA4(metric: Metric) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'web_vitals', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    page_path: window.location.pathname,
  });

  console.debug('[Web Vitals]', metric.name, metric.value, metric.rating);
}

export function reportWebVitals() {
  onCLS(sendMetricToGA4);
  onFCP(sendMetricToGA4);
  onLCP(sendMetricToGA4);
  onTTFB(sendMetricToGA4);
  onINP(sendMetricToGA4);
}
```

### Step 5: Test Locally

```bash
# Build and start production server locally
npm run build
npm start

# In browser DevTools:
# 1. Open Network tab → Check for separate Dialog chunk
# 2. Open Console → Verify [Web Vitals] logs appear
# 3. Open Performance tab → Run Lighthouse audit

# Verify font loading
# DevTools → Network → Filter: "font" → Check for .woff2 files
# Should see: work-sans-*.woff2, jetbrains-mono-*.woff2

# Verify no FOIT (Flash of Invisible Text)
# Throttle network to Slow 3G
# Reload page → Text should be visible immediately (fallback font)
# Font swap happens smoothly (font-display: swap)
```

**Expected Output**:
- ✅ Fonts load as .woff2 files from `/_next/static/media/`
- ✅ Dialog component loads as separate chunk (check Network tab)
- ✅ Web Vitals logs appear in console
- ✅ No FOIT observed (text visible immediately)

---

## Scenario 3: Validation Workflow (Lighthouse CI)

**Goal**: Run Lighthouse audits locally and via CI.

### Local Lighthouse CI

```bash
# Create Lighthouse CI configuration
# File: lighthouserc.json
```

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/blog/example-post"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

```bash
# Start production server locally
npm run build && npm start

# In another terminal: Run Lighthouse CI
npx lhci autorun

# Expected output:
# ✅ 3 runs completed for each URL
# ✅ Median scores calculated
# ✅ Assertions passed (or failed with specific errors)
# ✅ Report URL generated (temporary public storage)
```

### GitHub Actions Workflow

```bash
# Create Lighthouse CI workflow
# File: .github/workflows/lighthouse-ci.yml
```

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm start & npx wait-on http://localhost:3000
      - run: npx lhci autorun
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: lighthouse-reports
          path: .lighthouseci/
```

```bash
# Commit and push to trigger workflow
git add .
git commit -m "feat(perf): add Lighthouse CI workflow"
git push origin feature/049-performance-optimization

# Check GitHub Actions tab for workflow results
# Expected: Workflow runs, Lighthouse reports generated
```

**Expected Output**:
- ✅ Lighthouse CI workflow runs on PR
- ✅ Performance budgets enforced
- ✅ Reports uploaded to GitHub Actions artifacts

---

## Scenario 4: Bundle Analysis & Optimization

**Goal**: Identify and optimize bundle size.

```bash
# Generate bundle analysis report
ANALYZE=true npm run build

# Open report in browser
# Windows: start .next/analyze/client.html
# macOS: open .next/analyze/client.html

# Analyze largest dependencies
# Look for:
# - framer-motion size (if > 30KB, consider alternatives)
# - Duplicate dependencies (e.g., multiple React versions)
# - Unused code (tree-shaking opportunities)

# Example: Check if framer-motion is worth the bundle cost
npm run build 2>&1 | grep -i "framer-motion"

# If framer-motion is too heavy, consider replacing with CSS animations
# Or lazy load only where needed:
const FramerComponent = dynamic(() => import('@/components/framer-component'), {
  ssr: false,
});
```

**Decision Tree**:
```
Is dependency > 30KB gzipped?
├─ Yes → Is it critical for above-the-fold?
│  ├─ Yes → Keep, but ensure tree-shaking works
│  └─ No → Lazy load with dynamic import
└─ No → Keep as-is
```

**Example Optimizations**:
1. **Remove unused imports**: `import { specific } from 'library'` instead of `import * as all`
2. **Lazy load heavy components**: Dialog, Charts, Maps
3. **Check for duplicate dependencies**: `npm dedupe`
4. **Tree-shake libraries**: Ensure `"sideEffects": false` in package.json

---

## Scenario 5: GA4 Web Vitals Validation

**Goal**: Verify Web Vitals are tracked in Google Analytics 4.

```bash
# Enable GA4 DebugView for testing
# 1. Install GA Debugger Chrome extension
# 2. Visit site with ?debug=1 query parameter
# Example: http://localhost:3000?debug=1

# Navigate through site
# 1. Visit homepage
# 2. Navigate to blog post
# 3. Interact with page (scroll, click links)

# Check GA4 DebugView (in GA4 dashboard)
# Expected events:
# - web_vitals (event_name)
#   - metric_name: FCP, LCP, CLS, TTFB, INP
#   - metric_value: <number>
#   - metric_rating: good/needs-improvement/poor
#   - page_path: /

# Create GA4 Custom Report
# 1. Go to GA4 → Explore → Create new exploration
# 2. Add dimensions: metric_name, metric_rating, page_path
# 3. Add metrics: Event count, Avg metric_value
# 4. Filter: event_name = 'web_vitals'
# 5. Save as "Web Vitals Performance"
```

**Expected GA4 Events**:
```json
{
  "event": "web_vitals",
  "metric_name": "LCP",
  "metric_value": 2100,
  "metric_rating": "good",
  "page_path": "/"
}
```

---

## Scenario 6: Production Deployment & Verification

**Goal**: Deploy optimizations to production and verify performance improvements.

```bash
# SSH into VPS
ssh hetzner

# Navigate to project directory
cd /path/to/marcusgoll

# Pull latest changes
git pull origin main

# Rebuild Docker container
docker-compose down
docker-compose up --build -d

# Wait for deployment (check logs)
docker-compose logs -f web

# Exit logs (Ctrl+C)

# Verify deployment
curl -I https://marcusgoll.com
# Expected: 200 OK, Content-Encoding: gzip or br

# Run production Lighthouse audit
npx lighthouse https://marcusgoll.com --view

# Check Web Vitals in GA4
# Wait 24-48 hours for data to accumulate
# GA4 → Reports → Engagement → Events → web_vitals
```

**Production Validation Checklist**:
- [ ] Site loads successfully (https://marcusgoll.com)
- [ ] Fonts load without FOIT (visual inspection)
- [ ] Lighthouse Performance > 90
- [ ] Bundle size < 200KB gzipped (check DevTools Network tab)
- [ ] Web Vitals tracked in GA4 (check DebugView or wait 24h for reports)
- [ ] No console errors (check DevTools Console)
- [ ] Compression enabled (check Response Headers: `Content-Encoding: br` or `gzip`)

---

## Troubleshooting

### Issue: Bundle analyzer fails to generate report
**Solution**:
```bash
# Check next.config.ts has correct wrapper
# Should be: withBundleAnalyzer(withMDX(nextConfig))

# Try manual build with verbose logging
ANALYZE=true npm run build --verbose

# If still fails, install bundle analyzer manually
npm install --save-dev webpack-bundle-analyzer
```

### Issue: Fonts not loading (404 errors)
**Solution**:
```bash
# Check font files generated in .next/static/media/
ls -la .next/static/media/

# Verify font configuration in app/fonts.ts
# Ensure correct import: import { Work_Sans } from 'next/font/google'

# Check browser DevTools → Network → Filter: "font"
# Should see: work-sans-*.woff2 with 200 status
```

### Issue: Web Vitals not appearing in GA4
**Solution**:
```bash
# Check GA4 ID is set
echo $NEXT_PUBLIC_GA_ID

# Enable GA4 DebugView (Chrome extension + ?debug=1)
# Visit: http://localhost:3000?debug=1

# Check browser console for [Web Vitals] logs
# If logs appear but GA4 doesn't receive: Check gtag is loaded

# Verify gtag function exists
# DevTools → Console: typeof window.gtag
# Expected: "function"
```

### Issue: Lighthouse CI fails on GitHub Actions
**Solution**:
```bash
# Check workflow runs successfully
# GitHub → Actions → Lighthouse CI → View logs

# Common issues:
# - Port 3000 already in use: Use wait-on with timeout
# - Build fails: Check npm ci vs npm install
# - Assertions fail: Review lighthouserc.json budgets

# Run Lighthouse CI locally first
npm run build && npm start
npx lhci autorun

# Adjust budgets if needed (lighthouserc.json)
```

---

## Quick Reference Commands

```bash
# Install dependencies
npm install @next/bundle-analyzer web-vitals
npm install --save-dev @lhci/cli

# Run bundle analyzer
ANALYZE=true npm run build

# Run Lighthouse locally
npx lighthouse http://localhost:3000 --view

# Run Lighthouse CI locally
npm run build && npm start
npx lhci autorun

# Check bundle size
du -sh .next/static

# Check gzipped JS size
gzip -c .next/static/chunks/main-app-*.js | wc -c

# Deploy to production (VPS)
ssh hetzner
cd /path/to/marcusgoll
git pull && docker-compose up --build -d
```
