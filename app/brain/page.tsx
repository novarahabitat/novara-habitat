import BrainLayout from "@/components/brain/BrainLayout";

export default function BrainPage() {
  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            NOVARA BRAIN
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            Centre de coordination, de connaissance et de pilotage de
            l’écosystème NOVARA.
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            FOUNDATION 1.0
          </h2>

          <p className="mt-3 text-green-400">
            ARCHITECTURE VALIDÉE
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold text-white">
                PROPERTY
              </h3>

              <p className="mt-2 text-white/50">
                Où ?
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold text-white">
                EMPLOYEE
              </h3>

              <p className="mt-2 text-white/50">
                Qui ?
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold text-white">
                WORK
              </h3>

              <p className="mt-2 text-white/50">
                Quoi ?
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Mission
          </h2>

          <p className="mt-4 text-white/60">
            NOVARA Brain centralise la connaissance, les décisions,
            les rapports et l’architecture globale du projet.
          </p>
        </section>
      </div>
    </BrainLayout>
  );
}
