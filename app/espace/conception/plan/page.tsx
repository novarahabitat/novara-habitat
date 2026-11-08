import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { EnTete } from "@/components/espace/ui";
import type { Chantier } from "@/lib/types";

export const metadata = { title: "Plan" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// L'outil vit dans son propre document : on l'ouvre dans un cadre, en lui
// passant le chantier. C'est lui qui lit et enregistre le plan.
export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ chantier?: string }>;
}) {
  const { chantier } = await searchParams;
  if (!chantier || !UUID.test(chantier)) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("chantiers")
    .select("id, titre")
    .eq("id", chantier)
    .maybeSingle<Pick<Chantier, "id" | "titre">>();
  if (!data) notFound();

  const outil = `/espace/conception/outil?chantier=${data.id}&titre=${encodeURIComponent(data.titre)}`;

  return (
    <>
      <EnTete
        titre={data.titre}
        sousTitre="Le plan s’enregistre tout seul : sur cet appareil d’abord, puis en ligne dès que la connexion le permet."
        retour={{ href: "/espace/conception", label: "Conception" }}
        actions={
          <>
            <a href={`/espace/chantiers/${data.id}`} className="bouton-secondaire">
              Le chantier
            </a>
            <a href={outil} target="_blank" rel="noopener noreferrer" className="bouton-secondaire">
              Plein écran
            </a>
          </>
        }
      />

      <div className="h-[calc(100svh-18rem)] min-h-[28rem] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:h-[calc(100svh-15rem)]">
        <iframe src={outil} title={`Plan — ${data.titre}`} className="h-full w-full border-0" />
      </div>
    </>
  );
}
