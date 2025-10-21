# Skills & Framework Integration Guide - Marcus Gollahon

**Version**: 1.0.0
**Date Created**: 2025-10-21
**Purpose**: Integrate brand frameworks with existing Claude Code skills for systematic content creation

---

## Overview

This document shows how to integrate brand frameworks (Golden Circle, Brand Archetype, Brand Pyramid, etc.) with your existing Claude Code skills:

- `brand-content` - Creating blog posts and content
- `content-repurpose` - Converting content for multiple platforms
- `analytics-insights` - Analyzing GA4 and Search Console data
- `seo-optimize` - SEO audits and optimization

**Result**: A systematic, framework-driven workflow for creating, optimizing, and measuring brand-aligned content.

---

## Skill 1: brand-content (Content Creation)

### Current Workflow (Before Frameworks)

1. Choose topic
2. Write blog post
3. Publish

### Enhanced Workflow (With Frameworks)

**Phase 1: Ideation (Use Frameworks to Choose Topic)**

```
Invoke: brand-content (ideation mode)

Prompt:
"I need blog post ideas for [aviation/dev/cross-pollination] track.

Apply these framework checks:
- Golden Circle: Can I lead with a clear 'Why' (purpose/belief)?
- Blue Ocean: Is this differentiated from competitors?
- Brand Key: Does this serve my target audience's pain point?
- Content Track Balance: I've published [X aviation, Y dev, Z cross] posts this month (target 40/40/20)

Generate 5 blog post ideas that pass all framework checks, prioritizing cross-pollination content (Blue Ocean sweet spot)."
```

