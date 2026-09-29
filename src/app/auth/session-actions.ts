"use server";

import { auth } from "@/lib/auth/server";

export type VerifyAuthenticatedSessionResult =
  | { valid: true }
  | { valid: false };

/**
 * Validates the current request session against the provider, bypassing Neon
 * session_data and Better Auth cookie caches.
 */
export async function verifyAuthenticatedSessionAction(): Promise<VerifyAuthenticatedSessionResult> {
  const { data, error } = await auth.getSession({
    query: { disableCookieCache: "true" },
  });

  if (error || !data?.user || !data?.session) {
    return { valid: false };
  }

  return { valid: true };
}
