import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['ghost.marcusgoll.com'], // Allow Ghost CMS images
  },
};

export default nextConfig;
