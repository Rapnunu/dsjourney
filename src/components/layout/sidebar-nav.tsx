"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

interface SidebarNavProps {
  items: NavItem[];
  collapsed: boolean;
}

interface IndicatorState {
  top: number;
  left: number;
  height: number;
  opacity: number;
}

const INDICATOR_HEIGHT = 20;

const hiddenIndicator: IndicatorState = {
  top: 0,
  left: 0,
  height: INDICATOR_HEIGHT,
  opacity: 0,
};

function NavLink({
  item,
  collapsed,
  index,
  registerRef,
}: {
  item: NavItem;
  collapsed: boolean;
  index: number;
  registerRef: (href: string, node: HTMLAnchorElement | null) => void;
}) {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      ref={(node) => registerRef(item.href, node)}
      href={item.href}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`
        sidebar-nav-link focus-ring group relative flex rounded-lg py-2.5 text-sm font-medium
        transition-colors duration-150
        ${
          isActive
            ? "bg-bg-elevated text-text-primary"
            : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
        }
      `}
    >
      <span
        className="sidebar-nav-content flex min-w-0 w-full items-center gap-3 px-3"
        style={{ "--sidebar-stagger-index": index + 1 } as CSSProperties}
      >
        <Icon
          size={18}
          className={`sidebar-nav-icon shrink-0 ${
            isActive
              ? "text-brand-teal"
              : "text-text-muted group-hover:text-text-secondary"
          }`}
        />
        <span
          className={`sidebar-reveal-label ${collapsed ? "sidebar-reveal-label--hidden" : ""}`}
          aria-hidden={collapsed}
        >
          {item.label}
        </span>
      </span>
    </Link>
  );
}

export function SidebarNav({ items, collapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<IndicatorState>(hiddenIndicator);

  const registerRef = useCallback(
    (href: string, node: HTMLAnchorElement | null) => {
      if (node) {
        itemRefs.current.set(href, node);
      } else {
        itemRefs.current.delete(href);
      }
    },
    [],
  );

  const updateIndicator = useCallback(() => {
    const navEl = navRef.current;
    const activeItem = items.find((item) => pathname === item.href);
    const activeEl = activeItem
      ? itemRefs.current.get(activeItem.href)
      : undefined;

    if (!navEl || !activeEl) {
      setIndicator(hiddenIndicator);
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicator({
      top: activeRect.top - navRect.top + activeRect.height / 2,
      left: activeRect.left - navRect.left,
      height: INDICATOR_HEIGHT,
      opacity: 1,
    });
  }, [items, pathname]);

  useLayoutEffect(() => {
    updateIndicator();
    const timer = window.setTimeout(updateIndicator, 280);

    return () => window.clearTimeout(timer);
  }, [updateIndicator, collapsed, pathname]);

  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const handleLayoutChange = () => updateIndicator();

    window.addEventListener("resize", handleLayoutChange);
    navEl.addEventListener("scroll", handleLayoutChange, { passive: true });

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      navEl.removeEventListener("scroll", handleLayoutChange);
    };
  }, [updateIndicator]);

  return (
    <nav
      ref={navRef}
      className="relative flex-1 space-y-1 overflow-y-auto px-2 py-3"
    >
      <span
        aria-hidden="true"
        className="sidebar-nav-indicator pointer-events-none absolute z-10 w-[3px] rounded-r-full bg-brand-teal -translate-y-1/2"
        style={{
          top: indicator.top,
          left: indicator.left,
          height: indicator.height,
          opacity: indicator.opacity,
        }}
      />
      {items.map((item, index) => (
        <NavLink
          key={item.href}
          item={item}
          collapsed={collapsed}
          index={index}
          registerRef={registerRef}
        />
      ))}
    </nav>
  );
}
