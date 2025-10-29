# Visual Research: Projects Showcase

UX patterns, design inspiration, and reference materials for projects portfolio page.

## Purpose

Document visual design decisions, UX patterns from research, and reference sites that inform the Projects Showcase implementation.

## Reference Sites

### 1. Linear - Product Portfolio
**URL**: https://linear.app/
**Pattern**: Clean project showcase with filtering
**What to adopt**:
- Minimal card design with hover states
- Category badges prominently displayed
- High-quality screenshots with consistent aspect ratio
- Subtle animations (lift on hover)
- Grid layout with generous whitespace

**What to avoid**:
- Overly minimalist (need more visual hierarchy for dual-track positioning)
- Too much animation (prefer subtle, purposeful motion)

**Key Measurements**:
- Card aspect ratio: ~16:9 for screenshots
- Grid gap: 32px desktop, 24px tablet, 16px mobile
- Card padding: 24px
- Border radius: 12px

### 2. Stripe - Customer Stories
**URL**: https://stripe.com/customers
**Pattern**: Featured stories with metrics display
**What to adopt**:
- Metrics cards with large numbers + labels
- "Learn more" / "View case study" CTAs clear and prominent
- Category tags for industry filtering
- Featured section visually distinct from grid

**What to avoid**:
- Too corporate/enterprise focused (our brand is more personal)
- Video-heavy (prefer static screenshots for performance)

**Key Measurements**:
- Metrics display: 3-column layout with icon + number + label
- Featured card: 2x height of regular cards
- CTA buttons: 44px min height (touch target)

### 3. GitHub - Project Showcase
**URL**: https://github.com/topics
**Pattern**: Tech stack badges and filtering
**What to adopt**:
- Technology badges with color coding
- Star count / metrics prominently displayed
- Grid layout adapts well to mobile
- Search + filter combination

**What to avoid**:
- Too data-dense (overwhelming for casual visitors)
- Generic GitHub aesthetic (need stronger brand identity)

**Key Measurements**:
- Badge sizing: 28px height, 8px padding
- Badge colors: Subtle backgrounds (avoid neon)
- Grid: 1-2-3 columns (mobile-tablet-desktop)

## UX Patterns

### Pattern 1: Category Filtering with Visual Feedback

**Problem**: Users need to quickly find relevant work (Aviation vs. Dev).

**Solution**: Prominent filter buttons with active state matching brand colors:
- Aviation → Navy 900 background when active
- Dev/Startup → Emerald 600 background when active
- Cross-pollination → Purple background when active

**Interaction**:
1. Default state: All projects shown, "All" filter active
2. Click filter: Smooth transition (fade out non-matching cards)
3. Active filter: Color-coded background, white text
4. Inactive filters: Gray outline, gray text
5. URL updates: `/projects?category=aviation` (shareable, back-button friendly)

**Accessibility**:
- Active filter has `aria-pressed="true"`
- Filter change announced: "Aviation filter active, showing 4 projects"
- Keyboard: Tab through filters, Enter to activate

### Pattern 2: Project Card Hierarchy

**Problem**: Featured projects should stand out, but all projects should be scannable.

**Solution**: Two-tier card system:
- **Featured cards** (top of page): Larger, detailed metrics, prominent CTAs
- **Regular cards** (grid): Compact, essential info only

**Visual Distinction**:
- Featured: Full-width or 2-column layout, border accent, metrics badges
- Regular: 3-column grid, uniform height, hover effects

**Information Architecture**:
- **Featured**: Title + 2-3 sentence description + 3 metrics + 2 CTAs + full tech stack
- **Regular**: Title + 1 sentence + category badge + 4 tech badges + 2 CTAs

### Pattern 3: Progressive Disclosure for Tech Stack

**Problem**: Projects use many technologies, but cards shouldn't be cluttered.

**Solution**: Show first 4 technologies, hide rest behind "+N more" indicator:
- Default: 4 badges visible
- Hover: "+N more" becomes interactive tooltip or expands inline
- Click card: Navigate to detail page showing full stack

**Alternative** (P2): Modal/popover on "+N more" click showing all technologies

### Pattern 4: Empty States with Clear Actions

**Problem**: Filtered views may return zero results.

**Solution**: Friendly empty state with recovery actions:
- Icon or illustration (optional)
- Message: "No projects found in this category"
- Suggestion: "Try browsing All Projects or select a different category"
- Buttons: "View All Projects" (resets filter), filter buttons repeat

**Avoid**: Generic "No results" (unhelpful, no next action)

### Pattern 5: Responsive Grid Behavior

**Breakpoints**:
- **Mobile (<640px)**: 1 column, full-width cards, filters stack or scroll horizontally
- **Tablet (640-1024px)**: 2 columns, filters horizontal, cards slightly smaller
- **Desktop (>1024px)**: 3 columns, generous spacing, filters horizontal

**Featured Section**:
- Mobile: 1 column (stacked)
- Tablet: 1 column (full-width) or 2 columns
- Desktop: 2-3 featured projects side-by-side

## Color Palette (from constitution.md)

### Primary Colors
- **Navy 900**: `#1e3a5f` - Aviation category, card backgrounds
- **Navy 950**: `#0f1729` - Page background
- **Emerald 600**: `#059669` - Dev/Startup category, CTAs
- **Purple**: `#9333ea` - Cross-pollination category

### Text Colors
- **White**: `#ffffff` - Headings, primary text on dark backgrounds
- **Gray 300**: `#d1d5db` - Body text, descriptions
- **Gray 500**: `#6b7280` - Subtle text, metadata

