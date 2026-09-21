"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { champ } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

export async function seConnecter(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const email = champ(fd, "email");
  const motDePasse = fd.get("mot_de_passe");
  if (!email || typeof motDePasse !== "string" || !motDePasse) {
    return { erreur: "Email et mot de passe requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  if (error) return { erreur: "Email ou mot de passe incorrect." };

  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!estAdmin) {
    await supabase.auth.signOut();
    return { erreur: "Ce compte n'a pas accès à l'espace pro." };
  }

  redirect("/espace");
}

export async function seDeconnecter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export async function demanderReinitialisation(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const email = champ(fd, "email");
  if (!email) return { erreur: "Indiquez votre email." };

  const origine = (await headers()).get("origin") ?? "https://novarahabitat.fr";
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origine}/auth/callback?suite=/connexion/nouveau-mot-de-passe`,
  });
  // Même réponse que le compte existe ou non.
  return { ok: "Si ce compte existe, un email vient de partir avec un lien pour choisir un nouveau mot de passe." };
}

export async function changerMotDePasse(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const motDePasse = fd.get("mot_de_passe");
  const confirmation = fd.get("confirmation");
  if (typeof motDePasse !== "string" || motDePasse.length < 10)
    return { erreur: "Le mot de passe doit contenir au moins 10 caractères." };
  if (motDePasse !== confirmation) return { erreur: "Les deux mots de passe ne correspondent pas." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erreur: "Le lien a expiré. Refaites une demande depuis « Mot de passe oublié »." };

  const { error } = await supabase.auth.updateUser({ password: motDePasse });
  if (error) return { erreur: "Le mot de passe n'a pas pu être changé. Réessayez." };
  redirect("/espace");
}
