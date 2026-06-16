import BrainLayout from "@/components/brain/BrainLayout";

const statusCards = [
  { label: "Foundation", value: "Validated V1" },
  { label: "Registry", value: "Validated V2" },
  { label: "Modules", value: "Validated V2" },
  { label: "Routes", value: "Validated V2" },
  { label: "Decisions", value: "Validated V2" },
  { label: "Context", value: "Validated V2" },
];

const contextSections = [
  {
    title: "Current Mission",
    items: [
      "Create the Operating System of Life.",
      "ATHENA is the product.",
      "NOVARA Dynamics is the company building ATHENA.",
      "NOVARA Habitat remains the operational terrain company and the host of the official Brain.",
      "The Brain hosted on NOVARA Habitat governs the full NOVARA + ATHENA ecosystem.",
    ],
  },
  {
    title: "Current Priorities",
    items: [
      "Complete Brain Phase before ATHENA product execution.",
      "Maintain Foundation as the highest authority.",
      "Preserve One Brain governance.",
      "Finish Context V2, then Reports V2.",
      "After Brain Phase validation, move to ATHENA Landing V2 execution.",
    ],
  },
  {
    title: "Active Systems",
    items: [
      "NOVARA Habitat public website.",
      "NOVARA Habitat Brain.",
      "ATHENA Foundation.",
      "Brain Registry V2.",
      "Brain Modules V2.",
      "Brain Routes V2.",
      "Brain Decisions V2.",
      "NOVARA Dynamics public domain with ATHENA Landing V1 online.",
    ],
  },
  {
    title: "Planned Systems",
    items: [
      "ATHENA Landing V2.",
      "ATHENA Property MVP.",
      "ATHENA Concierge.",
      "ATHENA Family.",
      "ATHENA Student.",
      "ATHENA Health.",
      "ATHENA Life.",
      "Brain Reports V2.",
      "Future Supabase-backed ATHENA systems.",
    ],
  },
  {
    title: "Validated Architecture",
    items: [
      "There is only one Brain.",
      "Foundation is the highest authority.",
      "Brain is hosted on NOVARA Habitat.",
      "ATHENA lives on NOVARA Dynamics.",
      "NOVARA Habitat and NOVARA Dynamics are separated domains with separated responsibilities.",
      "ATHENA is the Operating System of Life.",
      "ATHENA belongs first to the household.",
      "Property memory stays with the property.",
      "Personal memory follows the person.",
      "BrainLayout is required for all Brain pages.",
    ],
  },
  {
    title: "Infrastructure Status",
    items: [
      "GitHub operational.",
      "Vercel operational.",
      "OVH domains operational.",
      "SSL operational.",
      "novarahabitat.fr operational.",
      "novarahabitat.fr/brain operational.",
      "novarahabitat.fr/brain/foundation operational.",
      "novaradynamics.fr operational.",
      "Automatic GitHub to Vercel deployment operational.",
    ],
  },
  {
    title: "ATHENA Status",
    items: [
      "ATHENA Foundation validated.",
      "ATHENA Landing V1 online.",
      "ATHENA Landing V2 not started.",
      "ATHENA Property MVP not started.",
      "ATHENA Concierge not started.",
      "ATHENA Family not started.",
      "ATHENA Student not started.",
      "ATHENA Health not started.",
      "ATHENA Life planned.",
      "ATHENA Fragment System validated.",
      "Offline Survival Protocol validated.",
      "HARPOCRATE dormant.",
    ],
  },
  {
    title: "NOVARA Habitat Status",
    items: [
      "NOVARA Habitat remains the operational renovation and terrain services company.",
      "NOVARA Habitat hosts the official Brain.",
      "NOVARA Habitat keeps the governance source of truth.",
      "Existing Habitat routes remain operational references.",
      "Habitat must not become a duplicate ATHENA product.",
      "Property prototype on Habitat remains legacy/reference and must not create duplicate governance.",
    ],
  },
  {
    title: "NOVARA Dynamics Status",
    items: [
      "NOVARA Dynamics is the technology company building ATHENA.",
      "ATHENA lives on novaradynamics.fr.",
      "Dynamics public domain is operational.",
      "Landing V1 is online.",
      "Landing V2 is the next product execution priority after Brain Phase completion.",
      "Dynamics must not create a second Brain.",
    ],
  },
  {
    title: "Brain Status",
    items: [
      "Brain is the official single source of truth.",
      "Foundation V1 validated.",
      "Registry V2 validated.",
      "Modules V2 validated.",
      "Routes V2 validated.",
      "Decisions V2 validated.",
      "Context V2 in progress.",
      "Reports V2 next.",
      "All Brain pages must use BrainLayout.",
    ],
  },
  {
    title: "Next Priorities",
    items: [
      "Validate Context V2.",
      "Create Reports V2.",
      "Confirm Brain Phase complete.",
      "Start ATHENA Landing V2.",
      "Then build ATHENA Property MVP.",
      "Then proceed with ATHENA Concierge, Family, Student and Health in validated priority order.",
    ],
  },
];

const keyRules = [
  "Before any development, read Foundation first.",
  "Then read Brain: context, data model, routes and decisions.",
  "If Foundation and any conversation disagree, Foundation wins.",
  "Do not create duplicate Brain systems.",
  "Do not create architecture without checking Brain first.",
  "Use complete file replacements only.",
  "Build minimum functional versions before expanding.",
];

export default function BrainContextPage() {
  return (
    <BrainLayout>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Brain
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            CONTEXT V2
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Official current-state registry for the NOVARA + ATHENA ecosystem.
            A future chat must be able to understand the project status by
            reading this page.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {statusCards.map((item) => (
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
              Context Rule
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/75">
              Context V2 is the official current-state registry. It does not
              replace Foundation. Foundation remains the highest authority.
              Context explains what is currently validated, active, planned and
              next.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Mandatory Rules</h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {keyRules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {contextSections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {section.title}
                </h2>

                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-7 text-white/65"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6b36a]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">NEXT PRIORITIES</h2>

            <ol className="mt-5 space-y-3 text-sm text-white/70">
              <li>1. Validate Context V2</li>
              <li>2. Create Reports V2</li>
              <li>3. Confirm Brain Phase complete</li>
              <li>4. Start ATHENA Landing V2 execution</li>
              <li>5. Build ATHENA Property MVP</li>
            </ol>
          </div>
        </div>
      </section>
    </BrainLayout>
  );
}
