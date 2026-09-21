"use client";

import { useActionState } from "react";
import { envoyerDemande } from "./actions";

export default function FormulaireContact() {
  const [etat, action, envoi] = useActionState(envoyerDemande, undefined);

  if (etat?.ok) {
    return (
      <div className="mt-14 rounded-[32px] bg-white p-8 shadow-xl md:p-10">
        <p className="text-2xl font-light">{etat.ok}</p>
      </div>
    );
  }

  const champ = "w-full rounded-xl border border-black/10 px-4 py-4 text-[#1f1f1f]";

  return (
    <form action={action} className="mt-14 rounded-[32px] bg-white p-6 shadow-xl sm:p-8 md:p-10">
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
        className="mt-8 rounded-full bg-[#153126] px-10 py-5 text-sm uppercase tracking-[0.22em] text-white disabled:opacity-60"
      >
        {envoi ? "Envoi…" : "Envoyer la demande"}
      </button>
    </form>
  );
}
