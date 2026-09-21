"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Lien = { href: string; label: string; icone: React.ReactNode; mobile: boolean };

const trait = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const liens: Lien[] = [
  {
    href: "/espace",
    label: "Accueil",
    mobile: true,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: "/espace/chantiers",
    label: "Chantiers",
    mobile: true,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <path d="M2 20h20M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    href: "/espace/factures",
    label: "Factures",
    mobile: true,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <path d="M6 2h9l5 5v15H6z M14 2v6h6 M9 13h8 M9 17h8" />
      </svg>
    ),
  },
  {
    href: "/espace/clients",
    label: "Clients",
    mobile: true,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.5 5.2" />
      </svg>
    ),
  },
  {
    href: "/espace/demandes",
    label: "Demandes",
    mobile: false,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <path d="M4 4h16v12H8l-4 4z" />
      </svg>
    ),
  },
  {
    href: "/espace/parametres",
    label: "Réglages",
    mobile: true,
    icone: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...trait}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    ),
  },
];

function estActif(pathname: string, href: string) {
  return href === "/espace" ? pathname === "/espace" : pathname.startsWith(href);
}

export function NavigationLaterale() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {liens.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
            estActif(pathname, l.href)
              ? "bg-foret text-white"
              : "text-gris hover:bg-creme-fonce/60 hover:text-encre"
          }`}
        >
          {l.icone}
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export function NavigationMobile() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg justify-around">
        {liens
          .filter((l) => l.mobile)
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex min-w-16 flex-col items-center gap-1 px-2 pb-2 pt-2.5 text-[11px] ${
                estActif(pathname, l.href) ? "text-foret" : "text-black/45"
              }`}
            >
              {l.icone}
              {l.label}
            </Link>
          ))}
      </div>
    </nav>
  );
}
