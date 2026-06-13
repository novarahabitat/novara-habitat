"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { getImpactedModules } from "@/lib/brainImpactEngine";

export default function BrainImpactPage() {
  const [module, setModule] = useState("CORE");
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function runImpact() {
    const impacted = getImpactedModules(
      module,
      title
    );

    setResults(impacted || []);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA IMPACT ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            IMPACT
          </h1>

          <p className="mt-4 text-white/60">
            Quels modules sont impactés par une décision ?
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <div className="grid gap-4">
            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="Module source"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la décision"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={runImpact}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Analyser impact
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Modules impactés
          </h2>

          <div className="mt-6 grid gap-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 p-4"
              >
                <div className="text-white">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
