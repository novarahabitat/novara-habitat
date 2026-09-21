"use client";

import { useTransition } from "react";
import { marquerTraitee } from "./actions";

export default function BoutonTraitee({ id, traitee }: { id: string; traitee: boolean }) {
  const [enCours, demarrer] = useTransition();
  return (
    <button
      type="button"
      disabled={enCours}
      onClick={() => demarrer(async () => void (await marquerTraitee(id, !traitee)))}
      className="bouton-secondaire !px-4 !py-2"
    >
      {traitee ? "Remettre à traiter" : "Marquer traitée"}
    </button>
  );
}
