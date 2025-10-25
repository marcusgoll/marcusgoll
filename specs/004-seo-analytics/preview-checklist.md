# Preview Testing Checklist: SEO & Analytics Infrastructure

**Generated**: 2025-10-24
**Feature**: 004-seo-analytics
**Type**: Infrastructure (No Visual UI)
**Tester**: Claude Code

---

## Overview

This feature adds SEO meta tags, analytics tracking, sitemap generation, and robots.txt directives. Since there are no visible UI changes, testing focuses on:
1. Meta tag validation (view source)
2. Technical SEO validation (external tools)
3. Analytics tracking verification
4. Build artifacts (sitemap.xml, robots.txt)

---

## Routes to Test

- [x] http://localhost:3000 (Homepage)
- [x] http://localhost:3000/blog (Blog Index)
- [x] http://localhost:3000/blog/welcome-to-mdx (Sample Blog Post)
- [x] http://localhost:3000/blog/from-cockpit-to-code (Sample Blog Post 2)

---

## US1 [P1]: Meta Tags Validation

### Test 1.1: Homepage Meta Tags
- [ ] **View Page Source** (Ctrl+U)
- [ ] Verify `<title>` tag contains: "Home | Marcus Gollahon"
- [ ] Verify `<meta name="description">` exists
- [ ] Verify description contains: "Teaching systematic thinking from 30,000 feet"
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 1.2: Blog Index Meta Tags
- [ ] **View Page Source** for /blog
- [ ] Verify `<title>` tag contains: "Blog | Marcus Gollahon"
- [ ] Verify `<meta name="description">` exists
- [ ] Verify description mentions "Aviation career guidance, software development"
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 1.3: Blog Post Meta Tags
- [ ] **View Page Source** for /blog/welcome-to-mdx
- [ ] Verify `<title>` matches post title from frontmatter
- [ ] Verify `<meta name="description">` matches post excerpt
- [ ] Verify `<meta name="author">` exists
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## US2 [P1]: Open Graph & Twitter Cards

### Test 2.1: Open Graph Tags (Homepage)
- [ ] **View Page Source** for homepage
- [ ] Verify `<meta property="og:title">` exists
- [ ] Verify `<meta property="og:description">` exists
- [ ] Verify `<meta property="og:image">` exists with absolute URL
- [ ] Verify `<meta property="og:url">` = "https://marcusgoll.com"
- [ ] Verify `<meta property="og:type">` = "website"
- [ ] Verify `<meta property="og:site_name">` = "Marcus Gollahon"
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 2.2: Twitter Card Tags (Homepage)
- [ ] Verify `<meta name="twitter:card">` = "summary_large_image"
- [ ] Verify `<meta name="twitter:site">` = "@marcusgoll"
- [ ] Verify `<meta name="twitter:creator">` = "@marcusgoll"
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 2.3: Open Graph Tags (Blog Post)
- [ ] **View Page Source** for /blog/welcome-to-mdx
- [ ] Verify `<meta property="og:type">` = "article"
- [ ] Verify `<meta property="article:published_time">` exists
- [ ] Verify `<meta property="article:author">` exists
- [ ] Verify `<meta property="article:tag">` exists for each post tag
- [ ] Verify OG image uses post's featuredImage if available
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 2.4: External Validation Tools
- [ ] **Twitter Card Validator**: https://cards-dev.twitter.com/validator
  - Enter: http://localhost:3000/blog/welcome-to-mdx
  - Verify card preview displays correctly
  - **Result**: [Pass/Fail/Skip]
  - **Notes**: (Local URLs may not work - test after deployment)

- [ ] **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
  - Enter: http://localhost:3000
  - Verify OG tags detected
  - **Result**: [Pass/Fail/Skip]
  - **Notes**: (Local URLs may not work - test after deployment)

---

## US3 [P1]: Sitemap Generation

