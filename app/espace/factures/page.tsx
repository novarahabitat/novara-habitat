import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BadgeFacture, EnTete, Vide } from "@/components/espace/ui";
import { aujourdhui, formatDate, formatEuros } from "@/lib/format";
import type { Facture, StatutFacture } from "@/lib/types";

export const metadata = { title: "Factures" };

type Ligne = Facture & { clients: { nom: string } | null; chantiers: { titre: string } | null };

const filtres = [
  { valeur: "a_payer", libelle: "À payer" },
  { valeur: "brouillon", libelle: "Brouillons" },
  { valeur: "payee", libelle: "Payées" },
  { valeur: "toutes", libelle: "Toutes" },
];

export default async function FacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { filtre = "a_payer" } = await searchParams;

  let requete = supabase
    .from("factures")
    .select("*, clients(nom), chantiers(titre)")
    .order("date_emission", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false });
  const statut: StatutFacture | null =
    filtre === "a_payer" ? "emise" : filtre === "brouillon" || filtre === "payee" ? filtre : null;
  if (statut) requete = requete.eq("statut", statut);
  const { data: factures } = await requete.returns<Ligne[]>();

  const { data: aPayer } = await supabase.from("factures").select("total_ttc, net_a_payer").eq("statut", "emise");
  const totalDu = (aPayer ?? []).reduce((s, f) => s + Number(f.net_a_payer ?? f.total_ttc), 0);
  const jour = aujourdhui();

  return (
    <>
      <EnTete
        titre="Factures"
        sousTitre={totalDu > 0 ? `Reste à encaisser : ${formatEuros(totalDu)} TTC` : undefined}
        actions={
          <Link href="/espace/factures/nouvelle" className="bouton">
            Nouvelle facture
          </Link>
        }
      />

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filtres.map((f) => (
          <Link
            key={f.valeur}
            href={f.valeur === "a_payer" ? "/espace/factures" : `/espace/factures?filtre=${f.valeur}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
              filtre === f.valeur ? "border-foret bg-foret text-white" : "border-black/10 bg-white text-gris"
            }`}
          >
            {f.libelle}
          </Link>
        ))}
      </div>

      {!factures?.length ? (
        <Vide>Aucune facture ici.</Vide>
      ) : (
        <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
          {factures.map((f) => (
            <li key={f.id}>
              <Link href={`/espace/factures/${f.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-creme/60">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {f.type === "avoir" && <span className="text-alerte">Avoir </span>}
                    {f.type === "acompte" && <span className="text-or">Acompte </span>}
                    {f.numero ?? "Brouillon"} <span className="font-normal text-gris">· {f.clients?.nom}</span>
                  </p>
                  <p className="truncate text-sm text-gris">
                    {[f.chantiers?.titre ?? f.objet, f.date_emission && formatDate(f.date_emission)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-medium tabular-nums">{formatEuros(f.total_ttc)}</p>
                  <BadgeFacture statut={f.statut} enRetard={Boolean(f.date_echeance && f.date_echeance < jour)} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
