import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Google peut lire le site public, pas l'espace pro ni les outils internes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/espace", "/connexion", "/api", "/auth", "/naomi"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
