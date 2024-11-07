/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: "http://localhost:9000/admin/",
    NEXT_PUBLIC_WS_URL: "ws://localhost:9001/ws/",
    AUTH_SECRET: "9st1Wnz+sLYAuTyk9tfiggU/lYJzBHueNUtqpRkhPZs=",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
