"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type Decision = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  status: string | null;
  module: string | null;
  created_by: string | null;
};

export default function BrainDecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecisions() {
      const { data } = await supabase
        .from("brain_decisions")
        .select("*")
        .order("created_at", { ascending: false });

      setDecisions((data || []) as Decision[]);
      setLoading(false);
    }

    loadDecisions();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            DECISIONS
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            Registre officiel des décisions validées de l'écosystème NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : decisions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Aucune décision enregistrée.
          </div>
        ) : (
          <div className="space-y-6">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex flex-wrap gap-3">
                  {decision.module && (
                    <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                      {decision.module}
                    </span>
                  )}

                  {decision.status && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {decision.status}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {decision.title}
                </h2>

                {decision.description && (
                  <p className="mt-4 text-white/60">
                    {decision.description}
                  </p>
                )}

                <div className="mt-6 text-sm text-white/40">
                  {decision.created_by || "NOVARA"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
