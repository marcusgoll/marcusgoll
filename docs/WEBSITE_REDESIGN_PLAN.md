# Website Redesign Plan: marcusgoll.com
## Unified Hub Strategy (Option A)

**Version**: 1.0.0
**Date**: 2025-10-20
**Timeline**: 4 weeks
**Strategy**: Transform marcusgoll.com into dual-track personal brand hub

---

## Overview

Transform marcusgoll.com from aviation-only site to unified personal brand hub featuring both Aviation and Dev/Startup content tracks while maintaining existing valuable content.

**Goals**:
1. Reflect Marcus's dual-track positioning (Pilot + Developer)
2. Keep all existing 35 aviation posts (SEO value)
3. Add infrastructure for dev/startup content
4. Rebrand visually (Navy + Emerald, Work Sans)
5. Improve SEO and analytics integration

---

## Visual Rebrand Specifications

### Color Scheme Migration

**Current → New**:
```
Old Accent: #08e28f (Teal) → Emerald #059669
Add Primary: Navy #0F172A
Add Neutrals: Slate grays (#020617, #1E293B, #475569, #E2E8F0, #F8FAFC)
Keep White: #FFFFFF
```

**Color Application**:
```css
/* Primary Navigation & Headers */
background: #0F172A; /* Navy 900 */
color: #FFFFFF;

/* Primary CTA Buttons */
background: #0F172A; /* Navy 900 */
color: #FFFFFF;
hover: #334155; /* Navy 700 */

/* Secondary CTA Buttons & Links */
background: #059669; /* Emerald 600 */
color: #FFFFFF;
hover: #10B981; /* Emerald 500 */

/* Body Text */
color: #1E293B; /* Slate 800 */

/* Page Background */
background: #F8FAFC; /* Slate 50 */

/* Card Backgrounds */
background: #FFFFFF;
border: 1px solid #E2E8F0; /* Slate 200 */

/* Content Track Badges */
Aviation: background #0EA5E9, color #FFFFFF (Sky Blue)
Dev/Startup: background #059669, color #FFFFFF (Emerald)
Cross-Pollination: gradient or both colors
```

### Typography Migration

**Current → New**:
```
Old: 'Figtree', sans-serif
New: 'Work Sans', -apple-system, sans-serif
Code: 'JetBrains Mono', 'Fira Code', monospace
```

**Typography Scale**:
```css
/* Headings */
h1 {
  font-family: 'Work Sans', sans-serif;
  font-size: 48px;      /* 3rem */
  font-weight: 700;      /* Bold */
  line-height: 1.2;
  color: #0F172A;        /* Navy 900 */
}

h2 {
  font-size: 36px;       /* 2.25rem */
  font-weight: 700;
  line-height: 1.3;
  color: #0F172A;
}

h3 {
  font-size: 28px;       /* 1.75rem */
  font-weight: 600;      /* SemiBold */
  line-height: 1.4;
  color: #0F172A;
}

/* Body */
body {
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;       /* 1rem */
  font-weight: 400;
  line-height: 1.7;
  color: #1E293B;        /* Slate 800 */
}

/* Code */
code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;       /* 0.875rem */
  background: #E2E8F0;   /* Slate 200 */
  padding: 2px 6px;
  border-radius: 4px;
}
```

### Import Work Sans Font

