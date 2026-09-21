import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { EnTete, Vide } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { creerDepuisFormulaire } from "../actions";

export const metadata = { title: "Nouvelle facture" };

export default async function NouvelleFacturePage() {
  const { supabase } = await requireAdmin();
  const [{ data: clients }, { data: chantiers }] = await Promise.all([
    supabase.from("clients").select("id, nom, societe").order("nom"),
    supabase
      .from("chantiers")
      .select("id, titre, clients(nom)")
      .neq("statut", "annule")
      .order("created_at", { ascending: false })
      .returns<{ id: string; titre: string; clients: { nom: string } | null }[]>(),
  ]);

  return (
    <div className="max-w-xl">
      <EnTete titre="Nouvelle facture" retour={{ href: "/espace/factures", label: "Factures" }} />
      {!clients?.length ? (
        <Vide>
          Créez d&apos;abord un client.{" "}
          <Link href="/espace/clients/nouveau" className="text-or underline">
            Nouveau client
          </Link>
        </Vide>
      ) : (
        <Formulaire action={creerDepuisFormulaire} className="carte space-y-4">
          <div>
            <label className="etiquette" htmlFor="client_id">
              Client *
            </label>
            <select id="client_id" name="client_id" required className="champ" defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                  {c.societe ? ` (${c.societe})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="etiquette" htmlFor="chantier_id">
              Chantier
            </label>
            <select id="chantier_id" name="chantier_id" className="champ" defaultValue="">
              <option value="">— Aucun —</option>
              {chantiers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titre}
                  {c.clients?.nom ? ` — ${c.clients.nom}` : ""}
                </option>
              ))}
            </select>
          </div>
          <BoutonEnvoi enCours="Création…">Créer le brouillon</BoutonEnvoi>
        </Formulaire>
      )}
    </div>
  );
}
