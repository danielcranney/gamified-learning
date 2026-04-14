import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages hosting
  output: 'export',
  // Repo name is the sub-path on GitHub Pages
  basePath: '/gamified-learning',
};

export default nextConfig;
