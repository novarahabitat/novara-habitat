export default function BrainPage() {
  const modules = [
    { name: "Habitat", status: "En développement", progress: 75 },
    { name: "Core", status: "En développement", progress: 40 },
    { name: "RH", status: "En développement", progress: 30 },
    { name: "Dynamics", status: "Conception", progress: 25 },
    { name: "Concierge", status: "Conception", progress: 10 },
    { name: "SMART", status: "Conception", progress: 10 },
    { name: "Payroll", status: "Conception", progress: 5 },
  ];

  const truths = [
    "employees",
    "properties",
    "projects",
    "sav_tickets",
  ];

  const decisions = [
    "1 Employee = 1 Employee Master ID = 1 employee_id UUID",
    "employee_pin = identité visible uniquement",
    "Toutes les relations utilisent employee_id",
    "Property = source de vérité unique pour les biens",
    "SAV Creation → Concierge",
    "SAV Operations → Core",
    "SAV Supervision → Dynamics",
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            NOVARA Project Brain
          </h1>
          <p className="mt-2 text-slate-600">
            Référentiel central de connaissance de l'écosystème NOVARA.
          </p>
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Foundation
          </h2>

          <div className="mt-4">
            <p>
              Version : <strong>Foundation 1.0</strong>
            </p>
            <p>
              Statut : <strong>FROZEN</strong>
            </p>
          </div>

          <div className="mt-4">
            <ul className="list-disc pl-5">
              <li>Employee Domain</li>
              <li>Property Domain</li>
              <li>Work Domain</li>
              <li>Party (Under Investigation)</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Sources de vérité
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {truths.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Décisions validées
          </h2>

          <ul className="mt-4 space-y-2">
            {decisions.map((decision) => (
              <li key={decision}>
                • {decision}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Modules NOVARA
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Module</th>
                  <th className="p-3 text-left">Statut</th>
                  <th className="p-3 text-left">Progression</th>
                </tr>
              </thead>

              <tbody>
                {modules.map((module) => (
                  <tr key={module.name} className="border-t">
                    <td className="p-3">{module.name}</td>
                    <td className="p-3">{module.status}</td>
                    <td className="p-3">{module.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Prochaine priorité
          </h2>

          <p className="mt-4">
            Construire le Data Model Master et le Module Registry.
          </p>
        </section>
      </div>
    </div>
  );
}
