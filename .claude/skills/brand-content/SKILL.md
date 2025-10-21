---
name: Brand-Consistent Content Creation
description: Creating blog posts and content that maintains Marcus Gollahon's dual-track brand voice (Aviation + Dev/Startup) with systematic thinking tone. Use when writing articles, posts, or any content for marcusgoll.com.
---

# Brand-Consistent Content Creation

## Overview

This skill helps you create content for marcusgoll.com that maintains brand consistency across two parallel content tracks (Aviation and Dev/Startup) while reinforcing Marcus's core positioning as someone who teaches systematic thinking from 30,000 feet.

## When to Use This Skill

- Writing blog posts for marcusgoll.com
- Creating content for Aviation or Dev/Startup tracks
- Drafting articles that cross-pollinate between both domains
- Ensuring brand voice consistency across content types

## Core Brand Principles

### Dual-Track Positioning

Marcus serves two distinct but complementary audiences:

**Aviation Track**:
- Student pilots and aspiring pilots
- Certified Flight Instructors (CFIs)
- Aviation professionals seeking career guidance

**Dev/Startup Track**:
- Developers building side hustles while working full-time
- Junior/mid-level developers learning systematic practices
- Aspiring founders and #BuildInPublic community

### Brand Voice Fundamentals

**Tone**:
- Professional but approachable (not corporate)
- Teacher's voice (explaining, not preaching)
- Systematic and methodical (aviation precision)
- Transparent and authentic (building in public mindset)

**Avoid**:
- Jargon without explanation
- Overly casual or unprofessional language
- Making definitive claims without experience backing
- Talking down to readers

### Key Messaging Framework

Every piece of content should reinforce at least one of these core messages:

1. **Systematic Thinking Works Everywhere**: Aviation's disciplined approach makes you better at development, teaching, and business
2. **You Don't Have to Choose One Passion**: Build a career that honors all your interests
3. **Teaching is the Ultimate Skill**: Clear explanations come from deep understanding
4. **Build While You Work**: You don't need to quit to build a startup
5. **Share the Journey**: Building in public creates accountability and helps others

## Content Creation Workflow

### Step 1: Identify Content Track

Determine which track this content belongs to:

- **Aviation**: Flight training, CFI resources, aviation career topics
- **Dev/Startup**: Building CFIPros.com, systematic development, tutorials
- **Cross-Pollination**: Aviation principles applied to coding (highest value!)

### Step 2: Define Target Audience

Be specific about who you're writing for:

**Aviation**:
- Student pilots (0-500 hours, studying for certificates)
- CFIs (teaching instructors, building hours)
- Career changers (entering aviation industry)

**Dev/Startup**:
- Side hustle builders (full-time job + startup)
- Junior/mid devs (0-5 years experience)
- Multi-passionate professionals

### Step 3: Structure Your Content

Use this proven blog post structure:

```markdown
# [Compelling Title with Target Keyword]

[Hook paragraph - personal anecdote or provocative question]

## Introduction (Why This Matters)
- State the problem clearly
- Show you understand their pain point
- Preview what they'll learn

## [Main Content Sections]
- Break into 3-5 logical sections
- Use H2 for main sections, H3 for subsections
- Include examples from YOUR experience (aviation or coding)
- Add code snippets, checklists, or visuals where helpful

## Practical Takeaways
- Bulleted action items
- Concrete next steps
- Resources or tools mentioned

## Conclusion
- Summarize key insight
- Connect back to systematic thinking theme
- Clear CTA (comment, share, try something)
```

### Step 4: Apply Brand Voice

**For Aviation Content**:
- Reference your CFI experience ("When I was teaching students...")
- Use aviation analogies sparingly (readers know aviation)
- Focus on teaching methods from 10 years of education background
- Share specific lessons learned from flight instruction

