import "server-only";

import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { apiRateLimits } from "@/lib/db/schema";
import { jsonError } from "@/lib/api/route-handler";

export type RateLimitCategory = "import" | "mutation";

const PRODUCTION_IMPORT_LIMIT = 10;
const PRODUCTION_MUTATION_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_DEV_RATE_LIMIT = 1_000;

const RATE_LIMIT_ERROR_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

function parseDevRateLimit(
  value: string | undefined,
  fallback: number,
): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number.parseInt(value.trim(), 10);

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_DEV_RATE_LIMIT) {
    return fallback;
  }

  return parsed;
}

function getRateLimitConfig(
  category: RateLimitCategory,
): { limit: number; windowMs: number } {
  if (process.env.NODE_ENV === "production") {
    return {
      limit:
        category === "import"
          ? PRODUCTION_IMPORT_LIMIT
          : PRODUCTION_MUTATION_LIMIT,
      windowMs: RATE_LIMIT_WINDOW_MS,
    };
  }

  return {
    limit:
      category === "import"
        ? parseDevRateLimit(
            process.env.DSJOURNEY_DEV_IMPORT_RATE_LIMIT,
            PRODUCTION_IMPORT_LIMIT,
          )
        : parseDevRateLimit(
            process.env.DSJOURNEY_DEV_MUTATION_RATE_LIMIT,
            PRODUCTION_MUTATION_LIMIT,
          ),
    windowMs: RATE_LIMIT_WINDOW_MS,
  };
}

function getWindowStartIso(windowMs: number): string {
  const windowStartMs =
    Math.floor(Date.now() / windowMs) * windowMs;

  return new Date(windowStartMs).toISOString();
}

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  userId: string,
  category: RateLimitCategory,
): Promise<RateLimitResult> {
  const config = getRateLimitConfig(category);
  const windowStart = getWindowStartIso(config.windowMs);
  const bucketKey = category;

  try {
    const db = getDb();
    const rows = await db
      .insert(apiRateLimits)
      .values({
        userId,
        bucketKey,
        windowStart,
        requestCount: 1,
      })
      .onConflictDoUpdate({
        target: [
          apiRateLimits.userId,
          apiRateLimits.bucketKey,
          apiRateLimits.windowStart,
        ],
        set: {
          requestCount: sql`${apiRateLimits.requestCount} + 1`,
        },
      })
      .returning({ requestCount: apiRateLimits.requestCount });

    const requestCount = rows[0]?.requestCount ?? 1;

    if (requestCount > config.limit) {
      const windowStartMs = new Date(windowStart).getTime();
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowStartMs + config.windowMs - Date.now()) / 1000),
      );

      return { limited: true, retryAfterSeconds };
    }

    return { limited: false };
  } catch (error) {
    console.error(
      "[rate-limit] Unable to enforce application rate limit. Apply the api_rate_limits migration before production.",
      error,
    );

    return { limited: false };
  }
}

export async function enforceRateLimit(
  userId: string,
  category: RateLimitCategory,
) {
  const result = await checkRateLimit(userId, category);

  if (!result.limited) {
    return null;
  }

  const headers =
    result.retryAfterSeconds !== undefined
      ? { "Retry-After": String(result.retryAfterSeconds) }
      : undefined;

  return jsonError(RATE_LIMIT_ERROR_MESSAGE, 429, headers);
}
