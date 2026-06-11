export default function BrainDataModelPage() {
  const entities = [
    {
      domain: "EMPLOYEE",
      table: "employees",
      status: "SOURCE OFFICIELLE",
      description:
        "Table unique pour l'identité employé NOVARA. Toutes les relations utilisent employee_id UUID.",
      rules: [
        "Ne jamais créer workers, staff, crew ou employees_core.",
        "employee_pin est visible uniquement.",
        "employee_id UUID est la clé relationnelle.",
      ],
    },
    {
      domain: "PROPERTY",
      table: "properties",
      status: "SOURCE OFFICIELLE",
      description:
        "Table unique pour les biens immobiliers, logements, maisons, appartements, portefeuilles et propriétés suivies.",
      rules: [
        "Les modules utilisent properties.",
        "Ne pas recréer les biens dans Concierge, Core, SMART ou Habitat.",
        "La mémoire du bien doit survivre au changement de propriétaire.",
      ],
    },
    {
      domain: "WORK",
      table: "projects",
      status: "SOURCE PRINCIPALE",
      description:
        "Table centrale pour les travaux, chantiers, interventions et projets opérationnels.",
      rules: [
        "WORK relie PROPERTY et EMPLOYEE.",
        "Les tâches, photos, notes vocales, rapports et pointages doivent se rattacher au travail concerné.",
      ],
    },
    {
      domain: "SAV",
      table: "sav_tickets",
      status: "SOURCE OFFICIELLE",
      description:
        "Table unique pour les demandes SAV, leur traitement terrain et leur supervision.",
      rules: [
        "Création SAV principalement dans Concierge.",
        "Traitement opérationnel dans Core.",
        "Supervision dans Dynamics HQ.",
      ],
    },
    {
      domain: "GOVERNANCE",
      table: "audit_logs",
      status: "RECOMMANDÉE",
      description:
        "Historique des actions sensibles, modifications importantes et événements de gouvernance.",
      rules: [
        "Toute modification sensible doit être auditée.",
        "Conserver actor, cible, module, action, ancienne valeur, nouvelle valeur et date.",
      ],
    },
    {
      domain: "GOVERNANCE",
      table: "change_requests",
      status: "RECOMMANDÉE",
      description:
        "Gestion des modifications sensibles avec notification, délai de contestation et validation.",
      rules: [
        "Sauvegarde avant modification.",
        "Notification à la personne concernée.",
        "Délai de contestation de 24h.",
      ],
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
            DATA MODEL MASTER
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Constitution technique de NOVARA : tables, sources de vérité,
            relations et règles à respecter avant toute création SQL.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">
            RÈGLE FONDAMENTALE
          </h2>

          <p className="mt-3 text-slate-700">
            Une entité NOVARA ne doit exister qu'une seule fois. Avant de créer
            une nouvelle table Supabase, vérifier si une source officielle existe
            déjà dans ce Data Model Master.
          </p>
        </section>

        <div className="grid gap-6">
          {entities.map((entity) => (
            <section
              key={`${entity.domain}-${entity.table}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase text-white">
                  {entity.domain}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase text-green-800">
                  {entity.status}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-950">
                {entity.table}
              </h2>

              <p className="mt-3 text-slate-700">
                {entity.description}
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">
                  Règles
                </h3>

                <ul className="mt-3 space-y-2 text-slate-700">
                  {entity.rules.map((rule) => (
                    <li key={rule}>• {rule}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
