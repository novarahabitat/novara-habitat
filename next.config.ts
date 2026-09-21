import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le moteur PDF s'exécute tel quel côté serveur, sans être réempaqueté.
  serverExternalPackages: ["@react-pdf/renderer"],
  async redirects() {
    // Anciennes adresses de l'ancien système : on renvoie vers l'espace pro.
    return ["/admin", "/core", "/sales", "/espace-client", "/property", "/brain"].flatMap((source) => [
      { source, destination: "/connexion", permanent: false },
      { source: `${source}/:chemin*`, destination: "/connexion", permanent: false },
    ]);
  },
};

export default nextConfig;
