# Content Framework Integration - Marcus Gollahon

**Version**: 1.0.0
**Date Created**: 2025-10-21
**Purpose**: Practical guide for integrating brand frameworks into content creation workflow

---

## Overview

This document bridges strategy and execution—showing **exactly how** to apply brand frameworks (Golden Circle, Brand Archetype, Brand Pyramid, etc.) to your daily content creation process.

**Why This Matters:**
- Turns abstract frameworks into concrete actions
- Ensures every piece of content strengthens brand
- Makes content creation systematic (not guesswork)
- Maintains consistency while allowing creativity

**For**: Blog posts, social media (Twitter/LinkedIn), newsletters, tutorials, and all content types.

---

## 1. Content Creation Workflow (Framework-Integrated)

### Phase 1: Ideation (Frameworks Guide Topic Selection)

**Step 1.1: Choose Target Audience**
- [ ] Student pilots / aspiring airline pilots
- [ ] Certified Flight Instructors (CFIs)
- [ ] Developers / side hustle builders
- [ ] Multi-passionate professionals

**Step 1.2: Identify Content Track**
- [ ] Aviation (40% of content)
- [ ] Dev/Startup (40% of content)
- [ ] Cross-Pollination (20% of content) ← Most unique, prioritize when possible

**Step 1.3: Find Pain Point (Brand Key: Consumer Insight)**

**Use Brand Key to identify real pain point:**
- What does this audience struggle with?
- What insight can I address?

**Examples:**
- Aviation: "Flight training is expensive and overwhelming—need structured guidance"
- Dev: "Want to build side project but limited time and overwhelmed"
- Cross: "Told to 'pick one thing' but I have multiple passions"

**Step 1.4: Apply Blue Ocean Check**

**Ask**: Is this topic differentiated or generic (red ocean)?

- ❌ Generic: "10 Tips to Be a Better Pilot" (red ocean, everyone writes this)
- ✅ Differentiated: "How to Teach Like a CFI (Even If You're a Code Mentor)" (blue ocean, unique angle)

**If generic**: Add cross-domain angle, systematic framework, or personal story to differentiate.

**Step 1.5: Ensure Golden Circle Alignment**

**Ask**: Can I lead with "Why" (purpose/belief)?

- ✅ "I believe deployments should be systematic like pre-flights..." (clear Why)
- ❌ "Here are 10 deployment tips" (no Why, just What)

**If no clear Why**: Brainstorm belief or purpose behind the topic.

**Ideation Output**: Topic + target audience + pain point + differentiation angle + Why

**Example**:
- Topic: Pre-deployment checklist
- Audience: Devs building side projects
- Pain: Nervous deploying, often forget steps
- Angle: Aviation pre-flight checklist applied to code
- Why: I believe deployments should be systematic, not stressful

---

### Phase 2: Research & Structure (Brand Pyramid Guides Depth)

**Step 2.1: Research Content (Gather Info)**

- Personal experience (What have I done? What did I learn?)
- Frameworks I've used (Checklists, lesson plans, systems)
- Data/examples (Specific incidents, metrics, results)
- Credible sources (If needed, link to external resources)

**Step 2.2: Build Brand Pyramid for This Content**

**Map content to pyramid layers:**

| Layer | This Content |
|-------|-------------|
| **Feature** | Blog post: Pre-deployment checklist tutorial |
| **Functional Benefit** | Readers learn systematic framework to deploy without bugs |
| **Emotional Benefit** | Readers feel confident, in control, less anxious about deployment |
| **Brand Personality** | Disciplined (checklist), clear (step-by-step), authentic (share my failure) |
| **Brand Essence** | Systematic Mastery: Aviation discipline applied to code |

**This ensures content ladders up to brand essence.**

**Step 2.3: Outline Structure (Systematic Sage Style)**

**Use clear, instructive structure:**

1. Hook (personal story or Why)
2. Problem statement (pain point)
3. Solution introduction (systematic framework)
4. Step-by-step breakdown (clear instructions)
5. Example (show it in action)
6. Takeaway / CTA (download checklist, subscribe, etc.)

