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
import { SidebarMenuToggle } from "./sidebar-menu-toggle";
import { SidebarNav } from "./sidebar-nav";
import { UserProfile } from "@/components/ui/user-profile";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useTheme } from "@/components/theme/theme-provider";
import { useEffect, type ComponentType, type CSSProperties } from "react";

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

export function Sidebar() {
  const { theme } = useTheme();
  const { isCollapsed, isMobileOpen, setMobileOpen, toggleCollapsed } =
    useSidebar();
  const brandCollapsed = isCollapsed && !isMobileOpen;
  const navCollapsed = isCollapsed && !isMobileOpen;
  const showDesktopToggle = !isMobileOpen;

  useEffect(() => {
    if (!isMobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileOpen, setMobileOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <header
        className={`sidebar-header flex h-14 shrink-0 items-center border-b border-border-subtle px-3 ${
          brandCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        {showDesktopToggle && (
          <SidebarMenuToggle
            isCollapsed={isCollapsed}
            onToggle={toggleCollapsed}
          />
        )}

        {!brandCollapsed && (
          <Link
            href="/today"
            onClick={() => setMobileOpen(false)}
            className="sidebar-brand-link focus-ring flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-lg py-1"
            aria-label="DSJourney home"
          >
            <DsjourneyLogo
              variant={theme === "light" ? "icon" : "icon-dark"}
              className="h-8 w-8 shrink-0"
            />
            <span
              className="sidebar-reveal-label truncate text-sm font-semibold tracking-tight text-text-primary"
              style={{ "--sidebar-stagger-index": 0 } as CSSProperties}
            >
              DSJourney
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="focus-ring ml-auto inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary md:hidden"
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>
      </header>

      <SidebarNav items={navItems} collapsed={navCollapsed} />

      <div className="sidebar-footer mt-auto space-y-1 overflow-visible border-t border-border-subtle px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <ThemeToggle variant="sidebar" collapsed={navCollapsed} />
        <UserProfile collapsed={navCollapsed} />
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`
          sidebar-motion-root sidebar-transition sidebar-shell relative hidden h-full flex-shrink-0 flex-col border-r border-border-subtle bg-bg-sidebar md:flex
          ${isCollapsed ? "sidebar-collapsed w-[72px] overflow-visible" : "sidebar-expanded w-[252px] overflow-hidden"}
        `}
        style={{ "--sidebar-stagger-max": navItems.length } as CSSProperties}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-bg-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="mobile-sidebar"
            className="relative z-50 flex h-full w-[252px] flex-col overflow-hidden border-r border-border-subtle bg-bg-sidebar"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
