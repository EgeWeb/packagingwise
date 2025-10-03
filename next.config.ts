/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'packagingwise.co.uk',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig