export default function BrainRoutesPage() {
  const routes = [
    {
      route: "/",
      module: "Habitat",
      access: "Public",
      description: "Site principal NOVARA Habitat",
    },
    {
      route: "/connexion",
      module: "Auth",
      access: "Public",
      description: "Connexion utilisateurs",
    },
    {
      route: "/admin",
      module: "Dynamics HQ",
      access: "Admin",
      description: "Direction et supervision",
    },
    {
      route: "/core",
      module: "Core",
      access: "Employé",
      description: "Application terrain",
    },
    {
      route: "/sales",
      module: "Commercial",
      access: "Commercial",
      description: "CRM et ventes",
    },
    {
      route: "/espace-client",
      module: "Client",
      access: "Client",
      description: "Portail client",
    },
    {
      route: "/property",
      module: "Property",
      access: "Client",
      description: "Property Passport",
    },
    {
      route: "/brain",
      module: "NOVARA Brain",
      access: "Admin",
      description: "Centre de connaissance",
    },
    {
      route: "/brain/context",
      module: "NOVARA Brain",
      access: "IA",
      description: "Contexte IA partagé",
    },
    {
      route: "/brain/decisions",
      module: "NOVARA Brain",
      access: "Admin / IA",
      description: "Registre des décisions",
    },
    {
      route: "/brain/modules",
      module: "NOVARA Brain",
      access: "Admin / IA",
      description: "Registre des modules",
    },
    {
      route: "/brain/data-model",
      module: "NOVARA Brain",
      access: "Admin / IA",
      description: "Data Model Master",
    },
    {
      route: "/brain/routes",
      module: "NOVARA Brain",
      access: "Admin / IA",
      description: "Registre des routes",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            ROUTE REGISTRY
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Registre officiel des routes et accès de l’écosystème NOVARA.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">
            RÈGLE
          </h2>

          <p className="mt-3 text-slate-700">
            Avant de créer une nouvelle page, vérifier si une route équivalente existe déjà.
            Les modules doivent réutiliser l’architecture existante plutôt que créer des doublons.
          </p>
        </section>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Route</th>
                <th className="p-4 text-left">Module</th>
                <th className="p-4 text-left">Accès</th>
                <th className="p-4 text-left">Description</th>
              </tr>
            </thead>

            <tbody>
              {routes.map((route) => (
                <tr key={route.route} className="border-t border-slate-200">
                  <td className="p-4 font-mono text-sm">
                    {route.route}
                  </td>

                  <td className="p-4">
                    {route.module}
                  </td>

                  <td className="p-4">
                    {route.access}
                  </td>

                  <td className="p-4">
                    {route.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
