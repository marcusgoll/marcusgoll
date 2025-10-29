# Visual References: Dark/Light Mode Toggle

## Industry Patterns

### Common Implementations

**Pattern 1: Icon-Only Toggle (Recommended)**
- Single button with icon that represents opposite state
- Light mode: Shows Moon icon → "switch to dark"
- Dark mode: Shows Sun icon → "switch to light"
- Examples: GitHub, Stripe, Linear, Vercel

**Pattern 2: Toggle Switch**
- Switch with Sun on left, Moon on right
- Position indicates current state
- More visual but takes more space
- Examples: Twitter/X (pre-rebrand), Notion

**Pattern 3: Dropdown Menu**
- Button opens menu with options: Light, Dark, System
- More complex, supports three-way choice
- Examples: Discord, VS Code Settings
- Out of scope for initial implementation

### Recommended Approach

**Icon-Only Toggle** (Pattern 1) for these reasons:
1. Minimal header space footprint
2. Universal iconography (Sun/Moon)
3. Matches existing site's minimal aesthetic
4. Industry standard for simple two-state toggles
5. Already using icon-based nav (dropdowns use SVG arrows)

## Layout Specifications

### Desktop Header Placement

```
+------------------------------------------------------------------+
| [Marcus Gollahon]    [Home] [Aviation▾] [Dev▾] [Cross-Poll] [🌙] |
+------------------------------------------------------------------+
```

- Position: Far right of header navigation
- Alignment: Vertically centered with nav links
- Spacing: 1.5rem (24px) left margin from last nav link
- Size: 40x40px touch target, 24x24px icon
- Color: White icon, emerald on hover (consistent with nav links)

### Mobile Header Placement

**Hamburger Closed**:
```
+---------------------------+
| [Marcus Gollahon]    [☰] |
+---------------------------+
```

**Hamburger Open**:
```
+---------------------------+
| Home                      |
| Aviation                  |
|   ├─ Flight Training      |
|   ├─ CFI Resources        |
|   └─ Career Path          |
| Dev/Startup               |
|   ├─ Software Dev         |
|   ├─ Systematic Thinking  |
|   └─ Startup Insights     |
| Cross-Pollination         |
|                           |
| [🌙 Theme]                |
+---------------------------+
```

- Position: Bottom of mobile menu
- Spacing: 0.5rem (8px) top margin from last nav item
- Separator: Optional subtle border-top
- Size: Full-width button, 44px min height
- Layout: Icon + "Theme" label (optional)

## Icon Specifications

### Source
- Package: lucide-react
- Icons: `Sun`, `Moon`
- Version: 0.546.0 (already installed)

### Sizing
- Icon viewport: 24x24px
- Stroke width: 2px (lucide default)
- Touch target: 40x40px (desktop), 44x44px (mobile)

### States

**Light Mode (Moon Icon)**:
```
Color: White (text-white / oklch(1 0 0))
Hover: Emerald 600 (text-emerald-600 / oklch(0.45 0.18 270))
Focus: White with 2px focus ring (ring-emerald-600)
```

**Dark Mode (Sun Icon)**:
```
Color: White (text-white / oklch(0.98 0 0))
Hover: Emerald 400 (text-emerald-400 / brighter emerald)
Focus: White with 2px focus ring (ring-emerald-400)
```

## Animation Specifications

### Theme Transition
- Duration: 200ms
- Easing: ease-in-out
- Properties: color, background-color, border-color
- Method: CSS custom properties cascade

### Icon Transition (Optional Enhancement)
- Fade out old icon: 100ms
- Fade in new icon: 100ms
- Total: 200ms
- Property: opacity
- Note: Can be implemented as simple swap with no animation initially

## Accessibility Specifications

### Focus Indicator
```css
.theme-toggle:focus-visible {
  outline: 2px solid var(--highlight); /* Emerald accent */
  outline-offset: 2px;
  border-radius: 0.375rem; /* 6px */
}
```

### Color Contrast

**Light Mode**:
- Icon on Navy 900 background: White (#FFFFFF) on Navy (#0F172A)
- Contrast ratio: 21:1 ✅ (exceeds WCAG AAA)

**Dark Mode**:
- Icon on Navy 900 background: White (#FAFAFA) on Navy (#0F172A)
- Contrast ratio: 19:1 ✅ (exceeds WCAG AAA)

**Hover State (Both Modes)**:
- Emerald accent on Navy 900: Emerald (#059669) on Navy (#0F172A)
- Contrast ratio: 4.8:1 ✅ (exceeds WCAG AA)

### Touch Targets

- Desktop: 40x40px minimum (exceeds WCAG 2.1 Level AAA 24x24px)
- Mobile: 44x44px minimum (meets iOS HIG and Android Material)

## Reference Screenshots

### Similar Implementations

**GitHub**:
- Icon-only toggle in header far right
- Sun/Moon icons
- Smooth theme transition
- URL: https://github.com

**Vercel**:
- Icon-only toggle in navigation
- Minimal, clean aesthetic
- Instant theme switch
- URL: https://vercel.com

**Linear**:
- Icon-only toggle in app header
- Sophisticated dark mode palette
- URL: https://linear.app

**Stripe**:
- Icon-only toggle in docs navigation
- Professional, clean design
- URL: https://stripe.com/docs

## Design Tokens

### From globals.css

**Light Mode**:
```css
--bg: oklch(1 0 0); /* Pure white */
--text: oklch(0.15 0 0); /* High contrast black */
--highlight: oklch(0.45 0.18 270); /* Stripe purple */
--border: oklch(0.92 0 0); /* Light gray */
```

**Dark Mode**:
```css
--bg: oklch(0.19 0 0); /* Dark gray */
--text: oklch(0.98 0 0); /* High contrast white */
--highlight: oklch(0.58 0.10 270); /* Desaturated purple */
--border: oklch(0.34 0 0); /* Subtle gray */
```

**Navy 900 (Header Background)**:
```css
--navy-900: oklch(0.15 0.05 240);
```

## Implementation Notes

1. **No custom icons needed**: Use lucide-react Sun/Moon directly
2. **No animation library needed**: CSS transitions sufficient
3. **No state management beyond next-themes**: useTheme() hook provides all necessary state
4. **Mobile menu stays open**: Theme switch should not close hamburger menu
5. **Icon semantics**: Show destination state, not current state (Moon in light mode = "switch to dark")

## Future Enhancements (Out of Scope)

- Animated icon transitions (rotate, fade, morph)
- Three-way toggle (light/dark/system)
- Theme preview on hover
- Custom theme colors beyond light/dark
- Per-page theme preferences
