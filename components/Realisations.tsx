"use client";

import { useCallback, useEffect, useState } from "react";
import { DOSSIER_REALISATIONS, realisations } from "@/lib/realisations";

// Grille des chantiers réalisés + agrandissement des photos au clic.
export default function Realisations() {
  const [ouvert, setOuvert] = useState<{ r: number; p: number } | null>(null);

  const fermer = useCallback(() => setOuvert(null), []);
  const decaler = useCallback((sens: number) => {
    setOuvert((o) => {
      if (!o) return o;
      const n = realisations[o.r].photos.length;
      return { r: o.r, p: (o.p + sens + n) % n };
    });
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      if (e.key === "ArrowLeft") decaler(-1);
      if (e.key === "ArrowRight") decaler(1);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [ouvert, fermer, decaler]);

  const photo = ouvert ? realisations[ouvert.r].photos[ouvert.p] : null;

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {realisations.map((r, i) => (
          <article key={r.titre} className="overflow-hidden rounded-[28px] bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOuvert({ r: i, p: 0 })}
              className="block h-[300px] w-full cursor-zoom-in overflow-hidden"
              aria-label={`Agrandir ${r.titre}`}
            >
              <img
                src={DOSSIER_REALISATIONS + r.photos[0].fichier}
                alt={r.photos[0].legende}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>

            <div className="p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#b99252]">
                {r.categorie}
                {r.enCours && (
                  <span className="ml-3 rounded-full bg-[#153126] px-2.5 py-1 text-[10px] tracking-[0.15em] text-white">
                    En cours
                  </span>
                )}
              </p>
              <h3 className="mt-3 text-xl font-light text-[#1f1f1f] md:text-2xl">{r.titre}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5c5a55]">{r.texte}</p>

              {r.photos.length > 1 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {r.photos.map((ph, j) => (
                    <button
                      key={ph.fichier}
                      type="button"
                      onClick={() => setOuvert({ r: i, p: j })}
                      className="h-16 w-16 cursor-zoom-in overflow-hidden rounded-xl transition hover:opacity-75"
                      aria-label={ph.legende}
                    >
                      <img
                        src={DOSSIER_REALISATIONS + ph.fichier}
                        alt={ph.legende}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {ouvert && photo && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6"
          onClick={(e) => e.target === e.currentTarget && fermer()}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" onClick={fermer} aria-label="Fermer"
            className="absolute right-5 top-5 h-12 w-12 rounded-full bg-white/15 text-xl text-white">
            ✕
          </button>
          <button type="button" onClick={() => decaler(-1)} aria-label="Photo précédente"
            className="absolute left-5 top-1/2 h-12 w-12 rounded-full bg-white/15 text-2xl text-white">
            ‹
          </button>
          <img
            src={DOSSIER_REALISATIONS + photo.fichier}
            alt={photo.legende}
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
          />
          <p className="mt-4 text-sm tracking-wide text-white/85">
            {photo.legende} · {ouvert.p + 1} / {realisations[ouvert.r].photos.length}
          </p>
          <button type="button" onClick={() => decaler(1)} aria-label="Photo suivante"
            className="absolute right-5 top-1/2 h-12 w-12 rounded-full bg-white/15 text-2xl text-white">
            ›
          </button>
        </div>
      )}
    </>
  );
}
