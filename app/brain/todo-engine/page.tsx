"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { createBrainTodo } from "@/lib/brainTodoEngine";

export default function BrainTodoEnginePage() {
  const [module, setModule] = useState("Brain");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("Vital");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleCreateTodo() {
    if (!title.trim()) return;

    await createBrainTodo({
      module,
      title,
      priority,
      assigned_to: assignedTo,
      notes,
    });

    setTitle("");
    setNotes("");
    setSaved(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA TODO ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            TODO ENGINE
          </h1>

          <p className="mt-4 text-white/60">
            Création rapide de tâches Brain.
          </p>
        </header>

        {saved && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            TODO enregistré dans Brain.
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Priorité"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Assigné à"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              className="min-h-36 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleCreateTodo}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Créer TODO
            </button>
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
