export default function NotesPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-20">
        <p className="text-sm text-[#8a7eaa]">
          NOVARA Core
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Notes vocales
        </h1>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <h2 className="font-semibold">
            Nouvelle note
          </h2>

          <p className="mt-2 text-sm text-[#8a7eaa]">
            Démarrer un enregistrement vocal.
          </p>

          <button className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white">
            🎙 Démarrer
          </button>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">
            Notes du jour
          </h2>

          <div className="space-y-3">
            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Note chantier
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  09:14
                </span>
              </div>

              <p className="mt-3 text-sm text-[#8a7eaa]">
                Pose du placo terminée dans le salon.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Commande chantier
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  11:42
                </span>
              </div>

              <p className="mt-3 text-sm text-[#8a7eaa]">
                Besoin de 3 plaques BA13 supplémentaires.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  Tri manuel requis
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  14:30
                </span>
              </div>

              <p className="mt-3 text-sm text-[#8a7eaa]">
                Le client souhaite déplacer une prise électrique.
              </p>
            </div>
          </div>
        </div>

        <button className="mt-6 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white">
          Compiler la journée
        </button>

        <a
          href="/core"
          className="mt-4 block rounded-2xl bg-[#efe9ff] px-5 py-4 text-center font-semibold text-[#6f5bd8]"
        >
          Retour Core
        </a>
      </section>
    </main>
  );
}
