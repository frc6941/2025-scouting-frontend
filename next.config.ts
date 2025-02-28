import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["s1-imfile.feishucdn.com","s3-imfile.feishucdn.com"], 
  },
  output: "standalone",
};

export default nextConfig;
