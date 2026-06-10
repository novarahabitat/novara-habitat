export default function BrainPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            NOVARA Dynamics HQ
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            NOVARA Project Brain
          </h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Référentiel central de connaissance, d’architecture et de gouvernance de l’écosystème NOVARA.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Foundation 1.0</h2>
          <p className="mt-3 text-slate-700">
            Statut : <strong className="text-green-700">FROZEN / VALIDÉE</strong>
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {["PROPERTY — Où ?", "EMPLOYEE — Qui ?", "WORK — Quoi ?"].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-medium">
                {item}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-600">
            PARTY reste sous observation : observer → documenter → tester → modéliser → geler.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Sources de vérité</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {["employees", "properties", "projects", "sav_tickets"].map((item) => (
              <span key={item} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Décisions validées</h2>

          <ul className="mt-5 space-y-3 text-slate-700">
            <li>• 1 employé = 1 Employee Master ID = 1 employee_id UUID.</li>
            <li>• employee_pin = identité visible uniquement.</li>
            <li>• Toutes les relations utilisent employee_id, jamais employee_pin.</li>
            <li>• properties est la source de vérité unique pour les biens.</li>
            <li>• SAV création → Concierge.</li>
            <li>• SAV opération terrain → Core.</li>
            <li>• SAV supervision → Dynamics HQ.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Modules NOVARA</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Habitat", "En développement"],
              ["Core", "En développement"],
              ["RH", "En développement"],
              ["Dynamics HQ", "Construction"],
              ["Concierge", "Conception"],
              ["SMART", "Conception"],
              ["Payroll", "Conception"],
              ["Property", "Base active"],
            ].map(([name, status]) => (
              <div key={name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">{name}</h3>
                <p className="mt-1 text-sm text-slate-600">{status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Prochaine priorité</h2>
          <p className="mt-3 text-slate-700">
            Créer le Data Model Master, le Module Registry et le Decision Registry pour éviter la perte de connaissance entre les modules.
          </p>
        </section>
      </div>
    </main>
  );
}
