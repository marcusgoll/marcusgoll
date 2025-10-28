# Data Model: dark-light-mode-toggle

## Overview

This feature is **client-side only** with no database entities. Theme state is managed entirely in the browser via localStorage by next-themes.

## Client-Side State

### Theme State (managed by next-themes)
**Storage**: localStorage
**Key**: `theme`
**Values**: `"light"` | `"dark"` | `"system"`

**State Shape**:
```typescript
// From next-themes useTheme hook
interface ThemeState {
  theme: string | undefined;           // Current theme selection ("light" | "dark" | "system")
  resolvedTheme: string | undefined;   // Actual rendered theme accounting for system preference
  systemTheme: string | undefined;     // OS preference ("light" | "dark")
  setTheme: (theme: string) => void;   // Theme setter function
  themes: string[];                    // Available themes ["light", "dark"]
}
```

### Component State
**Scope**: ThemeToggle component (stateless)
**Pattern**: Reads current theme via `useTheme()`, toggles via `setTheme()`

```typescript
// ThemeToggle component interface
interface ThemeToggleProps {
  className?: string;  // Optional Tailwind classes for positioning
}
```

## Persistence Strategy

**Mechanism**: next-themes automatic localStorage persistence
- **Write trigger**: `setTheme()` call
- **Read trigger**: Initial page load, ThemeProvider mount
- **Key**: `theme` (next-themes default)
- **Scope**: per-origin (localStorage is domain-scoped)
- **Fallback**: If localStorage blocked, theme persists for session only (in-memory)

**SSR Hydration**:
- `suppressHydrationWarning` on `<html>` tag prevents flash
- ThemeProvider applies theme class before React hydration
- Script tag in document head reads localStorage and sets class synchronously

## Data Flow

```
User clicks ThemeToggle
  ↓
setTheme("dark") called
  ↓
next-themes updates localStorage
  ↓
next-themes adds .dark class to <html>
  ↓
CSS custom properties cascade
  ↓
Visual theme change (200-300ms transition)
```

## No Database Schema

No backend persistence. No user accounts or per-user preferences (future enhancement).

## Validation Rules

- **Theme value**: Must be "light" or "dark" (two-state toggle for initial release)
- **Transition**: Disabled via `disableTransitionOnChange` to prevent FOUC
- **System detection**: Enabled via `enableSystem` prop on ThemeProvider

## Error Conditions

| Condition | Behavior | Mitigation |
|-----------|----------|------------|
| localStorage blocked | Theme resets on page reload | Show warning (future enhancement) |
| next-themes not loaded | Component renders but `useTheme()` returns undefined | Guard with optional chaining |
| Invalid theme value in localStorage | Falls back to defaultTheme="light" | next-themes handles automatically |

## Browser Compatibility

- localStorage: Supported in all modern browsers (IE11+ legacy support not required per spec.md)
- prefers-color-scheme: Supported in all browsers Next.js 15 targets
- CSS custom properties: Universal support
