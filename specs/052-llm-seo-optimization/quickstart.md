# Quickstart: 052-llm-seo-optimization

## Scenario 1: Initial Setup

```bash
# Navigate to project root
cd D:/Coding/marcusgoll

# Install dependencies (if needed)
npm install

# Verify existing MDX posts
ls content/posts/*.mdx

# Check current robots.txt
cat public/robots.txt

# Build and check for heading validation errors
npm run build

# Start dev server
npm run dev
```

**Expected**:
- Build succeeds (or shows heading validation errors if hierarchy violations)
- Dev server runs on http://localhost:3000
- Blog posts visible at /blog

---

## Scenario 2: Update robots.txt for AI Crawlers

```bash
# Edit robots.txt
nano public/robots.txt

# Change AI crawler rules (example):
# FROM:
#   User-agent: ChatGPT-User
#   Disallow: /
#
# TO:
#   User-agent: ChatGPT-User
#   Allow: /

# Verify changes
cat public/robots.txt
```

**Expected**:
- ChatGPT-User: Allow: /
- PerplexityBot: Allow: / (or user decision)
- Claude-Web: Allow: / (or user decision)
- GPTBot: Disallow: / (training bot, keep blocked unless user prefers otherwise)

---

## Scenario 3: Add TL;DR to Blog Posts

```bash
# No manual steps needed - TL;DR auto-generated from excerpt!

# Verify excerpt exists in all posts
grep "excerpt:" content/posts/*.mdx

# If missing, add excerpt to frontmatter:
# ---
# title: "Post Title"
# excerpt: "2-4 sentence summary of the post that will appear as TL;DR."
# ...
# ---

# Build to generate TL;DR sections
npm run build

# View post in browser
npm run dev
# Navigate to: http://localhost:3000/blog/systematic-thinking-for-developers
```

**Expected**:
- TL;DR section appears after H1 title
- Styled as callout box
- Contains frontmatter excerpt text

---

## Scenario 4: Validate Schema.org Markup

**Step 1: Local Testing**
```bash
# Build site
npm run build

# Start production server
npm run start

# Open in browser: http://localhost:3000/blog/systematic-thinking-for-developers
# View page source (Ctrl+U)
# Search for: "application/ld+json"
# Verify: BlogPosting schema present
```

**Step 2: Google Rich Results Test**
1. Deploy to production OR use ngrok for local testing:
   ```bash
   # Install ngrok (if not already)
   # Download from: https://ngrok.com/download

   # Run ngrok tunnel
   ngrok http 3000

   # Copy HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

2. Test with Google Rich Results:
   - Visit: https://search.google.com/test/rich-results
   - Enter URL: https://marcusgoll.com/blog/systematic-thinking-for-developers
   - Click "Test URL"
   - Verify: "BlogPosting" detected, no errors

**Step 3: W3C HTML Validator**
1. Visit: https://validator.w3.org/
2. Enter URL: https://marcusgoll.com/blog/systematic-thinking-for-developers
3. Click "Check"
4. Verify: Zero errors (warnings acceptable)

---

## Scenario 5: Lighthouse Audit

```bash
# Install Lighthouse CLI (if not already)
npm install -g lighthouse

# Run audit on local dev server
lighthouse http://localhost:3000/blog/systematic-thinking-for-developers \
  --view \
  --output html \
  --output-path ./lighthouse-report.html

# Check scores:
# - SEO: ≥90
# - Accessibility: ≥95
# - Performance: ≥85
# - Best Practices: ≥90

# Check specific audits:
# - "Document has a meta description" ✅
# - "Heading elements are in a sequentially-descending order" ✅
# - "Structured data is valid" ✅
```

**Expected**:
- All scores meet targets
- No heading hierarchy warnings
- Schema.org structured data detected

---

## Scenario 6: Manual AI Citation Testing (Quarterly)

**ChatGPT Testing**:
1. Open ChatGPT: https://chat.openai.com/
2. Ask: "How do flight instructors apply systematic thinking to software development?"
3. Check response:
   - Does marcusgoll.com appear in citations?
   - Is content accurately summarized?
   - Is attribution correct?
4. Record results in NOTES.md

**Perplexity Testing**:
1. Open Perplexity: https://www.perplexity.ai/
2. Ask: "What are the parallels between aviation checklists and code review?"
3. Check response:
   - Does marcusgoll.com appear in sources?
   - Is content used in answer?
   - Is link clickable?
4. Record results in NOTES.md

**Claude Testing** (if Claude has web search enabled):
1. Open Claude: https://claude.ai/
2. Ask: "How do pilots structure lesson plans and how does this apply to teaching programming?"
3. Check response:
   - Does marcusgoll.com appear in research sources?
   - Is content cited correctly?
4. Record results in NOTES.md

**Measurement**:
- Target: ≥3 citations across all 3 AIs within 30 days
- Record: Date tested, questions asked, citations found
- Adjust: Update content strategy if citation rate low

---

## Scenario 7: Heading Hierarchy Validation

```bash
# Build site (heading validation runs automatically)
npm run build