**brand-content Output**:
- 5 blog post ideas with:
  - Target audience
  - Pain point addressed
  - Differentiation angle (why it's Blue Ocean)
  - Golden Circle "Why" statement
  - Content track assignment

**Phase 2: Drafting (Use Brand Archetype for Tone)**

```
Invoke: brand-content (drafting mode)

Prompt:
"Write a blog post: '[Topic]'

Framework requirements:
- Brand Archetype: 60% Sage (instructive, clear, structured) + 40% Explorer (authentic, personal story)
- Brand Pyramid: Ladder up to 'Systematic Mastery' essence
- Structure:
  1. Hook (Golden Circle Why + Explorer story)
  2. Problem statement (Brand Key pain point)
  3. Solution (Sage systematic framework)
  4. Personal example (Explorer authenticity)
  5. Takeaway (Functional + Emotional benefits, CTA)

Target length: 2,000 words
Include: 5-step framework or checklist (systematic strength)
Aviation → dev cross-pollination angle (Blue Ocean)"
```

**brand-content Output**:
- Draft blog post adhering to:
  - Sage Explorer archetype (60/40 tone)
  - Brand Pyramid structure
  - Golden Circle opening
  - Clear systematic framework

**Phase 3: Editing (Use Brand Consistency Checklist)**

```
Invoke: brand-content (editing mode)

Prompt:
"Review this draft blog post against Brand Consistency Checklist:

[Paste draft]

Check:
- [ ] Golden Circle (leads with Why)
- [ ] Brand Archetype (60% Sage + 40% Explorer tone)
- [ ] Brand Pyramid (ladders to 'Systematic Mastery')
- [ ] Brand Key (serves audience pain point)
- [ ] Blue Ocean (differentiated from competitors)
- [ ] Voice consistency (disciplined, clear, authentic, approachable)
- [ ] SEO optimized (will add in next step)

Flag any issues and suggest revisions."
```

**brand-content Output**:
- Framework alignment score (pass/fail for each framework)
- Specific revisions needed
- Tone adjustments (if Sage/Explorer balance is off)

**Example Full Workflow:**

```
## Step 1: Ideation
User: "Generate blog post ideas for cross-pollination track, applying framework checks"

brand-content Output:
1. "Code Review Like a Flight Instructor (5 CFI Teaching Techniques)"
   - Audience: Developers (especially mentors/tech leads)
   - Pain: Code reviews are too harsh or too soft
   - Blue Ocean: CFI teaching methods → code review (no competitor has this)
   - Why: "I believe code reviews should teach and encourage, not just criticize"
   - Track: Cross-pollination ✅

[4 more ideas...]

## Step 2: Draft
User: "Write blog post: 'Code Review Like a Flight Instructor' with framework requirements"

brand-content Output:
[2,000-word draft with Sage Explorer tone, systematic 5-step framework, aviation → dev angle]

## Step 3: Edit
User: "Review draft against Brand Consistency Checklist"

brand-content Output:
- ✅ Golden Circle: Yes, leads with Why (code reviews should teach)
- ✅ Brand Archetype: 65% Sage / 35% Explorer (slightly off, add more personal story)
- ✅ Brand Pyramid: Yes, ladders to Systematic Mastery
- ✅ Brand Key: Yes, serves developer pain point
- ✅ Blue Ocean: Yes, highly differentiated (CFI → code review unique)
- ⚠️  Voice: Slightly too formal in section 2, add conversational phrases

Suggested Revisions:
- Section 2: Add personal CFI failure story for Explorer authenticity
- Conclusion: Strengthen CTA (downloadable checklist mentioned but not prominent)
```

**Integration Summary**:
- `brand-content` now enforces frameworks automatically
- Ideation uses Blue Ocean + Brand Key
- Drafting uses Brand Archetype + Brand Pyramid
- Editing uses Brand Consistency Checklist
- **Result**: Every blog post is framework-aligned before SEO optimization

---

## Skill 2: seo-optimize (SEO & Optimization)

### Current Workflow (Before Frameworks)

1. Keyword research
2. On-page SEO (title, meta, headings)
3. Technical SEO checks

### Enhanced Workflow (With Frameworks + Blue Ocean)

**Phase 1: Keyword Strategy (Blue Ocean Keywords)**

```
Invoke: seo-optimize (keyword research mode)

Prompt:
"Keyword research for blog post: '[Topic]'

Blue Ocean Strategy:
- Avoid red ocean keywords (high competition, generic)
- Find blue ocean keywords (unique angles, low competition)

Examples:
- ❌ Red Ocean: 'code review best practices' (too competitive)
- ✅ Blue Ocean: 'code review flight instructor techniques' (unique, low competition)

Generate:
1. Primary keyword (blue ocean angle preferred)
2. Secondary keywords (2-3)
3. Long-tail keywords (2-3)
4. Competitor analysis: Who ranks for these? (Validate blue ocean)"
```

**seo-optimize Output**:
- Blue ocean keyword strategy
- Competition analysis (confirm differentiation)
- Keyword difficulty scores
- Search volume estimates

**Phase 2: On-Page SEO (Framework-Aligned)**

```
Invoke: seo-optimize (on-page optimization mode)

Prompt:
"Optimize blog post for SEO while maintaining brand voice:

[Paste draft]

Requirements:
- Primary keyword: '[keyword]'
- Brand Archetype: Maintain 60% Sage + 40% Explorer tone (don't make it SEO-robotic)
- Brand Essence: Keep 'Systematic Mastery' theme clear
- SEO elements: title tag, meta description, URL slug, H2/H3 structure, internal links, alt text

Example:
- ❌ SEO-only title: '10 Code Review Tips for Developers'
- ✅ Brand + SEO: 'Code Review Like a Flight Instructor (5 Teaching Techniques for Developers)'
  - Includes keyword: 'code review'
  - Includes differentiation: 'flight instructor'
  - Maintains tone: instructive + unique angle"
```

**seo-optimize Output**:
- SEO-optimized title (keyword + brand voice)
- Meta description (compelling + keyword + brand promise)
- URL slug (short, descriptive, keyword)
- H2/H3 structure (keyword-optimized, scannable)
- Internal link suggestions (related posts)
- Image alt text (descriptive, keyword)
- **Tone preserved** (not SEO-robotic)

**Phase 3: Competitive SEO (Blue Ocean Validation)**

```
Invoke: seo-optimize (competitive analysis mode)

Prompt:
"Analyze top 10 Google results for '[primary keyword]'

Blue Ocean Check:
- What angle are competitors taking?
- How can we differentiate?
- Is our cross-domain angle (aviation → dev) showing up in results? (If no, that's blue ocean)

Output:
- Competitor content gaps
- Unique angles we can emphasize
- Validation that our positioning is differentiated"
```

**seo-optimize Output**:
- Competitor content analysis
- Differentiation opportunities
- Blue ocean confirmation (no one else has our angle)

**Example Full Workflow:**

```
## Step 1: Keyword Research (Blue Ocean)
User: "Keyword research for 'Code Review Like CFI' post, blue ocean strategy"

seo-optimize Output:
- Primary: "code review techniques" (moderate competition, but we'll differentiate)
- Blue Ocean Angle: "flight instructor code review" (0 competition, unique)
- Secondary: "better code reviews," "code review best practices"
- Long-tail: "how to give constructive code review," "code review for junior developers"
- Competitor Analysis: Top results are generic (Dev.to, Medium articles). No aviation angle found. ✅ Blue Ocean

## Step 2: On-Page SEO (Framework-Aligned)
User: "Optimize post for SEO, maintain Sage Explorer tone"

seo-optimize Output:
- Title: "Code Review Like a Flight Instructor (5 Teaching Techniques for Developers)"
  - Keyword: ✅ "code review"
  - Blue Ocean: ✅ "flight instructor"
  - Brand Archetype: ✅ Sage (instructive) + Explorer (unique angle)

- Meta: "Learn 5 CFI teaching techniques to give better, more encouraging code reviews. Systematic framework from aviation applied to development."
  - 158 characters ✅
  - Keyword: ✅ "code review"
  - Brand Promise: ✅ "systematic framework"

- URL: /code-review-flight-instructor-techniques

- H2 Optimization:
  - "5 CFI Teaching Techniques for Code Review" (keyword + framework)
  - "Technique 1: Positive Correction" (clear, instructive)
  - "How I Learned This" (Explorer, personal)
  - "Your Next Code Review" (actionable takeaway)

- Internal Links:
  - Link to "Pre-Deployment Checklist" post (related systematic framework)
  - Link to "About Marcus" page (credibility: pilot + dev)

- Image Alt Text:
  - "CFI teaching student pilot in cockpit with code review overlay" (keyword + context)
```

**Integration Summary**:
- `seo-optimize` now uses Blue Ocean strategy for keyword selection
- On-page SEO maintains brand voice (not robotic)
- Competitive analysis validates differentiation
- **Result**: SEO-optimized content that's still brand-aligned and differentiated

---

## Skill 3: content-repurpose (Multi-Platform Distribution)

### Current Workflow (Before Frameworks)

1. Write blog post
2. Shorten for LinkedIn
3. Create Twitter thread
4. Send newsletter

### Enhanced Workflow (With Platform-Specific Framework Application)

**Phase 1: Repurpose for Twitter (Sage Explorer Balance)**

```
Invoke: content-repurpose (Twitter thread mode)

Prompt:
"Convert blog post '[Title]' into Twitter thread (10-12 tweets)

Framework requirements:
- Brand Archetype: Maintain 60% Sage + 40% Explorer tone
- Golden Circle: First tweet = Why (hook with purpose/belief)
- Brand Pyramid: Ladders to 'Systematic Mastery' (systematic framework thread)

Thread structure:
1. Hook tweet (Why + personal story, Explorer)
2-9. Framework tweets (Sage, instructive, each technique/step)
10. Personal lesson tweet (Explorer, transparent about failure)
11. CTA tweet (link to blog post, download checklist)

Character limit: 280/tweet
Tone: Slightly more casual than blog, but still instructive"
```

**content-repurpose Output**:
- 10-12 tweet thread
- Maintains Sage Explorer tone (60/40)
- Golden Circle (opens with Why)
- Each tweet provides value (not just teasers)

**Phase 2: Repurpose for LinkedIn (Professional Sage Emphasis)**

```
Invoke: content-repurpose (LinkedIn post mode)

Prompt:
"Convert blog post '[Title]' into LinkedIn post (500-800 words)

Framework requirements:
- Brand Archetype: 70% Sage + 30% Explorer (more professional for LinkedIn)
- Golden Circle: Open with insight or belief
- Brand Key: Address professional pain point (career growth, mentoring)

Structure:
1. Hook (2 sentences, insight or belief, before 'See more' cutoff)
2. Framework overview (3-5 key points, Sage instructive)
3. Personal story (Explorer, but professional tone)
4. Takeaway + CTA (comment, share, read full post)

Hashtags: 3-5 relevant (#SystematicThinking #CodeReview #AviationPrinciples #SoftwareDevelopment #Mentoring)"
```

**content-repurpose Output**:
- LinkedIn post (500-800 words)
- Adjusted tone: 70% Sage / 30% Explorer (professional)
- Hook optimized for LinkedIn's "See more" cutoff
- Relevant hashtags

**Phase 3: Repurpose for Newsletter (Conversational 50/50)**

```
Invoke: content-repurpose (newsletter mode)

Prompt:
"Convert blog post '[Title]' into newsletter email

Framework requirements:
- Brand Archetype: 50% Sage + 50% Explorer (more balanced, conversational)
- Brand Pyramid: Functional + Emotional benefits explicitly stated
- Voice: Personal, like writing to a friend (but still valuable)

Structure:
1. Personal greeting + intro (what's happening in my life this week)
2. Main insight (1-2 key frameworks from post, Sage)
3. Story (how I learned this, Explorer)
4. Takeaway (what you can do, how you'll feel)
5. CTA (read full post, download checklist, reply with your experience)

Length: 800-1,200 words
Subject line: Compelling, curiosity-driven, 40-50 characters"
```

**content-repurpose Output**:
- Newsletter email (800-1,200 words)
- Subject line options (A/B test-ready)
- Conversational tone (50/50 Sage Explorer)
- Personal greeting and story

**Example Full Workflow:**

```
## Blog Post
"Code Review Like a Flight Instructor (5 Teaching Techniques)" - 2,500 words, 60% Sage / 40% Explorer

## Twitter Thread (Repurposed)
Tweet 1 (Hook, Why, Explorer):
"Five years ago, I got 47 critical comments on my first pull request. I almost quit.

Two years later as a flight instructor, I learned how to give feedback that builds confidence, not crushes it.

Here's how I now review code using CFI teaching techniques 🧵"

Tweets 2-6 (Framework, Sage):
"1/ Positive Correction (The Sandwich Method)

Start with what they did well.
Address one key improvement.
End with encouragement.

❌ 'This function is too long. Refactor it.'
✅ 'I like your clear sections. Consider extracting lines 45-60 into a helper. Overall solid!'"

[Continue for techniques 2-5...]

Tweet 10 (Personal lesson, Explorer):
"My first student as a CFI struggled with landings. I criticized instead of teaching. He snapped back.

I changed: showed him, talked him through, let him try with guidance. He greased it next time.

People don't resist correction. They resist criticism without a path forward."

Tweet 11 (CTA):
"Try this on your next code review.

Download my full "CFI-Inspired Code Review Checklist" (5 techniques + examples):
[link]

And if you want more aviation → dev frameworks, follow me @MarcusG"

## LinkedIn Post (Repurposed)
"I believe code reviews should teach and encourage, not just criticize. After 2 years as a flight instructor, I learned five teaching techniques that transformed how I give feedback—and they apply perfectly to code review.

1. Positive Correction (Sandwich Method): Start with what they did well...
[3-5 key points, more formal than Twitter]

As a CFI, I learned this when my first student snapped back after I only pointed out mistakes. Changed my approach, and he went from struggling to confident in 3 flights.

If you review code (or mentor developers), try these techniques on your next PR.

What's your experience with code reviews? Comment below.

Full framework + downloadable checklist: [link]

#SystematicThinking #CodeReview #SoftwareDevelopment #Mentoring #AviationPrinciples"

## Newsletter (Repurposed)
Subject: "What a flight instructor taught me about code review"

Hey friend,

Quick update: I just broke 500 hours as a First Officer, which means I'm halfway to Captain minimums. Wild. But that's not what I want to share today.

I was reviewing a junior dev's pull request yesterday and caught myself about to write, "Why did you do it this way?" Then I remembered my first CFI debrief vs. my first code review. One built my confidence. The other almost made me quit development.

Here are the 5 teaching techniques I learned as a flight instructor that completely changed how I review code...

[1-2 key frameworks, conversational Sage]

My aha moment came when my first student pilot snapped back at me. I was criticizing without teaching. I changed my approach—show, guide, encourage—and he went from bouncing landings to greasing them in three flights.

Code review is the same. People don't resist correction. They resist being made to feel small.

Try this on your next PR: Start with what they did well. Focus on one key improvement. Show them how, don't just tell them. Affirm their progress.

You'll give better reviews. And your team will feel supported, not attacked.

Full "CFI-Inspired Code Review Checklist" here: [link]

Reply and let me know if you try this. I'd love to hear how it goes.

Marcus
[link to website]

P.S. Next week I'm sharing how I balance 80 hours of flying with 10 hours of coding. Spoiler: It's all about systematic time-blocking."
```

**Integration Summary**:
- `content-repurpose` maintains brand frameworks across platforms
- Adjusts Sage/Explorer balance per platform (Twitter 60/40, LinkedIn 70/30, Newsletter 50/50)
- Golden Circle maintained (each version leads with Why)
- Brand Pyramid benefits articulated platform-appropriately
- **Result**: Consistent brand across channels, optimized for each platform's audience

---

## Skill 4: analytics-insights (Measurement & Learning)

### Current Workflow (Before Frameworks)

1. Check GA4 traffic
2. Review top posts
3. Note metrics

### Enhanced Workflow (With Brand Health Metrics + Framework Validation)

**Phase 1: Monthly Analytics Review (Brand Health Dashboard)**

```
Invoke: analytics-insights (monthly review mode)

Prompt:
"Generate monthly brand health report using GA4 and Search Console data:

Framework-Specific Metrics:
1. **Content Track Balance** (from GA4 page URLs):
   - Aviation posts: X views
   - Dev/Startup posts: Y views
   - Cross-Pollination posts: Z views
   - Is balance 40/40/20? (Brand Key requirement)

2. **Blue Ocean Performance** (from Search Console):
   - Are we ranking for blue ocean keywords? ('systematic cross-domain thinking', 'flight instructor code review', etc.)
   - Are we ranking for red ocean keywords? (generic terms)
   - Blue ocean content getting more organic traffic than generic?

3. **Positioning Clarity** (from GA4 behavior):
   - Average time on page (indicates instructive Sage content is engaging)
   - Bounce rate (low = content meets expectations, clear positioning)
   - Pages per session (are visitors exploring both tracks?)

4. **Brand Consistency Impact** (correlate with `BRAND_HEALTH_METRICS.md`):
   - Did consistency score (from quarterly audit) correlate with engagement?
   - Posts with highest engagement: Do they align with Sage Explorer archetype?

Output:
- Brand Health Dashboard (see BRAND_HEALTH_METRICS.md template)
- Insights for strategy adjustment
- Framework validation (are frameworks working?)"
```

**analytics-insights Output**:
- Monthly Brand Health Dashboard (metrics logged)
- Framework performance analysis:
  - "Cross-pollination content gets 2x engagement vs. single-track" (validates Blue Ocean)
  - "Sage Explorer tone posts average 5 min time-on-page vs. 3 min for purely instructive" (validates archetype)
- Recommendations for next month

**Phase 2: Content Performance Analysis (Framework Attribution)**

```
Invoke: analytics-insights (content analysis mode)

Prompt:
"Analyze top 10 and bottom 5 blog posts by engagement (GA4 + social metrics)

Framework Attribution:
- Which framework strengths correlate with high engagement?
  - Systematic frameworks (Sage)? Checklists, step-by-step guides?
  - Personal stories (Explorer)? Transparent failures, build-in-public?
  - Cross-pollination (Blue Ocean)? Aviation → dev content?

- Which topics/angles underperformed?
  - Too generic (red ocean)?
  - Off-brand (didn't ladder to Systematic Mastery)?
  - Wrong audience (didn't serve pain point)?

Output:
- Top performers with framework analysis (what made them work?)
- Bottom performers with framework gaps (what was missing?)
- Lessons learned for content strategy"
```

**analytics-insights Output**:
- Framework-attributed performance analysis
- Example: "Top 3 posts all featured systematic frameworks (checklists, step-by-step) = Sage strength working"
- Example: "Bottom post was generic 'tips' listicle (red ocean, not differentiated) = confirms Blue Ocean strategy"
- Actionable insights: "Double down on cross-pollination + systematic frameworks"

**Phase 3: Audience Insights (Target Audience Validation)**

```
Invoke: analytics-insights (audience analysis mode)

Prompt:
"Analyze audience demographics and behavior (GA4):

Brand Key Validation:
- Are we reaching target audiences?
  - Student pilots / aspiring airline pilots?
  - Developers / side hustle builders?
  - Multi-passionate professionals?

- What content resonates with each segment?
  - Aviation content: Are pilots engaging or is it devs reading aviation content?
  - Dev content: Are devs engaging or is it pilots reading dev content?
  - Cross-pollination: Drawing both audiences equally?

- Search queries (Search Console):
  - Are people finding us for 'systematic thinking'?
  - Are 'aviation' and 'development' keywords both bringing traffic?
  - Are multi-passionate keywords ('career change', 'side hustle pilot', etc.) appearing?

Output:
- Target audience reach validation
- Content resonance by segment
- Search query themes (positioning clarity check)"
```

**analytics-insights Output**:
- Audience validation: "60% developers, 30% pilots, 10% multi-passionate" (confirms dual-track positioning)
- Content resonance: "Cross-pollination content attracts 50/50 pilots and devs" (validates Blue Ocean)
- Search themes: "Top queries include 'systematic', 'aviation development', 'flight instructor startup'" (positioning working)

**Example Full Workflow:**

```
## Step 1: Monthly Brand Health Review
User: "Generate monthly brand health report with framework metrics"

analytics-insights Output:

**Month: November 2025**

### Content Track Balance
- Aviation posts: 12 (42% of traffic) ✅ Target: 40%
- Dev/Startup posts: 10 (35% of traffic) ⚠️ Target: 40% (slightly under)
- Cross-pollination posts: 6 (23% of traffic) ✅ Target: 20%

**Status**: 🟢 Balanced (cross-pollination overperforming = good)

### Blue Ocean Performance
- Blue ocean keywords ranking: 8 out of 10 target keywords in top 10 ✅
  - "flight instructor code review" - #1
  - "systematic cross-domain thinking" - #3
  - "aviation principles developers" - #5

- Red ocean keywords: Not prioritizing (intentional Blue Ocean strategy) ✅

**Status**: 🟢 Blue Ocean strategy working

### Positioning Clarity
- Avg time on page: 4.2 minutes ✅ (instructive Sage content engaging)
- Bounce rate: 52% ✅ (acceptable, content meets expectations)
- Pages per session: 2.3 ✅ (visitors exploring both tracks)

**Status**: 🟢 Clear positioning

### Key Insight
Cross-pollination content ("Code Review Like CFI") got 3x engagement vs. single-track content.
**Recommendation**: Increase cross-pollination from 20% → 30% of content (Blue Ocean sweet spot).

## Step 2: Content Performance Analysis (Framework Attribution)
User: "Analyze top/bottom posts with framework attribution"

analytics-insights Output:

**Top Performers**:
1. "Code Review Like a Flight Instructor" - 6,500 views, 6% engagement
   - Framework Strengths: ✅ Cross-pollination (Blue Ocean), ✅ Systematic framework (5 techniques, Sage), ✅ Personal CFI story (Explorer)
   - Why it worked: Differentiated angle + instructive framework + authentic story = Sage Explorer + Blue Ocean perfect combo

2. "Pre-Deployment Checklist (From Aviation Pre-Flight)" - 4,200 views, 5.5% engagement
   - Framework Strengths: ✅ Cross-pollination, ✅ Systematic checklist (Sage), ✅ Failure story (Explorer)
   - Why it worked: Same pattern—Blue Ocean + Sage framework + Explorer authenticity

3. "How I Build a Startup While Flying 80 Hours/Month" - 3,800 views, 5% engagement
   - Framework Strengths: ✅ Build in public (Explorer), ✅ Systematic time management (Sage), ✅ Dual-track positioning (Brand Key)
   - Why it worked: Transparent journey + actionable framework + multi-passionate angle

**Pattern**: Cross-pollination + Systematic Framework + Personal Story = highest engagement

**Bottom Performers**:
1. "10 Aviation Tips for Student Pilots" - 800 views, 1.2% engagement
   - Framework Gaps: ❌ Generic (red ocean, no Blue Ocean angle), ❌ No cross-domain insight, ❌ Purely instructive (no Explorer story)
   - Why it flopped: Competed with established aviation sites, no differentiation

**Lesson**: Avoid generic single-track content. Prioritize cross-pollination + systematic frameworks + authenticity.

## Step 3: Audience Insights (Target Audience Validation)
User: "Analyze audience, validate Brand Key target audiences"

analytics-insights Output:

**Audience Demographics** (GA4):
- Developers/Tech: 55%
- Aviation/Pilots: 30%
- Multi-passionate/Career changers: 15%

**Content Resonance**:
- Aviation content: 60% pilots, 40% devs (devs curious about aviation principles)
- Dev content: 80% devs, 20% pilots
- Cross-pollination content: 50% pilots, 50% devs (perfect balance) ✅

**Search Queries** (Search Console top 20):
- "systematic thinking" - 15% of queries ✅ (positioning working)
- "flight instructor [topic]" - 25% ✅ (aviation authority)
- "aviation code review", "pilot developer" - 10% ✅ (cross-domain positioning)
- "build in public", "startup full-time job" - 20% ✅ (dev/startup authority)

**Validation**: ✅ Reaching both target audiences, ✅ "Systematic" keyword appearing, ✅ Cross-domain positioning clear in search behavior

**Recommendation**: Target audience strategy working. Maintain dual-track content with emphasis on cross-pollination (draws both).
```

**Integration Summary**:
- `analytics-insights` now measures brand health using framework metrics
- Content performance attributed to specific framework strengths (Sage, Explorer, Blue Ocean)
- Audience validation confirms Brand Key target audiences being reached
- **Result**: Data-driven framework validation and strategy refinement

---

## Integrated Workflow: End-to-End

**Full content creation → optimization → distribution → measurement cycle with frameworks:**

### Week 1: Create

```
1. Ideation (brand-content + frameworks):
   - Choose topic using Blue Ocean + Brand Key checks
   - "Pre-Flight Checklist for API Development"

2. Draft (brand-content + Brand Archetype):
   - Write 2,000-word post, 60% Sage + 40% Explorer tone
   - Systematic framework + personal failure story

3. Edit (brand-content + Brand Consistency Checklist):
   - Validate framework alignment
   - Adjust tone if Sage/Explorer balance off

4. SEO (seo-optimize + Blue Ocean):
   - Blue ocean keyword research ("aviation API development", "pre-flight checklist API")
   - On-page SEO while maintaining brand voice
```

### Week 2: Distribute

```
5. Publish Blog (brand-content):
   - Publish to marcusgoll.com

6. Repurpose (content-repurpose + Platform-Specific Archetype):
   - Twitter thread: 60/40 Sage/Explorer, Golden Circle hook
   - LinkedIn post: 70/30 Sage/Explorer, professional tone
   - Newsletter: 50/50 Sage/Explorer, conversational

7. Schedule & Publish (multi-platform):
   - Twitter: Tuesday 9 AM
   - LinkedIn: Wednesday 8 AM
   - Newsletter: Friday 10 AM
```

### Week 3: Measure

```
8. Track Performance (analytics-insights + Brand Health Metrics):
   - Log metrics in dashboard (views, engagement, signups)
   - Attribute performance to framework strengths
   - Validate Blue Ocean positioning (ranking for unique keywords?)

9. Learn & Adjust (analytics-insights + Brand Evolution Tracker):
   - Document lessons learned in BRAND_EVOLUTION_TRACKER.md
   - Adjust next month's content strategy based on data
   - If cross-pollination content overperformed → do more
```

### Week 4: Iterate

```
10. Monthly Review (all skills + all frameworks):
    - Compile monthly brand health report
    - Review content track balance (40/40/20?)
    - Check framework consistency (tone drift?)
    - Plan next month's content (apply lessons learned)
```

**Result**: Systematic, repeatable, framework-driven content engine that strengthens brand with every cycle.

---

## Quick Reference: Skill + Framework Cheat Sheet

| Skill | Frameworks Used | Output |
|-------|----------------|--------|
| `brand-content` | Golden Circle, Brand Archetype, Brand Pyramid, Brand Key, Blue Ocean | Framework-aligned blog posts, consistent tone, differentiated topics |
| `seo-optimize` | Blue Ocean (keyword strategy), Brand Archetype (maintain voice) | SEO-optimized content that's still brand-aligned |
| `content-repurpose` | Brand Archetype (platform-specific tone), Golden Circle (consistent Why) | Multi-platform content with consistent brand |
| `analytics-insights` | Brand Health Metrics, Blue Ocean (performance validation) | Data-driven framework validation and strategy refinement |

---

## Next Steps

1. **Test the workflow**: Create one blog post using this integrated workflow
2. **Refine as needed**: Adjust prompts based on what works
3. **Document learnings**: Add to `BRAND_EVOLUTION_TRACKER.md`
4. **Systematize**: Once comfortable, create templates/snippets for common prompts

**Document Status**: Complete
**Next Review Date**: Quarterly (adjust based on usage)
**Owner**: Marcus Gollahon
