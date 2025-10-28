# Visual Research: Multi-Track Newsletter Subscription System

**Created**: 2025-10-28
**Feature**: specs/048-multi-track-newsletter/

## Purpose

Document UI/UX patterns, design references, and visual decisions for the newsletter subscription system.

## Design Principles (from Constitution)

**Brand Alignment**:
- **Systematic Clarity**: Newsletter signup should be as clear as an aviation checklist - no confusing opt-in/opt-out patterns
- **Teaching-First**: Explain what each newsletter contains (e.g., "Aviation - Flight training, CFI insights, pilot career")
- **Multi-Passionate Integration**: Celebrate the diversity of tracks, don't hide them

**Accessibility Standards** (WCAG 2.1 AA):
- 4.5:1 contrast ratio for text
- Keyboard navigation (tab through checkboxes, space to toggle)
- Screen reader labels for each checkbox
- Focus states clearly visible (emerald-600 outline)

## Component Inventory (from ui-inventory.md)

**Reusable Components**:
- **Button**: Use for "Subscribe", "Update Preferences", "Unsubscribe" actions
  - Variant: `default` (emerald-600 background, white text) for primary CTAs
  - Variant: `outline` (emerald-600 border, emerald-600 text) for secondary actions
  - Built-in analytics tracking
- **Container**: Wrap all forms in Container for consistent max-width and padding
- **Header/Footer**: Global layout components (signup form appears in footer)

**New Components Needed**:
1. **NewsletterSignupForm** - Multi-checkbox form with email input
2. **PreferenceManagementPage** - Full-page preference editor
3. **UnsubscribeConfirmationPage** - Goodbye message with feedback option

## Screen Designs

### 1. Newsletter Signup Form (Footer)

**Location**: Footer of all pages

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Stay Updated                                │
│ ─────────────────────────────────────────── │
│                                             │
│ Email: [___________________________]        │
│                                             │
│ Newsletter Tracks:                          │
│ ☑ Aviation (Flight training, CFI insights) │
│ ☐ Dev/Startup (Coding, startups, edtech)   │
│ ☐ Education (Teaching, learning systems)   │
│ ☐ All (Every post, regardless of category) │
│                                             │
│ [Subscribe] (emerald-600 button)            │
│                                             │
│ Small text: "Unsubscribe anytime. Privacy  │
│ policy."                                    │
└─────────────────────────────────────────────┘
```

**States**:
- **Default**: Empty email field, no checkboxes selected
- **Validation Error**: Red border on email field, error text below ("Invalid email format" or "Select at least one newsletter")
- **Loading**: Button shows spinner, form disabled
- **Success**: Green checkmark, "Success! Check your email for confirmation."

**Color Tokens** (from brand guide):
- Primary CTA: Emerald-600 (#059669)
- Focus state: Emerald-600 outline (2px)
- Error state: Red-600 border, red text
- Success state: Green-600 checkmark

### 2. Preference Management Page

**URL**: `/newsletter/preferences?token=<64-char-hex>`

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Manage Your Newsletter Preferences          │
│ ─────────────────────────────────────────── │
│                                             │
│ Email: reader@example.com (read-only)      │
│                                             │
│ Subscribed to:                              │
│ ☑ Aviation (Flight training, CFI insights) │
│ ☑ Dev/Startup (Coding, startups, edtech)   │
│ ☐ Education (Teaching, learning systems)   │
│ ☐ All (Every post, regardless of category) │
│                                             │
│ [Update Preferences] (emerald-600)          │
│                                             │
│ Or [Unsubscribe from all newsletters]      │
│    (text link, gray-600)                    │
└─────────────────────────────────────────────┘
```

**States**:
- **Default**: Current preferences loaded from database
- **Validation Error**: "Select at least one newsletter" if user unchecks all
- **Loading**: Button shows spinner
- **Success**: "Preferences updated! You'll receive a confirmation email."

### 3. Unsubscribe Confirmation Page

**URL**: `/newsletter/unsubscribe?token=<64-char-hex>`

