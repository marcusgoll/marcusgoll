# Visual References: Homepage Redesign

## Overview

This document captures UI/UX research, design patterns, and visual inspiration for the homepage redesign. All references inform implementation decisions and ensure brand consistency.

## Brand Identity Reference

### Color Palette (Navy Background Palette)

**Primary Colors**:
- Navy 900 `#0F172A` - Primary backgrounds, headers, CTAs
- Emerald 600 `#059669` - Secondary CTAs, links, active states
- Slate 800 `#1E293B` - Body text, secondary elements

**Accent Colors**:
- Sky Blue `#0EA5E9` - Aviation content highlights
- Orange `#F97316` - Dev/Startup content highlights

**Neutral Scale**:
- Slate 950 `#020617` - Near black text
- Slate 600 `#475569` - Tertiary text, muted elements
- Slate 200 `#E2E8F0` - Borders, dividers
- Slate 50 `#F8FAFC` - Light backgrounds
- White `#FFFFFF` - Card backgrounds

**Source**: `docs/VISUAL_BRAND_GUIDE.md`

### Typography

**Fonts**:
- **Primary**: Work Sans (400, 500, 600, 700) - Headings, body, UI
- **Code**: JetBrains Mono (400, 500) - Code blocks only

**Type Scale**:
- H1: 48px (3rem), Weight 700, Navy 900
- H2: 36px (2.25rem), Weight 700, Navy 900
- H3: 28px (1.75rem), Weight 600, Navy 900
- H4: 20px (1.25rem), Weight 600, Navy 900
- Body: 16px (1rem), Weight 400, Slate 800, Line height 1.7
- Small: 14px (0.875rem), Weight 400, Slate 600

**Responsive Typography** (Mobile):
- H1: 32px → 40px
- H2: 28px → 32px
- H3: 24px → 28px
- Body: 16px (same)

**Source**: `docs/VISUAL_BRAND_GUIDE.md`

### Spacing & Layout

**Spacing Scale** (8px base):
- XS: 4px (0.25rem)
- SM: 8px (0.5rem)
- MD: 16px (1rem) ← Most common
- LG: 24px (1.5rem)
- XL: 32px (2rem)
- 2XL: 48px (3rem)
- 3XL: 64px (4rem)

**Layout Constraints**:
- Container Max Width: 1280px (80rem)
- Content Max Width: 768px (48rem) for blog posts
- Gutter: 24px (1.5rem) mobile, 32px (2rem) desktop

**Border Radius**:
- Small (buttons, tags): 6px
- Medium (cards): 8px
- Large (images, modals): 12px

**Source**: `docs/VISUAL_BRAND_GUIDE.md`

## Design Patterns

### Hero Section

**Pattern**: Above-the-fold value proposition with clear hierarchy

**Key Elements**:
- Headline (H1): Value proposition ("Teaching systematic thinking from 30,000 feet")
- Tagline: Dual expertise statement ("Aviation career guidance + software development insights")
- Primary CTA: Newsletter signup or "Read Latest"
- Background: Navy 900 with subtle texture or gradient
- Optional: Headshot or brand graphic (right side or background)

**Layout**:
```
┌────────────────────────────────────┐
│  [Headline - H1, White]            │
│  [Tagline - Body, Slate 300]       │
│  [Primary CTA Button]              │
│                        [Visual]     │
└────────────────────────────────────┘
```

**Responsive Behavior**:
- Mobile: Single column, center-aligned, visual below text
- Desktop: Text left, visual right (or background)

**Accessibility**:
- Headline color: White on Navy 900 (contrast ratio ~16:1, exceeds WCAG AAA)
- CTA button: Min 44x44px tap target
- Focus states: Visible outline

**Similar Patterns**: Most SaaS homepages (Stripe, Vercel, Linear) use hero with value prop + CTA

**Source**: Industry best practices, `docs/VISUAL_BRAND_GUIDE.md`

### Content Track Filtering

**Pattern**: Filter bar or sidebar with category buttons and post counts

**Key Elements**:
- Filter buttons: "All", "Aviation", "Dev/Startup"
- Post counts: "(12)" next to each filter
- Active state: Emerald 600 background, white text
- Default state: Transparent background, Slate 800 text
- Hover state: Slate 100 background

**Layout Options**:
1. **Horizontal Filter Bar** (Mobile-first):
   ```
   [ All (24) ] [ Aviation (12) ] [ Dev/Startup (12) ]
   ```
   - Sticky at top on scroll
   - Horizontal scroll on small screens

2. **Sidebar Filter** (Desktop):
   ```
   ┌─────────┬──────────────────┐
   │ All     │  [Post Grid]     │
   │ (24)    │                  │
   │         │                  │
   │ Aviation│                  │
   │ (12)    │                  │
   │         │                  │
   │ Dev/    │                  │
   │ Startup │                  │
   │ (12)    │                  │
   └─────────┴──────────────────┘
   ```

