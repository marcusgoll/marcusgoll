# Marcus Gollahon - Visual Brand Guide

**Version**: 1.0.0
**Last Updated**: 2025-10-20

---

## 🎨 Color Palette

### Primary Color: Pilot Navy
**Use for**: Main brand color, headers, navigation, primary buttons

- **Navy 900** (Primary): `#0F172A`
  - RGB: 15, 23, 42
  - Usage: Headers, primary CTAs, dark backgrounds

- **Navy 700**: `#334155`
  - RGB: 51, 65, 85
  - Usage: Hover states, secondary elements

- **Navy 500**: `#64748B`
  - RGB: 100, 116, 139
  - Usage: Disabled states, borders

### Secondary Color: Code Green (Emerald)
**Use for**: Accents, success states, "building in public" highlights

- **Emerald 600** (Secondary): `#059669`
  - RGB: 5, 150, 105
  - Usage: Secondary CTAs, links, success indicators

- **Emerald 500**: `#10B981`
  - RGB: 16, 185, 129
  - Usage: Hover states on green elements, highlights

- **Emerald 400**: `#34D399`
  - RGB: 52, 211, 153
  - Usage: Light accents, badges, tags

### Neutral Colors
**Use for**: Text, backgrounds, cards, subtle elements

- **Slate 950** (Near Black): `#020617`
  - RGB: 2, 6, 23
  - Usage: Primary text, dark mode backgrounds

- **Slate 800**: `#1E293B`
  - RGB: 30, 41, 59
  - Usage: Secondary text, card backgrounds (dark mode)

- **Slate 600**: `#475569`
  - RGB: 71, 85, 105
  - Usage: Tertiary text, muted elements

- **Slate 200**: `#E2E8F0`
  - RGB: 226, 232, 240
  - Usage: Borders, dividers, light backgrounds

- **Slate 50**: `#F8FAFC`
  - RGB: 248, 250, 252
  - Usage: Page backgrounds (light mode), subtle highlights

- **White**: `#FFFFFF`
  - RGB: 255, 255, 255
  - Usage: Card backgrounds, button text on dark backgrounds

### Accent Colors
**Use for**: Special highlights, alerts, notifications

- **Sky Blue** (Aviation Accent): `#0EA5E9`
  - RGB: 14, 165, 233
  - Usage: Aviation-related content highlights, info states

- **Orange** (Startup Accent): `#F97316`
  - RGB: 249, 115, 22
  - Usage: #BuildInPublic content highlights, warning states

- **Red** (Error/Alert): `#EF4444`
  - RGB: 239, 68, 68
  - Usage: Error states, critical alerts only

### Color Usage Guidelines

**Text Color Hierarchy**:
1. Primary text: Slate 950 (light mode) / Slate 50 (dark mode)
2. Secondary text: Slate 600 (light mode) / Slate 400 (dark mode)
3. Tertiary text: Slate 500
4. Links: Emerald 600 → Emerald 500 on hover

**Background Color Hierarchy**:
1. Page background: Slate 50 (light mode) / Slate 950 (dark mode)
2. Card background: White (light mode) / Slate 800 (dark mode)
3. Elevated elements: White with shadow

**Button Colors**:
- **Primary CTA**: Navy 900 background, White text
  - Hover: Navy 700 background

- **Secondary CTA**: Emerald 600 background, White text
  - Hover: Emerald 500 background

- **Outline Button**: Transparent background, Navy 900 border/text
  - Hover: Navy 900 background, White text

**Content Track Color Coding** (Subtle use):
- Aviation content: Slight Sky Blue tint on tags/badges
- Dev/Startup content: Slight Emerald tint on tags/badges
- Cross-pollination: Gradient or both colors

---

## 🔤 Typography

### Font Families

