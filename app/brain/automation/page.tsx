"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { dailyBrainCycle } from "@/lib/brainAutomationEngine";

export default function BrainAutomationPage() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function runCycle() {
    setRunning(true);
    setDone(false);

    await dailyBrainCycle();

    setRunning(false);
    setDone(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA AUTOMATION ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            AUTOMATION
          </h1>

          <p className="mt-4 text-white/60">
            Exécution manuelle d'un cycle automatique Brain.
          </p>
        </header>

        {done && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            Cycle Brain exécuté. Rapport créé et demande d'action envoyée vers Execution.
          </div>
        )}

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Cycle automatique
          </h2>

          <p className="mt-4 text-white/60">
            Lance un cycle Brain : création rapport + demande d'exécution.
          </p>

          <button
            onClick={runCycle}
            disabled={running}
            className="mt-6 rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {running ? "Cycle en cours..." : "Lancer cycle Brain"}
          </button>
        </section>
      </div>
    </BrainLayout>
  );
}
