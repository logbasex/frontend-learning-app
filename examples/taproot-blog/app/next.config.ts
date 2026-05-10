import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: { typedRoutes: true },
  images: { formats: ["image/avif", "image/webp"] },
};

export default config;
