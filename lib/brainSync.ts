import { supabase } from "./supabaseClient";

export async function addBrainActivity({
  module,
  action,
  details,
  severity = "info",
}: {
  module: string;
  action: string;
  details?: string;
  severity?: string;
}) {
  return supabase.from("brain_activity").insert({
    module,
    action,
    details,
    severity,
  });
}

export async function addBrainReport({
  module,
  category,
  title,
  content,
  status = "active",
  created_by = "NOVARA",
}: {
  module: string;
  category: string;
  title: string;
  content: string;
  status?: string;
  created_by?: string;
}) {
  return supabase.from("brain_reports").insert({
    module,
    category,
    title,
    content,
    status,
    created_by,
  });
}

export async function addBrainDecision({
  title,
  description,
  module,
  status = "VALIDATED",
  created_by = "NOVARA",
}: {
  title: string;
  description?: string;
  module?: string;
  status?: string;
  created_by?: string;
}) {
  return supabase.from("brain_decisions").insert({
    title,
    description,
    module,
    status,
    created_by,
  });
}

export async function addBrainChange({
  module,
  entity_type,
  entity_name,
  action,
  old_value,
  new_value,
  author = "NOVARA",
  status = "ACTIVE",
}: {
  module: string;
  entity_type: string;
  entity_name: string;
  action: string;
  old_value?: string;
  new_value?: string;
  author?: string;
  status?: string;
}) {
  return supabase.from("brain_changes").insert({
    module,
    entity_type,
    entity_name,
    action,
    old_value,
    new_value,
    author,
    status,
  });
}

export async function addBrainTodo({
  module,
  title,
  priority = "MEDIUM",
  status = "TODO",
  assigned_to,
  notes,
}: {
  module: string;
  title: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  notes?: string;
}) {
  return supabase.from("brain_todos").insert({
    module,
    title,
    priority,
    status,
    assigned_to,
    notes,
  });
}
