"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Map,
  BookOpen,
  BarChart3,
  Gauge,
  FolderKanban,
  X,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { UserProfile } from "@/components/ui/user-profile";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Today", href: "/today", icon: CalendarDays },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Study Sessions", href: "/study-sessions", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Readiness", href: "/readiness", icon: Gauge },
  { label: "Portfolio", href: "/portfolio", icon: FolderKanban },
];

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>
      </div>
      {!collapsed && (
        <span className="text-sm font-semibold text-text-primary tracking-tight whitespace-nowrap">
          DS Prep Tracker
        </span>
      )}
    </div>
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
      className={`
        focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        transition-colors duration-150
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-bg-surface-hover text-text-primary"
            : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent" />
      )}
      <Icon size={18} className={isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary"} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen } = useSidebar();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-1 border-b border-border-subtle">
        <Logo collapsed={isCollapsed && !isMobileOpen} />
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="focus-ring mr-2 rounded-md p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-surface-hover md:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={isCollapsed && !isMobileOpen}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle px-1">
        <UserProfile collapsed={isCollapsed && !isMobileOpen} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          sidebar-transition hidden md:flex flex-col flex-shrink-0
          bg-bg-sidebar border-r border-border-primary h-full
          ${isCollapsed ? "w-[60px]" : "w-[240px]"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg-overlay backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-50 flex h-full w-[260px] flex-col bg-bg-sidebar border-r border-border-primary shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
