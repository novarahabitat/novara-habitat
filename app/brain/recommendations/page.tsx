"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { generateBrainInsights } from "@/lib/brainInsightsEngine";

export default function BrainRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await generateBrainInsights();
      setRecommendations(data);
    }

    load();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA RECOMMENDATION ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            RECOMMENDATIONS
          </h1>

          <p className="mt-4 text-white/60">
            Actions recommandées automatiquement par le Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {recommendations.map((item, index) => (
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
