import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["@mui/material", "@mui/icons-material"],
};

export default nextConfig;
