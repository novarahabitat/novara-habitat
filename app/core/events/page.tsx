export default function CoreEventsPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-24">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">Événements chantier</h1>

        <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
          NOVARA regroupera ici les photos, notes vocales, incidents,
          commandes et pointages liés au même moment de travail.
        </p>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">
            Chantier actif
          </p>

          <h2 className="mt-2 text-xl font-bold">Client Martin</h2>

          <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
            15 Rue de la République · Saint-Malo
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-[#f7f2ff] p-3">
              <p className="font-bold text-[#6f5bd8]">3</p>
              <p className="text-xs text-[#8a7eaa]">Photos</p>
            </div>

            <div className="rounded-2xl bg-[#f7f2ff] p-3">
              <p className="font-bold text-[#6f5bd8]">2</p>
              <p className="text-xs text-[#8a7eaa]">Notes</p>
            </div>

            <div className="rounded-2xl bg-[#f7f2ff] p-3">
              <p className="font-bold text-[#6f5bd8]">1</p>
              <p className="text-xs text-[#8a7eaa]">Alerte</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Timeline terrain</h2>

          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Travail documenté
                </span>

                <span className="text-xs text-[#8a7eaa]">09:42</span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Salon — doublage BA13
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                NOVARA a regroupé une photo chantier et une note vocale prises
                à quelques minutes d’intervalle.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#efe9ff] p-4 text-center">
                  <p className="text-3xl">📸</p>
                  <p className="mt-2 text-xs text-[#6f5bd8]">
                    Photo #001
                  </p>
                </div>

                <div className="rounded-2xl bg-[#efe9ff] p-4 text-center">
                  <p className="text-3xl">🎙️</p>
                  <p className="mt-2 text-xs text-[#6f5bd8]">
                    Note #014
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#f7f2ff] p-4 text-sm text-[#8a7eaa]">
                <p className="font-semibold text-[#34275f]">
                  Résumé proposé
                </p>
                <p className="mt-2">
                  Le doublage BA13 du salon est terminé. Les bandes seront
                  réalisées lors du prochain passage.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Demande matériel
                </span>

                <span className="text-xs text-[#8a7eaa]">11:18</span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Commande potentielle
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                Une note vocale mentionne un besoin de plaques BA13 et rails.
                L’IA préparera une demande, mais aucune commande ne sera envoyée
                sans validation humaine.
              </p>

              <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
                <p className="font-semibold">Règle NOVARA</p>
                <p className="mt-1">
                  IA propose · Humain valide · Jamais de commande automatique.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  Sécurité
                </span>

                <span className="text-xs text-[#8a7eaa]">14:06</span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Near miss potentiel
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                Une photo et une note signalent un sol humide dans l’entrée.
                Validation humaine requise avant classement incident / near miss.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white">
                  À vérifier
                </button>

                <button className="rounded-2xl bg-[#efe9ff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
                  Voir détails
                </button>
              </div>
            </div>
          </div>
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
