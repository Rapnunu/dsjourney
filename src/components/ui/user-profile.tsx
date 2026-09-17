"use client";

import { useEffect, useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { signOutAction } from "@/app/auth/actions";

interface UserProfileProps {
  collapsed?: boolean;
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void authClient.getSession().then(({ data }) => {
      setEmail(data?.user?.email ?? "");
    });
  }, []);

  function handleSignOut() {
    setError("");
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

  const initial = email.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-3 ${
        collapsed ? "flex-col" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-bg-sidebar" />
      </div>

      {!collapsed && (
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium text-text-primary truncate">
            Account
          </span>
          <span className="text-xs text-text-muted truncate">
            {email || "Signed in"}
          </span>
          {error && <span className="text-[10px] text-rose-400">{error}</span>}
        </div>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className={`focus-ring rounded-md p-1.5 text-text-muted hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60 ${
          collapsed ? "" : "ml-auto"
        }`}
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
