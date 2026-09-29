"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

/** Mobile-only drawer trigger — collapse control lives in the sidebar header. */
export function MobileNavTrigger() {
  const { isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-11 shrink-0 items-center border-b border-border-subtle px-4 md:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-sidebar"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
