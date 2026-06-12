"use client";

import BrainLayout from "@/components/brain/BrainLayout";

export default function BrainInsightsPage() {
  const insights = [
    {
      priority: "HIGH",
      title: "Connecter Core au Brain",
      description:
        "Le module Core existe mais n'écrit pas encore automatiquement dans Brain.",
    },
    {
      priority: "HIGH",
      title: "Synchronisation automatique",
      description:
        "Les décisions importantes doivent alimenter brain_decisions automatiquement.",
    },
    {
      priority: "MEDIUM",
      title: "Cartographie des modules",
      description:
        "Compléter les relations entre Core, RH, Payroll, Property, Smart et Voltis.",
    },
    {
      priority: "MEDIUM",
      title: "Conscience opérationnelle",
      description:
        "Étendre les règles d'impact et de raisonnement du moteur Consciousness.",
    },
  ];

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA STRATEGIC INSIGHTS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            INSIGHTS
          </h1>

          <p className="mt-4 text-white/60">
            Recommandations prioritaires du Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {insights.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                  {item.priority}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h2>

              <p className="mt-4 text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
