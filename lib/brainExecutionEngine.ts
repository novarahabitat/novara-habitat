import { supabase } from "./supabaseClient";

export async function getPendingExecutions() {
  const { data } = await supabase
    .from("brain_execution_requests")
    .select("*")
    .eq("status", "PENDING")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function approveExecution(
  id: string,
  approver: string
) {
  return supabase
    .from("brain_execution_requests")
    .update({
      status: "APPROVED",
      approved_by: approver,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function rejectExecution(
  id: string,
  approver: string
) {
  return supabase
    .from("brain_execution_requests")
    .update({
      status: "REJECTED",
      approved_by: approver,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);
}
