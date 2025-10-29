# Quickstart: Syntax Highlighting Enhancements

## Scenario 1: Initial Setup

```bash
# Install Shiki dependency
npm install shiki@^1.0.0

# Remove old dependency
npm uninstall rehype-highlight

# Verify installation
npm list shiki
# Expected: shiki@1.x.x

# Run build to test Shiki integration
npm run build
# Expected: Build succeeds, code blocks highlighted at build time
```

## Scenario 2: Development Testing

```bash
# Start development server
npm run dev

# Open test post with code examples
# Navigate to: http://localhost:3000/posts/[any-technical-post]

# Test scenarios:
# 1. Verify code blocks render with GitHub Dark theme (in dark mode)
# 2. Verify code blocks render with GitHub Light theme (in light mode)
# 3. Toggle system dark/light mode, verify theme switches
# 4. Check copy button still works (click, verify "Copied" feedback)
# 5. Test line numbers (if post uses showLineNumbers prop)
```

## Scenario 3: Creating Test Content

Create a test MDX file to verify all features:

```bash
# Create test file
cat > content/posts/syntax-highlighting-test.mdx <<'EOF'
---
slug: syntax-highlighting-test
title: "Syntax Highlighting Test"
excerpt: "Testing Shiki integration with all supported languages"
date: 2025-10-24
tags: ["Dev", "Testing"]
draft: true
---

## JavaScript Example

​```javascript
const greeting = "Hello, World!";
console.log(greeting);
​```

## Line Highlighting Example

​```typescript {1-2,4}
// These lines are highlighted
const name = "Marcus";

const greeting = `Hello, ${name}!`; // This line too
console.log(greeting); // Not highlighted
​```

## Filename Example

​```python title="fuel_calculation.py" showLineNumbers
def calculate_fuel_burn(distance_nm, fuel_flow_gph, groundspeed_kts):
    """Calculate fuel burn for a flight segment."""
    time_hours = distance_nm / groundspeed_kts
    fuel_burn_gal = time_hours * fuel_flow_gph
    return fuel_burn_gal

# Aviation example
burn = calculate_fuel_burn(100, 12.5, 120)
print(f"Fuel burn: {burn:.2f} gallons")
​```

## All Supported Languages

### Bash
​```bash
#!/bin/bash
echo "Testing bash syntax"
​```

### YAML
​```yaml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
​```

### JSON
​```json
{
  "name": "test",
  "version": "1.0.0"
}
​```

### Go
​```go
package main
import "fmt"
func main() {
    fmt.Println("Hello, Go!")
}
​```

### Rust
​```rust
fn main() {
    println!("Hello, Rust!");
}
​```

## Inline Code

This is inline code: `const x = 42;` - should have subtle background, no syntax highlighting.
EOF

# View the test post
# Navigate to: http://localhost:3000/posts/syntax-highlighting-test
# Verify all languages render correctly with proper syntax colors
```

## Scenario 4: Validation Checklist

Manual testing steps:

```bash
# 1. Theme Switching
# - Open DevTools
# - Change prefers-color-scheme (Chrome: Cmd+Shift+P → "Rendering" → "Emulate CSS media")
# - Verify code blocks update theme (dark → light → dark)

# 2. Line Highlighting
# - Find post with {1-3,5} metadata
# - Verify lines 1, 2, 3, 5 have highlighted background
# - Check contrast ratio (4.5:1 minimum for WCAG AA)

# 3. Keyboard Accessibility
# - Tab to code block
# - Tab to copy button
# - Press Enter or Space to activate copy
# - Verify "Code copied" feedback (visual + ARIA live region)

# 4. Mobile Testing
# - Resize viewport to 320px width
# - Verify code blocks scroll horizontally
# - Verify copy button remains accessible
# - Check line highlighting visible on mobile

# 5. Performance
# - Run build: npm run build
# - Time 100 code blocks: Should complete in <5s
# - Check bundle size: Should not increase by >10KB gzipped
```

## Scenario 5: Build-Time Performance Test

```bash
# Create multiple test files with code blocks
for i in {1..10}; do
  cat > content/posts/perf-test-$i.mdx <<EOF
---
slug: perf-test-$i
title: "Performance Test $i"
excerpt: "Testing build performance"
date: 2025-10-24
tags: ["Testing"]
draft: true
---

$(for j in {1..10}; do
  echo '```javascript'
  echo 'const x = '$j';'
  echo 'console.log(x);'
  echo '```'
  echo
done)
EOF
done

# Measure build time
time npm run build
# Expected: <5 seconds for 100 code blocks (10 files × 10 blocks)

# Clean up test files
rm content/posts/perf-test-*.mdx
```

## Scenario 6: Error Handling Test

```bash
# Test unsupported language fallback
cat > content/posts/unsupported-lang-test.mdx <<'EOF'
---
slug: unsupported-lang-test
title: "Unsupported Language Test"
excerpt: "Testing fallback for unknown languages"
date: 2025-10-24
tags: ["Testing"]
draft: true
---

## Unknown Language

​```foobar
This is not a real language
Should fall back to plain text
​```
EOF

# Run build (should succeed with warning in dev mode)
npm run build

# Check console for warning (development only)
# Expected: "Warning: Unsupported language 'foobar', falling back to plain text"

# Clean up
rm content/posts/unsupported-lang-test.mdx
```

## Scenario 7: Accessibility Audit

```bash
# Install Lighthouse CLI (if not already installed)
npm install -g @lhci/cli

# Run production build
npm run build
npm start

# Run Lighthouse accessibility audit
lhci autorun --collect.url=http://localhost:3000/posts/syntax-highlighting-test

# Check results
# Expected:
# - Accessibility score: ≥95
# - Color contrast: All code text passes 4.5:1 ratio
# - Keyboard navigation: Copy buttons focusable and activatable
# - ARIA labels: Present on highlighted lines and copy buttons
```

## Scenario 8: Rollback Test

```bash
# If Shiki integration fails, rollback to rehype-highlight

# 1. Uninstall Shiki
npm uninstall shiki

# 2. Reinstall rehype-highlight
npm install rehype-highlight@^7.0.2

# 3. Revert next.config.ts
git checkout next.config.ts

# 4. Revert component changes
git checkout components/mdx/

# 5. Remove Shiki files
rm lib/rehype-shiki.ts lib/shiki-config.ts

# 6. Rebuild and verify
npm run build
npm run dev
# Expected: Code blocks work with basic highlighting (pre-Shiki behavior)
```

## Common Issues & Troubleshooting

### Issue: Build fails with "Cannot find module 'shiki'"
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Themes don't switch with prefers-color-scheme
**Solution**:
- Check `globals.css` includes `@media (prefers-color-scheme: dark)` rules
- Verify Shiki outputs dual-theme HTML with class-based switching
- Test in browser DevTools with emulated color scheme

### Issue: Line highlighting not working
**Solution**:
- Verify metadata syntax: `{1-3,5}` (no spaces)
- Check rehype-shiki plugin parses metadata correctly
- Inspect generated HTML for `data-highlighted-line` attributes

### Issue: Copy button not keyboard accessible
**Solution**:
- Verify button has `tabIndex={0}` or is natively focusable
- Add `onKeyDown` handler for Enter/Space keys
- Test with screen reader (VoiceOver, NVDA, JAWS)

### Issue: Code blocks cause layout shift
**Solution**:
- Pre-calculate code block height during build
- Add `min-height` CSS to prevent CLS
- Use Lighthouse to measure Cumulative Layout Shift (target: <0.1)
