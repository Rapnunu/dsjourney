"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

/** Mobile-only drawer trigger — collapse control lives in the sidebar header. */
export function MobileNavTrigger() {
  const { setMobileOpen } = useSidebar();

  return (
    <div className="flex h-9 shrink-0 items-center border-b border-border-subtle px-4 md:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="focus-ring rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
