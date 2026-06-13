"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import {
  createBrainDecision,
  getLatestDecisions,
} from "@/lib/brainDecisionEngine";

export default function BrainDecisionEnginePage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("Dynamics HQ");

  async function loadDecisions() {
    const data = await getLatestDecisions();
    setDecisions(data);
  }

  useEffect(() => {
    loadDecisions();
  }, []);

  async function handleCreateDecision() {
    if (!title.trim()) return;

    await createBrainDecision(title, description, module);

    setTitle("");
    setDescription("");
    setModule("Dynamics HQ");

    await loadDecisions();
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA DECISION ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            DECISION ENGINE
          </h1>

          <p className="mt-4 text-white/60">
            Création et consultation rapide des décisions structurantes NOVARA.
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Nouvelle décision
          </h2>

          <div className="mt-6 grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la décision"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="min-h-32 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="Module"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleCreateDecision}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Créer décision
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Dernières décisions
          </h2>

          <div className="mt-6 grid gap-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="rounded-2xl border border-white/10 p-4"
              >
                <div className="text-sm text-[#c9a45c]">
                  {decision.module}
                </div>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  {decision.title}
                </h3>

                {decision.description && (
                  <p className="mt-2 text-white/60">
                    {decision.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
