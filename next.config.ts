import type { NextConfig } from "next";
import { validateEnvironmentVariables } from "./lib/validate-env";
import createMDX from '@next/mdx';
import rehypeShiki from './lib/rehype-shiki';
import remarkGfm from 'remark-gfm';

// Validate environment variables at startup (fail-fast)
// This runs before the app accepts any requests
validateEnvironmentVariables();

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

export default withMDX(nextConfig);
