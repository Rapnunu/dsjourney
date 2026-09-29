import { getApiErrorRetryAfterSeconds, isApiError } from "./api-error";

export interface UserFriendlyError {
  title: string;
  description: string;
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof Error && error.message.toLowerCase().includes("fetch")) {
    return true;
  }
  return false;
}

export function getUserFriendlyApiError(
  error: unknown,
  context?: "load" | "save" | "delete" | "update",
): UserFriendlyError {
  if (isNetworkError(error)) {
    return {
      title: "Connection issue",
      description:
        "We couldn't reach the server. Check your connection and try again.",
    };
  }

  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return {
          title: "Invalid request",
          description:
            "Some of the information provided isn't valid. Please review your entries and try again.",
        };
      case 401:
        return {
          title: "Your session has expired.",
          description: "Please sign in again.",
        };
      case 403:
        return {
          title: "Action not allowed",
          description: "You don't have permission to perform this action.",
        };
      case 404:
        return {
          title: "Not found",
          description: "The item you're looking for may have been removed.",
        };
      case 409:
        return {
          title: "Conflict",
          description:
            "This change conflicts with existing data. Refresh and try again.",
        };
      case 413:
        return {
          title: "Import too large",
          description: "The file or data set is too large to import.",
        };
      case 429: {
        const retryAfterSeconds = getApiErrorRetryAfterSeconds(error);
        const retryHint =
          typeof retryAfterSeconds === "number"
            ? `You can try again in about ${retryAfterSeconds} seconds.`
            : "Please wait a moment and try again.";

        return {
          title: "Too many requests",
          description: retryHint,
        };
      }
      default:
        if (error.status >= 500) {
          return {
            title: context === "load" ? "Couldn't load your data" : "Couldn't save changes",
            description:
              "Something went wrong on our end. Please try again in a moment.",
          };
        }
        break;
    }
  }

  const fallbackTitle =
    context === "load"
      ? "Couldn't load your data"
      : context === "delete"
        ? "Couldn't delete item"
        : "Couldn't save changes";

  return {
    title: fallbackTitle,
    description: "Something went wrong. Please try again.",
  };
}
