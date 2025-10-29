import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import rehypeShiki from './lib/rehype-shiki';
import remarkGfm from 'remark-gfm';

// Note: Environment variable validation moved to API routes and middleware
// to avoid blocking Docker build process. Build-time validation is not needed
// since NEXT_PUBLIC_* variables are available at build time, and runtime
// variables are validated when the app starts.

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [], // Ghost CMS removed - using markdown/MDX for blog posts
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeShiki],
  },
});

// Bundle analyzer configuration (enabled via ANALYZE=true npm run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withMDX(nextConfig));
