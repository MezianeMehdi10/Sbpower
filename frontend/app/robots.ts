import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/leistungen", "/kontakt"],
        disallow: ["/admin", "/admin/", "/admin/login", "/admin/requests", "/admin/requests/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
