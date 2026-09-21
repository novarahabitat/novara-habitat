import type { Metadata } from "next";
import Link from "next/link";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { demanderReinitialisation } from "../actions";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default async function OubliPage({ searchParams }: { searchParams: Promise<{ expire?: string }> }) {
  const { expire } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-4 py-16 text-encre">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-light">Mot de passe oublié</h1>
        <p className="mb-6 text-center text-sm text-gris">
          {expire
            ? "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau."
            : "Recevez par email un lien pour choisir un nouveau mot de passe."}
        </p>
        <Formulaire action={demanderReinitialisation} className="carte space-y-5">
          <div>
            <label htmlFor="email" className="etiquette">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="username" required className="champ" />
          </div>
          <BoutonEnvoi enCours="Envoi…" className="w-full">
            Envoyer le lien
          </BoutonEnvoi>
        </Formulaire>
        <p className="mt-5 text-center text-sm">
          <Link href="/connexion" className="text-gris hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
