"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function TopBar() {
  const { setMobileOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="flex items-center h-12 px-4 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="focus-ring mr-3 rounded-md p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-surface-hover md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Desktop collapse toggle (visible when collapsed for easy access) */}
      <button
        onClick={toggleCollapsed}
        className="focus-ring hidden md:flex items-center rounded-md p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-surface-hover"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu size={18} />
      </button>
    </header>
  );
}
