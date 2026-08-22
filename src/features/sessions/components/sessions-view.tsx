"use client";

import { useState, useMemo, useRef } from "react";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { SessionForm } from "./session-form";
import { SessionTable } from "./session-table";
import { topicOptions } from "../data";
import { useSessionStore } from "../session-provider";
import type { StudySession } from "../types";

// ── Skeleton placeholders ──────────────────────────────────────────

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-surface/60 ${className ?? ""}`}
    />
  );
}

function SessionsViewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Summary stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border-subtle bg-bg-surface/50 px-4 py-3 flex items-center gap-3"
          >
            <SkeletonPulse className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-10" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Form skeleton */}
      <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5 space-y-4">
        <SkeletonPulse className="h-4 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonPulse className="h-9 w-full" />
          <SkeletonPulse className="h-9 w-full" />
          <SkeletonPulse className="h-9 w-full" />
          <SkeletonPulse className="h-9 w-full" />
        </div>
        <SkeletonPulse className="h-16 w-full" />
        <SkeletonPulse className="h-9 w-28 rounded-lg" />
      </div>

      {/* Session table skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <SkeletonPulse className="h-5 w-28" />
          <SkeletonPulse className="h-5 w-6 rounded-full" />
        </div>
        <div className="rounded-xl border border-border-primary bg-bg-surface/50 overflow-hidden">
          {/* Table header skeleton */}
          <div className="border-b border-border-subtle px-4 py-3">
            <div className="flex gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-3 w-16" />
              ))}
            </div>
          </div>
          {/* Table rows skeleton */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-border-subtle px-4 py-3 flex gap-6 items-center"
            >
              <SkeletonPulse className="h-4 w-28" />
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-4 w-10" />
              <SkeletonPulse className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────

export function SessionsView() {
  const { sessions, isHydrated, addSession, updateSession, deleteSession } = useSessionStore();
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (data: Omit<StudySession, "id" | "createdAt">) => {
    if (editingSession) {
      updateSession(editingSession.id, data);
      setEditingSession(null);
    } else {
      addSession(data);
    }
  };

  const handleEdit = (session: StudySession) => {
    setEditingSession(session);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (sessionId: string) => {
    deleteSession(sessionId);
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

  if (!isHydrated) {
    return <SessionsViewSkeleton />;
  }

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

