"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { getBrainHealth } from "@/lib/brainHealthEngine";

export default function BrainHealthPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getBrainHealth();
      setItems(data);
    }

    load();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA BRAIN HEALTH
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            HEALTH
          </h1>

          <p className="mt-4 text-white/60">
            Santé des tables principales du Brain.
          </p>
        </header>

        <div className="grid gap-6">
          {items.map((item) => (
            <div
              key={item.table}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {item.table}
                  </h2>

                  <p className="mt-2 text-white/60">
                    {item.count} entrée(s)
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm ${
                    item.status === "OK"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
