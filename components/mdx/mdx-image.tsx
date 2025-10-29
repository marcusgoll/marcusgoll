/**
 * Optimized image component for MDX
 * Transforms Markdown image syntax to Next.js Image component
 * FR-007, US2
 */

import Image from 'next/image';
import { shimmerDataURL } from '@/lib/utils/shimmer';

interface MDXImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * MDX Image component with automatic optimization
 *
 * Usage in MDX:
 * ![Alt text](/images/posts/my-post/hero.jpg)
 *
 * Resolves relative paths and applies Next.js Image optimization
 */
export function MDXImage({ src, alt, width = 800, height = 450, priority = false }: MDXImageProps) {
  // Resolve src path based on type
  let resolvedSrc = src;

  // Relative paths: resolve to /images/posts/
  if (src.startsWith('.')) {
    resolvedSrc = src.replace(/^\.\.?\//, '/images/posts/');
  }
  // Local paths (start with /) and external URLs (http/https): use as-is

  // Single Image component (DRY principle - eliminates 47 lines of duplication)
  // Note: External domains must be added to next.config.ts remotePatterns
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL={shimmerDataURL(width, height)}
      className="rounded-lg w-full h-auto my-6"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
    />
  );
}
