"use client";

import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { Theme } from "@/lib/theme";
import { SidebarTooltip } from "@/components/layout/sidebar-tooltip";

type ThemeToggleVariant = "icon" | "segmented" | "sidebar";

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
  collapsed?: boolean;
  className?: string;
}

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function getToggleLabel(theme: Theme): string {
  return theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

interface ThemeSwitchProps {
  collapsed?: boolean;
  className?: string;
}

/** Full pill switch — used in Settings and compact public headers. */
function ThemeSwitch({
  collapsed = false,
  className = "",
}: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  function handleSelect(
    nextTheme: Theme,
    event: MouseEvent<HTMLButtonElement>,
  ) {
    if (nextTheme === theme) return;
    setTheme(nextTheme, { x: event.clientX, y: event.clientY });
  }

  if (collapsed) {
    return (
      <div
        role="group"
        aria-label="Theme"
        className={`theme-switch-track relative flex w-full rounded-full border p-0.5 ${className}`}
      >
        <span
          aria-hidden="true"
          className={`theme-switch-thumb pointer-events-none absolute top-0.5 h-[calc(100%-0.25rem)] w-[calc(50%-0.125rem)] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${
            isLight ? "left-0.5 translate-x-0" : "left-0.5 translate-x-full"
          }`}
        />
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              aria-label={`${option.label} mode`}
              title={`${option.label} mode`}
              onClick={(event) => handleSelect(option.value, event)}
              className={`theme-switch-option focus-ring relative z-10 flex min-h-9 flex-1 items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "text-brand-teal"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
        Theme
      </p>
      <div
        role="group"
        aria-label="Theme"
        className="theme-switch-track relative flex w-full rounded-full border p-0.5"
      >
        <span
          aria-hidden="true"
          className={`theme-switch-thumb pointer-events-none absolute top-0.5 h-[calc(100%-0.25rem)] w-[calc(50%-0.125rem)] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${
            isLight ? "left-0.5 translate-x-0" : "left-0.5 translate-x-full"
          }`}
        />
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={(event) => handleSelect(option.value, event)}
              className={`theme-switch-option focus-ring relative z-10 flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "text-brand-teal"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Sidebar theme control — matches nav-link styling with a compact switch.
 * One row: icon + label + thumb. Click anywhere to toggle (circular reveal).
 */
function SidebarThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  /** Show the mode you'll switch *to* — sun = go light, moon = go dark */
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Light mode" : "Dark mode";

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    toggleTheme({ x: event.clientX, y: event.clientY });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={getToggleLabel(theme)}
      aria-pressed={isDark}
      className="sidebar-theme-toggle focus-ring group relative w-full rounded-lg text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-surface-hover hover:text-text-primary"
    >
      <span
        className={`sidebar-row sidebar-nav-content w-full ${
          collapsed ? "" : "sidebar-row--trailing"
        }`}
      >
        <span className="sidebar-icon-slot">
          <Icon
            key={theme}
            size={18}
            className="text-text-muted transition-colors group-hover:text-brand-teal"
            aria-hidden="true"
          />
        </span>
        <span
          className={`sidebar-reveal-label min-w-0 truncate text-left ${
            collapsed ? "sidebar-reveal-label--hidden" : ""
          }`}
          aria-hidden={collapsed}
        >
          {label}
        </span>
        {!collapsed && (
          <span
            aria-hidden="true"
            className={`theme-sidebar-switch relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border-strong bg-bg-elevated p-0.5 transition-colors ${
              isDark ? "theme-sidebar-switch--dark" : ""
            }`}
          >
            <span
              className={`theme-sidebar-switch-thumb h-3.5 w-3.5 rounded-full bg-brand-teal shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${
                isDark ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        )}
      </span>
      <SidebarTooltip label={label} show={collapsed} />
    </button>
  );
}

export function ThemeToggle({
  variant = "icon",
  collapsed = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  function handleIconToggle(event: MouseEvent<HTMLButtonElement>) {
    toggleTheme({ x: event.clientX, y: event.clientY });
  }

  if (variant === "segmented") {
    return <ThemeSwitch className={className} />;
  }

  if (variant === "sidebar") {
    return <SidebarThemeToggle collapsed={collapsed} />;
  }

  return (
    <button
      type="button"
      onClick={handleIconToggle}
      aria-label={getToggleLabel(theme)}
      className={`focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border-strong bg-bg-elevated text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary ${className}`}
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}

export function ThemeToggleCompact({
  className = "",
}: {
  className?: string;
}) {
  return <ThemeSwitch collapsed className={className} />;
}
