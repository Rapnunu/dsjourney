import { toast } from "sonner";
import type { UserFriendlyError } from "@/lib/api/user-friendly-error";
import { getUserFriendlyApiError } from "@/lib/api/user-friendly-error";
import {
  AUTH_EXPIRED_TOAST_ID,
  handleAuthExpiredFromApi,
} from "@/lib/api/auth-expiry";
import { isApiError } from "@/lib/api/api-error";

const SUCCESS_DURATION_MS = 2800;
const ERROR_DURATION_MS = 4500;

export const MUTATION_ERROR_TOAST_ID = "mutation-error";
export const ROADMAP_UPDATE_SUCCESS_TOAST_ID = "roadmap-update-success";

function buildToastContent(description?: string) {
  return description ? { description } : {};
}

export function showSuccessToast(
  title: string,
  description?: string,
  options?: { id?: string },
) {
  toast.success(title, {
    id: options?.id,
    ...buildToastContent(description),
    duration: SUCCESS_DURATION_MS,
    closeButton: false,
  });
}

export function showErrorToast(
  title: string,
  description?: string,
  options?: { id?: string },
) {
  toast.error(title, {
    id: options?.id,
    ...buildToastContent(description),
    duration: ERROR_DURATION_MS,
    closeButton: true,
  });
}

export function showSessionExpiredToast() {
  toast.error("Your session has expired.", {
    id: AUTH_EXPIRED_TOAST_ID,
    description: "Please sign in again.",
    duration: ERROR_DURATION_MS,
    closeButton: true,
  });
}

export function showFriendlyError(
  error: unknown,
  context?: "load" | "save" | "delete" | "update",
  override?: Partial<UserFriendlyError>,
) {
  if (isApiError(error) && error.status === 401) {
    handleAuthExpiredFromApi();
    return;
  }

  const friendly = {
    ...getUserFriendlyApiError(error, context),
    ...override,
  };

  const toastId =
    context === "save" || context === "update" || context === "delete"
      ? MUTATION_ERROR_TOAST_ID
      : undefined;

  showErrorToast(friendly.title, friendly.description, { id: toastId });
}
