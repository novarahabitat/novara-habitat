"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import {
  getPendingExecutions,
  approveExecution,
  rejectExecution,
} from "@/lib/brainExecutionEngine";

export default function BrainExecutionPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    const data = await getPendingExecutions();
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleApprove(id: string) {
    await approveExecution(id, "Vital");
    await loadRequests();
  }

  async function handleReject(id: string) {
    await rejectExecution(id, "Vital");
    await loadRequests();
  }

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA EXECUTION LAYER
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            EXECUTION
          </h1>

          <p className="mt-4 text-white/60">
            Demandes d'action proposées par le Brain avant exécution.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-8 text-green-300">
            Aucune demande d'exécution en attente.
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
              >
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {request.target_system || "SYSTEM"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {request.risk_level || "LOW"}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {request.status}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {request.title}
                </h2>

                {request.description && (
                  <p className="mt-4 text-white/60">
                    {request.description}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="rounded-full bg-[#c9a45c] px-5 py-2 text-sm font-semibold text-black"
                  >
                    Approuver
                  </button>

                  <button
                    onClick={() => handleReject(request.id)}
                    className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/70"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
