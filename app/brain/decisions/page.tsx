export default function BrainDecisionsPage() {
  const decisions = [
    {
      category: "Foundation",
      title: "NOVARA Foundation 1.0",
      status: "VALIDÉE",
      description:
        "PROPERTY, EMPLOYEE et WORK constituent les domaines fondateurs de NOVARA.",
    },
    {
      category: "Employee",
      title: "Employee Master Identity",
      status: "VALIDÉE",
      description:
        "1 employé = 1 Employee Master ID = 1 PIN 6 chiffres = 1 employee_id UUID.",
    },
    {
      category: "Employee",
      title: "Employee UUID Rule",
      status: "VALIDÉE",
      description:
        "Toutes les relations utilisent employee_id UUID. Jamais employee_pin.",
    },
    {
      category: "Property",
      title: "Property Source of Truth",
      status: "VALIDÉE",
      description:
        "properties est la source de vérité unique pour tous les biens.",
    },
    {
      category: "SAV",
      title: "SAV Ownership",
      status: "VALIDÉE",
      description:
        "Création SAV → Concierge | Traitement SAV → Core | Supervision SAV → Dynamics HQ.",
    },
    {
      category: "Governance",
      title: "NOVARA Method",
      status: "VALIDÉE",
      description:
        "Observer → Documenter → Tester → Modéliser → Valider.",
    },
    {
      category: "Architecture",
      title: "Single Source of Truth",
      status: "VALIDÉE",
      description:
        "Une entité ne doit exister qu'une seule fois dans NOVARA.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            DECISION REGISTRY
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Registre officiel des décisions validées de l’écosystème NOVARA.
          </p>
        </header>

        <section className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-800">
            RÈGLE IMPORTANTE
          </h2>

          <p className="mt-3 text-green-700">
            Une décision présente dans ce registre est considérée comme
            officielle jusqu'à modification explicite par la direction NOVARA.
          </p>
        </section>

        <div className="grid gap-6">
          {decisions.map((decision, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
                  {decision.category}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase text-green-800">
                  {decision.status}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {decision.title}
              </h3>

              <p className="mt-3 text-slate-700">
                {decision.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
