"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, CSSProperties } from "react";
import { useSidebar } from "./sidebar-context";
import { SidebarTooltip } from "./sidebar-tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

interface SidebarNavProps {
  items: NavItem[];
  collapsed: boolean;
}

function NavLink({
  item,
  collapsed,
  index,
}: {
  item: NavItem;
  collapsed: boolean;
  index: number;
}) {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => setMobileOpen(false)}
      aria-label={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`
        sidebar-nav-link focus-ring group relative flex rounded-lg text-sm font-medium
        transition-colors duration-150
        ${
          isActive
            ? collapsed
              ? "sidebar-nav-link--collapsed-active text-text-primary"
              : "sidebar-nav-link--expanded-active text-[#071016]"
            : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
        }
      `}
    >
      <span
        className="sidebar-row sidebar-nav-content w-full"
        style={{ "--sidebar-stagger-index": index + 1 } as CSSProperties}
      >
        <span className="sidebar-icon-slot">
          <Icon
            size={18}
            className={`sidebar-nav-icon ${
              isActive
                ? collapsed
                  ? "text-[#071016]"
                  : "text-[#071016]"
                : "text-text-secondary group-hover:text-text-primary"
            }`}
          />
        </span>
        <span
          className={`sidebar-reveal-label min-w-0 truncate ${
            collapsed ? "sidebar-reveal-label--hidden" : ""
          }`}
          aria-hidden={collapsed}
        >
          {item.label}
        </span>
      </span>
      <SidebarTooltip label={item.label} show={collapsed} />
    </Link>
  );
}

export function SidebarNav({ items, collapsed }: SidebarNavProps) {
  return (
    <nav
      className={`flex-1 space-y-1 px-3 py-3 ${
        collapsed ? "overflow-visible" : "overflow-y-auto"
      }`}
    >
      {items.map((item, index) => (
        <NavLink
          key={item.href}
          item={item}
          collapsed={collapsed}
          index={index}
        />
      ))}
    </nav>
  );
}
