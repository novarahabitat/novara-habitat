import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { seDeconnecter } from "@/app/connexion/actions";
import { NavigationLaterale, NavigationMobile } from "./Navigation";

export const metadata: Metadata = {
  title: { default: "Espace pro", template: "%s — Espace pro" },
  robots: { index: false, follow: false },
};

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-creme text-encre">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-creme/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/espace" className="leading-tight">
            <span className="block text-xs tracking-[0.4em] text-or">NOVARA</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gris">Espace pro</span>
          </Link>
          <form action={seDeconnecter}>
            <button className="text-sm text-gris">Déconnexion</button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-black/[0.06] px-4 py-8 lg:flex">
          <Link href="/espace" className="mb-10 px-3 leading-tight">
            <span className="block text-sm tracking-[0.42em] text-or">NOVARA</span>
            <span className="block text-[11px] uppercase tracking-[0.35em] text-gris">Espace pro</span>
          </Link>
          <NavigationLaterale />
          <div className="mt-auto px-3">
            <p className="truncate text-xs text-gris">{user.email}</p>
            <form action={seDeconnecter}>
              <button className="mt-2 text-sm text-gris hover:text-encre">Déconnexion</button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">{children}</main>
      </div>

      <NavigationMobile />
    </div>
  );
}
