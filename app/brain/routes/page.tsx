"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type RouteItem = {
  id: string;
  route: string;
  module: string;
  access_level: string | null;
  status: string | null;
  description: string | null;
};

export default function BrainRoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      const { data } = await supabase
        .from("brain_routes")
        .select("*")
        .order("route");

      setRoutes((data || []) as RouteItem[]);
      setLoading(false);
    }

    loadRoutes();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            ROUTES
          </h1>

          <p className="mt-4 text-white/60">
            Registre central des routes NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03]">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-4 text-left text-[#c9a45c]">Route</th>
                  <th className="p-4 text-left text-[#c9a45c]">Module</th>
                  <th className="p-4 text-left text-[#c9a45c]">Accès</th>
                  <th className="p-4 text-left text-[#c9a45c]">Statut</th>
                  <th className="p-4 text-left text-[#c9a45c]">Description</th>
                </tr>
              </thead>

              <tbody>
                {routes.map((route) => (
                  <tr
                    key={route.id}
                    className="border-b border-white/5"
                  >
                    <td className="p-4 font-mono text-white">
                      {route.route}
                    </td>

                    <td className="p-4 text-white/70">
                      {route.module}
                    </td>

                    <td className="p-4 text-white/70">
                      {route.access_level}
                    </td>

                    <td className="p-4 text-white/70">
                      {route.status}
                    </td>

                    <td className="p-4 text-white/60">
                      {route.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
