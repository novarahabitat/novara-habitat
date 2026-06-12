"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type SyncRule = {
  id: string;
  module: string;
  sync_target: string;
  active: boolean | null;
};

export default function BrainSyncPage() {
  const [rules, setRules] = useState<SyncRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRules() {
      const { data } = await supabase
        .from("brain_sync_rules")
        .select("*")
        .order("module");

      setRules((data || []) as SyncRule[]);
      setLoading(false);
    }

    loadRules();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            SYNC CENTER
          </h1>

          <p className="mt-4 text-white/60">
            Centre de synchronisation entre les modules NOVARA et le Brain.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {rule.module}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {rule.sync_target}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {rule.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
