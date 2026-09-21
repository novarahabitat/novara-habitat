"use client";

import { useTransition } from "react";
import type { Commentaire } from "@/lib/types";
import { formatDateHeure } from "@/lib/format";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { ajouterCommentaire, supprimerCommentaire } from "../actions";

export default function Commentaires({
  chantierId,
  commentaires,
}: {
  chantierId: string;
  commentaires: Commentaire[];
}) {
  const [enCours, demarrer] = useTransition();

  return (
    <div>
      <Formulaire action={ajouterCommentaire.bind(null, chantierId)} viderApresSucces>
        <textarea
          name="contenu"
          rows={3}
          required
          placeholder="Avancement, remarque, problème rencontré…"
          className="champ"
        />
        <div className="mt-2 flex justify-end">
          <BoutonEnvoi enCours="Ajout…">Ajouter</BoutonEnvoi>
        </div>
      </Formulaire>

      {commentaires.length > 0 && (
        <ol className="mt-5 space-y-4 border-l border-black/10 pl-4">
          {commentaires.map((c) => (
            <li key={c.id} className="group relative">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-or" />
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs text-gris">{formatDateHeure(c.created_at)}</p>
                <button
                  type="button"
                  disabled={enCours}
                  onClick={() => {
                    if (window.confirm("Supprimer ce commentaire ?")) {
                      demarrer(async () => {
                        await supprimerCommentaire(chantierId, c.id);
                      });
                    }
                  }}
                  className="text-xs text-black/30 hover:text-alerte"
                >
                  Supprimer
                </button>
              </div>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{c.contenu}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
