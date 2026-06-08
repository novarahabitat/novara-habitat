export default function CoreMessagesPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-20">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">Messages</h1>

        <div className="mt-6 space-y-4">
          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#8d7be8]">
                NOVARA Interne
              </p>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                Non lu
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold">
              Changement de planning
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
              Le chantier Client Martin commence à 08:30. Merci de prendre les
              photos avant intervention.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#8d7be8]">
                Message client
              </p>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                Non lu
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold">
              Client Martin
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
              Bonjour, le portail sera ouvert à partir de 08:15. Merci.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <p className="text-sm font-semibold text-[#8d7be8]">
              Système
            </p>

            <h2 className="mt-3 text-lg font-bold">
              Commande en attente
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
              Une demande de matériel pourra être ajoutée depuis les actions
              rapides.
            </p>
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
