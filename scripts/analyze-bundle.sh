#!/bin/bash
#
# Bundle Analysis Helper Script
# Runs Next.js bundle analyzer and opens the visualization
#
# Usage: ./scripts/analyze-bundle.sh

set -e

echo "Running bundle analysis..."
echo ""

# Set ANALYZE environment variable and run build
ANALYZE=true npm run build

echo ""
echo "Bundle analysis complete!"
echo ""
echo "Opening visualizations:"
echo "  - Client bundle: .next/analyze/client.html"
echo "  - Server bundle: .next/analyze/server.html"
echo ""

# Open the client bundle visualization (works on Windows/Mac/Linux)
if command -v xdg-open > /dev/null; then
  xdg-open .next/analyze/client.html
elif command -v open > /dev/null; then
  open .next/analyze/client.html
elif command -v start > /dev/null; then
  start .next/analyze/client.html
else
  echo "Please manually open .next/analyze/client.html in your browser"
fi
