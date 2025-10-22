# Quickstart: SEO & Analytics Infrastructure

## Overview

This quickstart provides step-by-step scenarios for implementing, testing, and validating the SEO & Analytics Infrastructure feature.

---

## Scenario 1: Initial Setup

**Purpose**: Install dependencies and configure environment variables

### Step 1: Install Dependencies

```bash
# From repository root
cd /d/coding/tech-stack-foundation-core

# Install next-seo package
pnpm add next-seo@^6.5.0

# Verify installation
pnpm list next-seo
```

**Expected output**:
```
next-seo@6.5.0
```

### Step 2: Configure Environment Variables

**Local development** (`.env.local`):
```bash
# Google Analytics 4 (optional for local dev)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-LOCAL123

# Site URL for sitemap generation
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Vercel staging**:
```bash
# Set via Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
# Enter: G-STAGING123

vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://app-staging.cfipros.vercel.app
```

**Vercel production**:
```bash
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
# Enter: G-PRODUCTION456

vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://marcusgoll.com
```

### Step 3: Verify Setup

```bash
# Check environment variables loaded
pnpm dev

# Open browser DevTools Console
# Should see: [Analytics] Page view: { path: '/', track: 'general' }
```

---

## Scenario 2: Build & Sitemap Generation

**Purpose**: Build application and verify sitemap.xml generated

### Step 1: Run Production Build

```bash
# Clean previous build
rm -rf .next

# Build application
pnpm build
```

**Expected output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         90.1 kB
├ ○ /blog                                3.8 kB         88.7 kB
└ ○ /blog/[slug]                         2.9 kB         87.8 kB
...

✅ Sitemap generated successfully
```

### Step 2: Verify Sitemap

```bash
# Check sitemap.xml exists
ls -lah public/sitemap.xml

# View sitemap content
cat public/sitemap.xml
```

**Expected content**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://marcusgoll.com</loc>
    <lastmod>2025-10-22T18:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://marcusgoll.com/blog</loc>
    <lastmod>2025-10-22T18:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Blog posts -->
  <url>
    <loc>https://marcusgoll.com/blog/post-slug</loc>
    <lastmod>2025-10-20T12:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Step 3: Start Production Server

```bash
# Start server with production build
pnpm start

# Access sitemap
curl http://localhost:3000/sitemap.xml
```

---

## Scenario 3: Meta Tag Validation (Local)

**Purpose**: Verify meta tags (title, description, Open Graph, Twitter Cards) present on all page types

### Step 1: Start Development Server

```bash
pnpm dev
```

### Step 2: Test Homepage Meta Tags

```bash
# View page source
curl http://localhost:3000 | grep -E '(title|description|og:|twitter:)'
```

**Expected output**:
```html
<title>Marcus Gollahon | Aviation & Software Development</title>
<meta name="description" content="Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.">
<meta property="og:title" content="Marcus Gollahon | Aviation & Software Development">
<meta property="og:description" content="Teaching systematic thinking from 30,000 feet...">
<meta property="og:url" content="https://marcusgoll.com">
<meta property="og:type" content="website">
<meta property="og:image" content="https://marcusgoll.com/images/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Marcus Gollahon | Aviation & Software Development">
<meta name="twitter:description" content="Teaching systematic thinking...">
<meta name="twitter:image" content="https://marcusgoll.com/images/og-default.png">
```

### Step 3: Test Blog Post Meta Tags

```bash
# Pick any blog post slug
curl http://localhost:3000/blog/test-post | grep -E '(title|description|og:|twitter:)'
```

**Expected**: Page-specific title, description, Open Graph image, Twitter Card tags

### Step 4: Visual Verification (Browser DevTools)

1. Open http://localhost:3000 in browser
2. Open DevTools → Elements tab
3. Inspect `<head>` section
4. Verify meta tags present:
   - `<title>` (unique)
   - `<meta name="description">` (150-160 chars)
   - `<meta property="og:*">` (Open Graph)
   - `<meta name="twitter:*">` (Twitter Cards)

