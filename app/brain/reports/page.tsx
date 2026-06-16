import BrainLayout from "@/components/brain/BrainLayout";

const reports = [
  {
    id: "REP-001",
    date: "Brain Phase / Foundation V1",
    module: "Foundation",
    status: "Validated",
    completed: [
      "ATHENA Foundation V1 established.",
      "Foundation confirmed as the highest authority.",
      "One Brain governance validated.",
      "NOVARA Habitat / NOVARA Dynamics separation validated.",
      "ATHENA mission validated as the Operating System of Life.",
    ],
    inProgress: [
      "Foundation remains active as the permanent authority for all future work.",
    ],
    nextActions: [
      "Check Foundation before every architecture, route, table, workflow, UI, roadmap or business decision.",
      "Reject any proposal that contradicts Foundation.",
    ],
    risks: [
      "Future conversations may contradict Foundation if the Brain is not checked first.",
      "Duplicate governance systems may appear if One Brain rule is ignored.",
    ],
    foundationImpact:
      "Foundation V1 became the non-negotiable authority for the entire NOVARA + ATHENA ecosystem.",
  },
  {
    id: "REP-002",
    date: "Brain Phase / Registry V2",
    module: "Registry",
    status: "Validated",
    completed: [
      "Registry V2 validated as a central system reference.",
      "Registry positioned as part of the single Brain.",
      "Registry aligned with Foundation and One Brain governance.",
    ],
    inProgress: [
      "Registry must remain synchronized with modules, routes, decisions, context and reports.",
    ],
    nextActions: [
      "Use Registry as a reference when checking existing systems.",
      "Avoid creating new systems that duplicate Registry entries.",
    ],
    risks: [
      "Registry may become outdated if future changes are not documented.",
      "Parallel registries may create confusion if the One Brain rule is ignored.",
    ],
    foundationImpact:
      "Registry V2 supports Foundation by documenting existing systems and reducing architectural duplication.",
  },
  {
    id: "REP-003",
    date: "Brain Phase / Modules V2",
    module: "Modules",
    status: "Validated",
    completed: [
      "Modules V2 validated as the official module registry.",
      "ATHENA modules clarified.",
      "NOVARA Habitat and NOVARA Dynamics responsibilities clarified.",
      "ATHENA modules confirmed as part of one product, not separate products.",
    ],
    inProgress: [
      "Future modules must be added only after checking Foundation and Brain.",
    ],
    nextActions: [
      "Use Modules V2 before proposing new product areas.",
      "Keep ATHENA modules aligned with the Operating System of Life mission.",
    ],
    risks: [
      "Creating duplicate module names or parallel product systems.",
      "Treating ATHENA modules as separate companies or separate Brains.",
    ],
    foundationImpact:
      "Modules V2 reinforces Foundation by preserving one ATHENA ecosystem and preventing product fragmentation.",
  },
  {
    id: "REP-004",
    date: "Brain Phase / Routes V2",
    module: "Routes",
    status: "Validated",
    completed: [
      "Routes V2 created as the official route registry.",
      "Existing Brain routes included.",
      "Existing NOVARA Habitat routes included.",
      "ATHENA planned routes included.",
      "BrainLayout requirement identified and corrected.",
    ],
    inProgress: [
      "Future routes must be added to Routes V2 before implementation.",
    ],
    nextActions: [
      "Check Routes V2 before creating any route.",
      "Use BrainLayout for every Brain page.",
      "Avoid creating duplicate Brain, Foundation or ATHENA governance routes.",
    ],
    risks: [
      "Creating routes without checking the registry.",
      "Breaking Brain navigation by bypassing BrainLayout.",
      "Duplicating ATHENA module routes outside the validated structure.",
    ],
    foundationImpact:
      "Routes V2 protects Foundation by making route governance visible and preventing duplicate route systems.",
  },
  {
    id: "REP-005",
    date: "Brain Phase / Decisions V2",
    module: "Decisions",
    status: "Validated",
    completed: [
      "Decisions V2 created as the official validated decision registry.",
      "One Brain decision documented.",
      "Foundation highest authority decision documented.",
      "Habitat / Dynamics separation documented.",
      "ATHENA mission and module principles documented.",
      "BrainLayout requirement documented.",
    ],
    inProgress: [
      "Future important decisions must be added to Decisions V2.",
    ],
    nextActions: [
      "Check Decisions V2 before proposing architecture or product changes.",
      "Document every important validated decision.",
      "Reject decisions that contradict Foundation.",
    ],
    risks: [
      "Important decisions may be lost if not documented.",
      "Future development may drift if decisions are not checked.",
    ],
    foundationImpact:
      "Decisions V2 converts validated conversations into durable governance records aligned with Foundation.",
  },
  {
    id: "REP-006",
    date: "Brain Phase / Context V2",
    module: "Context",
    status: "Validated",
    completed: [
      "Context V2 created as the official current-state registry.",
      "Mission documented.",
      "Current priorities documented.",
      "Active systems documented.",
      "Planned systems documented.",
      "Validated architecture documented.",
      "Infrastructure status documented.",
      "ATHENA, Habitat, Dynamics and Brain statuses documented.",
    ],
    inProgress: [
      "Context must remain updated after major changes.",
    ],
    nextActions: [
      "Use Context V2 so future chats can understand the project state quickly.",
      "Update Context after Brain Phase completion and after ATHENA Landing V2 execution.",
    ],
    risks: [
      "Future chats may misunderstand the project if Context becomes outdated.",
      "Execution may restart from old assumptions if Context is not maintained.",
    ],
    foundationImpact:
      "Context V2 supports Foundation by giving every future session a reliable current-state entry point.",
  },
  {
    id: "REP-007",
    date: "Brain Phase / Reports V2",
    module: "Reports",
    status: "Validated",
    completed: [
      "Reports V2 created as the long-term continuity registry.",
      "Report structure established.",
      "Brain Phase progress documented.",
      "Validated work, risks and next actions captured.",
    ],
    inProgress: [
      "Reports must be updated at the end of major work sessions.",
    ],
    nextActions: [
      "Use Reports V2 for session continuity.",
      "After Reports V2 validation, confirm Brain Phase complete.",
      "Move to ATHENA Landing V2 execution.",
    ],
    risks: [
      "Loss of continuity between sessions if reports are not maintained.",
      "Repeated work if completed decisions and validations are not documented.",
    ],
    foundationImpact:
      "Reports V2 strengthens Foundation by making project history, validated work and next actions persistent.",
  },
];

