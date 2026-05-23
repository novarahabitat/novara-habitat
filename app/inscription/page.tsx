import Header from '@/components/Header'

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-novaraBlack px-6 py-32 text-novaraCream">
      <Header />
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-novaraGold">Création d’accès</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Créer mon espace NOVARA</h1>
        <p className="mt-3 text-sm text-white/60">La création de compte sera connectée à Supabase Auth à l’étape suivante.</p>
        <form className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-novaraGold" placeholder="Nom complet" />
          <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-novaraGold" placeholder="Email" type="email" />
          <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-novaraGold" placeholder="Mot de passe" type="password" />
          <button className="w-full rounded-xl bg-novaraGold px-4 py-3 font-medium text-black">Créer mon accès</button>
        </form>
      </section>
    </main>
  )
}
