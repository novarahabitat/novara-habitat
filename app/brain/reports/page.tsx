"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type BrainReport = {
  id: string;
  created_at: string;
  module: string | null;
  category: string | null;
  title: string | null;
  content?: string | null;
  status?: string | null;
  created_by?: string | null;
};

export default function BrainReportsPage() {
  const [reports, setReports] = useState<BrainReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("brain_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setReports([]);
        setLoading(false);
        return;
      }

      setReports((data || []) as BrainReport[]);
      setLoading(false);
    }

    loadReports();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            REPORTS
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            Rapports transversaux NOVARA : décisions, synthèses, audits,
            observations terrain et comptes rendus de construction.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6">
            <p className="text-sm text-white/50">Total rapports</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {reports.length}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6">
            <p className="text-sm text-white/50">Modules</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {new Set(reports.map((r) => r.module).filter(Boolean)).size}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6">
            <p className="text-sm text-white/50">Catégories</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {new Set(reports.map((r) => r.category).filter(Boolean)).size}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6">
            <p className="text-sm text-white/50">Statut</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {loading ? "..." : "Actif"}
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement des rapports NOVARA Brain...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
            Erreur Supabase : {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && reports.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Aucun rapport trouvé dans brain_reports.
          </div>
        )}

        {!loading && !errorMessage && reports.length > 0 && (
          <div className="grid gap-6">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full bg-[#c9a45c]/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#c9a45c]">
                        {report.module || "Module non défini"}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                        {report.category || "Catégorie non définie"}
                      </span>

                      {report.status && (
                        <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                          {report.status}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-6 text-3xl font-semibold text-white">
                      {report.title || "Rapport sans titre"}
                    </h2>

                    {report.content && (
                      <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                        {report.content}
                      </p>
                    )}
                  </div>

                  <div className="min-w-fit text-sm text-white/40">
                    {report.created_at
                      ? new Date(report.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "Date inconnue"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
