import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;