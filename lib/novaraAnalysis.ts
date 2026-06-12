import { supabase } from "./supabaseClient";

export async function runNovaraAnalysis() {
  const results: string[] = [];

  const { count: reports } = await supabase
    .from("brain_reports")
    .select("*", { count: "exact", head: true });

  const { count: decisions } = await supabase
    .from("brain_decisions")
    .select("*", { count: "exact", head: true });

  const { count: modules } = await supabase
    .from("brain_modules")
    .select("*", { count: "exact", head: true });

  if ((modules || 0) > (reports || 0)) {
    results.push(
      "Plus de modules que de rapports. Documentation incomplète."
    );
  }

  if ((decisions || 0) < 10) {
    results.push(
      "Peu de décisions enregistrées dans Brain."
    );
  }

  if ((reports || 0) === 0) {
    results.push(
      "Aucun rapport Brain détecté."
    );
  }

  return results;
}
