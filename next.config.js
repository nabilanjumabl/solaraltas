/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Vercel SSG (30k pages)
  output: 'standalone',

  // Allow importing JSON files from /public/data
  experimental: {
    // Needed for large static site generation
    workerThreads: true,
    cpus: 4,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.mapbox.com' },
    ],
  },

  // Headers for performance and SEO
  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // Redirect legacy URL patterns
  async redirects() {
    return [
      { source: '/city/:city', destination: '/solar/:city', permanent: true },
      { source: '/state/:state', destination: '/solar/:state', permanent: true },
    ]
  },
}

module.exports = nextConfig