### Test 3.1: Sitemap File Exists
- [ ] Check file exists: `public/sitemap.xml`
- [ ] File generated during build (postbuild script ran)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 3.2: Sitemap Content Validation
- [ ] Open `public/sitemap.xml` in editor
- [ ] Verify XML header: `<?xml version="1.0" encoding="UTF-8"?>`
- [ ] Verify namespace: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
- [ ] Verify homepage entry exists
- [ ] Verify /blog entry exists
- [ ] Verify all blog posts listed (at least 5)
- [ ] Each entry has `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- [ ] URLs use https://marcusgoll.com domain
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 3.3: Sitemap Accessibility
- [ ] Start dev server: `npm run dev`
- [ ] Access: http://localhost:3000/sitemap.xml
- [ ] Verify XML renders in browser (not 404)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## US4 [P1]: Google Analytics 4 Tracking

### Test 4.1: GA4 Script Loading
- [ ] **View Page Source** for homepage
- [ ] Verify `<script src="https://www.googletagmanager.com/gtag/js?id=...">` exists
- [ ] Verify inline GA4 initialization script exists
- [ ] Verify script has `strategy="afterInteractive"` (loads after page interactive)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 4.2: GA4 Configuration
- [ ] Check environment variable exists: `NEXT_PUBLIC_GA_ID` in `.env.local`
- [ ] Verify GA measurement ID format: `G-XXXXXXXXXX`
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 4.3: GA4 Real-Time Tracking (Post-Deployment Only)
- [ ] Visit homepage with `?debug_mode=true` query parameter
- [ ] Open GA4 dashboard → Real-time view
- [ ] Verify pageview event appears within 60 seconds
- [ ] **Result**: [Pass/Fail/Skip - requires production GA ID]
- [ ] **Notes**:

---

## US5 [P2]: JSON-LD Structured Data

### Test 5.1: WebSite JSON-LD (Homepage)
- [ ] **View Page Source** for homepage
- [ ] Find `<script type="application/ld+json">` tag
- [ ] Verify JSON contains:
  - `"@context": "https://schema.org"`
  - `"@type": "WebSite"`
  - `"name": "Marcus Gollahon"`
  - `"url": "https://marcusgoll.com"`
  - `"author"` and `"publisher"` objects
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 5.2: Article JSON-LD (Blog Post)
- [ ] **View Page Source** for /blog/welcome-to-mdx
- [ ] Find `<script type="application/ld+json">` tag
- [ ] Verify JSON contains:
  - `"@type": "Article"` or `"BlogPosting"`
  - `"headline"` (post title)
  - `"datePublished"` (post date)
  - `"author"` object with `"@type": "Person"`
  - `"publisher"` object with `"@type": "Organization"`
  - `"image"` object (featuredImage or default)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 5.3: Google Rich Results Test
- [ ] Open: https://search.google.com/test/rich-results
- [ ] Enter URL: http://localhost:3000/blog/welcome-to-mdx
  (or paste HTML source code directly)
- [ ] Verify "Valid article" or "Valid BlogPosting" result
- [ ] Check for schema errors/warnings
- [ ] **Result**: [Pass/Fail/Skip]
- [ ] **Notes**:

---

## US6 [P2]: Newsletter Event Tracking

### Test 6.1: Analytics Functions Exist
- [ ] Open `lib/analytics.ts`
- [ ] Verify function exists: `trackNewsletterView()`
- [ ] Verify function exists: `trackNewsletterSubmit()`
- [ ] Verify function exists: `trackNewsletterSuccess()`
- [ ] Functions call `window.gtag` with correct event names
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 6.2: Event Integration (Post-Deployment Only)
- [ ] Newsletter component integrates tracking functions
- [ ] Submit newsletter form
- [ ] Open GA4 → DebugView
- [ ] Verify events appear:
  - `newsletter_view` (on form visibility)
  - `newsletter_submit` (on form submission)
  - `newsletter_success` (on successful submission)
- [ ] **Result**: [Pass/Fail/Skip - requires newsletter component]
- [ ] **Notes**:

---

## US7 [P3]: robots.txt AI Directives

### Test 7.1: robots.txt File Exists
- [ ] Check file exists: `public/robots.txt`
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 7.2: robots.txt Content Validation
- [ ] Open `public/robots.txt` in editor
- [ ] Verify default rule: `User-agent: * Allow: /`
- [ ] Verify sitemap URL: `Sitemap: https://marcusgoll.com/sitemap.xml`
- [ ] Verify AI crawler directives exist:
  - `User-agent: GPTBot Disallow: /`
  - `User-agent: ClaudeBot Disallow: /`
  - `User-agent: Google-Extended Disallow: /`
  - `User-agent: CCBot Disallow: /`
  - `User-agent: ChatGPT-User Allow: /` (allow search)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test 7.3: robots.txt Accessibility
- [ ] Start dev server: `npm run dev`
- [ ] Access: http://localhost:3000/robots.txt
- [ ] Verify plain text file renders (not 404)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## Browser Testing

