import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BadgeDevis, EnTete, Vide } from "@/components/espace/ui";
import { aujourdhui, formatDate, formatEuros } from "@/lib/format";
import type { Devis, StatutDevis } from "@/lib/types";

export const metadata = { title: "Devis" };

type Ligne = Devis & { clients: { nom: string } | null; chantiers: { titre: string } | null };

const filtres = [
  { valeur: "en_cours", libelle: "En cours" },
  { valeur: "accepte", libelle: "Acceptés" },
  { valeur: "refuse", libelle: "Refusés" },
  { valeur: "tous", libelle: "Tous" },
];

export default async function DevisPage({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { supabase } = await requireAdmin();
  const { filtre = "en_cours" } = await searchParams;

  let requete = supabase
    .from("devis")
    .select("*, clients(nom), chantiers(titre)")
    .order("created_at", { ascending: false });
  const statuts: StatutDevis[] | null =
    filtre === "en_cours" ? ["brouillon", "envoye"] : filtre === "accepte" || filtre === "refuse" ? [filtre] : null;
  if (statuts) requete = requete.in("statut", statuts);
  const { data: devis } = await requete.returns<Ligne[]>();

  const { data: enAttente } = await supabase.from("devis").select("total_ttc").eq("statut", "envoye");
  const totalEnAttente = (enAttente ?? []).reduce((s, d) => s + Number(d.total_ttc), 0);
  const jour = aujourdhui();

  return (
    <>
      <EnTete
        titre="Devis"
        sousTitre={totalEnAttente > 0 ? `En attente de réponse : ${formatEuros(totalEnAttente)}` : undefined}
        actions={
          <Link href="/espace/devis/nouveau" className="bouton">
            Nouveau devis
          </Link>
        }
      />

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filtres.map((f) => (
          <Link
            key={f.valeur}
            href={f.valeur === "en_cours" ? "/espace/devis" : `/espace/devis?filtre=${f.valeur}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
              filtre === f.valeur ? "border-foret bg-foret text-white" : "border-black/10 bg-white text-gris"
            }`}
          >
            {f.libelle}
          </Link>
        ))}
      </div>

      {!devis?.length ? (
        <Vide>Aucun devis ici.</Vide>
      ) : (
        <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
          {devis.map((d) => (
            <li key={d.id}>
              <Link href={`/espace/devis/${d.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-creme/60">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {d.numero ?? "Brouillon"} <span className="font-normal text-gris">· {d.clients?.nom}</span>
                  </p>
                  <p className="truncate text-sm text-gris">
                    {[d.objet ?? d.chantiers?.titre, d.date_emission && formatDate(d.date_emission)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-medium tabular-nums">{formatEuros(d.total_ttc)}</p>
                  <BadgeDevis
                    statut={d.statut}
                    expire={Boolean(d.date_validite && d.date_validite < jour)}
                    facture={Boolean(d.facture_id)}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
