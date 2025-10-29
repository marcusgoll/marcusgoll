# Implementation Plan: Dark/Light Mode Toggle

## [RESEARCH DECISIONS]

See: research.md for full research findings

**Summary**:
- Stack: Next.js 15.5.6, next-themes 0.4.6, lucide-react 0.546.0, shadcn/ui Button pattern
- Components to reuse: 6 (next-themes, lucide-react icons, Button primitive, cn utility, CSS variables, Header structure)
- New components needed: 1 (ThemeToggle component)
- Zero dependencies to add - all required packages already installed

**Key Research Findings**:
1. next-themes infrastructure complete - ThemeProvider configured with system detection, localStorage persistence, SSR hydration
2. Dark mode CSS custom properties already defined in globals.css (OKLCH color space)
3. Button component uses class-variance-authority with ghost variant suitable for header
4. Header.tsx has clear desktop and mobile navigation structure ready for integration
5. Code block syntax highlighting already supports theme switching via CSS media queries

---

## [ARCHITECTURE DECISIONS]

**Stack**:
- Frontend: Next.js 15.5.6 App Router (existing)
- Theme Library: next-themes 0.4.6 (existing)
- Icons: lucide-react 0.546.0 (existing)
- Styling: Tailwind CSS 4.1.15 with OKLCH custom properties (existing)
- Component Pattern: Shadcn/ui style with class-variance-authority (existing)
- State Management: next-themes useTheme hook (client-side only, no server state)

**Patterns**:
- **Icon-only toggle button**: Sun/Moon icons show destination state (Moon = switch to dark, Sun = switch to light). Industry standard pattern, minimal header space usage.
- **Two-state toggle**: Click cycles between light and dark only. System preference respected on first visit, then user choice persists. Three-way toggle (light/dark/system) deferred to future enhancement.
- **Ghost button variant**: Transparent background, hover emerald accent, matches existing nav link styling in Header.
- **Dual placement**: Desktop navigation (right side after nav links), Mobile menu (bottom of hamburger menu items). Follows conventional utility placement patterns.
- **CSS custom property theming**: Relies on .dark class toggle on <html> element. No inline styles, no JavaScript style manipulation.

**Dependencies** (new packages required):
None - all required packages already installed (next-themes, lucide-react, existing Button component)

**Bundle Size Impact**:
- ThemeToggle component: ~1KB estimated
- No new dependencies: 0KB
- Total increase: <2KB (well within NFR-002 requirement of <5KB)

---

## [STRUCTURE]

**Directory Layout** (follow existing patterns):

```
components/
├── ui/
│   ├── theme-toggle.tsx          # NEW - ThemeToggle component
│   └── Button.tsx                # EXISTING - Reuse for toggle button
├── layout/
│   ├── Header.tsx                # MODIFIED - Add toggle to desktop and mobile nav
│   └── Footer.tsx                # NO CHANGES
└── theme-provider.tsx            # NO CHANGES
```

**Module Organization**:
- **ThemeToggle component**: Standalone UI component, no internal state, uses next-themes useTheme hook
- **Header integration**: Add ThemeToggle to desktop nav (line ~143) and mobile menu (line ~253)
- **No layout.tsx changes**: ThemeProvider already configured correctly

---

## [DATA MODEL]

See: data-model.md for complete state shape

**Summary**:
- Entities: 0 (client-side only, no database)
- State management: next-themes localStorage (`theme` key)
- Component state: Stateless (reads from useTheme hook)
- Migrations required: No

**Theme State**:
```typescript
// From next-themes useTheme hook
const { theme, setTheme, resolvedTheme } = useTheme();
// theme: "light" | "dark" | "system"
// resolvedTheme: "light" | "dark" (accounts for system preference)
```

---

## [PERFORMANCE TARGETS]

**From spec.md NFRs**:
- NFR-002: Toggle response time <100ms (target: instant visual feedback via CSS transition)
- NFR-002: JavaScript bundle increase <5KB (achieved: ~1KB for ThemeToggle component)
- NFR-002: CSS transitions use GPU-accelerated properties (opacity, transform)
- NFR-002: No CLS (Cumulative Layout Shift) when toggling theme

**Lighthouse Targets** (from previous features):
- Performance: ≥85 (no change expected - minimal JS)
- Accessibility: ≥95 (maintain with proper ARIA labels)
- Best Practices: ≥90 (no change)
- SEO: ≥90 (no change)

**CSS Transition Performance**:
- Use `transition: color 200ms ease-in-out` on color properties
- Avoid `transition: all` (causes reflow)
- No background image transitions (stick to colors only)

---

## [SECURITY]

**Authentication Strategy**:
None required - feature is unauthenticated, available to all visitors

**Authorization Model**:
None - theme preference is client-side only

**Input Validation**:
- Theme value: Validated by next-themes (only accepts "light" | "dark" | "system")
- No user input - click handler calls `setTheme()` with hardcoded string