---

## Scenario 4: JSON-LD Structured Data Validation

**Purpose**: Validate JSON-LD schemas pass Google Rich Results Test

### Step 1: Extract JSON-LD from Blog Post

```bash
# Get JSON-LD script tag from blog post
curl http://localhost:3000/blog/test-post | grep -A 20 'application/ld+json'
```

**Expected output**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Test Post Title",
  "author": {
    "@type": "Person",
    "name": "Marcus Gollahon",
    "url": "https://marcusgoll.com"
  },
  "datePublished": "2025-10-20T12:00:00.000Z",
  "dateModified": "2025-10-22T18:00:00.000Z",
  "image": "https://marcusgoll.com/images/post-featured.png",
  "publisher": {
    "@type": "Organization",
    "name": "Marcus Gollahon",
    "logo": {
      "@type": "ImageObject",
      "url": "https://marcusgoll.com/images/logo.png"
    }
  }
}
</script>
```

### Step 2: Validate with Google Rich Results Test

1. Copy JSON-LD content from Step 1
2. Go to: https://search.google.com/test/rich-results
3. Paste JSON-LD or enter URL: http://localhost:3000/blog/test-post
4. Click "Test Code" or "Test URL"

**Expected result**:
- ✅ **Valid** - Article schema detected
- ✅ **Zero errors**
- ✅ **Zero warnings** (or acceptable warnings for optional fields)

### Step 3: Verify WebSite Schema (Homepage)

```bash
# Extract WebSite JSON-LD from homepage
curl http://localhost:3000 | grep -A 15 '"@type": "WebSite"'
```

**Expected**: WebSite schema with name, url, description, author

---

## Scenario 5: Google Analytics 4 Event Tracking

**Purpose**: Verify GA4 pageviews and custom events fire correctly

### Step 1: Enable GA4 DebugView

1. Install Google Analytics Debugger extension: https://chrome.google.com/webstore/detail/google-analytics-debugger/
2. Open extension, enable debugging
3. Go to GA4 property → DebugView (https://analytics.google.com)

### Step 2: Test Page View Events

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000 in browser with debugger enabled
```

**Expected in GA4 DebugView** (within 60 seconds):
- Event: `page_view`
- Parameters:
  - `page_path`: `/`
  - `content_track`: `general`

### Step 3: Test Custom Events (Newsletter)

```javascript
// Open browser console on http://localhost:3000
// Import analytics module
import { trackNewsletterView, trackNewsletterSubmit, trackNewsletterSuccess } from '@/lib/analytics';

// Fire custom events
trackNewsletterView({ location: window.location.pathname, track: 'aviation' });
trackNewsletterSubmit({ location: window.location.pathname, track: 'aviation' });
trackNewsletterSuccess({ location: window.location.pathname, track: 'aviation' });
```

**Expected in GA4 DebugView**:
- Event: `newsletter_view` (parameters: location, content_track)
- Event: `newsletter_submit` (parameters: location, content_track)
- Event: `newsletter_success` (parameters: location, content_track)

### Step 4: Verify Event Parameters

In GA4 DebugView, click on each event and verify parameters:
- `event_name`: Matches expected (newsletter_view, etc.)
- `page_path`: Current URL
- `content_track`: aviation, dev-startup, cross-pollination, or general
- `location`: Page path where event fired
- No PII in parameters (privacy requirement NFR-007)

---

## Scenario 6: Robots.txt Validation

**Purpose**: Verify robots.txt accessible and contains AI crawler directives

### Step 1: Access Robots.txt

```bash
# Start server
pnpm dev

# Fetch robots.txt
curl http://localhost:3000/robots.txt
```

**Expected output**:
```
User-agent: *
Allow: /
Disallow: /api
Disallow: /admin

User-agent: GPTBot
Allow: /blog/
Disallow: /

User-agent: Google-Extended
Allow: /blog/
Disallow: /

User-agent: ClaudeBot
Allow: /blog/
Disallow: /

User-agent: CCBot
Allow: /blog/
Disallow: /

Sitemap: https://marcusgoll.com/sitemap.xml
```

