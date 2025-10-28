# Feature: Dark/Light Mode Toggle

## Overview
Implement a user-facing theme toggle button to complement the existing next-themes infrastructure. The theme system is already integrated (ThemeProvider, CSS variables, system preference detection), but users currently have no UI control to manually switch themes.

## Research Findings

### Tech Stack Analysis
**Source**: package.json, app/layout.tsx

- **Framework**: Next.js 15.5.6
- **Theme Package**: next-themes 0.4.6 (already installed)
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Icons**: lucide-react 0.546.0
- **Styling**: Tailwind CSS with OKLCH color space

### Existing Theme Infrastructure
**Source**: app/layout.tsx, components/theme-provider.tsx, app/globals.css

✅ **Already Implemented**:
- ThemeProvider configured with `attribute="class"`, `defaultTheme="light"`, `enableSystem`
- `suppressHydrationWarning` on `<html>` tag (prevents flash)
- Dark mode CSS variables defined in globals.css
- System preference detection enabled
- Code block syntax highlighting theme switching

❌ **Missing**:
- User-facing toggle UI component
- Toggle placement in Header/navigation
- Accessibility markup for theme toggle
- User preference persistence (next-themes handles this automatically via localStorage)

### CSS Theme Variables
**Source**: app/globals.css

**Light Mode Palette**:
- Background: oklch(1 0 0) - Pure white
- Text: oklch(0.15 0 0) - High contrast black
- Primary: oklch(0.45 0.18 270) - Stripe purple
- Borders: oklch(0.92 0 0) - Light gray

**Dark Mode Palette**:
- Background: oklch(0.19 0 0) - Dark gray
- Text: oklch(0.98 0 0) - High contrast white
- Primary: oklch(0.58 0.10 270) - Desaturated purple
- Borders: oklch(0.34 0 0) - Subtle gray

### Navigation Structure
**Source**: components/layout/Header.tsx

- Sticky header with Navy 900 background
- Desktop: Horizontal navigation with dropdowns
- Mobile: Hamburger menu
- Logo on left, nav links on right
- Currently no theme toggle present

**Optimal Placement**: Right side of desktop nav (after nav links), inside mobile menu

### Similar Implementations
**Industry Pattern**: Sun/Moon icon toggle
- Light mode: Sun icon
- Dark mode: Moon icon
- Common pattern: Single button that shows opposite state icon
- Accessibility: Include "Switch to dark/light mode" label for screen readers

### Contrast Validation
**From Issue #23**: WCAG 2.1 AA contrast ratios required
- Light mode: Dark text on light background ✅ (21:1 ratio)
- Dark mode: Light text on dark background ✅ (19:1 ratio)
- Purple accent: Needs validation in both modes

## Feature Classification
- UI screens: true (toggle component in header)
- Improvement: false (new feature, not improving existing)
- Measurable: false (no user behavior metrics to track)
- Deployment impact: false (no infrastructure changes)

## System Components Analysis

**Reusable Components**:
- Button primitive (from shadcn/ui pattern)
- lucide-react icons (Sun, Moon)

**New Components Needed**:
- ThemeToggle component (new)
  - Location: components/ui/theme-toggle.tsx
  - Uses: next-themes useTheme hook
  - Icons: lucide-react Sun/Moon
  - Accessibility: ARIA labels, keyboard support

**Integration Points**:
- Header.tsx: Add toggle to desktop nav and mobile menu
- Existing ThemeProvider: Already configured, no changes needed

## Key Decisions

1. **Use next-themes exclusively**: Already integrated, handles system detection, localStorage persistence, SSR hydration
2. **Icon choice**: Sun (light mode) / Moon (dark mode) - industry standard
3. **Toggle behavior**: Click to cycle between system/light/dark OR simple light/dark toggle
4. **Placement**: Header navigation (desktop and mobile)
5. **No code block changes needed**: Syntax highlighting already supports theme switching via CSS media queries

## Checkpoints
- Phase 0 (Specification): 2025-10-28

## Last Updated
2025-10-28T18:30:00Z

## Phase 2: Tasks (2025-10-28 19:45)

**Summary**:
- Total tasks: 10
- Parallel opportunities: 5 tasks marked [P]
- Setup tasks: 1 (dependency validation)
- Component creation: 3 tasks (T002-T004)
- Integration: 2 tasks (T005-T006)
- Testing: 3 tasks (T007-T009, fully parallel)
- Documentation: 1 task (T010)
- Task file: specs/050-dark-light-mode-toggle/tasks.md

**Checkpoint**:
- ✅ Tasks generated: 10
- ✅ Dependency graph: Created (5 phases)
- ✅ Parallel execution opportunities: Identified (T002-T004, T007-T009)
- ✅ Reuse analysis: 6 existing components identified
- ✅ New components: 1 (ThemeToggle)
- 📋 Ready for: /analyze

**Key Task Decisions**:
1. Single new component: ThemeToggle (~1KB estimated size)
2. Two integration points: Desktop nav (line 143) + Mobile menu (line 253)
3. Three test files: Component test + E2E persistence + E2E accessibility
4. Zero new dependencies: All required packages already installed
5. Test coverage: 100% requirement on new ThemeToggle component

## Phase 3: Analysis (2025-10-28 20:15)

**Summary**:
- Cross-artifact consistency validation completed
- All requirements mapped to tasks: 100% coverage
- Constitution alignment verified
- Zero critical, high, medium, or low severity issues found

**Findings**:
- Critical Issues: 0
- High Issues: 0
- Medium Issues: 0
- Low Issues: 0
- Total Requirements: 15 (6 FR + 4 NFR + 5 US)
- Tasks Created: 10
- Coverage: 100%

**Constitution Compliance**:
- Specification First: Spec created before implementation
- Testing Standards: 100% coverage planned (T007, T008, T009)
- Performance Requirements: NFR-002 defines <100ms, <5KB
- Accessibility: NFR-001 WCAG 2.1 AA compliance
- Security Practices: N/A (client-side only, no user input)
- Code Quality: TypeScript strict mode, shadcn/ui patterns
- Documentation Standards: T010 updates NOTES.md
- Do Not Overengineer: Reuses existing next-themes infrastructure

**Checkpoint**:
- Analysis report: specs/050-dark-light-mode-toggle/analysis-report.md
- Status: Ready for Implementation
- Blockers: None
- Warnings: None
- Next: /implement
