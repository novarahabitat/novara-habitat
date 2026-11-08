import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le moteur PDF s'exécute tel quel côté serveur, sans être réempaqueté.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Le fichier HTML de l'outil de conception est lu au moment de la requête :
  // il doit être embarqué avec la route qui le sert.
  outputFileTracingIncludes: {
    "/espace/conception/outil": ["./app/espace/conception/novara-plan.html"],
  },
  async redirects() {
    // Anciennes adresses de l'ancien système : on renvoie vers l'espace pro.
    return ["/admin", "/core", "/sales", "/espace-client", "/property", "/brain"].flatMap((source) => [
      { source, destination: "/connexion", permanent: false },
      { source: `${source}/:chemin*`, destination: "/connexion", permanent: false },
    ]);
  },
};

export default nextConfig;
