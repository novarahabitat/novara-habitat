import { supabase } from "./supabaseClient";

export async function createBrainTodo({
  module,
  title,
  priority = "MEDIUM",
  assigned_to = "Vital",
  notes = "",
}: {
  module: string;
  title: string;
  priority?: string;
  assigned_to?: string;
  notes?: string;
}) {
  return supabase.from("brain_todos").insert({
    module,
    title,
    priority,
    status: "TODO",
    assigned_to,
    notes,
  });
}
