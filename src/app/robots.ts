import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexableDeployment } from "@/lib/site-config";

const DISALLOWED_PATHS = [
  "/dashboard",
  "/today",
  "/roadmap",
  "/study-sessions",
  "/analytics",
  "/readiness",
  "/portfolio",
  "/settings",
  "/auth",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (!isIndexableDeployment()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/terms", "/privacy", "/contact"],
      disallow: DISALLOWED_PATHS,
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
