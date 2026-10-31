/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  ...(process.env.NEXT_QA_BUILD ? { experimental: { cpus: 1 } } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
