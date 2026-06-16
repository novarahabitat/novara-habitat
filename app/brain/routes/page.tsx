import BrainLayout from "@/components/brain/BrainLayout";

const routeRegistry = [
  {
    route: "/brain",
    owner: "NOVARA Habitat",
    type: "Brain / Governance",
    status: "Operational",
    description: "Official Brain dashboard. Single governance source for NOVARA + ATHENA.",
    foundationReference: "01 — Source de vérité absolue",
  },
  {
    route: "/brain/foundation",
    owner: "NOVARA Habitat",
    type: "Foundation",
    status: "Validated V1",
    description: "Highest source of truth. No architecture may contradict Foundation.",
    foundationReference: "RÈGLE ABSOLUE",
  },
  {
    route: "/brain/context",
    owner: "NOVARA Habitat",
    type: "Brain / Context",
    status: "Operational",
    description: "Long-term context registry for project continuity.",
    foundationReference: "40 — Development Rule",
  },
  {
    route: "/brain/data-model",
    owner: "NOVARA Habitat",
    type: "Brain / Data Model",
    status: "Operational",
    description: "Official data model registry. Must be checked before creating tables.",
    foundationReference: "40 — Development Rule",
  },
  {
    route: "/brain/routes",
    owner: "NOVARA Habitat",
    type: "Brain / Route Registry",
    status: "Validated V2",
    description: "Official route registry for the NOVARA + ATHENA ecosystem.",
    foundationReference: "40 — Development Rule",
  },
  {
    route: "/brain/decisions",
    owner: "NOVARA Habitat",
    type: "Brain / Decisions",
    status: "Next Priority",
    description: "Official validated decisions registry.",
    foundationReference: "02 — Gouvernance",
  },
  {
    route: "/brain/modules",
    owner: "NOVARA Habitat",
    type: "Brain / Modules",
    status: "Validated V2",
    description: "Official module registry for NOVARA + ATHENA.",
    foundationReference: "39 — Domain Separation Rule",
  },
  {
    route: "/brain/reports",
    owner: "NOVARA Habitat",
    type: "Brain / Reports",
    status: "Planned",
    description: "Session reports, implementation reports and project continuity logs.",
    foundationReference: "40 — Development Rule",
  },
  {
    route: "/brain/registry",
    owner: "NOVARA Habitat",
    type: "Brain / Registry",
    status: "Validated V2",
    description: "Central registry for project systems and architecture references.",
    foundationReference: "01 — Source de vérité absolue",
  },
  {
    route: "/brain/changes",
    owner: "NOVARA Habitat",
    type: "Brain / Changes",
    status: "Planned",
    description: "Future change tracking and governance continuity.",
    foundationReference: "02 — Gouvernance",
  },
  {
    route: "/",
    owner: "NOVARA Habitat",
    type: "Public Website",
    status: "Operational",
    description: "Public NOVARA Habitat website for terrain services and renovation activity.",
    foundationReference: "39 — Domain Separation Rule",
  },
  {
    route: "/connexion",
    owner: "NOVARA Habitat",
    type: "Authentication",
    status: "Operational",
    description: "Login entry for internal and client spaces.",
    foundationReference: "39 — Domain Separation Rule",
  },
  {
    route: "/admin",
    owner: "NOVARA Habitat",
    type: "Internal Management",
    status: "Operational / Evolving",
    description: "Direction and supervision area for NOVARA Habitat operations.",
    foundationReference: "15 — NOVARA Habitat",
  },
  {
    route: "/core",
    owner: "NOVARA Habitat",
    type: "Internal Operations",
    status: "Operational / Evolving",
    description: "Field operations, chantier workflow and employee execution space.",
    foundationReference: "15 — NOVARA Habitat",
  },
  {
    route: "/sales",
    owner: "NOVARA Habitat",
    type: "Commercial Operations",
    status: "Operational / Evolving",
    description: "Sales, leads, quotes and commercial follow-up.",
    foundationReference: "15 — NOVARA Habitat",
  },
  {
    route: "/espace-client",
    owner: "NOVARA Habitat",
    type: "Client Portal",
    status: "Operational / Evolving",
    description: "Client-facing project and service follow-up space.",
    foundationReference: "15 — NOVARA Habitat",
  },
  {
    route: "/property",
    owner: "NOVARA Habitat",
    type: "Property Prototype",
    status: "Legacy / Reference",
    description: "Existing property passport experiment. Must not become a duplicate ATHENA Brain.",
    foundationReference: "08 — Mémoire du bien",
  },
  {
    route: "https://novaradynamics.fr",
    owner: "NOVARA Dynamics",
    type: "ATHENA Product Website",
    status: "Landing V1 Online",
    description: "Official ATHENA product domain. ATHENA lives here.",
    foundationReference: "02 — Gouvernance",
  },
  {
    route: "https://novaradynamics.fr/property",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Property. Equipment, documents, warranties, maintenance, SAV and property memory.",
    foundationReference: "25 — ATHENA Property",
  },
  {
    route: "https://novaradynamics.fr/family",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Family. Household, children, school, tasks and family coordination.",
    foundationReference: "27 — ATHENA Family",
  },
  {
    route: "https://novaradynamics.fr/student",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Student. Study, budget, exams, learning and student life.",
    foundationReference: "28 — ATHENA Student",
  },
  {
    route: "https://novaradynamics.fr/health",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Health. Private health information and secure personal health space.",
    foundationReference: "31 — ATHENA Health",
  },
  {
    route: "https://novaradynamics.fr/life",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Life. Adult life path, goals, budget, projects and transitions.",
    foundationReference: "33 — ATHENA Life",
  },
  {
    route: "https://novaradynamics.fr/concierge",
    owner: "NOVARA Dynamics",
    type: "ATHENA Module",
    status: "Planned",
    description: "ATHENA Concierge. Organization, reminders, scheduling, reservations and coordination.",
    foundationReference: "34 — ATHENA Concierge",
  },
  {
    route: "https://novaradynamics.fr/investors",
    owner: "NOVARA Dynamics",
    type: "Business / Investors",
    status: "Planned",
    description: "Investor-facing ATHENA vision and long-term technology company positioning.",
    foundationReference: "03 — Mission",
  },
  {
    route: "https://novaradynamics.fr/partners",
    owner: "NOVARA Dynamics",
    type: "Business / Partners",
    status: "Planned",
    description: "Future partner ecosystem for real estate, education, energy, insurance and services.",
    foundationReference: "03 — Mission",
  },
];

