"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  Map,
  X,
} from "lucide-react";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { useSidebar } from "./sidebar-context";
import { SidebarHeaderToggle } from "./sidebar-header-toggle";
import { SidebarNav } from "./sidebar-nav";
import { UserProfile } from "@/components/ui/user-profile";
import type { ComponentType, CSSProperties } from "react";

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
      className={`sidebar-brand-link focus-ring flex items-center rounded-lg ${
        collapsed ? "justify-center p-1" : "min-w-0 gap-3 px-1 py-1"
      }`}
      aria-label="DSJourney home"
    >
      <DsjourneyLogo variant="icon-dark" className="h-9 w-9 shrink-0" />
      <span
        className={`sidebar-reveal-label truncate text-sm font-semibold tracking-tight text-text-primary whitespace-nowrap ${
          collapsed ? "sidebar-reveal-label--hidden" : ""
        }`}
        style={{ "--sidebar-stagger-index": 0 } as CSSProperties}
        aria-hidden={collapsed}
      >
        DSJourney
      </span>
    </Link>
  );
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, setMobileOpen, toggleCollapsed } =
    useSidebar();
  const brandCollapsed = isCollapsed && !isMobileOpen;
  const navCollapsed = isCollapsed && !isMobileOpen;
  const showDesktopToggle = !isMobileOpen;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <header
        className={`sidebar-header relative flex h-[76px] shrink-0 items-center overflow-visible border-b border-white/[0.06] ${
          brandCollapsed ? "justify-center px-2" : "px-3"
        }`}
      >
        <div
          className={`flex min-w-0 items-center ${
            brandCollapsed
              ? "justify-center"
              : "min-w-0 flex-1 pr-9"
          }`}
        >
          <SidebarBrand collapsed={brandCollapsed} />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="focus-ring absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary md:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        {showDesktopToggle && (
          <SidebarHeaderToggle
            isCollapsed={isCollapsed}
            onToggle={toggleCollapsed}
          />
        )}
      </header>

      <SidebarNav items={navItems} collapsed={navCollapsed} />

      <div className="overflow-visible border-t border-border-subtle px-1">
        <UserProfile collapsed={navCollapsed} />
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`
          sidebar-motion-root sidebar-transition sidebar-shell relative hidden h-full flex-shrink-0 flex-col overflow-visible border-r border-border-subtle bg-bg-sidebar md:flex
          ${isCollapsed ? "sidebar-collapsed w-[72px]" : "sidebar-expanded w-[252px]"}
        `}
        style={
          { "--sidebar-stagger-max": navItems.length } as CSSProperties
        }
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
          <aside className="relative z-50 flex h-full w-[260px] flex-col overflow-visible border-r border-border-subtle bg-bg-sidebar">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
