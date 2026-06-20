import BrainLayout from "@/components/brain/BrainLayout";

const decisions = [
  {
    id: "DEC-001",
    title: "One Brain Only",
    status: "Validated",
    owner: "NOVARA Habitat / Brain",
    phase: "Foundation V1",
    reason:
      "The ecosystem requires one single source of truth to avoid fragmentation, duplicate governance and conflicting architecture.",
    impact:
      "No ATHENA Brain, Dynamics Brain, secondary Brain, duplicate Foundation or parallel governance system may be created.",
    module: "Brain",
    foundationReference: "01 — Source de vérité absolue / 02 — Gouvernance",
  },
  {
    id: "DEC-002",
    title: "Foundation Is The Highest Authority",
    status: "Validated",
    owner: "NOVARA Habitat / Brain",
    phase: "Foundation V1",
    reason:
      "All future work needs a non-negotiable authority to prevent contradiction between conversations, code, architecture and roadmap.",
    impact:
      "If Foundation and any conversation, proposal, feature, route, table, UI, workflow or business decision disagree, Foundation wins.",
    module: "Foundation",
    foundationReference: "RÈGLE ABSOLUE",
  },
  {
    id: "DEC-003",
    title: "Habitat / Dynamics Separation",
    status: "Validated",
    owner: "NOVARA Habitat / NOVARA Dynamics",
    phase: "Foundation V1",
    reason:
      "NOVARA Habitat and NOVARA Dynamics serve different purposes and must not be merged into one confused product structure.",
    impact:
      "NOVARA Habitat remains focused on terrain operations, renovation, services and Brain governance. NOVARA Dynamics becomes the technology company building ATHENA.",
    module: "Governance",
    foundationReference: "39 — Domain Separation Rule",
  },
  {
    id: "DEC-004",
    title: "ATHENA Belongs To NOVARA Dynamics",
    status: "Validated",
    owner: "NOVARA Dynamics",
    phase: "Foundation V1",
    reason:
      "ATHENA is the product of NOVARA Dynamics and must live on the official Dynamics domain.",
    impact:
      "ATHENA product experience, landing page and future modules belong to novaradynamics.fr, not to a duplicate Habitat product space.",
    module: "ATHENA",
    foundationReference: "02 — Gouvernance / 03 — Mission",
  },
  {
    id: "DEC-005",
    title: "Brain Remains Hosted On NOVARA Habitat",
    status: "Validated",
    owner: "NOVARA Habitat / Brain",
    phase: "Foundation V1",
    reason:
      "The Brain already exists on NOVARA Habitat and is the validated governance system for the entire NOVARA + ATHENA ecosystem.",
    impact:
      "ATHENA is governed by the Brain hosted on novarahabitat.fr/brain. No separate Brain is created on NOVARA Dynamics.",
    module: "Brain",
    foundationReference: "01 — Source de vérité absolue / 02 — Gouvernance",
  },
  {
    id: "DEC-006",
    title: "ATHENA Is The Operating System Of Life",
    status: "Validated",
    owner: "NOVARA Dynamics",
    phase: "Foundation V1",
    reason:
      "ATHENA must not be reduced to a chatbot, dashboard, smart-home panel or productivity app.",
    impact:
      "All ATHENA development must support the long-term mission: helping people manage property, family, learning, health, life and organization through one intelligent environment.",
    module: "ATHENA",
    foundationReference: "03 — Mission",
  },
  {
    id: "DEC-007",
    title: "ATHENA Belongs First To The Household",
    status: "Validated",
    owner: "NOVARA Dynamics",
    phase: "Foundation V1",
    reason:
      "ATHENA must be designed around real life, household continuity and daily usefulness before becoming an abstract personal assistant.",
    impact:
      "ATHENA starts from household needs: property, family, organization, maintenance, planning, documents and shared life coordination.",
    module: "ATHENA Family / ATHENA Property",
    foundationReference: "04 — Household First Principle",
  },
  {
    id: "DEC-008",
    title: "Property Memory Stays With Property",
    status: "Validated",
    owner: "ATHENA Property",
    phase: "Foundation V1",
    reason:
      "A property has a history that must survive owner changes, sale, rental, transfer and long-term maintenance.",
    impact:
      "Property documents, warranties, equipment, maintenance records, repair history and property events remain attached to the property, not only to the current user.",
    module: "ATHENA Property",
    foundationReference: "08 — Mémoire du bien",
  },
  {
    id: "DEC-009",
    title: "Personal Memory Follows Person",
    status: "Validated",
    owner: "ATHENA Life / ATHENA Health",
    phase: "Foundation V1",
    reason:
      "A person’s private history, health, education, goals, preferences and life memory must remain attached to the person, not to a property.",
    impact:
      "Personal memory moves with the individual across homes, family changes, student life, health journeys and long-term personal evolution.",
    module: "ATHENA Life / ATHENA Health / ATHENA Student",
    foundationReference: "09 — Mémoire personnelle",
  },
  {
    id: "DEC-010",
    title: "ATHENA Fragment System",
    status: "Validated",
    owner: "ATHENA",
    phase: "Foundation V1",
    reason:
      "ATHENA must be able to organize life information into modular fragments without breaking the unified Operating System of Life vision.",
    impact:
      "Property, family, student, health, life and concierge information may be structured into fragments while remaining governed by one Brain and one ATHENA ecosystem.",
    module: "ATHENA",
    foundationReference: "Fragment System",
  },
  {
    id: "DEC-011",
    title: "Offline Survival Protocol",
    status: "Validated",
    owner: "ATHENA",
    phase: "Foundation V1",
    reason:
      "ATHENA must not disappear or become useless when connectivity is limited, services are unavailable or critical information is needed offline.",
    impact:
      "Future ATHENA architecture must plan survival modes, local access, critical data availability and continuity for essential user information.",
    module: "ATHENA",
    foundationReference: "Offline Survival Protocol",
  },
  {
    id: "DEC-012",
    title: "HARPOCRATE Dormant",
    status: "Validated",
    owner: "ATHENA / Future Security",
    phase: "Foundation V1",
    reason:
      "HARPOCRATE is strategically important as a future secure vault concept but should not distract from current ATHENA execution priorities.",
    impact:
      "HARPOCRATE remains documented as a dormant future component. It must not be developed before ATHENA foundations and priority modules are validated.",
    module: "Future / Security",
    foundationReference: "HARPOCRATE Dormant Rule",
  },
  {
    id: "DEC-013",
    title: "BrainLayout Required For All Brain Pages",
    status: "Validated",
    owner: "NOVARA Habitat / Brain",
    phase: "Routes V2",
    reason:
      "Brain pages must preserve the official Brain sidebar, navigation, visual consistency and governance structure.",
    impact:
      "All /brain pages must import BrainLayout from '@/components/brain/BrainLayout' and wrap page content inside <BrainLayout>. Standalone min-h-screen root layouts are forbidden for Brain pages.",
    module: "Brain UI / Brain Routes",
    foundationReference: "01 — Source de vérité absolue / 40 — Development Rule",
  },
  {
    id: "DEC-014",
    title: "ATHENA Personal HDN",
    status: "LOCKED",
    owner: "NOVARA Dynamics",
    phase: "2026-06-20 11:30 CET",
    reason:
      "ATHENA is officially defined as a Personal Human-Digital Nexus rather than an AI assistant, chatbot, dashboard or classic app.",
    impact:
      "All future ATHENA development, communication, product architecture and investor storytelling must align with the Personal HDN category.",
    module: "ATHENA HDN",
    foundationReference: "ATHENA HDN Foundation — 2026-06-20",
  },
  {
    id: "DEC-015",
    title: "ATHENA Mission",
    status: "LOCKED",
    owner: "NOVARA Dynamics",
    phase: "2026-06-20 11:35 CET",
    reason:
      "ATHENA requires a simple mission framework to unify all future modules and prevent product fragmentation.",
    impact:
      "ATHENA mission is now defined as: Connect, Protect, Remember, Organize, Grow. Higher mission: reduce the loss of human experience.",
    module: "ATHENA HDN",
    foundationReference: "ATHENA HDN Mission — 2026-06-20",
  },
  {
    id: "DEC-016",
    title: "ATHENA Independent Positioning",
    status: "LOCKED",
    owner: "NOVARA Dynamics / NOVARA Habitat",
    phase: "2026-06-20 11:40 CET",
    reason:
      "ATHENA must not be perceived as a renovation-company side product. It requires independent positioning as a technology developed by NOVARA Dynamics.",
    impact:
      "Public communication must separate NOVARA Habitat from ATHENA. NOVARA Habitat transforms physical habitat. NOVARA Dynamics develops ATHENA.",
    module: "ATHENA / Brand Strategy",
    foundationReference: "ATHENA Positioning — 2026-06-20",
  },
  {
    id: "DEC-017",
    title: "ATHENA Official Slogans",
    status: "LOCKED",
    owner: "NOVARA Dynamics",
    phase: "2026-06-20 11:45 CET",
    reason:
      "ATHENA needs a clear and emotionally understandable public message for early communication, presentations and future pitch documents.",
    impact:
      "Institutional signature: 'L’intelligence et la mémoire de votre habitat.' Emotional hook: 'Enfin, votre maison a une mémoire.'",
    module: "ATHENA / Communication",
    foundationReference: "ATHENA Brand Language — 2026-06-20",
  },
  {
    id: "DEC-018",
    title: "ATHENA / HARPOCRATE Architecture",
    status: "LOCKED",
    owner: "NOVARA Dynamics",
    phase: "2026-06-20 11:50 CET",
    reason:
      "ATHENA and HARPOCRATE must be separated conceptually to distinguish living memory from long-term preservation.",
    impact:
      "ATHENA creates and organizes memory. HARPOCRATE protects its survival. ATHENA HDN enables transmission across time and generations.",
    module: "ATHENA / HARPOCRATE / Legacy",
    foundationReference: "ATHENA Legacy Architecture — 2026-06-20",
  },
  {
    id: "DEC-019",
    title: "Founder Security Strategy",
    status: "Validated",
    owner: "Founder / NOVARA Dynamics",
    phase: "2026-06-20 11:55 CET",
    reason:
      "Critical founder accounts must be protected because GitHub, Supabase, Vercel, OVH and Google are strategic infrastructure for NOVARA and ATHENA.",
    impact:
      "Security roadmap includes YubiKey, password manager, 2FA and stronger protection for GitHub, Google, OVH, Supabase and Vercel.",
    module: "Security / Founder Infrastructure",
    foundationReference: "Founder Security — 2026-06-20",
  },
  {
    id: "DEC-020",
    title: "ATHENA Eurêka Naming",
    status: "LOCKED",
    owner: "NOVARA Dynamics",
    phase: "2026-06-20 12:00 CET",
    reason:
      "ATHENA Education sounds too institutional and cold. ATHENA Eurêka better represents discovery, understanding and the emotional moment of learning.",
    impact:
      "ATHENA Education is officially renamed ATHENA Eurêka. The module covers learning, revision, exercises, Apple Pencil, Learning HDN and guided explanation without cheating.",
    module: "ATHENA Eurêka / Learning HDN",
    foundationReference: "ATHENA Eurêka — 2026-06-20",
  },
];

