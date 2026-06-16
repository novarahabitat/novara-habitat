import BrainLayout from "@/components/brain/BrainLayout";

const priorities = [
  {
    id: "P-001",
    title: "ATHENA Landing V2",
    status: "NEXT",
    level: "CRITICAL",
    description:
      "Build the next public ATHENA landing page on NOVARA Dynamics with premium technology-company quality, living interface direction, clear Operating System of Life positioning and validated ATHENA modules.",
    owner: "NOVARA Dynamics / ATHENA",
    dependencies: [
      "Foundation V1 validated",
      "Registry V2 validated",
      "Modules V2 validated",
      "Routes V2 validated",
      "Decisions V2 validated",
      "Context V2 validated",
      "Reports V2 validated",
      "Priority V1 validated",
    ],
    nextAction:
      "Review current novaradynamics.fr Landing V1 code, then replace with complete ATHENA Landing V2 implementation.",
    foundationReference: "03 — Mission / Living Environment Principle",
  },
  {
    id: "P-002",
    title: "ATHENA Property MVP",
    status: "QUEUED",
    level: "HIGH",
    description:
      "Create the first functional ATHENA module focused on property memory, equipment, documents, warranties, maintenance and service requests.",
    owner: "NOVARA Dynamics / ATHENA Property",
    dependencies: [
      "ATHENA Landing V2 validated",
      "Foundation checked",
      "Routes checked",
      "Data model checked",
      "Decisions checked",
    ],
    nextAction:
      "After Landing V2 validation, define the minimum ATHENA Property MVP using existing Brain architecture before creating any route or table.",
    foundationReference: "25 — ATHENA Property / 08 — Mémoire du bien",
  },
  {
    id: "P-003",
    title: "Brain Thoughts Engine",
    status: "FUTURE",
    level: "HIGH",
    description:
      "Future Brain capability to capture ideas, reasoning fragments, strategic thoughts and development reflections before they become validated decisions.",
    owner: "NOVARA Habitat / Brain",
    dependencies: [
      "Brain Core completed",
      "Foundation checked",
      "Decisions registry maintained",
      "Reports registry maintained",
    ],
    nextAction:
      "Keep dormant until ATHENA Landing V2 and Property MVP priorities are advanced. Later define whether thoughts become a Brain page, database-backed system or internal workflow.",
    foundationReference: "01 — Source de vérité absolue / 40 — Development Rule",
  },
  {
    id: "P-004",
    title: "Brain Changes Engine",
    status: "FUTURE",
    level: "MEDIUM",
    description:
      "Future Brain capability to track changes, corrections, version history, implementation updates and architectural evolution over time.",
    owner: "NOVARA Habitat / Brain",
    dependencies: [
      "Brain Core completed",
      "Reports V2 validated",
      "Decisions V2 validated",
      "Future data persistence strategy",
    ],
    nextAction:
      "Do not build yet. Later define a controlled change log system that supports the single Brain without creating a duplicate governance layer.",
    foundationReference: "02 — Gouvernance / 40 — Development Rule",
  },
  {
    id: "P-005",
    title: "Collective Intelligence Engine",
    status: "FUTURE",
    level: "STRATEGIC",
    description:
      "Long-term intelligence layer allowing the Brain to synthesize validated context, reports, decisions, priorities and future ATHENA development knowledge.",
    owner: "NOVARA Habitat / Brain / NOVARA Dynamics",
    dependencies: [
      "Brain Core completed",
      "ATHENA product execution started",
      "Sufficient validated reports and decisions",
      "Future AI and data architecture",
    ],
    nextAction:
      "Keep as strategic future priority. Do not implement before ATHENA has enough real product and operational data.",
    foundationReference: "03 — Mission / Operating System of Life",
  },
  {
    id: "P-006",
    title: "HARPOCRATE",
    status: "DORMANT",
    level: "FUTURE",
    description:
      "Future dormant secure vault concept connected to privacy, survival, highly sensitive data protection and possible physical/digital continuity.",
    owner: "ATHENA / Future Security",
    dependencies: [
      "ATHENA core modules mature",
      "Health privacy model defined",
      "Offline Survival Protocol refined",
      "Security architecture validated",
    ],
    nextAction:
      "Do not develop now. Keep documented as dormant until ATHENA core execution is mature.",
    foundationReference: "HARPOCRATE Dormant Rule / Offline Survival Protocol",
  },
  {
    id: "P-007",
    title: "ATHENA Concierge",
    status: "QUEUED",
    level: "HIGH",
    description:
      "Build ATHENA Concierge for organization, reminders, scheduling, reservations, coordination and personal assistance under the ATHENA unified experience.",
    owner: "NOVARA Dynamics / ATHENA Concierge",
    dependencies: [
      "ATHENA Landing V2 validated",
      "ATHENA Property MVP started or validated",
      "Foundation checked",
      "Routes checked",
      "Decisions checked",
    ],
    nextAction:
      "Define Concierge MVP only after Landing V2 and initial Property direction are stabilized.",
    foundationReference: "34 — ATHENA Concierge",
  },
  {
    id: "P-008",
    title: "ATHENA Family",
    status: "QUEUED",
    level: "MEDIUM",
    description:
      "Build ATHENA Family for household organization, children follow-up, family tasks, shared planning and school tracking.",
    owner: "NOVARA Dynamics / ATHENA Family",
    dependencies: [
      "ATHENA Landing V2 validated",
      "ATHENA Property MVP direction established",
      "ATHENA Concierge direction established",
      "Foundation checked",
    ],
    nextAction:
      "Keep queued. Do not start before Property and Concierge create the first household foundation.",
    foundationReference: "27 — ATHENA Family / Household First Principle",
  },
  {
    id: "P-009",
    title: "ATHENA Student",
    status: "QUEUED",
    level: "MEDIUM",
    description:
      "Build ATHENA Student for learning, homework support, educational guidance, study planning, exams and student budgeting.",
    owner: "NOVARA Dynamics / ATHENA Student",
    dependencies: [
      "ATHENA Landing V2 validated",
      "ATHENA Family direction established",
      "Personal memory model checked",
      "Foundation checked",
    ],
    nextAction:
      "Keep queued. Define MVP only after household and personal memory foundations are clearer.",
    foundationReference: "28 — ATHENA Student / 09 — Mémoire personnelle",
  },
  {
    id: "P-010",
    title: "ATHENA Health",
    status: "QUEUED",
    level: "MEDIUM",
    description:
      "Build ATHENA Health as a secure, private personal health space with maximum privacy and future biometric protection.",
    owner: "NOVARA Dynamics / ATHENA Health",
    dependencies: [
      "ATHENA Landing V2 validated",
      "Personal memory model checked",
      "Security and privacy architecture validated",
      "Foundation checked",
    ],
    nextAction:
      "Keep queued. Do not start until security, privacy and personal memory principles are ready for safe implementation.",
    foundationReference: "31 — ATHENA Health / 09 — Mémoire personnelle",
  },
];

