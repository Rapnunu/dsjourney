/**
 * Reusable localStorage utility for the DS Prep Tracker.
 *
 * Provides typed helpers for reading and writing Study Sessions.
 * Falls back gracefully when localStorage is unavailable (SSR)
 * or contains invalid JSON.
 */

import type { StudySession } from "@/features/sessions/types";

// ── Constants ──────────────────────────────────────────────
const SESSIONS_KEY = "ds-prep-tracker:sessions";

// ── Helpers ────────────────────────────────────────────────

/**
 * Read sessions from localStorage.
 * Returns `null` when:
 *  - running on the server (no `window`)
 *  - no entry exists yet
 *  - the stored JSON is invalid / corrupted
 */
export function getStoredSessions(): StudySession[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);

    // Basic runtime guard: make sure we got an array
    if (!Array.isArray(parsed)) return null;

    return parsed as StudySession[];
  } catch {
    // JSON.parse failed → corrupted data
    return null;
  }
}

/**
 * Write sessions to localStorage.
 * Silently no-ops on the server or if localStorage throws.
 */
export function saveStoredSessions(sessions: StudySession[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Storage full or unavailable – nothing we can do here
    console.warn("Failed to save sessions to localStorage.");
  }
}
