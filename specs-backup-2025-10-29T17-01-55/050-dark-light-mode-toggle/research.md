# Research & Discovery: dark-light-mode-toggle

## Research Decisions

### Decision: Use next-themes exclusively for theme state management

- **Decision**: Leverage existing next-themes 0.4.6 installation
- **Rationale**: ThemeProvider already configured in app/layout.tsx with attribute="class", defaultTheme="light", enableSystem, and disableTransitionOnChange. Handles localStorage persistence, SSR hydration, system preference detection automatically.
- **Alternatives**:
  - Custom React Context implementation (rejected - duplicates next-themes functionality)
  - Direct localStorage manipulation (rejected - SSR hydration issues)
- **Source**: app/layout.tsx:29-34, components/theme-provider.tsx

### Decision: Icon-only toggle button (Sun/Moon pattern)

- **Decision**: Display Moon icon in light mode (destination state), Sun icon in dark mode
- **Rationale**: Industry standard pattern, matches user mental model, minimal space in header navigation
- **Alternatives**:
  - Text-based toggle "Dark/Light" (rejected - takes more space)
  - Three-state toggle with "System" option (deferred to future enhancement)
  - Icon + text (rejected - redundant for header, unnecessary width)
- **Source**: spec.md:238-254 Design Notes, lucide-react 0.546.0 already installed

### Decision: Shadcn/ui Button component pattern with "ghost" variant

- **Decision**: Create ThemeToggle component following existing Button.tsx pattern using class-variance-authority
- **Rationale**: Consistent with existing UI component architecture, Button component supports ghost variant for transparent header button, includes focus states and accessibility primitives
- **Alternatives**:
  - Plain HTML button (rejected - inconsistent styling patterns)
  - Custom styled component (rejected - duplicates Button primitives)
- **Source**: components/ui/Button.tsx, lib/utils.ts (cn utility)

### Decision: Dual placement - Desktop header right side + Mobile menu bottom

- **Decision**: Add toggle to desktop navigation after nav links (right side), and inside mobile hamburger menu at bottom of nav items
- **Rationale**: Desktop: right side is conventional placement for utility controls. Mobile: inside existing hamburger menu minimizes header clutter, follows spec.md FR-003
- **Alternatives**:
  - Floating button overlay (rejected - not in spec, intrusive UX)
  - Footer placement (rejected - low discoverability)
- **Source**: components/layout/Header.tsx:29-143 (desktop nav), :177-256 (mobile menu)

### Decision: CSS custom properties for theme colors (no changes needed)

- **Decision**: Reuse existing --bg, --text, --primary CSS variables defined for .dark class
- **Rationale**: globals.css already defines comprehensive light and dark mode variables in OKLCH color space. Toggling .dark class on <html> automatically applies theme. No additional CSS required.
- **Alternatives**:
  - Inline styles (rejected - violates design system)
  - Separate dark theme stylesheet (rejected - increases bundle, already have CSS variables)
- **Source**: app/globals.css:7-75 (:root), app/globals.css:104-138 (.dark)

### Decision: Zero bundle size increase - no new dependencies

- **Decision**: Use only existing dependencies (next-themes, lucide-react, Button component)
- **Rationale**: All required packages already installed. Meets NFR-002 requirement (<5KB increase). ThemeToggle component estimated ~1KB.
- **Alternatives**:
  - External theme libraries like react-toggle-dark-mode (rejected - unnecessary dependency)
- **Source**: package.json:30 (next-themes), :27 (lucide-react), NFR-002 in spec.md

---

## Components to Reuse (6 found)

- **next-themes useTheme hook** (components/theme-provider.tsx) - Theme state management, localStorage persistence, system detection
- **lucide-react icons** (package.json:27) - Sun and Moon icons for toggle button
- **Button component** (components/ui/Button.tsx) - Base button primitive with variants, focus states, accessibility
- **cn utility** (lib/utils.ts) - Tailwind class merging for conditional styles
- **CSS custom properties** (app/globals.css) - --bg, --text, --primary variables for both :root and .dark
- **Header component structure** (components/layout/Header.tsx) - Desktop nav (line 29-143), Mobile menu (line 177-256)

---

## New Components Needed (1 required)

- **components/ui/theme-toggle.tsx** - ThemeToggle component
  - Uses next-themes useTheme hook
  - Renders Sun/Moon icons from lucide-react
  - Button with ghost variant (transparent background)
  - ARIA label: "Switch to dark mode" / "Switch to light mode"
  - Keyboard support: Enter/Space activation (inherited from Button)
  - No internal state - reads/writes via useTheme()

---

## Integration Points

### Header.tsx Desktop Navigation
**File**: components/layout/Header.tsx
**Location**: Line 29-143 (desktop navigation div)
**Change**: Add ThemeToggle after nav links, before closing div
**Pattern**: Matches existing nav link styling (text-white, hover:text-emerald-600)

### Header.tsx Mobile Menu
**File**: components/layout/Header.tsx
**Location**: Line 177-256 (mobile menu)
**Change**: Add ThemeToggle at end of nav links
**Pattern**: Follows mobile menu item styling

### No Changes Required
- app/layout.tsx - ThemeProvider already configured
- components/theme-provider.tsx - Wrapper is complete
- app/globals.css - Dark mode variables already defined

---

## Unknowns & Questions

None - all technical questions resolved through codebase research
