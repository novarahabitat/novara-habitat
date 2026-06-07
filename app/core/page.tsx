import SafetyIncidentButton from "@/components/core/SafetyIncidentButton";

export default function CorePage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] text-[#34275f]">
      <SafetyIncidentButton />

      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-24">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-3xl bg-white shadow-lg shadow-[#d9ccff]/30" />

          <div>
            <p className="text-sm text-[#8a7eaa]">Bonjour</p>
            <h1 className="text-2xl font-bold">Julien</h1>

            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm text-[#8a7eaa]">Non pointé</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">
            Chantier du jour
          </p>

          <h2 className="mt-3 text-xl font-bold">Client Martin</h2>

          <p className="mt-2 text-[#8a7eaa]">15 Rue de la République</p>
          <p className="text-[#8a7eaa]">Saint-Malo</p>

          <div className="mt-5 flex gap-3">
            <button className="flex-1 rounded-2xl bg-[#8d7be8] px-4 py-3 font-semibold text-white">
              GPS
            </button>

            <a
              href="/core/chantier/1"
              className="flex-1 rounded-2xl bg-[#efe9ff] px-4 py-3 text-center font-semibold text-[#6f5bd8]"
            >
              Ouvrir
            </a>
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">Pointage</p>

          <p className="mt-2 text-sm text-[#8a7eaa]">
            Arrivée prévue : 08:30
          </p>

          <button className="mt-4 w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-white">
            Pointer mon arrivée
          </button>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Messages internes</p>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              2
            </span>
          </div>

          <p className="mt-3 text-sm text-[#8a7eaa]">
            Nouveau message du chef de chantier.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold">Actions rapides</h3>

          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-3xl bg-white p-4 shadow-lg">
              📸 Photos
            </button>

            <button className="rounded-3xl bg-white p-4 shadow-lg">
              🎙 Rapport
            </button>

            <button className="rounded-3xl bg-white p-4 shadow-lg">
              📦 Commande
            </button>

            <button className="rounded-3xl bg-white p-4 shadow-lg">
              📄 Documents
            </button>

            <button className="rounded-3xl bg-white p-4 shadow-lg">
              🛠 SAV
            </button>

            <button className="rounded-3xl bg-white p-4 shadow-lg">
              📨 Messages
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
