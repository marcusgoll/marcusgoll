# Feature Specification: Dark/Light Mode Toggle

**Feature ID**: 050-dark-light-mode-toggle
**Status**: Specification
**Created**: 2025-10-28
**Source**: GitHub Issue #23

## Overview

Implement a user-facing theme toggle control that allows users to manually switch between dark and light modes. The underlying theme infrastructure (next-themes, CSS variables, system detection) is already in place; this feature adds the missing UI control in the site navigation.

## Problem Statement

Users currently have no way to manually override the system theme preference. While the site respects `prefers-color-scheme` and persists preferences via localStorage, there is no visible toggle button to switch themes on demand. This limits user agency and prevents testing theme variants without changing OS settings.

## User Stories

### US-001: Manual Theme Toggle
**Given** I am viewing any page on the site
**When** I click the theme toggle button in the header
**Then** the site switches between light and dark mode
**And** my preference is persisted across page reloads
**And** the transition is smooth without flash or layout shift

### US-002: System Preference Respect
**Given** I have not manually selected a theme preference
**When** I visit the site for the first time
**Then** the site defaults to my OS theme preference (light or dark)
**And** the toggle button reflects the current theme state

### US-003: Keyboard Accessibility
**Given** I am navigating with a keyboard
**When** I tab to the theme toggle button and press Enter or Space
**Then** the theme switches successfully
**And** focus remains on the toggle button

### US-004: Screen Reader Accessibility
**Given** I am using a screen reader
**When** I focus on the theme toggle button
**Then** the screen reader announces "Switch to dark mode" or "Switch to light mode"
**And** the button role and state are properly conveyed

### US-005: Mobile Theme Toggle
**Given** I am viewing the site on a mobile device
**When** I open the hamburger menu
**Then** I see the theme toggle option
**And** tapping it switches the theme immediately

## Functional Requirements

### FR-001: Theme Toggle Component
Create a ThemeToggle React component that:
- Uses next-themes `useTheme` hook to read/write theme state
- Displays Sun icon when in light mode, Moon icon when in dark mode
- Toggles between `light` and `dark` themes on click
- Includes proper ARIA labels for accessibility
- Supports keyboard interaction (Enter/Space to toggle)

### FR-002: Header Integration - Desktop
Add theme toggle to desktop navigation:
- Position: Right side of header, after navigation links
- Styling: Match header color scheme (white icon on navy background)
- Hover state: Emerald accent color (consistent with nav links)
- Size: 24x24px icon, 40x40px touch target minimum

### FR-003: Header Integration - Mobile
Add theme toggle to mobile navigation:
- Position: Inside hamburger menu, at bottom of nav links
- Styling: Consistent with mobile menu items
- Tap target: Minimum 44x44px for touch accessibility

### FR-004: Smooth Transitions
Ensure theme switching is smooth:
- CSS transitions on color properties (200-300ms duration)
- No flash of unstyled content (already handled by `suppressHydrationWarning`)
- No layout shift when theme changes
- Preserve scroll position during theme switch

### FR-005: Icon Selection
Use lucide-react icons:
- Light mode: Sun icon
- Dark mode: Moon icon
- Transition: Fade between icons (optional enhancement)

### FR-006: Persistence
Theme preference persists via next-themes localStorage:
- Key: `theme` (next-themes default)
- Values: `light`, `dark`, `system`
- No additional persistence logic required (next-themes handles this)

## Non-Functional Requirements

### NFR-001: Accessibility - WCAG 2.1 AA
- Color contrast ratios meet WCAG 2.1 AA in both modes
- Button has accessible name (ARIA label or visible text)
- Keyboard navigable (tab order, Enter/Space activation)
- Focus indicator visible in both themes
- Screen reader announces theme state changes

### NFR-002: Performance
- Toggle response time < 100ms
- No JavaScript bundle increase > 5KB
- CSS transitions use GPU-accelerated properties (opacity, transform)
- No CLS (Cumulative Layout Shift) when toggling theme

### NFR-003: Browser Compatibility
- Support all browsers supported by Next.js 15
- Graceful degradation if JavaScript disabled (system theme only)
- No console errors or warnings

### NFR-004: Code Quality
- TypeScript strict mode compliance
- Component tests for toggle behavior
- Props interface documented
- Follows existing code patterns (shadcn/ui style)

## Out of Scope

- Three-way toggle (light/dark/system) - future enhancement
- Per-page theme preferences
- Scheduled theme switching (time-based)
- Theme customization beyond light/dark
- Animated theme transition effects (beyond simple CSS transitions)
- Theme preview before applying

## Acceptance Scenarios

### AS-001: First-Time Visitor (System Light)
**Given** I have OS set to light mode
**And** I have never visited the site before
**When** I load the homepage
**Then** the site displays in light mode
**And** the toggle button shows the Moon icon (indicating I can switch to dark)

