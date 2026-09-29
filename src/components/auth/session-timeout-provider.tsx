"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { verifyAuthenticatedSessionAction } from "@/app/auth/session-actions";
import {
  handleAuthExpiredFromApi,
  markSigningOut,
} from "@/lib/api/auth-expiry";
import { IdleSessionManager } from "@/lib/auth/session-timeout/idle-session-manager";
import { performIdleTimeoutSignOut } from "@/lib/auth/session-timeout/perform-idle-timeout-sign-out";
import { subscribeToSessionTimeoutSync } from "@/lib/auth/session-timeout/sync";
import { SessionTimeoutDialog } from "@/components/auth/session-timeout-dialog";

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export function SessionTimeoutProvider({
  children,
}: SessionTimeoutProviderProps) {
  const pathname = usePathname();
  const managerRef = useRef<IdleSessionManager | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"stay" | "sign-out" | null>(
    null,
  );

  useEffect(() => {
    const manager = new IdleSessionManager({
      onEnterWarning: () => {
        setWarningOpen(true);
      },
      onExitWarning: () => {
        setWarningOpen(false);
        setLoadingAction(null);
      },
      onTimeout: () => {
        setWarningOpen(false);
        void performIdleTimeoutSignOut();
      },
    });

    managerRef.current = manager;
    manager.start();

    const unsubscribe = subscribeToSessionTimeoutSync({
      onActivityUpdate: (timestamp) => {
        manager.applyExternalActivity(timestamp);
      },
      onIdleTimeout: () => {
        setWarningOpen(false);
        void performIdleTimeoutSignOut();
      },
    });

    return () => {
      unsubscribe();
      manager.stop();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    managerRef.current?.recordActivity();
  }, [pathname]);

  const handleStaySignedIn = useCallback(async () => {
    setLoadingAction("stay");

    const result = await verifyAuthenticatedSessionAction();

    if (!result.valid) {
      setLoadingAction(null);
      setWarningOpen(false);
      handleAuthExpiredFromApi();
      return;
    }

    managerRef.current?.recordActivity({ force: true });
    setWarningOpen(false);
    setLoadingAction(null);
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoadingAction("sign-out");
    markSigningOut();

    try {
      const result = await signOutAction();

      if ("error" in result) {
        setLoadingAction(null);
        return;
      }

      window.location.replace("/auth");
    } catch {
      setLoadingAction(null);
    }
  }, []);

  return (
    <>
      {children}
      <SessionTimeoutDialog
        open={warningOpen}
        loadingAction={loadingAction}
        onStaySignedIn={() => {
          void handleStaySignedIn();
        }}
        onSignOut={() => {
          void handleSignOut();
        }}
      />
    </>
  );
}