const stats = [
  { label: "Foundation", value: "Validated V1" },
  { label: "Registry", value: "Validated V2" },
  { label: "Modules", value: "Validated V2" },
  { label: "Routes", value: "Validated V2" },
];

export default function BrainRoutesPage() {
  return (
    <BrainLayout>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Brain
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            ROUTES V2
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Official route registry for the entire NOVARA + ATHENA ecosystem.
            This page protects the One Brain governance model and prevents
            duplicate routes, duplicate systems and duplicate foundations.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-white/50">{item.label}</p>
                <p className="mt-2 text-lg font-medium text-[#d6b36a]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-3xl border border-[#d6b36a]/25 bg-[#d6b36a]/10 p-6">
            <h2 className="text-xl font-semibold text-[#d6b36a]">
              Foundation Rule
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/75">
              Foundation is the highest authority. Before creating any route,
              workflow, table, feature, UI or business decision, Foundation and
              Brain must be checked first. If Foundation and any conversation
              disagree, Foundation wins.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="hidden grid-cols-6 bg-white/[0.06] px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/45 md:grid">
              <div>Route</div>
              <div>Owner</div>
              <div>Type</div>
              <div>Status</div>
              <div>Description</div>
              <div>Foundation Reference</div>
            </div>

            <div className="divide-y divide-white/10">
              {routeRegistry.map((item) => (
                <div
                  key={item.route}
                  className="grid grid-cols-1 gap-4 px-5 py-5 text-sm md:grid-cols-6"
                >
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Route
                    </p>
                    <p className="break-words font-mono text-[#d6b36a]">
                      {item.route}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Owner
                    </p>
                    <p className="text-white/80">{item.owner}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Type
                    </p>
                    <p className="text-white/65">{item.type}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Status
                    </p>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Description
                    </p>
                    <p className="leading-6 text-white/65">{item.description}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35 md:hidden">
                      Foundation Reference
                    </p>
                    <p className="text-white/50">{item.foundationReference}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold">One Brain</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                There is only one Brain: novarahabitat.fr/brain. No ATHENA
                Brain, Dynamics Brain, secondary Brain or duplicate Foundation
                may be created.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold">Domain Separation</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                NOVARA Habitat manages terrain operations. NOVARA Dynamics
                builds ATHENA. ATHENA lives on Dynamics but is governed by the
                Brain hosted on Habitat.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold">Execution Rule</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Before development: read Foundation, check Brain, verify routes,
                verify data model, verify decisions, reuse existing structure,
                then build the minimum functional version.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">NEXT PRIORITIES</h2>

            <ol className="mt-5 space-y-3 text-sm text-white/70">
              <li>1. Decisions V2</li>
              <li>2. Context V2</li>
              <li>3. Reports V2</li>
            </ol>
          </div>
        </div>
      </section>
    </BrainLayout>
  );
}
