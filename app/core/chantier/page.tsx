export default function CoreChantiersPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-6 text-white">
      <p className="text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
        NOVARA Core
      </p>

      <h1 className="mt-3 text-3xl font-semibold">Chantiers</h1>

      <p className="mt-2 text-sm text-white/60">
        Liste des chantiers actifs, terminés, SAV et en attente.
      </p>

      <div className="mt-6 space-y-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm text-[#c8a45d]">Actif</p>
          <h2 className="mt-2 text-xl font-semibold">Aucun chantier actif</h2>
          <p className="mt-2 text-sm text-white/50">
            Les projets Supabase apparaîtront ici.
          </p>
        </div>
      </div>
    </main>
  );
}
