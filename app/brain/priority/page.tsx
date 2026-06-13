"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { getPriorityModules } from "@/lib/brainPriorityEngine";

export default function BrainPriorityPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getPriorityModules();
      setItems(data);
    }

    load();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA PRIORITY ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            PRIORITY
          </h1>

          <p className="mt-4 text-white/60">
            Modules à prioriser selon les tâches restantes.
          </p>
        </header>

        <div className="grid gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c] inline-block">
                PRIORITÉ #{index + 1}
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {item.module || "Module inconnu"}
              </h2>

              <p className="mt-4 text-white/60">
                {item.todoCount} tâche(s) associée(s)
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