**Data Protection**:
- No PII: Theme preference is non-sensitive
- localStorage scope: Per-origin (cannot leak across domains)
- No server persistence: No backend API calls

**Attack Surface**:
- XSS: Not applicable (no user input, no dangerouslySetInnerHTML)
- CSRF: Not applicable (no server mutations)
- localStorage poisoning: Mitigated by next-themes validation (invalid values fallback to defaultTheme)

---

## [EXISTING INFRASTRUCTURE - REUSE] (6 components)

**Services/Libraries**:
- next-themes 0.4.6: Theme state management, localStorage persistence, SSR hydration, system preference detection
- lucide-react 0.546.0: Sun and Moon icons

**UI Components**:
- components/ui/Button.tsx: Base button primitive with ghost variant, focus states, accessibility (h-9 w-9 icon size)
- lib/utils.ts: cn() utility for conditional class merging

**CSS Infrastructure**:
- app/globals.css:7-75: Light mode CSS custom properties (--bg, --text, --primary in OKLCH)
- app/globals.css:104-138: Dark mode CSS custom properties (.dark class overrides)

**Layout Components**:
- components/layout/Header.tsx: Desktop navigation (line 29-143), Mobile menu (line 177-256)

---

## [NEW INFRASTRUCTURE - CREATE] (1 component)

**Frontend**:
- components/ui/theme-toggle.tsx: ThemeToggle component
  - **Functionality**: Icon-only button that toggles between light and dark themes
  - **State**: Stateless, reads theme via useTheme(), toggles via setTheme()
  - **Icons**: Sun (dark mode, destination = light), Moon (light mode, destination = dark)
  - **Accessibility**:
    - ARIA label: "Switch to dark mode" (light mode) / "Switch to light mode" (dark mode)
    - Keyboard: Enter/Space activation (inherited from Button)
    - Focus indicator: Visible ring in both themes
  - **Styling**: Button ghost variant, 40x40px touch target (24x24px icon), hover emerald-600
  - **Props**: Optional className for positioning
  - **Estimated size**: ~1KB

**Header Modifications**:
- components/layout/Header.tsx (Desktop nav - line ~143):
  ```tsx
  <ThemeToggle className="ml-4" />
  ```
- components/layout/Header.tsx (Mobile menu - line ~253):
  ```tsx
  <div className="border-t border-gray-700 pt-2 mt-2">
    <ThemeToggle />
  </div>
  ```

---

## [CI/CD IMPACT]

**From spec.md deployment considerations:**
- Platform: Vercel (existing Next.js deployment)
- Env vars: None required
- Breaking changes: No
- Migration: No

**Build Commands**:
No changes - `next build` works as-is

**Environment Variables**:
None required - theme system is client-side only

**Database Migrations**:
No - client-side feature only

**Smoke Tests** (for deploy-staging.yml):
- Route: / (homepage)
- Expected:
  - Theme toggle button visible in header
  - Clicking toggle switches theme immediately
  - Preference persists on page reload
  - No console errors
  - Lighthouse accessibility score ≥95

**Platform Coupling**:
- Vercel: None - feature uses standard Next.js App Router patterns
- Dependencies: None - no new packages
- Build: None - no build configuration changes

---

## [DEPLOYMENT ACCEPTANCE]

**Production Invariants** (must hold true):
- Theme toggle renders on every page with Header
- Theme preference persists across browser sessions (localStorage)
- No flash of unstyled content (FOUC) on page load
- Theme switch completes in <100ms
- Accessibility: ARIA labels present, keyboard navigable, focus visible

**Staging Smoke Tests** (Given/When/Then):
```gherkin
Scenario: First-time visitor respects system preference
  Given user has OS set to dark mode
  And user has never visited the site before
  When user loads homepage
  Then site displays in dark mode
  And toggle button shows Sun icon
  And localStorage has "theme": "dark"

Scenario: Manual theme toggle overrides system preference
  Given user is viewing site in light mode
  When user clicks theme toggle button
  Then site switches to dark mode immediately
  And toggle button changes to Sun icon
  And localStorage updates to "theme": "dark"
  And page reload maintains dark mode

Scenario: Keyboard accessibility
  Given user is navigating with keyboard
  When user tabs to theme toggle button
  Then button receives visible focus indicator
  When user presses Enter
  Then theme switches successfully
  And focus remains on toggle button

Scenario: Mobile menu toggle
  Given user is on mobile viewport (<768px)
  When user taps hamburger menu
  Then mobile menu opens with theme toggle visible
  When user taps theme toggle
  Then theme switches immediately
  And mobile menu remains open
```

**Rollback Plan**:
- Deploy IDs tracked in: specs/050-dark-light-mode-toggle/NOTES.md
- Rollback commands: Standard 3-command Vercel rollback (no special considerations)
- Special considerations: None - no database, no env vars, no breaking changes

