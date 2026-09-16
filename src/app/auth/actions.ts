"use server";

import { redirect } from "next/navigation";
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
