---
name: SEO Optimization Workflow
description: Running systematic SEO audits, keyword research, and on-page optimization for marcusgoll.com dual-track content. Use when optimizing blog posts, running site audits, or improving search rankings.
---

# SEO Optimization Workflow

## Overview

This skill provides a systematic approach to SEO for margusgoll.com, ensuring both Aviation and Dev/Startup content tracks rank well while maintaining technical excellence and user experience.

## When to Use This Skill

- Before publishing new blog posts (on-page SEO)
- Monthly technical SEO audits
- Keyword research for content planning
- Troubleshooting ranking issues
- Optimizing existing content

## Core SEO Principles

### Dual-Track SEO Strategy

**Aviation Track Keywords**:
- Primary: "flight instructor", "CFI training", "pilot license guide"
- Long-tail: "how to become flight instructor", "CFI lesson plan templates"
- Local: "flight schools near me", "find CFI in [city]"

**Dev/Startup Track Keywords**:
- Primary: "build startup full time job", "systematic development"
- Long-tail: "how to build saas while working", "developer productivity"
- Branded: "building in public", "#BuildInPublic"

## Pre-Publish SEO Checklist

Run before publishing ANY blog post:

### 1. Keyword Optimization

**Title Tag**:
- [ ] 50-60 characters
- [ ] Primary keyword in first 5 words
- [ ] Compelling (clickable)
- [ ] Format: `[Keyword]: [Benefit] - Marcus Gollahon`

**Meta Description**:
- [ ] 150-160 characters
- [ ] Includes primary keyword
- [ ] Clear value proposition
- [ ] Call to action

**URL Slug**:
- [ ] Lowercase, hyphens only
- [ ] Includes primary keyword
- [ ] Under 60 characters
- [ ] No stop words (the, a, an, etc.)

### 2. Content Structure

**Headers**:
- [ ] One H1 (title) only
- [ ] H2s use keyword variations
- [ ] Logical hierarchy (H2 → H3 → H4)
- [ ] Headers describe section content

**Internal Links**:
- [ ] 3-5 links to related posts
- [ ] Natural anchor text (not "click here")
- [ ] Links to both same-track and cross-pollination posts
- [ ] No broken links

**External Links**:
- [ ] Authoritative sources cited
- [ ] Links open in new tab (if appropriate)
- [ ] All links checked (no 404s)

### 3. Images

**Optimization**:
- [ ] Alt text on ALL images (descriptive, keyword-rich)
- [ ] File names descriptive (`crosswind-landing-technique.jpg` not `IMG_1234.jpg`)
- [ ] Compressed (<200KB each)
- [ ] WebP format with JPG fallback
- [ ] Lazy loading below fold

**Featured Image**:
- [ ] 1200x630px (Open Graph standard)
- [ ] Includes post title or visual
- [ ] On-brand (Navy + Emerald colors)

### 4. Schema Markup

**BlogPosting Schema** (required):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title]",
  "description": "[Meta Description]",
  "image": "[Featured Image URL]",
  "author": {
    "@type": "Person",
    "name": "Marcus Gollahon",
    "url": "https://marcusgoll.com/about"
  },
  "publisher": {
    "@type": "Person",
    "name": "Marcus Gollahon"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "[Post URL]"
  }
}
```

Validate at: https://search.google.com/test/rich-results

## Monthly Technical SEO Audit

Run on the **first of each month**:

### Site Performance

```bash
# Run Lighthouse audit
npm run lighthouse-audit
# or
lighthouse https://marcusgoll.com --output=html --view
```

**Targets**:
- [ ] Performance score: >90
- [ ] SEO score: 100
- [ ] Accessibility score: >90
- [ ] Best Practices score: >90

**Core Web Vitals**:
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1

### Crawlability

- [ ] XML sitemap updated and submitted (Search Console)
- [ ] Robots.txt allows all important pages
- [ ] No broken internal links (use Screaming Frog or similar)
- [ ] Canonical URLs set correctly
- [ ] No duplicate content issues

### Indexability

Check Google Search Console:
- [ ] All important pages indexed
- [ ] No "Excluded" pages that should be indexed
- [ ] Coverage report has no errors
- [ ] Mobile usability: no issues

### Technical Issues

- [ ] HTTPS enabled and enforced
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Structured data validates (no errors)

## Keyword Research Process

### Step 1: Identify Seed Keywords

**Aviation Track**:
- flight training
- CFI resources
- pilot career
- checkride prep

**Dev/Startup Track**:
- building in public
- side hustle developer
- systematic development
- React tutorials

### Step 2: Expand Keywords

**Tools**:
- Google Search Console (what already ranks?)
- Google Keyword Planner (search volume)
- AnswerThePublic (question keywords)
- Competitor analysis (what do similar sites rank for?)

**Target Mix**:
- 40% High-volume (1K+ searches/month) - harder to rank
- 40% Medium-volume (500-1K) - sweet spot
- 20% Long-tail (<500) - easy wins, high intent

### Step 3: Analyze Search Intent

For each keyword, determine intent:
- **Informational**: "how to become CFI" → Tutorial/guide
- **Navigational**: "CFIPros.com" → Home page
- **Commercial**: "best flight schools" → Comparison/review
- **Transactional**: "hire flight instructor" → Service page

Match content type to intent.

### Step 4: Prioritize Keywords

**Scoring matrix**:
```
Priority Score = (Search Volume × Relevance) / (Competition + 1)

