import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Header />
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pt-24">
        <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Habitat</p>
        <h1 className="mt-5 text-5xl font-semibold">Connexion client</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Accédez à votre espace personnel NOVARA.</p>
        <div className="mt-10 rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8">
          <p className="text-white/70">Module prêt pour l’étape Supabase : authentification, profils clients, projets, documents, devis, factures, messagerie et SAV.</p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-[#c9a45c] px-6 py-3 font-medium text-black">Retour accueil</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
