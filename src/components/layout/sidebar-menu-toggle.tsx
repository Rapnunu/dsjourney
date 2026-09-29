"use client";

import { SidebarToggleIcon } from "./sidebar-toggle-icon";
import { SidebarTooltip } from "./sidebar-tooltip";

interface SidebarMenuToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarMenuToggle({
  isCollapsed,
  onToggle,
}: SidebarMenuToggleProps) {
  const tooltip = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={tooltip}
      aria-expanded={!isCollapsed}
      className="sidebar-menu-toggle group relative focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
    >
      <SidebarToggleIcon />
      <SidebarTooltip label={tooltip} show={isCollapsed} />
    </button>
  );
}
