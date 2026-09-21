import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BadgeChantier, BadgeFacture, EnTete, Section, Vide } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { adresseComplete, formatDate, formatEuros } from "@/lib/format";
import type { Chantier, Client, Commentaire, Facture, Photo } from "@/lib/types";
import { enregistrerRecap } from "../actions";
import { nouvelleFacture } from "../../factures/actions";
import Statut from "./Statut";
import Commentaires from "./Commentaires";
import Photos, { type PhotoAffichee } from "./Photos";

export default async function ChantierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: chantier } = await supabase
    .from("chantiers")
    .select("*, clients(*)")
    .eq("id", id)
    .maybeSingle<Chantier & { clients: Client | null }>();
  if (!chantier) notFound();

  const [{ data: commentaires }, { data: photos }, { data: factures }] = await Promise.all([
    supabase
      .from("chantier_commentaires")
      .select("*")
      .eq("chantier_id", id)
      .order("created_at", { ascending: false })
      .returns<Commentaire[]>(),
    supabase
      .from("chantier_photos")
      .select("*")
      .eq("chantier_id", id)
      .order("created_at", { ascending: true })
      .returns<Photo[]>(),
    supabase
      .from("factures")
      .select("*")
      .eq("chantier_id", id)
      .order("created_at", { ascending: false })
      .returns<Facture[]>(),
  ]);

  // Liens temporaires (1 h) : le bucket est privé.
  let photosAffichees: PhotoAffichee[] = [];
  if (photos?.length) {
    const { data: urls } = await supabase.storage
      .from("chantiers")
      .createSignedUrls(photos.map((p) => p.storage_path), 3600);
    const parChemin = new Map(urls?.map((u) => [u.path, u.signedUrl]) ?? []);
    photosAffichees = photos.map((p) => ({ ...p, url: parChemin.get(p.storage_path) ?? null }));
  }

  const client = chantier.clients;
  const adresse = adresseComplete(chantier);
  const dansPack = photosAffichees.filter((p) => p.dans_pack);
  const packAvant = dansPack.filter((p) => p.phase === "avant").length;
  const packApres = dansPack.filter((p) => p.phase === "apres").length;
  const packPret = Boolean(chantier.recap_travaux) && packAvant + packApres > 0;

  return (
    <>
      <EnTete
        titre={chantier.titre}
        sousTitre={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <BadgeChantier statut={chantier.statut} />
            {client && (
              <Link href={`/espace/clients/${client.id}`} className="hover:text-encre hover:underline">
                {client.nom}
              </Link>
            )}
            {adresse && (
              <a
                href={`https://maps.apple.com/?q=${encodeURIComponent(adresse)}`}
                className="hover:text-encre hover:underline"
              >
                {adresse}
              </a>
            )}
          </span>
        }
        retour={{ href: "/espace/chantiers", label: "Chantiers" }}
        actions={
          <Link href={`/espace/chantiers/${id}/modifier`} className="bouton-secondaire">
            Modifier
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-5">
          <Section titre="Avancement">
            <Statut id={id} statut={chantier.statut} />
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gris">
              {chantier.date_debut && <span>Début : {formatDate(chantier.date_debut)}</span>}
              {chantier.date_fin && <span>Fin : {formatDate(chantier.date_fin)}</span>}
              {client?.telephone && (
                <a href={`tel:${client.telephone}`} className="text-foret underline">
                  Appeler {client.telephone}
                </a>
              )}
            </div>
            {chantier.description && (
              <p className="mt-4 whitespace-pre-line rounded-xl bg-creme p-4 text-sm leading-relaxed">
                {chantier.description}
              </p>
            )}
          </Section>

          <Section titre={`Photos (${photosAffichees.length})`}>
            <Photos chantierId={id} photos={photosAffichees} />
          </Section>

          <Section titre="Journal du chantier">
            <Commentaires chantierId={id} commentaires={commentaires ?? []} />
          </Section>
        </div>

        <div className="space-y-5">
          <Section titre="Pack de fin de chantier">
            <ul className="space-y-1.5 text-sm">
              <li className={chantier.recap_travaux ? "text-foret" : "text-gris"}>
                {chantier.recap_travaux ? "✓" : "○"} Récapitulatif des travaux
              </li>
              <li className={packAvant ? "text-foret" : "text-gris"}>
                {packAvant ? "✓" : "○"} {packAvant} photo(s) avant
              </li>
              <li className={packApres ? "text-foret" : "text-gris"}>
                {packApres ? "✓" : "○"} {packApres} photo(s) après
              </li>
            </ul>
            {packPret ? (
              <a href={`/api/chantiers/${id}/pack`} target="_blank" className="bouton mt-4 w-full">
                Générer le pack (PDF)
              </a>
            ) : (
              <p className="mt-4 text-sm text-gris">
                Remplissez le récapitulatif et cochez des photos « Dans le pack client » pour générer le pack.
              </p>
            )}
          </Section>

          <Section titre="Récapitulatif des travaux">
            <Formulaire action={enregistrerRecap.bind(null, id)}>
              <p className="mb-2 text-xs text-gris">Ce texte apparaît dans le pack remis au client.</p>
              <textarea
                name="recap_travaux"
                rows={9}
                defaultValue={chantier.recap_travaux ?? ""}
                placeholder={"Dépose de l'ancienne baignoire\nCréation d'une douche à l'italienne\nPose de faïence grand format…"}
                className="champ text-sm"
              />
              <div className="mt-2 flex justify-end">
                <BoutonEnvoi>Enregistrer</BoutonEnvoi>
              </div>
            </Formulaire>
          </Section>

          <Section
            titre="Factures"
            actions={
              client ? (
                <div className="flex gap-3">
                  <Link href={`/espace/factures/acompte?chantier=${id}`} className="text-sm text-or hover:underline">
                    + Acompte
                  </Link>
                  <form action={nouvelleFacture.bind(null, client.id, id)}>
                    <button className="text-sm text-or hover:underline">+ Facture</button>
                  </form>
                </div>
              ) : null
            }
          >
            {!client ? (
              <p className="text-sm text-gris">Associez un client au chantier pour le facturer.</p>
            ) : !factures?.length ? (
              <Vide>Aucune facture.</Vide>
            ) : (
              <ul className="space-y-1">
                {factures.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/espace/factures/${f.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-creme"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm">
                          {f.type === "avoir" ? "Avoir " : f.type === "acompte" ? "Acompte " : ""}
                          {f.numero ?? "Brouillon"}
                        </span>
                        <span className="block text-xs text-gris">{formatEuros(f.total_ttc)} TTC</span>
                      </span>
                      <BadgeFacture statut={f.statut} />
                    </Link>
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
