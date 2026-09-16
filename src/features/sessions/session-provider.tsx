"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  completeStoredSessionsMigration,
  getStoredSessions,
  isStoredSessionsMigrationComplete,
} from "@/lib/storage";
import {
  bulkImportSessionsRequest,
  createSessionRequest,
  deleteSessionRequest,
  fetchSessions,
  updateSessionRequest,
} from "./api";
import type { StudySession } from "./types";

type SessionInput = Omit<StudySession, "id" | "createdAt">;

interface SessionContextType {
  sessions: StudySession[];
  isHydrated: boolean;
  error: string | null;
  addSession: (data: SessionInput) => Promise<boolean>;
  updateSession: (id: string, data: SessionInput) => Promise<boolean>;
  deleteSession: (id: string) => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

function sortSessions(sessions: StudySession[]): StudySession[] {
  return [...sessions].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return fallback;

  const candidate = error as Record<string, unknown>;
  const message =
    typeof candidate.message === "string" ? candidate.message : fallback;

  return message;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSessions() {
      try {
        let loaded = await fetchSessions();

        if (loaded.length > 0) {
          completeStoredSessionsMigration();
        } else if (!isStoredSessionsMigrationComplete()) {
          const stored = getStoredSessions();
          if (stored && stored.length > 0) {
            loaded = await bulkImportSessionsRequest(stored);
            completeStoredSessionsMigration();
          }
        }

        if (isActive) {
          setSessions(sortSessions(loaded));
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setSessions([]);
          setError(getErrorMessage(loadError, "Unable to load study sessions."));
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadSessions();
    return () => {
      isActive = false;
    };
  }, []);

  const addSession = useCallback(async (data: SessionInput) => {
    try {
      const created = await createSessionRequest(data);
      setSessions((previous) => sortSessions([created, ...previous]));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to add the study session."));
      return false;
    }
  }, []);

  const updateSession = useCallback(async (id: string, data: SessionInput) => {
    try {
      const updated = await updateSessionRequest(id, data);
      setSessions((previous) =>
        sortSessions(
          previous.map((session) => (session.id === id ? updated : session)),
        ),
      );
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to update the study session."));
      return false;
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    try {
      await deleteSessionRequest(id);
      setSessions((previous) => previous.filter((session) => session.id !== id));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to delete the study session."));
      return false;
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{ sessions, isHydrated, error, addSession, updateSession, deleteSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionStore() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionStore must be used within a SessionProvider");
  }
  return context;
}
