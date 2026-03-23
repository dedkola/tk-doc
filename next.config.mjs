const isDocker = process.env.DOCKER_BUILD === "true";
const isCloudflarePages = process.env.CF_PAGES === "1";
const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output only in Docker builds (Linux) to support the multi-stage image
  // while avoiding Windows symlink issues during local builds.
  // When building for Cloudflare Pages, use 'export' for a static HTML application.
  output: isCloudflarePages ? "export" : isDocker ? "standalone" : undefined,
  devIndicators: false,

  experimental: {
    optimizePackageImports: ["lucide-react", "cmdk"],
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },

  // Custom headers are not allowed when generating a static export.
  // We use public/_headers for Cloudflare Pages instead.
  ...(isCloudflarePages
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                {
                  key: "Permissions-Policy",
                  value: "geolocation=(), microphone=(), camera=()",
                },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
                { key: "X-DNS-Prefetch-Control", value: "on" },
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'self'",
                    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com`,
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: https:",
                    "font-src 'self'",
                    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
                    "frame-ancestors 'self'",
                  ].join("; "),
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
