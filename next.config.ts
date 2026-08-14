import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "ayodhya-restaurant-premium-website";
const basePath = isGitHubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath,
      assetPrefix: basePath,
      images: {
        unoptimized: true,
      },
      env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
        NEXT_PUBLIC_GITHUB_PAGES: "true",
      },
    }
  : {};

export default nextConfig;
