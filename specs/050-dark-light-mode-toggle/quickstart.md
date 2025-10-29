# Quickstart: dark-light-mode-toggle

## Scenario 1: Initial Setup

No setup required - feature uses existing infrastructure.

**Verify prerequisites**:
```bash
# Confirm next-themes installed
grep "next-themes" package.json

# Confirm lucide-react installed
grep "lucide-react" package.json

# Confirm ThemeProvider configured
grep "ThemeProvider" app/layout.tsx

# Confirm dark mode CSS variables exist
grep "\.dark" app/globals.css
```

Expected: All dependencies and infrastructure already in place.

---

## Scenario 2: Development Workflow

**Start development server**:
```bash
# Kill any existing processes on ports 3000-3002
npx kill-port 3000 3001 3002

# Clean npm cache
npm cache clean --force

# Start dev server
npm run dev
```

**Access application**:
- Navigate to: http://localhost:3000
- Verify theme toggle appears in header (desktop) and mobile menu
- Click toggle to switch between light and dark modes
- Reload page to verify theme persists

---

## Scenario 3: Component Development

**Create ThemeToggle component**:
```typescript
// components/ui/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </Button>
  );
}
```

**Integrate into Header (Desktop)**:
```typescript
// components/layout/Header.tsx (line ~143)
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Inside desktop navigation div
<div className="hidden items-center space-x-6 md:flex">
  {/* Existing nav links */}
  <ThemeToggle className="ml-4" />
</div>
```

**Integrate into Header (Mobile)**:
```typescript
// components/layout/Header.tsx (line ~253, end of mobile menu)
{mobileMenuOpen && (
  <div className="border-t border-gray-700 bg-navy-900 md:hidden">
    <div className="space-y-1 px-4 py-3">
      {/* Existing mobile nav links */}
      <div className="border-t border-gray-700 pt-2 mt-2">
        <ThemeToggle />
      </div>
    </div>
  </div>
)}
```

---

## Scenario 4: Manual Testing

**Test theme switching**:
1. Navigate to: http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Application tab → Local Storage
4. Verify initial theme:
   - Light mode: `theme: "light"` (or no entry if using system default)
   - Dark mode: `theme: "dark"`

**Test persistence**:
1. Click theme toggle button in header
2. Verify:
   - Page theme switches immediately (<100ms)
   - localStorage `theme` value updates
   - `<html>` element gains/loses `.dark` class
3. Reload page (Ctrl+R)
4. Verify:
   - Theme persists after reload
   - No flash of unstyled content (FOUC)

**Test system preference**:
1. Clear localStorage (Application tab → Clear)
2. Change OS theme preference:
   - Windows: Settings → Personalization → Colors → Light/Dark
   - macOS: System Preferences → General → Appearance → Light/Dark
   - Linux: Varies by desktop environment
3. Reload page
4. Verify site matches OS theme

**Test keyboard accessibility**:
1. Click in browser address bar
2. Press Tab repeatedly until theme toggle button is focused
3. Verify visible focus indicator (ring)
4. Press Enter or Space
5. Verify theme toggles
6. Verify focus remains on button

**Test mobile menu**:
1. Resize browser to <768px width (or use DevTools device emulation)
2. Tap hamburger menu icon
3. Verify theme toggle visible in menu
4. Tap theme toggle
5. Verify theme switches
6. Verify menu remains open

---

## Scenario 5: Validation

**Run type checking**:
```bash
npx tsc --noEmit
```

Expected: No TypeScript errors in ThemeToggle or Header components.

**Run linter**:
```bash
npm run lint
```

Expected: No ESLint errors or warnings.

**Run component tests** (if implemented):
```bash
# Vitest
npx vitest run components/ui/theme-toggle.test.tsx

# Or Jest
npm test -- theme-toggle
```

Expected: All component tests pass.

**Run E2E tests** (if implemented):
```bash
# Playwright
npx playwright test theme-toggle.spec.ts
```

Expected: Theme toggle E2E tests pass.

---

## Scenario 6: Accessibility Validation

