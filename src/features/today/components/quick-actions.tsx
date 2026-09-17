"use client";

import { Plus, Map, BarChart3, FolderKanban } from "lucide-react";
import { ActionTile, dashboardCard, DashboardScrollReveal } from "@/components/dashboard";

const actions = [
  { label: "Log Session", href: "/study-sessions", icon: Plus },
  { label: "Open Roadmap", href: "/roadmap", icon: Map },
  { label: "View Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Update Portfolio", href: "/portfolio", icon: FolderKanban },
];

export function QuickActions() {
  return (
    <DashboardScrollReveal delayMs={60}>
    <div className={`${dashboardCard} p-4`}>
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <ActionTile key={action.href} {...action} />
        ))}
      </div>
    </div>
    </DashboardScrollReveal>
  );
}