**Sage Explorer Balance**:
- Hook = Explorer (story, authentic)
- Problem + Solution + Steps = Sage (instructive, systematic)
- Example = Explorer (personal, transparent)
- Takeaway = Sage (clear action)

---

### Phase 3: Drafting (Archetype Guides Tone)

**Step 3.1: Write Hook (Start with Why, Be Authentic)**

**Golden Circle: Lead with Why**

Example:
> "Last night I deployed code at 11 PM and broke authentication for 2,000 users. I was exhausted. I skipped steps. I should have followed my own advice: treat deployments like a pilot treats takeoff—systematically, with a pre-flight checklist. Here's the framework I built after that failure. It's saved me three times since."

**Archetype Check**:
- ✅ Sage: Clear problem statement, introduces systematic framework
- ✅ Explorer: Authentic failure story, transparent, relatable

**Step 3.2: Write Body (Clear, Structured, Instructive)**

**Sage Mode: Teach Clearly**

- Use headings (H2, H3) for scannability
- Use bullet points and numbered lists
- Explain WHY each step matters (not just what)
- Include examples (code snippets, aviation analogies)

**Example Structure**:
```markdown
## The Pre-Deployment Checklist (15 Points)

### 1. Environment Variables
- **What**: Verify all env vars match production config
- **Why**: 40% of deployment failures come from missing/incorrect env vars
- **How**: Run `printenv | grep DATABASE` and compare to production
- **My experience**: I once wiped staging DB because DATABASE_URL was wrong

### 2. Run Tests
- **What**: Full test suite passes (unit, integration, E2E)
- **Why**: Catches regressions before users see them
- **How**: `npm test && npm run test:e2e`
- **Aviation parallel**: Like checking fuel levels before takeoff—non-negotiable
```

**Step 3.3: Add Personal Story / Authenticity (Explorer Mode)**

**Weave in personal experience:**
- Failures that taught you this framework
- Specific incidents (with details)
- Transparent about what you're still learning

**Example**:
> "I learned Step 7 the hard way. Three months ago, I deployed without checking the database migration status. The migration failed silently, and our app couldn't find critical user data. It took 4 hours to diagnose and roll back. Now, migration status is Step 7 on my checklist—never skip it."

**Archetype Check**:
- ✅ Explorer: Authentic, vulnerable, shares failure
- ✅ Sage: Turns failure into lesson, teaches others to avoid same mistake

**Step 3.4: Write Takeaway / CTA (Clear Action, Systematic)**

**Functional Benefit**: What readers can do now

Example:
> "Download my 15-point pre-deployment checklist (PDF) and adapt it for your stack. Print it. Laminate it. Put it next to your monitor. Check every item before you deploy. Your future self (and your users) will thank you."

**Emotional Benefit**: How they'll feel

> "You'll deploy with confidence, not anxiety. You'll know you didn't forget anything. You'll sleep soundly after deployments—like a pilot after a perfectly executed landing."

**Brand Pyramid Check**: This takeaway delivers functional + emotional benefits, ties to systematic mastery essence.

---

### Phase 4: Editing (Consistency Checklist)

**Step 4.1: Run Brand Consistency Checklist**

Use `BRAND_CONSISTENCY_CHECKLIST.md`:
- [ ] Golden Circle alignment (leads with Why)
- [ ] Archetype balance (60% Sage / 40% Explorer)
- [ ] Brand Pyramid (ladders to essence)
- [ ] Brand Key (serves audience pain point)
- [ ] Blue Ocean (differentiated)
- [ ] Visual consistency (colors, fonts)
- [ ] SEO optimized (keywords, meta, alt text)

**Step 4.2: Tone Pass (Sage Explorer Check)**

**Read content aloud. Ask:**
- Does this sound like a teacher explaining clearly? (Sage)
- Does this sound like a friend sharing their journey? (Explorer)
- Balance feels 60/40?

**If tone drift**:
- Too academic → Add personal story
- Too casual → Add structure/framework

**Step 4.3: Clarity Pass (Teaching Excellence)**

