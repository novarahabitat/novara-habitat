import type { Entreprise } from "@/lib/types";

export const MENTION_FRANCHISE = "TVA non applicable, art. 293 B du CGI.";

/** Entrepreneur individuel (micro-entrepreneur compris) : « EI » doit suivre le nom. */
export function estEI(e: Partial<Entreprise>) {
  return /^\s*(ei|e\.i\.|entrepreneur individuel|micro[- ]?entrepr|auto[- ]?entrepr)/i.test(e.forme_juridique ?? "");
}

export function nomEmetteur(e: Partial<Entreprise>) {
  const nom = e.raison_sociale ?? "";
  if (!estEI(e) || /\b(EI|entrepreneur individuel)\b/i.test(nom)) return nom;
  return `${nom} EI`;
}

/**
 * Mentions de TVA à imprimer. En franchise en base, la mention de l'article 293 B
 * est toujours présente, qu'elle ait été saisie ou non sur la facture.
 */
export function mentionsTva(
  facture: { mention_tva: string | null },
  e: Partial<Entreprise>,
): string[] {
  const saisie = facture.mention_tva?.trim();
  if (e.franchise_tva) {
    const autres = saisie && !/293\s*B/i.test(saisie) ? [saisie] : [];
    return [MENTION_FRANCHISE, ...autres];
  }
  return saisie ? [saisie] : [];
}
