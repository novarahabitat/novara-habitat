import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVARA Habitat",
  description: "Rénovation premium, habitat intelligent et suivi chantier client.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
