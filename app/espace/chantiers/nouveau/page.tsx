import { requireAdmin } from "@/lib/auth";
import { EnTete } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import ChampsChantier from "../ChampsChantier";
import { creerChantier } from "../actions";

export const metadata = { title: "Nouveau chantier" };

export default async function NouveauChantierPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { client } = await searchParams;
  const { data: clients } = await supabase.from("clients").select("id, nom, societe").order("nom");

  return (
    <div className="max-w-2xl">
      <EnTete titre="Nouveau chantier" retour={{ href: "/espace/chantiers", label: "Chantiers" }} />
      <Formulaire action={creerChantier} className="carte">
        <ChampsChantier clients={clients ?? []} clientParDefaut={client} />
        <div className="mt-6">
          <BoutonEnvoi>Créer le chantier</BoutonEnvoi>
        </div>
      </Formulaire>
    </div>
  );
}
