import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

function extractHostname(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  try { return new URL(url).hostname; } catch { return fallback; }
}

const apiHostname = extractHostname(
  process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL,
  "localhost"
);
const blogHostname = extractHostname(
  process.env.NEXT_PUBLIC_REACT_APP_BLOG_URL,
  "localhost"
);

function extractOrigin(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return fallback;
  }
}

const apiOrigin = extractOrigin(
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL,
  "http://backend:3000"
);

const blogOrigin = extractOrigin(
  process.env.BLOG_URL || process.env.NEXT_PUBLIC_REACT_APP_BLOG_URL,
  "http://blog:1337"
);

const nextConfig: NextConfig = {
  // Required for Docker multi-stage standalone build
  output: "standalone",
  images: {
    // Keep optimization only in production. In dev/prototype, avoid _next/image timeout failures.
    unoptimized: !isProduction,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "javer-api-dev-page.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: apiHostname,
      },
      {
        protocol: "http",
        hostname: blogHostname,
      },
      {
        protocol: "https",
        hostname: apiHostname,
      },
      {
        protocol: "https",
        hostname: blogHostname,
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/uploads/image-jpeg/:path*",
          destination: `${apiOrigin}/uploads/image-jpeg/:path*`,
        },
        {
          source: "/uploads/image-png/:path*",
          destination: `${apiOrigin}/uploads/image-png/:path*`,
        },
        {
          source: "/uploads/image-webp/:path*",
          destination: `${apiOrigin}/uploads/image-webp/:path*`,
        },
        {
          source: "/uploads/video-mp4/:path*",
          destination: `${apiOrigin}/uploads/video-mp4/:path*`,
        },
        {
          source: "/uploads/videos/:path*",
          destination: `${apiOrigin}/uploads/videos/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${blogOrigin}/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
