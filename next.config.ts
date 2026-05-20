import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@libsql/client",
    "@prisma/adapter-libsql",
    "@upstash/redis",
    "@upstash/ratelimit",
  ],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
