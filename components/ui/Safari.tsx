import { cn } from '@/lib/utils';
import React from 'react';

interface SafariProps {
  url?: string;
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Safari - Browser window mockup component
 * Styled like macOS Safari browser with traffic lights and address bar
 */
export function Safari({
  url = 'https://cfipros.com',
  src,
  className,
  width = 1200,
  height = 800,
}: SafariProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-2xl dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      {/* Browser chrome - top bar with traffic lights and address bar */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        {/* Traffic light buttons */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        {/* Address bar */}
        <div className="flex-1">
          <div className="mx-auto max-w-md rounded-md bg-gray-100 px-3 py-1.5 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {url}
          </div>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-[52px]" />
      </div>

      {/* Content area */}
      <div className="relative bg-white dark:bg-gray-900" style={{ aspectRatio: `${width}/${height}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Browser content"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
