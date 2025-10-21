# Ghost + Next.js Implementation Guide
## Redesigning marcusgoll.com with Your Dual-Track Brand

**Tech Stack**: Ghost (Headless CMS) + Next.js (Frontend)
**Timeline**: 4 weeks
**Strategy**: Option A - Unified Hub

---

## Overview

You're using the perfect stack for this redesign:
- **Ghost CMS**: Handles content, tags, authors (backend)
- **Next.js**: Full control over design, routes, components (frontend)
- **Headless setup**: Ghost Content API feeds Next.js

**What We'll Do**:
1. Configure Ghost tags for dual-track content
2. Rebuild Next.js frontend with new brand (Navy + Emerald, Work Sans)
3. Create new components for dual-track layout
4. Add custom routes for Aviation/Dev hubs
5. Enhance SEO and analytics

---

## Part 1: Ghost CMS Configuration

### Step 1: Create Content Track Tags

In Ghost Admin, create these primary tags:

**Primary Tags** (for content tracks):
1. **Tag**: `aviation`
   - Name: Aviation
   - Slug: `aviation`
   - Description: "Flight training, CFI resources, pilot career content"
   - Color: `#0EA5E9` (Sky Blue)

2. **Tag**: `dev-startup`
   - Name: Dev/Startup
   - Slug: `dev-startup`
   - Description: "Building in public, systematic development, tutorials"
   - Color: `#059669` (Emerald 600)

3. **Tag**: `cross-pollination`
   - Name: Cross-Pollination
   - Slug: `cross-pollination`
   - Description: "Aviation principles applied to development"
   - Color: `#0F172A` (Navy 900)

**Secondary Tags** (for categories within tracks):

**Aviation Categories**:
- `flight-training`
- `cfi-resources`
- `career-path`
- `study-guides`
- `checklists`

**Dev/Startup Categories**:
- `building-in-public`
- `systematic-development`
- `tutorials`
- `react`
- `nodejs`

### Step 2: Tag Existing Posts

**Bulk Tag Your 35 Aviation Posts**:

1. In Ghost Admin, go to **Posts**
2. Select multiple posts (checkbox)
3. Click **Bulk Actions** > **Add tags**
4. Add `aviation` tag to all existing posts
5. Also add specific category tags:
   - Posts about flight training → add `flight-training`
   - Posts about CFI resources → add `cfi-resources`
   - Posts about career → add `career-path`

**Tag Hierarchy**: Use both primary + secondary tags
```
Example post tags:
- "The 5-Step CFI Lesson Structure" → [`aviation`, `cfi-resources`]
- "How to Become an Airline Pilot" → [`aviation`, `career-path`]
```

### Step 3: Update Navigation in Ghost

In Ghost Admin, go to **Settings** > **Navigation**:

**Primary Navigation**:
```
Home          →  /
Aviation      →  /tag/aviation
Dev/Startup   →  /tag/dev-startup
Blog          →  /blog
About         →  /about
Contact       →  /contact
```

**Secondary Navigation** (footer):
```
Flight Training       →  /tag/flight-training
CFI Resources         →  /tag/cfi-resources
Career Path           →  /tag/career-path
Building in Public    →  /tag/building-in-public
Systematic Dev        →  /tag/systematic-development
Tutorials             →  /tag/tutorials
```

### Step 4: Custom Site Settings

**Settings** > **General**:
- **Site title**: Marcus Gollahon
- **Site description**: "Airline pilot who teaches developers systematic thinking and helps pilots advance their careers."
- **Navigation**: (updated above)
- **Meta title**: `{{meta_title}} - Marcus Gollahon`
- **Meta description**: (leave blank to use post excerpts)

**Settings** > **Code Injection**:

