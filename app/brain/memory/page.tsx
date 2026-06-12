"use client";

import BrainLayout from "@/components/brain/BrainLayout";

export default function BrainMemoryPage() {
  const memoryStats = [
    {
      title: "Brain Reports",
      value: "Mémoire des rapports",
    },
    {
      title: "Brain Decisions",
      value: "Mémoire des décisions",
    },
    {
      title: "Brain Modules",
      value: "Mémoire des modules",
    },
    {
      title: "Brain Changes",
      value: "Mémoire des changements",
    },
    {
      title: "Brain Activity",
      value: "Mémoire des activités",
    },
    {
      title: "Brain Todos",
      value: "Mémoire des tâches",
    },
  ];

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA LONG TERM MEMORY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            MEMORY
          </h1>

          <p className="mt-4 text-white/60">
            Centre de mémoire persistante de NOVARA.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {memoryStats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <h2 className="text-2xl font-semibold text-white">
                {item.title}
              </h2>

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
