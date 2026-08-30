"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  completeStoredSessionsMigration,
  getStoredSessions,
  isStoredSessionsMigrationComplete,
} from "@/lib/storage";
import type { StudySession } from "./types";

type SessionInput = Omit<StudySession, "id" | "createdAt">;

interface StudySessionRow {
  id: string;
  user_id: string;
  topic_id: string;
  topic_name: string;
  category_name: string;
  study_date: string;
  hours_studied: number | string;
  difficulty_rating: number;
  notes: string;
  created_at: string;
}

interface SessionContextType {
  sessions: StudySession[];
  isHydrated: boolean;
  error: string | null;
  addSession: (data: SessionInput) => Promise<boolean>;
  updateSession: (id: string, data: SessionInput) => Promise<boolean>;
  deleteSession: (id: string) => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

function fromRow(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    topicId: row.topic_id,
    topicName: row.topic_name,
    categoryName: row.category_name,
    date: row.study_date,
    hoursStudied: Number(row.hours_studied),
    difficultyRating: row.difficulty_rating as StudySession["difficultyRating"],
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function toRow(session: StudySession, userId: string): StudySessionRow {
  return {
    id: session.id,
    user_id: userId,
    topic_id: session.topicId,
    topic_name: session.topicName,
    category_name: session.categoryName,
    study_date: session.date,
    hours_studied: session.hoursStudied,
    difficulty_rating: session.difficultyRating,
    notes: session.notes,
    created_at: session.createdAt,
  };
}

function sortSessions(sessions: StudySession[]): StudySession[] {
  return [...sessions].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSessions() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) throw new Error("You must be signed in to load study sessions.");

        const { data, error: fetchError } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("study_date", { ascending: false })
          .order("created_at", { ascending: false });
        if (fetchError) throw fetchError;

        let rows = (data ?? []) as StudySessionRow[];
        if (rows.length > 0) {
          completeStoredSessionsMigration();
        } else if (!isStoredSessionsMigrationComplete()) {
          const stored = getStoredSessions();
          if (stored && stored.length > 0) {
            const { data: imported, error: importError } = await supabase
              .from("study_sessions")
              .insert(stored.map((session) => toRow(session, userData.user.id)))
              .select();
            if (importError) throw importError;
            rows = (imported ?? []) as StudySessionRow[];
            completeStoredSessionsMigration();
          }
        }

        if (isActive) {
          setSessions(sortSessions(rows.map(fromRow)));
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
  }, [supabase]);

  const getCurrentUserId = useCallback(async () => {
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!data.user) throw new Error("You must be signed in to manage study sessions.");
    return data.user.id;
  }, [supabase]);

  const addSession = useCallback(async (data: SessionInput) => {
    try {
      const userId = await getCurrentUserId();
      const newSession: StudySession = {
        ...data,
        id: `s-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const { data: inserted, error: insertError } = await supabase
        .from("study_sessions")
        .insert(toRow(newSession, userId))
        .select()
        .single();
      if (insertError) throw insertError;

      setSessions((previous) => sortSessions([fromRow(inserted as StudySessionRow), ...previous]));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to add the study session."));
      return false;
    }
  }, [getCurrentUserId, supabase]);

  const updateSession = useCallback(async (id: string, data: SessionInput) => {
    try {
      const userId = await getCurrentUserId();
      const { data: updated, error: updateError } = await supabase
        .from("study_sessions")
        .update({
          topic_id: data.topicId,
          topic_name: data.topicName,
          category_name: data.categoryName,
          study_date: data.date,
          hours_studied: data.hoursStudied,
          difficulty_rating: data.difficultyRating,
          notes: data.notes,
        })
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (updateError) throw updateError;

      const mapped = fromRow(updated as StudySessionRow);
      setSessions((previous) => sortSessions(previous.map((session) => session.id === id ? mapped : session)));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to update the study session."));
      return false;
    }
  }, [getCurrentUserId, supabase]);

  const deleteSession = useCallback(async (id: string) => {
    try {
      const userId = await getCurrentUserId();
      const { error: deleteError } = await supabase
        .from("study_sessions")
        .delete()
        .eq("user_id", userId)
        .eq("id", id)
        .select("id")
        .single();
      if (deleteError) throw deleteError;

      setSessions((previous) => previous.filter((session) => session.id !== id));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to delete the study session."));
      return false;
    }
  }, [getCurrentUserId, supabase]);

  return (
    <SessionContext.Provider value={{ sessions, isHydrated, error, addSession, updateSession, deleteSession }}>
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
