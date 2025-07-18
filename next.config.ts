/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://notehub-api.goit.study/api/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "https://notehub-api.goit.study/auth/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
