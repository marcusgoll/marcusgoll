---
name: Analytics Insights Generator
description: Generating actionable insights from Google Analytics 4 and Search Console data for marcusgoll.com dual-track content strategy. Use when reviewing analytics, creating monthly reports, or identifying content opportunities.
---

# Analytics Insights Generator

## Overview

This skill helps you transform raw analytics data into actionable insights for both Aviation and Dev/Startup content tracks, identifying what's working, what's not, and where to focus next.

## When to Use This Skill

- Monthly performance reviews (first of each month)
- Identifying top-performing content
- Finding content gaps and opportunities
- Tracking content track performance (Aviation vs Dev)
- Making data-driven content decisions

## Monthly Analytics Review Workflow

### Step 1: Gather Data

**Google Analytics 4**:
- Sessions, Users, Page Views (overall + by content track)
- Top landing pages
- Traffic sources (organic, direct, social, referral)
- Engagement metrics (avg session duration, bounce rate)
- Conversions (newsletter signups, CFIPros clicks)

**Google Search Console**:
- Total impressions, clicks, CTR, average position
- Top queries (what keywords bring traffic?)
- Top pages (what content ranks best?)
- Impressions vs Clicks (opportunity keywords)

### Step 2: Analyze by Content Track

**Aviation Content Performance**:
```
Total Sessions: [X]
Top Posts:
  1. [Post title] - [X] sessions
  2. [Post title] - [X] sessions
  3. [Post title] - [X] sessions

Top Keywords:
  1. [Keyword] - [X] impressions, [X] clicks
  2. [Keyword] - [X] impressions, [X] clicks

Traffic Sources:
  - Organic: [X]%
  - Direct: [X]%
  - Social: [X]%
```

**Dev/Startup Content Performance**:
[Same metrics]

**Cross-Pollination Performance**:
[Same metrics - often highest engagement]

### Step 3: Identify Opportunities

**Quick Wins** (Page 2 rankings - positions 11-20):
- [ ] Post ranking #11-20 for [keyword] → Update + re-optimize
- [ ] High impressions, low clicks → Improve title/meta description

**Content Gaps** (High search volume, no ranking content):
- [ ] Keyword: [keyword] - [search volume] - Create new post

**Update Candidates** (Declining traffic):
- [ ] Post losing traffic: [title] → Refresh content

**Scale What Works** (Top performers):
- [ ] Post performing well: [title] → Create related content

## Key Metrics to Track

### Traffic Metrics

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Total Sessions | +10% MoM | [X] | ↑/↓ |
| Organic Traffic | >50% of total | [X]% | ↑/↓ |
| Avg Session Duration | >2 min | [X] min | ↑/↓ |
| Bounce Rate | <60% | [X]% | ↑/↓ |

### Engagement Metrics (by Track)

**Aviation Track**:
- Sessions: [X]
- Avg time on page: [X] min
- Pages per session: [X]
- Newsletter signups: [X]

**Dev/Startup Track**:
- Sessions: [X]
- Avg time on page: [X] min
- Pages per session: [X]
- Newsletter signups: [X]
- CFIPros.com clicks: [X]

### SEO Metrics

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Keywords in Top 10 | +5/month | [X] | ↑/↓ |
| Avg Position | Improving | [X] | ↑/↓ |
| Total Impressions | +15% MoM | [X] | ↑/↓ |
| Click-Through Rate | >3% | [X]% | ↑/↓ |

## Monthly Report Template

Use `templates/performance-report.md` for consistent monthly reports.

