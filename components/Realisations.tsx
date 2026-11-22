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
      <div className="chantiers">
        {realisations.map((r, i) => (
          <article key={r.titre} className="chantier">
            <button
              type="button"
              className="photo"
              onClick={() => setOuvert({ r: i, p: 0 })}
              aria-label={`Agrandir : ${r.titre}`}
            >
              <img src={DOSSIER_REALISATIONS + r.photos[0].fichier} alt={r.photos[0].legende} loading="lazy" />
            </button>
            <p className="type">
              {r.categorie}
              {r.enCours && <span className="encours">En cours</span>}
            </p>
            <h3>{r.titre}</h3>
            <p>{r.texte}</p>
            {r.photos.length > 1 && (
              <div className="vignettes">
                {r.photos.slice(1).map((ph, j) => (
                  <button
                    key={ph.fichier}
                    type="button"
                    onClick={() => setOuvert({ r: i, p: j + 1 })}
                    aria-label={ph.legende}
                  >
                    <img src={DOSSIER_REALISATIONS + ph.fichier} alt={ph.legende} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {ouvert && photo && (
        <div
          className="boite ouverte"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && fermer()}
        >
          <button type="button" className="fermer" onClick={fermer} aria-label="Fermer" autoFocus>
            ✕
          </button>
          <button type="button" className="prec" onClick={() => decaler(-1)} aria-label="Photo précédente">
            ‹
          </button>
          <img src={DOSSIER_REALISATIONS + photo.fichier} alt={photo.legende} />
          <div className="leg">
            {photo.legende} ({ouvert.p + 1}/{realisations[ouvert.r].photos.length})
          </div>
          <button type="button" className="suiv" onClick={() => decaler(1)} aria-label="Photo suivante">
            ›
          </button>
        </div>
      )}
    </>
  );
}
