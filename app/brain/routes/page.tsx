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
      module: "Brain",
      access: "Admin",
      description: "Centre de connaissance",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          ROUTE REGISTRY
        </h1>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
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
                <tr key={route.route} className="border-t">
                  <td className="p-4 font-mono">
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
