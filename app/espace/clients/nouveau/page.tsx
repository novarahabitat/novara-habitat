import { requireAdmin } from "@/lib/auth";
import { EnTete } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import ChampsClient from "../ChampsClient";
import { creerClient } from "../actions";

export const metadata = { title: "Nouveau client" };

export default async function NouveauClientPage({
  searchParams,
}: {
  searchParams: Promise<{ retour?: string }>;
}) {
  await requireAdmin();
  const { retour } = await searchParams;

  return (
    <div className="max-w-2xl">
      <EnTete titre="Nouveau client" retour={{ href: "/espace/clients", label: "Clients" }} />
      <Formulaire action={creerClient} className="carte">
        {retour === "chantier" && <input type="hidden" name="retour" value="chantier" />}
        <ChampsClient />
        <div className="mt-6">
          <BoutonEnvoi>Créer le client</BoutonEnvoi>
        </div>
      </Formulaire>
    </div>
  );
}
