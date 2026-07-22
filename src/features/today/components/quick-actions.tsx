"use client";

import Link from "next/link";
import { Plus, Map, BarChart3, FolderKanban } from "lucide-react";

const actions = [
  { label: "Log Session", href: "/study-sessions", icon: Plus, color: "bg-accent-muted text-accent" },
  { label: "Open Roadmap", href: "/roadmap", icon: Map, color: "bg-emerald-500/10 text-emerald-400" },
  { label: "View Analytics", href: "/analytics", icon: BarChart3, color: "bg-amber-500/10 text-amber-400" },
  { label: "Update Portfolio", href: "/portfolio", icon: FolderKanban, color: "bg-blue-500/10 text-blue-400" },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg p-3
                hover:bg-bg-surface-hover transition-colors duration-150
                focus-ring group"
            >
              <div className={`flex items-center justify-center h-9 w-9 rounded-lg ${action.color} transition-transform duration-150 group-hover:scale-110`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
