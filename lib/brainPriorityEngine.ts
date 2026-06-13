import { supabase } from "./supabaseClient";

export async function getPriorityModules() {
  const { data: modules } = await supabase
    .from("brain_modules")
    .select("*");

  const { data: todos } = await supabase
    .from("brain_todos")
    .select("*");

  const results =
    modules?.map((module: any) => {
      const relatedTodos =
        todos?.filter(
          (todo: any) =>
            todo.module === module.name
        ) || [];

      return {
        module: module.name,
        todoCount: relatedTodos.length,
      };
    }) || [];

  return results.sort(
    (a: any, b: any) =>
      b.todoCount - a.todoCount
  );
}