**Interaction**:
- Click filter → update visible posts (client-side, no reload)
- Update URL param (?filter=aviation) for shareability
- Smooth fade transition between filter states

**Accessibility**:
- Radio button group semantics (aria-role="radiogroup")
- Keyboard navigation (arrow keys)
- Clear focus states

**Similar Patterns**: Product filters (e-commerce), blog category filters (Medium, Dev.to sidebar)

**Source**: Current homepage implementation (M2 layout), industry best practices

### Featured Posts Section

**Pattern**: Larger card treatment for 1-3 curated posts

**Key Elements**:
- Section heading: "Featured" (H2)
- Large post cards (2x height of regular cards)
- Feature image: Prominent (aspect ratio 16:9 or 2:1)
- Title (H3), Excerpt, Metadata (date, track tag, read time)
- CTA: "Read Article" or card click → post page

**Layout**:
```
Featured
┌─────────────────┬─────────────────┐
│                 │                 │
│  [Image]        │  [Image]        │
│                 │                 │
│  Title          │  Title          │
│  Excerpt        │  Excerpt        │
│  [Tag] Date     │  [Tag] Date     │
└─────────────────┴─────────────────┘
```

**Responsive Behavior**:
- Mobile: 1 column (featured post stacked)
- Tablet: 2 columns (if 2 featured posts)
- Desktop: 2-3 columns depending on count

**Visual Distinction**:
- Subtle background color (Slate 50)
- Larger font sizes (Title: H3 instead of H4)
- Larger images

**Accessibility**:
- Semantic article elements
- Alt text for images
- Clear heading hierarchy

**Similar Patterns**: News sites (NYTimes homepage), blog platforms (Medium homepage)

**Source**: Current implementation pattern, design best practices

### Recent Posts Grid

**Pattern**: Responsive grid of post cards

**Key Elements**:
- Section heading: "Recent Posts" (H2)
- Post cards: Thumbnail, Title (H4), Excerpt, Metadata
- Grid layout: 1 col mobile, 2 tablet, 3 desktop
- Lazy load images below fold

**Card Structure**:
```
┌─────────────┐
│ [Image]     │
├─────────────┤
│ Title       │
│ Excerpt...  │
│ [Tag] Date  │
└─────────────┘
```

**Card Styling**:
- Background: White
- Border: 1px Slate 200
- Border radius: 8px (medium)
- Shadow: subtle on hover
- Padding: 16px (MD)

**Responsive Breakpoints**:
- <768px: 1 column, full width
- 768px-1024px: 2 columns, 16px gap
- >1024px: 3 columns, 24px gap

**Hover States**:
- Subtle scale transform (1.02x)
- Shadow increase
- Title color → Emerald 600

**Accessibility**:
- Semantic article elements
- Alt text for thumbnails
- Min 44x44px tap targets for mobile

**Similar Patterns**: Blog homepages (Dev.to, Medium), content aggregators

**Source**: Current M2 implementation, industry standards

### Project Card ("What I'm building")

**Pattern**: Highlight card for current startup project

**Key Elements**:
- Section heading: "What I'm building" (H2)
- Project name: "CFIPros.com" (H3)
- Tagline: "Connect aspiring pilots with quality flight instructors"
- Status badge: "Active" (green background, white text)
- CTA button: "Visit Project" or "Read Build Log"
- Optional: Project logo or screenshot

**Layout**:
```
What I'm building
┌───────────────────────────────────┐
│  CFIPros.com          [Active]     │
│                                    │
│  Connect aspiring pilots with      │
│  quality flight instructors        │
│                                    │
│  [Visit Project] [Read Build Log]  │
└───────────────────────────────────┘
```

**Styling**:
- Background: Emerald 50 (subtle green tint)
- Border: 2px Emerald 600
- Border radius: 8px
- Padding: 24px (LG)

**Status Badge**:
- Background: Emerald 600
- Text: White
- Padding: 4px 12px
- Border radius: 6px (small)

**Responsive Behavior**:
- Mobile: Full width, stacked CTAs
- Desktop: Max width 600px, centered or left-aligned

**Accessibility**:
- Clear heading hierarchy
- Descriptive link text
- Status badge role="status" with aria-label

**Similar Patterns**: Personal portfolio "Current Work" sections, build-in-public updates

**Source**: Brand strategy (building in public), portfolio site patterns

### Newsletter CTA

**Pattern**: Inline signup form with clear value proposition

**Key Elements**:
- Heading: "Stay Updated" or "Get Systematic Thinking Insights" (H3)
- Value prop: Brief description of newsletter content
- Email input field
- Submit button: "Subscribe"
- Success/error feedback messages
- Privacy policy link (GDPR compliance)

