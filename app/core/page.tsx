export default function CorePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-6 md:max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#c8a45d]">
              NOVARA CORE
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Terrain
            </h1>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c8a45d]/30 bg-[#c8a45d]/10 text-sm font-semibold text-[#c8a45d]">
            VL
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.03] p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/50">Aujourd’hui</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Aucun chantier assigné
              </h2>
            </div>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Disponible
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/55">
            Les chantiers du jour apparaîtront ici avec accès rapide aux photos,
            rapports et documents.
          </p>

          <a
            href="/core/chantier"
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#c8a45d] px-5 py-4 text-base font-semibold text-black shadow-lg shadow-[#c8a45d]/20"
          >
            Ouvrir les chantiers
          </a>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80">
              Vue opérationnelle
            </h3>
            <span className="text-xs text-white/40">V1</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["0", "Actifs"],
              ["0", "SAV"],
              ["0", "Photos"],
              ["0", "Rapports"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4"
              >
                <p className="text-3xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="mt-1 text-sm text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-white/80">
            Actions rapides
          </h3>

          <div className="space-y-3">
            {[
              ["📸", "Photo chantier", "Avant, pendant, après"],
              ["🎙️", "Rapport vocal", "Compte-rendu fin de journée"],
              ["📄", "Documents", "Devis, plans, notices"],
              ["🛠️", "SAV", "Tickets et interventions"],
            ].map(([icon, title, subtitle]) => (
              <button
                key={title}
                className="flex w-full items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 text-left active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
                  {icon}
                </span>

                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-0.5 block text-sm text-white/40">
                    {subtitle}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/85 px-4 pb-5 pt-3 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-md grid-cols-5 text-center text-[11px] text-white/45">
          <a href="/core" className="text-[#c8a45d]">
            Accueil
          </a>
          <a href="/core/chantier">Chantiers</a>
          <span>Photos</span>
          <span>Planning</span>
          <span>SAV</span>
        </div>
      </nav>
    </main>
  );
}
