import {
  IDLE_TIMEOUT_EVENT_STORAGE_KEY,
  LAST_ACTIVITY_STORAGE_KEY,
} from "@/lib/auth/session-timeout/constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readLastActivityTimestamp(): number {
  if (!isBrowser()) {
    return Date.now();
  }

  try {
    const raw = localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);

    if (!raw) {
      return Date.now();
    }

    const parsed = Number.parseInt(raw, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return Date.now();
    }

    return parsed;
  } catch {
    return Date.now();
  }
}

export function writeLastActivityTimestamp(timestamp: number): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(timestamp));
  } catch {
    // Ignore storage failures.
  }
}

export function broadcastIdleTimeoutEvent(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      IDLE_TIMEOUT_EVENT_STORAGE_KEY,
      String(Date.now()),
    );
  } catch {
    // Ignore storage failures.
  }
}

export function clearSessionTimeoutStorage(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
    localStorage.removeItem(IDLE_TIMEOUT_EVENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
