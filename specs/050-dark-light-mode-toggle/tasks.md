# Tasks: Dark/Light Mode Toggle

## [CODEBASE REUSE ANALYSIS]
Scanned: D:/Coding/marcusgoll

**[EXISTING - REUSE]**
- ✅ next-themes 0.4.6 - ThemeProvider configured in app/layout.tsx
- ✅ Button component (components/ui/Button.tsx) - Ghost variant with focus states
- ✅ lucide-react 0.546.0 - Sun and Moon icons
- ✅ cn utility (lib/utils.ts) - Class merging for conditional styles
- ✅ CSS variables (app/globals.css) - Light mode (lines 7-75), Dark mode (lines 104-138)
- ✅ Header component (components/layout/Header.tsx) - Desktop nav (line 29-143), Mobile menu (line 177-256)

**[NEW - CREATE]**
- 🆕 ThemeToggle component (components/ui/theme-toggle.tsx) - No existing pattern for theme toggles

## [DEPENDENCY GRAPH]
Task completion order:
1. Phase 1: Setup (T001) - Project structure validation
2. Phase 2: Component Creation (T002-T004) - ThemeToggle component [Parallel after T001]
3. Phase 3: Integration (T005-T006) - Header modifications [Depends on T004]
4. Phase 4: Testing (T007-T009) - Component and E2E tests [Parallel after T006]
5. Phase 5: Documentation (T010) - Implementation summary [After all tests pass]

## [PARALLEL EXECUTION OPPORTUNITIES]
- Phase 2: T002, T003, T004 can be done sequentially (same file)
- Phase 3: T005, T006 (different sections of Header.tsx, can be done together)
- Phase 4: T007, T008, T009 (different test files, fully parallel)

## [IMPLEMENTATION STRATEGY]
**MVP Scope**: Complete feature (single user story)
**Incremental delivery**: Component → Desktop integration → Mobile integration → Tests → Ship
**Testing approach**: Component tests + E2E tests for persistence and accessibility

---

## Phase 1: Setup

- [ ] T001 Validate project structure and dependencies per plan.md
  - Verify: next-themes, lucide-react, Button component exist
  - Files: package.json, components/ui/Button.tsx, components/theme-provider.tsx
  - Pattern: Standard Next.js 15 project structure
  - From: plan.md [ARCHITECTURE DECISIONS]

---

## Phase 2: Component Creation

**Goal**: Create ThemeToggle component with icon-only toggle behavior

- [ ] T002 Create ThemeToggle component in components/ui/theme-toggle.tsx
  - File: components/ui/theme-toggle.tsx
  - Features: useTheme hook integration, Sun/Moon icons, icon-only toggle
  - REUSE: Button component (components/ui/Button.tsx), lucide-react icons
  - Pattern: components/ui/Button.tsx for component structure
  - From: plan.md [NEW INFRASTRUCTURE - CREATE]

- [ ] T003 [P] Add ARIA labels and keyboard accessibility to ThemeToggle
  - File: components/ui/theme-toggle.tsx
  - ARIA: "Switch to dark mode" (light) / "Switch to light mode" (dark)
  - Keyboard: Enter/Space activation (inherited from Button)
  - Pattern: Button component ARIA patterns
  - From: plan.md [ACCESSIBILITY REQUIREMENTS]

- [ ] T004 [P] Style ThemeToggle with ghost variant and responsive sizing
  - File: components/ui/theme-toggle.tsx
  - Desktop: h-9 w-9 (40x40px touch target), 24x24px icon
  - Mobile: h-11 w-11 (44x44px touch target), 24x24px icon
  - Hover: emerald-600 accent color
  - REUSE: Button ghost variant, cn utility
  - Pattern: Header nav link hover states
  - From: spec.md FR-002, FR-003

---

## Phase 3: Integration

**Goal**: Add ThemeToggle to desktop and mobile navigation

