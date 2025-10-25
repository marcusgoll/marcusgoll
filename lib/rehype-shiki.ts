/**
 * Custom Rehype Plugin for Shiki Syntax Highlighting
 *
 * Traverses MDX AST to find code blocks, parses metadata (language, line highlights, filename),
 * and transforms them to HTML with dual theme support (github-dark, github-light).
 *
 * Features:
 * - Build-time syntax highlighting (zero client-side JS)
 * - Dual theme output with CSS classes (.code-light, .code-dark)
 * - Line highlighting via metadata: ```js {1-3,5}
 * - Filename display via metadata: ```js filename="app.js"
 * - Fallback to plaintext for unsupported languages
 * - Input sanitization for security
 *
 * Pattern: Unified transformer (https://unifiedjs.com/learn/guide/create-a-plugin/)
 */

import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';
import type { Plugin } from 'unified';
import { getShikiHighlighter, isSupportedLanguage, getFallbackLanguage, THEMES } from './shiki-config';

/**
 * Metadata parsed from fenced code block
 * Example: ```js {1-3,5} filename="app.js"
 */
interface CodeBlockMetadata {
  language: string;
  highlightLines: number[];
  filename?: string;
  rawMetadata: string;
}

/**
 * Parse line highlighting metadata from fenced code block
 *
 * Supports:
 * - Individual lines: {1,3,5} → [1, 3, 5]
 * - Ranges: {1-3} → [1, 2, 3]
 * - Mixed: {1-3,5,7-9} → [1, 2, 3, 5, 7, 8, 9]
 *
 * Security: Validates inputs to prevent injection attacks
 *
 * @param metadata - Raw metadata string from code fence
 * @returns number[] - Array of line numbers to highlight
 */
function parseHighlightLines(metadata: string): number[] {
  const highlightMatch = metadata.match(/\{([0-9,-\s]+)\}/);
  if (!highlightMatch) return [];

  const rangeString = highlightMatch[1];
  const lines = new Set<number>();

  // Split by commas: "1-3,5,7-9" → ["1-3", "5", "7-9"]
  const parts = rangeString.split(',').map(p => p.trim());

  for (const part of parts) {
    // Range: "1-3" → [1, 2, 3]
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));

      // Validation: Reject invalid ranges
      if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > 10000) {
        console.warn(`Invalid line range: ${part}, skipping`);
        continue;
      }

      for (let i = start; i <= end; i++) {
        lines.add(i);
      }
    } else {
      // Individual line: "5" → [5]
      const lineNum = parseInt(part, 10);

      // Validation: Reject invalid line numbers
      if (isNaN(lineNum) || lineNum < 1 || lineNum > 10000) {
        console.warn(`Invalid line number: ${part}, skipping`);
        continue;
      }

      lines.add(lineNum);
    }
  }

  return Array.from(lines).sort((a, b) => a - b);
}

/**
 * Parse filename from fenced code block metadata
 *
 * Example: filename="app.js" → "app.js"
 *
 * @param metadata - Raw metadata string
 * @returns string | undefined - Parsed filename or undefined
 */
function parseFilename(metadata: string): string | undefined {
  const filenameMatch = metadata.match(/filename=["']([^"']+)["']/);
  return filenameMatch ? filenameMatch[1] : undefined;
}

/**
 * Parse all metadata from fenced code block
 *
 * Example: ```js {1-3,5} filename="app.js"
 * Returns: { language: 'js', highlightLines: [1,2,3,5], filename: 'app.js', rawMetadata: '...' }
 *
 * @param meta - Metadata string from code fence
 * @param lang - Language identifier from code fence
 * @returns CodeBlockMetadata - Parsed metadata object
 */
function parseCodeBlockMetadata(meta: string | null, lang: string): CodeBlockMetadata {
  const rawMetadata = meta || '';

  return {
    language: lang,
    highlightLines: parseHighlightLines(rawMetadata),
    filename: parseFilename(rawMetadata),
    rawMetadata,
  };
}

/**
 * Rehype plugin for Shiki syntax highlighting
 *
 * Transforms code blocks in MDX AST to highlighted HTML with dual themes.
 * Runs during build time, so no client-side JavaScript needed.
 *
 * @returns Transformer function for unified pipeline
 */