Since there are no visual changes, browser testing focuses on JavaScript execution and meta tag rendering:

- [ ] **Chrome** (latest): Open DevTools → Console → No errors related to analytics/SEO
- [ ] **Firefox** (latest): Open Console → No errors
- [ ] **Safari** (latest): Open Console → No errors
- [ ] **Edge** (latest): Open Console → No errors

**Testing device**: Desktop (infrastructure testing doesn't require mobile)

---

## Build Validation

### Test: Production Build
- [ ] Run: `npm run build`
- [ ] Build completes successfully (exit code 0)
- [ ] Postbuild script runs: "tsx lib/generate-sitemap.ts"
- [ ] Console output shows: "✅ Sitemap generated successfully"
- [ ] No TypeScript errors
- [ ] No critical ESLint errors
- [ ] `public/sitemap.xml` exists after build
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## Performance Validation

### Test: Page Load Performance
- [ ] Open Chrome DevTools → Network tab
- [ ] Visit homepage (hard refresh: Ctrl+Shift+R)
- [ ] GA4 scripts load with `defer` or `async` attribute
- [ ] GA4 scripts do not block page render (no waterfall blocking)
- [ ] Meta tags add negligible overhead (<1KB)
- [ ] JSON-LD scripts are small (<2KB each)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## Security Validation

### Test: Content Security Policy
- [ ] GA4 scripts load from `googletagmanager.com` (trusted domain)
- [ ] No inline scripts without nonces (Next.js handles this)
- [ ] No mixed content warnings (HTTP resources on HTTPS page)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test: PII Compliance
- [ ] Review analytics events in `lib/analytics.ts`
- [ ] Verify no personally identifiable information (emails, names) sent to GA4
- [ ] Newsletter events track page context only, not user data
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## Migration Validation (Next.js Metadata API)

### Test: Native Metadata Implementation
- [ ] Open `app/page.tsx`
- [ ] Verify `export const metadata: Metadata` exists
- [ ] No `import` statements for `next-seo` library
- [ ] Open `app/blog/page.tsx`
- [ ] Verify native metadata export
- [ ] Open `app/blog/[slug]/page.tsx`
- [ ] Verify `generateMetadata()` function exists
- [ ] Metadata includes `alternates.canonical` for SEO
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

### Test: Removed next-seo Artifacts
- [ ] Verify `components/seo/DefaultSEO.tsx` does NOT exist (deleted)
- [ ] Verify `lib/seo-config.ts` does NOT exist (deleted)
- [ ] Run: `grep -r "next-seo" --include="*.tsx" --include="*.ts" app/`
- [ ] No matches found (all references removed)
- [ ] **Result**: [Pass/Fail]
- [ ] **Notes**:

---

## Issues Found

*Document any issues below:*

---

## Test Results Summary

**Routes tested**: ___ / 4
**User stories validated**: ___ / 8 (US1-US7 + Migration)
**Build validation**: [ ] Pass [ ] Fail
**Meta tags**: [ ] Pass [ ] Fail
**Sitemap**: [ ] Pass [ ] Fail
**robots.txt**: [ ] Pass [ ] Fail
**JSON-LD**: [ ] Pass [ ] Fail
**Migration**: [ ] Pass [ ] Fail
**Issues found**: ___

**Overall status**:
- [ ] ✅ Ready to ship (all tests pass)
- [ ] ⚠️ Minor issues (non-blocking)
- [ ] ❌ Blocking issues (requires fixes)

**Tester**: Claude Code
**Date**: 2025-10-24
**Duration**: ___ minutes

---

## Post-Deployment Checklist

*These tests require production deployment:*

- [ ] Submit sitemap to Google Search Console: https://marcusgoll.com/sitemap.xml
- [ ] Verify real-time GA4 tracking with production measurement ID
- [ ] Test social sharing on Twitter (verify card preview)
- [ ] Test social sharing on Facebook (verify OG preview)
- [ ] Run Google Rich Results Test on live URLs
- [ ] Monitor Search Console for indexing status (48-72 hours)
- [ ] Verify robots.txt accessible: https://marcusgoll.com/robots.txt

---

## Notes

- This is an infrastructure feature with no visual UI changes
- Testing focuses on technical implementation (meta tags, schemas, files)
- External validation tools may not work with localhost URLs
- GA4 real-time tracking requires production deployment
- Migration from next-seo to Next.js native Metadata API completed successfully
