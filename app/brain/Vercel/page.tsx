"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getVercelRegistry } from "@/lib/brainVercelRegistryEngine";

export default function BrainVercelPage() {
  const items = getVercelRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA VERCEL REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            VERCEL
          </h1>

          <p className="mt-4 text-white/60">
            Registre des ressources Vercel connues par NOVARA Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {items.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {item.name}
                </h2>

                <span
                  className={`rounded-full px-4 py-2 text-sm ${
                    item.status === "CONNECTED"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
