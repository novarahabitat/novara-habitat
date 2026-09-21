import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BadgeFacture, EnTete, Section } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { adresseComplete, aujourdhui, formatDate, formatEuros, libelleNature, libelleTypeFacture } from "@/lib/format";
import type { Client, Entreprise, Facture, LigneFacture } from "@/lib/types";
import {
  annulerPaiement,
  emettre,
  enregistrerNotes,
  faireAvoir,
  marquerPayee,
  modifierEnTete,
  supprimerBrouillon,
} from "../actions";
import { MENTION_FRANCHISE, mentionsTva } from "@/lib/facture";
import Lignes from "./Lignes";

const MENTIONS = [
  "TVA au taux réduit de 10 % (art. 279-0 bis du CGI) : travaux dans un logement achevé depuis plus de deux ans, attestation du client conservée.",
  "TVA au taux réduit de 5,5 % (art. 278-0 bis A du CGI) : travaux d'amélioration de la performance énergétique, attestation du client conservée.",
  "Autoliquidation : TVA due par le preneur (art. 283-2 nonies du CGI).",
  "TVA non applicable, art. 293 B du CGI.",
];

export default async function FacturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireAdmin();

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(*)")
    .eq("id", id)
    .maybeSingle<Facture & { clients: Client }>();
  if (!facture) notFound();

  const [{ data: lignes }, { data: entreprise }, { data: chantiers }, { data: origine }, { data: acomptesADeduire }] = await Promise.all([
    supabase.from("facture_lignes").select("*").eq("facture_id", id).order("position").returns<LigneFacture[]>(),
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
    supabase
      .from("chantiers")
      .select("id, titre")
      .eq("client_id", facture.client_id)
      .order("created_at", { ascending: false }),
    facture.facture_origine_id
      ? supabase.from("factures").select("id, numero").eq("id", facture.facture_origine_id).maybeSingle()
      : Promise.resolve({ data: null }),
    // Brouillon de facture finale : acomptes qui seront déduits à l'émission.
    facture.statut === "brouillon" && facture.type === "facture" && facture.chantier_id
      ? supabase
          .from("factures")
          .select("id, numero, date_emission, total_ttc")
          .eq("type", "acompte")
          .neq("statut", "brouillon")
          .is("deduit_sur", null)
          .eq("chantier_id", facture.chantier_id)
          .eq("client_id", facture.client_id)
          .order("date_emission")
      : Promise.resolve({ data: null }),
  ]);
  const acomptes = (facture.statut === "brouillon"
    ? (acomptesADeduire ?? []).map((a) => ({ id: a.id, numero: a.numero as string, date: a.date_emission as string, ttc: a.total_ttc }))
    : (facture.acomptes ?? []));
  const totalAcomptes = acomptes.reduce((s, a) => s + Number(a.ttc), 0);

  const brouillon = facture.statut === "brouillon";
  // Émise : les réglages figés à l'émission ; brouillon : les réglages actuels.
  const reglages: Partial<Entreprise> = (brouillon ? entreprise : facture.emetteur) ?? {};
  const franchise = Boolean(reglages.franchise_tva);
  const client = brouillon ? facture.clients : { ...facture.clients, ...facture.destinataire };
  const libelle = libelleTypeFacture[facture.type];
  const enRetard = facture.statut === "emise" && Boolean(facture.date_echeance && facture.date_echeance < aujourdhui());

  // Totaux TVA par taux, pour l'affichage.
  const parTaux = new Map<number, number>();
  for (const l of lignes ?? []) {
    const ht = Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100;
    parTaux.set(Number(l.taux_tva), (parTaux.get(Number(l.taux_tva)) ?? 0) + ht);
  }

  const manquant = [
    !entreprise?.raison_sociale && "raison sociale",
    !entreprise?.adresse && "adresse",
    !entreprise?.siret && "SIRET",
    !entreprise?.franchise_tva && !entreprise?.tva_intracom && "n° de TVA",
    !entreprise?.assureur_decennale && "assurance décennale",
  ].filter(Boolean);
  const clientSansSiret = facture.clients.type === "professionnel" && !facture.clients.siret;

  return (
    <>
      <EnTete
        titre={brouillon ? `${libelle} — brouillon` : `${libelle} ${facture.numero}`}
        sousTitre={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <BadgeFacture statut={facture.statut} enRetard={enRetard} />
            <Link href={`/espace/clients/${facture.client_id}`} className="hover:underline">
              {client.nom}
            </Link>
            {facture.date_emission && <span>Émise le {formatDate(facture.date_emission)}</span>}
            {origine && (
              <Link href={`/espace/factures/${origine.id}`} className="hover:underline">
                Sur la facture {origine.numero}
              </Link>
            )}
          </span>
        }
        retour={{ href: "/espace/factures", label: "Factures" }}
        actions={
          <a href={`/api/factures/${id}/pdf`} target="_blank" className="bouton-secondaire">
            {brouillon ? "Aperçu PDF" : "Télécharger le PDF"}
          </a>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          {brouillon && (
            <Section titre="Informations">
              <Formulaire action={modifierEnTete.bind(null, id)} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="etiquette" htmlFor="objet">
                    Objet
                  </label>
                  <input
                    id="objet"
                    name="objet"
                    defaultValue={facture.objet ?? ""}
                    placeholder="Ex. Rénovation de la salle de bain"
                    className="champ"
                  />
                </div>
                <div>
                  <label className="etiquette" htmlFor="periode_travaux">
                    Date ou période des travaux
                  </label>
                  <input
                    id="periode_travaux"
                    name="periode_travaux"
                    defaultValue={facture.periode_travaux ?? ""}
                    placeholder="Ex. du 02/09 au 18/09/2026"
                    className="champ"
                  />
                  <p className="mt-1 text-xs text-gris">Vide : reprise des dates du chantier.</p>
                </div>
                <div>
                  <label className="etiquette" htmlFor="date_echeance">
                    Échéance
                  </label>
                  <input
                    id="date_echeance"
                    name="date_echeance"
                    type="date"
                    defaultValue={facture.date_echeance ?? ""}
                    className="champ"
                  />
                  <p className="mt-1 text-xs text-gris">
                    Vide : {entreprise?.delai_paiement_jours ?? 30} jours après l&apos;émission.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="etiquette" htmlFor="chantier_id">
                    Chantier
                  </label>
                  <select id="chantier_id" name="chantier_id" defaultValue={facture.chantier_id ?? ""} className="champ">
                    <option value="">— Aucun —</option>
                    {chantiers?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="etiquette" htmlFor="nature_operation">
                    Nature de l&apos;opération
                  </label>
                  <select
                    id="nature_operation"
                    name="nature_operation"
                    defaultValue={facture.nature_operation}
                    className="champ"
                  >
                    {Object.entries(libelleNature).map(([valeur, libelle]) => (
                      <option key={valeur} value={valeur}>
                        {libelle}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gris">Des travaux, même avec fournitures : prestation de services.</p>
                </div>
                <div>
                  <label className="etiquette" htmlFor="lieu_travaux">
                    Lieu des travaux
                  </label>
                  <input
                    id="lieu_travaux"
                    name="lieu_travaux"
                    defaultValue={facture.lieu_travaux ?? ""}
                    className="champ"
                  />
                  <p className="mt-1 text-xs text-gris">Vide : adresse du chantier, si elle diffère de celle du client.</p>
                </div>
                {franchise ? (
                  <div className="rounded-xl bg-creme p-3 text-sm sm:col-span-2">
                    Franchise en base de TVA : aucune TVA n&apos;est facturée et la mention{" "}
                    <strong>« {MENTION_FRANCHISE} »</strong> est ajoutée automatiquement sur la facture.
                  </div>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="etiquette" htmlFor="mention_tva">
                      Mention TVA
                    </label>
                    <textarea
                      id="mention_tva"
                      name="mention_tva"
                      rows={2}
                      defaultValue={facture.mention_tva ?? ""}
                      className="champ text-sm"
                    />
                    <details className="mt-1 text-xs text-gris">
                      <summary className="cursor-pointer">Mentions courantes (à copier)</summary>
                      <ul className="mt-2 space-y-1.5">
                        {MENTIONS.map((m) => (
                          <li key={m} className="rounded-lg bg-creme p-2 select-all">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </details>
                    <p className="mt-1 text-xs text-gris">Obligatoire pour la TVA à 10 %, 5,5 % ou 0 %.</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <BoutonEnvoi>Enregistrer</BoutonEnvoi>
                </div>
              </Formulaire>
            </Section>
          )}

          {!brouillon && (
            <Section titre="Détail">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gris">Client</dt>
                  <dd>
                    {client.nom}
                    {client.societe && <> — {client.societe}</>}
                    <br />
                    {adresseComplete(client)}
                  </dd>
                </div>
                {facture.objet && (
                  <div>
                    <dt className="text-gris">Objet</dt>
                    <dd>{facture.objet}</dd>
                  </div>
                )}
                {facture.periode_travaux && (
                  <div>
                    <dt className="text-gris">Travaux</dt>
                    <dd>{facture.periode_travaux}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gris">Nature</dt>
                  <dd>{libelleNature[facture.nature_operation]}</dd>
                </div>
                {facture.lieu_travaux && (
                  <div>
                    <dt className="text-gris">Lieu des travaux</dt>
                    <dd>{facture.lieu_travaux}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gris">Échéance</dt>
                  <dd>{formatDate(facture.date_echeance)}</dd>
                </div>
                {mentionsTva(facture, reglages).length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-gris">Mention TVA</dt>
                    <dd>{mentionsTva(facture, reglages).join(" ")}</dd>
                  </div>
                )}
              </dl>
            </Section>
          )}

          <Section titre="Prestations">
            <Lignes
              factureId={id}
              lignes={lignes ?? []}
              modifiable={brouillon}
              franchiseTva={franchise}
            />

            <dl className="ml-auto mt-5 w-full max-w-xs space-y-1.5 border-t border-black/10 pt-4 text-sm">
              {!franchise && (
                <div className="flex justify-between">
                  <dt className="text-gris">Total HT</dt>
                  <dd className="tabular-nums">{formatEuros(facture.total_ht)}</dd>
                </div>
              )}
              {!franchise && [...parTaux.entries()]
                .sort((a, b) => b[0] - a[0])
                .map(([taux, ht]) => (
                  <div key={taux} className="flex justify-between">
                    <dt className="text-gris">TVA {String(taux).replace(".", ",")} %</dt>
                    <dd className="tabular-nums">{formatEuros(Math.round(ht * taux) / 100)}</dd>
                  </div>
                ))}
              <div className="flex justify-between border-t border-black/10 pt-2 text-base font-medium">
                <dt>{franchise ? "Total" : "Total TTC"}</dt>
                <dd className="tabular-nums">{formatEuros(facture.total_ttc)}</dd>
              </div>
              {acomptes.map((a) => (
                <div key={a.id} className="flex justify-between text-gris">
                  <dt>
                    <Link href={`/espace/factures/${a.id}`} className="hover:underline">
                      Acompte {a.numero}
                    </Link>
                  </dt>
                  <dd className="tabular-nums">− {formatEuros(a.ttc)}</dd>
                </div>
              ))}
              {acomptes.length > 0 && (
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-medium">
                  <dt>Reste à payer</dt>
                  <dd className="tabular-nums">{formatEuros(Number(facture.total_ttc) - totalAcomptes)}</dd>
                </div>
              )}
              {brouillon && acomptes.length > 0 && (
                <p className="pt-1 text-xs text-gris">Ces acomptes seront déduits à l&apos;émission.</p>
              )}
            </dl>
          </Section>
        </div>

        <div className="space-y-5">
          {brouillon ? (
            <Section titre="Émettre">
              {manquant.length > 0 ? (
                <p className="text-sm text-gris">
                  Avant d&apos;émettre, complétez dans{" "}
                  <Link href="/espace/parametres" className="text-or underline">
                    Réglages
                  </Link>{" "}
                  : {manquant.join(", ")}.
                </p>
              ) : clientSansSiret ? (
                <p className="text-sm text-gris">
                  Client professionnel : ajoutez son SIRET sur{" "}
                  <Link href={`/espace/clients/${facture.client_id}`} className="text-or underline">
                    sa fiche
                  </Link>{" "}
                  (son SIREN doit figurer sur la facture).
                </p>
              ) : (
                <p className="text-sm text-gris">
                  L&apos;émission attribue le numéro définitif. Ensuite la {libelle.toLowerCase()} ne peut plus être
                  modifiée : une erreur se corrige par un avoir.
                </p>
              )}
              <Formulaire
                action={emettre.bind(null, id)}
                confirmation={`Émettre définitivement cette ${libelle.toLowerCase()} de ${formatEuros(facture.total_ttc)}${franchise ? "" : " TTC"} ? Elle ne pourra plus être modifiée.`}
                className="mt-4"
              >
                <BoutonEnvoi enCours="Émission…" className="w-full">
                  Émettre la {libelle.toLowerCase()}
                </BoutonEnvoi>
              </Formulaire>
              <Formulaire
                action={supprimerBrouillon.bind(null, id)}
                confirmation="Supprimer ce brouillon ?"
                className="mt-4 border-t border-black/10 pt-4"
              >
                <BoutonEnvoi variante="danger" enCours="Suppression…">
                  Supprimer le brouillon
                </BoutonEnvoi>
              </Formulaire>
            </Section>
          ) : (
            <>
              <Section titre="Paiement">
                {facture.statut === "payee" ? (
                  <>
                    <p className="text-sm">
                      Payée le {formatDate(facture.date_paiement)}
                      {facture.mode_paiement && ` · ${facture.mode_paiement}`}
                    </p>
                    <Formulaire
                      action={annulerPaiement.bind(null, id)}
                      confirmation="Annuler l'enregistrement du paiement ?"
                      className="mt-3"
                    >
                      <BoutonEnvoi variante="secondaire">Annuler le paiement</BoutonEnvoi>
                    </Formulaire>
                  </>
                ) : (
                  <Formulaire action={marquerPayee.bind(null, id)} className="space-y-3">
                    <div>
                      <label className="etiquette" htmlFor="date_paiement">
                        Date du paiement
                      </label>
                      <input id="date_paiement" name="date_paiement" type="date" defaultValue={aujourdhui()} className="champ" />
                    </div>
                    <div>
                      <label className="etiquette" htmlFor="mode_paiement">
                        Mode
                      </label>
                      <select id="mode_paiement" name="mode_paiement" className="champ" defaultValue="Virement">
                        <option>Virement</option>
                        <option>Chèque</option>
                        <option>Espèces</option>
                        <option>Carte bancaire</option>
                      </select>
                    </div>
                    <BoutonEnvoi className="w-full">Marquer comme payée</BoutonEnvoi>
                  </Formulaire>
                )}
              </Section>

              {facture.type !== "avoir" && (
                <Section titre="Corriger">
                  <p className="text-sm text-gris">
                    Une facture émise ne se modifie pas. Pour l&apos;annuler ou la corriger, faites un avoir, puis une
                    nouvelle facture si besoin.
                  </p>
                  <Formulaire
                    action={faireAvoir.bind(null, id)}
                    confirmation="Créer un avoir (brouillon) qui annule cette facture ?"
                    className="mt-3"
                  >
                    <BoutonEnvoi variante="secondaire" enCours="Création…">
                      Faire un avoir
                    </BoutonEnvoi>
                  </Formulaire>
                </Section>
              )}
            </>
          )}

          <Section titre="Notes internes">
            <Formulaire action={enregistrerNotes.bind(null, id)}>
              <textarea
                name="notes_internes"
                rows={3}
                defaultValue={facture.notes_internes ?? ""}
                placeholder="Visibles par vous seul, jamais sur la facture."
                className="champ text-sm"
              />
              <div className="mt-2">
                <BoutonEnvoi variante="secondaire">Enregistrer</BoutonEnvoi>
              </div>
            </Formulaire>
          </Section>
        </div>
      </div>
    </>
  );
}
