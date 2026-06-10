export default function DailyReportPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-24">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">
          Rapport de journée
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
          NOVARA compile automatiquement les événements du chantier
          afin de préparer le rapport quotidien.
        </p>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">
            Chantier actif
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Client Martin
          </h2>

          <p className="mt-2 text-sm text-[#8a7eaa]">
            15 Rue de la République · Saint-Malo
          </p>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">
            Éléments collectés aujourd’hui
          </h2>

          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex justify-between">
                <span>📸 Photo chantier</span>
                <span className="text-sm text-[#8a7eaa]">
                  09:42
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex justify-between">
                <span>🎙 Note vocale</span>
                <span className="text-sm text-[#8a7eaa]">
                  10:01
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex justify-between">
                <span>📦 Besoin matériel détecté</span>
                <span className="text-sm text-[#8a7eaa]">
                  11:18
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex justify-between">
                <span>⚠️ Near Miss potentiel</span>
                <span className="text-sm text-[#8a7eaa]">
                  14:06
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Résumé IA proposé
            </h2>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Brouillon
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-[#f7f2ff] p-4 text-sm leading-6 text-[#5d4ea8]">
            Les travaux de doublage BA13 du salon ont été terminés
            aujourd’hui. Une demande potentielle de matériel complémentaire
            a été détectée. Un point de vigilance sécurité a été signalé
            concernant un sol humide dans l’entrée. Validation humaine
            recommandée avant publication.
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <button className="rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white">
            📤 Soumettre rapport
          </button>

          <button className="rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]">
            🔄 Régénérer résumé IA
          </button>

          <button className="rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]">
            ✍️ Corriger manuellement
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <h2 className="font-semibold">
            Vision NOVARA
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
            À terme, le rapport sera généré automatiquement à partir
            des photos, notes vocales, événements chantier, incidents,
            commandes et interventions SAV. L’objectif est de permettre
            à l’ouvrier de parler, prendre des photos et travailler,
            tandis que NOVARA construit le rapport.
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
