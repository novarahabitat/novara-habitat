import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Seul le compte inscrit dans app_admin entre dans l'espace pro.
 * La base applique la même règle (RLS) : cette vérification sert à
 * afficher la bonne page, pas à protéger les données.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!estAdmin) redirect("/connexion?refus=1");

  return { supabase, user };
});
