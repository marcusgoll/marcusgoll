# Preview Testing Checklist: JSON-LD Structured Data

**Generated**: 2025-10-29 02:15:00 UTC
**Tester**: Marcus Gollahon
**Feature Type**: Backend/Data (Schema.org JSON-LD metadata)

---

## Overview

This feature adds invisible structured data (JSON-LD) to pages for search engines. **No UI changes** are visible to users. All testing focuses on:
1. Verifying JSON-LD is present in HTML source
2. Validating schemas with Google Rich Results Test
3. Validating schemas with Schema.org validator
4. Measuring JSON-LD size (performance)

---

## Pages to Validate

### Homepage (/)
- [ ] **URL**: http://localhost:3000/
- [ ] **Expected Schemas**: Website + Organization
- [ ] **Website Schema**: name, url, description, potentialAction (SearchAction)
- [ ] **Organization Schema**: name, url, logo, description, sameAs

### Blog Post (/blog/[slug])
- [ ] **URL**: http://localhost:3000/blog/welcome-to-mdx (or any post)
- [ ] **Expected Schemas**: BlogPosting + Organization
- [ ] **BlogPosting Schema**: headline, datePublished, dateModified, author, image, articleBody, **articleSection** (NEW)
- [ ] **Organization Schema**: name, url, logo, description, sameAs

### About Page (/about)
- [ ] **URL**: http://localhost:3000/about
- [ ] **Expected Schemas**: Person + Organization (with founder)
- [ ] **Person Schema**: name, jobTitle, description, url, image, sameAs (3+ social links), knowsAbout
- [ ] **Organization Schema**: name, url, logo, description, **founder** (Person reference), sameAs

---

## Test Scenario 1: Verify JSON-LD Presence in HTML Source

**For each page above:**

