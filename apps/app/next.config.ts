import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

let nextConfig: NextConfig = withToolbar(withLogging(config));

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

// Add rewrites to mask ophim endpoint
nextConfig.rewrites = async () => ({
  beforeFiles: [
    {
      source: "/api/:path*",
      destination: "https://ophim1.com/v1/api/:path*",
    },
  ],
});

export default nextConfig;
