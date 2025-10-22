import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container component - Reusable max-width wrapper for page content
 * Provides consistent horizontal padding and max-width across all pages
 */
export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-4 md:px-6 ${className}`}
    >
      {children}
    </div>
  );
}
