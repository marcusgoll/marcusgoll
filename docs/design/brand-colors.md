# Brand Color Tokens (Core Hex Values)

## Primary Colors (Green)

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary-700` | `#18382a` | Darkest green - dark mode accents |
| `--brand-primary-600` | `#498b63` | Medium-dark green - buttons, links |
| `--brand-primary-500` | `#79a488` | Medium green - hover states |
| `--brand-primary-400` | `#9ee1c8` | Light green - highlights |
| `--brand-primary-300` | `#cbf0e5` | Mint highlight - gradients, backgrounds |

## Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-bg-900` | `#142019` | Darkest background - primary surface |
| `--brand-bg-800` | `#203129` | Dark background - secondary surface |
| `--brand-surface-700` | `#20312b` | Surface color - cards, panels |
| `--brand-surface-100` | `#41584b` | Brightest neutral (still dark) |

## Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#142019` | Primary text on light backgrounds |
| `--text-on-primary` | `#ffffff` | Text on primary color backgrounds |

## Base Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--white` | `#ffffff` | True light surfaces, text on dark |
| `--black` | `#000000` | Deepest blacks, shadows |

## Color Swatches

### Primary Palette
```
┌────────────────────────────────────────────────────────────┐
│ #cbf0e5  Mint Highlight (300)                             │
├────────────────────────────────────────────────────────────┤
│ #9ee1c8  Light Green (400)                                │
├────────────────────────────────────────────────────────────┤
│ #79a488  Medium Green (500)                               │
├────────────────────────────────────────────────────────────┤
│ #498b63  Medium-Dark Green (600)                          │
├────────────────────────────────────────────────────────────┤
│ #18382a  Darkest Green (700)                              │
└────────────────────────────────────────────────────────────┘
```

### Background Palette
```
┌────────────────────────────────────────────────────────────┐
│ #41584b  Brightest Neutral (surface-100)                  │
├────────────────────────────────────────────────────────────┤
│ #20312b  Surface (surface-700)                            │
├────────────────────────────────────────────────────────────┤
│ #203129  Dark Background (bg-800)                         │
├────────────────────────────────────────────────────────────┤
│ #142019  Darkest Background (bg-900)                      │
└────────────────────────────────────────────────────────────┘
```

## Usage Guidelines

**Dark Mode (Primary):**
- Background: `--brand-bg-900` (#142019)
- Surface: `--brand-surface-700` (#20312b)
- Primary text: `--white` (#ffffff)
- Accent: `--brand-primary-600` (#498b63)
- Highlights: `--brand-primary-300` (#cbf0e5)

**Light Mode (Rare):**
- Background: `--white` (#ffffff)
- Surface: Light gray (define if needed)
- Primary text: `--text-primary` (#142019)
- Accent: `--brand-primary-600` (#498b63)

**Interactive States:**
- Default: `--brand-primary-600` (#498b63)
- Hover: `--brand-primary-500` (#79a488)
- Active: `--brand-primary-700` (#18382a)
- Disabled: Opacity 0.5

## CSS Custom Properties

```css
:root {
  /* Primary Colors */
  --brand-primary-700: #18382a;
  --brand-primary-600: #498b63;
  --brand-primary-500: #79a488;
  --brand-primary-400: #9ee1c8;
  --brand-primary-300: #cbf0e5;

  /* Background Colors */
  --brand-bg-900: #142019;
  --brand-bg-800: #203129;
  --brand-surface-700: #20312b;
  --brand-surface-100: #41584b;

  /* Text Colors */
  --text-primary: #142019;
  --text-on-primary: #ffffff;

  /* Base Colors */
  --white: #ffffff;
  --black: #000000;
}
```

## Tailwind Config Reference

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            700: '#18382a',
            600: '#498b63',
            500: '#79a488',
            400: '#9ee1c8',
            300: '#cbf0e5',
          },
          bg: {
            900: '#142019',
            800: '#203129',
          },
          surface: {
            700: '#20312b',
            100: '#41584b',
          },
        },
        text: {
          primary: '#142019',
          onPrimary: '#ffffff',
        },
      },
    },
  },
}
```
