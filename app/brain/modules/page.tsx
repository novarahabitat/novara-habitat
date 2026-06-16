import BrainLayout from "@/components/brain/BrainLayout";

const groups = [
  {
    title: "ATHENA",
    description: "Produit principal de NOVARA Dynamics. Operating System of Life.",
    modules: [
      { name: "ATHENA Property", status: "Planned", role: "Mémoire du bien, équipements, garanties, maintenance, SAV." },
      { name: "ATHENA Concierge", status: "Planned", role: "Présence relationnelle, organisation, rappels, coordination." },
      { name: "ATHENA Family", status: "Planned", role: "Organisation familiale, enfants, planning, tâches, temps d’écran." },
      { name: "ATHENA Student", status: "Planned", role: "Études, budget, apprentissage, organisation de vie étudiante." },
      { name: "ATHENA Health", status: "Planned", role: "Données santé privées, bien-être, confidentialité maximale." },
      { name: "ATHENA Life", status: "Planned", role: "Parcours de vie, budget adulte, projets personnels, transitions." },
    ],
  },
  {
    title: "NOVARA Habitat",
    description: "Entreprise terrain : rénovation, clients, chantiers, devis, services.",
    modules: [
      { name: "Public Website", status: "Active", role: "Site vitrine, image de marque, acquisition prospects." },
      { name: "Admin", status: "Active", role: "Direction, supervision, pilotage NOVARA." },
      { name: "Sales", status: "Planned", role: "Leads, devis, rendez-vous, signatures, pipeline commercial." },
      { name: "Core", status: "Planned", role: "Application terrain chantier, employés, photos, rapports, planning." },
      { name: "Client Portal", status: "Planned", role: "Suivi client, documents, progression chantier, validation." },
    ],
  },
  {
    title: "NOVARA Dynamics",
    description: "Société technologique qui porte ATHENA et l’écosystème numérique.",
    modules: [
      { name: "ATHENA Platform", status: "Active", role: "Plateforme produit ATHENA sur novaradynamics.fr." },
      { name: "Brain Governance", status: "Active", role: "Gouvernance centrale hébergée actuellement sur novarahabitat.fr/brain." },
      { name: "Property Passport", status: "Planned", role: "Coffre-fort Habitat, mémoire du bien, transfert propriétaire." },
      { name: "Smart", status: "Planned", role: "Smart home, énergie, contrôle, automatisation." },
      { name: "HARPOCRATE", status: "Dormant", role: "Coffre physique USB-C sécurisé futur." },
    ],
  },
  {
    title: "NOVARA Internal Systems",
    description: "Systèmes internes de gestion entreprise, RH, conformité et opérations.",
    modules: [
      { name: "RH", status: "Planned", role: "Employés, documents, contrats, accès, conformité." },
      { name: "Payroll", status: "Planned", role: "Paie, heures, variables, validation." },
      { name: "Recruitment", status: "Planned", role: "Candidats, création Employee Master ID, onboarding." },
      { name: "Planning", status: "Planned", role: "Calendriers, équipes, chantiers, affectations." },
      { name: "Quality", status: "Planned", role: "Contrôles qualité, satisfaction, standards NOVARA." },
    ],
  },
];

export default function ModulesPage() {
  return (
    <BrainLayout>
      <div className="space-y-10">
        <header>
          <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">
            NOVARA Brain Modules
          </p>

          <h1 className="mt-4 text-6xl font-bold text-white">
            MODULES
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            Organisation officielle des modules NOVARA, ATHENA et systèmes internes.
          </p>
        </header>

        <div className="space-y-8">
          {groups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-[#c9a45c]/20 bg-black/40 p-8"
            >
              <h2 className="text-3xl font-bold text-white">
                {group.title}
              </h2>

              <p className="mt-3 max-w-3xl text-white/60">
                {group.description}
              </p>

              <div className="mt-8 grid gap-4">
                {group.modules.map((module) => (
                  <div
                    key={module.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold text-white">
                        {module.name}
                      </h3>

                      <span className="rounded-full border border-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                        {module.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {module.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
