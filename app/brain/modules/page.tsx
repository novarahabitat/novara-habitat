export default function BrainModulesPage() {
  const modules = [
    {
      name: "Habitat",
      status: "EN DÉVELOPPEMENT",
      progress: 75,
      priority: "ÉLEVÉE",
    },
    {
      name: "Core",
      status: "EN DÉVELOPPEMENT",
      progress: 40,
      priority: "ÉLEVÉE",
    },
    {
      name: "RH",
      status: "EN DÉVELOPPEMENT",
      progress: 30,
      priority: "ÉLEVÉE",
    },
    {
      name: "Dynamics HQ",
      status: "EN CONSTRUCTION",
      progress: 25,
      priority: "ÉLEVÉE",
    },
    {
      name: "Property",
      status: "BASE ACTIVE",
      progress: 50,
      priority: "MOYENNE",
    },
    {
      name: "Concierge",
      status: "CONCEPTION",
      progress: 10,
      priority: "MOYENNE",
    },
    {
      name: "SMART",
      status: "CONCEPTION",
      progress: 10,
      priority: "MOYENNE",
    },
    {
      name: "Payroll",
      status: "CONCEPTION",
      progress: 5,
      priority: "FAIBLE",
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
            MODULE REGISTRY
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Vue globale de tous les modules de l’écosystème NOVARA.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {module.name}
              </h2>

              <div className="mt-4 space-y-2">
                <p className="text-slate-700">
                  <strong>Statut :</strong> {module.status}
                </p>

                <p className="text-slate-700">
                  <strong>Progression :</strong> {module.progress}%
                </p>

                <p className="text-slate-700">
                  <strong>Priorité :</strong> {module.priority}
                </p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width: `${module.progress}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