**Leverage 10-year teaching background:**
- Would a complete beginner understand this?
- Are technical terms explained?
- Are examples concrete (not abstract)?
- Is structure logical (intro → body → conclusion)?

**Step 4.4: Differentiation Pass (Blue Ocean Check)**

**Ask**: Could any aviation or dev blogger write this exact content?

- If YES: Add unique Marcus angle (cross-domain, systematic, teaching)
- If NO: Great, it's differentiated

**Step 4.5: Proofread (Quality Check)**

- Grammar and spelling (Grammarly, Hemingway Editor)
- Link check (all links work, open in new tab if external)
- Image check (optimized, alt text, brand colors)

---

### Phase 5: Publishing (Framework Validation)

**Step 5.1: Platform Optimization**

**If Blog**:
- Featured image (1200x630px, brand colors)
- SEO (title, meta, URL slug, keywords)
- Internal links (2-3 related posts)
- Newsletter CTA (subscribe at end)

**If Twitter**:
- Character count (<280 or thread)
- Image (if relevant)
- Hashtags (1-2 max)
- CTA (like, RT, reply)

**If LinkedIn**:
- Hook in first 2 lines (before "See more")
- Paragraph breaks (mobile readability)
- Hashtags (3-5 max)
- Professional image

**Step 5.2: Final Framework Check**

**Before hitting "Publish", confirm:**
- [ ] This ladders up to "Systematic Mastery"
- [ ] This differentiates me from competitors
- [ ] This serves my target audience's pain point
- [ ] I'm proud of this in 5 years

**Step 5.3: Publish & Track**

- Publish content
- Log in content calendar (date, topic, track, platform)
- Track performance (engagement, clicks, signups)
- Note lessons learned for next time

---

## 2. Framework Application by Content Type

### Blog Posts (Long-Form)

**Framework Priority**: All frameworks (comprehensive application)

**Workflow**:
1. **Ideation**: Blue Ocean check (differentiated topic), Golden Circle (clear Why)
2. **Research**: Brand Pyramid (ensure ladders to essence), Brand Key (audience insight)
3. **Drafting**: Archetype (60% Sage / 40% Explorer), clear structure
4. **Editing**: Consistency Checklist (full validation)
5. **Publishing**: SEO optimization, brand visuals

**Time**: 3-5 hours per post (1,500-3,000 words)

**Framework Integration Points**:
- Golden Circle: Open with Why (purpose/belief)
- Archetype: Structured instruction (Sage) + personal story (Explorer)
- Brand Pyramid: Takeaway section explicitly states functional + emotional benefits
- Brand Key: Address specific pain point from target audience research
- Blue Ocean: Cross-domain angle or systematic framework differentiates

---

### Twitter/X Threads (Short-Form)

**Framework Priority**: Golden Circle, Archetype, Blue Ocean

**Workflow**:
1. **Ideation**: What's the Why? (purpose or insight)
2. **Drafting**: Hook tweet (Why), 5-10 instructive tweets (Sage), closing personal note (Explorer)
3. **Editing**: Tone check (60/40 balance), differentiation check
4. **Publishing**: Format for readability (line breaks), 1-2 hashtags, CTA

**Time**: 30-60 minutes per thread (8-12 tweets)

**Framework Integration Points**:
- Golden Circle: First tweet = Why (belief or insight)
- Archetype: Instructive tweets (Sage), personal anecdote (Explorer)
- Blue Ocean: Unique angle (cross-domain or systematic framework)

**Example Thread Structure**:
1. Hook (Why): "I believe deployments should be systematic like pre-flights. Here's why..."
2-10. Instructive (Sage): "Step 1: [Clear instruction]" ... "Step 9: [Clear instruction]"
11. Personal (Explorer): "I learned this after breaking prod 3x. Don't be me."
12. CTA: "Download full checklist: [link]"

---

### LinkedIn Posts (Medium-Form)

**Framework Priority**: Golden Circle, Archetype, Brand Key

**Workflow**:
1. **Ideation**: Professional insight, career lesson, or framework
2. **Drafting**: Hook (first 2 lines), body (Sage instruction), closing (Explorer story)
3. **Editing**: Professional tone check (still Sage Explorer, but lean slightly more Sage)
4. **Publishing**: Paragraph breaks, 3-5 hashtags, professional image

