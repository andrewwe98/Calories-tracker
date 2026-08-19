import type { NextConfig } from "next";

const basePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages has no rewrite for `/log` → `/log.html`, so emit folders.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
