import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories
  },
  typescript: {
    // Completely disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  // Disable all static analysis and checking
  experimental: {
    typedRoutes: false,
  },
  /* config options here */
};

export default nextConfig;
