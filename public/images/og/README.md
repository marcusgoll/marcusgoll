# Open Graph Images

## Default OG Image

**File**: `og-default.svg` (development placeholder)
**Specs**: 1200x630px, Navy 900 (#0F172A) background, Emerald 600 (#059669) accents
**Production**: Convert to `og-default.jpg` (JPEG, <200KB) before deployment

### Design Elements
- Navy 900 (#0F172A) background
- Emerald 600 (#059669) vertical accent bar (left edge)
- Brand name "Marcus Gollahon" in Work Sans Bold (72px)
- Tagline "Teaching systematic thinking from 30,000 feet" (32px, slate gray)
- Dual-track content indicators:
  - Aviation icon (plane symbol) with "Aviation" label
  - Dev/Startup icon (code brackets) with "Dev & Startup" label

### Conversion Command (for production)
```bash
# Using ImageMagick or similar tool
convert og-default.svg -quality 90 og-default.jpg

# Or use online tools:
# - https://cloudconvert.com/svg-to-jpg
# - https://www.adobe.com/express/feature/image/convert/svg-to-jpg
```

## Section-Specific Images (Optional - US5)

**Aviation**: `og-aviation.jpg` - Aviation-themed with aircraft silhouette
**Dev/Startup**: `og-dev.jpg` - Coding-themed with terminal or code snippet

Both should follow same brand colors and dimensions (1200x630px, <200KB JPEG).
