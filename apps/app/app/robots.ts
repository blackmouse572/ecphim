import type { MetadataRoute } from "next";
import { env } from "@/env";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ["Googlebot", "Bingbot", "Slurp", "Applebot", "DuckDuckBot", "YandexBot", "Sogou"],
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api"],
    },
    sitemap: new URL("/sitemap.xml", url.href).href,
  };
}
