import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Allow all paths
      },
    ],
  },
  // Allow external access
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  }
};

export default nextConfig;
