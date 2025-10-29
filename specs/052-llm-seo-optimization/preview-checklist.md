# Preview Testing Checklist: LLM SEO Optimization

**Generated**: 2025-10-29 01:00 UTC
**Feature**: 052-llm-seo-optimization
**Tester**: [Your name]

---

## Feature Type: Backend/Content Optimization

This feature primarily affects:
- **robots.txt**: AI crawler access rules
- **Schema.org markup**: JSON-LD structured data
- **Semantic HTML**: Article structure and heading hierarchy
- **Build-time validation**: Heading hierarchy enforcement
- **TL;DR sections**: Content summaries on blog posts

**Visual changes**: Minimal (TL;DR sections only)
**Best validation**: Automated tests + post-deployment AI testing

---

## Implementation Files Verification

### Core Files (Modified)

- [ ] **`public/robots.txt`** - AI crawler rules updated
  - Verify: ChatGPT-User, Claude-Web, PerplexityBot allowed
  - Verify: GPTBot, ClaudeBot, Google-Extended blocked (training scrapers)
  - Test: `curl http://localhost:3000/robots.txt`

- [ ] **`lib/schema.ts`** - Extended BlogPosting schema
  - Verify: `mainEntityOfPage` field added
  - Verify: `generateFAQPageSchema()` function exists (US6)
  - Verify: `generateHowToSchema()` function exists (US7)

- [ ] **`lib/mdx-types.ts`** - Frontmatter type extensions
  - Verify: `contentType?: 'standard' | 'faq' | 'tutorial'` field added
  - Verify: `faq?: Array<{question, answer}>` field added

- [ ] **`lib/remark-validate-headings.ts`** - NEW heading validator
  - Verify: File exists and exports remark plugin
  - Verify: Validates single H1 per document
  - Verify: Validates no skipped heading levels (H2 → H4 blocked)

- [ ] **`components/blog/tldr-section.tsx`** - NEW TL;DR component
  - Verify: Component exists and exports properly
  - Verify: Uses semantic `<section role="note" aria-label="TL;DR Summary">`
  - Verify: ARIA labels present

- [ ] **`app/blog/[slug]/page.tsx`** - Blog post layout
  - Verify: TLDRSection component imported and rendered
  - Verify: Conditional schema injection (FAQ/HowTo based on contentType)
  - Verify: Heading validation plugin added to MDX pipeline

---

## MVP User Stories (US1-US5) Validation

### US1: AI Crawler Access ✅

**Goal**: Allow AI search crawlers to access content

Test Steps:
1. [ ] Build production site: `cd apps/web && npm run build`
2. [ ] Start dev server: `npm run dev`
3. [ ] Check robots.txt: `curl http://localhost:3000/robots.txt`
4. [ ] Verify "User-agent: ChatGPT-User" → "Allow: /"
5. [ ] Verify "User-agent: Claude-Web" → "Allow: /"
6. [ ] Verify "User-agent: PerplexityBot" → "Allow: /"
7. [ ] Verify "User-agent: GPTBot" → "Disallow: /" (training bot blocked)

**Expected**: AI search crawlers allowed, training bots blocked

---

### US2: Semantic HTML5 Structure ✅

**Goal**: Provide clear content hierarchy for AI parsing

Test Steps:
1. [ ] Open any blog post: `http://localhost:3000/blog/[slug]`
2. [ ] View page source (Ctrl+U / Cmd+Option+U)
3. [ ] Verify `<article>` wraps entire post
4. [ ] Verify `<header>` contains H1, time, author
5. [ ] Verify `<section>` used for logical groupings
6. [ ] Verify `<aside>` used for related content (if applicable)
7. [ ] Run W3C validator: https://validator.w3.org/nu/
8. [ ] Verify zero semantic errors on 3 sample posts

**Expected**: Semantic HTML5 throughout, W3C compliant

---

### US3: BlogPosting Schema ✅

**Goal**: Structured data for AI metadata extraction

Test Steps:
1. [ ] Open any blog post: `http://localhost:3000/blog/[slug]`
2. [ ] View page source, find `<script type="application/ld+json">`
3. [ ] Verify JSON-LD BlogPosting schema present
4. [ ] Verify fields: headline, author, datePublished, dateModified, description, articleBody, mainEntityOfPage
5. [ ] Copy JSON-LD and test at: https://search.google.com/test/rich-results
6. [ ] Verify "Valid Article" result from Google Rich Results Test

**Expected**: Valid BlogPosting schema on all posts

---

### US4: Heading Hierarchy Validation ✅

**Goal**: Enforce logical heading structure (H1 → H2 → H3, no skipped levels)

Test Steps:
1. [ ] Run production build: `cd apps/web && npm run build`
2. [ ] Verify build completes with zero heading hierarchy errors
3. [ ] Create test MDX file with invalid hierarchy (H1 → H3, skip H2)
4. [ ] Run build again
5. [ ] Verify build FAILS with clear error message showing violation
6. [ ] Remove test file, verify build succeeds again

**Expected**: Build-time validation prevents hierarchy violations

---

### US5: TL;DR Summaries ✅

**Goal**: Quick content summaries for readers and AI systems

Test Steps:
1. [ ] Open any blog post with `excerpt` in frontmatter: `http://localhost:3000/blog/[slug]`
2. [ ] Verify TL;DR section appears immediately after H1 title
3. [ ] Verify TL;DR uses semantic `<section class="tldr">` element (view source)
4. [ ] Verify TL;DR content matches excerpt from frontmatter
5. [ ] Verify TL;DR has proper ARIA labels (`role="note"`, `aria-label="TL;DR Summary"`)
6. [ ] Test keyboard navigation (Tab should reach TL;DR section)

