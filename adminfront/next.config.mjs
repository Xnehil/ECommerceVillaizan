/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://back.heladosvillaizan.tech/admin/',
    NEXT_PUBLIC_WS_URL: 'wss://back.heladosvillaizan.tech/ws/',
    // NEXT_PUBLIC_BASE_URL: "http://localhost:9000/admin/",
    // NEXT_PUBLIC_WS_URL: "ws://localhost:9001/ws/",
    AUTH_SECRET: "9st1Wnz+sLYAuTyk9tfiggU/lYJzBHueNUtqpRkhPZs=",
    NEXT_PUBLIC_APP_URL:"https://heladosvillaizan.tech",
    NEXT_PUBLIC_MEDUSA_BACKEND_URL:"https://back.heladosvillaizan.tech",
    NEXTAUTH_URL:"https://admin.heladosvillaizan.tech",
    ECOMMERCE_URL: "https://heladosvillaizan.tech",
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
