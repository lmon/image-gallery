/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.lucasmonaco.com',
        pathname: '/gallery/**',
      },
      {
        protocol: 'https',
        hostname: 'lucasmonaco.com',
        pathname: '/gallery/**',
      },
      {
        protocol: 'https',
        hostname: 'www.incidentreport.info',
      },
      {
        protocol: 'http',
        hostname: 'static.flickr.com',
      }
    ],
    unoptimized: false,
    // Gallery images rarely change, so cache transformed images for a year.
    // The origin sends no Cache-Control, so without this they expire hourly
    // and every re-request after that counts as a new transformation.
    minimumCacheTTL: 31536000,
    // One format only: each format is transformed and cached separately.
    formats: ['image/webp'],
    // Fewer widths means fewer distinct variants per image.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
  },
}

module.exports = nextConfig