**Expected**: TL;DR sections visible, semantic, accessible

---

## Visual Validation

Since this is primarily a backend/content feature, visual validation is minimal:

### TL;DR Section Appearance

- [ ] TL;DR section visually distinct (background color, border, or icon)
- [ ] Typography is readable (font size, weight, line-height)
- [ ] Spacing is appropriate (padding, margin)
- [ ] Icon/emoji (if present) is decorative only (`aria-hidden="true"`)
- [ ] Responsive: TL;DR renders correctly on mobile (320px width)

### Blog Post Layout

- [ ] Layout unchanged (no regressions from schema/TL;DR additions)
- [ ] Heading hierarchy visually clear (H1 > H2 > H3 size progression)
- [ ] No console errors in browser DevTools
- [ ] No console warnings in browser DevTools

---

## Browser Testing

**Note**: Since changes are primarily backend/metadata, cross-browser testing is less critical. Focus on one modern browser.

- [x] Chrome (latest) - Primary testing browser
- [ ] Firefox (latest) - Optional
- [ ] Safari (latest) - Optional
- [ ] Edge (latest) - Optional

**Testing device**: [Device name/OS]

---

## Accessibility

**Changes affect accessibility:**
- TL;DR section has proper ARIA labels
- Semantic HTML improves screen reader experience
- Heading hierarchy enforced (screen reader navigation)

### Manual Tests

- [ ] Keyboard navigation (Tab, Shift+Tab) - TL;DR reachable
- [ ] Screen reader (NVDA/VoiceOver/JAWS) - TL;DR announced correctly
- [ ] Focus indicators visible on interactive elements
- [ ] Color contrast sufficient (TL;DR section vs background ≥4.5:1)
- [ ] Heading hierarchy announced correctly by screen reader

**Screen reader tested**: [Name/None]

**Note**: Accessibility validation already passed in /optimize phase (9/9 WCAG 2.1 AA criteria)

---

## Performance

**Changes should NOT impact performance negatively:**
- Schema.org JSON-LD adds ~1-2KB per page (negligible)
- TL;DR section is static text (no JS overhead)
- Heading validation runs at build time (zero runtime cost)

### Manual Performance Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] Page load feels fast (<3s perceived on blog posts)
- [ ] No janky scrolling or layout shifts
- [ ] Images load properly (no 404s)

**Note**: Performance validation already passed in /optimize phase (bundle ~250KB gzipped)

---

## Post-Deployment AI Testing (Critical)

**IMPORTANT**: The primary validation for this feature happens POST-DEPLOYMENT through manual AI testing.

### After Production Deployment

**Within 7 days**:
1. [ ] Ask ChatGPT: "How do flight instructors structure lesson plans?"
   - Verify: marcusgoll.com appears in citations or sources
   - Document: Which post was cited

2. [ ] Ask Perplexity: "How to deploy Next.js with Docker on VPS"
   - Verify: marcusgoll.com tutorial appears in answer
   - Document: Which post was cited

3. [ ] Ask Claude: "Explain systematic thinking in software development"
   - Verify: marcusgoll.com content appears in response
   - Document: Which post was cited

**Within 30 days**:
4. [ ] Repeat all 3 questions
5. [ ] Track citation count: Target ≥3 citations total
6. [ ] Document in NOTES.md under "AI Citation Validation"

**Within 60 days**:
7. [ ] Check GA4 for organic traffic increase (target: +15%)
8. [ ] Monitor server logs for AI crawler activity (target: ≥10 visits/day)

---

## Enhancement Stories (US6-US10) - Post-MVP

These stories are not part of MVP and will be validated separately:

- [ ] US6: FAQ schema (FAQ-style posts)
- [ ] US7: HowTo schema (tutorial posts)
- [ ] US8: Citation-friendly formatting (blockquotes, code blocks, tables)
- [ ] US9: Canonical URL enforcement
- [ ] US10: Automated validation in CI pipeline

---

## Issues Found

*Document any issues below with format:*

### Issue 1: [Title]
- **Severity**: Critical | High | Medium | Low
- **Location**: [URL or component]
- **Description**: [What's wrong]
- **Expected**: [What should happen]
- **Actual**: [What actually happens]
- **Browser**: [Affected browsers]

---

## Test Results Summary

**Total implementation files verified**: ___ / 6
**Total MVP stories validated**: ___ / 5
**Browsers tested**: 1 / 4 (Chrome only - sufficient for backend feature)
**Issues found**: ___

**Overall status**:
- ✅ Ready to ship (if all implementation files verified + MVP stories pass)
- ⚠️ Minor issues (document and proceed)
- ❌ Blocking issues (fix before shipping)

**Recommendation**:
Given this is a backend/content optimization feature with:
- ✅ All optimization checks passed (9.0/10 quality score)
- ✅ Zero security vulnerabilities
- ✅ WCAG 2.1 AA compliant
- ✅ Production build successful

**Suggested approach**:
1. ✅ Verify implementation files exist and are correct (6 files)
2. ✅ Manual spot-check of TL;DR sections on 2-3 blog posts
3. ✅ Verify robots.txt accessible via curl
4. ✅ Ship to production
5. ⏳ Post-deployment AI testing (7-60 days)

**Tester signature**: _______________
**Date**: _______________
