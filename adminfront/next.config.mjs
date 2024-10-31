/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://back.heladosvillaizan.tech',
    NEXT_PUBLIC_WS_URL: 'wss://back.heladosvillaizan.tech',
    AUTH_SECRET: "9st1Wnz+sLYAuTyk9tfiggU/lYJzBHueNUtqpRkhPZs="
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
