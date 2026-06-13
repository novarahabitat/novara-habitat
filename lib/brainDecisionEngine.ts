import { supabase } from "./supabaseClient";

export async function createBrainDecision(
  title: string,
  description: string,
  module: string
) {
  return supabase
    .from("brain_decisions")
    .insert({
      title,
      description,
      module,
      status: "VALIDATED",
    });
}

export async function getLatestDecisions() {
  const { data } = await supabase
    .from("brain_decisions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}
