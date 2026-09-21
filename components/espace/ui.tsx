import Link from "next/link";
import type { StatutChantier, StatutFacture } from "@/lib/types";
import { libelleStatutChantier, libelleStatutFacture } from "@/lib/format";

export function EnTete({
  titre,
  sousTitre,
  retour,
  actions,
}: {
  titre: string;
  sousTitre?: React.ReactNode;
  retour?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 lg:mb-8">
      {retour && (
        <Link href={retour.href} className="mb-3 inline-flex items-center gap-1 text-sm text-gris hover:text-encre">
          <span aria-hidden>←</span> {retour.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{titre}</h1>
          {sousTitre && <div className="mt-1 text-sm text-gris">{sousTitre}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

const couleursChantier: Record<StatutChantier, string> = {
  prevu: "bg-black/5 text-gris",
  en_cours: "bg-or/15 text-[#7a5d2c]",
  termine: "bg-foret/10 text-foret",
  annule: "bg-alerte/10 text-alerte",
};

export function BadgeChantier({ statut }: { statut: StatutChantier }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${couleursChantier[statut]}`}>
      {libelleStatutChantier[statut]}
    </span>
  );
}

const couleursFacture: Record<StatutFacture, string> = {
  brouillon: "bg-black/5 text-gris",
  emise: "bg-or/15 text-[#7a5d2c]",
  payee: "bg-foret/10 text-foret",
};

export function BadgeFacture({ statut, enRetard }: { statut: StatutFacture; enRetard?: boolean }) {
  if (enRetard && statut === "emise") {
    return (
      <span className="inline-flex rounded-full bg-alerte/10 px-2.5 py-1 text-xs font-medium text-alerte">
        En retard
      </span>
    );
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${couleursFacture[statut]}`}>
      {libelleStatutFacture[statut]}
    </span>
  );
}

export function Vide({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 px-6 py-10 text-center text-sm text-gris">
      {children}
    </div>
  );
}

export function Section({
  titre,
  actions,
  children,
}: {
  titre: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="carte">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-medium">{titre}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

