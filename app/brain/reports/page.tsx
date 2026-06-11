import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrainReportsPage() {
  const { data: reports } = await supabase
    .from("brain_reports")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            REPORT REGISTRY
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Historique des rapports, décisions, évolutions et informations
            importantes remontées par les modules NOVARA.
          </p>
        </header>

        {!reports || reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Aucun rapport trouvé
            </h2>

            <p className="mt-2 text-slate-600">
              La table brain_reports est vide.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report: any) => (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {report.module}
                  </span>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    {report.category}
                  </span>

                  {report.status && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {report.status}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-bold">
                  {report.title}
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-slate-700">
                  {report.content}
                </p>

                <div className="mt-4 text-sm text-slate-500">
                  {report.created_by && (
                    <span>
                      Auteur : {report.created_by}
                    </span>
                  )}

                  {report.created_at && (
                    <span className="ml-4">
                      {new Date(
                        report.created_at
                      ).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
