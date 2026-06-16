"use client";

const registry = [
  {
    id: "BRAIN",
    type: "SYSTEM",
    status: "ACTIVE",
    owner: "NOVARA",
    description: "Official Source of Truth",
  },
  {
    id: "FOUNDATION",
    type: "SYSTEM",
    status: "ACTIVE",
    owner: "BRAIN",
    description: "Highest Governance Layer",
  },
  {
    id: "NOVARA_DYNAMICS",
    type: "COMPANY",
    status: "ACTIVE",
    owner: "NOVARA",
    description: "Company building ATHENA",
  },
  {
    id: "ATHENA",
    type: "PRODUCT",
    status: "PLANNED",
    owner: "NOVARA_DYNAMICS",
    description: "Operating System of Life",
  },
  {
    id: "ATHENA_PROPERTY",
    type: "MODULE",
    status: "PLANNED",
    owner: "ATHENA",
    description: "Property Memory System",
  },
  {
    id: "ATHENA_FAMILY",
    type: "MODULE",
    status: "PLANNED",
    owner: "ATHENA",
    description: "Family Coordination System",
  },
  {
    id: "ATHENA_STUDENT",
    type: "MODULE",
    status: "PLANNED",
    owner: "ATHENA",
    description: "Learning Companion",
  },
  {
    id: "ATHENA_HEALTH",
    type: "MODULE",
    status: "PLANNED",
    owner: "ATHENA",
    description: "Private Health Vault",
  },
  {
    id: "ATHENA_CONCIERGE",
    type: "MODULE",
    status: "PLANNED",
    owner: "ATHENA",
    description: "Daily Life Coordination",
  },
  {
    id: "ATHENA_BRAIN",
    type: "SYSTEM",
    status: "REJECTED",
    owner: "NONE",
    description: "Duplicate Brain prohibited by Foundation",
  },
];

export default function RegistryPage() {
  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">
          NOVARA Registry Engine
        </p>

        <h1 className="mt-4 text-6xl font-bold text-white">REGISTRY</h1>

        <p className="mt-4 max-w-3xl text-white/60">
          Official registry of all systems, modules and entities known by Brain.
        </p>
      </div>

      <div className="grid gap-4">
        {registry.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-[#c9a45c]/20 bg-black/40 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{item.id}</h2>

              <span className="rounded-full border border-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                {item.status}
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-white/70">
              <p>Type: {item.type}</p>
              <p>Owner: {item.owner}</p>
              <p>Description: {item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