**For Dev/Startup Content**:
- Reference building CFIPros.com specifically
- Show the "building while flying full-time" reality (time constraints, trade-offs)
- Apply aviation checklists/systematic approach to dev workflows
- Be transparent about failures and pivots

**For Cross-Pollination Content** (highest engagement):
- Start with aviation principle (checklists, pre-flight procedures, safety culture)
- Show how it applies to development (code review, deployment procedures, error handling)
- Provide both aviation AND development examples
- These posts appeal to BOTH audiences

### Step 5: Generate Post Metadata

Every post needs:

```yaml
---
title: [SEO-optimized title, 50-60 characters]
date: [YYYY-MM-DD]
track: [aviation | dev-startup | cross-pollination]
category: [flight-training | cfi-resources | building-in-public | tutorials | etc.]
tags: [tag1, tag2, tag3, tag4, tag5]
description: [Meta description, 150-160 characters, includes keyword]
reading_time: [X min]
featured_image: [/images/post-slug.jpg]
---
```

Use the `generate-frontmatter.sh` script to create consistent metadata.

### Step 6: Add Track Badge

Include track identifier at top of post:

```html
<div class="post-header">
  <span class="badge badge-aviation">Aviation</span>
  <!-- OR -->
  <span class="badge badge-dev">Dev/Startup</span>
  <!-- OR -->
  <span class="badge badge-cross">Cross-Pollination</span>

  <h1>[Post Title]</h1>
  <div class="post-meta">
    <span class="date">[Date]</span>
    <span class="read-time">[X] min read</span>
  </div>
</div>
```

## Content Quality Checklist

Before publishing, verify:

**Brand Alignment**:
- [ ] Reinforces at least one core message
- [ ] Uses appropriate brand voice for track
- [ ] Includes personal experience (not generic advice)
- [ ] Connects to systematic thinking theme

**Structure**:
- [ ] Clear introduction with hook
- [ ] Logical section flow (H2/H3 hierarchy)
- [ ] Scannable (bullets, short paragraphs, visuals)
- [ ] Actionable takeaways section
- [ ] Strong conclusion with CTA

**SEO Optimization**:
- [ ] Title includes target keyword (50-60 chars)
- [ ] Meta description compelling (150-160 chars)
- [ ] Headers use natural keyword variations
- [ ] Internal links to related posts (3-5 links)
- [ ] Alt text on all images

**Technical**:
- [ ] Proofread (no typos, grammar errors)
- [ ] Code snippets tested (if applicable)
- [ ] Links work (no 404s)
- [ ] Images optimized (<200KB each)
- [ ] Track badge applied correctly

## Reference Resources

For detailed guidance, see:

- **Brand voice examples**: `resources/brand-voice-examples.md`
- **Post templates by track**: `resources/post-templates.md`
- **Core messaging details**: `resources/key-messages.md`

## Scripts and Tools

- `scripts/generate-frontmatter.sh` - Auto-generate post metadata

## Example Post Ideas

**Aviation Track**:
- "The 5-Step Lesson Structure Every CFI Should Use" (teaching methods)
- "How I Became an Airline Pilot: The Complete Timeline" (career path)
- "Teaching Crosswind Landings: A Systematic Approach" (flight training)

**Dev/Startup Track**:
- "Building CFIPros.com While Flying 80 Hours/Month: Month 3 Update" (building in public)
- "The Pre-Deployment Checklist Every Developer Needs" (systematic development)
- "How to Build Your First SaaS While Working Full-Time" (tutorial)

**Cross-Pollination** (HIGHEST VALUE):
- "Code Review Like a Flight Instructor: 5 Principles" (both audiences)
- "Why Developers Should Think Like Pilots" (systematic thinking)
- "Debugging Systematically: Lessons from Aircraft Troubleshooting" (cross-domain)

---

**Remember**: The best content comes from YOUR unique perspective—airline pilot who teaches and codes. Share specific experiences, not generic advice. Make complex topics simple (your teacher superpower). Connect everything back to systematic thinking.