Add this to **Site Header**:
```html
<!-- Google Fonts: Work Sans -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Custom CSS Variables -->
<style>
:root {
  /* Colors */
  --navy-900: #0F172A;
  --navy-700: #334155;
  --emerald-600: #059669;
  --emerald-500: #10B981;
  --slate-950: #020617;
  --slate-800: #1E293B;
  --slate-600: #475569;
  --slate-200: #E2E8F0;
  --slate-50: #F8FAFC;

  /* Typography */
  --font-primary: 'Work Sans', -apple-system, sans-serif;
  --font-code: 'JetBrains Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-primary);
}
</style>
```

---

## Part 2: Next.js Project Structure

### Recommended File Structure

```
your-nextjs-app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              ← New navigation
│   │   ├── Footer.tsx              ← Update with new colors
│   │   └── Layout.tsx              ← Wrapper component
│   ├── home/
│   │   ├── Hero.tsx                ← Dual-track hero
│   │   ├── DualTrackShowcase.tsx   ← Aviation + Dev sections
│   │   └── NewsletterCTA.tsx       ← Newsletter signup
│   ├── blog/
│   │   ├── PostCard.tsx            ← Updated with track badges
│   │   ├── TrackBadge.tsx          ← New badge component
│   │   └── PostGrid.tsx            ← Grid layout
│   ├── ui/
│   │   ├── Button.tsx              ← Primary, Secondary, Outline
│   │   └── Container.tsx           ← Max-width wrapper
│   └── shared/
│       └── SEO.tsx                 ← Meta tags component
├── pages/
│   ├── index.tsx                   ← Homepage (dual-track)
│   ├── aviation.tsx                ← NEW: Aviation hub
│   ├── dev-startup.tsx             ← NEW: Dev/Startup hub
│   ├── blog/
│   │   └── [slug].tsx              ← Blog post template
│   ├── tag/
│   │   └── [slug].tsx              ← Tag archive pages
│   ├── about.tsx                   ← About page
│   └── contact.tsx                 ← Contact page
├── styles/
│   ├── globals.css                 ← Update with new colors
│   └── variables.css               ← Color/font variables
├── lib/
│   ├── ghost.ts                    ← Ghost API client
│   └── analytics.ts                ← NEW: Custom event tracking
└── public/
    └── images/
        └── marcus-headshot.jpg     ← Professional photo
```

---

## Part 3: Component Code Examples

### 1. Update Global Styles (`styles/globals.css`)

```css
/* Import Work Sans */
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');

/* CSS Variables */
:root {
  /* Colors */
  --navy-900: #0F172A;
  --navy-700: #334155;
  --navy-500: #64748B;
  --emerald-600: #059669;
  --emerald-500: #10B981;
  --emerald-400: #34D399;
  --slate-950: #020617;
  --slate-800: #1E293B;
  --slate-600: #475569;
  --slate-200: #E2E8F0;
  --slate-50: #F8FAFC;
  --white: #FFFFFF;

  /* Accent colors for content tracks */
  --sky-blue: #0EA5E9;
  --orange: #F97316;

  /* Typography */
  --font-primary: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-code: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  /* Spacing (8px base) */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base styles */
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--slate-800);
  background: var(--slate-50);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  color: var(--navy-900);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
}

h1 {
  font-size: 3rem;        /* 48px */
}

h2 {
  font-size: 2.25rem;     /* 36px */
  line-height: 1.3;
}

h3 {
  font-size: 1.75rem;     /* 28px */
  font-weight: 600;
  line-height: 1.4;
}

h4 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;
  line-height: 1.5;
}

p {
  margin-bottom: var(--spacing-md);
}

a {
  color: var(--emerald-600);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--emerald-500);
}

/* Code */
code {
  font-family: var(--font-code);
  font-size: 0.875rem;
  background: var(--slate-200);
  padding: 2px 6px;
  border-radius: 4px;
}

pre code {
  display: block;
  background: var(--slate-900);
  color: var(--slate-100);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

/* Responsive typography */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;      /* 32px on mobile */
  }

  h2 {
    font-size: 1.75rem;   /* 28px on mobile */
  }

  h3 {
    font-size: 1.5rem;    /* 24px on mobile */
  }
}
```

