"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { champ, messageErreur } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

function lireClient(fd: FormData) {
  return {
    type: champ(fd, "type") === "professionnel" ? "professionnel" : "particulier",
    nom: champ(fd, "nom"),
    societe: champ(fd, "societe"),
    siret: champ(fd, "siret"),
    tva_intracom: champ(fd, "tva_intracom"),
    email: champ(fd, "email"),
    telephone: champ(fd, "telephone"),
    adresse: champ(fd, "adresse"),
    code_postal: champ(fd, "code_postal"),
    ville: champ(fd, "ville"),
    notes: champ(fd, "notes"),
  };
}

export async function creerClient(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const client = lireClient(fd);
  if (!client.nom) return { erreur: "Le nom du client est obligatoire." };

  const { data, error } = await supabase.from("clients").insert(client).select("id").single();
  if (error) return { erreur: messageErreur(error, "Le client n'a pas pu être créé.") };

  revalidatePath("/espace/clients");
  const retour = champ(fd, "retour");
  redirect(retour === "chantier" ? `/espace/chantiers/nouveau?client=${data.id}` : `/espace/clients/${data.id}`);
}

export async function modifierClient(id: string, _: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const client = lireClient(fd);
  if (!client.nom) return { erreur: "Le nom du client est obligatoire." };

  const { error } = await supabase.from("clients").update(client).eq("id", id);
  if (error) return { erreur: messageErreur(error, "Les modifications n'ont pas été enregistrées.") };

  revalidatePath("/espace/clients");
  revalidatePath(`/espace/clients/${id}`);
  return { ok: "Client enregistré." };
}

export async function supprimerClient(id: string, _: EtatAction): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    return {
      erreur: /foreign key|RESTRICT/i.test(error.message)
        ? "Ce client a des chantiers ou des factures : il ne peut pas être supprimé."
        : messageErreur(error, "Le client n'a pas pu être supprimé."),
    };
  }
  revalidatePath("/espace/clients");
  redirect("/espace/clients");
}
