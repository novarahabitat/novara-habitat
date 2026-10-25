"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { aujourdhui, champ, champNombre, messageErreur } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

const TAUX = [0, 5.5, 10, 20];

function rafraichir(id?: string) {
  revalidatePath("/espace", "layout");
  if (id) revalidatePath(`/espace/devis/${id}`);
}

export async function nouveauDevis(clientId: string, chantierId: string | null) {
  const { supabase } = await requireAdmin();
  let objet: string | null = null;
  if (chantierId) {
    const { data: ch } = await supabase.from("chantiers").select("titre").eq("id", chantierId).maybeSingle();
    objet = ch?.titre ?? null;
  }
  const { data, error } = await supabase
    .from("devis")
    .insert({ client_id: clientId, chantier_id: chantierId, objet })
    .select("id")
    .single();
  if (error) throw new Error(messageErreur(error, "Le devis n'a pas pu être créé."));
  rafraichir();
  redirect(`/espace/devis/${data.id}`);
}

export async function creerDepuisFormulaire(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const clientId = champ(fd, "client_id");
  if (!clientId) return { erreur: "Choisissez un client." };
  await nouveauDevis(clientId, champ(fd, "chantier_id"));
}

export async function modifierEnTete(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const nature = champ(fd, "nature_operation") ?? "";
  const { error } = await supabase
    .from("devis")
    .update({
      objet: champ(fd, "objet"),
      periode_travaux: champ(fd, "periode_travaux"),
      lieu_travaux: champ(fd, "lieu_travaux"),
      nature_operation: ["prestation_services", "livraison_biens", "mixte"].includes(nature)
        ? nature
        : "prestation_services",
      mention_tva: champ(fd, "mention_tva"),
      conditions: champ(fd, "conditions"),
      date_validite: champ(fd, "date_validite"),
      chantier_id: champ(fd, "chantier_id"),
    })
    .eq("id", id)
    .in("statut", ["brouillon", "envoye"]);
  if (error) return { erreur: messageErreur(error, "Les informations n'ont pas été enregistrées.") };
  rafraichir(id);
  return { ok: "Enregistré." };
}

function lireLigne(fd: FormData) {
  const quantite = champNombre(fd, "quantite");
  const prix = champNombre(fd, "prix_unitaire_ht");
  const taux = champNombre(fd, "taux_tva");
  const designation = champ(fd, "designation");

  if (!designation) return { erreur: "Décrivez la prestation." };
  if (quantite === null || Number.isNaN(quantite) || quantite === 0) return { erreur: "Quantité invalide." };
  if (prix === null || Number.isNaN(prix)) return { erreur: "Prix unitaire invalide." };
  if (taux === null || !TAUX.includes(taux)) return { erreur: "Taux de TVA invalide." };

  return {
    ligne: {
      designation,
      quantite,
      unite: champ(fd, "unite"),
      prix_unitaire_ht: Math.round(prix * 100) / 100,
      taux_tva: taux,
    },
  };
}

export async function ajouterLigne(devisId: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const lu = lireLigne(fd);
  if (!lu.ligne) return { erreur: lu.erreur };

  const { data: derniere } = await supabase
    .from("devis_lignes")
    .select("position")
    .eq("devis_id", devisId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("devis_lignes")
    .insert({ ...lu.ligne, devis_id: devisId, position: (derniere?.position ?? 0) + 1 });
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été ajoutée.") };
  rafraichir(devisId);
  return { ok: "Ligne ajoutée." };
}

export async function modifierLigne(
  devisId: string,
  ligneId: string,
  _: EtatAction,
  fd: FormData,
): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const lu = lireLigne(fd);
  if (!lu.ligne) return { erreur: lu.erreur };
  const { error } = await supabase.from("devis_lignes").update(lu.ligne).eq("id", ligneId);
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été modifiée.") };
  rafraichir(devisId);
  return { ok: "Ligne modifiée." };
}

export async function supprimerLigne(devisId: string, ligneId: string): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("devis_lignes").delete().eq("id", ligneId);
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été supprimée.") };
  rafraichir(devisId);
  return { ok: "Ligne supprimée." };
}

/** Numérote le devis (première fois) et fige la date : prêt à être envoyé au client. */
export async function envoyer(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("envoyer_devis", { p_devis_id: id });
  if (error) return { erreur: messageErreur(error, "Le devis n'a pas pu être finalisé.") };
  rafraichir(id);
  return { ok: "Devis prêt : téléchargez le PDF et envoyez-le au client." };
}

