"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { aujourdhui, champ, champNombre, messageErreur } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

const TAUX = [0, 5.5, 10, 20];

function rafraichir(id?: string) {
  revalidatePath("/espace", "layout");
  if (id) revalidatePath(`/espace/factures/${id}`);
}

export async function nouvelleFacture(clientId: string, chantierId: string | null) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("factures")
    .insert({ client_id: clientId, chantier_id: chantierId })
    .select("id")
    .single();
  if (error) throw new Error(messageErreur(error, "La facture n'a pas pu être créée."));
  rafraichir();
  redirect(`/espace/factures/${data.id}`);
}

export async function creerDepuisFormulaire(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const clientId = champ(fd, "client_id");
  if (!clientId) return { erreur: "Choisissez un client." };
  await nouvelleFacture(clientId, champ(fd, "chantier_id"));
}

export async function modifierEnTete(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("factures")
    .update({
      objet: champ(fd, "objet"),
      periode_travaux: champ(fd, "periode_travaux"),
      mention_tva: champ(fd, "mention_tva"),
      date_echeance: champ(fd, "date_echeance"),
      chantier_id: champ(fd, "chantier_id"),
    })
    .eq("id", id)
    .eq("statut", "brouillon");
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

export async function ajouterLigne(factureId: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const lu = lireLigne(fd);
  if (!lu.ligne) return { erreur: lu.erreur };

  const { data: derniere } = await supabase
    .from("facture_lignes")
    .select("position")
    .eq("facture_id", factureId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("facture_lignes")
    .insert({ ...lu.ligne, facture_id: factureId, position: (derniere?.position ?? 0) + 1 });
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été ajoutée.") };
  rafraichir(factureId);
  return { ok: "Ligne ajoutée." };
}

export async function modifierLigne(
  factureId: string,
  ligneId: string,
  _: EtatAction,
  fd: FormData,
): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const lu = lireLigne(fd);
  if (!lu.ligne) return { erreur: lu.erreur };
  const { error } = await supabase.from("facture_lignes").update(lu.ligne).eq("id", ligneId);
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été modifiée.") };
  rafraichir(factureId);
  return { ok: "Ligne modifiée." };
}

export async function supprimerLigne(factureId: string, ligneId: string): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("facture_lignes").delete().eq("id", ligneId);
  if (error) return { erreur: messageErreur(error, "La ligne n'a pas été supprimée.") };
  rafraichir(factureId);
  return { ok: "Ligne supprimée." };
}

export async function emettre(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("emettre_facture", { p_facture_id: id });
  if (error) return { erreur: messageErreur(error, "La facture n'a pas pu être émise.") };
  rafraichir(id);
  return { ok: "Facture émise." };
}

export async function marquerPayee(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const date = champ(fd, "date_paiement") ?? aujourdhui();
  const { error } = await supabase
    .from("factures")
    .update({ statut: "payee", date_paiement: date, mode_paiement: champ(fd, "mode_paiement") })
    .eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le paiement n'a pas été enregistré.") };
  rafraichir(id);
  return { ok: "Paiement enregistré." };
}

export async function annulerPaiement(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("factures")
    .update({ statut: "emise", date_paiement: null, mode_paiement: null })
    .eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le paiement n'a pas été annulé.") };
  rafraichir(id);
  return { ok: "Paiement annulé." };
}

export async function enregistrerNotes(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("factures").update({ notes_internes: champ(fd, "notes_internes") }).eq("id", id);
  if (error) return { erreur: messageErreur(error, "Les notes n'ont pas été enregistrées.") };
  rafraichir(id);
  return { ok: "Notes enregistrées." };
}

export async function faireAvoir(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc("creer_avoir", { p_facture_id: id });
  if (error) return { erreur: messageErreur(error, "L'avoir n'a pas pu être créé.") };
  rafraichir();
  redirect(`/espace/factures/${data}`);
}

export async function supprimerBrouillon(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("factures").delete().eq("id", id).eq("statut", "brouillon");
  if (error) return { erreur: messageErreur(error, "Le brouillon n'a pas été supprimé.") };
  rafraichir();
  redirect("/espace/factures");
}
