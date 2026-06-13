import { supabase } from "./supabaseClient";

export async function createAuditLog({
  module,
  action,
  details,
  actor = "NOVARA Brain",
}: {
  module: string;
  action: string;
  details: string;
  actor?: string;
}) {
  return supabase.from("brain_activity").insert({
    module,
    action,
    details,
    severity: "audit",
  });
}
