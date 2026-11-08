import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BadgeChantier, EnTete, Section, Vide } from "@/components/espace/ui";
import { formatDateHeure } from "@/lib/format";
import type { Chantier, Plan } from "@/lib/types";

export const metadata = { title: "Conception" };

type LignePlan = Pick<Plan, "chantier_id" | "resume" | "modifie_le" | "appareil">;

export default async function ConceptionPage() {
  const { supabase } = await requireAdmin();

  const [{ data: chantiers }, { data: plans }] = await Promise.all([
    supabase
      .from("chantiers")
      .select("id, titre, statut, ville")
      .order("date_debut", { ascending: false, nullsFirst: false })
      .returns<Pick<Chantier, "id" | "titre" | "statut" | "ville">[]>(),
    supabase.from("plans").select("chantier_id, resume, modifie_le, appareil").returns<LignePlan[]>(),
  ]);

  const parChantier = new Map((plans ?? []).map((p) => [p.chantier_id, p]));

  return (
    <>
      <EnTete
        titre="Conception"
        sousTitre="Un plan par chantier : murs, pièces, réseaux, tableau électrique et vue 3D. Le plan se continue d’un appareil à l’autre."
        actions={
          <a href="/espace/conception/outil" target="_blank" rel="noopener noreferrer" className="bouton-secondaire">
            Plan libre
          </a>
        }
      />

      <Section titre="Chantiers">
        {chantiers?.length ? (
          <ul className="divide-y divide-black/[0.06]">
            {chantiers.map((c) => {
              const plan = parChantier.get(c.id);
              return (
                <li key={c.id}>
                  <Link
                    href={`/espace/conception/plan?chantier=${c.id}`}
                    className="-mx-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-3 transition hover:bg-creme"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">{c.titre}</span>
                    {c.ville && <span className="text-xs text-gris">{c.ville}</span>}
                    <BadgeChantier statut={c.statut} />
                    <span className="w-full text-xs text-gris sm:w-auto sm:text-right">
                      {plan ? (
                        <>
                          {plan.resume?.surface ? `${plan.resume.surface} m² · ` : ""}
                          modifié le {formatDateHeure(plan.modifie_le)}
                          {plan.appareil ? ` sur ${plan.appareil}` : ""}
                        </>
                      ) : (
                        "pas encore de plan"
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Vide>
            Aucun chantier pour l’instant.{" "}
            <Link href="/espace/chantiers/nouveau" className="text-or underline">
              Créer un chantier
            </Link>
          </Vide>
        )}
      </Section>

      <p className="mt-5 text-xs text-gris">
        « Plan libre » sert aux essais : il reste sur cet appareil et n’est rattaché à aucun chantier.
      </p>
    </>
  );
}
