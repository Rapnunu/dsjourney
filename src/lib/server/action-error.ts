import "server-only";

import { UnauthorizedError } from "@/lib/auth/require-user";

export function toUserFacingActionError(
  error: unknown,
  fallback = "Unable to complete the request.",
): Error {
  if (error instanceof UnauthorizedError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes("Missing required environment variable: DATABASE_URL")) {
      return new Error("Data store is not configured.");
    }

    return error;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Record<string, unknown>;
    const message =
      typeof candidate.message === "string" ? candidate.message : fallback;

    if (
      message.toLowerCase().includes("auth") ||
      message.toLowerCase().includes("session") ||
      message.toLowerCase().includes("unauthorized")
    ) {
      return new UnauthorizedError(message);
    }

    return new Error(message);
  }

  return new Error(fallback);
}

export function getActionErrorMessage(
  error: unknown,
  fallback = "Unable to complete the request.",
): string {
  return toUserFacingActionError(error, fallback).message;
}
