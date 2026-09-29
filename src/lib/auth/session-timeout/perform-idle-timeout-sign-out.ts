import { signOutAction } from "@/app/auth/actions";
import {
  markIdleTimeoutSignOut,
  markSigningOut,
} from "@/lib/api/auth-expiry";
import {
  broadcastIdleTimeoutEvent,
  clearSessionTimeoutStorage,
} from "@/lib/auth/session-timeout/storage";
import { publishIdleTimeout } from "@/lib/auth/session-timeout/sync";

const IDLE_TIMEOUT_IN_PROGRESS_KEY = "dsjourney:idle-timeout-in-progress";

let idleTimeoutSignOutPromise: Promise<void> | null = null;

export function clearIdleTimeoutRuntimeFlags(): void {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(IDLE_TIMEOUT_IN_PROGRESS_KEY);
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function claimIdleTimeoutSignOut(): boolean {
  if (!isBrowser()) {
    return false;
  }

  if (sessionStorage.getItem(IDLE_TIMEOUT_IN_PROGRESS_KEY) === "1") {
    return false;
  }

  sessionStorage.setItem(IDLE_TIMEOUT_IN_PROGRESS_KEY, "1");
  return true;
}

async function executeIdleTimeoutSignOut(): Promise<void> {
  markIdleTimeoutSignOut();
  markSigningOut();
  broadcastIdleTimeoutEvent();
  publishIdleTimeout();
  clearSessionTimeoutStorage();

  try {
    await signOutAction();
  } catch {
    // Redirect even if sign-out fails so the user is not left on an authenticated screen.
  }

  window.location.replace("/auth?reason=timeout");
}

/** Single-flight idle timeout sign-out with real Neon Auth invalidation. */
export function performIdleTimeoutSignOut(): Promise<void> {
  if (!isBrowser()) {
    return Promise.resolve();
  }

  if (idleTimeoutSignOutPromise) {
    return idleTimeoutSignOutPromise;
  }

  if (!claimIdleTimeoutSignOut()) {
    if (window.location.pathname.startsWith("/auth")) {
      return Promise.resolve();
    }

    markIdleTimeoutSignOut();
    markSigningOut();
    window.location.replace("/auth?reason=timeout");
    return Promise.resolve();
  }

  idleTimeoutSignOutPromise = executeIdleTimeoutSignOut().finally(() => {
    idleTimeoutSignOutPromise = null;
  });

  return idleTimeoutSignOutPromise;
}
