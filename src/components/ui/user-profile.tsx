"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UserProfileProps {
  collapsed?: boolean;
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setEmail(session?.user.email ?? "");
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.replace("/auth");
    router.refresh();
  }

  const initial = email.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-3 ${
        collapsed ? "flex-col" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-bg-sidebar" />
      </div>

      {/* Info */}
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
        className={`focus-ring rounded-md p-1.5 text-text-muted hover:bg-rose-500/10 hover:text-rose-400 ${
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