### 2. Header Component (`components/layout/Header.tsx`)

```tsx
import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <h1>Marcus Gollahon</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/">Home</Link>
            </li>

            <li className={styles.hasDropdown}>
              <Link href="/aviation">
                Aviation <span>▼</span>
              </Link>
              <ul className={styles.dropdown}>
                <li><Link href="/tag/flight-training">Flight Training</Link></li>
                <li><Link href="/tag/cfi-resources">CFI Resources</Link></li>
                <li><Link href="/tag/career-path">Career Path</Link></li>
                <li><Link href="/tag/aviation">All Aviation Posts →</Link></li>
              </ul>
            </li>

            <li className={styles.hasDropdown}>
              <Link href="/dev-startup">
                Dev/Startup <span>▼</span>
              </Link>
              <ul className={styles.dropdown}>
                <li><Link href="/tag/building-in-public">Building in Public</Link></li>
                <li><Link href="/tag/systematic-development">Systematic Development</Link></li>
                <li><Link href="/tag/tutorials">Tutorials</Link></li>
                <li><Link href="/tag/dev-startup">All Dev Posts →</Link></li>
              </ul>
            </li>

            <li>
              <Link href="/blog">Blog</Link>
            </li>

            <li>
              <Link href="/about">About</Link>
            </li>

            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul>
            <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link href="/aviation" onClick={() => setMobileMenuOpen(false)}>Aviation</Link></li>
            <li><Link href="/dev-startup" onClick={() => setMobileMenuOpen(false)}>Dev/Startup</Link></li>
            <li><Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
            <li><Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
            <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
```

**Header Styles** (`components/layout/Header.module.css`):

```css
.header {
  background: var(--navy-900);
  color: var(--white);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  margin: 0;
}

.logo a {
  color: var(--white);
  text-decoration: none;
}

.nav {
  display: none;
}

@media (min-width: 768px) {
  .nav {
    display: block;
  }
}

.navList {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
  margin: 0;
  padding: 0;
}

.navList a {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.navList a:hover {
  color: var(--emerald-400);
}

.hasDropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--slate-800);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) 0;
  list-style: none;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.hasDropdown:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown li {
  padding: 0;
}

.dropdown a {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  white-space: nowrap;
}

.dropdown a:hover {
  background: var(--navy-700);
}

.mobileMenuToggle {
  display: block;
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .mobileMenuToggle {
    display: none;
  }
}

.mobileMenu {
  background: var(--slate-800);
  padding: var(--spacing-md);
}

.mobileMenu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobileMenu li {
  padding: var(--spacing-sm) 0;
}

.mobileMenu a {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: var(--spacing-sm);
}

.mobileMenu a:hover {
  color: var(--emerald-400);
}
```

### 3. Track Badge Component (`components/blog/TrackBadge.tsx`)

```tsx
import styles from './TrackBadge.module.css';

interface TrackBadgeProps {
  track: 'aviation' | 'dev-startup' | 'cross-pollination';
}

export default function TrackBadge({ track }: TrackBadgeProps) {
  const labels = {
    'aviation': 'Aviation',
    'dev-startup': 'Dev/Startup',
    'cross-pollination': 'Cross-Pollination'
  };

  return (
    <span className={`${styles.badge} ${styles[track]}`}>
      {labels[track]}
    </span>
  );
}
```

**Badge Styles** (`components/blog/TrackBadge.module.css`):

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--white);
}

.aviation {
  background: var(--sky-blue);
}

.devStartup {
  background: var(--emerald-600);
}

.crossPollination {
  background: linear-gradient(to right, var(--sky-blue), var(--emerald-600));
}
```

### 4. Button Component (`components/ui/Button.tsx`)

```tsx
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  href,
  variant = 'primary',
  children,
  onClick
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
```

**Button Styles** (`components/ui/Button.module.css`):

```css
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.primary {
  background: var(--navy-900);
  color: var(--white);
}

