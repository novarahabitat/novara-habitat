"use server";

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
