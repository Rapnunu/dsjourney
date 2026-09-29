"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { markSigningOut } from "@/lib/api/auth-expiry";
import { signOutAction } from "@/app/auth/actions";
import { SidebarTooltip } from "@/components/layout/sidebar-tooltip";

interface UserProfileProps {
  collapsed?: boolean;
}

function ProfileAvatar({
  initial,
  compact = false,
}: {
  initial: string;
  compact?: boolean;
}) {
  const sizeClass = compact ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm";

  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center justify-center rounded-full bg-bg-elevated font-semibold text-brand-teal ${sizeClass}`}
      >
        {initial}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-sidebar bg-success" />
    </div>
  );
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void authClient.getSession().then(({ data }) => {
      setEmail(data?.user?.email ?? "");
      setName(data?.user?.name ?? "");
    });
  }, []);

  const trimmedName = name.trim();
  const displayName =
    trimmedName || (email ? email.split("@")[0] : "Signed in");
  const initialSource = trimmedName || email;
  const initial = initialSource.charAt(0).toUpperCase() || "U";

  function handleSignOut() {
    setError("");
    markSigningOut();
    startTransition(async () => {
      try {
        const result = await signOutAction();

        if ("error" in result) {
          setError(result.error);
          return;
        }

        window.location.replace("/auth");
      } catch (signOutError) {
        setError(
          signOutError instanceof Error
            ? signOutError.message
            : "Unable to sign out.",
        );
      }
    });
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group relative focus-ring w-full rounded-lg text-left transition-colors hover:bg-bg-surface-hover"
          aria-label={
            error
              ? `Open profile menu. Sign out failed: ${error}`
              : "Open profile menu"
          }
        >
          <span
            className={`sidebar-row sidebar-nav-content w-full ${
              collapsed ? "" : "sidebar-row--trailing"
            }`}
          >
            <span className="sidebar-icon-slot">
              <ProfileAvatar initial={initial} compact />
            </span>
            {!collapsed && (
              <>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text-primary">
                    {displayName}
                  </span>
                  <span className="block truncate text-xs text-text-secondary">
                    {email || "Signed in"}
                  </span>
                  {error && (
                    <span className="block truncate text-[10px] text-danger">
                      {error}
                    </span>
                  )}
                </span>
                <ChevronUp
                  size={16}
                  className={`shrink-0 text-text-muted transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </>
            )}
          </span>
          <SidebarTooltip label={displayName} show={collapsed} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={collapsed ? "right" : "top"}
          align={collapsed ? "end" : "start"}
          sideOffset={8}
          collisionPadding={12}
          className="profile-menu-content z-50 w-[min(17rem,calc(100vw-1.5rem))] overflow-hidden rounded-[10px] border border-border-subtle bg-bg-surface p-1 shadow-[0_8px_24px_rgba(0,0,0,0.32)] focus:outline-none"
        >
          <div className="border-b border-border-subtle px-3 py-3">
            <div className="flex items-center gap-3">
              <ProfileAvatar initial={initial} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {displayName}
                </p>
                <p className="truncate text-xs text-text-secondary">
                  {email || "Signed in"}
                </p>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-[11px] text-danger">{error}</p>
            )}
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="focus-ring flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2.5 text-sm text-text-secondary outline-none transition-colors hover:bg-bg-elevated hover:text-text-primary data-[highlighted]:bg-bg-elevated data-[highlighted]:text-text-primary"
              onClick={() => setOpen(false)}
            >
              <Settings size={16} className="text-text-muted" />
              Settings
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            disabled={isPending}
            onSelect={(event) => {
              event.preventDefault();
              handleSignOut();
            }}
            className="focus-ring flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2.5 text-sm text-text-secondary outline-none transition-colors hover:bg-danger/10 hover:text-danger data-[disabled]:opacity-60 data-[highlighted]:bg-danger/10 data-[highlighted]:text-danger"
          >
            <LogOut size={16} />
            {isPending ? "Signing out..." : "Sign Out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
