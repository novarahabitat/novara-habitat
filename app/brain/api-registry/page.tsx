"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getApiRegistry } from "@/lib/brainApiRegistryEngine";

export default function BrainApiRegistryPage() {
  const apis = getApiRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA API REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            API REGISTRY
          </h1>

          <p className="mt-4 text-white/60">
            Registre des APIs nécessaires à l'exécution autonome NOVARA.
          </p>
        </header>

        <div className="grid gap-6">
          {apis.map((api) => (
            <div
              key={api.name}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {api.name}
                </h2>

                <span
                  className={`rounded-full px-4 py-2 text-sm ${
                    api.status === "CONNECTED"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {api.status}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                Permission : {api.permission}
              </p>

              <p className="mt-2 text-white/60">
                {api.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
