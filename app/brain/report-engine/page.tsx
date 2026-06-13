"use client";

import { useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { createBrainReport } from "@/lib/brainReportEngine";

export default function BrainReportEnginePage() {
  const [module, setModule] = useState("Dynamics HQ");
  const [category, setCategory] = useState("report");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleCreateReport() {
    if (!title.trim() || !content.trim()) return;

    await createBrainReport({
      module,
      category,
      title,
      content,
    });

    setTitle("");
    setContent("");
    setSaved(true);
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA REPORT ENGINE
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            REPORT ENGINE
          </h1>

          <p className="mt-4 text-white/60">
            Création rapide de rapports Brain.
          </p>
        </header>

        {saved && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 text-green-300">
            Rapport enregistré dans Brain.
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Catégorie"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du rapport"
              className="rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu du rapport"
              className="min-h-48 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            />

            <button
              onClick={handleCreateReport}
              className="rounded-full bg-[#c9a45c] px-6 py-3 font-semibold text-black"
            >
              Créer rapport
            </button>
          </div>
        </section>
      </div>
    </BrainLayout>
  );
}