.primary:hover {
  background: var(--navy-700);
}

.secondary {
  background: var(--emerald-600);
  color: var(--white);
}

.secondary:hover {
  background: var(--emerald-500);
}

.outline {
  background: transparent;
  color: var(--navy-900);
  border: 2px solid var(--navy-900);
}

.outline:hover {
  background: var(--navy-900);
  color: var(--white);
}
```

### 5. Homepage Hero (`components/home/Hero.tsx`)

```tsx
import Button from '../ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Marcus Gollahon</h1>
          <p className={styles.tagline}>
            Teaching Systematic Thinking from 30,000 Feet
          </p>
          <p className={styles.subtitle}>
            Airline pilot who teaches developers systematic thinking and
            helps pilots advance their careers.
          </p>
          <div className={styles.cta}>
            <Button href="/aviation" variant="primary">
              Explore Aviation
            </Button>
            <Button href="/dev-startup" variant="secondary">
              Explore Dev/Startup
            </Button>
          </div>
        </div>
        <div className={styles.image}>
          <img
            src="/images/marcus-headshot.jpg"
            alt="Marcus Gollahon"
          />
        </div>
      </div>
    </section>
  );
}
```

**Hero Styles** (`components/home/Hero.module.css`):

```css
.hero {
  background: linear-gradient(135deg, var(--navy-900) 0%, var(--slate-800) 100%);
  color: var(--white);
  padding: var(--spacing-3xl) 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 2fr 1fr;
  }
}

.content h1 {
  font-size: 3.5rem;
  color: var(--white);
  margin-bottom: var(--spacing-md);
}

.tagline {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--emerald-400);
  margin-bottom: var(--spacing-lg);
}

.subtitle {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--slate-200);
  margin-bottom: var(--spacing-xl);
}

.cta {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.image {
  display: flex;
  justify-content: center;
}

.image img {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--emerald-600);
}

@media (max-width: 640px) {
  .content h1 {
    font-size: 2.5rem;
  }

  .tagline {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .image img {
    width: 200px;
    height: 200px;
  }
}
```

---

## Part 4: Ghost API Integration

### Fetch Posts by Tag

```typescript
// lib/ghost.ts
import GhostContentAPI from '@tryghost/content-api';

// Initialize Ghost API
const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || 'https://your-ghost-site.com',
  key: process.env.GHOST_CONTENT_API_KEY || '',
  version: 'v5.0'
});

// Fetch posts by tag
export async function getPostsByTag(tagSlug: string, limit: number = 10) {
  return await api.posts.browse({
    filter: `tag:${tagSlug}`,
    include: 'tags,authors',
    limit: limit
  });
}

// Fetch aviation posts
export async function getAviationPosts(limit: number = 10) {
  return await getPostsByTag('aviation', limit);
}

// Fetch dev/startup posts
export async function getDevStartupPosts(limit: number = 10) {
  return await getPostsByTag('dev-startup', limit);
}

// Fetch all posts
export async function getAllPosts(limit: number = 50) {
  return await api.posts.browse({
    include: 'tags,authors',
    limit: limit
  });
}

// Fetch single post
export async function getPostBySlug(slug: string) {
  return await api.posts.read({
    slug: slug
  }, {
    include: 'tags,authors'
  });
}

// Helper: Determine primary track from tags
export function getPrimaryTrack(tags: any[]) {
  if (tags.find(tag => tag.slug === 'aviation')) return 'aviation';
  if (tags.find(tag => tag.slug === 'dev-startup')) return 'dev-startup';
  if (tags.find(tag => tag.slug === 'cross-pollination')) return 'cross-pollination';
  return null;
}
```

### Use in Page (`pages/aviation.tsx`)

```tsx
import { GetStaticProps } from 'next';
import { getAviationPosts } from '../lib/ghost';
import PostCard from '../components/blog/PostCard';
import styles from '../styles/AviationHub.module.css';

