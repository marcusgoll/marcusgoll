# UI Component Inventory

Component catalog for marcusgoll.com design system.

## Layout Components

### Container
**Path**: `components/ui/Container.tsx`
**Purpose**: Page width constraint wrapper with consistent padding
**Props**: `children`, `className`
**Usage**: Wrap page sections for consistent max-width and centering

### Header
**Path**: `components/layout/Header.tsx`
**Purpose**: Site-wide navigation header
**Props**: Navigation items, current path
**Usage**: Global header with logo and nav links

### Footer
**Path**: `components/layout/Footer.tsx`
**Purpose**: Site-wide footer with links and copyright
**Props**: None
**Usage**: Global footer component

## UI Primitives

### Button
**Path**: `components/ui/Button.tsx`
**Purpose**: Reusable button component with consistent styling and analytics tracking
**Props**: `variant` (default, outline, ghost), `size` (sm, default, lg), `children`, `className`, `onClick`
**Usage**: Primary and secondary CTAs throughout the site
**Features**: Built-in analytics tracking, accessible focus states

## Blog Components

### PostCard
**Path**: `components/blog/PostCard.tsx`
**Purpose**: Individual blog post card with image, title, excerpt, metadata
**Props**: `post` (Post type with title, excerpt, coverImage, date, slug, tags)
**Usage**: Display post preview in grids or lists
**Features**: Responsive image, track badge, hover effects

### PostGrid
**Path**: `components/blog/PostGrid.tsx`
**Purpose**: Responsive grid layout for post cards (1/2/3 columns)
**Props**: `posts` (array of Post objects)
**Usage**: Display multiple posts in grid format
**Features**: Responsive breakpoints (mobile: 1 col, tablet: 2 col, desktop: 3 col)

### TrackBadge
**Path**: `components/blog/TrackBadge.tsx`
**Purpose**: Visual badge indicating content track with color coding
**Props**: `track` ("Aviation" | "Dev/Startup" | "Cross-pollination")
**Usage**: Show content category on posts
**Features**: Color-coded (Navy 900 for Aviation, Emerald 600 for Dev, Purple for Cross-pollination)

## Home Components

### Hero
**Path**: `components/home/Hero.tsx`
**Purpose**: Homepage hero section with heading, subheading, and CTA
**Props**: `heading`, `subheading`, `ctaText`, `ctaHref`
**Usage**: Above-the-fold hero section on homepage
**Features**: Responsive typography, gradient background

### DualTrackShowcase
**Path**: `components/home/DualTrackShowcase.tsx`
**Purpose**: Display posts from two content tracks in separate sections
**Props**: `aviationPosts`, `devPosts` (arrays of Post objects)
**Usage**: Homepage dual-track post display
**Features**: Side-by-side sections, responsive stacking on mobile

## Analytics Components

### PageViewTracker
**Path**: `components/analytics/PageViewTracker.tsx`
**Purpose**: Track page views for analytics
**Props**: `pageName`, `metadata` (optional)
**Usage**: Add to pages for analytics tracking
**Features**: Automatic page view event firing

## Design Tokens

### Colors
- **Navy 900**: Primary brand color (Aviation track)
- **Emerald 600**: Secondary brand color (Dev/Startup track)
- **Purple**: Tertiary color (Cross-pollination track)
- **Gray scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Typography
- **Font**: System fonts (sans-serif stack)
- **Headings**: Bold, Navy 900
- **Body**: Regular, Gray 700
- **Scale**: sm, base, lg, xl, 2xl, 3xl, 4xl

### Spacing
- **Grid**: 8px base unit
- **Container**: max-w-7xl (1280px)
- **Padding**: Consistent px-4 (mobile), px-6 (tablet), px-8 (desktop)

### Interactions
- **Transitions**: 250ms ease-in-out
- **Focus**: 2px outline, emerald-600
- **Hover**: Subtle opacity/transform changes

## Accessibility Standards

All components meet WCAG 2.1 AA:
- Minimum 4.5:1 color contrast for text
- Keyboard navigation support (tab, enter, space)
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly

## Usage Notes

**System-first**: Use existing components before creating new ones
**Composition**: Combine primitives to build complex interfaces
**Reusability**: All components accept className for customization
**Consistency**: Follow established patterns for similar UI elements
