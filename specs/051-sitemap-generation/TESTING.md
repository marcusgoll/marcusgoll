# Manual Test Checklist: Sitemap Generation

## Test Environment Setup

Before testing, ensure:
- [ ] Next.js development server running (`npm run dev`)
- [ ] Production build completed (`npm run build`)
- [ ] Browser with developer tools open

## T005: Sitemap Validation Checklist

### XML Structure Validation

**Test**: Visit http://localhost:3000/sitemap.xml

- [ ] Response received (not 404)
- [ ] Content-Type header is `application/xml` or `text/xml`
- [ ] XML declaration present: `<?xml version="1.0" encoding="UTF-8"?>`
- [ ] Root element is `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
- [ ] Contains at least one `<url>` element
- [ ] All `<url>` elements have required children:
  - `<loc>` (URL)
  - `<lastmod>` (ISO 8601 date)
  - `<changefreq>` (one of: always, hourly, daily, weekly, monthly, yearly, never)
  - `<priority>` (0.0 to 1.0)

### URL Format Validation

- [ ] All URLs start with correct base URL (https://marcusgoll.com)
- [ ] Homepage URL is exactly base URL (no trailing slash issue)
- [ ] Blog list URL is `{baseUrl}/blog`
- [ ] Blog post URLs follow pattern: `{baseUrl}/blog/{slug}`
- [ ] No duplicate URLs
- [ ] No malformed URLs (check for double slashes, missing protocols)

### Priority Range Validation

- [ ] All priority values are between 0.0 and 1.0
- [ ] Homepage has priority 1.0
- [ ] Blog list has priority 0.9
- [ ] Blog posts have priority 0.8

### Change Frequency Validation

- [ ] Homepage has changeFrequency: 'daily'
- [ ] Blog list has changeFrequency: 'daily'
- [ ] Blog posts have changeFrequency: 'weekly'

### Last Modified Date Validation

- [ ] All lastModified values are valid ISO 8601 dates (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
- [ ] Blog post dates match frontmatter `date` field
- [ ] Static pages (homepage, blog list) have reasonable dates (current or recent)

### Draft Post Exclusion (Production Only)

**Test**: Build in production mode (`NODE_ENV=production npm run build`)

- [ ] Draft posts NOT included in sitemap
- [ ] Only published posts (draft: false or no draft field) included
- [ ] Count of post URLs matches count of published MDX files

## Online XML Validation

**Tool**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

- [ ] Sitemap validates against XML schema
- [ ] No schema errors reported
- [ ] All URLs are reachable (200 status)
- [ ] No warnings about invalid dates or priorities

## Google Search Console Validation (Post-Deployment)

**URL**: https://search.google.com/search-console

- [ ] Sitemap submitted: https://marcusgoll.com/sitemap.xml
- [ ] Status: "Success" (no errors)
- [ ] All URLs discovered within 24 hours
- [ ] No warnings or errors in coverage report

## Regression Testing

### New Post Addition Test

1. Create new test post in `content/posts/test-post.mdx`:
   ```yaml
   ---
   title: Test Post
   slug: test-post
   date: 2025-10-28
   draft: false
   tags: ["Test"]
   ---
   # Test
   This is a test post.
   ```
2. Rebuild: `npm run build`
3. Verify:
   - [ ] New post appears in sitemap
   - [ ] URL is `{baseUrl}/blog/test-post`
   - [ ] Date is 2025-10-28
   - [ ] Priority is 0.8
   - [ ] Change frequency is weekly

### Draft Post Filter Test

1. Create draft post in `content/posts/draft-post.mdx`:
   ```yaml
   ---
   title: Draft Post
   slug: draft-post
   date: 2025-10-28
   draft: true
   tags: ["Test"]
   ---
   # Draft
   This is a draft.
   ```
2. Build in production: `NODE_ENV=production npm run build`
3. Verify:
   - [ ] Draft post NOT in sitemap
   - [ ] No errors during build

### Environment Variable Test

1. Unset `NEXT_PUBLIC_SITE_URL` (or use default)
2. Rebuild
3. Verify:
   - [ ] Base URL defaults to https://marcusgoll.com
   - [ ] Warning logged (if env var missing)

## Expected Output Format

Valid sitemap should look like:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://marcusgoll.com</loc>
    <lastmod>2025-10-28T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://marcusgoll.com/blog</loc>
    <lastmod>2025-10-28T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://marcusgoll.com/blog/welcome-to-mdx</loc>
    <lastmod>2024-10-21T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- More posts... -->
</urlset>
```

## Test Results Log

| Test Case | Date | Result | Notes |
|-----------|------|--------|-------|
| XML Structure | | | |
| URL Format | | | |
| Priority Range | | | |
| Change Frequency | | | |
| Draft Exclusion | | | |
| Online Validation | | | |
| New Post Addition | | | |
| Environment Variable | | | |

## Known Issues / Limitations

- No image sitemap support (deferred to future enhancement)
- Static pages limited to homepage and /blog (expand when more pages added)
- Manual testing only (no automated test framework configured)
