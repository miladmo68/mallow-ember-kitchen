import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/mallow-ember-kitchen" : "",
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
