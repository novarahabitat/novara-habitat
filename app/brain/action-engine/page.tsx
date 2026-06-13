"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { createExecutionRequest } from "@/lib/brainActionEngine";

export default function BrainActionEnginePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceModule, setSourceModule] = useState("Dynamics HQ");
  const [targetSystem, setTargetSystem] = useState("Supabase");
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [saved, setSaved] = useState(false);

  async function handleCreateRequest() {
    if (!title.trim()) return;

    await createExecutionRequest({
      title,
      description,
      source_module: sourceModule,
      target_system: targetSystem,
      risk_level: riskLevel,
    });

    setTitle("");
    setDescription("");
    setSaved(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA ACTION ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            ACTION ENGINE
          </h1>

          <p className="mt-4 text-white/60">
            Créer une demande d'action à valider avant exécution.
          </p>
        </header>

        {saved && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            Demande envoyée vers Execution.
          </div>
        )}

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <div className="grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'action"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="min-h-40 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={sourceModule}
              onChange={(e) => setSourceModule(e.target.value)}
              placeholder="Module source"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={targetSystem}
              onChange={(e) => setTargetSystem(e.target.value)}
              placeholder="Système cible"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              placeholder="Niveau de risque"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleCreateRequest}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Créer demande d'action
            </button>
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
