import { toast } from "sonner";
import type { UserFriendlyError } from "@/lib/api/user-friendly-error";
import { getUserFriendlyApiError } from "@/lib/api/user-friendly-error";
import {
  AUTH_EXPIRED_TOAST_ID,
  handleAuthExpiredFromApi,
} from "@/lib/api/auth-expiry";
import { ApiError } from "@/lib/api/api-error";

export function showSuccessToast(title: string, description?: string) {
  toast.success(title, { description });
}

export function showErrorToast(title: string, description?: string) {
  toast.error(title, { description });
}

export function showSessionExpiredToast() {
  toast.error("Your session has expired.", {
    id: AUTH_EXPIRED_TOAST_ID,
    description: "Please sign in again.",
  });
}

export function showFriendlyError(
  error: unknown,
  context?: "load" | "save" | "delete" | "update",
  override?: Partial<UserFriendlyError>,
) {
  if (error instanceof ApiError && error.status === 401) {
    handleAuthExpiredFromApi();
    return;
  }

  const friendly = {
    ...getUserFriendlyApiError(error, context),
    ...override,
  };

  showErrorToast(friendly.title, friendly.description);
}