**Layout Options**:
1. **Hero Section** (Inline):
   ```
   Get systematic thinking insights delivered weekly
   [Email input]  [Subscribe Button]
   Privacy policy. Unsubscribe anytime.
   ```

2. **Sticky Sidebar** (Desktop):
   ```
   ┌─────────────────┐
   │ Stay Updated    │
   │                 │
   │ [Email input]   │
   │ [Subscribe]     │
   │                 │
   │ Privacy policy  │
   └─────────────────┘
   ```

**Form Styling**:
- Email input: Slate 200 border, Navy 900 border on focus
- Submit button: Emerald 600 background, white text
- Input padding: 12px (MD)
- Button: 12px 24px padding, min 44px height

**States**:
- Default: Input empty, button enabled
- Loading: Button shows spinner, disabled
- Success: Green checkmark, "Subscribed!" message
- Error: Red border on input, error message below

**Accessibility**:
- Label for email input (visible or aria-label)
- Error messages announced to screen readers
- Focus management (focus input on page load or error)

**Validation**:
- Client-side: Email format validation
- Server-side: Email exists check, duplicate check
- Clear error messages ("Please enter a valid email address")

**Similar Patterns**: Newsletter signup forms (ConvertKit, Substack, Medium)

**Source**: Email marketing best practices, existing newsletter integration

### Mobile Navigation Menu

**Pattern**: Slide-out or overlay menu with filters and navigation

**Key Elements**:
- Hamburger icon: 24x24px, Navy 900, top right header
- Menu overlay: Full screen or slide from right
- Close button: X icon, keyboard Esc support
- Navigation links: Home, Blog, About, Contact
- Content filters: Aviation, Dev/Startup (inline in menu)
- Newsletter signup (optional, bottom of menu)

**Layout**:
```
┌─────────────────┐
│        [X]      │
│                 │
│  Home           │
│  Blog           │
│  About          │
│  Contact        │
│                 │
│  Filter by:     │
│  [ Aviation ]   │
│  [ Dev/Startup ]│
│                 │
│  [Newsletter]   │
└─────────────────┘
```

**Animation**:
- Slide in from right (250ms ease-out)
- Backdrop fade in (150ms)
- Slide out on close (200ms ease-in)

**Behavior**:
- Open: Hamburger click, focus trap activated
- Close: X button, Esc key, backdrop click
- On filter selection: Close menu, apply filter

**Accessibility**:
- aria-expanded on hamburger button
- Focus trap when open (Tab cycles within menu)
- Focus restoration (return focus to hamburger on close)
- Screen reader announcement ("Menu opened", "Menu closed")

**Similar Patterns**: Mobile menus (most responsive sites), off-canvas navigation

**Source**: Mobile UX best practices, existing implementation patterns

## Layout Wireframes

### Desktop Layout (>1024px)

```
┌────────────────────────────────────────────────────────┐
│  Header (Logo, Nav Links, Newsletter CTA)              │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│                                                         │
│  Hero Section                                           │
│  (Headline, Tagline, CTA, Visual)                       │
│                                                         │
└────────────────────────────────────────────────────────┘
┌─────────┬──────────────────────────────────────────────┐
│ Filters │  Featured Posts                              │
│ Sidebar │  (2-3 large cards)                           │
│         ├──────────────────────────────────────────────┤
│ All     │  Recent Posts Grid                           │
│ (24)    │  (3 columns)                                 │
│         │                                              │
│ Aviation│  [Card] [Card] [Card]                        │
│ (12)    │  [Card] [Card] [Card]                        │
│         │  [Card] [Card] [Card]                        │
│ Dev/    │                                              │
│ Startup ├──────────────────────────────────────────────┤
│ (12)    │  What I'm Building                           │
│         │  (Project Card)                              │
│         │                                              │
│ [News-  │                                              │
│  letter]│                                              │
└─────────┴──────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  Footer (Links, Social, Copyright)                     │
└────────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌──────────────────────┐
│  Header              │
│  [Logo]    [☰]       │
└──────────────────────┘
┌──────────────────────┐
│                      │
│  Hero Section        │
│  (Stacked)           │
│                      │
└──────────────────────┘
┌──────────────────────┐
│  Filter Bar          │
│  [All] [Aviation]... │
└──────────────────────┘
┌──────────────────────┐
│  Featured Post       │
│  (Full width card)   │
└──────────────────────┘
┌──────────────────────┐
│  Recent Posts        │
│  (1 column)          │
│                      │
│  [Card]              │
│  [Card]              │
│  [Card]              │
└──────────────────────┘
┌──────────────────────┐
│  What I'm Building   │
│  (Project Card)      │
└──────────────────────┘
┌──────────────────────┐
│  Newsletter Signup   │
└──────────────────────┘
┌──────────────────────┐
│  Footer              │
└──────────────────────┘
```

