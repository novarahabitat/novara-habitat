import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BadgeChantier, Section, Vide } from "@/components/espace/ui";
import { aujourdhui, formatDate, formatDateHeure, formatEuros } from "@/lib/format";
import type { Chantier, DemandeContact, Facture } from "@/lib/types";

export const metadata = { title: "Accueil" };

export default async function AccueilPage() {
  const { supabase, user } = await requireAdmin();
  const jour = aujourdhui();

  const [{ data: chantiers }, { data: aPayer }, { data: demandes }, { data: entreprise }] = await Promise.all([
    supabase
      .from("chantiers")
      .select("*, clients(nom)")
      .in("statut", ["en_cours", "prevu"])
      .order("date_debut", { ascending: true, nullsFirst: false })
      .returns<(Chantier & { clients: { nom: string } | null })[]>(),
    supabase
      .from("factures")
      .select("id, numero, total_ttc, date_echeance, clients(nom)")
      .eq("statut", "emise")
      .order("date_echeance")
      .returns<(Pick<Facture, "id" | "numero" | "total_ttc" | "date_echeance"> & { clients: { nom: string } | null })[]>(),
    supabase
      .from("demandes_contact")
      .select("*")
      .eq("traitee", false)
      .order("created_at", { ascending: false })
      .returns<DemandeContact[]>(),
    supabase.from("entreprise").select("raison_sociale, siret").eq("owner_id", user.id).maybeSingle(),
  ]);

  const enCours = chantiers?.filter((c) => c.statut === "en_cours") ?? [];
  const prevus = chantiers?.filter((c) => c.statut === "prevu") ?? [];
  const totalDu = (aPayer ?? []).reduce((s, f) => s + Number(f.total_ttc), 0);
  const enRetard = (aPayer ?? []).filter((f) => f.date_echeance && f.date_echeance < jour);

  return (
    <>
      <h1 className="mb-6 text-2xl font-light tracking-tight sm:text-3xl">Bonjour</h1>

      {!entreprise?.siret && (
        <Link href="/espace/parametres" className="mb-5 block rounded-2xl border border-or/40 bg-or/10 px-5 py-4 text-sm">
          Première étape : renseignez votre entreprise (SIRET, TVA, assurance décennale) pour pouvoir émettre des
          factures. <span className="underline">Réglages →</span>
        </Link>
      )}

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Link href="/espace/chantiers" className="carte !p-4">
          <p className="text-2xl font-light">{enCours.length}</p>
          <p className="text-xs text-gris">en cours</p>
        </Link>
        <Link href="/espace/factures" className="carte !p-4">
          <p className="truncate text-2xl font-light">{formatEuros(totalDu).replace(/,00/, "")}</p>
          <p className="text-xs text-gris">à encaisser</p>
        </Link>
        <Link href="/espace/demandes" className="carte !p-4">
          <p className={`text-2xl font-light ${demandes?.length ? "text-or" : ""}`}>{demandes?.length ?? 0}</p>
          <p className="text-xs text-gris">demande(s)</p>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          titre="Chantiers en cours"
          actions={
            <Link href="/espace/chantiers/nouveau" className="text-sm text-or hover:underline">
              + Nouveau
            </Link>
          }
        >
          {!enCours.length ? (
            <Vide>Aucun chantier en cours.</Vide>
          ) : (
            <ul className="space-y-1">
              {enCours.map((c) => (
                <li key={c.id}>
                  <Link href={`/espace/chantiers/${c.id}`} className="block rounded-xl px-2 py-2.5 hover:bg-creme">
                    <p className="font-medium">{c.titre}</p>
                    <p className="text-sm text-gris">{[c.clients?.nom, c.ville].filter(Boolean).join(" · ")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {prevus.length > 0 && (
            <>
              <p className="mb-1 mt-5 text-xs uppercase tracking-wider text-gris">À venir</p>
              <ul className="space-y-1">
                {prevus.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/espace/chantiers/${c.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-creme"
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{c.titre}</span>
                        {c.date_debut && <span className="block text-xs text-gris">{formatDate(c.date_debut)}</span>}
                      </span>
                      <BadgeChantier statut={c.statut} />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>

        <div className="space-y-5">
          {enRetard.length > 0 && (
            <Section titre="Factures en retard">
              <ul className="space-y-1">
                {enRetard.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/espace/factures/${f.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-creme"
                    >
                      <span className="min-w-0">
                        <span className="block truncate">
                          {f.numero} · {f.clients?.nom}
                        </span>
                        <span className="block text-xs text-alerte">Échéance {formatDate(f.date_echeance)}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">{formatEuros(f.total_ttc)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section
            titre="Nouvelles demandes"
            actions={
              <Link href="/espace/demandes" className="text-sm text-or hover:underline">
                Tout voir
              </Link>
            }
          >
            {!demandes?.length ? (
              <Vide>Aucune nouvelle demande.</Vide>
            ) : (
              <ul className="space-y-3">
                {demandes.slice(0, 4).map((d) => (
                  <li key={d.id} className="rounded-xl bg-creme p-3">
                    <p className="font-medium">
                      {d.nom}
                      {d.type_projet && <span className="font-normal text-gris"> · {d.type_projet}</span>}
                    </p>
                    <p className="text-xs text-gris">{formatDateHeure(d.created_at)}</p>
                    {d.message && <p className="mt-1 line-clamp-2 text-sm">{d.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}
