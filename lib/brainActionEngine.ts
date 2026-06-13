import { supabase } from "./supabaseClient";

export async function createExecutionRequest({
  title,
  description,
  source_module,
  target_system,
  risk_level = "LOW",
}: {
  title: string;
  description: string;
  source_module: string;
  target_system: string;
  risk_level?: string;
}) {
  return supabase.from("brain_execution_requests").insert({
    title,
    description,
    source_module,
    target_system,
    risk_level,
    status: "PENDING",
    validation_required: true,
  });
}