### State Colors
- **Hover**: Emerald 600 with 10% opacity
- **Focus**: 2px emerald-600 outline
- **Disabled**: Gray 500 with 50% opacity

## Typography Scale

### Headings
- **Page heading** (`<h1>`): 3xl (36px), bold, white
- **Section heading** (`<h2>`): 2xl (24px), bold, white
- **Project title** (`<h3>`): xl (20px), bold, white/navy-900
- **Card description**: base (16px), regular, gray-300

### Body Text
- **Base**: 16px, line-height 1.5
- **Small** (metadata): 14px, line-height 1.4

### Badges
- **Text size**: sm (14px), medium weight
- **Padding**: 8px horizontal, 4px vertical
- **Border radius**: full (pill shape)

## Spacing System

### Grid
- **Desktop gap**: 32px (2rem)
- **Tablet gap**: 24px (1.5rem)
- **Mobile gap**: 16px (1rem)

### Card Padding
- **Featured cards**: 32px (2rem)
- **Regular cards**: 24px (1.5rem)

### Section Spacing
- **Between sections**: 64px (4rem)
- **Before footer**: 96px (6rem)

## Interaction States

### Hover (Desktop)
- **Card**: Lift 4px (`translateY(-4px)`), subtle shadow increase
- **Image**: Scale 105% (`scale(1.05)`), 300ms ease
- **Buttons**: Background darken 10%, 200ms ease
- **Filters**: Underline appears, 150ms ease

### Active/Pressed
- **Filters**: Background color (brand color), white text
- **Buttons**: Background darken 20%

### Focus (Keyboard)
- **All interactive**: 2px emerald-600 outline, 4px offset
- **Filters**: Solid outline, no offset (clearer within button group)

### Loading
- **Skeleton**: Gray-800 background, pulse animation
- **Spinner**: Emerald-600 color, 1.5s rotation

## Accessibility Considerations

### Color Contrast
- **Navy 900 on Navy 950**: 3.2:1 (decorative only, not text)
- **White on Navy 900**: 10.5:1 ✅
- **Gray 300 on Navy 900**: 6.2:1 ✅
- **Emerald 600 on Navy 950**: 4.8:1 ✅

### Focus Indicators
- **Visible on all interactive elements**
- **Emerald-600 outline**: High contrast on dark backgrounds
- **4px offset**: Clear separation from element

### Screen Reader Considerations
- **Filter state**: "Aviation filter active, showing 4 projects"
- **Card links**: "View details for CFIPros.com"
- **External links**: "Opens in new tab" announcement
- **Image alt text**: Descriptive, not generic ("CFIPros.com screenshot showing student dashboard")

### Keyboard Navigation
- **Tab order**: Filters → Featured cards → Grid cards
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals/tooltips
- **Arrow keys**: Navigate within filter group (enhancement, not MVP)

## Image Specifications

### Project Screenshots
- **Aspect ratio**: 16:9 (1200x675px recommended)
- **Format**: WebP with JPEG fallback
- **Quality**: 85% compression
- **Responsive sizes**: 400w, 800w, 1200w (srcset)
- **Alt text**: "[Project Title] screenshot showing [key feature visible]"

### Lazy Loading
- **Above fold** (featured): Eager load (`loading="eager"`)
- **Below fold** (grid): Lazy load (`loading="lazy"`)
- **Blur placeholder**: Low-res inline base64 during load

### Performance
- **Next.js Image component** for automatic optimization
- **Width/height attributes** to prevent CLS
- **Priority prop** on featured project images

## Animation Guidelines

### Principles
- **Purposeful**: Motion communicates state change or directs attention
- **Subtle**: Prefer 300ms or less, ease curves
- **Optional**: Respect `prefers-reduced-motion` media query

### Allowed Animations
- **Hover lift**: `translateY(-4px)`, 250ms ease
- **Image zoom**: `scale(1.05)`, 300ms ease-in-out
- **Fade transitions**: opacity, 200ms ease
- **Skeleton pulse**: 1.5s infinite ease-in-out

### Prohibited
- **Auto-playing carousels** (accessibility issue)
- **Parallax effects** (motion sickness risk)
- **Excessive bounce/spring** (distracting)
- **Entrance animations** without user trigger

## Responsive Images Cheat Sheet

```html
<Image
  src="/images/projects/cfipros.png"
  alt="CFIPros.com screenshot showing student progress dashboard"
  width={1200}
  height={675}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={isFeatured ? "eager" : "lazy"}
  priority={isFeatured}
/>
```

## Implementation Checklist

- [ ] Use existing `Container` component for page wrapper
- [ ] Adapt `PostCard` pattern for `ProjectCard` component
- [ ] Reuse `TrackBadge` component for category badges
- [ ] Create `TechStackBadge` component (similar to TrackBadge, different colors)
- [ ] Create `ProjectFilters` component with active state management
- [ ] Implement responsive grid with 1-2-3 column breakpoints
- [ ] Add hover states (lift + image zoom)
- [ ] Ensure all images have proper `width`/`height` to prevent CLS
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Test screen reader announcements (filter changes, external links)
- [ ] Verify focus indicators visible on all elements
- [ ] Test on mobile (filters usable, cards readable)
- [ ] Run Lighthouse audit (Performance ≥85, Accessibility ≥95)

---

**Sources**:
- Linear.app - card hover patterns
- Stripe.com/customers - metrics display
- GitHub.com/topics - tech badges and filtering
- constitution.md - brand colors and typography
- ui-inventory.md - existing component patterns

**Last Updated**: 2025-10-29
