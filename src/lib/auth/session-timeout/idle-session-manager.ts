import {
  ACTIVITY_SYNC_THROTTLE_MS,
  IDLE_CHECK_INTERVAL_MS,
  IDLE_TIMEOUT_MS,
  IDLE_WARNING_THRESHOLD_MS,
} from "@/lib/auth/session-timeout/constants";
import {
  readLastActivityTimestamp,
  writeLastActivityTimestamp,
} from "@/lib/auth/session-timeout/storage";
import { publishActivityUpdate } from "@/lib/auth/session-timeout/sync";

export type IdleSessionManagerCallbacks = {
  onEnterWarning: () => void;
  onExitWarning: () => void;
  onTimeout: () => void;
};

type IdleSessionState = "active" | "warning";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "scroll",
] as const;

export class IdleSessionManager {
  private state: IdleSessionState = "active";
  private checkTimer: number | null = null;
  private lastPersistedActivity = 0;
  private lastLocalActivityWrite = 0;
  private readonly removeActivityListeners: Array<() => void> = [];

  constructor(private readonly callbacks: IdleSessionManagerCallbacks) {}

  start(): void {
    const now = Date.now();
    this.persistActivity(now, true);
    this.attachActivityListeners();
    this.scheduleEvaluation();
  }

  stop(): void {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer);
      this.checkTimer = null;
    }

    for (const removeListener of this.removeActivityListeners) {
      removeListener();
    }

    this.removeActivityListeners.length = 0;
  }

  recordActivity(options?: { force?: boolean }): void {
    if (this.state === "warning" && !options?.force) {
      return;
    }

    const now = Date.now();

    if (
      !options?.force &&
      now - this.lastLocalActivityWrite < ACTIVITY_SYNC_THROTTLE_MS
    ) {
      return;
    }

    this.persistActivity(now, options?.force ?? false);

    if (options?.force && this.state === "warning") {
      this.state = "active";
      this.callbacks.onExitWarning();
    }

    this.scheduleEvaluation();
  }

  applyExternalActivity(timestamp: number): void {
    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      return;
    }

    if (timestamp <= this.lastPersistedActivity) {
      this.evaluateIdleState();
      return;
    }

    this.lastPersistedActivity = timestamp;
    this.lastLocalActivityWrite = timestamp;

    if (this.state === "warning") {
      this.evaluateIdleState();
      return;
    }

    this.scheduleEvaluation();
  }

  evaluateIdleState(): void {
    const lastActivity = Math.max(
      this.lastPersistedActivity,
      readLastActivityTimestamp(),
    );
    const now = Date.now();
    const idleMs = now - lastActivity;

    if (idleMs >= IDLE_TIMEOUT_MS) {
      this.stop();
      this.callbacks.onTimeout();
      return;
    }

    if (idleMs >= IDLE_WARNING_THRESHOLD_MS) {
      if (this.state !== "warning") {
        this.state = "warning";
        this.callbacks.onEnterWarning();
      }

      this.scheduleEvaluation(Math.max(250, IDLE_TIMEOUT_MS - idleMs));
      return;
    }

    if (this.state === "warning") {
      this.state = "active";
      this.callbacks.onExitWarning();
    }

    this.scheduleEvaluation();
  }

  private persistActivity(timestamp: number, broadcast: boolean): void {
    this.lastPersistedActivity = timestamp;
    this.lastLocalActivityWrite = timestamp;
    writeLastActivityTimestamp(timestamp);

    if (broadcast) {
      publishActivityUpdate(timestamp);
    }
  }

  private attachActivityListeners(): void {
    const handleActivity = () => {
      this.recordActivity();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        this.evaluateIdleState();
      }
    };

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, handleActivity, { passive: true });
      this.removeActivityListeners.push(() => {
        window.removeEventListener(eventName, handleActivity);
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    this.removeActivityListeners.push(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  }

  private scheduleEvaluation(delayMs?: number): void {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer);
    }

    const lastActivity = Math.max(
      this.lastPersistedActivity,
      readLastActivityTimestamp(),
    );
    const now = Date.now();
    const idleMs = now - lastActivity;
    const untilWarning = IDLE_WARNING_THRESHOLD_MS - idleMs;
    const untilTimeout = IDLE_TIMEOUT_MS - idleMs;

    let delay = delayMs;

    if (delay === undefined) {
      if (untilWarning > 0) {
        delay = Math.min(IDLE_CHECK_INTERVAL_MS, untilWarning);
      } else {
        delay = Math.min(IDLE_CHECK_INTERVAL_MS, Math.max(untilTimeout, 250));
      }
    }

    this.checkTimer = window.setTimeout(() => {
      this.evaluateIdleState();
    }, Math.max(250, delay));
  }
}

export function formatIdleCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getRemainingIdleMs(lastActivityTimestamp?: number): number {
  const lastActivity = lastActivityTimestamp ?? readLastActivityTimestamp();
  const idleMs = Date.now() - lastActivity;

  return Math.max(0, IDLE_TIMEOUT_MS - idleMs);
}
