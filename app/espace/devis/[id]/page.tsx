import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BadgeDevis, BadgeFacture, EnTete, Section } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { adresseComplete, aujourdhui, formatDate, formatEuros, libelleNature, libelleTypeFacture } from "@/lib/format";
import type { Client, Devis, Entreprise, Facture, LigneDevis } from "@/lib/types";
import { MENTION_FRANCHISE, mentionsTva } from "@/lib/facture";
import {
  ajouterAcompte,
  dupliquer,
  enregistrerNotes,
  envoyer,
  modifierEnTete,
  repondre,
  rouvrir,
  supprimer,
  transformerEnFacture,
} from "../actions";
import Lignes from "./Lignes";

const MENTIONS = [
  "TVA au taux réduit de 10 % (art. 279-0 bis du CGI) : travaux dans un logement achevé depuis plus de deux ans, attestation du client à fournir.",
  "TVA au taux réduit de 5,5 % (art. 278-0 bis A du CGI) : travaux d'amélioration de la performance énergétique, attestation du client à fournir.",
  "Autoliquidation : TVA due par le preneur (art. 283-2 nonies du CGI).",
];

const CONDITIONS = [
  "Acompte de 30 % à la signature, solde à la fin des travaux.",
  "Acompte de 30 % à la commande, 40 % à mi-chantier, solde à la réception des travaux.",
  "Paiement à la fin des travaux, à réception de la facture.",
];