const stats = [
  { label: "Foundation", value: "Validated V1" },
  { label: "Registry", value: "Validated V2" },
  { label: "Modules", value: "Validated V2" },
  { label: "Routes", value: "Validated V2" },
  { label: "Decisions", value: "Validated V3" },
];

export default function BrainDecisionsPage() {
  return (
    <BrainLayout>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Brain
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            DECISIONS V3
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Official validated decision registry for the NOVARA + ATHENA
            ecosystem. This page preserves strategic continuity and prevents
            contradiction with ATHENA Foundation.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
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
              Foundation is the highest authority. If Foundation and any
              decision disagree, Foundation wins. No architecture, route, table,
              workflow, feature, UI, roadmap or business decision may contradict
              ATHENA Foundation.
            </p>
          </div>

          <div className="space-y-5">
            {decisions.map((decision) => (
              <article
                key={decision.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-sm text-[#d6b36a]">
                      {decision.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {decision.title}
                    </h2>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-[#d6b36a]/25 bg-[#d6b36a]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#d6b36a]">
                    {decision.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Owner
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {decision.owner}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Date / Phase
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {decision.phase}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Related Module
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {decision.module}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Reason
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/65">
                      {decision.reason}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Impact
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/65">
                      {decision.impact}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Foundation Reference
                  </p>
                  <p className="mt-2 text-sm text-[#d6b36a]">
                    {decision.foundationReference}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">NEXT PRIORITIES</h2>

            <ol className="mt-5 space-y-3 text-sm text-white/70">
              <li>1. Context V3 — ATHENA HDN Vision</li>
              <li>2. Modules V3 — ATHENA HDN Modules</li>
              <li>3. Routes V3 — ATHENA / Inventions Brain Routes</li>
              <li>4. ATHENA Core V1 execution after Brain synchronization</li>
            </ol>
          </div>
        </div>
      </section>
    </BrainLayout>
  );
}
