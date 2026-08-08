"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { SessionForm } from "./session-form";
import { SessionTable } from "./session-table";
import { mockSessions, topicOptions } from "../data";
import { getStoredSessions, saveStoredSessions } from "@/lib/storage";
import type { StudySession } from "../types";

export function SessionsView() {
  // Always start with mockSessions so server and client render identically
  const [sessions, setSessions] = useState<StudySession[]>(
    () => JSON.parse(JSON.stringify(mockSessions))
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // ── After mount: load saved sessions from localStorage ──
  useEffect(() => {
    const stored = getStoredSessions();
    if (stored !== null && stored.length > 0) {
      setSessions(stored);
    }
    // If nothing was stored, we keep the mockSessions already in state
    setIsInitialized(true);
  }, []);

  // ── After initialization: persist every sessions change to localStorage ──
  useEffect(() => {
    if (!isInitialized) return;
    saveStoredSessions(sessions);
  }, [sessions, isInitialized]);

  /**
   * Wrapper around setSessions for add / edit / delete.
   * Persistence is handled by the useEffect above.
   */
  const updateSessions = useCallback(
    (updater: (prev: StudySession[]) => StudySession[]) => {
      setSessions((prev) => updater(prev));
    },
    [],
  );

  const handleSubmit = (data: Omit<StudySession, "id" | "createdAt">) => {
    if (editingSession) {
      // Update existing
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === editingSession.id
            ? { ...s, ...data }
            : s
        )
      );
      setEditingSession(null);
    } else {
      // Create new
      const newSession: StudySession = {
        ...data,
        id: `s-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      updateSessions((prev) => [newSession, ...prev]);
    }
  };

  const handleEdit = (session: StudySession) => {
    setEditingSession(session);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (sessionId: string) => {
    updateSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (editingSession?.id === sessionId) {
      setEditingSession(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  // Summary stats
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalHours = parseFloat(
      sessions.reduce((sum, s) => sum + s.hoursStudied, 0).toFixed(1)
    );
    const avgDifficulty =
      totalSessions > 0
        ? parseFloat(
            (sessions.reduce((sum, s) => sum + s.difficultyRating, 0) / totalSessions).toFixed(1)
          )
        : 0;
    return { totalSessions, totalHours, avgDifficulty };
  }, [sessions]);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border-subtle bg-bg-surface/50 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-accent-muted text-accent">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-text-primary">{stats.totalSessions}</p>
            <p className="text-xs text-text-muted">Total Sessions</p>
          </div>
        </div>
        <div className="rounded-lg border border-border-subtle bg-bg-surface/50 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-text-primary">{stats.totalHours}</p>
            <p className="text-xs text-text-muted">Total Hours</p>
          </div>
        </div>
        <div className="rounded-lg border border-border-subtle bg-bg-surface/50 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-text-primary">{stats.avgDifficulty}</p>
            <p className="text-xs text-text-muted">Avg Difficulty</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div ref={formRef}>
        <SessionForm
          topicOptions={topicOptions}
          onSubmit={handleSubmit}
          onCancel={editingSession ? handleCancelEdit : undefined}
          editingSession={editingSession}
        />
      </div>

      {/* Session History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-text-primary">Session History</h2>
          <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded-full tabular-nums">
            {sessions.length}
          </span>
        </div>
        <SessionTable
          sessions={sessions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
