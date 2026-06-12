"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type ContextItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  status: string;
};

export default function BrainContextPage() {
  const [items, setItems] = useState<ContextItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContext() {
      const { data } = await supabase
        .from("brain_context")
        .select("*")
        .order("category");

      setItems((data || []) as ContextItem[]);
      setLoading(false);
    }

    loadContext();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            CONTEXT
          </h1>

          <p className="mt-4 text-white/60">
            Référence officielle des fondations NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {item.category}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {item.status}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {item.title}
                </h2>

                <p className="mt-4 text-white/60">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
