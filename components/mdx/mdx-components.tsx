/**
 * Custom MDX component mappings
 * Wraps standard HTML elements with styled components
 * FR-008, US1
 */

import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { MDXImage } from './mdx-image';
import { Callout } from './callout';
import { CodeBlock } from './code-block';
import { Demo } from './demo';

/**
 * MDX component mappings for custom rendering
 * These components replace standard HTML elements in MDX content
 */
export const mdxComponents: MDXComponents = {
  // Headings with styled anchors
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold tracking-tight mt-8 mb-4 scroll-mt-20" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-3xl font-semibold tracking-tight mt-8 mb-4 scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-2xl font-semibold tracking-tight mt-6 mb-3 scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-xl font-semibold tracking-tight mt-6 mb-3 scroll-mt-20" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-lg font-semibold tracking-tight mt-4 mb-2 scroll-mt-20" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-base font-semibold tracking-tight mt-4 mb-2 scroll-mt-20" {...props}>
      {children}
    </h6>
  ),

  // Links with Next.js Link component
  a: ({ href, children, ...props }) => {
    // External links
    if (href?.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    }

    // Internal links
    return (
      <Link href={href || '#'} className="text-blue-600 dark:text-blue-400 hover:underline" {...props}>
        {children}
      </Link>
    );
  },

  // Images with Next.js Image component (optimized)
  img: ({ src, alt, ...props }) => {
    // CR002 Fix: Always use MDXImage for optimization, error if src is invalid
    if (typeof src !== 'string') {
      console.error('MDX Image requires string src, received:', typeof src);
      return null;
    }
    return <MDXImage src={src} alt={alt || ''} {...props} />;
  },

  // Code blocks with syntax highlighting (handled by rehype-shiki with dual themes)
  code: ({ children, className, ...props }) => {
    // Inline code
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    // Block code (syntax highlighting applied by rehype-shiki)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // Pre blocks with code highlighting
  pre: ({ children, ...props }) => (
    <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4" {...props}>
      {children}
    </pre>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="my-6 list-disc list-inside space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-6 list-decimal list-inside space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Horizontal rule
  hr: (props) => <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />,

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="my-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),

  // Tables (GFM support)
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 text-sm" {...props}>
      {children}
    </td>
  ),

  // Custom MDX components (available in MDX content)
  Callout,
  CodeBlock,
  Demo,
};