Relevance: 1-10 (how relevant to Marcus's expertise)
Competition: 1-10 (keyword difficulty)
```

Target keywords with highest priority scores.

## On-Page SEO Optimization

### Content Quality Signals

- [ ] Word count: 1500-2000 words (long-form ranks better)
- [ ] Original content (not plagiarized)
- [ ] Comprehensive (covers topic thoroughly)
- [ ] Scannable (headers, bullets, short paragraphs)
- [ ] Actionable (readers can apply insights)
- [ ] Personal experience (E-E-A-T: Experience, Expertise, Authoritativeness, Trust)

### Keyword Usage

**Primary keyword appears**:
- [ ] In title (H1)
- [ ] In first paragraph (first 100 words)
- [ ] In at least one H2
- [ ] In URL slug
- [ ] In meta description
- [ ] In image alt text
- [ ] 3-5 times naturally in body (don't stuff)

**LSI Keywords** (related terms):
- [ ] Use variations naturally
- [ ] Include synonyms
- [ ] Related concepts covered

### Readability

- [ ] Flesch Reading Ease: 60-70 (8th-9th grade level)
- [ ] Average sentence length: <20 words
- [ ] Paragraphs: 2-4 sentences
- [ ] Active voice preferred
- [ ] Transitions between sections

## Content Update Strategy

### Identify Update Candidates

**Monthly review in Google Search Console**:
- Posts ranking #11-#20 (page 2) → Update to reach page 1
- Posts losing traffic → Refresh content
- High-impression, low-CTR posts → Improve title/meta

### Update Process

1. **Add fresh content** (200-500 words)
2. **Update statistics** and examples (make current)
3. **Improve title/meta** if CTR is low
4. **Add internal links** to newer posts
5. **Refresh images** if outdated
6. **Update dateModified** in schema
7. **Republish** and resubmit to Search Console

**Target**: Update 2-3 posts/month for best ROI

## Resources and Tools

### SEO Tools (Free)
- Google Search Console (must-have)
- Google Keyword Planner
- Lighthouse (performance)
- PageSpeed Insights
- Mobile-Friendly Test
- Rich Results Test

### Keyword Research
- `resources/keyword-research-aviation.md`
- `resources/keyword-research-dev.md`

### Schema Templates
- `resources/schema-templates.md`

### Scripts
- `scripts/lighthouse-audit.sh` - Run performance tests
- `scripts/validate-schema.sh` - Check schema markup
- `scripts/generate-sitemap.sh` - Create XML sitemap

## Common SEO Mistakes to Avoid

❌ **Don't**:
- Keyword stuff (looks spammy, hurts rankings)
- Use duplicate meta descriptions across posts
- Ignore mobile optimization (60%+ traffic is mobile)
- Publish thin content (<800 words)
- Over-optimize (write for humans first, search engines second)
- Ignore internal linking

✅ **Do**:
- Write for your audience first
- Use keywords naturally
- Update old content regularly
- Build internal link structure
- Monitor Search Console weekly
- Track keyword rankings monthly

---

**Remember**: SEO is a marathon, not a sprint. Consistent, quality content + technical excellence = long-term rankings. Focus on serving your audience (pilots and developers) and rankings will follow.
