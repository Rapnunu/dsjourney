import { isApiError } from "./api-error";
import { handleAuthExpiredFromApi } from "./auth-expiry";
import {
  ROADMAP_UPDATE_SUCCESS_TOAST_ID,
  showFriendlyError,
  showSuccessToast,
} from "@/lib/toast";

export type MutationResult =
  | { ok: true }
  | { ok: false; error: unknown };

export type MutationErrorContext = "save" | "update" | "delete";

export function mutationOk(): MutationResult {
  return { ok: true };
}

export function mutationFailed(error: unknown): MutationResult {
  return { ok: false, error };
}

/** Single owner for mutation error toasts in feature views. */
export function reportMutationError(
  error: unknown,
  context: MutationErrorContext,
): void {
  if (isApiError(error) && error.status === 401) {
    handleAuthExpiredFromApi();
    return;
  }

  showFriendlyError(error, context);
}

export function handleMutationResult(
  result: MutationResult,
  context: MutationErrorContext,
  successMessage?: string,
  options?: { successToastId?: string },
): boolean {
  if (result.ok) {
    if (successMessage) {
      showSuccessToast(successMessage, undefined, {
        id: options?.successToastId,
      });
    }
    return true;
  }

  reportMutationError(result.error, context);
  return false;
}

export function handleRoadmapMutationResult(result: MutationResult): boolean {
  return handleMutationResult(result, "update", "Roadmap updated", {
    successToastId: ROADMAP_UPDATE_SUCCESS_TOAST_ID,
  });
}