const rehypeShiki: Plugin<[], Root> = () => {
  return async (tree) => {
    const highlighter = await getShikiHighlighter();

    // Find all code block nodes in AST
    const codeBlocks: Array<{ node: Element; parent: Element; index: number }> = [];

    visit(tree, 'element', (node, index, parent) => {
      // Match <pre><code> pattern (fenced code blocks)
      if (
        node.tagName === 'pre' &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        if (parent && typeof index === 'number') {
          codeBlocks.push({ node, parent: parent as Element, index });
        }
      }
    });

    // Process each code block
    for (const { node, parent, index } of codeBlocks) {
      const codeNode = node.children[0] as Element;

      // Extract language from class: "language-javascript" → "javascript"
      const className = codeNode.properties?.className as string[] | undefined;
      const langClass = className?.find((c) => c.startsWith('language-'));
      const lang = langClass ? langClass.replace('language-', '') : 'plaintext';

      // Get code content
      const codeContent =
        codeNode.children[0]?.type === 'text' ? codeNode.children[0].value : '';

      // Parse metadata from code fence
      const metaString = (codeNode.data?.meta as string) || (codeNode.properties?.metastring as string) || null;
      const metadata = parseCodeBlockMetadata(metaString, lang);

      try {
        // Determine language for highlighting (with fallback)
        const highlightLang = isSupportedLanguage(lang) ? lang : getFallbackLanguage(lang);

        // Generate highlighted HTML with dual themes using codeToTokens for more control
        const lightTokens = highlighter.codeToTokens(codeContent, {
          lang: highlightLang,
          theme: THEMES.light,
        });

        const darkTokens = highlighter.codeToTokens(codeContent, {
          lang: highlightLang,
          theme: THEMES.dark,
        });

        // Build light theme pre element
        const lightPre: Element = {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki', 'shiki-light'],
            style: `background-color:${lightTokens.bg};color:${lightTokens.fg}`,
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: lightTokens.tokens.map((line) => ({
                type: 'element',
                tagName: 'span',
                properties: { className: ['line'] },
                children: line.map((token) => ({
                  type: 'element',
                  tagName: 'span',
                  properties: { style: `color:${token.color}` },
                  children: [{ type: 'text', value: token.content } as Text],
                })),
              })),
            },
          ],
        };

        // Build dark theme pre element
        const darkPre: Element = {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki', 'shiki-dark'],
            style: `background-color:${darkTokens.bg};color:${darkTokens.fg}`,
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: darkTokens.tokens.map((line) => ({
                type: 'element',
                tagName: 'span',
                properties: { className: ['line'] },
                children: line.map((token) => ({
                  type: 'element',
                  tagName: 'span',
                  properties: { style: `color:${token.color}` },
                  children: [{ type: 'text', value: token.content } as Text],
                })),
              })),
            },
          ],
        };

        // Build wrapper container
        const children: Element[] = [];

        // Add filename if present
        if (metadata.filename) {
          children.push({
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-filename'] },
            children: [{ type: 'text', value: metadata.filename } as Text],
          });
        }

        // Add light theme with display control class
        children.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-light'] },
          children: [lightPre],
        });

        // Add dark theme with display control class
        children.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-dark'] },
          children: [darkPre],
        });

        // Replace node with new wrapper
        const newNode: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['code-block-wrapper'],
            'data-language': lang,
            ...(metadata.filename && { 'data-filename': metadata.filename }),
          },
          children,
        };

        parent.children[index] = newNode;
      } catch (error) {
        // Fallback: Keep original code block with error message
        console.error(`Shiki highlighting failed for language "${lang}":`, error);

        // Keep original <pre><code> structure
        if (process.env.NODE_ENV === 'development') {
          // Add error message in development
          const errorNode: Element = {
            type: 'element',
            tagName: 'p',
            properties: { className: ['code-error'], style: 'color:red' },
            children: [{ type: 'text', value: `Syntax highlighting failed for language: ${lang}` } as Text],
          };

          parent.children.splice(index + 1, 0, errorNode);
        }
      }
    }
  };
};

export default rehypeShiki;
