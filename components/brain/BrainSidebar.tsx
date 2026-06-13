"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/brain", label: "Dashboard" },
  { href: "/brain/context", label: "Context" },
  { href: "/brain/decisions", label: "Decisions" },
  { href: "/brain/modules", label: "Modules" },
  { href: "/brain/data-model", label: "Data Model" },
  { href: "/brain/routes", label: "Routes" },
  { href: "/brain/reports", label: "Reports" },
  { href: "/brain/changes", label: "Changes" },
  { href: "/brain/todos", label: "Todos" },
  { href: "/brain/sync", label: "Sync" },
  { href: "/brain/consciousness", label: "Consciousness" },
  { href: "/brain/analysis", label: "Analysis" },
  { href: "/brain/auto", label: "Auto" },
  { href: "/brain/insights", label: "Insights" },
  { href: "/brain/recommendations", label: "Recommendations" },
  { href: "/brain/memory", label: "Memory" },
  { href: "/brain/execution", label: "Execution" },
  { href: "/brain/decision-engine", label: "Decision Engine" },
  { href: "/brain/priority", label: "Priority" },
  { href: "/brain/impact", label: "Impact" },
  { href: "/brain/report-engine", label: "Report Engine" },
  { href: "/brain/action-engine", label: "Action Engine" },
  { href: "/brain/automation", label: "Automation" },
  { href: "/brain/todo-engine", label: "Todo Engine" },
  { href: "/brain/change-engine", label: "Change Engine" },
  { href: "/brain/health", label: "Health" },
  { href: "/brain/audit", label: "Audit" },
];

export default function BrainSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-3xl border border-[#c9a45c]/20 bg-black/40 p-6 backdrop-blur">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#c9a45c]">
          NOVARA HQ
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Brain
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Operational Consciousness
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 transition ${
                active
                  ? "bg-[#c9a45c] text-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