## Interaction Patterns

### Filter Interaction Flow

```
User clicks "Aviation" filter
  ↓
1. Update active state (visual feedback)
2. Filter posts array (client-side)
3. Update URL param (?filter=aviation)
4. Fade out non-aviation posts (150ms)
5. Fade in aviation posts (150ms)
6. Track analytics event (homepage.filter_click)
```

### Newsletter Signup Flow

```
User enters email + clicks Subscribe
  ↓
1. Client-side email validation
2. Show loading state on button
3. POST to newsletter API endpoint
4. Success: Show success message, hide form
5. Error: Show error message, keep form visible
6. Track analytics event (homepage.newsletter_signup)
```

### Post Card Interaction

```
User hovers post card (desktop)
  ↓
1. Scale transform (1.02x, 200ms ease-out)
2. Shadow increase (subtle)
3. Title color → Emerald 600

User clicks post card
  ↓
1. Track analytics event (homepage.post_click)
2. Navigate to blog post page
```

## Performance Optimization Notes

### Image Optimization

**Hero Section**:
- Format: WebP with JPG fallback
- Size: 1920x1080px max (16:9 aspect)
- Compression: 80-85% quality
- Lazy load: No (above fold, critical)
- Responsive: Serve different sizes via srcset

**Post Thumbnails**:
- Format: WebP with JPG fallback
- Size: 600x400px max (3:2 aspect)
- Compression: 75-80% quality
- Lazy load: Yes (intersection observer)
- Placeholder: Low-quality blur-up or skeleton

**Loading Strategy**:
```javascript
// Critical images (hero): Preload
<link rel="preload" as="image" href="/hero.webp" />

// Below-fold images: Lazy load
<img loading="lazy" src="/post-thumbnail.webp" />

// Intersection observer fallback for older browsers
```

### Layout Shifts Prevention

**Aspect Ratio Containers**:
```css
.post-card-image {
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.hero-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

**Skeleton Screens**:
- Show skeleton UI while posts load
- Match skeleton dimensions to actual content
- Smooth fade transition skeleton → content

### Critical CSS

**Inline Critical CSS** (above-fold only):
- Header styles
- Hero section styles
- Layout grid fundamentals
- Font loading styles

**Defer Non-Critical CSS**:
- Below-fold component styles
- Animation styles
- Mobile menu styles (if closed by default)

## Accessibility Testing Checklist

- [ ] Color contrast ≥4.5:1 for all text (verify with tool)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus states visible and clear
- [ ] Screen reader announces all content correctly
- [ ] ARIA labels present where needed
- [ ] Semantic HTML (header, nav, main, article, section, footer)
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Skip to main content link present
- [ ] Alt text for all images
- [ ] Touch targets ≥44x44px on mobile
- [ ] No mouse-only interactions
- [ ] Respects prefers-reduced-motion for animations

## References

**Brand Documentation**:
- `docs/VISUAL_BRAND_GUIDE.md` - Color palette, typography, spacing
- `docs/MARCUS_BRAND_PROFILE.md` - Brand essence, messaging, target audiences
- `.spec-flow/memory/constitution.md` - Engineering standards, accessibility requirements

**Current Implementation**:
- `app/page.tsx` - Homepage structure
- `components/home/Hero.tsx` - Hero component
- `components/home/HomePageClient.tsx` - M2 layout implementation

**External Inspiration** (not exhaustive):
- Stripe homepage - Clean hero with value prop
- Vercel homepage - Modern design, clear CTAs
- Dev.to - Content filtering, post cards
- Medium - Featured posts, newsletter CTAs
- Linear homepage - Subtle animations, brand consistency

## Notes

**Design System Consistency**:
- All component styles should reference brand tokens (navy palette, emerald accents)
- Reuse existing components where possible (Button, Badge, PostCard)
- New components should follow established patterns (spacing, typography, colors)

**Mobile-First Approach**:
- Design mobile layout first (320px-768px)
- Enhance for tablet (768px-1024px)
- Optimize for desktop (>1024px)
- Test on actual devices, not just browser DevTools

**Performance Testing**:
- Measure baseline before redesign (Lighthouse, WebPageTest)
- Track Core Web Vitals (FCP, LCP, CLS, FID)
- Test on 3G connection (slow 3G in Chrome DevTools)
- Monitor performance in production with Real User Monitoring (RUM)

**Iteration Strategy**:
- Ship MVP first (US1-US3: hero + filtering + recent posts)
- Gather user feedback and analytics data
- Iterate based on real user behavior
- Add enhancements (US4-US6) in subsequent releases
