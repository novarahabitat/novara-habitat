"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { evaluateImpact } from "@/lib/novaraConsciousness";

export default function ConsciousnessPage() {
  const [module, setModule] = useState("RH");
  const [title, setTitle] = useState("Nouvelle décision");
  const impacts = evaluateImpact({
    sourceModule: module,
    eventType: "decision",
    title,
  });

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA OPERATIONAL CONSCIOUSNESS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            CONSCIOUSNESS
          </h1>

          <p className="mt-4 text-white/60">
            Première couche de réflexion transversale NOVARA.
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Test d'impact
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
              placeholder="Module source"
            />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
              placeholder="Titre de l'événement"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Impacts détectés
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {impacts.length === 0 ? (
              <p className="text-white/60">
                Aucun impact détecté.
              </p>
            ) : (
              impacts.map((impact) => (
                <span
                  key={impact}
                  className="rounded-full bg-[#c9a45c]/20 px-4 py-2 text-[#c9a45c]"
                >
                  {impact}
                </span>
              ))
            )}
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