export default async function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireAdmin();

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(*), chantiers(id, titre)")
    .eq("id", id)
    .maybeSingle<Devis & { clients: Client; chantiers: { id: string; titre: string } | null }>();
  if (!devis) notFound();

  const [{ data: lignes }, { data: entreprise }, { data: chantiers }, { data: factures }] = await Promise.all([
    supabase.from("devis_lignes").select("*").eq("devis_id", id).order("position").returns<LigneDevis[]>(),
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
    supabase.from("chantiers").select("id, titre").eq("client_id", devis.client_id).order("created_at", { ascending: false }),
    supabase
      .from("factures")
      .select("*")
      .eq("devis_id", id)
      .order("created_at", { ascending: true })
      .returns<Facture[]>(),
  ]);

  const modifiable = devis.statut === "brouillon" || devis.statut === "envoye";
  const brouillon = devis.statut === "brouillon";
  // Envoyé : les réglages figés à l'envoi ; brouillon : les réglages actuels.
  const reglages: Partial<Entreprise> = (brouillon ? entreprise : (devis.emetteur ?? entreprise)) ?? {};
  const franchise = Boolean(reglages.franchise_tva);
  const client = brouillon ? devis.clients : { ...devis.clients, ...devis.destinataire };
  const jour = aujourdhui();
  const expire = devis.statut === "envoye" && Boolean(devis.date_validite && devis.date_validite < jour);

  // Suivi des acomptes : un acompte annulé par un avoir émis ne compte plus.
  const liste = factures ?? [];
  const annules = new Set(
    liste.filter((f) => f.type === "avoir" && f.statut !== "brouillon").map((f) => f.facture_origine_id),
  );
  const acomptes = liste.filter((f) => f.type === "acompte");
  const acomptesActifs = acomptes.filter((a) => a.statut !== "brouillon" && !annules.has(a.id));
  const totalDemande = acomptesActifs.reduce((s, a) => s + Number(a.total_ttc), 0);
  const totalEncaisse = acomptesActifs.filter((a) => a.statut === "payee").reduce((s, a) => s + Number(a.total_ttc), 0);
  const resteDevis = Number(devis.total_ttc) - totalEncaisse;
  const factureFinale = liste.find((f) => f.id === devis.facture_id) ?? null;
  const peutAcompte = (devis.statut === "envoye" || devis.statut === "accepte") && !devis.facture_id;

  const parTaux = new Map<number, number>();
  for (const l of lignes ?? []) {
    const ht = Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100;
    parTaux.set(Number(l.taux_tva), (parTaux.get(Number(l.taux_tva)) ?? 0) + ht);
  }

  const manquant = [
    !entreprise?.raison_sociale && "raison sociale",
    !entreprise?.adresse && "adresse",
    !entreprise?.siret && "SIRET",
    !entreprise?.assureur_decennale && "assurance décennale",
  ].filter(Boolean);

  return (
    <>
      <EnTete
        titre={brouillon ? "Devis — brouillon" : `Devis ${devis.numero}`}
        sousTitre={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <BadgeDevis statut={devis.statut} expire={expire} facture={Boolean(devis.facture_id)} />
            <Link href={`/espace/clients/${devis.client_id}`} className="hover:underline">
              {client.nom}
            </Link>
            {devis.chantiers && (
              <Link href={`/espace/chantiers/${devis.chantiers.id}`} className="hover:underline">
                {devis.chantiers.titre}
              </Link>
            )}
            {devis.date_emission && <span>Du {formatDate(devis.date_emission)}</span>}
            {devis.date_validite && devis.statut === "envoye" && <span>Valable jusqu&apos;au {formatDate(devis.date_validite)}</span>}
            {devis.date_reponse && devis.statut !== "envoye" && (
              <span>
                {devis.statut === "accepte" ? "Accepté" : "Refusé"} le {formatDate(devis.date_reponse)}
              </span>
            )}
          </span>
        }
        retour={{ href: "/espace/devis", label: "Devis" }}
        actions={
          <a href={`/api/devis/${id}/pdf`} target="_blank" className="bouton-secondaire">
            {brouillon ? "Aperçu PDF" : "Télécharger le PDF"}
          </a>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          {modifiable ? (
            <Section titre="Informations">
              <Formulaire action={modifierEnTete.bind(null, id)} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="etiquette" htmlFor="objet">
                    Objet
                  </label>
                  <input
                    id="objet"
                    name="objet"
                    defaultValue={devis.objet ?? ""}
                    placeholder="Ex. Rénovation de la salle de bain"
                    className="champ"
                  />
                </div>
                <div>
                  <label className="etiquette" htmlFor="periode_travaux">
                    Date de début et durée des travaux
                  </label>
                  <input
                    id="periode_travaux"
                    name="periode_travaux"
                    defaultValue={devis.periode_travaux ?? ""}
                    placeholder="Ex. début le 02/11/2026, 3 semaines"
                    className="champ"
                  />
                </div>
                <div>
                  <label className="etiquette" htmlFor="date_validite">
                    Valable jusqu&apos;au
                  </label>
                  <input
                    id="date_validite"
                    name="date_validite"
                    type="date"
                    defaultValue={devis.date_validite ?? ""}
                    className="champ"
                  />
                  <p className="mt-1 text-xs text-gris">
                    Vide : {entreprise?.validite_devis_jours ?? 30} jours après l&apos;envoi.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="etiquette" htmlFor="chantier_id">
                    Chantier
                  </label>
                  <select id="chantier_id" name="chantier_id" defaultValue={devis.chantier_id ?? ""} className="champ">
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
                    defaultValue={devis.nature_operation}
                    className="champ"
                  >
                    {Object.entries(libelleNature).map(([valeur, libelle]) => (
                      <option key={valeur} value={valeur}>
                        {libelle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="etiquette" htmlFor="lieu_travaux">
                    Lieu des travaux
                  </label>
                  <input id="lieu_travaux" name="lieu_travaux" defaultValue={devis.lieu_travaux ?? ""} className="champ" />
                  <p className="mt-1 text-xs text-gris">Si différent de l&apos;adresse du client.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="etiquette" htmlFor="conditions">
                    Conditions de paiement du devis
                  </label>
                  <textarea
                    id="conditions"
                    name="conditions"
                    rows={2}
                    defaultValue={devis.conditions ?? ""}
                    placeholder="Ex. Acompte de 30 % à la signature, solde à la fin des travaux."
                    className="champ text-sm"
                  />
                  <details className="mt-1 text-xs text-gris">
                    <summary className="cursor-pointer">Exemples (à copier)</summary>
                    <ul className="mt-2 space-y-1.5">
                      {CONDITIONS.map((m) => (
                        <li key={m} className="rounded-lg bg-creme p-2 select-all">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                {franchise ? (
                  <div className="rounded-xl bg-creme p-3 text-sm sm:col-span-2">
                    Franchise en base de TVA : la mention <strong>« {MENTION_FRANCHISE} »</strong> est ajoutée
                    automatiquement sur le devis.
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
                      defaultValue={devis.mention_tva ?? ""}
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
                  </div>
                )}
                <div className="sm:col-span-2">
                  <BoutonEnvoi>Enregistrer</BoutonEnvoi>
                </div>
              </Formulaire>
            </Section>
          ) : (
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
                {devis.objet && (
                  <div>
                    <dt className="text-gris">Objet</dt>
                    <dd>{devis.objet}</dd>
                  </div>
                )}
                {devis.periode_travaux && (
                  <div>
                    <dt className="text-gris">Travaux</dt>
                    <dd>{devis.periode_travaux}</dd>
                  </div>
                )}
                {devis.lieu_travaux && (
                  <div>
                    <dt className="text-gris">Lieu des travaux</dt>
                    <dd>{devis.lieu_travaux}</dd>
                  </div>
                )}
                {devis.conditions && (
                  <div className="sm:col-span-2">
                    <dt className="text-gris">Conditions de paiement</dt>
                    <dd>{devis.conditions}</dd>
                  </div>
                )}
                {mentionsTva(devis, reglages).length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-gris">Mention TVA</dt>
                    <dd>{mentionsTva(devis, reglages).join(" ")}</dd>
                  </div>
                )}
              </dl>
            </Section>
          )}

          <Section titre="Prestations">
            <Lignes devisId={id} lignes={lignes ?? []} modifiable={modifiable} franchiseTva={franchise} />

            <dl className="ml-auto mt-5 w-full max-w-xs space-y-1.5 border-t border-black/10 pt-4 text-sm">
              {!franchise && (
                <div className="flex justify-between">
                  <dt className="text-gris">Total HT</dt>
                  <dd className="tabular-nums">{formatEuros(devis.total_ht)}</dd>
                </div>
              )}
              {!franchise &&
                [...parTaux.entries()]
                  .sort((a, b) => b[0] - a[0])
                  .map(([taux, ht]) => (
                    <div key={taux} className="flex justify-between">
                      <dt className="text-gris">TVA {String(taux).replace(".", ",")} %</dt>
                      <dd className="tabular-nums">{formatEuros(Math.round(ht * taux) / 100)}</dd>
                    </div>
                  ))}
              <div className="flex justify-between border-t border-black/10 pt-2 text-base font-medium">
                <dt>{franchise ? "Total" : "Total TTC"}</dt>
                <dd className="tabular-nums">{formatEuros(devis.total_ttc)}</dd>
              </div>
            </dl>
            {devis.statut === "envoye" && (
              <p className="mt-3 text-xs text-gris">
                Devis déjà envoyé : après une modification, cliquez « Mettre à jour le devis » puis renvoyez le PDF au
                client.
              </p>
            )}
          </Section>

          {!brouillon && devis.statut !== "refuse" && (
            <Section titre="Acomptes et paiements">
              {acomptes.length === 0 && !factureFinale ? (
                <p className="text-sm text-gris">Aucun acompte pour l&apos;instant.</p>
              ) : (
                <ul className="divide-y divide-black/[0.06]">
                  {liste.map((f) => (
                    <li key={f.id}>
                      <Link
                        href={`/espace/factures/${f.id}`}
                        className="flex items-center justify-between gap-3 py-2.5 hover:bg-creme/60"
                      >
                        <span className="min-w-0">
                          <span className={`block truncate text-sm ${annules.has(f.id) ? "text-gris line-through" : ""}`}>
                            {f.type === "facture" ? "Facture finale" : libelleTypeFacture[f.type]} {f.numero ?? "(brouillon)"}
                          </span>
                          <span className="block text-xs text-gris">
                            {f.statut === "payee"
                              ? `Payé le ${formatDate(f.date_paiement)}${f.mode_paiement ? ` · ${f.mode_paiement}` : ""}`
                              : f.date_emission
                                ? `Émise le ${formatDate(f.date_emission)}`
                                : "À émettre"}
                            {annules.has(f.id) && " · annulé par avoir"}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="text-sm tabular-nums">{formatEuros(f.total_ttc)}</span>
                          <BadgeFacture statut={f.statut} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <dl className="ml-auto mt-4 w-full max-w-xs space-y-1.5 border-t border-black/10 pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gris">Total du devis</dt>
                  <dd className="tabular-nums">{formatEuros(devis.total_ttc)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris">Acomptes demandés</dt>
                  <dd className="tabular-nums">{formatEuros(totalDemande)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris">Acomptes encaissés</dt>
                  <dd className="tabular-nums text-foret">{formatEuros(totalEncaisse)}</dd>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-medium">
                  <dt>Reste à encaisser</dt>
                  <dd className="tabular-nums">{formatEuros(resteDevis)}</dd>
                </div>
              </dl>

              {peutAcompte && (
                <Formulaire action={ajouterAcompte.bind(null, id)} viderApresSucces className="mt-5 rounded-xl bg-creme p-3 sm:p-4">
                  <p className="mb-3 text-sm font-medium">Ajouter un acompte</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label>
                      <span className="mb-1 block text-xs text-gris">Calcul</span>
                      <select name="mode" defaultValue="pourcentage" className="champ px-3 text-sm">
                        <option value="pourcentage">Pourcentage du devis</option>
                        <option value="montant">Montant précis ({franchise ? "€" : "€ TTC"})</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-1 block text-xs text-gris">Valeur</span>
                      <input name="valeur" inputMode="decimal" required defaultValue="30" className="champ px-3 text-sm" />
                    </label>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <input type="checkbox" name="deja_recu" className="h-4 w-4" />
                    Argent déjà reçu (émettre la facture d&apos;acompte et la marquer payée)
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label>
                      <span className="mb-1 block text-xs text-gris">Date du paiement</span>
                      <input name="date_paiement" type="date" defaultValue={jour} className="champ px-3 text-sm" />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs text-gris">Mode</span>
                      <select name="mode_paiement" defaultValue="Virement" className="champ px-3 text-sm">
                        <option>Virement</option>
                        <option>Chèque</option>
                        <option>Espèces</option>
                        <option>Carte bancaire</option>
                      </select>
                    </label>
                  </div>
                  <p className="mt-3 text-xs text-gris">
                    Sans « déjà reçu », un brouillon de facture d&apos;acompte s&apos;ouvre : vérifiez-le, émettez-le et
                    envoyez-le au client. Chaque acompte sera déduit de la facture finale.
                  </p>
                  <div className="mt-3">
                    <BoutonEnvoi enCours="Création…">Ajouter l&apos;acompte</BoutonEnvoi>
                  </div>
                </Formulaire>
              )}
            </Section>
          )}
        </div>

        <div className="space-y-5">
          {brouillon && (
            <Section titre="Finaliser">
              {manquant.length > 0 ? (
                <p className="text-sm text-gris">
                  Avant de finaliser, complétez dans{" "}
                  <Link href="/espace/parametres" className="text-or underline">
                    Réglages
                  </Link>{" "}
                  : {manquant.join(", ")}.
                </p>
              ) : (
                <p className="text-sm text-gris">
                  Le devis reçoit son numéro et sa date. Il reste modifiable jusqu&apos;à la réponse du client.
                </p>
              )}
              <Formulaire action={envoyer.bind(null, id)} className="mt-4">
                <BoutonEnvoi enCours="Finalisation…" className="w-full">
                  Finaliser le devis
                </BoutonEnvoi>
              </Formulaire>
            </Section>
          )}

          {devis.statut === "envoye" && (
            <Section titre="Réponse du client">
              <Formulaire action={repondre.bind(null, id, true)} className="space-y-3">
                <div>
                  <label className="etiquette" htmlFor="date_reponse">
                    Date de signature
                  </label>
                  <input id="date_reponse" name="date_reponse" type="date" defaultValue={jour} className="champ" />
                </div>
                <BoutonEnvoi className="w-full">Devis accepté</BoutonEnvoi>
              </Formulaire>
              <Formulaire
                action={repondre.bind(null, id, false)}
                confirmation="Marquer ce devis comme refusé ?"
                className="mt-3"
              >
                <BoutonEnvoi variante="secondaire" className="w-full">
                  Devis refusé
                </BoutonEnvoi>
              </Formulaire>
              <Formulaire action={envoyer.bind(null, id)} className="mt-4 border-t border-black/10 pt-4">
                <p className="mb-2 text-xs text-gris">
                  Modifié depuis l&apos;envoi ? Mettez à jour la date du devis (le numéro ne change pas).
                </p>
                <BoutonEnvoi variante="secondaire" enCours="Mise à jour…">
                  Mettre à jour le devis
                </BoutonEnvoi>
              </Formulaire>
            </Section>
          )}

          {(devis.statut === "envoye" || devis.statut === "accepte") && (
            <Section titre="Facturer">
              {factureFinale ? (
                <p className="text-sm">
                  <Link href={`/espace/factures/${factureFinale.id}`} className="text-or underline">
                    {factureFinale.numero ? `Facture ${factureFinale.numero}` : "Facture (brouillon)"}
                  </Link>{" "}
                  créée à partir de ce devis.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gris">
                    Crée un brouillon de facture avec toutes les lignes du devis. Les acomptes encaissés seront déduits
                    à son émission.
                  </p>
                  <Formulaire
                    action={transformerEnFacture.bind(null, id)}
                    confirmation="Créer la facture à partir de ce devis ?"
                    className="mt-3"
                  >
                    <BoutonEnvoi enCours="Création…" className="w-full">
                      Transformer en facture
                    </BoutonEnvoi>
                  </Formulaire>
                </>
              )}
            </Section>
          )}

          <Section titre="Autres actions">
            <div className="space-y-3">
              {(devis.statut === "accepte" || devis.statut === "refuse") && liste.length === 0 && (
                <Formulaire action={rouvrir.bind(null, id)} confirmation="Rouvrir ce devis pour le modifier ?">
                  <BoutonEnvoi variante="secondaire">Rouvrir le devis</BoutonEnvoi>
                </Formulaire>
              )}
              <Formulaire action={dupliquer.bind(null, id)}>
                <BoutonEnvoi variante="secondaire" enCours="Copie…">
                  Dupliquer en nouveau devis
                </BoutonEnvoi>
              </Formulaire>
              {devis.statut !== "accepte" && liste.length === 0 && (
                <Formulaire action={supprimer.bind(null, id)} confirmation="Supprimer définitivement ce devis ?">
                  <BoutonEnvoi variante="danger" enCours="Suppression…">
                    Supprimer le devis
                  </BoutonEnvoi>
                </Formulaire>
              )}
            </div>
          </Section>

          <Section titre="Notes internes">
            <Formulaire action={enregistrerNotes.bind(null, id)}>
              <textarea
                name="notes_internes"
                rows={3}
                defaultValue={devis.notes_internes ?? ""}
                placeholder="Visibles par vous seul, jamais sur le devis."
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
