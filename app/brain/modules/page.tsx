"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type BrainModule = {
  id: string;
  module: string;
  status: string | null;
  progress: number | null;
  completed: string | null;
  in_progress: string | null;
  blockers: string | null;
};

export default function BrainModulesPage() {
  const [modules, setModules] = useState<BrainModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModules() {
      const { data } = await supabase
        .from("brain_modules")
        .select("*")
        .order("module");

      setModules((data || []) as BrainModule[]);
      setLoading(false);
    }

    loadModules();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            MODULES
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            Vue globale de l'avancement des modules NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : modules.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Aucun module enregistré.
          </div>
        ) : (
          <div className="grid gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">
                    {module.module}
                  </h2>

                  <span className="rounded-full bg-[#c9a45c]/20 px-4 py-2 text-sm text-[#c9a45c]">
                    {module.progress || 0}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#c9a45c]"
                    style={{
                      width: `${module.progress || 0}%`,
                    }}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-green-400">
                      TERMINÉ
                    </h3>

                    <p className="mt-2 text-white/60">
                      {module.completed || "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-yellow-400">
                      EN COURS
                    </h3>

                    <p className="mt-2 text-white/60">
                      {module.in_progress || "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-400">
                      BLOCAGES
                    </h3>

                    <p className="mt-2 text-white/60">
                      {module.blockers || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
