"use server";

import { MIN_PASSWORD_LENGTH } from "@/lib/api/validation-limits";
import { getTestAccountCredentials, isDemoLoginEnvironment } from "@/lib/auth/demo-login";
import { auth } from "@/lib/auth/server";

export type AuthActionResult = { success: true } | { error: string };

export async function signInAction(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Failed to sign in. Try again." };
  }

  return { success: true };
}

export async function signUpAction(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  const name = email.split("@")[0]?.trim() || "Account";

  const { error } = await auth.signUp.email({
    email,
    password,
    name,
  });

  if (error) {
    return { error: error.message || "Failed to create account." };
  }

  return { success: true };
}

export async function signOutAction(): Promise<AuthActionResult> {
  await auth.signOut();
  return { success: true };
}

export async function demoLoginAction(): Promise<AuthActionResult> {
  if (!isDemoLoginEnvironment()) {
    return { error: "Demo login is not available." };
  }

  const credentials = getTestAccountCredentials();

  if (!credentials) {
    return { error: "Test account is not configured." };
  }

  const { error } = await auth.signIn.email({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { error: error.message || "Demo sign-in failed. Try again." };
  }

  return { success: true };
}
