/**
 * Remark plugin to validate heading hierarchy in MDX content
 * T011: Build-time heading validation for LLM optimization
 * US4: Ensure logical heading structure for AI content parsing
 *
 * Validates:
 * - Single H1 per document (enforced)
 * - Logical H2 → H3 → H4 progression (no skipped levels)
 * - Throws build error with clear message on violations
 *
 * Usage:
 * Add to remarkPlugins array in MDX processing options
 */

import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import type { Root, Heading, PhrasingContent, Text } from 'mdast';

/**
 * Extract text content from heading node children
 * Handles Text, Link, and other phrasing content types
 */
function extractHeadingText(children: PhrasingContent[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') {
        return (child as Text).value;
      }
      // Handle other types like links, emphasis, etc.
      if ('children' in child && Array.isArray(child.children)) {
        return extractHeadingText(child.children as PhrasingContent[]);
      }
      return '';
    })
    .join('')
    .trim();
}

/**
 * Remark plugin to validate heading hierarchy
 * Ensures single H1 and logical heading level progression
 *
 * @returns Remark transformer function
 */
export function remarkValidateHeadings() {
  return (tree: Root, file: VFile) => {
    let h1Count = 0;
    let previousLevel = 0;
    const violations: string[] = [];

    visit(tree, 'heading', (node: Heading) => {
      const level = node.depth;
      const headingText = extractHeadingText(node.children);

      // Check for single H1
      if (level === 1) {
        h1Count++;
        if (h1Count > 1) {
          violations.push(
            `Multiple H1 headings found. Only one H1 per document is allowed. Found: "${headingText}"`
          );
        }
      }

      // Check for skipped levels (e.g., H2 → H4 without H3)
      if (previousLevel > 0 && level > previousLevel + 1) {
        violations.push(
          `Heading level skipped: H${previousLevel} → H${level}. Expected H${previousLevel + 1}. Heading: "${headingText}"`
        );
      }

      previousLevel = level;
    });

    // Throw error if violations found
    if (violations.length > 0) {
      const filePath = file.history[0] || 'unknown file';
      const errorMessage = [
        `\n❌ Heading hierarchy validation failed in ${filePath}:`,
        ...violations.map((v) => `  - ${v}`),
        '\nFix these issues to build successfully.',
      ].join('\n');

      throw new Error(errorMessage);
    }
  };
}
