import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NOVARA Habitat — La rénovation réinventée",
    template: "%s — NOVARA Habitat",
  },
  description:
    "NOVARA Habitat, rénovation premium : un accompagnement humain et sur mesure pour votre habitat.",
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
