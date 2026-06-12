"use client";

import { useEffect, useState } from "react";
import BrainLayout from "@/components/brain/BrainLayout";
import { supabase } from "@/lib/supabaseClient";

type TodoItem = {
  id: string;
  module: string;
  title: string;
  priority: string | null;
  status: string | null;
  assigned_to: string | null;
  notes: string | null;
};

export default function BrainTodosPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodos() {
      const { data } = await supabase
        .from("brain_todos")
        .select("*")
        .order("priority");

      setTodos((data || []) as TodoItem[]);
      setLoading(false);
    }

    loadTodos();
  }, []);

  return (
    <BrainLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c9a45c]">
            NOVARA HQ DYNAMICS
          </p>

          <h1 className="mt-3 text-5xl font-bold text-white">
            TODOS
          </h1>

          <p className="mt-4 text-white/60">
            Priorités et actions restantes de l'écosystème NOVARA.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Chargement...
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-6"
              >
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#c9a45c]/20 px-3 py-1 text-xs text-[#c9a45c]">
                    {todo.module}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {todo.priority}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {todo.status}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-white">
                  {todo.title}
                </h2>

                {todo.assigned_to && (
                  <p className="mt-2 text-white/50">
                    Assigné à : {todo.assigned_to}
                  </p>
                )}

                {todo.notes && (
                  <p className="mt-3 text-white/60">
                    {todo.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BrainLayout>
  );
}
