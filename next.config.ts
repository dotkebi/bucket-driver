import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Docker 배포를 위한 standalone 모드
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
  },
};

export default nextConfig;
