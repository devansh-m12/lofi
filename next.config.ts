import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;