export default function BrainRoutesPage() {
  const routes = [
    ["/", "Habitat", "Public", "Site principal NOVARA Habitat"],
    ["/connexion", "Auth", "Public", "Connexion utilisateurs"],
    ["/admin", "Dynamics HQ", "Admin", "Direction et supervision"],
    ["/core", "Core", "Employé", "Application terrain"],
    ["/sales", "Commercial", "Commercial", "CRM et ventes"],
    ["/espace-client", "Client", "Client", "Portail client"],
    ["/property", "Property", "Client", "Property Passport"],
    ["/brain", "NOVARA Brain", "Admin", "Centre de connaissance"],
    ["/brain/context", "NOVARA Brain", "IA", "Contexte IA partagé"],
    ["/brain/decisions", "NOVARA Brain", "Admin / IA", "Registre des décisions"],
    ["/brain/modules", "NOVARA Brain", "Admin / IA", "Registre des modules"],
    ["/brain/data-model", "NOVARA Brain", "Admin / IA", "Data Model Master"],
    ["/brain/routes", "NOVARA Brain", "Admin / IA", "Registre des routes"],
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

          <p className="mt-3 text-slate-700">
            Registre officiel des routes et accès de l’écosystème NOVARA.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold text-slate-900">
                  Route
                </th>
                <th className="p-4 text-left font-semibold text-slate-900">
                  Module
                </th>
                <th className="p-4 text-left font-semibold text-slate-900">
                  Accès
                </th>
                <th className="p-4 text-left font-semibold text-slate-900">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {routes.map((route) => (
                <tr key={route[0]} className="border-t border-slate-200">
                  <td className="p-4 font-mono text-slate-950">
                    {route[0]}
                  </td>

                  <td className="p-4 text-slate-800">
                    {route[1]}
                  </td>

                  <td className="p-4 text-slate-800">
                    {route[2]}
                  </td>

                  <td className="p-4 text-slate-700">
                    {route[3]}
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
