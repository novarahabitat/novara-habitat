"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { createBrainChange } from "@/lib/brainChangeEngine";

export default function BrainChangeEnginePage() {
  const [module, setModule] = useState("Brain");
  const [entityType, setEntityType] = useState("System");
  const [entityName, setEntityName] = useState("");
  const [action, setAction] = useState("UPDATED");
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleCreateChange() {
    if (!entityName.trim()) return;

    await createBrainChange({
      module,
      entity_type: entityType,
      entity_name: entityName,
      action,
      old_value: oldValue,
      new_value: newValue,
    });

    setEntityName("");
    setOldValue("");
    setNewValue("");
    setSaved(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA CHANGE ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            CHANGE ENGINE
          </h1>

          <p className="mt-4 text-white/60">
            Enregistrer les changements importants dans Brain.
          </p>
        </header>

        {saved && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            Changement enregistré dans Brain.
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
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              placeholder="Type d'entité"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Nom de l'entité"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Action"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={oldValue}
              onChange={(e) => setOldValue(e.target.value)}
              placeholder="Ancienne valeur"
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Nouvelle valeur"
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleCreateChange}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Enregistrer changement
            </button>
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