export default function AviationHub({ posts }) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Aviation Career Guidance & Flight Training</h1>
          <p>
            From student pilot to airline captain — learn from someone
            who's walked the path.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <h2>Flight Training</h2>
          <p>Study guides, checklists, and tips for student pilots</p>
          <div className={styles.postGrid}>
            {posts.flightTraining.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <h2>CFI Resources</h2>
          <p>Lesson plans and teaching methods for flight instructors</p>
          <div className={styles.postGrid}>
            {posts.cfiResources.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <h2>Career Path</h2>
          <p>Navigate the journey from student pilot to airline pilot</p>
          <div className={styles.postGrid}>
            {posts.careerPath.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAviationPosts(50);

  // Filter by secondary tags
  const posts = {
    flightTraining: allPosts.filter(post =>
      post.tags.some(tag => tag.slug === 'flight-training')
    ).slice(0, 5),
    cfiResources: allPosts.filter(post =>
      post.tags.some(tag => tag.slug === 'cfi-resources')
    ).slice(0, 5),
    careerPath: allPosts.filter(post =>
      post.tags.some(tag => tag.slug === 'career-path')
    ).slice(0, 5),
  };

  return {
    props: { posts },
    revalidate: 60 // Re-generate page every 60 seconds
  };
};
```

---

## Part 5: Analytics Integration

### Custom Event Tracking (`lib/analytics.ts`)

```typescript
// lib/analytics.ts

// Track content track engagement
export function trackContentTrackClick(track: 'aviation' | 'dev-startup', location: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'content_track_click', {
      track: track,
      location: location
    });
  }
}

// Track newsletter signup
export function trackNewsletterSignup(location: string, track: string = 'both') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'newsletter_signup', {
      location: location,
      track: track
    });
  }
}

// Track external link clicks (CFIPros.com)
export function trackExternalLinkClick(destination: string, location: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'external_link_click', {
      destination: destination,
      location: location
    });
  }
}

// Track lead magnet downloads
export function trackLeadMagnetDownload(magnetName: string, track: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'lead_magnet_download', {
      magnet_name: magnetName,
      track: track
    });
  }
}

// Track page views with content track
export function trackPageView(path: string, track?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: path,
      track: track || 'general'
    });
  }
}
```

### Use in Components

```tsx
import { trackContentTrackClick } from '../../lib/analytics';
import Button from '../ui/Button';