const stats = [
  { label: "Foundation", value: "Validated V1" },
  { label: "Registry", value: "Validated V2" },
  { label: "Modules", value: "Validated V2" },
  { label: "Routes", value: "Validated V2" },
  { label: "Decisions", value: "Validated V2" },
  { label: "Context", value: "Validated V2" },
  { label: "Reports", value: "Validated V2" },
];

export default function BrainReportsPage() {
  return (
    <BrainLayout>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Brain
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            REPORTS V2
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Official continuity registry for development sessions. A future
            chat must be able to understand what was done, what was validated,
            what changed, what is blocked and what comes next.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
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
              Reports Rule
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/75">
              Reports V2 does not replace Foundation. Foundation remains the
              highest authority. Reports document continuity: what was done,
              what changed, what is blocked and what must happen next.
            </p>
          </div>

          <div className="space-y-6">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-sm text-[#d6b36a]">
                      {report.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {report.module}
                    </h2>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-[#d6b36a]/25 bg-[#d6b36a]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#d6b36a]">
                    {report.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Date
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {report.date}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Module
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {report.module}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Completed
                    </p>
                    <ul className="mt-3 space-y-2">
                      {report.completed.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-white/65"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6b36a]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      In Progress
                    </p>
                    <ul className="mt-3 space-y-2">
                      {report.inProgress.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-white/65"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Next Actions
                    </p>
                    <ul className="mt-3 space-y-2">
                      {report.nextActions.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-white/65"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6b36a]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Risks
                    </p>
                    <ul className="mt-3 space-y-2">
                      {report.risks.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-white/65"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Foundation Impact
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#d6b36a]">
                    {report.foundationImpact}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">NEXT PRIORITIES</h2>

            <ol className="mt-5 space-y-3 text-sm text-white/70">
              <li>1. Validate Reports V2</li>
              <li>2. Confirm Brain Phase complete</li>
              <li>3. Start ATHENA Landing V2 execution</li>
              <li>4. Build ATHENA Property MVP</li>
            </ol>
          </div>
        </div>
      </section>
    </BrainLayout>
  );
}
