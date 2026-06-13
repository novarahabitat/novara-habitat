"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getAutomationRegistry } from "@/lib/brainAutomationRegistryEngine";

export default function BrainAutomationRegistryPage() {
  const automations = getAutomationRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA AUTOMATION REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            AUTOMATION REGISTRY
          </h1>

          <p className="mt-4 text-white/60">
            Registre officiel des automatisations futures du Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {automations.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {item.name}
                </h2>

                <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-300">
                  {item.status}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                Trigger : {item.trigger}
              </p>

              <p className="mt-2 text-white/60">
                Target : {item.target}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