# If errors occur:
# ❌ Heading hierarchy validation failed
# File: content/posts/example-post.mdx
# Error: Heading level 3 found after level 1 (skipped level 2)
# Fix: Add H2 heading before H3, or adjust hierarchy

# Fix heading hierarchy in affected post
nano content/posts/example-post.mdx

# Change:
# # Title (H1)
# ### Subsection (H3) ❌ SKIPPED H2
#
# To:
# # Title (H1)
# ## Section (H2)
# ### Subsection (H3) ✅ CORRECT

# Re-build
npm run build

# Verify: Build succeeds without errors
```

**Expected**:
- Build succeeds if all headings follow H1 → H2 → H3 order
- Clear error messages if violations found
- Fast validation (<5 seconds for 50 posts)

---

## Scenario 8: Add FAQ Schema to Post

```mdx
---
slug: "flight-training-faq"
title: "Flight Training Frequently Asked Questions"
excerpt: "Common questions about becoming a pilot, answered by a CFI."
date: "2024-02-01T08:00:00Z"
author: "Marcus Gollahon"
tags:
  - aviation
  - education
contentType: "faq"
faq:
  - question: "How long does it take to get a private pilot license?"
    answer: "On average, 6-12 months with consistent training (2-3 flights per week)."
  - question: "What is the minimum age to become a pilot?"
    answer: "You can solo at 16 and get your private pilot license at 17."
  - question: "How much does flight training cost?"
    answer: "Expect $10,000-$15,000 for a private pilot license in the US."
---

## Becoming a Pilot: Your Questions Answered

[Content continues...]
```

**Build**:
```bash
npm run build

# Verify FAQPage schema generated
# View page source, search for: "@type": "FAQPage"
```

**Validate**:
- Google Rich Results Test shows FAQPage schema
- Questions/Answers extracted correctly

---

## Scenario 9: Deploy and Monitor

```bash
# Commit changes
git add .
git commit -m "feat(seo): optimize for LLM search citations (US1-US5)"

# Push to main (triggers GitHub Actions deploy)
git push origin main

# Monitor deployment
gh run list --limit 1
gh run view --log

# After deployment succeeds:
# 1. Visit https://marcusgoll.com/robots.txt
#    Verify: AI crawler rules updated
#
# 2. Visit https://marcusgoll.com/blog/systematic-thinking-for-developers
#    Verify: TL;DR section visible, schema in source
#
# 3. Run Google Rich Results Test (production URL)
#    Verify: BlogPosting schema valid
#
# 4. Monitor GA4 for 30 days
#    Track: Organic traffic, AI bot visits (server logs)
#
# 5. Quarterly AI citation testing
#    Test: ChatGPT, Perplexity, Claude
```

**Expected**:
- Deployment succeeds (GitHub Actions green)
- robots.txt updated correctly
- TL;DR visible on all posts
- Schema.org validation passes
- AI citations appear within 30 days

---

## Troubleshooting

### Build fails with heading validation error
**Solution**: Review error message, fix heading hierarchy in affected MDX file

### TL;DR not appearing
**Check**: Does post have `excerpt` in frontmatter?
**Fix**: Add excerpt field to frontmatter

### Schema not detected by Google
**Check**: View page source, verify JSON-LD script tag present
**Debug**: Copy JSON-LD content to https://validator.schema.org/
**Fix**: Update schema generator if validation errors found

### AI bots not crawling site
**Check**: Server logs for AI bot user agents (Caddy logs)
```bash
ssh hetzner
grep -E "(ChatGPT-User|PerplexityBot|Claude-Web)" /var/log/caddy/access.log
```
**Fix**: Verify robots.txt allows AI bots, submit sitemap to search engines

### No AI citations after 30 days
**Investigate**: Content quality, topic relevance, competition
**Adjust**: Improve content, add more structured data, increase publishing frequency
**Re-test**: Manual AI queries with different phrasings
