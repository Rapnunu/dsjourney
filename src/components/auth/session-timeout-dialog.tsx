"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Clock3, LoaderCircle } from "lucide-react";
import {
  formatIdleCountdown,
  getRemainingIdleMs,
} from "@/lib/auth/session-timeout/idle-session-manager";

interface SessionTimeoutDialogProps {
  open: boolean;
  loadingAction: "stay" | "sign-out" | null;
  onStaySignedIn: () => void;
  onSignOut: () => void;
}

export function SessionTimeoutDialog({
  open,
  loadingAction,
  onStaySignedIn,
  onSignOut,
}: SessionTimeoutDialogProps) {
  const [countdownLabel, setCountdownLabel] = useState(() =>
    formatIdleCountdown(getRemainingIdleMs()),
  );
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const updateCountdown = () => {
      const remainingMs = getRemainingIdleMs();
      const nextLabel = formatIdleCountdown(remainingMs);
      setCountdownLabel(nextLabel);

      const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      if (totalSeconds % 15 === 0 || totalSeconds <= 10) {
        setAriaLiveMessage(`You'll be signed out in ${nextLabel}.`);
      }
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [open]);

  const isBusy = loadingAction !== null;

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg-overlay" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-border-subtle bg-bg-surface p-5 shadow-sm focus:outline-none"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Clock3 size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold text-text-primary">
                Your session is about to expire
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-relaxed text-text-secondary">
                You&apos;ve been inactive for a while. You&apos;ll be signed out in 2
                minutes.
              </Dialog.Description>
              <p className="mt-3 text-sm font-medium text-text-primary">
                You&apos;ll be signed out in{" "}
                <span className="tabular-nums text-brand-teal">{countdownLabel}</span>.
              </p>
              <p aria-live="polite" className="sr-only">
                {ariaLiveMessage}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isBusy}
              onClick={onSignOut}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-surface-hover focus-ring disabled:opacity-60"
            >
              {loadingAction === "sign-out" && (
                <LoaderCircle size={15} className="animate-spin" />
              )}
              Sign Out
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onStaySignedIn}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-bg-primary transition-colors hover:bg-brand-teal/90 focus-ring disabled:opacity-60"
            >
              {loadingAction === "stay" && (
                <LoaderCircle size={15} className="animate-spin" />
              )}
              Stay Signed In
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
