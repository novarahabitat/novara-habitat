export default function CorePage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] text-[#34275f]">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-6 md:max-w-4xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8d7be8]">
              NOVARA CORE
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              Bienvenue, Vital
            </h1>
            <p className="mt-1 text-sm text-[#8a7eaa]">
              Prêt à piloter vos chantiers ?
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-[#c9b8ff]/30">
            N
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eee7ff] via-[#f8eefe] to-[#e7f0ff] p-6 shadow-xl shadow-[#c9b8ff]/30">
          <p className="text-sm font-medium text-[#7d69d7]">
            Aujourd’hui
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            NOVARA Core,
            <br />
            plaisir à gérer.
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#786f9d]">
            Chantiers, photos, planning et SAV réunis dans une application
            simple, rapide et agréable à utiliser.
          </p>

          <a
            href="/core/chantier"
            className="mt-6 inline-flex rounded-2xl bg-[#8d7be8] px-5 py-3 font-semibold text-white shadow-lg shadow-[#8d7be8]/30"
          >
            Voir mes chantiers →
          </a>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4">
          {[
            ["0", "Chantiers actifs"],
            ["0", "SAV ouverts"],
            ["0", "Photos reçues"],
            ["0", "Rapports attente"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/25"
            >
              <p className="text-3xl font-semibold text-[#6f5bd8]">
                {value}
              </p>
              <p className="mt-2 text-sm text-[#8a7eaa]">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-[#5f528d]">
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
                className="flex w-full items-center gap-4 rounded-[1.5rem] bg-white p-4 text-left shadow-lg shadow-[#d9ccff]/20"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eaff] text-xl">
                  {icon}
                </span>

                <span>
                  <span className="block font-semibold text-[#34275f]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm text-[#9a8fb8]">
                    {subtitle}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#eadfff] bg-white/85 px-4 pb-5 pt-3 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-md grid-cols-5 text-center text-[11px] text-[#9a8fb8]">
          <a href="/core" className="font-semibold text-[#6f5bd8]">
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
