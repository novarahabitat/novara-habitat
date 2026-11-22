"use client";

import { useActionState } from "react";
import { envoyerDemande } from "./actions";

export default function FormulaireContact() {
  const [etat, action, envoi] = useActionState(envoyerDemande, undefined);

  if (etat?.ok) {
    return (
      <div className="mt-12 rounded-md bg-white p-8 md:p-10">
        <p className="text-2xl">{etat.ok}</p>
      </div>
    );
  }

  const champ =
    "w-full rounded-md border border-[#1F2A30]/20 bg-white px-4 py-4 text-[#1F2A30] focus:border-[#5E7C82]";

  return (
    <form action={action} className="mt-12 rounded-md bg-white p-6 sm:p-8 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <input className={champ} name="nom" placeholder="Nom complet" autoComplete="name" required />
        <input className={champ} name="telephone" placeholder="Téléphone" type="tel" autoComplete="tel" />
      </div>

      <input className={`${champ} mt-5`} name="email" placeholder="Email" type="email" autoComplete="email" />
      <input className={`${champ} mt-5`} name="type_projet" placeholder="Type de projet" />
      <textarea className={`${champ} mt-5 min-h-40`} name="message" placeholder="Votre message" />

      {/* Piège à robots, invisible pour les visiteurs */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {etat?.erreur && <p className="mt-5 text-sm text-[#a3352b]">{etat.erreur}</p>}

      <button
        disabled={envoi}
        className="btn mt-8 disabled:opacity-60"
      >
        {envoi ? "Envoi…" : "Envoyer la demande"}
      </button>
    </form>
  );
}
