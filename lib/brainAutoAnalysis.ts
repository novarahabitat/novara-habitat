import { supabase } from "./supabaseClient";

export async function runBrainAutoAnalysis() {
  const conclusions = [];

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

  const { count: changes } = await supabase
    .from("brain_changes")
    .select("*", { count: "exact", head: true });

  const { count: activity } = await supabase
    .from("brain_activity")
    .select("*", { count: "exact", head: true });

  if ((modules || 0) > (reports || 0)) {
    conclusions.push({
      title: "Documentation incomplète",
      conclusion:
        "Plus de modules que de rapports documentés.",
      severity: "warning",
      source: "brain_modules",
    });
  }

  if ((decisions || 0) < 10) {
    conclusions.push({
      title: "Décisions insuffisantes",
      conclusion:
        "Le nombre de décisions Brain reste faible.",
      severity: "warning",
      source: "brain_decisions",
    });
  }

  if ((todos || 0) > 20) {
    conclusions.push({
      title: "Accumulation de tâches",
      conclusion:
        "Le nombre de TODO devient important.",
      severity: "warning",
      source: "brain_todos",
    });
  }

  if ((activity || 0) === 0) {
    conclusions.push({
      title: "Aucune activité",
      conclusion:
        "Aucune activité Brain détectée.",
      severity: "critical",
      source: "brain_activity",
    });
  }

  if (conclusions.length === 0) {
    conclusions.push({
      title: "Système cohérent",
      conclusion:
        "Aucune anomalie détectée.",
      severity: "success",
      source: "brain",
    });
  }

  return conclusions;
}
