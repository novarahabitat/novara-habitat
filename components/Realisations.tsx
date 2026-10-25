"use client";

import { useEffect, useState } from "react";

const D = "/images/";

type Photo = { src: string; legende: string; categorie: Categorie };
type Categorie = "Salles de bain" | "Cuisines" | "Aménagements" | "Extérieur";

const PHOTOS: Photo[] = [
  { src: "cuisine-ouverte-apres", legende: "Cuisine ouverte avec îlot", categorie: "Cuisines" },
  { src: "sdb-douche-italienne", legende: "Douche à l'italienne et carreaux de ciment", categorie: "Salles de bain" },
  { src: "niche-bibliotheque", legende: "Niche bibliothèque éclairée", categorie: "Aménagements" },
  { src: "cuisine-2022-apres", legende: "Cuisine en chêne relookée", categorie: "Cuisines" },
  { src: "sdb-bleue-vasque", legende: "Salle d'eau, vasque et miroir laiton", categorie: "Salles de bain" },
  { src: "cheminee-bois", legende: "Habillage de cheminée", categorie: "Aménagements" },
  { src: "toiture-apres", legende: "Toiture refaite à neuf", categorie: "Extérieur" },
  { src: "sdb-moderne-douche", legende: "Salle de bain, douche de plain-pied", categorie: "Salles de bain" },
  { src: "cuisine-2022-plan-travail", legende: "Plan de travail bois et façades repeintes", categorie: "Cuisines" },
  { src: "cheminee-blanche", legende: "Cheminée et manteau en chêne", categorie: "Aménagements" },
  { src: "sdb-bleue-douche", legende: "Douche et WC", categorie: "Salles de bain" },
  { src: "kitchenette", legende: "Kitchenette d'appartement", categorie: "Cuisines" },
  { src: "chambre-bebe", legende: "Chambre d'enfant", categorie: "Aménagements" },
  { src: "sdb-moderne-meuble", legende: "Meuble vasque et sèche-serviettes", categorie: "Salles de bain" },
  { src: "cuisine-2022-facades", legende: "Façades en chêne remises au goût du jour", categorie: "Cuisines" },
  { src: "jardin-massif", legende: "Massif paysager", categorie: "Extérieur" },
  { src: "sdb-bleue-lavabo", legende: "Meuble lavabo sur mesure", categorie: "Salles de bain" },
  { src: "sdb-meuble-bois", legende: "Plan vasque bois", categorie: "Salles de bain" },
  { src: "cuisine-2022-evier", legende: "Évier et rangements", categorie: "Cuisines" },
  { src: "cuisine-2022-etageres", legende: "Étagères sur mesure", categorie: "Cuisines" },
];

const CATEGORIES: ("Tout" | Categorie)[] = ["Tout", "Salles de bain", "Cuisines", "Aménagements", "Extérieur"];

function Image2({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={`${D}${src}.jpg`} alt={alt} loading="lazy" className={className} />;
}

function AvantApres({ titre, avant, apres, texte }: { titre: string; avant: string; apres: string; texte: string }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
      <div className="grid grid-cols-2 gap-1 bg-black">
        <div className="relative">
          <Image2 src={avant} alt={`${titre} avant`} className="h-56 w-full object-cover md:h-80" />
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white">
            Avant
          </span>
        </div>
        <div className="relative">
          <Image2 src={apres} alt={`${titre} après`} className="h-56 w-full object-cover md:h-80" />
          <span className="absolute right-3 top-3 rounded-full bg-[#c9a45c]/90 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-black">
            Après
          </span>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-light text-[#1f1f1f] md:text-2xl">{titre}</h3>
        <p className="mt-2 text-[#4b4b4b]">{texte}</p>
      </div>
    </div>
  );
}

export default function Realisations() {
  const [filtre, setFiltre] = useState<(typeof CATEGORIES)[number]>("Tout");
  const [ouverte, setOuverte] = useState<number | null>(null);
  const liste = filtre === "Tout" ? PHOTOS : PHOTOS.filter((p) => p.categorie === filtre);

  useEffect(() => {
    if (ouverte === null) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuverte(null);
      if (e.key === "ArrowRight") setOuverte((i) => (i === null ? i : (i + 1) % liste.length));
      if (e.key === "ArrowLeft") setOuverte((i) => (i === null ? i : (i - 1 + liste.length) % liste.length));
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [ouverte, liste.length]);

  return (
    <section id="portfolio" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">Réalisations</p>
          <h2 className="text-4xl font-light text-[#1f1f1f] md:text-5xl">
            Nos chantiers,
            <br />
            en vrai.
          </h2>
        </div>

        {/* Du plan au résultat */}
        <div className="mb-20 rounded-[32px] bg-[#f5f1e8] p-6 md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b99252]">Du plan au résultat</p>
          <h3 className="mb-8 max-w-2xl text-2xl font-light text-[#1f1f1f] md:text-3xl">
            Vous voyez votre projet en image avant le premier coup de marteau.
          </h3>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { src: "cuisine-ouverte-avant", titre: "1. La pièce au départ" },
              { src: "cuisine-ouverte-plan", titre: "2. Le projet dessiné en 3D" },
              { src: "cuisine-ouverte-apres", titre: "3. La cuisine livrée" },
            ].map((e) => (
              <figure key={e.src} className="overflow-hidden rounded-[24px] bg-white shadow-lg">
                <Image2 src={e.src} alt={e.titre} className="h-64 w-full object-cover" />
                <figcaption className="p-4 text-[#1f1f1f]">{e.titre}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Avant / après */}
        <div className="mb-20 grid gap-8 lg:grid-cols-2">
          <AvantApres
            titre="Cuisine relookée"
            avant="cuisine-2022-avant"
            apres="cuisine-2022-apres"
            texte="Les façades en chêne gardées et repeintes, nouveau plan de travail, évier et plaque : une cuisine neuve sans tout remplacer."
          />
          <AvantApres
            titre="Toiture refaite"
            avant="toiture-avant"
            apres="toiture-apres"
            texte="Charpente pourrie remplacée et couverture neuve, gouttières comprises."
          />
        </div>

        {/* Galerie */}
        <div className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 md:justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFiltre(c)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${
                filtre === c ? "border-[#173328] bg-[#173328] text-white" : "border-black/10 text-[#4b4b4b] hover:border-[#c8a46b]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {liste.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOuverte(i)}
              className="group relative overflow-hidden rounded-2xl bg-[#f5f1e8]"
            >
              <Image2
                src={p.src}
                alt={p.legende}
                className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white md:text-sm">
                {p.legende}
              </span>
            </button>
          ))}
        </div>
      </div>

      {ouverte !== null && liste[ouverte] && (
        <div
          role="dialog"
          aria-label={liste[ouverte].legende}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOuverte(null)}
        >
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image2
              src={liste[ouverte].src}
              alt={liste[ouverte].legende}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-white">{liste[ouverte].legende}</figcaption>
          </figure>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              setOuverte((ouverte - 1 + liste.length) % liste.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-4 py-3 text-2xl text-white md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              setOuverte((ouverte + 1) % liste.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-4 py-3 text-2xl text-white md:right-6"
          >
            ›
          </button>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOuverte(null)}
            className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-white"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
