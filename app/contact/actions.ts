"use server";

import { createClient } from "@/lib/supabase/server";
import { champ } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

export async function envoyerDemande(_: EtatAction, fd: FormData): Promise<EtatAction> {
  // Champ piège invisible : un humain le laisse vide, un robot le remplit.
  if (champ(fd, "site")) return { ok: "Merci, votre demande a bien été envoyée." };

  const nom = champ(fd, "nom");
  const telephone = champ(fd, "telephone");
  const email = champ(fd, "email");

  if (!nom) return { erreur: "Indiquez votre nom." };
  if (!telephone && !email)
    return { erreur: "Indiquez un téléphone ou un email pour que nous puissions vous répondre." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { erreur: "L'adresse email ne semble pas valide." };

  const supabase = await createClient();
  const { error } = await supabase.from("demandes_contact").insert({
    nom: nom.slice(0, 200),
    telephone: telephone?.slice(0, 40) ?? null,
    email: email?.slice(0, 200) ?? null,
    type_projet: champ(fd, "type_projet")?.slice(0, 200) ?? null,
    message: champ(fd, "message")?.slice(0, 5000) ?? null,
  });

  if (error) {
    return {
      erreur:
        "L'envoi n'a pas abouti. Réessayez dans un instant, ou appelez-nous directement.",
    };
  }
  return { ok: "Merci, votre demande a bien été envoyée. Nous vous recontactons rapidement." };
}
