"use client";

import { Plus, Map, BarChart3, FolderKanban } from "lucide-react";
import { ActionTile, DashboardScrollReveal, SectionCard } from "@/components/dashboard";

const actions = [
  { label: "Log Study Session", href: "/study-sessions", icon: Plus },
  { label: "Open Roadmap", href: "/roadmap", icon: Map },
  { label: "View Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Add Project", href: "/portfolio", icon: FolderKanban },
];

export function QuickActionsRow() {
  return (
    <DashboardScrollReveal delayMs={80}>
      <SectionCard title="Quick Actions" padding="sm">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {actions.map((action) => (
            <ActionTile key={action.href} {...action} />
          ))}
        </div>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
