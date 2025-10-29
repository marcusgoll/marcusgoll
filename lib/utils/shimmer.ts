/**
 * Generate a shimmer placeholder for Next.js Image blur loading
 *
 * Creates a base64-encoded SVG with a shimmer/gradient effect
 * to show while images load, improving perceived performance and
 * preventing layout shift (CLS).
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Base64-encoded data URL for blurDataURL prop
 *
 * @example
 * ```tsx
 * import { shimmerDataURL } from '@/lib/utils/shimmer';
 *
 * <Image
 *   src="/photo.jpg"
 *   width={800}
 *   height={600}
 *   placeholder="blur"
 *   blurDataURL={shimmerDataURL(800, 600)}
 *   alt="Photo description"
 * />
 * ```
 */
export const shimmerDataURL = (width: number, height: number): string => {
  // Create SVG with gradient shimmer effect
  const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#f6f7f8" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  // Convert to base64 data URL
  const base64 = Buffer.from(shimmer).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};
