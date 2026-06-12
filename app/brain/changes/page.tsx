"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type ChangeItem = {
  id: string;
  module: string;
  entity_type: string;
  entity_name: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  author: string | null;
  status: string | null;
  created_at: string;
};

export default function BrainChangesPage() {
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChanges() {
      const { data } = await supabase
        .from("brain_changes")
        .select("*")
        .order("created_at", { ascending: false });

      setChanges((data || []) as ChangeItem[]);
      setLoading(false);
    }

    loadChanges();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            CHANGES
          </h1>

          <p className="mt-4 text-white/60">
            Historique central des modifications NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : (
          <div className="space-y-4">
            {changes.map((change) => (
              <div
                key={change.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6"
              >
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {change.module}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {change.action}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {change.entity_name}
                  </span>
                </div>

                <div className="mt-4 text-white">
                  {change.entity_type}
                </div>

                <div className="mt-3 text-sm text-white/50">
                  {change.author || "NOVARA"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
