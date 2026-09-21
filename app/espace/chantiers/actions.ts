"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { champ, messageErreur } from "@/lib/format";
import type { EtatAction, PhasePhoto, StatutChantier } from "@/lib/types";

const STATUTS: StatutChantier[] = ["prevu", "en_cours", "termine", "annule"];
const PHASES: PhasePhoto[] = ["avant", "pendant", "apres"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function lireChantier(fd: FormData) {
  const statut = champ(fd, "statut") as StatutChantier | null;
  return {
    titre: champ(fd, "titre"),
    client_id: champ(fd, "client_id"),
    adresse: champ(fd, "adresse"),
    code_postal: champ(fd, "code_postal"),
    ville: champ(fd, "ville"),
    statut: statut && STATUTS.includes(statut) ? statut : "prevu",
    date_debut: champ(fd, "date_debut"),
    date_fin: champ(fd, "date_fin"),
    description: champ(fd, "description"),
  };
}

function verifierDates(c: { date_debut: string | null; date_fin: string | null }) {
  if (c.date_debut && c.date_fin && c.date_fin < c.date_debut) {
    return "La date de fin est avant la date de début.";
  }
}

export async function creerChantier(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const chantier = lireChantier(fd);
  if (!chantier.titre) return { erreur: "Donnez un nom au chantier." };
  const erreurDates = verifierDates(chantier);
  if (erreurDates) return { erreur: erreurDates };

  // Adresse du chantier vide : on reprend celle du client.
  if (chantier.client_id && !chantier.adresse && !chantier.ville) {
    const { data: client } = await supabase
      .from("clients")
      .select("adresse, code_postal, ville")
      .eq("id", chantier.client_id)
      .maybeSingle();
    if (client) Object.assign(chantier, client);
  }

  const { data, error } = await supabase.from("chantiers").insert(chantier).select("id").single();
  if (error) return { erreur: messageErreur(error, "Le chantier n'a pas pu être créé.") };

  revalidatePath("/espace", "layout");
  redirect(`/espace/chantiers/${data.id}`);
}

export async function modifierChantier(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const chantier = lireChantier(fd);
  if (!chantier.titre) return { erreur: "Donnez un nom au chantier." };
  const erreurDates = verifierDates(chantier);
  if (erreurDates) return { erreur: erreurDates };

  const { error } = await supabase.from("chantiers").update(chantier).eq("id", id);
  if (error) return { erreur: messageErreur(error, "Les modifications n'ont pas été enregistrées.") };

  revalidatePath("/espace", "layout");
  redirect(`/espace/chantiers/${id}`);
}

export async function changerStatut(id: string, statut: StatutChantier): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  if (!STATUTS.includes(statut)) return { erreur: "Statut inconnu." };

  const maj: { statut: StatutChantier; date_debut?: string; date_fin?: string } = { statut };
  const { data: actuel } = await supabase.from("chantiers").select("date_debut, date_fin").eq("id", id).maybeSingle();
  const jour = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());
  if (statut === "en_cours" && actuel && !actuel.date_debut) maj.date_debut = jour;
  if (statut === "termine" && actuel && !actuel.date_fin) maj.date_fin = jour;

  const { error } = await supabase.from("chantiers").update(maj).eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le statut n'a pas été changé.") };
  revalidatePath("/espace", "layout");
  return { ok: "Statut mis à jour." };
}

export async function enregistrerRecap(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("chantiers")
    .update({ recap_travaux: champ(fd, "recap_travaux") })
    .eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le récapitulatif n'a pas été enregistré.") };
  revalidatePath(`/espace/chantiers/${id}`);
  return { ok: "Récapitulatif enregistré." };
}

export async function supprimerChantier(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();

  const { data: photos } = await supabase.from("chantier_photos").select("storage_path").eq("chantier_id", id);
  const { error } = await supabase.from("chantiers").delete().eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le chantier n'a pas pu être supprimé.") };

  if (photos?.length) {
    await supabase.storage.from("chantiers").remove(photos.map((p) => p.storage_path));
  }
  revalidatePath("/espace", "layout");
  redirect("/espace/chantiers");
}

// Commentaires --------------------------------------------------------------

export async function ajouterCommentaire(chantierId: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const contenu = champ(fd, "contenu");
  if (!contenu) return { erreur: "Le commentaire est vide." };

  const { error } = await supabase.from("chantier_commentaires").insert({ chantier_id: chantierId, contenu });
  if (error) return { erreur: messageErreur(error, "Le commentaire n'a pas été ajouté.") };
  revalidatePath(`/espace/chantiers/${chantierId}`);
  return { ok: "Commentaire ajouté." };
}

export async function supprimerCommentaire(chantierId: string, id: string): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("chantier_commentaires").delete().eq("id", id);
  if (error) return { erreur: messageErreur(error, "Le commentaire n'a pas été supprimé.") };
  revalidatePath(`/espace/chantiers/${chantierId}`);
  return { ok: "Commentaire supprimé." };
}

// Photos --------------------------------------------------------------------

/** Enregistre une photo déjà déposée dans le stockage par le navigateur. */
export async function enregistrerPhoto(
  chantierId: string,
  chemin: string,
  phase: PhasePhoto,
): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  if (!UUID.test(chantierId) || !chemin.startsWith(`${chantierId}/`) || chemin.includes("..")) {
    return { erreur: "Chemin de photo invalide." };
  }
  if (!PHASES.includes(phase)) return { erreur: "Phase inconnue." };

  const { error } = await supabase
    .from("chantier_photos")
    .insert({ chantier_id: chantierId, storage_path: chemin, phase, dans_pack: phase !== "pendant" });
  if (error) {
    await supabase.storage.from("chantiers").remove([chemin]);
    return { erreur: messageErreur(error, "La photo n'a pas été enregistrée.") };
  }
  revalidatePath(`/espace/chantiers/${chantierId}`);
  return { ok: "Photo ajoutée." };
}

export async function modifierPhoto(
  chantierId: string,
  id: string,
  maj: { phase?: PhasePhoto; dans_pack?: boolean; legende?: string | null },
): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const propre: typeof maj = {};
  if (maj.phase !== undefined) {
    if (!PHASES.includes(maj.phase)) return { erreur: "Phase inconnue." };
    propre.phase = maj.phase;
  }
  if (maj.dans_pack !== undefined) propre.dans_pack = Boolean(maj.dans_pack);
  if (maj.legende !== undefined) propre.legende = maj.legende?.trim().slice(0, 300) || null;

  const { error } = await supabase.from("chantier_photos").update(propre).eq("id", id);
  if (error) return { erreur: messageErreur(error, "La photo n'a pas été modifiée.") };
  revalidatePath(`/espace/chantiers/${chantierId}`);
  return { ok: "Photo modifiée." };
}

export async function supprimerPhoto(chantierId: string, id: string): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { data: photo } = await supabase.from("chantier_photos").select("storage_path").eq("id", id).maybeSingle();
  if (!photo) return { erreur: "Photo introuvable." };

  const { error } = await supabase.from("chantier_photos").delete().eq("id", id);
  if (error) return { erreur: messageErreur(error, "La photo n'a pas été supprimée.") };
  await supabase.storage.from("chantiers").remove([photo.storage_path]);
  revalidatePath(`/espace/chantiers/${chantierId}`);
  return { ok: "Photo supprimée." };
}
