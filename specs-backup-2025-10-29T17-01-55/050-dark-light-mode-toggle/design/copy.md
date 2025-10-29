# Copy: Dark/Light Mode Toggle

## Component: Theme Toggle Button

### Accessibility Labels (Screen Readers)

**Light Mode (showing Moon icon)**:
- ARIA label: "Switch to dark mode"
- Role: button
- State: N/A (stateless button, not toggle role)

**Dark Mode (showing Sun icon)**:
- ARIA label: "Switch to light mode"
- Role: button
- State: N/A

### Tooltips (Optional Enhancement)

**Light Mode**: "Dark mode"
**Dark Mode**: "Light mode"

Note: Tooltips are optional. Icon-only buttons with good ARIA labels meet accessibility requirements.

### Mobile Menu Label (Optional)

If theme toggle is separated from other menu items:
- Label: "Theme"
- Description: "Switch between light and dark mode"

## Error Messages

**Error: Theme Not Available**
- Message: "Theme switching is temporarily unavailable. Your system theme preference will be used."
- When: next-themes fails to load (extremely rare)
- Display: Console warning only, no user-facing error

**Error: localStorage Blocked**
- Message: N/A (silent fallback)
- When: Browser blocks localStorage access
- Behavior: Theme works during session but resets on reload
- Display: No user notification (graceful degradation)

## Empty States

Not applicable - theme toggle always has a state (light or dark).

## Loading States

Not applicable - theme switch is instant. No loading indicators needed.

## Success Messages

Not applicable - visual feedback (theme changing) is sufficient. No toast or alert needed.

## Help Text

If implementing a settings panel (future enhancement):
- **Title**: "Theme Preference"
- **Description**: "Choose how the site appears. Your preference will be saved."
- **Options**:
  - Light: "Bright background with dark text"
  - Dark: "Dark background with light text"
  - System: "Match your device settings"

## Usage Notes

1. **Icon-only approach**: The toggle button uses only icons (Sun/Moon) without text labels. This is acceptable because:
   - ARIA labels provide screen reader access
   - Icon semantics are universal (Sun = light, Moon = dark)
   - Saves header space on desktop
   - Consistent with common web patterns

2. **No confirmation needed**: Theme switches instantly without confirmation dialog. Users can immediately toggle back if they change their mind.

3. **No onboarding required**: Sun/Moon icons are self-explanatory. No tooltip or tutorial needed on first use.

## Brand Voice

Not applicable - this is a utility control with no brand messaging.

## Tone

Functional and unobtrusive. The toggle should feel like a natural part of the interface, not draw attention to itself.
