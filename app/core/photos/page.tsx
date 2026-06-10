import PhotoCapture from "@/components/core/PhotoCapture";

export default function CorePhotosPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-24">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">Photos chantier</h1>

        <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
          Prenez une photo. NOVARA l’associera ensuite au chantier, à l’employé,
          à l’heure, au GPS et à l’analyse IA.
        </p>

        <PhotoCapture />

        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
          <p className="text-sm font-medium text-[#8d7be8]">
            Contexte automatique
          </p>

          <div className="mt-4 space-y-3 text-sm text-[#8a7eaa]">
            <div className="flex justify-between gap-4">
              <span>Chantier</span>
              <strong className="text-right text-[#34275f]">
                Client Martin
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span>Employé</span>
              <strong className="text-right text-[#34275f]">
                Julien
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span>Source</span>
              <strong className="text-right text-[#34275f]">
                Core mobile
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span>GPS</span>
              <strong className="text-right text-orange-600">
                En attente
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Photos récentes</h2>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-[#d9ccff]/20">
              <div className="flex h-44 items-center justify-center bg-[#efe9ff] text-5xl">
                📸
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    Analyse IA en attente
                  </span>

                  <span className="text-xs text-[#8a7eaa]">09:42</span>
                </div>

                <h3 className="mt-3 font-semibold">Photo chantier #001</h3>

                <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                  Auteur : Julien · Chantier : Client Martin
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-[#d9ccff]/20">
              <div className="flex h-44 items-center justify-center bg-[#f7f2ff] text-5xl">
                🧱
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Placo / Finition
                  </span>

                  <span className="text-xs text-[#8a7eaa]">11:18</span>
                </div>

                <h3 className="mt-3 font-semibold">Photo chantier #002</h3>

                <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                  Auteur : Julien · Classification IA proposée : 92 %
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-[#d9ccff]/20">
              <div className="flex h-44 items-center justify-center bg-[#fff3df] text-5xl">
                ⚠️
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    Sécurité à vérifier
                  </span>

                  <span className="text-xs text-[#8a7eaa]">14:06</span>
                </div>

                <h3 className="mt-3 font-semibold">Photo chantier #003</h3>

                <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
                  Possible near miss · Validation humaine requise.
                </p>
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
