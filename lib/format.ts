import type { NatureOperation, PhasePhoto, StatutChantier, StatutFacture, TypeFacture } from "@/lib/types";

// Intl insère des espaces insécables fines (U+202F) que la police des PDF ne
// connaît pas : on les remplace par des espaces simples.
const espaces = (s: string) => s.replace(/[  ]/g, " ");

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 });

export function formatEuros(v: string | number | null | undefined) {
  return espaces(euros.format(Number(v ?? 0)));
}

export function formatNombre(v: string | number | null | undefined) {
  return espaces(nombre.format(Number(v ?? 0)));
}

export function formatTaux(v: string | number) {
  return `${formatNombre(v)} %`;
}

/** Date au format jj/mm/aaaa. Les dates SQL (aaaa-mm-jj) sont lues sans décalage horaire. */
export function formatDate(v: string | null | undefined) {
  if (!v) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return new Date(v).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
}

export function formatDateHeure(v: string) {
  return espaces(
    new Date(v).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
}

export const libelleStatutChantier: Record<StatutChantier, string> = {
  prevu: "Prévu",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};

export const libellePhase: Record<PhasePhoto, string> = {
  avant: "Avant",
  pendant: "Pendant",
  apres: "Après",
};

export const libelleStatutFacture: Record<StatutFacture, string> = {
  brouillon: "Brouillon",
  emise: "À payer",
  payee: "Payée",
};

export const libelleTypeFacture: Record<TypeFacture, string> = {
  facture: "Facture",
  avoir: "Avoir",
  acompte: "Facture d'acompte",
};

export const libelleNature: Record<NatureOperation, string> = {
  prestation_services: "Prestation de services",
  livraison_biens: "Livraison de biens",
  mixte: "Livraison de biens et prestation de services",
};

export function adresseComplete(o: {
  adresse?: string | null;
  code_postal?: string | null;
  ville?: string | null;
}) {
  return [o.adresse, [o.code_postal, o.ville].filter(Boolean).join(" ")]
    .filter((s) => s && s.trim())
    .join(", ");
}

/** Valeur texte d'un champ de formulaire, ou null si vide. */
export function champ(fd: FormData, nom: string): string | null {
  const v = fd.get(nom);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

/** Nombre saisi à la française (virgule acceptée). */
export function champNombre(fd: FormData, nom: string): number | null {
  const v = champ(fd, nom);
  if (v === null) return null;
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

/** Message d'erreur Postgres lisible (nos fonctions lèvent des messages en français). */
export function messageErreur(e: { message?: string } | null | undefined, repli: string) {
  const m = e?.message ?? "";
  if (/row-level security|permission denied/i.test(m)) return "Action non autorisée.";
  if (/violates foreign key|RESTRICT/i.test(m))
    return "Impossible : cet élément est utilisé ailleurs (factures, chantiers).";
  if (/[àâéèêëîôûç«]/i.test(m)) return m;
  return repli;
}

/** Date du jour à Paris, au format aaaa-mm-jj. */
export function aujourdhui() {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());
}