**Primary Font: Work Sans**
- **Source**: [Google Fonts](https://fonts.google.com/specimen/Work+Sans)
- **Weights to use**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: Headings, body text, UI elements, everything except code

**Code/Monospace Font: JetBrains Mono**
- **Source**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- **Weights to use**: 400 (Regular), 500 (Medium)
- **Usage**: Code blocks, technical examples, inline code

### Typography Scale

**Headings** (Work Sans):

- **H1** (Page Titles):
  - Size: 48px (3rem)
  - Weight: 700 (Bold)
  - Line Height: 1.2
  - Color: Navy 900
  - Use: Homepage hero, major page titles

- **H2** (Section Headers):
  - Size: 36px (2.25rem)
  - Weight: 700 (Bold)
  - Line Height: 1.3
  - Color: Navy 900
  - Use: Main section headings

- **H3** (Subsection Headers):
  - Size: 28px (1.75rem)
  - Weight: 600 (SemiBold)
  - Line Height: 1.4
  - Color: Navy 900
  - Use: Subsection headings

- **H4** (Card Titles):
  - Size: 20px (1.25rem)
  - Weight: 600 (SemiBold)
  - Line Height: 1.5
  - Color: Navy 900
  - Use: Card titles, smaller headings

**Body Text** (Work Sans):

- **Large Body**:
  - Size: 18px (1.125rem)
  - Weight: 400 (Regular)
  - Line Height: 1.7
  - Color: Slate 800
  - Use: Lead paragraphs, introductions

- **Regular Body** (Default):
  - Size: 16px (1rem)
  - Weight: 400 (Regular)
  - Line Height: 1.7
  - Color: Slate 800
  - Use: Main body text, most content

- **Small Body**:
  - Size: 14px (0.875rem)
  - Weight: 400 (Regular)
  - Line Height: 1.6
  - Color: Slate 600
  - Use: Captions, metadata, secondary info

**UI Elements** (Work Sans):

- **Button Text**:
  - Size: 16px (1rem)
  - Weight: 500 (Medium)
  - Letter Spacing: 0.5px
  - Color: White (on colored backgrounds)

- **Navigation Links**:
  - Size: 16px (1rem)
  - Weight: 500 (Medium)
  - Color: Slate 800
  - Hover: Emerald 600

- **Tag/Badge Text**:
  - Size: 12px (0.75rem)
  - Weight: 500 (Medium)
  - Letter Spacing: 0.5px
  - All caps: Optional

**Code** (JetBrains Mono):

- **Inline Code**:
  - Size: 14px (0.875rem)
  - Weight: 400 (Regular)
  - Background: Slate 100
  - Padding: 2px 6px
  - Border Radius: 4px

- **Code Blocks**:
  - Size: 14px (0.875rem)
  - Weight: 400 (Regular)
  - Line Height: 1.6
  - Background: Slate 900
  - Color: Slate 100
  - Padding: 16px
  - Border Radius: 8px

### Responsive Typography

**Mobile (< 640px)**:
- H1: 32px → 40px
- H2: 28px → 32px
- H3: 24px → 28px
- Body: 16px (same)

**Tablet (640px - 1024px)**:
- H1: 40px → 48px
- H2: 32px → 36px
- H3: 28px (same)
- Body: 16px (same)

**Desktop (> 1024px)**:
- Use default sizes listed above

---

## 📐 Spacing & Layout

### Spacing Scale (8px base)

Use consistent spacing based on 8px increments:

- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 16px (1rem) ← Most common
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)
- **4XL**: 96px (6rem)

### Layout Grid

- **Container Max Width**: 1280px (80rem)
- **Content Max Width**: 768px (48rem) for blog posts
- **Gutter**: 24px (1.5rem) on mobile, 32px (2rem) on desktop
- **Grid Columns**: 12-column system

### Border Radius

- **Small** (buttons, tags): 6px
- **Medium** (cards): 8px
- **Large** (modals, images): 12px
- **Full** (pills, avatars): 9999px

---

## 🖼️ Imagery Guidelines

### Photography Style

**Professional Headshot**:
- Style: Professional but approachable
- Background: Solid color (Navy or neutral) or subtle blur
- Lighting: Well-lit, clear, sharp focus
- Attire: Pilot uniform or business casual
- Minimum resolution: 800x800px, ideally 1200x1200px

**Content Images**:
- **Aviation photos**: Cockpit shots, aircraft, airports (authentic, not stock)
- **Code screenshots**: Light background or dark mode with syntax highlighting
- **Build in public**: Progress screenshots, analytics, metrics
- **Diagrams**: Simple, clean, Navy + Green color scheme

**Image Optimization**:
- Format: WebP with JPG fallback
- Compression: 80-85% quality
- Lazy loading: Below the fold
- Alt text: Always descriptive

### Logo/Brand Mark

**Option 1: Initials "MG"**
- Simple, bold monogram
- Navy background, White or Green accent
- Works at all sizes

