"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { runBrainAutoAnalysis } from "@/lib/brainAutoAnalysis";

export default function BrainAutoPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await runBrainAutoAnalysis();
      setResults(data);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA AUTONOMOUS BRAIN
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            AUTO ANALYSIS
          </h1>

          <p className="mt-4 text-white/60">
            Conclusions générées automatiquement par le Brain.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Analyse automatique en cours...
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {item.severity}
                  </span>

                  <span className="text-white/50 text-sm">
                    {item.source}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {item.title}
                </h2>

                <p className="mt-4 text-white/60">
                  {item.conclusion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
