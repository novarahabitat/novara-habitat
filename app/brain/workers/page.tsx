"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getWorkerRegistry } from "@/lib/brainWorkerRegistryEngine";

export default function BrainWorkersPage() {
  const workers = getWorkerRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA WORKER REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            WORKERS
          </h1>

          <p className="mt-4 text-white/60">
            Registre officiel des workers Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {workers.map((worker) => (
            <div
              key={worker.name}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {worker.name}
                </h2>

                <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-300">
                  {worker.status}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                Fréquence : {worker.frequency}
              </p>

              <p className="mt-2 text-white/60">
                {worker.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