export async function repondre(id: string, accepte: boolean, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("repondre_devis", {
    p_devis_id: id,
    p_accepte: accepte,
    p_date: champ(fd, "date_reponse") ?? aujourdhui(),
  });
  if (error) return { erreur: messageErreur(error, "La réponse n'a pas été enregistrée.") };
  rafraichir(id);
  return { ok: accepte ? "Devis accepté." : "Devis refusé." };
}

export async function rouvrir(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("rouvrir_devis", { p_devis_id: id });
  if (error) return { erreur: messageErreur(error, "Le devis n'a pas été rouvert.") };
  rafraichir(id);
  return { ok: "Devis rouvert : il est de nouveau modifiable." };
}

/**
 * Acompte sur le devis : crée la facture d'acompte. Si l'argent est déjà
 * reçu, elle est émise et marquée payée dans la foulée (le PDF sert de reçu).
 */
export async function ajouterAcompte(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const mode = champ(fd, "mode");
  const valeur = champNombre(fd, "valeur");
  if (valeur === null || Number.isNaN(valeur) || valeur <= 0) return { erreur: "Indiquez le montant ou le pourcentage." };
  if (mode === "pourcentage" && valeur > 100) return { erreur: "Le pourcentage doit être entre 1 et 100." };

  const { data: factureId, error } = await supabase.rpc("creer_acompte_devis", {
    p_devis_id: id,
    p_pourcentage: mode === "pourcentage" ? valeur : null,
    p_montant_ttc: mode === "pourcentage" ? null : Math.round(valeur * 100) / 100,
  });
  if (error) return { erreur: messageErreur(error, "L'acompte n'a pas pu être créé.") };

  if (fd.get("deja_recu") === "on") {
    const { error: erreurEmission } = await supabase.rpc("emettre_facture", { p_facture_id: factureId });
    if (erreurEmission) {
      rafraichir(id);
      return {
        erreur: `La facture d'acompte est créée en brouillon mais n'a pas pu être émise : ${messageErreur(
          erreurEmission,
          "vérifiez-la.",
        )}`,
      };
    }
    const { error: erreurPaiement } = await supabase
      .from("factures")
      .update({
        statut: "payee",
        date_paiement: champ(fd, "date_paiement") ?? aujourdhui(),
        mode_paiement: champ(fd, "mode_paiement"),
      })
      .eq("id", factureId);
    if (erreurPaiement) {
      rafraichir(id);
      return { erreur: messageErreur(erreurPaiement, "L'acompte est émis mais le paiement n'a pas été enregistré.") };
    }
    rafraichir(id);
    return { ok: "Acompte enregistré comme payé. Le reçu est disponible dans la liste." };
  }

  rafraichir(id);
  redirect(`/espace/factures/${factureId}`);
}

export async function transformerEnFacture(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc("transformer_devis", { p_devis_id: id });
  if (error) return { erreur: messageErreur(error, "La facture n'a pas pu être créée.") };
  rafraichir(id);
  redirect(`/espace/factures/${data}`);
}

export async function enregistrerNotes(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("devis").update({ notes_internes: champ(fd, "notes_internes") }).eq("id", id);
  if (error) return { erreur: messageErreur(error, "Les notes n'ont pas été enregistrées.") };
  rafraichir(id);
  return { ok: "Notes enregistrées." };
}

export async function supprimer(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("devis").delete().eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le devis n'a pas été supprimé.") };
  rafraichir();
  redirect("/espace/devis");
}

/** Copie d'un devis (refusé, ou modèle) en nouveau brouillon. */
export async function dupliquer(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { data: d } = await supabase
    .from("devis")
    .select("client_id, chantier_id, objet, periode_travaux, lieu_travaux, nature_operation, mention_tva, conditions")
    .eq("id", id)
    .maybeSingle();
  if (!d) return { erreur: "Devis introuvable." };
  const { data: copie, error } = await supabase.from("devis").insert(d).select("id").single();
  if (error) return { erreur: messageErreur(error, "La copie n'a pas pu être créée.") };
  const { data: lignes } = await supabase
    .from("devis_lignes")
    .select("position, designation, quantite, unite, prix_unitaire_ht, taux_tva")
    .eq("devis_id", id);
  if (lignes?.length) {
    const { error: erreurLignes } = await supabase
      .from("devis_lignes")
      .insert(lignes.map((l) => ({ ...l, devis_id: copie.id })));
    if (erreurLignes) return { erreur: messageErreur(erreurLignes, "Les lignes n'ont pas été copiées.") };
  }
  rafraichir();
  redirect(`/espace/devis/${copie.id}`);
}
