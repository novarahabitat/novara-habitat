import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "NOVARA Habitat", description: "Plateforme NOVARA Habitat" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
