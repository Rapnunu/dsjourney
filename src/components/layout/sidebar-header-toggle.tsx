"use client";

import { SidebarToggleIcon } from "./sidebar-toggle-icon";

interface SidebarHeaderToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeaderToggle({
  isCollapsed,
  onToggle,
}: SidebarHeaderToggleProps) {
  const tooltip = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <button
      type="button"
      onClick={onToggle}
      title={tooltip}
      aria-label={tooltip}
      aria-expanded={!isCollapsed}
      className="focus-ring absolute right-0 top-1/2 z-10 hidden h-[34px] w-[26px] -translate-y-1/2 translate-x-[10px] items-center justify-center rounded-l-none rounded-r-[7px] border border-l-0 border-white/[0.08] bg-[#101720] text-[#98A6B8] shadow-[0_1px_4px_rgba(0,0,0,0.16)] transition-[color,background-color,border-color] duration-200 ease-out hover:bg-[rgba(24,184,198,0.08)] hover:text-[#18B8C6] motion-reduce:transition-none md:inline-flex"
    >
      <span
        className={`sidebar-toggle-motion inline-flex origin-center scale-90 ${
          isCollapsed
            ? "-scale-x-100 translate-x-px opacity-95"
            : "translate-x-0 opacity-100"
        }`}
      >
        <SidebarToggleIcon />
      </span>
    </button>
  );
}