**Time**: 20-40 minutes per post (300-800 words)

**Framework Integration Points**:
- Golden Circle: Lead with insight or belief
- Archetype: 65% Sage / 35% Explorer (slightly more instructive for LinkedIn)
- Brand Key: Address professional pain point (career growth, skill development)

**Example Structure**:
```
[Hook: Personal story or insight in 2 sentences]

[Body: Structured lesson or framework, 3-5 key points]

[Closing: What I learned, how it applies to readers]

[CTA: "What's your experience with [topic]? Comment below."]

#SystematicThinking #AviationCareers #SoftwareDevelopment #BuildInPublic #LeadershipLessons
```

---

### Newsletters (Long-Form, Personal)

**Framework Priority**: All frameworks, especially Archetype and Brand Key

**Workflow**:
1. **Ideation**: What valuable insight can I share this week?
2. **Drafting**: Personal greeting, main insight (Sage), story (Explorer), takeaway + CTA
3. **Editing**: Conversational tone check, value check (is this worth their inbox?)
4. **Publishing**: Subject line optimization, preview text, send time

**Time**: 1-2 hours per newsletter (800-1,500 words)

**Framework Integration Points**:
- Golden Circle: Share Why behind the insight
- Archetype: Conversational Sage Explorer (50/50, more balanced than blog)
- Brand Pyramid: Functional (what to do) + Emotional (how they'll feel) benefits
- Brand Key: Serves subscriber pain point, reinforces brand promise

**Example Structure**:
```
Subject: [Compelling, curiosity-driven, 40-50 chars]

Hey [Name],

[Personal intro: What's happening in my life, relevant anecdote]

[Main insight: 1-2 key frameworks or lessons, Sage mode]

[Story: How I learned this, Explorer mode]

[Takeaway: What you can do with this, action step]

[CTA: Reply, read blog post, check out CFIPros, etc.]

Marcus
[Link to website or social]

P.S. [Optional: Quick update or related link]
```

---

## 3. Framework-Driven Ideation Templates

### Template 1: Cross-Pollination Content (Blue Ocean Sweet Spot)

**Formula**: "[Aviation Principle] Applied to [Development Topic]"

**Examples**:
- "Pre-Flight Checklists for Code Deployments"
- "How CFIs Teach (And Why Code Mentors Should Copy It)"
- "Debugging Like Troubleshooting Aircraft Systems"
- "Crew Resource Management for Engineering Teams"

**Framework Application**:
- Blue Ocean: ✅ Unique, no competitors write this
- Golden Circle: ✅ Clear Why (aviation discipline improves dev)
- Brand Pyramid: ✅ Ladders to Systematic Mastery (cross-domain thinking)
- Brand Key: ✅ Distinctive Ability (only Marcus can write this authentically)

**Ideation Prompt**:
> "What aviation principle/process can I translate into a development framework?"

---

### Template 2: Teaching Frameworks (Sage Strength)

**Formula**: "[Number]-Step Framework for [Target Audience Pain Point]"

**Examples**:
- "5-Step Lesson Structure Every CFI Should Use"
- "7-Point Pre-Deployment Checklist for Solo Devs"
- "3-Phase Method for Balancing Full-Time Job + Startup"
- "4-Stage Roadmap: Student Pilot to Airline Pilot"

**Framework Application**:
- Archetype: ✅ Sage mode (instructive, structured)
- Brand Pyramid: ✅ Clear functional benefit (learn framework)
- Brand Key: ✅ Serves target audience pain point, leverages teaching background

**Ideation Prompt**:
> "What systematic framework have I used that I can teach others?"

---

### Template 3: Building in Public (Explorer Strength)

**Formula**: "[Project Name]: [Month] Progress Report" or "[What I Learned from Failure]"

**Examples**:
- "Building CFIPros.com: Month 3 Progress Report"
- "Why My First Deployment Strategy Failed (And What I Built Instead)"
- "How I Code for 10 Hours a Week (While Flying 80 Hours a Month)"
- "This Feature Flopped: Here's the Data and What I Learned"

**Framework Application**:
- Archetype: ✅ Explorer mode (authentic, transparent, vulnerable)
- Brand Key: ✅ Reinforces building in public value, transparency
- Blue Ocean: ✅ Differentiated (real journey, not just theory)

**Ideation Prompt**:
> "What did I build, try, or fail at this week? What's the lesson?"

---

### Template 4: Career Roadmaps (Aviation Audience)

**Formula**: "The Complete [Career Path] Roadmap" or "How I [Achieved X]"

**Examples**:
- "The Complete Roadmap: 0 Hours to Airline Pilot"
- "How to Build Flight Hours on a Budget (5 Strategies)"
- "CFI to Regional Airline: My 2-Year Timeline"
- "Passing Your CFI Checkride: What the DPE is Really Looking For"

**Framework Application**:
- Brand Key: ✅ Serves aviation audience career pain point
- Archetype: ✅ Sage mode (structured, systematic guidance)
- Brand Pyramid: ✅ Functional (career path) + Emotional (confidence, clarity)

**Ideation Prompt**:
> "What aviation career milestone have I achieved that I can roadmap for others?"

---

## 4. Example Walkthrough: Full Process

### Example Content: "Code Review Like a Flight Instructor"

**Let's walk through the full framework-integrated process:**

---

#### Phase 1: Ideation

**Step 1: Choose Audience**
- ✅ Developers (especially junior/mid-level, or tech leads who mentor)

**Step 2: Content Track**
- ✅ Cross-Pollination (aviation → dev)

**Step 3: Pain Point (Brand Key)**
- Insight: "Developers give code reviews that are either too harsh (discouraging) or too soft (unhelpful). They need a systematic approach to review code like a teacher reviews student work."

**Step 4: Blue Ocean Check**
- ❌ Generic: "How to Give Better Code Reviews"
- ✅ Differentiated: "Code Review Like a Flight Instructor (5 Teaching Techniques)"
  - Unique angle: CFI teaching methods applied to code review
  - No competitor has this (Marcus is only airline pilot + CFI + dev)

**Step 5: Golden Circle**
- Why: "I believe code reviews should be instructive (help people improve) and encouraging (build confidence), not just critical. After 2 years as a CFI and 10 years teaching, I learned how to review student work effectively—and it applies perfectly to code."

**Ideation Output**:
- Topic: Code review using CFI teaching techniques
- Audience: Developers who review code (especially mentors, tech leads)
- Pain: Code reviews are too harsh or too soft
- Angle: CFI teaching methods → code review
- Why: Code reviews should teach and encourage, not just criticize

---

#### Phase 2: Research & Structure

**Step 1: Research**
- Personal experience: 2 years as CFI, taught hundreds of students
- Frameworks: 5 teaching techniques I used as CFI (positive correction, modeling, graduated difficulty, debrief, affirm progress)
- Examples: Specific code review scenarios, CFI flight debriefs

**Step 2: Brand Pyramid**

| Layer | This Content |
|-------|-------------|
| **Feature** | Blog post: 5 CFI teaching techniques for code review |
| **Functional Benefit** | Readers learn systematic framework for giving helpful, encouraging code reviews |
| **Emotional Benefit** | Readers feel confident reviewing code, junior devs feel supported |
| **Brand Personality** | Disciplined (5-step framework), clear (step-by-step), authentic (CFI stories) |
| **Brand Essence** | Systematic Mastery: Aviation teaching applied to development |

**Step 3: Outline**

1. Hook: Personal story (harsh code review I received as junior dev, vs. encouraging CFI debrief)
2. Problem: Code reviews are often too critical or too soft
3. Solution: 5 CFI teaching techniques for better code reviews
4. Technique 1: Positive Correction (sandwich method)
5. Technique 2: Modeling (show, don't just tell)
6. Technique 3: Graduated Difficulty (meet them where they are)
7. Technique 4: Debrief (ask questions, don't lecture)
8. Technique 5: Affirm Progress (celebrate wins)
9. Example: Before/after code review using these techniques
10. Takeaway: Downloadable code review checklist, CTA to subscribe

---

#### Phase 3: Drafting

**Hook (Golden Circle + Explorer)**:

> "Five years ago, I submitted my first pull request at my first dev job. The senior engineer left 47 comments. Every single one was critical. 'Why did you do it this way?' 'This is inefficient.' 'Read the docs.' I felt like an idiot. I almost quit.
>
> Two years later, I became a flight instructor. I had to teach student pilots—whose mistakes could be fatal—how to improve without crushing their confidence. I learned five teaching techniques that transformed how I gave feedback.
>
> Now, I apply those same techniques to code review. And I've seen junior devs go from discouraged to confident, from sloppy code to thoughtful solutions. Here's how."

**Archetype Check**:
- ✅ Explorer: Personal failure story, vulnerable, authentic
- ✅ Sage: Sets up instructive framework (5 techniques)

**Body (Sage Mode)**:

> ## 5 CFI Teaching Techniques for Code Review
>
> ### 1. Positive Correction (The Sandwich Method)
>
> **What it is**: Start with something done well, address issue constructively, end with encouragement.
>
> **Why it works**: In flight training, if I only pointed out mistakes, students became defensive and stopped learning. Leading with a positive primes them to receive correction openly.
>
> **How to apply in code review**:
> - ❌ Bad: "This function is way too long. Refactor it."
> - ✅ Good: "I like how you broke this into clear sections. To make it even more maintainable, consider extracting lines 45-60 into a helper function. Overall, solid structure!"
>
> **My CFI example**: After a student's first solo landing (a bit rough), I said: "You held centerline perfectly on approach—that's the hard part. Your flare was late, which caused the firm touchdown. Next time, start flaring 5 feet higher. But you flew the plane alone and landed safely. That's huge."

(Continue for techniques 2-5 with same structure: What, Why, How to apply, CFI example)

**Personal Story (Explorer Mode)**:

> ### How I Learned This
>
> My first student as a CFI was a 45-year-old engineer. Smart guy. But he struggled with landings—came in too fast every time. After his third bounced landing, I said, "You're flaring too late. Start your flare earlier."
>
> He snapped back: "I AM flaring earlier! Are you even watching?"
>
> I realized: I was criticizing without teaching. I changed approach. Next flight, I said, "Your pattern and approach were textbook. Let's nail the landing. I'll demo one, then talk you through it, then you'll do it with me guiding, then solo. Deal?"
>
> Three landings later, he greased it. Huge smile.
>
> That's when I learned: People don't resist correction. They resist criticism without a path forward.

**Takeaway (Sage + Functional/Emotional Benefits)**:

> ## Your Next Code Review
>
> Try this: Before commenting on a pull request, ask yourself:
> 1. What did they do well? (Start here)
> 2. What's the most important improvement? (Focus on one thing)
> 3. How can I show them, not just tell them? (Provide example)
> 4. What progress have they made? (Affirm it)
>
> **You'll give better reviews.** (Functional benefit: Systematic framework)
>
> **And your junior devs will feel supported, not attacked.** (Emotional benefit: Confidence, encouragement)
>
> Download my "CFI-Inspired Code Review Checklist" (5 techniques + examples): [Link]
>
> And if you want more frameworks like this—where I apply aviation discipline to development—subscribe to my newsletter: [Link]

---

#### Phase 4: Editing

**Brand Consistency Checklist**:
- [x] Golden Circle: Yes, leads with Why (code reviews should teach + encourage)
- [x] Archetype: Yes, 60% Sage (5 techniques, clear) + 40% Explorer (personal stories)
- [x] Brand Pyramid: Yes, ladders to Systematic Mastery (aviation teaching → code review)
- [x] Brand Key: Yes, serves dev audience pain point (harsh code reviews)
- [x] Blue Ocean: Yes, differentiated (CFI techniques for code review, no one else writes this)

**Tone Check**: Read aloud. Feels instructive (Sage) + authentic (Explorer). ✅

**Clarity Check**: Would junior dev understand? Yes. Technical terms explained. Examples concrete. ✅

**Differentiation Check**: Could any dev blogger write this? No—requires CFI experience. ✅

**Proofread**: Run through Grammarly, check links. ✅

---

#### Phase 5: Publishing

**Platform**: Blog (long-form)

**SEO**:
- Title: "Code Review Like a Flight Instructor (5 Teaching Techniques for Developers)"
- Meta: "Learn 5 CFI teaching techniques to give better, more encouraging code reviews. Systematic framework from aviation applied to development."
- URL: `/code-review-flight-instructor-techniques`
- Primary keyword: "code review techniques"
- Secondary keywords: "flight instructor teaching methods," "better code reviews"
- Alt text for header image: "CFI teaching student pilot in cockpit, with code review comments overlay"

**Visuals**:
- Featured image: Cockpit photo + code snippet overlay, Navy/Emerald colors
- Inline images: Before/after code review examples (screenshots)

**Internal Links**:
- Link to "Pre-Deployment Checklist" post (related systematic framework)
- Link to "About Marcus" page (credibility—pilot + dev)

**CTA**:
- End of post: Newsletter signup
- Downloadable: Code review checklist (PDF)

**Publish & Track**:
- Publish to blog
- Share on Twitter (thread version of 5 techniques)
- Share on LinkedIn (professional angle: mentoring junior devs)
- Log in content calendar: "Cross-pollination, 2,500 words, published [date]"
- Track: Page views, time on page, newsletter signups, social shares

---

**Outcome**: Content that is:
- ✅ Differentiated (Blue Ocean)
- ✅ On-brand (Sage Explorer, Systematic Mastery)
- ✅ Valuable (Serves audience pain point)
- ✅ Authentic (Personal CFI stories)
- ✅ Systematic (5-technique framework)
- ✅ Reinforces positioning (Cross-domain thinking, teacher + pilot + dev)

---

## 5. Quick Reference: Framework Application Flowchart

```
IDEATION
  ↓
[Choose Audience] → [Content Track] → [Pain Point] → [Blue Ocean Check] → [Golden Circle Why]
  ↓
RESEARCH & STRUCTURE
  ↓
[Gather Info] → [Build Brand Pyramid] → [Outline (Sage Structure + Explorer Story)]
  ↓
DRAFTING
  ↓
[Hook: Why + Story] → [Body: Instructive + Structured] → [Takeaway: Benefits + CTA]
  ↓
EDITING
  ↓
[Consistency Checklist] → [Tone Check (60/40)] → [Clarity Check] → [Differentiation Check] → [Proofread]
  ↓
PUBLISHING
  ↓
[Platform Optimization (SEO, Visuals)] → [Final Framework Check] → [Publish] → [Track]
```

**Total Time** (Blog Post Example): 4-6 hours
- Ideation: 30 min
- Research & Structure: 1 hour
- Drafting: 2-3 hours
- Editing: 1 hour
- Publishing: 30 min

---

## 6. Monthly Content Planning with Frameworks

### Month-Level Framework Application

**Step 1: Content Track Balance (Brand Key)**

- Target: 40% Aviation / 40% Dev / 20% Cross-Pollination
- Plan: 10 posts/month → 4 aviation, 4 dev, 2 cross-pollination

**Step 2: Audience Coverage (Brand Key)**

- Ensure all target audiences served:
  - Student pilots: 2 posts
  - CFIs: 1 post
  - Devs/founders: 3 posts
  - Multi-passionate: 2 posts
  - Cross-pollination: 2 posts (serve both aviation + dev)

**Step 3: Blue Ocean Prioritization**

- Prioritize unique content (cross-pollination) over generic
- 80% of content should be differentiated (unique Marcus angle)
- 20% can be "table stakes" (common topics, but with your spin)

**Step 4: Framework Themes**

- Rotate through framework strengths:
  - Week 1: Systematic frameworks (Sage strength)
  - Week 2: Building in public (Explorer strength)
  - Week 3: Cross-domain insights (Blue Ocean strength)
  - Week 4: Career roadmaps / teaching (Brand Key strength)

**Example Monthly Content Plan:**

| Week | Content 1 (Aviation) | Content 2 (Dev/Startup) | Content 3 (Cross-Poll.) |
|------|---------------------|------------------------|----------------------|
| Week 1 | "5-Step CFI Lesson Plan" (Systematic) | "Pre-Deployment Checklist" (Systematic) | — |
| Week 2 | "Building Flight Hours on Budget" (Career) | "CFIPros Month 3 Report" (Build in Public) | — |
| Week 3 | — | "How I Code 10hrs/Week While Flying" (Time Mgmt) | "CRM for Engineering Teams" (Cross-domain) |
| Week 4 | "Private Pilot Checkride Prep" (Career) | — | "Code Review Like CFI" (Cross-domain) |

**Framework Check**:
- ✅ 40/40/20 balance maintained
- ✅ All audiences served
- ✅ Blue Ocean content prioritized (2 cross-pollination posts = most unique)
- ✅ Framework themes rotated

---

## 7. Tools & Templates

### Content Ideation Template

```markdown
## Content Idea: [Working Title]

**Target Audience**: [Student pilots / CFIs / Devs / Multi-passionate]
**Content Track**: [Aviation / Dev-Startup / Cross-Pollination]
**Pain Point (Brand Key)**: [Specific audience struggle or insight to address]

**Blue Ocean Check**:
- Generic version: [What competitors would write]
- Differentiated version: [Unique Marcus angle]
- ✅ Differentiated? [Yes / No / Needs work]

**Golden Circle**:
- **Why** (Purpose/Belief): [The belief or purpose behind this content]
- **How** (Unique Approach): [Your systematic approach or teaching method]
- **What** (Deliverable): [Framework, checklist, tutorial, story]

**Brand Pyramid**:
- **Feature**: [The content itself]
- **Functional Benefit**: [What readers learn/do]
- **Emotional Benefit**: [How readers feel]
- **Brand Essence**: [How it ties to "Systematic Mastery"]

**Estimated Time**: [Hours to create]
**Priority**: [High / Medium / Low]
```

### Content Drafting Template

```markdown
# [Title]

**Target Audience**: [Who this serves]
**Content Track**: [Aviation / Dev / Cross-Poll]
**Word Count Target**: [Words]

---

## HOOK (Golden Circle: Why + Explorer: Story)

[Personal story or belief statement that grabs attention and states Why]

---

## PROBLEM STATEMENT (Brand Key: Pain Point)

[Audience pain point, clearly stated]

---

## SOLUTION INTRODUCTION (Brand Pyramid: Functional Benefit)

[Introduce systematic framework or approach]

---

## BODY (Sage: Instructive + Structured)

### [Section 1: Framework Step/Technique 1]

**What**: [Clear definition]
**Why**: [Why it matters]
**How**: [Specific instructions]
**Example**: [Concrete example, aviation or dev]

### [Section 2: Framework Step/Technique 2]

...

---

## PERSONAL STORY (Explorer: Authentic)

[How I learned this, failure or success story, transparent]

---

## TAKEAWAY / CTA (Brand Pyramid: Functional + Emotional Benefits)

**Functional**: [What readers can do now]
**Emotional**: [How they'll feel]
**CTA**: [Download, subscribe, comment, share]

---

## BRAND CONSISTENCY CHECK

- [ ] Golden Circle (Why clear)
- [ ] Archetype (60/40 Sage/Explorer)
- [ ] Brand Pyramid (ladders to essence)
- [ ] Brand Key (serves pain point)
- [ ] Blue Ocean (differentiated)
- [ ] Visual consistency (colors, fonts)
- [ ] SEO (keywords, meta, alt text)

✅ Ready to publish
```

---

## 8. Next Steps

1. **Practice**: Create your next piece of content using this workflow
2. **Refine**: Note what works, what feels clunky, adjust process
3. **Systematize**: Once comfortable, create personal shortcuts (Notion templates, Text Expander snippets)
4. **Batch**: Plan month of content using framework themes

**Document Status**: Complete
**Next Review Date**: Quarterly (adjust based on usage feedback)
**Owner**: Marcus Gollahon
