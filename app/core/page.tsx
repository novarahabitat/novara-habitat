import CheckInGps from "@/components/core/CheckInGps";
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

            <div className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              🟢 En ligne
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">Chantier actif</p>

          <h2 className="mt-3 text-xl font-bold">Client Martin</h2>

          <p className="mt-2 text-[#8a7eaa]">15 Rue de la République</p>
          <p className="text-[#8a7eaa]">Saint-Malo</p>

          <div className="mt-5 flex gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=15%20Rue%20de%20la%20R%C3%A9publique%2C%20Saint-Malo"
              target="_blank"
              className="flex-1 rounded-2xl bg-[#8d7be8] px-4 py-3 text-center font-semibold text-white"
            >
              GPS
            </a>

            <a
              href="/core/chantier/1"
              className="flex-1 rounded-2xl bg-[#efe9ff] px-4 py-3 text-center font-semibold text-[#6f5bd8]"
            >
              Ouvrir
            </a>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button className="rounded-2xl bg-[#f3edff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
              ← Précédent
            </button>

            <span className="text-sm text-[#8a7eaa]">1 / 5</span>

            <button className="rounded-2xl bg-[#f3edff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
              Suivant →
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white">
              Chantier fini
            </button>

            <button className="rounded-2xl bg-orange-100 px-4 py-3 font-semibold text-orange-600">
              Recaler
            </button>
          </div>
        </div>

        <CheckInGps />

        <a
          href="/core/messages"
          className="mt-5 block rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">Messages</p>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              2
            </span>
          </div>

          <p className="mt-3 text-sm text-[#8a7eaa]">
            1 message interne NOVARA · 1 message client.
          </p>
        </a>

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

            <a
              href="/core/messages"
              className="rounded-3xl bg-white p-4 text-center shadow-lg"
            >
              📨 Messages
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">Espace sécurisé</p>

          <h3 className="mt-2 text-lg font-bold">RH / Personnel</h3>

          <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
            Accès aux informations personnelles et documents sensibles. Une
            vérification supplémentaire sera demandée avant ouverture.
          </p>

          <button className="mt-4 w-full rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]">
            RH / Personnel
          </button>
        </div>
      </section>
    </main>
  );
}