- [ ] T005 Add ThemeToggle to desktop navigation in Header.tsx
  - File: components/layout/Header.tsx (line ~143, after nav links)
  - Position: Right side, ml-4 spacing
  - Styling: White icon, emerald-600 hover
  - REUSE: Existing desktop nav structure (lines 29-143)
  - Pattern: Header desktop nav links
  - From: plan.md [HEADER MODIFICATIONS]

- [ ] T006 Add ThemeToggle to mobile navigation in Header.tsx
  - File: components/layout/Header.tsx (line ~253, bottom of mobile menu)
  - Position: Separate section with border-t, pt-2, mt-2
  - Behavior: Menu remains open after theme toggle
  - REUSE: Existing mobile menu structure (lines 177-256)
  - Pattern: Mobile menu link items
  - From: plan.md [HEADER MODIFICATIONS]

---

## Phase 4: Testing

**Goal**: Validate component behavior, accessibility, and persistence

- [ ] T007 [P] Write component tests for ThemeToggle
  - File: tests/components/ui/theme-toggle.test.tsx (create directory if needed)
  - Tests: Icon rendering (Moon in light, Sun in dark), click handler, ARIA labels
  - Coverage: 100% (new code requirement)
  - Pattern: Standard Vitest + React Testing Library patterns
  - From: plan.md [TESTING STRATEGY]

- [ ] T008 [P] Write E2E tests for theme persistence
  - File: tests/e2e/theme-toggle.spec.ts (create directory if needed)
  - Tests: Toggle click, localStorage persistence, page reload, system preference
  - Real browser: Playwright
  - Pattern: Standard Playwright E2E structure
  - From: plan.md [DEPLOYMENT ACCEPTANCE] smoke tests

- [ ] T009 [P] Write accessibility tests for keyboard and screen reader
  - File: tests/e2e/theme-toggle-a11y.spec.ts
  - Tests: Tab focus, Enter/Space activation, focus indicator, ARIA announcements
  - Tooling: Playwright + axe-core
  - Pattern: WCAG 2.1 AA compliance testing
  - From: spec.md NFR-001, plan.md [ACCESSIBILITY REQUIREMENTS]

---

## Phase 5: Documentation

**Goal**: Document implementation and update NOTES.md

- [ ] T010 Update NOTES.md with implementation summary
  - File: specs/050-dark-light-mode-toggle/NOTES.md
  - Content: Tasks completed, files changed, test results, deployment readiness
  - From: Workflow standard practice

---

## [TEST GUARDRAILS]

**Speed Requirements:**
- Component tests: <2s each
- E2E tests: <30s each
- Full suite: <2 min total

**Coverage Requirements:**
- New code: 100% coverage (ThemeToggle component)
- Component tests: Cover all branches (light/dark states, click handlers)
- E2E tests: Critical path (toggle, persist, reload)

**Measurement:**
- TypeScript: `npm test -- --coverage`
- E2E: `npm run test:e2e`

**Quality Gates:**
- All tests must pass before merge
- Coverage: 100% on new ThemeToggle component
- No accessibility violations (axe-core)

**Clarity Requirements:**
- One behavior per test
- Descriptive names: `test_theme_toggle_switches_from_light_to_dark()`
- Given-When-Then structure in test body

**Anti-Patterns:**
- ❌ NO UI snapshots (brittle, break on CSS changes)
- ❌ NO "prop-mirror" tests (test behavior, not implementation)
- ✅ USE role/text queries (accessible, resilient)
- ✅ USE getByRole('button', { name: /switch to dark mode/i })

**Examples:**
```typescript
// ❌ Bad: Prop-mirror test
expect(component.props.theme).toBe('dark')

// ✅ Good: Behavior test
expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()

// ❌ Bad: Implementation detail
expect(mockSetTheme).toHaveBeenCalledWith('dark')

// ✅ Good: User outcome
const htmlElement = document.documentElement
expect(htmlElement.classList.contains('dark')).toBe(true)
```
