"use client";

import { useState, useTransition } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { dashboardBtnPrimary } from "@/components/dashboard/styles";
import { changePasswordAction } from "@/app/settings/actions";
import {
  getPasswordPolicyErrorMessage,
  validatePassword,
} from "@/lib/auth/password-policy";

interface ChangePasswordFormProps {
  enabled: boolean;
}

export function ChangePasswordForm({ enabled }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!enabled) {
    return (
      <p className="text-sm text-text-secondary">
        Password sign-in is not linked to this account, so password changes are
        not available here.
      </p>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword.trim()) {
      setError("Enter your current password.");
      return;
    }

    const passwordPolicyError = getPasswordPolicyErrorMessage(newPassword);
    if (passwordPolicyError) {
      setError(passwordPolicyError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
    });
  }

  const canSubmit =
    currentPassword.length > 0 &&
    validatePassword(newPassword).valid &&
    newPassword === confirmPassword;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PasswordInput
        id="settings-current-password"
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
        error={undefined}
      />
      <PasswordInput
        id="settings-new-password"
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
        error={undefined}
      />
      <PasswordRequirements password={newPassword} id="settings-password-requirements" />
      <PasswordInput
        id="settings-confirm-password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        error={undefined}
      />

      {error && (
        <p
          role="alert"
          className="rounded-[9px] border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-[9px] border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className={`${dashboardBtnPrimary} min-h-11`}
      >
        {isPending ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
