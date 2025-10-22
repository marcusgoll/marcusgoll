import type { NextConfig } from "next";
import { validateEnvironmentVariables } from "./lib/validate-env";

// Validate environment variables at startup (fail-fast)
// This runs before the app accepts any requests
validateEnvironmentVariables();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [], // Ghost CMS removed - using markdown/MDX for blog posts
  },
};

export default nextConfig;
