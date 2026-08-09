import { env } from "@/env";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = new URL(env.NEXT_PUBLIC_APP_URL).origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // widok do druku i ekran offline nie mają samodzielnej treści dla wyszukiwarki
      disallow: ["/print", "/~offline", "/serwist/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