1. Open page in browser (http://localhost:3000/...)
2. View page source (Ctrl+U or Cmd+Option+U)
3. Search for `application/ld+json` (should find 2+ instances per page)
4. Copy each JSON-LD block to a text editor
5. Verify it's valid JSON (no syntax errors)

### Homepage Validation
- [ ] **Found Website schema**: Search for `"@type": "WebSite"`
- [ ] **Found Organization schema**: Search for `"@type": "Organization"`
- [ ] **Website has SearchAction**: Contains `"potentialAction"` with `"@type": "SearchAction"`
- [ ] **SearchAction has target**: Contains `"target"` with URL template like `https://marcusgoll.com/search?q={search_term_string}`
- [ ] **Organization has social links**: Contains `"sameAs"` array with 3+ URLs
- [ ] **Valid JSON**: Copy-paste into JSONLint.com → No errors

### Blog Post Validation
- [ ] **Found BlogPosting schema**: Search for `"@type": "BlogPosting"`
- [ ] **Found Organization schema**: Search for `"@type": "Organization"`
- [ ] **BlogPosting has articleSection**: Contains `"articleSection"` field
- [ ] **articleSection value correct**: One of: "Aviation", "Development", "Leadership", "Blog"
- [ ] **articleSection matches tags**: If post has aviation tags → "Aviation", dev tags → "Development", etc.
- [ ] **BlogPosting has all required fields**: headline, datePublished, dateModified, author, image, articleBody, wordCount, description, publisher, mainEntityOfPage
- [ ] **Valid JSON**: Copy-paste into JSONLint.com → No errors

**Test with multiple posts**:
- [ ] Aviation post (should have articleSection: "Aviation")
- [ ] Development post (should have articleSection: "Development")
- [ ] Post with no aviation/dev tags (should have articleSection: "Blog")

### About Page Validation
- [ ] **Found Person schema**: Search for `"@type": "Person"`
- [ ] **Found Organization schema**: Search for `"@type": "Organization"` (should have 2 total on page)
- [ ] **Person has required fields**: name, jobTitle, description, url, image, sameAs, knowsAbout
- [ ] **Person sameAs has 3+ links**: Twitter/X, LinkedIn, GitHub, etc.
- [ ] **Person knowsAbout includes**: "Aviation", "Software Development", or similar expertise areas
- [ ] **Organization has founder**: Contains `"founder"` field with `"@type": "Person"` reference
- [ ] **Founder data consistent**: Person schema and Organization founder have same name/url
- [ ] **Valid JSON**: Copy-paste into JSONLint.com → No errors

---

## Test Scenario 2: Google Rich Results Test

**Purpose**: Verify schemas pass Google's validation and are eligible for rich results

**For each page:**

1. Open https://search.google.com/test/rich-results
2. Enter page URL (use http://localhost:3000/... or deploy to staging first)
3. Click "Test URL"
4. Wait for results

### Homepage Test
- [ ] **Status**: ✅ Valid / ❌ Errors
- [ ] **Detected types**: Website, Organization
- [ ] **Errors**: 0
- [ ] **Warnings**: 0 (acceptable if minor)
- [ ] **Screenshot**: Capture results (save as `google-richresults-homepage.png`)

**If errors found**: Document below in Issues section

### Blog Post Test
- [ ] **Status**: ✅ Valid / ❌ Errors
- [ ] **Detected types**: BlogPosting, Organization
- [ ] **Errors**: 0
- [ ] **Warnings**: 0 (acceptable if minor)
- [ ] **articleSection visible**: Check if Google detected the articleSection field
- [ ] **Screenshot**: Capture results (save as `google-richresults-blogpost.png`)

**If errors found**: Document below in Issues section

### About Page Test
- [ ] **Status**: ✅ Valid / ❌ Errors
- [ ] **Detected types**: Person, Organization
- [ ] **Errors**: 0
- [ ] **Warnings**: 0 (acceptable if minor)
- [ ] **Screenshot**: Capture results (save as `google-richresults-about.png`)

**If errors found**: Document below in Issues section

---

## Test Scenario 3: Schema.org Validator

**Purpose**: Verify schemas conform to Schema.org specifications (independent of Google)

**For each page:**

1. View page source (Ctrl+U)
2. Copy JSON-LD block (entire `<script type="application/ld+json">` content)
3. Open https://validator.schema.org/
4. Paste JSON-LD into validator
5. Click "Validate"

### Homepage Validation
- [ ] **Website schema**: 0 errors, 0 warnings
- [ ] **Organization schema**: 0 errors, 0 warnings
- [ ] **SearchAction recognized**: Validator shows SearchAction as valid subtype

### Blog Post Validation
- [ ] **BlogPosting schema**: 0 errors, 0 warnings
- [ ] **Organization schema**: 0 errors, 0 warnings
- [ ] **articleSection recognized**: Validator accepts articleSection field

### About Page Validation
- [ ] **Person schema**: 0 errors, 0 warnings
- [ ] **Organization schema (with founder)**: 0 errors, 0 warnings
- [ ] **Founder reference valid**: Validator accepts Person reference in Organization.founder

---

## Test Scenario 4: Dual-Track Category Mapping

**Purpose**: Verify tag-to-category mapping works correctly (FR-006)

**Test cases:**

1. **Aviation post** (e.g., post with tags: ["aviation", "flight-training", "cfi"])
   - [ ] View source → articleSection should be "Aviation"

2. **Development post** (e.g., post with tags: ["development", "typescript", "nextjs"])
   - [ ] View source → articleSection should be "Development"

3. **Leadership post** (e.g., post with tags: ["leadership", "teaching", "mentoring"])
   - [ ] View source → articleSection should be "Leadership"

4. **Hybrid post** (e.g., post with tags: ["aviation", "development"])
   - [ ] View source → articleSection should be "Aviation" (priority: Aviation > Development > Leadership > Blog)

5. **Uncategorized post** (e.g., post with tags: ["random", "misc"])
   - [ ] View source → articleSection should be "Blog" (default fallback)

6. **No tags post** (e.g., post with tags: [])
   - [ ] View source → articleSection should be "Blog" (default fallback)

**Priority order verified**: ✅ Aviation > Development > Leadership > Blog

---

## Test Scenario 5: Data Source Verification

**Purpose**: Verify data is extracted correctly from MDX frontmatter and constitution.md

### Constitution Data Extraction
- [ ] Open .spec-flow/memory/constitution.md
- [ ] Note Marcus Gollahon's name, title, social links
- [ ] Verify Person schema matches:
  - [ ] name: "Marcus Gollahon"
  - [ ] jobTitle: (from constitution)
  - [ ] sameAs: Twitter/X, LinkedIn, GitHub URLs (from constitution)

### MDX Frontmatter Extraction
- [ ] Open any blog post MDX file (content/posts/*.mdx)
- [ ] Note: title, date, author, featuredImage, tags
- [ ] Verify BlogPosting schema matches:
  - [ ] headline: matches MDX title
  - [ ] datePublished: matches MDX date
  - [ ] image: matches MDX featuredImage (or default og-image)
  - [ ] articleSection: matches tag mapping (aviation/dev/leadership/blog)

---

## Test Scenario 6: Performance & Size Validation

**Purpose**: Verify NFR-001 (<10ms generation) and NFR-002 (<5KB size)

### JSON-LD Size Measurement

**For each page:**

1. View page source
2. Copy all JSON-LD blocks (all `<script type="application/ld+json">` tags)
3. Paste into https://mothereff.in/byte-counter
4. Record size

- [ ] **Homepage**: Website + Organization schemas = _____ bytes (target: <5KB = <5120 bytes)
- [ ] **Blog post**: BlogPosting + Organization schemas = _____ bytes (target: <5KB)
- [ ] **About page**: Person + Organization schemas = _____ bytes (target: <5KB)

**All pages under 5KB?**: ✅ Yes / ❌ No

### Build Time Impact

- [ ] Run `npm run build` and note total build time
- [ ] Compare to previous builds (should be <10 seconds increase)
- [ ] **Build time increase**: _____ seconds (target: negligible, <10s)

---

## Issues Found

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [Page URL or schema type]
- **Description**: [What's wrong]
- **Expected**: [What should happen per spec]
- **Actual**: [What actually happens]
- **Validation Tool**: [Google Rich Results Test | Schema.org | Manual]
- **Screenshot**: [Filename if captured]

---

## Browser Testing

**Note**: Since JSON-LD is in HTML source (not rendered), browser compatibility is not a concern. JSON-LD is consumed by search engine crawlers, not browsers.

- [ ] Verified JSON-LD present in at least one browser (Chrome, Firefox, or Safari)

---

## Accessibility

**N/A** - This feature adds metadata consumed by search engines. It does not affect user-facing UI, keyboard navigation, screen readers, or visual presentation.

---

## Performance Metrics

From build output and manual measurement:

- [ ] **Schema generation time**: <10ms per page (from build logs)
- [ ] **JSON-LD size**: <5KB per page (measured above)
- [ ] **Build time increase**: Negligible (<10 seconds)
- [ ] **No console errors**: Check browser DevTools console (should be clean)
- [ ] **No console warnings**: Check browser DevTools console

---

## Post-Deployment Validation (After Shipping)

**Note**: These checks can only be performed after deployment to production.

- [ ] **Google Search Console**: Submit sitemap, request re-indexing
- [ ] **Google Rich Results**: Re-test with production URLs (not localhost)
- [ ] **Schema.org Validator**: Re-test with production URLs
- [ ] **Wait 7-14 days**: Monitor Google Search Console for rich result appearances
- [ ] **Measure SERP CTR**: Compare Google Search Console CTR before/after (target: +15%)

---

## Test Results Summary

**Schemas validated**: ___ / 3 page types (homepage, blog post, about)
**Google Rich Results Test**: ___ / 3 passed (0 errors)
**Schema.org Validator**: ___ / 3 passed (0 errors/warnings)
**Dual-track category mapping**: ___ / 6 test cases passed
**Performance targets met**: ✅ Yes / ❌ No

**Issues found**: ___

**Overall status**:
- ✅ Ready to ship (all schemas valid, 0 errors, performance targets met)
- ⚠️ Minor issues (warnings only, ship with known issues)
- ❌ Blocking issues (errors found, must fix before shipping)

**Tester signature**: _______________
**Date**: _______________

---

## Additional Notes

[Any other observations, edge cases discovered, or recommendations]
