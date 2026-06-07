export default function CorePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-6 md:max-w-3xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Core
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Bonjour Vital
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Application interne chantier — terrain d’abord.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
          <p className="text-sm text-white/50">Chantier du jour</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Aucun chantier assigné
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Le dashboard sera bientôt connecté aux projets Supabase.
          </p>

          <button className="mt-5 w-full rounded-2xl bg-[#c8a45d] px-5 py-4 text-base font-semibold text-black">
            Ouvrir les chantiers
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-3xl font-semibold">0</p>
            <p className="mt-1 text-sm text-white/50">Chantiers actifs</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-3xl font-semibold">0</p>
            <p className="mt-1 text-sm text-white/50">SAV ouverts</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-3xl font-semibold">0</p>
            <p className="mt-1 text-sm text-white/50">Photos reçues</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-3xl font-semibold">0</p>
            <p className="mt-1 text-sm text-white/50">Rapports attente</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-left text-base font-medium">
            📸 Ajouter une photo chantier
          </button>

          <button className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-left text-base font-medium">
            🎙️ Rapport vocal
          </button>

          <button className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-left text-base font-medium">
            🗓️ Voir le planning
          </button>

          <button className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-left text-base font-medium">
            🛠️ Ouvrir SAV
          </button>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/90 px-4 pb-4 pt-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2 text-center text-xs text-white/60">
          <div className="text-[#c8a45d]">Accueil</div>
          <div>Chantiers</div>
          <div>Photos</div>
          <div>Planning</div>
          <div>SAV</div>
        </div>
      </nav>
    </main>
  );
}
