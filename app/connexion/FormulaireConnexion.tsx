"use client";

import { useActionState } from "react";
import { seConnecter } from "./actions";

export default function FormulaireConnexion({ refus }: { refus: boolean }) {
  const [etat, action, envoi] = useActionState(seConnecter, undefined);
  const erreur = etat?.erreur ?? (refus ? "Ce compte n'a pas accès à l'espace pro." : undefined);

  return (
    <form action={action} className="carte space-y-5">
      <div>
        <label htmlFor="email" className="etiquette">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="champ" />
      </div>
      <div>
        <label htmlFor="mot_de_passe" className="etiquette">
          Mot de passe
        </label>
        <input
          id="mot_de_passe"
          name="mot_de_passe"
          type="password"
          autoComplete="current-password"
          required
          className="champ"
        />
      </div>
      {erreur && <p className="text-sm text-alerte">{erreur}</p>}
      <button disabled={envoi} className="bouton w-full">
        {envoi ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
