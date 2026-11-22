import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Plan du site lu par Google : uniquement les pages publiques.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/experience`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
