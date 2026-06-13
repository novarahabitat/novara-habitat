"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { createAuditLog } from "@/lib/brainAuditEngine";

export default function BrainAuditPage() {
  const [module, setModule] = useState("Brain");
  const [action, setAction] = useState("");
  const [details, setDetails] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleAudit() {
    if (!action.trim()) return;

    await createAuditLog({
      module,
      action,
      details,
    });

    setAction("");
    setDetails("");
    setSaved(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA AUDIT ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            AUDIT
          </h1>

          <p className="mt-4 text-white/60">
            Journalisation des événements Brain.
          </p>
        </header>

        {saved && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            Audit enregistré.
          </div>
        )}

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <div className="grid gap-4">
            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="Module"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Action"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Détails"
              className="min-h-40 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleAudit}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Enregistrer audit
            </button>
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
