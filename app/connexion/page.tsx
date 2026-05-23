import Header from '@/components/Header'

export default function ConnexionPage() {
  return (
    <main className="min-h-screen bg-novaraBlack px-6 py-32 text-novaraCream">
      <Header />
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-novaraGold">Espace client</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Connexion</h1>
        <p className="mt-3 text-sm text-white/60">Interface prête pour Supabase Auth. Connexion active à l’étape suivante.</p>
        <form className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-novaraGold" placeholder="Email" type="email" />
          <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-novaraGold" placeholder="Mot de passe" type="password" />
          <button className="w-full rounded-xl bg-novaraGold px-4 py-3 font-medium text-black">Se connecter</button>
        </form>
        <a href="/inscription" className="mt-5 block text-center text-sm text-novaraGold">Créer un compte client</a>
      </section>
    </main>
  )
}
