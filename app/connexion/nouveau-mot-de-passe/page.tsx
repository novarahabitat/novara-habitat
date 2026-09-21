import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { changerMotDePasse } from "../actions";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

export default async function NouveauMotDePassePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion/oubli?expire=1");

  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-4 py-16 text-encre">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-light">Nouveau mot de passe</h1>
        <Formulaire action={changerMotDePasse} className="carte space-y-5">
          <div>
            <label htmlFor="mot_de_passe" className="etiquette">
              Nouveau mot de passe (10 caractères minimum)
            </label>
            <input
              id="mot_de_passe"
              name="mot_de_passe"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              className="champ"
            />
          </div>
          <div>
            <label htmlFor="confirmation" className="etiquette">
              Confirmer
            </label>
            <input
              id="confirmation"
              name="confirmation"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              className="champ"
            />
          </div>
          <BoutonEnvoi enCours="Enregistrement…" className="w-full">
            Enregistrer et entrer
          </BoutonEnvoi>
        </Formulaire>
      </div>
    </main>
  );
}
