"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getStoredSessions, saveStoredSessions } from "@/lib/storage";
import { mockSessions } from "./data";
import type { StudySession } from "./types";

// ── Context shape ────────────────────────────────────────────────────

interface SessionContextType {
  sessions: StudySession[];
  isHydrated: boolean;
  addSession: (data: Omit<StudySession, "id" | "createdAt">) => void;
  updateSession: (id: string, data: Omit<StudySession, "id" | "createdAt">) => void;
  deleteSession: (id: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────

/**
 * Single source of truth for study sessions across the entire app.
 *
 * Hydration strategy (Option A – explicit loading state):
 * - Initial state = empty array []. No mock data is ever rendered.
 * - `isHydrated` starts as false so consumers can show skeletons.
 * - After mount, localStorage is read exactly once:
 *   - If data exists → state is set to persisted data.
 *   - If no data exists (first visit) → deep-clone mockSessions,
 *     persist them, and use them as state.
 * - `isHydrated` is set to true once the data is resolved.
 * - CRUD helpers update React state and write to localStorage atomically.
 *
 * Because the initial render uses [] on both server and client, there is
 * no hydration mismatch. Session-dependent UI waits for isHydrated.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  // Empty initial value — deterministic, SSR-safe, no mock data flash
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // After mount: load persisted sessions from localStorage
  useEffect(() => {
    const stored = getStoredSessions();
    if (stored !== null) {
      // localStorage has data (including empty [] if user deleted everything)
      setSessions(stored);
    } else {
      // First-ever visit — seed with mock data and persist
      const seed = JSON.parse(JSON.stringify(mockSessions)) as StudySession[];
      saveStoredSessions(seed);
      setSessions(seed);
    }
    setIsHydrated(true);
  }, []);

  // ── Atomic state + persist helper ────────────────────────────────

  const persistUpdate = useCallback(
    (updater: (prev: StudySession[]) => StudySession[]) => {
      setSessions((prev) => {
        const next = updater(prev);
        saveStoredSessions(next);
        return next;
      });
    },
    [],
  );

  // ── CRUD operations ──────────────────────────────────────────────

  const addSession = useCallback(
    (data: Omit<StudySession, "id" | "createdAt">) => {
      const newSession: StudySession = {
        ...data,
        id: `s-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      persistUpdate((prev) => [newSession, ...prev]);
    },
    [persistUpdate],
  );

  const updateSession = useCallback(
    (id: string, data: Omit<StudySession, "id" | "createdAt">) => {
      persistUpdate((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      );
    },
    [persistUpdate],
  );

  const deleteSession = useCallback(
    (id: string) => {
      persistUpdate((prev) => prev.filter((s) => s.id !== id));
    },
    [persistUpdate],
  );

  return (
    <SessionContext.Provider
      value={{ sessions, isHydrated, addSession, updateSession, deleteSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useSessionStore() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionStore must be used within a SessionProvider");
  }
  return context;
}