**Artifact Strategy** (build-once-promote-many):
- Web (App): Vercel prebuilt artifact (.vercel/output/)
- Build in: .github/workflows/verify.yml (if exists, or local build)
- Deploy to staging: Vercel automatic deployment from feature branch
- Promote to production: Merge to main → automatic production deployment

---

## [INTEGRATION SCENARIOS]

See: quickstart.md for complete integration scenarios

**Summary**:
- Initial setup: No setup required - feature is self-contained
- Validation workflow: Visual testing + Playwright tests
- Manual testing: Click toggle on homepage, verify theme switch + persistence

---

## [TESTING STRATEGY]

**Component Tests** (Vitest + React Testing Library):
```typescript
// tests/components/ui/theme-toggle.test.tsx
describe('ThemeToggle', () => {
  it('renders Moon icon in light mode', () => {});
  it('renders Sun icon in dark mode', () => {});
  it('calls setTheme("dark") when clicked in light mode', () => {});
  it('calls setTheme("light") when clicked in dark mode', () => {});
  it('has correct ARIA label for current theme', () => {});
  it('is keyboard accessible (Enter/Space)', () => {});
});
```

**Integration Tests** (Playwright):
```typescript
// tests/e2e/theme-toggle.spec.ts
test('theme toggle works on homepage', async ({ page }) => {
  await page.goto('/');
  // Verify initial theme from system preference
  // Click toggle button
  // Verify theme class on <html>
  // Reload page
  // Verify theme persists
});
```

**Accessibility Tests**:
- ARIA labels present and correct
- Keyboard navigation (Tab to focus, Enter/Space to activate)
- Focus indicator visible in both themes
- Color contrast meets WCAG 2.1 AA (already validated in research)

**Visual Regression**:
- Capture screenshots of toggle button in light and dark modes
- Verify hover states
- Verify focus states

---

## [ACCESSIBILITY REQUIREMENTS]

**WCAG 2.1 AA Compliance** (NFR-001):
- 1.4.3 Contrast (Minimum): Button icon contrast ≥4.5:1 in both themes
- 2.1.1 Keyboard: Tab, Enter, Space all functional
- 2.4.7 Focus Visible: Focus ring visible in both themes
- 4.1.2 Name, Role, Value: ARIA label announces toggle action and destination state

**Screen Reader Announcements**:
- Light mode: "Switch to dark mode, button"
- Dark mode: "Switch to light mode, button"
- After click: No announcement (visual feedback only, future enhancement could add live region)

**Touch Targets** (Mobile):
- Desktop: 40x40px minimum (spec.md FR-002)
- Mobile: 44x44px minimum (spec.md FR-003, iOS Human Interface Guidelines)

---

## [IMPLEMENTATION CHECKLIST]

**Phase 1: Component Creation**
- [ ] Create components/ui/theme-toggle.tsx
- [ ] Implement useTheme hook integration
- [ ] Add Sun/Moon icons from lucide-react
- [ ] Add ARIA labels for accessibility
- [ ] Style with Button ghost variant + custom classes
- [ ] Test component in isolation

**Phase 2: Header Integration - Desktop**
- [ ] Import ThemeToggle in components/layout/Header.tsx
- [ ] Add to desktop navigation (after nav links)
- [ ] Verify styling matches header (white icon, emerald hover)
- [ ] Verify 40x40px touch target

**Phase 3: Header Integration - Mobile**
- [ ] Add ThemeToggle to mobile menu
- [ ] Verify 44x44px touch target
- [ ] Test that menu remains open after theme toggle

**Phase 4: Testing**
- [ ] Write component tests
- [ ] Write Playwright E2E tests
- [ ] Manual accessibility testing (keyboard, screen reader)
- [ ] Visual regression testing (light/dark/hover/focus states)

**Phase 5: Documentation**
- [ ] Update NOTES.md with implementation summary
- [ ] Add code comments explaining theme toggle behavior
- [ ] Update README if theme documentation section exists

---

## [KNOWN CONSTRAINTS]

**Technical Limitations**:
- Theme is client-side only - no server-side rendering of user preference (SSR shows defaultTheme="light" initially)
- localStorage can be blocked - theme resets on reload if user disables storage
- System preference detection requires modern browser (Next.js 15 already requires modern browsers)

**Browser Support**:
- Next.js 15 targets: Modern browsers (Chrome 64+, Firefox 67+, Safari 12+, Edge 79+)
- prefers-color-scheme: Supported in all targeted browsers
- localStorage: Supported in all targeted browsers

**Future Enhancements** (explicitly out of scope for this release):
- Three-way toggle (light/dark/system)
- Per-page theme preferences
- Scheduled theme switching (time-based)
- Theme customization (custom colors)
- Animated theme transitions (beyond CSS transitions)
- Theme preview before applying
