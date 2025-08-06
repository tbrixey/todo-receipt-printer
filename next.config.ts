import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: "**/pi/**",
    };
    return config;
  },
};

export default nextConfig;
