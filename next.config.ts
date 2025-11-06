
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    // This allows the Next.js development server to accept requests from the
    // Firebase Studio environment.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
};

export default nextConfig;
