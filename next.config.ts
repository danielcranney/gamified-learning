import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/gamified-learning',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
