#!/usr/bin/env bash
# Generate blog post frontmatter for marcusgoll.com
# Usage: ./generate-frontmatter.sh

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Blog Post Frontmatter Generator ===${NC}\n"

# Prompt for post details
read -p "Post title: " TITLE
read -p "Content track (aviation/dev-startup/cross-pollination): " TRACK
read -p "Category (flight-training/cfi-resources/building-in-public/tutorials/etc): " CATEGORY
read -p "Tags (comma-separated): " TAGS_INPUT
read -p "Meta description (150-160 chars): " DESCRIPTION

# Convert tags to YAML array format
IFS=',' read -ra TAGS_ARRAY <<< "$TAGS_INPUT"
TAGS_YAML=""
for tag in "${TAGS_ARRAY[@]}"; do
  # Trim whitespace
  tag=$(echo "$tag" | xargs)
  TAGS_YAML+="  - $tag\n"
done

# Get current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Generate slug from title (lowercase, replace spaces with hyphens)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

# Determine badge based on track
case "$TRACK" in
  "aviation")
    BADGE='<span class="badge badge-aviation">Aviation</span>'
    ;;
  "dev-startup")
    BADGE='<span class="badge badge-dev">Dev/Startup</span>'
    ;;
  "cross-pollination")
    BADGE='<span class="badge badge-cross">Cross-Pollination</span>'
    ;;
  *)
    BADGE='<span class="badge">Unknown Track</span>'
    ;;
esac

# Generate frontmatter
echo -e "\n${GREEN}=== Generated Frontmatter ===${NC}\n"

cat << EOF
---
title: $TITLE
date: $CURRENT_DATE
track: $TRACK
category: $CATEGORY
tags:
$TAGS_YAML
description: $DESCRIPTION
slug: $SLUG
featured_image: /images/$SLUG.jpg
reading_time: [UPDATE THIS]
---

$BADGE

# $TITLE

[Your content starts here...]

EOF

# Optional: Save to file
read -p "Save to file? (y/N): " SAVE_FILE

if [[ "$SAVE_FILE" =~ ^[Yy]$ ]]; then
  FILENAME="${SLUG}.md"
  cat << EOF > "$FILENAME"
---
title: $TITLE
date: $CURRENT_DATE
track: $TRACK
category: $CATEGORY
tags:
$TAGS_YAML
description: $DESCRIPTION
slug: $SLUG
featured_image: /images/$SLUG.jpg
reading_time: [UPDATE THIS]
---

$BADGE

# $TITLE

[Your content starts here...]

EOF
  echo -e "${GREEN}Saved to: $FILENAME${NC}"
fi

echo -e "\n${YELLOW}Remember to:${NC}"
echo "1. Update reading_time after writing"
echo "2. Create featured image at /images/$SLUG.jpg"
echo "3. Review meta description length (150-160 chars)"
echo "4. Include internal links to 3-5 related posts"
