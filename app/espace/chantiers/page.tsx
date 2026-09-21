import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BadgeChantier, EnTete, Vide } from "@/components/espace/ui";
import { formatDate, libelleStatutChantier } from "@/lib/format";
import type { Chantier, StatutChantier } from "@/lib/types";

export const metadata = { title: "Chantiers" };

type Ligne = Chantier & { clients: { nom: string } | null };

const filtres: { valeur: string; libelle: string }[] = [
  { valeur: "actifs", libelle: "En cours et prévus" },
  { valeur: "termine", libelle: libelleStatutChantier.termine },
  { valeur: "annule", libelle: libelleStatutChantier.annule },
  { valeur: "tous", libelle: "Tous" },
];

export default async function ChantiersPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { filtre = "actifs" } = await searchParams;

  let requete = supabase
    .from("chantiers")
    .select("*, clients(nom)")
    .order("statut", { ascending: true })
    .order("date_debut", { ascending: false, nullsFirst: true });
  if (filtre === "actifs") requete = requete.in("statut", ["en_cours", "prevu"]);
  else if (filtre !== "tous") requete = requete.eq("statut", filtre as StatutChantier);
  const { data } = await requete.returns<Ligne[]>();

  // En cours d'abord, puis prévus.
  const ordre: Record<StatutChantier, number> = { en_cours: 0, prevu: 1, termine: 2, annule: 3 };
  const chantiers = (data ?? []).sort((a, b) => ordre[a.statut] - ordre[b.statut]);

  return (
    <>
      <EnTete
        titre="Chantiers"
        actions={
          <Link href="/espace/chantiers/nouveau" className="bouton">
            Nouveau chantier
          </Link>
        }
      />

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filtres.map((f) => (
          <Link
            key={f.valeur}
            href={f.valeur === "actifs" ? "/espace/chantiers" : `/espace/chantiers?filtre=${f.valeur}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
              filtre === f.valeur ? "border-foret bg-foret text-white" : "border-black/10 bg-white text-gris"
            }`}
          >
            {f.libelle}
          </Link>
        ))}
      </div>

      {!chantiers.length ? (
        <Vide>Aucun chantier ici.</Vide>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {chantiers.map((c) => (
            <li key={c.id}>
              <Link href={`/espace/chantiers/${c.id}`} className="carte block transition hover:border-or/40">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{c.titre}</p>
                  <BadgeChantier statut={c.statut} />
                </div>
                <p className="mt-1 text-sm text-gris">{[c.clients?.nom, c.ville].filter(Boolean).join(" · ")}</p>
                {(c.date_debut || c.date_fin) && (
                  <p className="mt-2 text-xs text-gris">
                    {c.date_debut && `Du ${formatDate(c.date_debut)}`} {c.date_fin && `au ${formatDate(c.date_fin)}`}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
