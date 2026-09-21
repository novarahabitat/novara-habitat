"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { champ, champNombre, messageErreur } from "@/lib/format";
import type { EtatAction } from "@/lib/types";

export async function enregistrerEntreprise(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase, user } = await requireAdmin();

  const siret = champ(fd, "siret")?.replace(/\s/g, "") ?? null;
  if (siret && !/^\d{14}$/.test(siret)) return { erreur: "Le SIRET doit contenir 14 chiffres." };
  const prefixe = (champ(fd, "prefixe_facture") ?? "F").toUpperCase();
  if (!/^[A-Z0-9]{1,6}$/.test(prefixe)) return { erreur: "Préfixe de facture : 1 à 6 lettres ou chiffres." };
  const delai = champNombre(fd, "delai_paiement_jours") ?? 30;
  if (!Number.isInteger(delai) || delai < 0 || delai > 60)
    return { erreur: "Le délai de paiement doit être entre 0 et 60 jours." };

  const conditions = champ(fd, "conditions_paiement");
  const penalites = champ(fd, "penalites_retard");

  const { error } = await supabase.from("entreprise").upsert({
    owner_id: user.id,
    raison_sociale: champ(fd, "raison_sociale") ?? "",
    forme_juridique: champ(fd, "forme_juridique"),
    capital: champ(fd, "capital"),
    adresse: champ(fd, "adresse"),
    code_postal: champ(fd, "code_postal"),
    ville: champ(fd, "ville"),
    telephone: champ(fd, "telephone"),
    email: champ(fd, "email"),
    site_web: champ(fd, "site_web"),
    siret,
    rcs: champ(fd, "rcs"),
    tva_intracom: champ(fd, "tva_intracom")?.replace(/\s/g, "").toUpperCase() ?? null,
    franchise_tva: fd.get("franchise_tva") === "on",
    tva_sur_debits: fd.get("tva_sur_debits") === "on",
    assureur_decennale: champ(fd, "assureur_decennale"),
    police_decennale: champ(fd, "police_decennale"),
    zone_couverture: champ(fd, "zone_couverture"),
    iban: champ(fd, "iban")?.replace(/\s+/g, " ").toUpperCase() ?? null,
    bic: champ(fd, "bic")?.toUpperCase() ?? null,
    delai_paiement_jours: delai,
    prefixe_facture: prefixe,
    mentions_libres: champ(fd, "mentions_libres"),
    ...(conditions ? { conditions_paiement: conditions } : {}),
    ...(penalites ? { penalites_retard: penalites } : {}),
  });
  if (error) return { erreur: messageErreur(error, "Les informations n'ont pas été enregistrées.") };

  revalidatePath("/espace", "layout");
  return { ok: "Informations enregistrées." };
}

export async function fixerNumerotation(_: EtatAction, fd: FormData): Promise<EtatAction> {
  const { supabase } = await requireAdmin();
  const annee = champNombre(fd, "annee");
  const dernier = champNombre(fd, "dernier");
  if (!annee || !Number.isInteger(annee)) return { erreur: "Année invalide." };
  if (dernier === null || !Number.isInteger(dernier) || dernier < 0)
    return { erreur: "Indiquez le dernier numéro émis (0 si aucun)." };

  const { error } = await supabase.rpc("fixer_dernier_numero", { p_annee: annee, p_dernier: dernier });
  if (error) return { erreur: messageErreur(error, "La numérotation n'a pas été modifiée.") };
  revalidatePath("/espace/parametres");
  return { ok: `La prochaine facture de ${annee} portera le numéro ${dernier + 1}.` };
}