### Step 2: Validate AI Crawler Rules

**Verify**:
- ✅ GPTBot allowed on /blog/, disallowed elsewhere
- ✅ ClaudeBot allowed on /blog/, disallowed elsewhere
- ✅ Google-Extended allowed on /blog/, disallowed elsewhere
- ✅ CCBot allowed on /blog/, disallowed elsewhere
- ✅ Sitemap reference present

---

## Scenario 7: Performance Validation (Lighthouse)

**Purpose**: Ensure no performance regression, validate SEO score improvement

### Step 1: Baseline Measurement (Before Implementation)

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run baseline test
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-before.html
```

**Record baseline scores**:
- Performance: ? (target: ≥90)
- Accessibility: ? (target: ≥95)
- Best Practices: ? (target: ≥90)
- SEO: ? (target: ≥95 after implementation)

### Step 2: Post-Implementation Measurement

```bash
# After implementing all changes, run Lighthouse again
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-after.html
```

**Compare scores**:
- Performance: No regression (should be ≥90)
- Accessibility: Improved or maintained (≥95)
- Best Practices: Maintained (≥90)
- **SEO: Improved** (should increase to ≥95)

### Step 3: Analyze SEO Audit

Open `lighthouse-after.html` and check SEO audits:
- ✅ Document has a `<meta name="description">`
- ✅ Document has a valid `<title>`
- ✅ Document uses legible font sizes
- ✅ Tap targets are sized appropriately
- ✅ Links have descriptive text
- ✅ `robots.txt` is valid
- ✅ Image elements have `[alt]` attributes

---

## Scenario 8: Staging Smoke Tests

**Purpose**: Validate feature in staging environment before production

### Step 1: Deploy to Staging

```bash
# Commit changes
git add .
git commit -m "feat: SEO & Analytics Infrastructure (US1-US8)"

# Push to staging branch
git push origin feature/004-seo-analytics

# Create PR, merge to staging
# Vercel auto-deploys to staging URL
```

### Step 2: Smoke Test Checklist

**Meta Tags**:
- [ ] Visit https://app-staging.cfipros.vercel.app/
- [ ] View page source, verify Open Graph tags present
- [ ] Share link on Twitter/Facebook, verify rich preview

**Sitemap**:
- [ ] Access https://app-staging.cfipros.vercel.app/sitemap.xml
- [ ] Verify XML is valid
- [ ] Verify contains all blog posts

**Robots.txt**:
- [ ] Access https://app-staging.cfipros.vercel.app/robots.txt
- [ ] Verify AI crawler directives present

**Analytics**:
- [ ] Visit https://app-staging.cfipros.vercel.app/
- [ ] Open GA4 DebugView for staging property (G-STAGING123)
- [ ] Verify page_view event fires within 60 seconds

**JSON-LD**:
- [ ] Visit https://app-staging.cfipros.vercel.app/blog/test-post
- [ ] Extract JSON-LD from page source
- [ ] Validate with Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Verify zero errors

**Performance**:
- [ ] Run Lighthouse on staging URL
- [ ] Verify Performance ≥90, SEO ≥95
- [ ] Verify FCP <1.5s, LCP <3s

### Step 3: Sign Off for Production

Once all smoke tests pass:
```bash
# Approve PR for production merge
# Or run promotion command
vercel promote <staging-deployment-url> --prod
```

---

## Scenario 9: Production Validation

**Purpose**: Verify feature working in production, monitor for issues

### Step 1: Post-Deployment Verification (Day 1)

**Immediate checks**:
- [ ] Visit https://marcusgoll.com/ - Verify meta tags present
- [ ] Access https://marcusgoll.com/sitemap.xml - Verify sitemap accessible
- [ ] Access https://marcusgoll.com/robots.txt - Verify robots.txt accessible
- [ ] Open GA4 Real-Time dashboard - Verify events flowing (production property G-PRODUCTION456)

**Social sharing test**:
- [ ] Share https://marcusgoll.com/blog/post-slug on Twitter
- [ ] Verify rich preview (image, title, description) displays
- [ ] Test Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

### Step 2: Search Console Monitoring (Days 1-7)

1. Go to Google Search Console: https://search.google.com/search-console
2. Add property: https://marcusgoll.com (if not already added)
3. Submit sitemap: https://marcusgoll.com/sitemap.xml
4. Monitor indexing status:
   - Check "Coverage" report daily
   - Verify blog posts indexed within 7 days
   - Check for errors (404s, noindex tags, etc.)

### Step 3: Analytics Baseline (Days 1-30)

**Establish baseline metrics** (from HEART framework):
- Google Search Console:
  - Organic impressions: Record baseline per day
  - Organic clicks: Record baseline per day
  - Average CTR: Calculate baseline percentage
  - Average position: Record baseline ranking
- Google Analytics 4:
  - Pageviews: Record daily average
  - Bounce rate: Record baseline percentage
  - Average session duration: Record baseline in minutes
  - Custom event counts: newsletter_view, newsletter_submit, newsletter_success

**Store baselines in**: `specs/004-seo-analytics/NOTES.md` (Metrics section)

---

## Troubleshooting

### Issue: Sitemap not generated

**Symptom**: `public/sitemap.xml` missing after build

**Debug**:
```bash
# Check postbuild script ran
pnpm build 2>&1 | grep "Sitemap"

