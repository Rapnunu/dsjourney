"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import { deleteAccountAction } from "@/app/settings/actions";
import { markSigningOut } from "@/lib/api/auth-expiry";
import { clearUserLocalState } from "@/lib/storage";

interface DeleteAccountDialogProps {
  open: boolean;
  hasCredentialAccount: boolean;
  onOpenChange: (open: boolean) => void;
}

const DELETE_CONFIRMATION_TEXT = "DELETE";

export function DeleteAccountDialog({
  open,
  hasCredentialAccount,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const confirmationMatches = confirmation === DELETE_CONFIRMATION_TEXT;
  const passwordReady = !hasCredentialAccount || password.trim().length > 0;
  const canDelete = confirmationMatches && passwordReady && !isPending;

  function resetDialogState() {
    setConfirmation("");
    setPassword("");
    setError("");
  }

  function handleClose() {
    if (isPending) {
      return;
    }

    resetDialogState();
    onOpenChange(false);
  }

  function handleDelete() {
    if (!canDelete) {
      return;
    }

    setError("");
    markSigningOut();

    startTransition(async () => {
      const result = await deleteAccountAction(
        confirmation,
        hasCredentialAccount ? password : undefined,
      );

      if ("error" in result) {
        setError(result.error);
        return;
      }

      clearUserLocalState();
      window.location.replace("/auth?account=deleted");
    });
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(true);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg-overlay" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[10px] border border-border-subtle bg-bg-surface p-5 shadow-sm focus:outline-none"
          onEscapeKeyDown={(event) => {
            if (isPending) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (isPending) event.preventDefault();
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertTriangle size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold text-text-primary">
                Delete Account
              </Dialog.Title>
              <Dialog.Description className="mt-2 space-y-3 text-sm leading-relaxed text-text-secondary">
                <p>
                  Deleting your account permanently removes your DSJourney account
                  and associated application data. This cannot be undone.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>DSJourney authentication account</li>
                  <li>Roadmap progress</li>
                  <li>Study sessions</li>
                  <li>Portfolio projects</li>
                </ul>
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isPending}
                className="rounded-md p-1 text-text-muted hover:bg-bg-elevated hover:text-text-primary focus-ring disabled:opacity-50"
                aria-label="Close dialog"
                onClick={handleClose}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 space-y-4">
            {hasCredentialAccount && (
              <PasswordInput
                id="delete-account-password"
                label="Current Password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            )}

            <div>
              <label
                htmlFor="delete-account-confirmation"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Type DELETE to confirm
              </label>
              <input
                id="delete-account-confirmation"
                type="text"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={isPending}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg border border-border-strong bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal disabled:opacity-60"
                placeholder="DELETE"
              />
            </div>

            {error && (
              <div role="alert" className="space-y-1">
                <p className="text-sm font-medium text-danger">
                  Couldn&apos;t delete account
                </p>
                <p className="text-sm text-danger/90">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isPending}
              onClick={handleClose}
              className="min-h-11 rounded-lg border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-surface-hover focus-ring disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canDelete}
              onClick={handleDelete}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger/90 focus-ring disabled:opacity-60"
            >
              {isPending && <LoaderCircle size={15} className="animate-spin" />}
              {isPending ? "Deleting..." : "Permanently Delete Account"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
