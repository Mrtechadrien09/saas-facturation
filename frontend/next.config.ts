/** @type { import('next').NextConfig } */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  compress: true,

  images: {
    unoptimized: true,
  },
  experimental: {
    workerThreads: true,
    cpus: 1,
  },
};
module.exports = nextConfig;