"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { getRegistry } from "@/lib/brainRegistryEngine";

export default function BrainRegistryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getRegistry();
      setItems(data);
    }

    load();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA REGISTRY ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            REGISTRY
          </h1>

          <p className="mt-4 text-white/60">
            Registre officiel des modules NOVARA connus par Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <h2 className="text-2xl font-semibold text-white">
                {item.name || item.module || "Module sans nom"}
              </h2>

              <p className="mt-4 text-white/60">
                Statut : {item.status || "Non défini"}
              </p>

              <p className="mt-2 text-white/60">
                Progression : {item.progress || 0}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
