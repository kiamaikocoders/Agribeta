/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure all routes are properly built
  trailingSlash: false,
  // Handle dynamic routes
  async rewrites() {
    return [
      // Handle auth routes
      {
        source: '/auth/:path*',
        destination: '/auth/:path*',
      },
    ]
  },
}

export default nextConfig
