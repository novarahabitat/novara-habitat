import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { EnTete } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import type { Chantier } from "@/lib/types";
import ChampsChantier from "../../ChampsChantier";
import { modifierChantier, supprimerChantier } from "../../actions";

export const metadata = { title: "Modifier le chantier" };

export default async function ModifierChantierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: chantier }, { data: clients }] = await Promise.all([
    supabase.from("chantiers").select("*").eq("id", id).maybeSingle<Chantier>(),
    supabase.from("clients").select("id, nom, societe").order("nom"),
  ]);
  if (!chantier) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <EnTete titre="Modifier le chantier" retour={{ href: `/espace/chantiers/${id}`, label: chantier.titre }} />
      <Formulaire action={modifierChantier.bind(null, id)} className="carte">
        <ChampsChantier chantier={chantier} clients={clients ?? []} />
        <div className="mt-6">
          <BoutonEnvoi>Enregistrer</BoutonEnvoi>
        </div>
      </Formulaire>

      <Formulaire
        action={supprimerChantier.bind(null, id)}
        confirmation={`Supprimer définitivement « ${chantier.titre} », ses commentaires et toutes ses photos ? Les factures émises sont conservées.`}
        className="carte"
      >
        <p className="mb-3 text-sm text-gris">
          Supprime le chantier, ses commentaires et ses photos. Les factures sont conservées.
        </p>
        <BoutonEnvoi variante="danger" enCours="Suppression…">
          Supprimer le chantier
        </BoutonEnvoi>
      </Formulaire>
    </div>
  );
}
