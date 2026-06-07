import ProjectCard from "@/components/core/ProjectCard";

export default function CoreChantierPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 pb-28 pt-6 text-white">
      <p className="text-xs uppercase tracking-[0.35em] text-[#c8a45d]">
        NOVARA Core
      </p>

      <h1 className="mt-3 text-3xl font-semibold">Chantiers</h1>

      <p className="mt-2 text-sm text-white/60">
        Liste terrain des chantiers NOVARA.
      </p>

      <div className="mt-6 space-y-4">
        <ProjectCard
          client="Client démonstration"
          address="12 rue Exemple, 24000 Périgueux"
          status="Actif"
          progress={35}
        />
      </div>
    </main>
  );
}