Add to HTML `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Site Structure Redesign

### New Navigation

**Top-Level Navigation**:
```
┌────────────────────────────────────────────────────┐
│  Marcus Gollahon    [Home] [Aviation▼] [Dev/Startup▼] [Blog] [About] [Contact]  │
└────────────────────────────────────────────────────┘
```

**Aviation Dropdown**:
- Flight Training
- CFI Resources
- Career Path
- View All Aviation Posts

**Dev/Startup Dropdown**:
- Building in Public
- Systematic Development
- Tutorials
- View All Dev Posts

**Mobile Navigation** (Hamburger):
```
☰ Menu
├── Home
├── Aviation
│   ├── Flight Training
│   ├── CFI Resources
│   ├── Career Path
│   └── All Aviation Posts
├── Dev/Startup
│   ├── Building in Public
│   ├── Systematic Development
│   ├── Tutorials
│   └── All Dev Posts
├── Blog
├── About
└── Contact
```

### URL Structure

**Keep existing aviation URLs** (for SEO):
```
/study-guides/[post-slug]      ← Keep as is
/flight-forms/[post-slug]      ← Keep as is
/checklists/[post-slug]        ← Keep as is
[etc. for all 9 existing categories]
```

**New dev/startup URLs**:
```
/building-in-public/[post-slug]
/tutorials/[post-slug]
/systematic-development/[post-slug]
```

**New pages**:
```
/                              (homepage)
/aviation/                     (aviation hub)
/dev-startup/                  (dev/startup hub)
/blog/                         (all posts, filterable)
/about/                        (Marcus's story)
/contact/                      (contact form)
```

---

## Page-by-Page Redesign

### Homepage (`/`)

**Purpose**: Introduce dual-track brand, showcase both content types, capture email

**Layout**:
```
┌────────────────────────────────────────────┐
│ HEADER: Navigation                         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ HERO SECTION                               │
│                                            │
│ [Photo: Marcus in pilot uniform or split]  │
│                                            │
│ Marcus Gollahon                            │
│ Teaching Systematic Thinking from          │
│ 30,000 Feet                                │
│                                            │
│ Airline pilot who teaches developers       │
│ systematic thinking and helps pilots        │
│ advance their careers.                     │
│                                            │
│ [Button: Explore Aviation] [Button: Explore Dev/Startup] │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ DUAL-TRACK SHOWCASE                        │
│                                            │
│ ┌──────────────┐    ┌──────────────┐     │
│ │   AVIATION   │    │ DEV/STARTUP  │     │
│ │              │    │              │     │
│ │  [Icon: ✈️]  │    │  [Icon: 💻]   │     │
│ │              │    │              │     │
│ │ Flight Training│  │ Building in  │     │
│ │ CFI Resources │   │ Public       │     │
│ │ Career Path   │   │ Systematic   │     │
│ │              │    │ Development  │     │
│ │ [Latest Posts]│   │ [Latest Posts]│    │
│ │              │    │              │     │
│ │ [Explore →]  │    │ [Explore →]  │     │
│ └──────────────┘    └──────────────┘     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ABOUT MARCUS (Brief)                       │
│                                            │
│ Airline pilot | Former teacher & CFI |    │
│ Building CFIPros.com                       │
│                                            │
│ [Read full story →]                        │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ LATEST FROM BLOG                           │
│                                            │
│ [3 most recent posts, mixed tracks]        │
│                                            │
│ [View all posts →]                         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ NEWSLETTER CTA                             │
│                                            │
│ Get systematic thinking insights           │
│                                            │
│ [Email input] [Subscribe]                  │
│                                            │
│ Aviation tips + Dev tutorials. No spam.    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ FOOTER                                     │
└────────────────────────────────────────────┘
```

**Copy for Hero Section**:
```html
<h1>Marcus Gollahon</h1>
<p class="tagline">Teaching Systematic Thinking from 30,000 Feet</p>

<p class="subtitle">
  Airline pilot who teaches developers systematic thinking and
  helps pilots advance their careers.
</p>

<div class="cta-buttons">
  <a href="/aviation" class="btn-primary">Explore Aviation</a>
  <a href="/dev-startup" class="btn-secondary">Explore Dev/Startup</a>
</div>
```

### Aviation Hub Page (`/aviation`)

**Purpose**: Central hub for all aviation content

**Layout**:
```
┌────────────────────────────────────────────┐
│ HERO (Aviation-themed)                     │
│                                            │
│ Aviation Career Guidance & Flight Training │
│                                            │
│ From student pilot to airline captain —    │
│ learn from someone who's walked the path.  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ CONTENT SECTIONS                           │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ Flight Training                 │       │
│ │ Study guides, checklists, tips  │       │
│ │ [5 latest posts]                │       │
│ └─────────────────────────────────┘       │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ CFI Resources                   │       │
│ │ Lesson plans, teaching methods  │       │
│ │ [5 latest posts]                │       │
│ └─────────────────────────────────┘       │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ Career Path                     │       │
│ │ Student pilot → airline pilot   │       │
│ │ [5 latest posts]                │       │
│ └─────────────────────────────────┘       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ FEATURED RESOURCE (Lead Magnet)           │
│                                            │
│ Download: The Pre-Flight CFI Lesson        │
│ Checklist                                  │
│                                            │
│ [Email] [Download Free PDF]               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ALL AVIATION POSTS                         │
│ [Grid of all 35+ posts with filters]      │
└────────────────────────────────────────────┘
```

### Dev/Startup Hub Page (`/dev-startup`)

**Purpose**: Central hub for all dev/startup content

**Layout**:
```
┌────────────────────────────────────────────┐
│ HERO (Dev-themed)                          │
│                                            │
│ Build Startups While Working Full-Time    │
│                                            │
│ Learn systematic development and           │
│ follow my journey building CFIPros.com.   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ CONTENT SECTIONS                           │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ Building in Public              │       │
│ │ CFIPros.com journey, metrics,   │       │
│ │ wins & failures                 │       │
│ │ [Latest updates]                │       │
│ └─────────────────────────────────┘       │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ Systematic Development          │       │
│ │ Aviation-inspired dev practices │       │
│ │ [Latest posts]                  │       │
│ └─────────────────────────────────┘       │
│                                            │
│ ┌─────────────────────────────────┐       │
│ │ Tutorials                       │       │
│ │ React, Node.js, Python          │       │
│ │ [Latest tutorials]              │       │
│ └─────────────────────────────────┘       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ CURRENT PROJECT                            │
│                                            │
│ CFIPros.com - Flight Instructor Directory  │
│ [Screenshot]                               │
│ Tech stack: React, Node.js, Vercel        │
│ [Visit CFIPros.com →]                      │
└────────────────────────────────────────────┘
```

### About Page (`/about`)

**Purpose**: Tell Marcus's full story, build credibility

**Structure**:
```
┌────────────────────────────────────────────┐
│ HERO                                       │
│                                            │
│ [Professional headshot]                    │
│                                            │
│ Hi, I'm Marcus Gollahon                    │
│                                            │
│ Airline pilot, former teacher, developer,  │
│ and startup builder — proving you don't   │
│ have to choose between your passions.     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ THE JOURNEY                                │
│                                            │
│ ┌─ Timeline ─────────────────┐            │
│ │ 10 years: High school      │            │
│ │ science teacher            │            │
│ │ ↓                          │            │
│ │ 2 years: Certified Flight  │            │
│ │ Instructor                 │            │
│ │ ↓                          │            │
│ │ Now: Airline pilot at PSA  │            │
│ │ Airlines + Building        │            │
│ │ startups on the side       │            │
│ └────────────────────────────┘            │
│                                            │
│ [Your full long bio - 200 words]          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ WHAT I DO                                  │
│                                            │
│ ✈️ Aviation Content                        │
│ [Description]                              │
│                                            │
│ 💻 Dev/Startup Content                     │
│ [Description]                              │
│                                            │
│ 🎓 Cross-Pollination                       │
│ [Description]                              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ CURRENT PROJECTS                           │
│                                            │
│ CFIPros.com - Flight instructor directory  │
│ [Brief description + link]                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ CONNECT                                    │
│                                            │
│ [LinkedIn] [Twitter] [GitHub] [Email]     │
└────────────────────────────────────────────┘
```

**Copy for About Page** (use your Long Bio from brand profile):
```
Marcus Gollahon is an airline pilot at PSA Airlines who proves you don't
have to choose between your passions. With a background spanning education,
aviation, and technology, Marcus brings a unique perspective to everything
he builds.

After teaching high school science for 10 years, Marcus transitioned to
aviation, becoming a Certified Flight Instructor for 2 years before joining
PSA Airlines. Throughout his career, he's maintained a passion for development,
working with React, Node.js, Python, and PHP to build web applications and
startups on the side.

Marcus created CFIPros.com, a directory connecting aspiring pilots with
quality flight instructors and flight schools, combining his aviation
expertise with his development skills. He shares this journey publicly,
documenting the challenges and wins of building a startup while working
full-time as an airline pilot.

Through his content, Marcus helps two distinct audiences: pilots seeking
career guidance and better training resources, and developers who want to
build more systematically. He applies lessons from aviation—checklists,
safety culture, systematic thinking—to software development, and shares
teaching methodologies that make complex topics accessible.

When not flying or coding, Marcus is developing lesson plans, study guides,
and educational resources for both aviation and tech communities, leveraging
his decade of teaching experience to help others succeed.
```

### Blog Page (`/blog`)

**Purpose**: Show all content with filtering by track

**Layout**:
```
┌────────────────────────────────────────────┐
│ ALL POSTS                                  │
│                                            │
│ Filter: [All] [Aviation] [Dev/Startup]    │
│        [Cross-Pollination]                 │
│                                            │
│ Search: [___________] [🔍]                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ POST GRID                                  │
│                                            │
│ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │ Post │ │ Post │ │ Post │                │
│ │ [img]│ │ [img]│ │ [img]│                │
│ │ Title│ │ Title│ │ Title│                │
│ │ Badge│ │ Badge│ │ Badge│                │
│ │ Date │ │ Date │ │ Date │                │
│ └──────┘ └──────┘ └──────┘                │
│                                            │
│ [More posts...]                            │
│                                            │
│ [Pagination]                               │
└────────────────────────────────────────────┘
```

**Post Card Template**:
```html
<article class="post-card">
  <img src="[featured-image.jpg]" alt="[Post title]">

  <div class="post-meta">
    <span class="badge badge-aviation">Aviation</span>
    <!-- or -->
    <span class="badge badge-dev">Dev/Startup</span>
    <!-- or -->
    <span class="badge badge-cross">Cross-Pollination</span>

    <span class="date">Oct 20, 2025</span>
    <span class="read-time">5 min read</span>
  </div>

  <h3>[Post Title]</h3>

  <p class="excerpt">[First 150 characters of post...]</p>

  <a href="/[category]/[slug]" class="read-more">Read more →</a>
</article>
```

**Badge Styles**:
```css
.badge-aviation {
  background: #0EA5E9; /* Sky Blue */
  color: #FFFFFF;
}

.badge-dev {
  background: #059669; /* Emerald */
  color: #FFFFFF;
}

.badge-cross {
  background: linear-gradient(to right, #0EA5E9, #059669);
  color: #FFFFFF;
}
```

---

## Content Migration Strategy

### Existing 35 Aviation Posts

**Keep URLs** (for SEO):
- No changes to existing URLs
- All existing posts remain accessible at current URLs

**Add Metadata**:
```markdown
---
title: [existing title]
date: [existing date]
track: aviation          ← ADD THIS
category: flight-training ← ADD THIS (map from existing categories)
tags: [cfi, lesson-plan, ...]
---
```

**Category Mapping**:
```
Old Categories → New Track + Category

Study Guides → Aviation / Flight Training
Flight Forms → Aviation / Flight Training
Checklists → Aviation / Flight Training
Web Tools → Aviation / CFI Resources
Extensions → Aviation / CFI Resources
Advisory Circulars → Aviation / Flight Training
Freebies → Aviation / Flight Training
Flight School → Aviation / Career Path
CFI Lesson Plans → Aviation / CFI Resources
```

**Update Post Template**:
Add track badge at top of each post:
```html
<div class="post-header">
  <span class="badge badge-aviation">Aviation</span>
  <h1>[Post Title]</h1>
  <div class="post-meta">
    <span class="date">[Date]</span>
    <span class="read-time">[X] min read</span>
  </div>
</div>
```

### New Dev/Startup Posts

**URL Structure**:
```
/building-in-public/[slug]     (CFIPros updates, metrics, lessons)
/systematic-development/[slug] (aviation-inspired dev practices)
/tutorials/[slug]              (React, Node.js, Python tutorials)
```

**Post Template** (same as aviation, different badge):
```markdown
---
title: [Post Title]
date: [YYYY-MM-DD]
track: dev-startup
category: building-in-public  (or systematic-development, or tutorials)
tags: [react, startup, buildinpublic, ...]
description: [Meta description for SEO]
---

<Content here>
```

---

## SEO Optimization

### Homepage SEO

**Title Tag**:
```html
<title>Marcus Gollahon | Airline Pilot & Developer | Systematic Thinking from 30,000 Feet</title>
```

**Meta Description**:
```html
<meta name="description" content="Airline pilot who teaches developers systematic thinking and helps pilots advance their careers. Flight training, CFI resources, dev tutorials, and building CFIPros.com in public.">
```

**Schema Markup** (Person + Organization):
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Marcus Gollahon",
  "jobTitle": "Airline Pilot & Developer",
  "url": "https://marcusgoll.com",
  "image": "https://marcusgoll.com/images/marcus-headshot.jpg",
  "sameAs": [
    "https://linkedin.com/in/marcusgollahon",
    "https://twitter.com/marcusgollahon",
    "https://github.com/marcusgollahon"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "PSA Airlines"
  },
  "alumniOf": [
    {
      "@type": "Organization",
      "name": "[Your University]"
    }
  ],
  "knowsAbout": [
    "Flight Instruction",
    "Aviation Career Development",
    "Web Development",
    "React",
    "Node.js",
    "Systematic Thinking",
    "Teaching"
  ],
  "description": "Airline pilot at PSA Airlines who builds startups and teaches systematic thinking."
}
```

### Blog Post SEO Template

**Every post should have**:
```html
<!-- Title Tag (50-60 chars) -->
<title>[Primary Keyword] - Marcus Gollahon</title>

<!-- Meta Description (150-160 chars) -->
<meta name="description" content="[Compelling summary with primary keyword and CTA]">

<!-- Open Graph (for social sharing) -->
<meta property="og:title" content="[Post Title]">
<meta property="og:description" content="[Meta description]">
<meta property="og:image" content="[Featured image URL]">
<meta property="og:url" content="[Post URL]">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@marcusgollahon">
<meta name="twitter:title" content="[Post Title]">
<meta name="twitter:description" content="[Meta description]">
<meta name="twitter:image" content="[Featured image URL]">

<!-- BlogPosting Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title]",
  "description": "[Meta description]",
  "image": "[Featured image URL]",
  "author": {
    "@type": "Person",
    "name": "Marcus Gollahon"
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
</script>
```

---

## Analytics Enhancement

### Google Analytics 4 Setup

**Custom Events to Track**:

1. **Content Track Engagement**:
```javascript
// When user clicks on Aviation section
gtag('event', 'content_track_click', {
  'track': 'aviation',
  'location': 'homepage'
});

// When user clicks on Dev/Startup section
gtag('event', 'content_track_click', {
  'track': 'dev-startup',
  'location': 'homepage'
});
```

2. **Newsletter Signup**:
```javascript
gtag('event', 'newsletter_signup', {
  'location': 'homepage', // or 'blog_post', 'aviation_hub', etc.
  'track': 'both' // or 'aviation', 'dev-startup'
});
```

3. **External Links**:
```javascript
// CFIPros.com clicks
gtag('event', 'external_link_click', {
  'destination': 'cfipros.com',
  'location': 'homepage' // or 'blog_post', 'about', etc.
});
```

4. **Lead Magnet Downloads**:
```javascript
gtag('event', 'lead_magnet_download', {
  'magnet_name': 'CFI Lesson Checklist',
  'track': 'aviation'
});
```

### Custom Dimensions

Create these in GA4:
- `content_track` (aviation, dev-startup, cross-pollination)
- `post_category` (flight-training, cfi-resources, building-in-public, etc.)
- `user_interest` (aviation, dev, both)

---

## Implementation Timeline

### Week 1: Visual Rebrand

**Monday-Tuesday**:
- [ ] Update color scheme (CSS variables)
- [ ] Import Work Sans font
- [ ] Update logo/header text

**Wednesday-Thursday**:
- [ ] Redesign navigation (add Aviation/Dev dropdowns)
- [ ] Update footer
- [ ] Test responsive design

**Friday**:
- [ ] Homepage hero section redesign
- [ ] Test cross-browser compatibility

### Week 2: Structure & Content

**Monday-Tuesday**:
- [ ] Create Aviation hub page
- [ ] Create Dev/Startup hub page
- [ ] Update About page with full story

**Wednesday-Thursday**:
- [ ] Add track badges to existing 35 posts
- [ ] Create blog listing page with filters
- [ ] Set up category/tag system

**Friday**:
- [ ] Write first 3 dev/startup posts
- [ ] Publish and test

### Week 3: SEO & Analytics

**Monday-Tuesday**:
- [ ] Update all meta tags
- [ ] Add Schema markup (Person, BlogPosting)
- [ ] Submit updated sitemap to Search Console

**Wednesday-Thursday**:
- [ ] Set up custom GA4 events
- [ ] Verify Search Console property
- [ ] Create custom dimensions

**Friday**:
- [ ] Run SEO audit (Lighthouse, Screaming Frog)
- [ ] Fix any technical issues
- [ ] Test analytics tracking

### Week 4: Polish & Launch

**Monday-Tuesday**:
- [ ] Create lead magnets (1-page PDF checklists)
- [ ] Set up newsletter forms
- [ ] Add social proof (if available)

**Wednesday-Thursday**:
- [ ] Final content review
- [ ] Cross-browser testing
- [ ] Mobile testing

**Friday**:
- [ ] Launch announcement on LinkedIn/Twitter
- [ ] Monitor analytics
- [ ] Fix any bugs

---

## Component Specifications

### Header Component

```html
<header class="site-header">
  <div class="container">
    <div class="logo">
      <a href="/">
        <h1>Marcus Gollahon</h1>
      </a>
    </div>

    <nav class="main-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li class="has-dropdown">
          <a href="/aviation">Aviation ▼</a>
          <ul class="dropdown">
            <li><a href="/aviation/flight-training">Flight Training</a></li>
            <li><a href="/aviation/cfi-resources">CFI Resources</a></li>
            <li><a href="/aviation/career-path">Career Path</a></li>
            <li><a href="/aviation">All Aviation Posts →</a></li>
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="/dev-startup">Dev/Startup ▼</a>
          <ul class="dropdown">
            <li><a href="/dev-startup/building-in-public">Building in Public</a></li>
            <li><a href="/dev-startup/systematic-development">Systematic Development</a></li>
            <li><a href="/dev-startup/tutorials">Tutorials</a></li>
            <li><a href="/dev-startup">All Dev Posts →</a></li>
          </ul>
        </li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>

    <button class="mobile-menu-toggle" aria-label="Toggle menu">
      ☰
    </button>
  </div>
</header>
```

**Styles**:
```css
.site-header {
  background: #0F172A; /* Navy 900 */
  color: #FFFFFF;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.site-header a {
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.2s;
}

.site-header a:hover {
  color: #10B981; /* Emerald 500 */
}

.dropdown {
  position: absolute;
  background: #1E293B; /* Slate 800 */
  border-radius: 6px;
  padding: 0.5rem 0;
  display: none;
}

.has-dropdown:hover .dropdown {
  display: block;
}
```

### Button Component

```html
<!-- Primary Button -->
<a href="/aviation" class="btn btn-primary">Explore Aviation</a>

<!-- Secondary Button -->
<a href="/dev-startup" class="btn btn-secondary">Explore Dev/Startup</a>

<!-- Outline Button -->
<a href="/contact" class="btn btn-outline">Get in Touch</a>
```

**Styles**:
```css
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background: #0F172A; /* Navy 900 */
  color: #FFFFFF;
}

.btn-primary:hover {
  background: #334155; /* Navy 700 */
}

.btn-secondary {
  background: #059669; /* Emerald 600 */
  color: #FFFFFF;
}

.btn-secondary:hover {
  background: #10B981; /* Emerald 500 */
}

.btn-outline {
  background: transparent;
  color: #0F172A; /* Navy 900 */
  border: 2px solid #0F172A;
}

.btn-outline:hover {
  background: #0F172A;
  color: #FFFFFF;
}
```

### Track Badge Component

```html
<span class="badge badge-aviation">Aviation</span>
<span class="badge badge-dev">Dev/Startup</span>
<span class="badge badge-cross">Cross-Pollination</span>
```

**Styles**:
```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-aviation {
  background: #0EA5E9; /* Sky Blue */
  color: #FFFFFF;
}

.badge-dev {
  background: #059669; /* Emerald 600 */
  color: #FFFFFF;
}

.badge-cross {
  background: linear-gradient(to right, #0EA5E9, #059669);
  color: #FFFFFF;
}
```

---

## Testing Checklist

### Pre-Launch Testing

**Visual**:
- [ ] Colors match brand guide (Navy + Emerald)
- [ ] Fonts are Work Sans
- [ ] Logo/header displays correctly
- [ ] Navigation works on desktop
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Buttons have correct hover states
- [ ] Track badges display correctly

**Functionality**:
- [ ] All links work (no 404s)
- [ ] Dropdowns work on hover
- [ ] Blog filters work correctly
- [ ] Search works (if implemented)
- [ ] Newsletter signup works
- [ ] Contact form works
- [ ] All existing 35 posts still accessible

**Performance**:
- [ ] Lighthouse performance score >90
- [ ] Core Web Vitals in "Good" range
- [ ] Page load time <2 seconds
- [ ] Images optimized and lazy-loaded
- [ ] Fonts load quickly (preconnect configured)

**SEO**:
- [ ] All pages have unique title tags
- [ ] All pages have meta descriptions
- [ ] Schema markup validates (Google Rich Results Test)
- [ ] XML sitemap updated and submitted
- [ ] Robots.txt configured correctly
- [ ] Canonical URLs set

**Cross-Browser**:
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

**Analytics**:
- [ ] GA4 tracking works
- [ ] Custom events fire correctly
- [ ] Search Console connected
- [ ] No tracking errors in console

---

## Post-Launch Tasks

### Week 1 After Launch

- [ ] Monitor analytics daily
- [ ] Check Search Console for errors
- [ ] Fix any bugs reported
- [ ] Publish 2-3 new posts (1 aviation, 1-2 dev)
- [ ] Announce redesign on social media

### Month 1 After Launch

- [ ] Run SEO Manager agent analysis
- [ ] Optimize underperforming pages
- [ ] Publish 10-12 new posts total
- [ ] Build 3-5 internal links between related posts
- [ ] Create first lead magnet
- [ ] Set up welcome email sequence

### Month 3 After Launch

- [ ] Full SEO audit
- [ ] Content performance review
- [ ] Update older posts with new internal links
- [ ] A/B test CTAs and newsletter forms
- [ ] Consider adding comments or community features

---

## Success Metrics

**Track these metrics monthly**:

**Traffic**:
- Total sessions (target: +10% month-over-month)
- Organic search traffic (target: >50% of total)
- New vs. returning visitors

**Engagement**:
- Average session duration (target: >2 minutes)
- Bounce rate (target: <60%)
- Pages per session (target: >2)

**Content Performance**:
- Most viewed aviation posts
- Most viewed dev/startup posts
- Post engagement (time on page, scroll depth)

**Conversions**:
- Newsletter signups (track source: homepage, aviation, dev, blog post)
- Lead magnet downloads
- CFIPros.com clicks

**SEO**:
- Keywords in top 10 positions
- Average position for target keywords
- Pages indexed in Search Console
- Core Web Vitals status

---

## Resources

**Design Assets**:
- Colors: `.spec-flow/memory/VISUAL_BRAND_GUIDE.md`
- Fonts: Work Sans (Google Fonts)
- Copy: `.spec-flow/memory/MARCUS_BRAND_PROFILE.md`

**SEO**:
- SEO Manager agent: `.claude/agents/seo-manager.md`
- Analytics setup: `ANALYTICS_SETUP_GUIDE.md` (next document)

**Content Creation**:
- Content Creator agent: `.claude/agents/content-creator.md`
- Blog template: `.spec-flow/templates/content-templates/blog-post-template.md`

---

**This plan transforms marcusgoll.com into a unified personal brand hub that reflects who Marcus is: pilot, teacher, developer, and startup builder. Follow the timeline, test thoroughly, and launch with confidence.** ✈️💻
