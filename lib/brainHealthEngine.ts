import { supabase } from "./supabaseClient";

export async function getBrainHealth() {
  const tables = [
    "brain_reports",
    "brain_decisions",
    "brain_modules",
    "brain_todos",
    "brain_changes",
    "brain_activity",
    "brain_execution_requests",
  ];

  const results = [];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    results.push({
      table,
      status: error ? "ERROR" : "OK",
      count: count || 0,
    });
  }

  return results;
}
