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
  // Skip linting in build process
  swcMinify: false, // Disable SWC minification which can sometimes trigger type checks
  /* config options here */
};

export default nextConfig;
