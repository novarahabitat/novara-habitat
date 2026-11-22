import { CODE_POSTAL, EMAIL, NOM, SERVICES, SITE_URL, VILLE, ZONE } from "@/lib/site";

// Fiche lue par Google (données structurées) : qui on est, où on intervient, quels travaux.
export default function FicheEntreprise() {
  const fiche = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: NOM,
    url: SITE_URL,
    email: EMAIL,
    logo: `${SITE_URL}/images/novara-logo-noir.jpg`,
    image: `${SITE_URL}/images/realisations/cuisine-ouverte-apres.jpg`,
    description:
      "Rénovation intérieure à Saint-Malo et alentours : salles de bain, cuisines, rénovation complète, aménagements sur mesure et peinture.",
    address: {
      "@type": "PostalAddress",
      addressLocality: VILLE,
      postalCode: CODE_POSTAL,
      addressRegion: "Bretagne",
      addressCountry: "FR",
    },
    areaServed: ZONE.map((nom) => ({ "@type": "City", name: nom })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travaux de rénovation",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.titre, description: s.texte },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fiche).replace(/</g, "\\u003c") }}
    />
  );
}
