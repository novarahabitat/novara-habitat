"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">
              NOVARA Brain
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-6xl">
              Reports
            </h1>

            <p className="mt-6 max-w-2xl text-white/60">
              Centre de lecture des rapports transversaux NOVARA Brain :
              décisions, synthèses, audits, observations terrain et rapports de
              construction.
            </p>
          </div>

          <Link
            href="/brain"
            className="rounded-full border border-[#c9a45c]/50 px-6 py-3 text-sm font-medium text-[#c9a45c] transition hover:bg-[#c9a45c] hover:text-black"
          >
            Retour Brain
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Total rapports</p>
            <p className="mt-3 text-3xl font-semibold">{reports.length}</p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Modules</p>
            <p className="mt-3 text-3xl font-semibold">
              {new Set(reports.map((r) => r.module).filter(Boolean)).size}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Catégories</p>
            <p className="mt-3 text-3xl font-semibold">
              {new Set(reports.map((r) => r.category).filter(Boolean)).size}
            </p>
          </div>

          <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Statut</p>
            <p className="mt-3 text-3xl font-semibold">
              {loading ? "..." : "Actif"}
            </p>
          </div>
        </div>

        <div className="mt-12">
          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/60">
              Chargement des rapports NOVARA Brain...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
              Erreur Supabase : {errorMessage}
            </div>
          )}

          {!loading && !errorMessage && reports.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/60">
              Aucun rapport trouvé dans brain_reports.
            </div>
          )}

          {!loading && !errorMessage && reports.length > 0 && (
            <div className="grid gap-6">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:border-[#c9a45c]/40 hover:bg-white/[0.06]"
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

                      <h2 className="mt-6 text-3xl font-semibold">
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
      </section>
    </main>
  );
}
