export default function NotesTriagePage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto max-w-md pb-20">
        <p className="text-sm text-[#8a7eaa]">NOVARA Core</p>

        <h1 className="mt-2 text-3xl font-bold">Triage des notes</h1>

        <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
          Notes vocales à vérifier avant classement définitif.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Note chantier
            </span>

            <p className="mt-4 text-sm leading-6 text-[#8a7eaa]">
              Nous avons terminé le placo du salon et préparé le support pour
              les finitions.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
                Valider
              </button>

              <button className="rounded-2xl bg-[#efe9ff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
                Corriger
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Commande chantier
            </span>

            <p className="mt-4 text-sm leading-6 text-[#8a7eaa]">
              Il faut commander trois plaques BA13, deux rails de trois mètres
              et une boîte de vis placo.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
                Valider
              </button>

              <button className="rounded-2xl bg-[#efe9ff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
                Corriger
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Tri manuel requis
            </span>

            <p className="mt-4 text-sm leading-6 text-[#8a7eaa]">
              Le client demande si la prise peut être déplacée de l’autre côté
              du mur.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white">
                Classer
              </button>

              <button className="rounded-2xl bg-[#efe9ff] px-4 py-3 text-sm font-semibold text-[#6f5bd8]">
                Demander avis
              </button>
            </div>
          </div>
        </div>

        <a
          href="/core/notes"
          className="mt-6 block rounded-2xl bg-[#efe9ff] px-5 py-4 text-center font-semibold text-[#6f5bd8]"
        >
          Retour Notes
        </a>
      </section>
    </main>
  );
}
