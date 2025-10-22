/**
 * Callout component for MDX content
 * Displays highlighted messages with different types (info, warning, error, success)
 * FR-008, US4
 */

import { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  children: ReactNode;
  title?: string;
}

const calloutStyles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-950 border-blue-500',
    icon: '💡',
    title: 'text-blue-900 dark:text-blue-100',
    content: 'text-blue-800 dark:text-blue-200',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500',
    icon: '⚠️',
    title: 'text-yellow-900 dark:text-yellow-100',
    content: 'text-yellow-800 dark:text-yellow-200',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-950 border-red-500',
    icon: '🚨',
    title: 'text-red-900 dark:text-red-100',
    content: 'text-red-800 dark:text-red-200',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-950 border-green-500',
    icon: '✅',
    title: 'text-green-900 dark:text-green-100',
    content: 'text-green-800 dark:text-green-200',
  },
};

/**
 * Callout component for highlighting important information in MDX
 *
 * Usage in MDX:
 * <Callout type="info" title="Did you know?">
 *   This is an informational message.
 * </Callout>
 */
export function Callout({ type = 'info', children, title }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles.container}`}>
      <div className="flex gap-3">
        <span className="text-xl" aria-hidden="true">
          {styles.icon}
        </span>
        <div className="flex-1">
          {title && <div className={`font-semibold mb-1 ${styles.title}`}>{title}</div>}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