export default function DualTrackShowcase() {
  return (
    <section>
      <Button
        href="/aviation"
        onClick={() => trackContentTrackClick('aviation', 'homepage')}
      >
        Explore Aviation
      </Button>

      <Button
        href="/dev-startup"
        onClick={() => trackContentTrackClick('dev-startup', 'homepage')}
      >
        Explore Dev/Startup
      </Button>
    </section>
  );
}
```

---

## Part 6: Week-by-Week Implementation

### Week 1: Foundation & Visual Rebrand

**Monday-Tuesday** (6-8 hours):
- [ ] Update `globals.css` with new colors and fonts
- [ ] Create CSS variables file
- [ ] Update Header component with new design
- [ ] Update Footer component
- [ ] Test responsive design

**Wednesday-Thursday** (6-8 hours):
- [ ] Create Button component (Primary, Secondary, Outline)
- [ ] Create TrackBadge component
- [ ] Create Container/Layout components
- [ ] Update existing components to use new colors

**Friday** (4-6 hours):
- [ ] Test cross-browser compatibility
- [ ] Fix any styling issues
- [ ] Deploy to staging/preview

### Week 2: Ghost Configuration & Content Structure

**Monday-Tuesday** (4-6 hours):
- [ ] Create tags in Ghost Admin (`aviation`, `dev-startup`, etc.)
- [ ] Tag all existing 35 posts with `aviation` + category tags
- [ ] Update Ghost navigation
- [ ] Update Ghost site settings

**Wednesday-Thursday** (6-8 hours):
- [ ] Write first 3 dev/startup posts in Ghost
- [ ] Tag them with `dev-startup` + category tags
- [ ] Update post template in Next.js to show track badges
- [ ] Test Ghost API queries

**Friday** (4-6 hours):
- [ ] Create Aviation hub page (`pages/aviation.tsx`)
- [ ] Create Dev/Startup hub page (`pages/dev-startup.tsx`)
- [ ] Test data fetching from Ghost

### Week 3: Homepage & Key Pages

**Monday-Tuesday** (6-8 hours):
- [ ] Redesign homepage with dual-track hero
- [ ] Create DualTrackShowcase component
- [ ] Add latest posts from both tracks
- [ ] Add newsletter CTA

**Wednesday-Thursday** (6-8 hours):
- [ ] Update About page with full story (use your Long Bio)
- [ ] Create Contact page
- [ ] Update Blog listing page with track filters
- [ ] Test all routes

**Friday** (4-6 hours):
- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Test mobile responsive design

### Week 4: SEO, Analytics & Launch

**Monday-Tuesday** (4-6 hours):
- [ ] Add meta tags to all pages
- [ ] Add Schema markup (Person, BlogPosting)
- [ ] Update sitemap generation
- [ ] Submit to Search Console

**Wednesday-Thursday** (6-8 hours):
- [ ] Implement custom analytics events
- [ ] Create `lib/analytics.ts` with tracking functions
- [ ] Add event tracking to buttons and links
- [ ] Test analytics in GA4 Realtime

**Friday** (4-6 hours):
- [ ] Final testing (cross-browser, mobile, performance)
- [ ] Fix any bugs
- [ ] Deploy to production
- [ ] Announce redesign on LinkedIn/Twitter

---

## Part 7: Environment Variables

### Add to `.env.local`

```bash
# Ghost API
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your_content_api_key_here

# Google Analytics
NEXT_PUBLIC_GA_ID=G-SE02S59BZW

# Site URL
NEXT_PUBLIC_SITE_URL=https://marcusgoll.com
```

---

## Part 8: Deployment Checklist

### Before Deploy

- [ ] All tests pass
- [ ] Lighthouse score >90 (all categories)
- [ ] No console errors
- [ ] Ghost API connection works
- [ ] Analytics tracking verified
- [ ] All routes working
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Deploy to Production

```bash
# Build and test locally
npm run build
npm run start

# If using Vercel (recommended)
vercel --prod

# Update environment variables in Vercel dashboard
```

### Post-Deploy

- [ ] Verify site loads at marcusgoll.com
- [ ] Check Ghost content appears
- [ ] Test analytics events fire
- [ ] Submit updated sitemap to Search Console
- [ ] Monitor for 404s or errors

---

## Part 9: Maintenance & Updates

### Adding New Posts

1. Write post in Ghost Admin
2. Add primary tag: `aviation` or `dev-startup`
3. Add category tags (e.g., `flight-training`, `building-in-public`)
4. Publish
5. Next.js will auto-fetch on next rebuild (or use ISR)

### Updating Content

Ghost changes auto-appear in Next.js via:
- **ISR** (Incremental Static Regeneration): Pages rebuild every X seconds
- **On-demand**: Trigger rebuild via webhook

---

## Resources

**Ghost Documentation**:
- [Ghost Content API](https://ghost.org/docs/content-api/)
- [Ghost Content API npm package](https://www.npmjs.com/package/@tryghost/content-api)

**Next.js Documentation**:
- [Next.js Pages](https://nextjs.org/docs/basic-features/pages)
- [Next.js Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

**Your Brand Files**:
- Colors/Fonts: `VISUAL_BRAND_GUIDE.md`
- Copy: `MARCUS_BRAND_PROFILE.md`
- Full plan: `WEBSITE_REDESIGN_PLAN.md`

---

**You have everything you need to rebuild marcusgoll.com with your dual-track brand. Start with Week 1 (visual rebrand), test thoroughly, and deploy when ready. Your Ghost + Next.js stack gives you full control and flexibility.** 🚀✈️💻
