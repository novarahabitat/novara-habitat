"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

export default function BrainPage() {
  const [reports, setReports] = useState(0);
  const [decisions, setDecisions] = useState(0);
  const [modules, setModules] = useState(0);
  const [changes, setChanges] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const reportsResult = await supabase
        .from("brain_reports")
        .select("*", { count: "exact", head: true });

      const decisionsResult = await supabase
        .from("brain_decisions")
        .select("*", { count: "exact", head: true });

      const modulesResult = await supabase
        .from("brain_modules")
        .select("*", { count: "exact", head: true });

      const changesResult = await supabase
        .from("brain_changes")
        .select("*", { count: "exact", head: true });

      const activityResult = await supabase
        .from("brain_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      setReports(reportsResult.count || 0);
      setDecisions(decisionsResult.count || 0);
      setModules(modulesResult.count || 0);
      setChanges(changesResult.count || 0);
      setActivities(activityResult.data || []);
    }

    loadData();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            NOVARA BRAIN
          </h1>

          <p className="mt-4 text-white/60">
            Centre de coordination, de connaissance et de pilotage NOVARA.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
            <p className="text-white/50">Décisions</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {decisions}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
            <p className="text-white/50">Rapports</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {reports}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
            <p className="text-white/50">Modules</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {modules}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
            <p className="text-white/50">Changes</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {changes}
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Activité récente
            </h2>

            <span className="rounded-full bg-[#c9a45c]/20 px-4 py-2 text-sm text-[#c9a45c]">
              {activities.length} événements
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {activity.module}
                  </span>

                  <span className="text-white font-medium">
                    {activity.action}
                  </span>
                </div>

                {activity.details && (
                  <p className="mt-2 text-white/60">
                    {activity.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
