"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { runNovaraAnalysis } from "@/lib/novaraAnalysis";

export default function BrainAnalysisPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalysis() {
      const analysis = await runNovaraAnalysis();
      setResults(analysis);
      setLoading(false);
    }

    loadAnalysis();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA OPERATIONAL CONSCIOUSNESS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            ANALYSIS
          </h1>

          <p className="mt-4 text-white/60">
            Analyse automatique de l'état du système NOVARA.
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Conclusions automatiques
          </h2>

          {loading ? (
            <p className="mt-6 text-white/60">
              Analyse en cours...
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
                  Aucun problème détecté.
                </div>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200"
                  >
                    {result}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </BrainLayout>
  );
}
