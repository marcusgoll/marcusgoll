import type { NextConfig } from "next";
import createMDX from '@next/mdx';

// Note: Environment variable validation moved to API routes and middleware
// to avoid blocking Docker build process. Build-time validation is not needed
// since NEXT_PUBLIC_* variables are available at build time, and runtime
// variables are validated when the app starts.

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // Modern image formats (AVIF first for best compression, WebP fallback)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive image generation
    // Matches common breakpoints: mobile (640-828), tablet (1080-1200), desktop (1920+)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for smaller UI elements (icons, thumbnails, avatars)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 60 seconds (1 minute)
    minimumCacheTTL: 60,

    // Security: Block SVG uploads (XSS risk via embedded scripts)
    dangerouslyAllowSVG: false,

    // Security: Force SVGs to download instead of displaying inline
    contentDispositionType: 'attachment',

    // Whitelist external image domains (empty initially, add on-demand)
    // Use remotePatterns instead of deprecated domains array
    remotePatterns: [
      // Example pattern (uncomment and modify as needed):
      // {
      //   protocol: 'https',
      //   hostname: 'images.example.com',
      //   pathname: '/photos/**',
      // },
    ],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Bundle analyzer configuration (enabled via ANALYZE=true npm run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withMDX(nextConfig));
