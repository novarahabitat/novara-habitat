import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { EnTete, Vide } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { formatDateHeure } from "@/lib/format";
import type { DemandeContact } from "@/lib/types";
import { convertirEnClient, supprimerDemande } from "./actions";
import BoutonTraitee from "./BoutonTraitee";

export const metadata = { title: "Demandes" };

export default async function DemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ toutes?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { toutes } = await searchParams;

  let requete = supabase.from("demandes_contact").select("*").order("created_at", { ascending: false });
  if (!toutes) requete = requete.eq("traitee", false);
  const { data: demandes } = await requete.returns<DemandeContact[]>();

  return (
    <>
      <EnTete
        titre="Demandes de contact"
        sousTitre="Envoyées depuis le formulaire du site."
        actions={
          <Link href={toutes ? "/espace/demandes" : "/espace/demandes?toutes=1"} className="bouton-secondaire">
            {toutes ? "À traiter seulement" : "Voir aussi les traitées"}
          </Link>
        }
      />

      {!demandes?.length ? (
        <Vide>Aucune demande {toutes ? "" : "à traiter"}.</Vide>
      ) : (
        <ul className="space-y-3">
          {demandes.map((d) => (
            <li key={d.id} className={`carte ${d.traitee ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {d.nom}
                  {d.type_projet && <span className="font-normal text-gris"> · {d.type_projet}</span>}
                </p>
                <p className="text-xs text-gris">{formatDateHeure(d.created_at)}</p>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 text-sm">
                {d.telephone && (
                  <a href={`tel:${d.telephone}`} className="text-foret underline">
                    {d.telephone}
                  </a>
                )}
                {d.email && (
                  <a href={`mailto:${d.email}`} className="text-foret underline">
                    {d.email}
                  </a>
                )}
              </div>
              {d.message && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{d.message}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {!d.traitee && (
                  <Formulaire action={convertirEnClient.bind(null, d.id)}>
                    <BoutonEnvoi enCours="Création…" className="!px-4 !py-2">
                      Créer le client
                    </BoutonEnvoi>
                  </Formulaire>
                )}
                <BoutonTraitee id={d.id} traitee={d.traitee} />
                <Formulaire action={supprimerDemande.bind(null, d.id)} confirmation="Supprimer cette demande ?">
                  <BoutonEnvoi variante="danger" enCours="…" className="!px-4 !py-2">
                    Supprimer
                  </BoutonEnvoi>
                </Formulaire>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
