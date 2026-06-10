export default function BrainContextPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            NOVARA AI CONTEXT
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            NOVARA BRAIN CONTEXT
          </h1>

          <p className="mt-3 max-w-3xl text-slate-300">
            Page de référence rapide pour tout module, chat ou IA travaillant sur l’écosystème NOVARA.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-amber-400">
            FOUNDATION 1.0
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
{`STATUS:
ARCHITECTURE VALIDÉE

FOUNDATION DOMAINS:
- PROPERTY = Où ?
- EMPLOYEE = Qui ?
- WORK = Quoi ?

UNDER INVESTIGATION:
- PARTY

NOVARA METHOD:
Observer → Documenter → Tester → Modéliser → Valider`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-amber-400">
            SOURCES OF TRUTH
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
{`EMPLOYEE:
- Official table: employees
- Do not create: workers, staff, crew, employees_core

PROPERTY:
- Official table: properties
- Modules must use properties, not recreate property records

WORK:
- Main work-related tables:
  - projects
  - project_tasks
  - voice_notes
  - daily_reports
  - incidents
  - material_orders
  - sav_tickets
  - checkins
  - project_photos`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-amber-400">
            EMPLOYEE RULES
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
{`1 employee =
1 Employee Master ID =
1 PIN 6 chiffres =
1 employee_id UUID

RULES:
- employee_pin = visible identity only
- employee_id UUID = relational key
- all relations must use employee_id
- never use employee_pin as relational key`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-amber-400">
            SAV ARCHITECTURE
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
{`SAV source of truth:
- sav_tickets

Validated decision:
- SAV creation mainly belongs to NOVARA Concierge
- SAV operational treatment belongs to NOVARA Core
- SAV supervision belongs to NOVARA Dynamics HQ

All modules must use sav_tickets as the shared source of truth.`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-amber-400">
            CURRENT MODULES
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
{`ACTIVE / PLANNED MODULES:
- Habitat
- Core
- RH
- Dynamics HQ
- Property
- Concierge
- SMART
- Payroll

RULE:
Dynamics HQ is not a business module.
Dynamics HQ is the coordination center, knowledge hub and project command center.`}
          </pre>
        </section>

        <section className="rounded-2xl border border-amber-500 bg-amber-500/10 p-6">
          <h2 className="text-xl font-semibold text-amber-300">
            INSTRUCTION FOR FUTURE AI / MODULES
          </h2>

          <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-100">
{`Before creating SQL, Supabase tables, GitHub files or new modules:

1. Read this NOVARA BRAIN CONTEXT.
2. Respect existing sources of truth.
3. Do not duplicate validated entities.
4. Use employee_id UUID for all employee relations.
5. Use properties for property data.
6. Use sav_tickets for SAV.
7. If a new concept is unclear, treat it as UNDER INVESTIGATION before modeling.
8. When changes are made, report what was changed so Dynamics HQ can update the NOVARA Brain.`}
          </pre>
        </section>
      </div>
    </main>
  );
}
