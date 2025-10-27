import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';
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
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);
