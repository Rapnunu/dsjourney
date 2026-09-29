"use server";

import {
  getPasswordPolicyErrorMessage,
} from "@/lib/auth/password-policy";
import { parseLinkedAccounts } from "@/lib/auth/account-providers";
import { mapAuthErrorMessage } from "@/lib/auth/auth-errors";
import { auth } from "@/lib/auth/server";
import { requireUser } from "@/lib/auth/require-user";
import { deleteAllUserData } from "@/lib/repositories/user-data";

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

export type SettingsActionResult =
  | { success: true }
  | { error: string };

export interface SettingsAccountData {
  email: string;
  name: string;
  emailVerified: boolean;
  signInMethodLabels: string[];
  hasCredentialAccount: boolean;
  providersUnavailable: boolean;
}

const DELETE_CONFIRMATION_TEXT = "DELETE";

function mapSettingsError(
  error: AuthErrorLike,
  context: "settings" | "account-deletion",
): SettingsActionResult {
  return { error: mapAuthErrorMessage(error, context) };
}

export async function getSettingsAccountData(): Promise<SettingsAccountData | null> {
  const { data: session, error } = await auth.getSession();

  if (error || !session?.user) {
    return null;
  }

  const { data: accounts, error: accountsError } = await auth.listAccounts();
  const linkedAccounts = parseLinkedAccounts(accounts);

  return {
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    emailVerified: Boolean(session.user.emailVerified),
    signInMethodLabels: linkedAccounts.signInMethodLabels,
    hasCredentialAccount: linkedAccounts.hasCredentialAccount,
    providersUnavailable: Boolean(accountsError),
  };
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<SettingsActionResult> {
  const trimmedCurrent = currentPassword.trim();
  const trimmedConfirm = confirmPassword.trim();

  if (!trimmedCurrent) {
    return { error: "Enter your current password." };
  }

  if (!newPassword) {
    return { error: "Enter a new password." };
  }

  const passwordPolicyError = getPasswordPolicyErrorMessage(newPassword);
  if (passwordPolicyError) {
    return { error: passwordPolicyError };
  }

  if (newPassword !== trimmedConfirm) {
    return { error: "New passwords do not match." };
  }

  if (newPassword === trimmedCurrent) {
    return { error: "New password must be different from your current password." };
  }

  const { data: accounts } = await auth.listAccounts();
  const { hasCredentialAccount } = parseLinkedAccounts(accounts);

  if (!hasCredentialAccount) {
    return { error: "Password change is not available for this account." };
  }

  const { error } = await auth.changePassword({
    currentPassword: trimmedCurrent,
    newPassword,
    revokeOtherSessions: true,
  });

  if (error) {
    return mapSettingsError(error, "settings");
  }

  return { success: true };
}

export async function deleteAccountAction(
  confirmation: string,
  password?: string,
): Promise<SettingsActionResult> {
  if (confirmation !== DELETE_CONFIRMATION_TEXT) {
    return { error: "Type DELETE to confirm account deletion." };
  }

  let userId: string;

  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return { error: "Authentication required." };
  }

  const { data: accounts } = await auth.listAccounts();
  const { hasCredentialAccount } = parseLinkedAccounts(accounts);
  const trimmedPassword = password?.trim() ?? "";

  if (hasCredentialAccount && !trimmedPassword) {
    return { error: "Enter your current password to confirm account deletion." };
  }

  try {
    await deleteAllUserData(userId);
  } catch {
    return {
      error:
        "Couldn't delete account. We couldn't complete the account deletion. Please try again.",
    };
  }

  const deleteParams =
    hasCredentialAccount && trimmedPassword
      ? { password: trimmedPassword }
      : {};

  const { error } = await auth.deleteUser(deleteParams);

  if (error) {
    const friendlyMessage = mapAuthErrorMessage(error, "account-deletion");

    if (
      friendlyMessage === "Something went wrong. Please try again." ||
      friendlyMessage.startsWith("We couldn't")
    ) {
      return {
        error:
          "We couldn't complete the account deletion. Please try again.",
      };
    }

    return { error: friendlyMessage };
  }

  await auth.signOut();

  return { success: true };
}