# Manually run sitemap generator
node -e "require('./lib/generate-sitemap').generateSitemap()"
```

**Solution**: Verify `package.json` has postbuild script:
```json
{
  "scripts": {
    "postbuild": "tsx lib/generate-sitemap.ts"
  }
}
```

---

### Issue: Meta tags not appearing

**Symptom**: View-source shows no Open Graph or Twitter Card tags

**Debug**:
```bash
# Check if NextSeo component imported
grep -r "NextSeo" app/

# Check seo-config.ts exists
ls -la lib/seo-config.ts
```

**Solution**: Ensure NextSeo component used in page components:
```tsx
import { NextSeo } from 'next-seo';
import { getPageSEO } from '@/lib/seo-config';

export default function Page() {
  const seo = getPageSEO({ title: 'Page Title', description: 'Page description' });
  return (
    <>
      <NextSeo {...seo} />
      {/* Page content */}
    </>
  );
}
```

---

### Issue: GA4 events not firing

**Symptom**: GA4 DebugView shows no events

**Debug**:
```javascript
// Browser console
console.log(typeof window.gtag); // Should be 'function'
console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID); // Should be G-XXXXXXXXXX
```

**Solution**:
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in environment variables
2. Check browser console for errors (ad blocker may block GA4 script)
3. Disable ad blocker, refresh page
4. Verify gtag script loaded: View-source → Search for "googletagmanager.com/gtag/js"

---

### Issue: JSON-LD validation errors

**Symptom**: Google Rich Results Test shows errors

**Debug**:
1. Copy JSON-LD from page source
2. Validate at: https://validator.schema.org/
3. Check error messages (missing required fields, invalid dates, etc.)

**Solution**: Update `lib/json-ld.ts` to include all required Article schema fields:
- headline (required)
- author (required)
- datePublished (required)
- image (required)
- publisher (required)

---

## Reference Links

**Testing Tools**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Google Search Console: https://search.google.com/search-console
- Google Analytics 4: https://analytics.google.com/

**Documentation**:
- next-seo: https://github.com/garmeeh/next-seo
- schema.org Article: https://schema.org/Article
- schema.org WebSite: https://schema.org/WebSite
- robots.txt spec: https://www.robotstxt.org/
- GA4 Events: https://developers.google.com/analytics/devguides/collection/ga4/events