const stats = [
  { label: "Brain Core", value: "Completed" },
  { label: "Priority", value: "V1" },
  { label: "Current Next", value: "P-001" },
  { label: "Execution", value: "Landing V2" },
];

const statusStyles: Record<string, string> = {
  NEXT: "border-[#d6b36a]/40 bg-[#d6b36a]/15 text-[#d6b36a]",
  QUEUED: "border-white/10 bg-white/[0.05] text-white/75",
  FUTURE: "border-blue-300/20 bg-blue-300/10 text-blue-200",
  DORMANT: "border-purple-300/20 bg-purple-300/10 text-purple-200",
};

const levelStyles: Record<string, string> = {
  CRITICAL: "text-red-200",
  HIGH: "text-[#d6b36a]",
  MEDIUM: "text-white/70",
  STRATEGIC: "text-blue-200",
  FUTURE: "text-purple-200",
};

export default function BrainPriorityPage() {
  return (
    <BrainLayout>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#c8a45d]">
            NOVARA Brain
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            PRIORITY V1
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Official priority registry for the NOVARA + ATHENA ecosystem. This
            page defines what comes next and prevents execution drift after the
            Brain Core phase.
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
              Priority Rule
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/75">
              Priority V1 does not replace Foundation. Foundation remains the
              highest authority. Priority V1 defines execution order only after
              Foundation, Brain, Routes, Decisions, Context and Reports have
              been checked.
            </p>
          </div>

          <div className="space-y-6">
            {priorities.map((priority) => (
              <article
                key={priority.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-sm text-[#d6b36a]">
                      {priority.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {priority.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
                        statusStyles[priority.status] ||
                        "border-white/10 bg-white/[0.05] text-white/75"
                      }`}
                    >
                      {priority.status}
                    </span>

                    <span
                      className={`inline-flex w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
                        levelStyles[priority.level] || "text-white/70"
                      }`}
                    >
                      {priority.level}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Owner
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      {priority.owner}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Foundation Reference
                    </p>
                    <p className="mt-2 text-sm text-[#d6b36a]">
                      {priority.foundationReference}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Description
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    {priority.description}
                  </p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Dependencies
                    </p>
                    <ul className="mt-3 space-y-2">
                      {priority.dependencies.map((item) => (
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
                      Next Action
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/65">
                      {priority.nextAction}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">EXECUTION ORDER</h2>

            <ol className="mt-5 space-y-3 text-sm text-white/70">
              <li>1. Validate Priority V1</li>
              <li>2. Start ATHENA Landing V2</li>
              <li>3. Build ATHENA Property MVP</li>
              <li>4. Continue ATHENA Concierge</li>
              <li>5. Continue Family, Student and Health in validated order</li>
            </ol>
          </div>
        </div>
      </section>
    </BrainLayout>
  );
}
