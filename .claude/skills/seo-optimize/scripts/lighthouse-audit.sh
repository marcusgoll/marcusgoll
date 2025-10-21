#!/usr/bin/env bash
# Run Lighthouse performance audit
# Usage: ./lighthouse-audit.sh [URL]

set -euo pipefail

URL="${1:-https://marcusgoll.com}"
OUTPUT_DIR="lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Running Lighthouse audit on: $URL"
echo "Timestamp: $TIMESTAMP"

mkdir -p "$OUTPUT_DIR"

# Run Lighthouse
lighthouse "$URL" \
  --output=html \
  --output=json \
  --output-path="$OUTPUT_DIR/report-$TIMESTAMP" \
  --chrome-flags="--headless" \
  --quiet

echo "✅ Audit complete!"
echo "HTML Report: $OUTPUT_DIR/report-$TIMESTAMP.report.html"
echo "JSON Report: $OUTPUT_DIR/report-$TIMESTAMP.report.json"

# Extract scores
SCORES=$(node -p "
const report = require('./$OUTPUT_DIR/report-$TIMESTAMP.report.json');
const categories = report.categories;
JSON.stringify({
  performance: Math.round(categories.performance.score * 100),
  accessibility: Math.round(categories.accessibility.score * 100),
  bestPractices: Math.round(categories['best-practices'].score * 100),
  seo: Math.round(categories.seo.score * 100)
}, null, 2);
")

echo ""
echo "Scores:"
echo "$SCORES"
