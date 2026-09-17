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
  getUserFriendlyApiError,
  type UserFriendlyError,
} from "@/lib/api/user-friendly-error";
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
  error: UserFriendlyError | null;
  reload: () => Promise<void>;
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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<UserFriendlyError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(async () => {
    setIsHydrated(false);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadSessions() {
      if (isActive) {
        setError(null);
      }

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
          setError(getUserFriendlyApiError(loadError, "load"));
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadSessions();
    return () => {
      isActive = false;
    };
  }, [reloadToken]);

  const addSession = useCallback(async (data: SessionInput) => {
    try {
      const created = await createSessionRequest(data);
      setSessions((previous) => sortSessions([created, ...previous]));
      setError(null);
      return true;
    } catch {
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
    } catch {
      return false;
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    try {
      await deleteSessionRequest(id);
      setSessions((previous) => previous.filter((session) => session.id !== id));
      setError(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        isHydrated,
        error,
        reload,
        addSession,
        updateSession,
        deleteSession,
      }}
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
