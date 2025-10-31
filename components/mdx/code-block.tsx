/**
 * Enhanced code block component for MDX
 * Adds features like copy button, line numbers, and filename display
 * FR-008, US4
 */

'use client';

import { ReactNode, useState } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

/**
 * Enhanced code block with copy functionality
 *
 * Usage in MDX:
 * <CodeBlock language="typescript" filename="example.ts" showLineNumbers>
 *   const greeting = "Hello, World!";
 *   console.log(greeting);
 * </CodeBlock>
 */
export function CodeBlock({ children, language, filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const code = typeof children === 'string' ? children : extractTextContent(children);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      // Fallback: Create temporary textarea for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = typeof children === 'string' ? children : extractTextContent(children);
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden bg-[var(--bg-dark)]">
      {/* Header with filename and copy button */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            {filename && <span className="text-sm text-[var(--text)] font-mono">{filename}</span>}
            {language && !filename && (
              <span className="text-xs text-[var(--text-muted)] uppercase font-mono">{language}</span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1 min-w-[44px] min-h-[44px] px-2"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>Copied</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto">
          <code className={`text-sm font-mono ${language ? `language-${language}` : ''}`}>
            {showLineNumbers ? addLineNumbers(children) : children}
          </code>
        </pre>

        {/* Copy button (when no header) */}
        {!filename && !language && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors bg-[var(--surface-muted)] px-3 py-2 rounded min-w-[44px] min-h-[44px]"
            aria-label="Copy code"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Extract text content from React children
 */
function extractTextContent(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextContent((children as { props: { children: ReactNode } }).props.children);
  }

  return '';
}

/**
 * Add line numbers to code content
 */
function addLineNumbers(children: ReactNode): ReactNode {
  const code = extractTextContent(children);
  const lines = code.split('\n');

  return lines.map((line, index) => (
    <div key={index} className="flex">
      <span className="text-[var(--text-muted)] select-none w-8 text-right pr-4">{index + 1}</span>
      <span>{line}</span>
    </div>
  ));
}
