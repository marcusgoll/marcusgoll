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
    container: 'bg-[var(--info)]/10 border border-[var(--info)]/20',
    icon: '💡',
    iconColor: 'text-[var(--info)]',
    title: 'text-[var(--text)] font-semibold',
    content: 'text-[var(--text-muted)]',
  },
  warning: {
    container: 'bg-[var(--warning)]/10 border border-[var(--warning)]/20',
    icon: '⚠️',
    iconColor: 'text-[var(--warning)]',
    title: 'text-[var(--text)] font-semibold',
    content: 'text-[var(--text-muted)]',
  },
  error: {
    container: 'bg-[var(--danger)]/10 border border-[var(--danger)]/20',
    icon: '🚨',
    iconColor: 'text-[var(--danger)]',
    title: 'text-[var(--text)] font-semibold',
    content: 'text-[var(--text-muted)]',
  },
  success: {
    container: 'bg-[var(--success)]/10 border border-[var(--success)]/20',
    icon: '✅',
    iconColor: 'text-[var(--success)]',
    title: 'text-[var(--text)] font-semibold',
    content: 'text-[var(--text-muted)]',
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
    <div className={`my-6 rounded-md p-4 ${styles.container}`}>
      <div className="flex">
        <div className="shrink-0">
          <span
            className={`flex size-5 items-center justify-center ${styles.iconColor}`}
            aria-hidden="true"
          >
            {styles.icon}
          </span>
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`${title ? 'mt-2' : ''} text-sm ${styles.content}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
