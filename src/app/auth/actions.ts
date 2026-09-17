"use server";

import { redirect } from "next/navigation";
import { MIN_PASSWORD_LENGTH } from "@/lib/api/validation-limits";
import { getTestAccountCredentials, isDemoLoginEnvironment } from "@/lib/auth/demo-login";
import { auth } from "@/lib/auth/server";

export async function signInAction(
  email: string,
  password: string,
): Promise<{ error: string } | undefined> {
  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Failed to sign in. Try again." };
  }

  redirect("/today");
}

export async function signUpAction(
  email: string,
  password: string,
): Promise<{ error: string } | undefined> {
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

  redirect("/today");
}

export async function signOutAction() {
  await auth.signOut();
  redirect("/auth");
}

export async function demoLoginAction(): Promise<{ error: string } | undefined> {
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

  redirect("/today");
}
