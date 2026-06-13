import { supabase } from "./supabaseClient";

export async function createBrainChange({
  module,
  entity_type,
  entity_name,
  action,
  old_value = "",
  new_value = "",
  author = "NOVARA Brain",
}: {
  module: string;
  entity_type: string;
  entity_name: string;
  action: string;
  old_value?: string;
  new_value?: string;
  author?: string;
}) {
  return supabase.from("brain_changes").insert({
    module,
    entity_type,
    entity_name,
    action,
    old_value,
    new_value,
    author,
    status: "ACTIVE",
  });
}
