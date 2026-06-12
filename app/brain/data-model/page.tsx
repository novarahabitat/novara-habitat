import BrainLayout from "@/components/brain/BrainLayout";

export default function BrainDataModelPage() {
  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            DATA MODEL
          </h1>

          <p className="mt-4 text-white/60">
            Constitution technique NOVARA : tables, sources de vérité et règles.
          </p>
        </header>

        <section className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">
            Règle fondamentale
          </h2>
          <p className="mt-4 text-white/60">
            Une entité NOVARA ne doit exister qu’une seule fois. Avant de créer une table,
            vérifier si une source officielle existe déjà.
          </p>
        </section>

        <div className="grid gap-6">
          {[
            ["EMPLOYEE", "employees", "Source officielle des employés. Toutes les relations utilisent employee_id UUID."],
            ["PROPERTY", "properties", "Source officielle des biens et propriétés."],
            ["WORK", "projects", "Source principale des travaux, chantiers et projets."],
            ["SAV", "sav_tickets", "Source officielle des demandes SAV."],
            ["BRAIN", "brain_reports", "Mémoire des rapports NOVARA."],
            ["BRAIN", "brain_decisions", "Mémoire des décisions NOVARA."],
          ].map(([domain, table, desc]) => (
            <section
              key={table}
              className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8"
            >
              <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                {domain}
              </span>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {table}
              </h2>

              <p className="mt-4 text-white/60">
                {desc}
              </p>
            </section>
          ))}
        </div>
      </div>
    </BrainLayout>
  );
}
