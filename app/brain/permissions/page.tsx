"use client";

import BrainLayout from "@/components/brain/BrainLayout";
import { getPermissionRegistry } from "@/lib/brainPermissionRegistryEngine";

export default function BrainPermissionsPage() {
  const permissions = getPermissionRegistry();

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA PERMISSION REGISTRY
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            PERMISSIONS
          </h1>

          <p className="mt-4 text-white/60">
            Registre des niveaux d'accès NOVARA.
          </p>
        </header>

        <div className="grid gap-6">
          {permissions.map((item) => (
            <div
              key={item.role}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {item.role}
                </h2>

                <span className="rounded-full bg-[#c9a45c]/20 px-4 py-2 text-sm text-[#c9a45c]">
                  LEVEL {item.level}
                </span>
              </div>

              <p className="mt-4 text-white/60">
                Access : {item.access}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
