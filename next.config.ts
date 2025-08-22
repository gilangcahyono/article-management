import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://s3.sellerpintar.com/articles/articles/**"),
      new URL("https://robohash.org/**"),
    ],
  },
};

export default nextConfig;
