function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

const PRODUCTION_IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const PRODUCTION_WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000;

/** How often idle state is re-evaluated while the user remains active. */
export const IDLE_CHECK_INTERVAL_MS = 15 * 1000;

/** Minimum interval between persisted cross-tab activity sync writes. */
export const ACTIVITY_SYNC_THROTTLE_MS = 20 * 1000;

export const IDLE_TIMEOUT_MS =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_IDLE_TIMEOUT_MS
    : parsePositiveInt(
        process.env.NEXT_PUBLIC_DSJOURNEY_IDLE_TIMEOUT_MS,
        PRODUCTION_IDLE_TIMEOUT_MS,
      );

export const WARNING_BEFORE_TIMEOUT_MS =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_WARNING_BEFORE_TIMEOUT_MS
    : parsePositiveInt(
        process.env.NEXT_PUBLIC_DSJOURNEY_IDLE_WARNING_MS,
        PRODUCTION_WARNING_BEFORE_TIMEOUT_MS,
      );

export const IDLE_WARNING_THRESHOLD_MS =
  IDLE_TIMEOUT_MS - WARNING_BEFORE_TIMEOUT_MS;

export const SESSION_TIMEOUT_BROADCAST_CHANNEL = "dsjourney:session-timeout";
export const LAST_ACTIVITY_STORAGE_KEY = "dsjourney:last-activity";
export const IDLE_TIMEOUT_EVENT_STORAGE_KEY = "dsjourney:idle-timeout-event";
