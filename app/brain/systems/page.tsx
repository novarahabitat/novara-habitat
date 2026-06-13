"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getSystemRegistry } from "@/lib/brainSystemRegistryEngine";

export default function BrainSystemsPage() {
  const systems = getSystemRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA SYSTEM REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            SYSTEMS
          </h1>

          <p className="mt-4 text-white/60">
            Registre officiel des systèmes connectés à NOVARA Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {systems.map((system) => (
            <div
              key={system.name}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {system.name}
                </h2>

                <span
                  className={`rounded-full px-4 py-2 text-sm ${
                    system.status === "CONNECTED"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {system.status}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                Type : {system.type}
              </p>

              <p className="mt-2 text-white/60">
                {system.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
