"use client";

import { useState, useTransition } from "react";
import type { StatutChantier } from "@/lib/types";
import { libelleStatutChantier } from "@/lib/format";
import { changerStatut } from "../actions";

const ordre: StatutChantier[] = ["prevu", "en_cours", "termine", "annule"];

export default function Statut({ id, statut }: { id: string; statut: StatutChantier }) {
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string>();

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {ordre.map((s) => (
          <button
            key={s}
            type="button"
            disabled={enCours || s === statut}
            onClick={() =>
              demarrer(async () => {
                const r = await changerStatut(id, s);
                setErreur(r?.erreur);
              })
            }
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
              s === statut
                ? "border-foret bg-foret text-white"
                : "border-black/10 bg-white text-gris hover:border-or disabled:opacity-50"
            }`}
          >
            {libelleStatutChantier[s]}
          </button>
        ))}
      </div>
      {erreur && <p className="mt-2 text-sm text-alerte">{erreur}</p>}
    </div>
  );
}
