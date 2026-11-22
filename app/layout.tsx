import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "NOVARA Habitat, rénovation intérieure à Saint-Malo et alentours (Dinard, Dinan, Cancale) : salle de bain, cuisine, rénovation complète, aménagements sur mesure et peinture. Devis gratuit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rénovation intérieure à Saint-Malo — NOVARA Habitat",
    template: "%s — NOVARA Habitat",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "NOVARA Habitat",
    title: "Rénovation intérieure à Saint-Malo — NOVARA Habitat",
    description: DESCRIPTION,
    images: [{ url: "/images/realisations/cuisine-ouverte-apres.jpg", width: 1600, height: 1200 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#153126",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
