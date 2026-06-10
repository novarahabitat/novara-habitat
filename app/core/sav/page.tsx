export default function CoreSavPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-24">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">SAV</h1>

        <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
          Gestion des demandes après travaux, incidents signalés,
          retours clients et interventions correctives.
        </p>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <h2 className="font-semibold">Nouvelle demande SAV</h2>

          <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
            Créer rapidement un dossier SAV terrain.
          </p>

          <div className="mt-4 grid gap-3">
            <button className="rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white">
              🛠 Créer un SAV
            </button>

            <button className="rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]">
              📸 Ajouter photos
            </button>

            <button className="rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]">
              🎙 Ajouter note vocale
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">SAV ouverts</h2>

          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  Urgent
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  #SAV-001
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Fuite sous évier
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                Client Martin signale une fuite apparue après intervention.
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[#8a7eaa]">
                  Assigné : Julien
                </span>

                <span className="font-semibold text-red-600">
                  À traiter
                </span>
              </div>

              <button className="mt-4 w-full rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white">
                Ouvrir dossier
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  Planifié
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  #SAV-002
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Réglage porte coulissante
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                Difficulté de fermeture signalée par le client.
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[#8a7eaa]">
                  Intervention prévue vendredi
                </span>

                <span className="font-semibold text-orange-600">
                  Planifié
                </span>
              </div>

              <button className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white">
                Voir planning
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Résolu
                </span>

                <span className="text-xs text-[#8a7eaa]">
                  #SAV-003
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Remplacement prise
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                Intervention réalisée et validée par le client.
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[#8a7eaa]">
                  Fermé hier
                </span>

                <span className="font-semibold text-emerald-600">
                  Clôturé
                </span>
              </div>

              <button className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white">
                Voir historique
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <h2 className="font-semibold">Vision NOVARA</h2>

          <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
            Chaque SAV enrichira automatiquement l'historique du chantier,
            l'analyse qualité, les statistiques et les futures recommandations IA.
          </p>
        </div>

        <a
          href="/core"
          className="mt-6 block rounded-2xl bg-[#efe9ff] px-5 py-4 text-center font-semibold text-[#6f5bd8]"
        >
          Retour Core
        </a>
      </section>
    </main>
  );
}
