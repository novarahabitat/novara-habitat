export default function ProjectDetailPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-6 text-white">
      <p className="text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
        NOVARA Core
      </p>

      <h1 className="mt-3 text-3xl font-semibold">
        Fiche Chantier
      </h1>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <h2 className="text-xl font-semibold">
          Client démonstration
        </h2>

        <p className="mt-2 text-white/60">
          12 rue Exemple
        </p>

        <p className="mt-1 text-white/60">
          24000 Périgueux
        </p>

        <p className="mt-4 text-white/60">
          Téléphone : 06 00 00 00 00
        </p>

        <p className="text-white/60">
          contact@client.fr
        </p>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <div className="flex justify-between">
          <span>Progression</span>
          <span>35%</span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#c8a45d]"
            style={{ width: "35%" }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          📸 Photos
        </button>

        <button className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          🎙️ Rapport
        </button>

        <button className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          📄 Documents
        </button>

        <button className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          🛠 SAV
        </button>
      </div>
    </main>
  );
}