**Key sections**:
1. Executive Summary (key wins and concerns)
2. Traffic Overview (overall trends)
3. Content Track Performance (Aviation vs Dev vs Cross)
4. Top Performing Content (what's working)
5. Content Opportunities (what to create/update)
6. Action Items (prioritized next steps)

## Data Analysis Questions

### Traffic Analysis

**Where is traffic coming from?**
- Is organic search growing? (Target: >50% of traffic)
- Which social platforms drive most traffic?
- Is direct traffic increasing? (sign of brand recognition)

**What content attracts visitors?**
- Top 10 landing pages this month
- Which content track drives most traffic?
- Are cross-pollination posts performing best?

**Are visitors engaged?**
- Average session duration >2 minutes?
- Bounce rate <60%?
- Pages per session >2?

### Keyword Analysis

**What are people searching for?**
- Top 20 keywords bringing traffic
- New keywords appearing (emerging topics)
- Keywords with high impressions but low clicks (opportunity)

**Where can we rank better?**
- Keywords ranking #11-20 (page 2) → Quick wins
- Keywords with high search volume, low competition
- Related keywords not yet targeted

### Content Performance

**What content performs best?**
- Top 10 posts by traffic
- Top 5 posts by engagement (time on page)
- Which format performs best? (tutorial, story, cross-pollination)

**What content needs work?**
- Posts with high bounce rate (>70%)
- Posts with declining traffic
- Thin content (<1000 words) underperforming

### Conversion Analysis

**Are visitors taking action?**
- Newsletter signups (by source: organic, social, direct)
- External clicks (CFIPros.com, social profiles, GitHub)
- Comment engagement
- Social shares

**Which content converts best?**
- Posts with highest newsletter signup rate
- Posts driving most CFIPros.com clicks
- Content track with best conversion rate

## Insight Interpretation

### Traffic Trends

**Increasing Traffic** ✅:
- Double down on content type/topic
- Create more related content
- Update and expand successful posts

**Declining Traffic** ⚠️:
- Check for technical issues (broken links, slow load)
- Review competitor content (are they outranking you?)
- Update content with fresh information
- Improve SEO (title, meta, internal links)

**Flat Traffic** →:
- Need more content volume
- Expand to new keywords
- Improve content promotion (social, newsletter)

### Keyword Opportunities

**High Impressions, Low Clicks** (CTR <2%):
→ Improve title and meta description
→ Add featured snippet optimization
→ Check search intent match

**Position 11-20** (Page 2):
→ Update content (add 300-500 words)
→ Improve on-page SEO
→ Build internal links to post

**High Volume, Not Ranking**:
→ Create new comprehensive post
→ Target keyword in title, headers, body
→ Build content cluster around topic

## Action Item Prioritization

**Priority 1 - Quick Wins** (Do This Month):
- Update posts ranking #11-20 (2-3 posts)
- Improve titles/metas with low CTR (3-5 posts)
- Fix any technical issues (broken links, slow pages)

**Priority 2 - Content Creation** (This Quarter):
- Create posts for high-volume unranked keywords (1-2/month)
- Write more of best-performing content type
- Fill content gaps identified

**Priority 3 - Long-term** (This Year):
- Build content clusters around pillar topics
- Create lead magnets for email growth
- Develop video content for top posts

## Resources

### Metrics Definitions
- `resources/metrics-definitions.md` - What each metric means

### Success Benchmarks
- `resources/success-benchmarks.md` - Target metrics by content track

### Report Template
- `templates/performance-report.md` - Monthly report structure

### Scripts
- `scripts/generate-monthly-report.sh` - Auto-generate report from data

## Common Analytics Mistakes

❌ **Don't**:
- Look at data without context (compare to previous month/year)
- Focus only on total traffic (engagement matters more)
- Ignore content track breakdown (Aviation vs Dev performance)
- Make decisions on 1 week of data (use monthly trends)
- Track vanity metrics (focus on actionable insights)

✅ **Do**:
- Compare month-over-month and year-over-year
- Track engagement (time on page, bounce rate, conversions)
- Analyze by content track (which audience engages more?)
- Use monthly data for decisions
- Focus on metrics that inform content strategy

## Quick Monthly Checklist

**First of Each Month**:
- [ ] Export GA4 data (previous month)
- [ ] Export Search Console data (previous month)
- [ ] Calculate key metrics (traffic, engagement, SEO)
- [ ] Identify top 10 performing posts
- [ ] Find 3-5 quick win opportunities (page 2 rankings)
- [ ] Identify 2-3 content gaps to fill
- [ ] Generate monthly report
- [ ] Create action plan (prioritize updates and new content)
- [ ] Share insights (Twitter thread or newsletter)

**Time required**: 30-45 minutes (vs 2+ hours manual review)

---

**Remember**: Analytics are a compass, not a destination. Use data to inform content decisions, but don't let metrics paralyze you. Systematic review + action on insights = continuous improvement.