**Layout**:
```
┌─────────────────────────────────────────────┐
│ You've Been Unsubscribed                    │
│ ─────────────────────────────────────────── │
│                                             │
│ Sorry to see you go! You've been removed    │
│ from all newsletters.                       │
│                                             │
│ If you change your mind, you can always     │
│ re-subscribe at marcusgoll.com.             │
│                                             │
│ ─────────────────────────────────────────── │
│                                             │
│ GDPR: Delete My Data Permanently            │
│                                             │
│ [Delete My Data] (red-600 button)           │
│                                             │
│ Small text: "This will permanently delete   │
│ your email from our records. This action    │
│ cannot be undone."                          │
└─────────────────────────────────────────────┘
```

**States**:
- **Default**: Unsubscribe completed, option to delete data
- **Loading**: Button shows spinner (hard delete in progress)
- **Success**: "Your data has been permanently deleted."

## Email Templates

### 1. Welcome Email

**Subject**: Welcome to [Newsletter Name(s)]!

**Body**:
```
Hi there,

Thanks for subscribing to:
• Aviation - Flight training, CFI insights, pilot career
• Dev/Startup - Coding, startups, edtech

You'll receive emails when I publish new content in these areas.

Manage Preferences: [Link]
Unsubscribe: [Link]

Best,
Marcus Gollahon
```

**Design Notes**:
- Plain text email (no HTML) for simplicity and deliverability
- Links are full URLs (no anchor text confusion)
- Sender: "Marcus Gollahon <hello@marcusgoll.com>"

### 2. New Post Notification

**Subject**: New [Track]: [Post Title]

**Body**:
```
New post in Aviation:

[Post Title]
[Post Excerpt (150 chars)]

Read more: [Link to post]

---

You're receiving this because you subscribed to Aviation newsletters.

Manage Preferences: [Link]
Unsubscribe: [Link]
```

### 3. Preference Update Confirmation

**Subject**: Newsletter Preferences Updated

**Body**:
```
Your newsletter preferences have been updated.

You're now subscribed to:
• Aviation
• Dev/Startup

Manage Preferences: [Link]
Unsubscribe: [Link]
```

### 4. Goodbye Email

**Subject**: You've Unsubscribed

**Body**:
```
You've been unsubscribed from all newsletters.

Sorry to see you go!

If you'd like to delete your email permanently (GDPR):
[Delete My Data Link]

Otherwise, you can always re-subscribe at marcusgoll.com.

Best,
Marcus
```

## UX Patterns Researched

**Multi-Select Pattern**:
- ✅ **Checkboxes** (selected): Clear, familiar, accessible
- ❌ Dropdown with multi-select: More clicks, less accessible
- ❌ Toggle buttons: Unclear active/inactive states

**Validation Pattern**:
- ✅ **Inline validation** (selected): Show errors after blur, clear immediately on fix
- ❌ Submit-only validation: Frustrating, user doesn't know until after clicking

**Unsubscribe Pattern**:
- ✅ **One-click unsubscribe** (selected): CAN-SPAM compliant, low friction
- ❌ Multi-step unsubscribe: Dark pattern, frustrating

## Measurements & Spacing

**Form Elements**:
- Input height: 40px (large tap target for mobile)
- Checkbox size: 20px × 20px
- Label padding-left: 8px (from checkbox)
- Vertical spacing between checkboxes: 12px
- Button height: 44px (iOS recommended minimum)

**Container**:
- Max-width: 640px (readable line length)
- Padding: 24px (mobile), 32px (desktop)

## References

**Industry Patterns**:
- Substack: Simple email + subscribe button (no preference granularity)
- ConvertKit: Multi-list subscription (checkboxes)
- Mailchimp: Preference center (standard)

**Accessibility**:
- [WebAIM Checkbox Patterns](https://webaim.org/techniques/forms/controls#checkbox)
- [ARIA Authoring Practices: Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)

## Notes

- **Mobile-first**: Checkboxes should be easy to tap (20px size, 12px spacing)
- **Keyboard nav**: All checkboxes must be reachable via Tab key, toggleable via Space
- **Screen readers**: Each checkbox must have clear label (not just "Aviation", but "Subscribe to Aviation newsletter")
- **Error messages**: Specific, actionable (not "Invalid input", but "Please enter a valid email address")