### AS-002: First-Time Visitor (System Dark)
**Given** I have OS set to dark mode
**And** I have never visited the site before
**When** I load the homepage
**Then** the site displays in dark mode
**And** the toggle button shows the Sun icon (indicating I can switch to light)

### AS-003: Manual Toggle Override
**Given** I have OS set to light mode
**And** the site is displaying in light mode
**When** I click the theme toggle button
**Then** the site switches to dark mode immediately
**And** the toggle button changes to Sun icon
**And** my preference persists when I reload the page

### AS-004: Persistence Across Sessions
**Given** I previously selected dark mode manually
**When** I close the browser and return to the site
**Then** the site loads in dark mode
**And** the toggle button shows the Sun icon

### AS-005: Keyboard Navigation
**Given** I am using keyboard navigation
**When** I tab to the theme toggle button
**Then** the button receives visible focus indicator
**When** I press Enter
**Then** the theme switches successfully

### AS-006: Mobile Menu Toggle
**Given** I am on mobile viewport (< 768px)
**When** I tap the hamburger menu
**Then** the mobile menu opens with theme toggle visible
**When** I tap the theme toggle
**Then** the theme switches and menu remains open

## Context Strategy

The theme system uses next-themes for state management and localStorage persistence. The component will be a thin UI layer over the existing infrastructure.

**State Flow**:
1. next-themes reads system preference + localStorage on mount
2. ThemeProvider applies theme class to `<html>` element
3. CSS variables cascade to all components
4. Toggle button reads current theme via `useTheme()`
5. Button click calls `setTheme('light' | 'dark')`
6. next-themes updates localStorage + HTML class
7. CSS transitions smooth the visual change

## Signal Design

**User Signals**:
- Click/tap on toggle button
- Keyboard Enter/Space on focused button

**System Signals**:
- Current theme state from `useTheme().theme`
- Resolved theme from `useTheme().resolvedTheme` (accounts for system)

**Error Conditions**:
- next-themes not available: Fallback to static light mode (unlikely, ThemeProvider already integrated)
- localStorage blocked: Theme works for session only, resets on reload

## Technical Constraints

### Existing Infrastructure
- next-themes 0.4.6 already integrated
- ThemeProvider configured in app/layout.tsx
- CSS variables defined for both themes
- `suppressHydrationWarning` prevents flash

### Integration Points
- components/layout/Header.tsx - Add toggle to desktop and mobile nav
- New file: components/ui/theme-toggle.tsx
- No changes to app/layout.tsx or theme-provider.tsx

### Dependencies
- next-themes (already installed)
- lucide-react (already installed)
- React 19+ (Next.js 15 dependency)

## Success Criteria

1. Users can toggle between light and dark mode from any page
2. Theme preference persists across browser sessions
3. Toggle button is keyboard accessible (tab, Enter/Space)
4. Screen readers announce toggle state ("Switch to dark mode")
5. No flash of unstyled content on page load
6. Theme switch completes in < 100ms
7. All pages and components render correctly in both themes
8. Color contrast ratios meet WCAG 2.1 AA in both modes
9. Mobile menu includes theme toggle with 44x44px tap target
10. Zero regression in Lighthouse accessibility score

## Deployment Considerations

**Platform Dependencies**: None
**Environment Variables**: None
**Breaking Changes**: No
**Migration Required**: No
**Rollback Considerations**: Standard 3-command rollback

## Design Notes

### Icon Semantics
- Show Moon icon in light mode (indicating "switch to dark")
- Show Sun icon in dark mode (indicating "switch to light")
- This matches user mental model: icon shows destination state

### Toggle Variants (Choose One)
**Option A: Two-state toggle (Recommended)**
- Click cycles between light and dark only
- System preference used on first visit, then user choice persists
- Simpler UX, fewer states to explain

**Option B: Three-state toggle (Future Enhancement)**
- Click cycles: system → light → dark → system
- Requires additional UI to show "system" state
- More flexible but more complex

**Decision**: Use Option A for initial implementation

### Accessibility Patterns
```typescript
<button
  onClick={toggleTheme}
  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  className="theme-toggle"
>
  {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
</button>
```

## Assumptions

1. next-themes localStorage persistence works correctly (validated in research)
2. Existing CSS variables provide sufficient contrast in both modes
3. Code block syntax highlighting CSS supports both themes (validated - already implemented)
4. Users understand Sun/Moon iconography for theme switching
5. Two-state toggle (light/dark only) meets user needs initially

## Questions for Clarification

None. Requirements are clear from GitHub Issue #23 and existing codebase analysis.

## References

- GitHub Issue #23: Dark/Light Mode Toggle
- next-themes documentation: https://github.com/pacocoursey/next-themes
- WCAG 2.1 Contrast Requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Existing code: components/layout/Header.tsx, app/layout.tsx, app/globals.css
