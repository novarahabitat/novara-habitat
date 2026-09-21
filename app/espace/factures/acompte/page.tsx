import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { EnTete, Vide } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { creerAcompte } from "../actions";

export const metadata = { title: "Facture d'acompte" };

export default async function AcomptePage({
  searchParams,
}: {
  searchParams: Promise<{ chantier?: string }>;
}) {
  const { supabase, user } = await requireAdmin();
  const { chantier: chantierId } = await searchParams;
  if (!chantierId) notFound();

  const [{ data: chantier }, { data: entreprise }] = await Promise.all([
    supabase.from("chantiers").select("id, titre, client_id, clients(nom)").eq("id", chantierId).maybeSingle<{
      id: string;
      titre: string;
      client_id: string | null;
      clients: { nom: string } | null;
    }>(),
    supabase.from("entreprise").select("franchise_tva").eq("owner_id", user.id).maybeSingle(),
  ]);
  if (!chantier) notFound();
  const franchise = Boolean(entreprise?.franchise_tva);

  return (
    <div className="max-w-xl">
      <EnTete
        titre="Facture d'acompte"
        sousTitre={`${chantier.titre}${chantier.clients ? ` · ${chantier.clients.nom}` : ""}`}
        retour={{ href: `/espace/chantiers/${chantier.id}`, label: chantier.titre }}
      />

      {!chantier.client_id ? (
        <Vide>
          Associez d&apos;abord un client à ce chantier.{" "}
          <Link href={`/espace/chantiers/${chantier.id}/modifier`} className="text-or underline">
            Modifier le chantier
          </Link>
        </Vide>
      ) : (
        <Formulaire action={creerAcompte.bind(null, chantier.id)} className="carte space-y-4">
          <div>
            <label className="etiquette" htmlFor="montant_travaux">
              Montant total des travaux {franchise ? "(€)" : "HT (€)"} *
            </label>
            <input id="montant_travaux" name="montant_travaux" inputMode="decimal" required className="champ" placeholder="Ex. 8500" />
            <p className="mt-1 text-xs text-gris">Le montant de votre devis.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="etiquette" htmlFor="pourcentage">
                Acompte (%)
              </label>
              <input id="pourcentage" name="pourcentage" inputMode="decimal" defaultValue="30" required className="champ" />
            </div>
            {!franchise && (
              <div>
                <label className="etiquette" htmlFor="taux_tva">
                  TVA
                </label>
                <select id="taux_tva" name="taux_tva" defaultValue="10" className="champ">
                  <option value="20">20 %</option>
                  <option value="10">10 %</option>
                  <option value="5.5">5,5 %</option>
                  <option value="0">0 %</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="etiquette" htmlFor="periode_travaux">
              Date ou période prévue des travaux
            </label>
            <input id="periode_travaux" name="periode_travaux" className="champ" placeholder="Ex. à partir du 06/10/2026" />
          </div>
          <p className="rounded-xl bg-creme p-3 text-sm text-gris">
            Un brouillon est créé : vérifiez-le, émettez-le, puis marquez-le « payé » quand vous recevez l&apos;argent.
            Le PDF devient alors le reçu (« facture acquittée »). La facture finale du chantier déduira cet acompte
            automatiquement.
          </p>
          <BoutonEnvoi enCours="Création…">Créer l&apos;acompte</BoutonEnvoi>
        </Formulaire>
      )}
    </div>
  );
}
