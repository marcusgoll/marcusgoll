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
        'relative w-full overflow-hidden rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] shadow-2xl',
        className
      )}
    >
      {/* Browser chrome - top bar with traffic lights and address bar */}
      <div className="flex items-center gap-3 border-b-2 border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-muted)] px-4 py-3">
        {/* Traffic light buttons */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-sm" />
          <div className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-sm" />
          <div className="h-3 w-3 rounded-full bg-[#28C840] shadow-sm" />
        </div>

        {/* Address bar */}
        <div className="flex-1">
          <div className="mx-auto max-w-md rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-center text-sm text-[var(--text)] shadow-sm">
            {url}
          </div>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-[52px]" />
      </div>

      {/* Content area */}
      <div className="relative bg-[var(--bg)]" style={{ aspectRatio: `${width}/${height}` }}>
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
