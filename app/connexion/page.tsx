import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormulaireConnexion from "./FormulaireConnexion";

export const metadata: Metadata = {
  title: "Espace pro",
  robots: { index: false, follow: false },
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ refus?: string }>;
}) {
  const { refus } = await searchParams;

  if (!refus) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/espace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-4 py-16 text-encre">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 flex flex-col items-center text-center">
          <p className="text-sm tracking-[0.42em] text-or">NOVARA</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gris">Habitat</p>
        </Link>
        <h1 className="mb-6 text-center text-2xl font-light">Espace pro</h1>
        <FormulaireConnexion refus={Boolean(refus)} />
      </div>
    </main>
  );
}
