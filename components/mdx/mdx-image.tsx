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
  // Local images (start with /)
  if (src.startsWith('/')) {
    return (
      <Image
        src={src}
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

  // External images (HTTP/HTTPS) - Use Next.js Image with blur placeholder
  // Note: External domains must be added to next.config.ts remotePatterns
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return (
      <Image
        src={src}
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

  // Fallback for relative paths (resolve to /images/posts/)
  const resolvedSrc = src.startsWith('.') ? src.replace(/^\.\.?\//, '/images/posts/') : src;

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