**Option 2: Text Logo**
- "Marcus Gollahon" in Work Sans Bold
- Navy color
- Optional: Small plane or code icon accent

**Option 3: Icon + Text**
- Minimalist plane or wings icon
- "Marcus Gollahon" text beside
- Two-color: Navy + Green

**Recommended**: Start with Option 2 (text logo) - simple, professional, no design skills needed. Can upgrade later.

---

## 🎯 Application Examples

### Website Header
```
Background: White
Logo: Navy 900 text
Navigation: Slate 800 → Emerald 600 on hover
CTA Button: Navy 900 background, White text
```

### Blog Post
```
Title (H1): Navy 900, 48px, Work Sans Bold
Body text: Slate 800, 16px, Work Sans Regular
Links: Emerald 600 underlined
Code blocks: Slate 900 background, JetBrains Mono
Inline code: Slate 100 background, JetBrains Mono
```

### Social Media Graphics
```
Background: Navy 900 or Slate 50
Headline: White or Navy 900, Work Sans Bold
Accent: Emerald 600
Tag/Badge: Sky Blue (aviation) or Orange (dev)
```

### Button Examples
```css
/* Primary Button */
background: #0F172A;  /* Navy 900 */
color: #FFFFFF;
font: 500 16px 'Work Sans';
padding: 12px 24px;
border-radius: 6px;

/* Primary Button Hover */
background: #334155;  /* Navy 700 */

/* Secondary Button */
background: #059669;  /* Emerald 600 */
color: #FFFFFF;
font: 500 16px 'Work Sans';
padding: 12px 24px;
border-radius: 6px;

/* Secondary Button Hover */
background: #10B981;  /* Emerald 500 */
```

---

## 📦 Brand Assets Checklist

### To Create/Gather:
- [ ] Professional headshot (in pilot uniform or business casual)
- [ ] Simple text logo using Work Sans Bold
- [ ] Favicon (simple "MG" or plane icon)
- [ ] Social media cover images (Twitter, LinkedIn)
- [ ] Email signature graphic
- [ ] Blog post featured image template (Canva)
- [ ] Social media post template (Canva)

### Asset Dimensions:

**Social Media Profile Images**:
- Twitter: 400x400px (displays as circle)
- LinkedIn: 400x400px (displays as circle)
- GitHub: 420x420px (displays as circle)

**Cover Images**:
- Twitter Header: 1500x500px
- LinkedIn Background: 1584x396px
- YouTube Banner: 2560x1440px (safe area: 1546x423px)

**Content Images**:
- Blog Featured Image: 1200x630px (Open Graph standard)
- Social Media Post: 1080x1080px (square, works everywhere)
- Twitter Card: 1200x628px

---

## 🛠️ Tools & Resources

### Design Tools (Free Options):
- **Canva**: Social media graphics, blog images
- **Figma**: Website mockups (free for individuals)
- **Coolors.co**: Color palette generator (to create variations)
- **Google Fonts**: Download Work Sans font files

### Code Implementation:

**Import Google Fonts** (Add to HTML `<head>` or CSS):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**CSS Variables**:
```css
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
  --white: #FFFFFF;

  /* Typography */
  --font-primary: 'Work Sans', -apple-system, sans-serif;
  --font-code: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

body {
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 1.7;
  color: var(--slate-800);
  background: var(--slate-50);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  color: var(--navy-900);
  font-weight: 700;
}

code {
  font-family: var(--font-code);
  background: var(--slate-200);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875rem;
}
```

**Tailwind Config** (if using Tailwind CSS):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
        },
        emerald: {
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
        },
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

---

## ✅ Quick Reference

**Primary Color**: Navy 900 `#0F172A`
**Secondary Color**: Emerald 600 `#059669`
**Text Color**: Slate 800 `#1E293B`
**Background Color**: Slate 50 `#F8FAFC`
**Link Color**: Emerald 600 `#059669`

**Primary Font**: Work Sans (400, 500, 600, 700)
**Code Font**: JetBrains Mono (400, 500)

**Body Size**: 16px, Line Height 1.7
**Heading Weight**: 600-700 (SemiBold to Bold)

**Spacing Unit**: 8px base
**Border Radius**: 6-12px
**Container Width**: 1280px max

---

**This is your complete visual identity system. Use it consistently across all platforms and materials for a cohesive, professional brand.**
