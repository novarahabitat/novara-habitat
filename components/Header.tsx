"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/35 backdrop-blur-2xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-4">
          <img
            src="/logos/novara-noir.jpg"
            alt="NOVARA Habitat"
            className="h-12 w-auto object-contain"
          />

          <div className="leading-tight">
            <p className="text-sm tracking-[0.42em] text-[#c9a45c]">
              NOVARA
            </p>

            <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">
              HABITAT
            </p>
          </div>
        </Link>

        <Link
          href="/connexion"
          className="rounded-full border border-[#c9a45c]/45 px-7 py-3 text-sm font-medium text-[#c9a45c] transition hover:bg-[#c9a45c] hover:text-black"
        >
          Accès
        </Link>
      </div>
    </header>
  );
}
