"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { messageErreur } from "@/lib/format";
import type { DemandeContact, EtatAction } from "@/lib/types";

export async function marquerTraitee(id: string, traitee: boolean): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("demandes_contact").update({ traitee }).eq("id", id);
  if (error) return { erreur: messageErreur(error, "La demande n'a pas été mise à jour.") };
  revalidatePath("/espace", "layout");
  return { ok: "Demande mise à jour." };
}

/** Crée un client à partir de la demande, puis ouvre sa fiche. */
export async function convertirEnClient(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { data: d } = await supabase.from("demandes_contact").select("*").eq("id", id).maybeSingle<DemandeContact>();
  if (!d) return { erreur: "Demande introuvable." };

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      nom: d.nom,
      telephone: d.telephone,
      email: d.email,
      notes: [d.type_projet, d.message].filter(Boolean).join("\n\n") || null,
    })
    .select("id")
    .single();
  if (error) return { erreur: messageErreur(error, "Le client n'a pas pu être créé.") };

  await supabase.from("demandes_contact").update({ traitee: true }).eq("id", id);
  revalidatePath("/espace", "layout");
  redirect(`/espace/clients/${client.id}`);
}

export async function supprimerDemande(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("demandes_contact").delete().eq("id", id);
  if (error) return { erreur: messageErreur(error, "La demande n'a pas été supprimée.") };
  revalidatePath("/espace", "layout");
  return { ok: "Demande supprimée." };
}
