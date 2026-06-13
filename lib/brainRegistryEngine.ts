import { supabase } from "./supabaseClient";

export async function getRegistry() {
  const { data } = await supabase
    .from("brain_modules")
    .select("*")
    .order("name");

  return data || [];
}
