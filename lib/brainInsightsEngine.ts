import { supabase } from "./supabaseClient";

export async function generateBrainInsights() {
  const insights = [];

  const { count: reports } = await supabase
    .from("brain_reports")
    .select("*", { count: "exact", head: true });

  const { count: decisions } = await supabase
    .from("brain_decisions")
    .select("*", { count: "exact", head: true });

  const { count: modules } = await supabase
    .from("brain_modules")
    .select("*", { count: "exact", head: true });

  const { count: todos } = await supabase
    .from("brain_todos")
    .select("*", { count: "exact", head: true });

  if ((reports || 0) < (modules || 0)) {
    insights.push({
      priority: "HIGH",
      title: "Documentation incomplète",
      description:
        "Certains modules ne possèdent pas encore de rapports Brain.",
    });
  }

  if ((decisions || 0) < 10) {
    insights.push({
      priority: "HIGH",
      title: "Décisions insuffisantes",
      description:
        "Le Brain possède peu de décisions validées.",
    });
  }

  if ((todos || 0) > 10) {
    insights.push({
      priority: "MEDIUM",
      title: "Accumulation de tâches",
      description:
        "Le nombre de TODO augmente rapidement.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      priority: "SUCCESS",
      title: "Brain cohérent",
      description:
        "Aucune anomalie détectée actuellement.",
    });
  }

  return insights;
}
