import {
  IDLE_TIMEOUT_EVENT_STORAGE_KEY,
  LAST_ACTIVITY_STORAGE_KEY,
  SESSION_TIMEOUT_BROADCAST_CHANNEL,
} from "@/lib/auth/session-timeout/constants";

export type SessionTimeoutSyncHandlers = {
  onActivityUpdate: (timestamp: number) => void;
  onIdleTimeout: () => void;
};

type SessionTimeoutBroadcastMessage =
  | { type: "activity"; timestamp: number }
  | { type: "timeout" };

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function publishActivityUpdate(timestamp: number): void {
  if (!isBrowser()) {
    return;
  }

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(SESSION_TIMEOUT_BROADCAST_CHANNEL);
    channel.postMessage({
      type: "activity",
      timestamp,
    } satisfies SessionTimeoutBroadcastMessage);
    channel.close();
  }
}

export function publishIdleTimeout(): void {
  if (!isBrowser()) {
    return;
  }

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(SESSION_TIMEOUT_BROADCAST_CHANNEL);
    channel.postMessage({ type: "timeout" } satisfies SessionTimeoutBroadcastMessage);
    channel.close();
  }
}

export function subscribeToSessionTimeoutSync(
  handlers: SessionTimeoutSyncHandlers,
): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(SESSION_TIMEOUT_BROADCAST_CHANNEL)
      : null;

  const handleMessage = (event: MessageEvent<SessionTimeoutBroadcastMessage>) => {
    if (event.data?.type === "activity") {
      handlers.onActivityUpdate(event.data.timestamp);
      return;
    }

    if (event.data?.type === "timeout") {
      handlers.onIdleTimeout();
    }
  };

  channel?.addEventListener("message", handleMessage);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === LAST_ACTIVITY_STORAGE_KEY && event.newValue) {
      const timestamp = Number.parseInt(event.newValue, 10);

      if (Number.isFinite(timestamp) && timestamp > 0) {
        handlers.onActivityUpdate(timestamp);
      }

      return;
    }

    if (event.key === IDLE_TIMEOUT_EVENT_STORAGE_KEY && event.newValue) {
      handlers.onIdleTimeout();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleMessage);
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
}
