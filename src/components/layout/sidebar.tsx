"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Map,
  BookOpen,
  BarChart3,
  Gauge,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { useSidebar } from "./sidebar-context";
import { UserProfile } from "@/components/ui/user-profile";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Today", href: "/today", icon: CalendarDays },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Study Sessions", href: "/study-sessions", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Readiness", href: "/readiness", icon: Gauge },
  { label: "Portfolio", href: "/portfolio", icon: FolderKanban },
];

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/today"
      className="focus-ring flex items-center gap-3 rounded-lg px-2 py-1"
      aria-label="DSJourney home"
    >
      <DsjourneyLogo
        variant="icon-dark"
        className="h-9 w-9 shrink-0"
      />
      {!collapsed && (
        <span className="text-sm font-semibold tracking-tight text-text-primary whitespace-nowrap">
          DSJourney
        </span>
      )}
    </Link>
  );
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? item.label : undefined}
      className={`
        focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
        transition-colors duration-150
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-bg-elevated text-text-primary"
            : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-teal" />
      )}
      <Icon
        size={18}
        className={
          isActive
            ? "text-brand-teal"
            : "text-text-muted group-hover:text-text-secondary"
        }
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, setMobileOpen, toggleCollapsed } =
    useSidebar();
  const brandCollapsed = isCollapsed && !isMobileOpen;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-3">
        <SidebarBrand collapsed={brandCollapsed} />
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="focus-ring hidden rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary md:inline-flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="focus-ring rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={isCollapsed && !isMobileOpen}
          />
        ))}
      </nav>

      <div className="border-t border-border-subtle px-1">
        <UserProfile collapsed={isCollapsed && !isMobileOpen} />
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`
          sidebar-transition hidden h-full flex-shrink-0 flex-col border-r border-border-subtle bg-bg-sidebar md:flex
          ${isCollapsed ? "w-[72px]" : "w-[252px]"}
        `}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-bg-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-[260px] flex-col border-r border-border-subtle bg-bg-sidebar">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
