import { supabase } from "./supabaseClient";

export async function createBrainReport({
  module,
  category,
  title,
  content,
}: {
  module: string;
  category: string;
  title: string;
  content: string;
}) {
  return supabase.from("brain_reports").insert({
    module,
    category,
    title,
    content,
    status: "active",
    created_by: "NOVARA Brain",
  });
}