**Screen reader testing** (Windows):
1. Enable Windows Narrator (Win+Ctrl+Enter)
2. Navigate to theme toggle button (Tab key)
3. Verify Narrator announces:
   - "Switch to dark mode, button" (in light mode)
   - "Switch to light mode, button" (in dark mode)
4. Press Enter or Space
5. Verify theme switches

**Screen reader testing** (macOS)**:
1. Enable VoiceOver (Cmd+F5)
2. Navigate to theme toggle button (Tab or Ctrl+Option+Arrow)
3. Verify VoiceOver announces:
   - "Switch to dark mode, button"
   - "Switch to light mode, button"
4. Press Ctrl+Option+Space
5. Verify theme switches

**Color contrast validation**:
1. Use browser DevTools color picker
2. Verify icon color contrast:
   - Light mode: White icon (#FFFFFF) on navy background (#0F172A) = 18:1 ratio ✅
   - Dark mode: White icon (#FFFFFF) on dark background (#2E2E2E) = 14:1 ratio ✅
3. Verify hover state (emerald-600) meets 4.5:1 minimum

**Touch target validation**:
1. Use browser DevTools ruler (Chrome: Ctrl+Shift+C)
2. Measure toggle button:
   - Desktop: ≥40x40px ✅
   - Mobile: ≥44x44px ✅

---

## Scenario 7: Performance Validation

**Measure toggle response time**:
1. Open browser DevTools Performance tab
2. Start recording
3. Click theme toggle button
4. Stop recording after theme switches
5. Analyze timeline:
   - Click event → setTheme call: <10ms
   - setTheme → class update: <20ms
   - Class update → CSS repaint: <70ms
   - Total: <100ms ✅

**Measure bundle size impact**:
```bash
# Build production bundle
npm run build

# Check bundle analysis (if configured)
# Look for theme-toggle chunk size
```

Expected: ThemeToggle component adds <2KB to bundle (well under 5KB requirement).

**Lighthouse audit**:
```bash
# Run Lighthouse in DevTools (or via CLI)
npx lighthouse http://localhost:3000 --view
```

Expected:
- Performance: ≥85 (no degradation)
- Accessibility: ≥95 (maintained or improved)
- Best Practices: ≥90 (no change)
- SEO: ≥90 (no change)

---

## Scenario 8: Edge Cases

**Test localStorage blocked**:
1. Block localStorage in browser settings:
   - Chrome: DevTools → Application → Local Storage → Right-click → Block
   - Firefox: about:config → dom.storage.enabled → false
2. Reload page
3. Click theme toggle
4. Verify:
   - Theme switches for current session
   - Theme resets on page reload (expected behavior)

**Test with JavaScript disabled**:
1. Disable JavaScript in browser settings
2. Reload page
3. Verify:
   - Site defaults to light mode (defaultTheme="light")
   - Toggle button not visible (requires JS)
   - Content still readable (graceful degradation)

**Test rapid clicking**:
1. Click theme toggle button 10+ times rapidly
2. Verify:
   - No console errors
   - Theme toggles correctly
   - localStorage updates correctly
   - No visual glitches or flash

---

## Troubleshooting

**Theme not switching**:
- Check: `useTheme()` returns valid theme object (not undefined)
- Check: ThemeProvider is wrapping app in layout.tsx
- Check: `next-themes` is installed (`npm ls next-themes`)

**Theme not persisting**:
- Check: localStorage is not blocked in browser
- Check: localStorage key is "theme" (next-themes default)
- Check: No errors in browser console

**Icons not displaying**:
- Check: `lucide-react` is installed (`npm ls lucide-react`)
- Check: Sun and Moon icons are imported correctly
- Check: Icon size prop is valid (e.g., size={24})

**Flash of unstyled content (FOUC)**:
- Check: `suppressHydrationWarning` on `<html>` tag in layout.tsx
- Check: `disableTransitionOnChange` prop on ThemeProvider
- Check: Dark mode CSS variables are defined in globals.css

**Button styling incorrect**:
- Check: Button component is imported from @/components/ui/Button
- Check: ghost variant is specified
- Check: icon size is specified
- Check: Tailwind classes are being applied (not purged by build)
