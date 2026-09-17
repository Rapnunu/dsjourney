"use client";

import { useState, useMemo, useRef } from "react";
import { BookOpen, Clock, Flame, TrendingUp } from "lucide-react";
import { DashboardScrollReveal, MetricCard } from "@/components/dashboard";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProviderErrorBanner } from "@/components/ui/provider-error-banner";
import { computeStreak } from "@/features/today/data";
import { showFriendlyError, showSuccessToast } from "@/lib/toast";
import { SessionForm } from "./session-form";
import { SessionTable } from "./session-table";
import { topicOptions } from "../data";
import { useSessionStore } from "../session-provider";
import type { StudySession } from "../types";

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
      <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5 space-y-4">
        <SkeletonPulse className="h-4 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonPulse className="h-9 w-full" />
          <SkeletonPulse className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}

export function SessionsView() {
  const {
    sessions,
    isHydrated,
    error,
    reload,
    addSession,
    updateSession,
    deleteSession,
  } = useSessionStore();
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const deleteTarget = sessions.find((session) => session.id === deleteSessionId);

  const handleSubmit = async (data: Omit<StudySession, "id" | "createdAt">) => {
    if (editingSession) {
      const saved = await updateSession(editingSession.id, data);
      if (saved) {
        showSuccessToast("Study session updated", "Your session changes were saved.");
        setEditingSession(null);
      } else {
        showFriendlyError(new Error("update failed"), "update", {
          title: "Couldn't save session",
          description:
            "Something went wrong while saving your study session. Please try again.",
        });
      }
      return saved;
    }

    const saved = await addSession(data);
    if (saved) {
      showSuccessToast("Study session logged", "Your study session was added to your history.");
    } else {
      showFriendlyError(new Error("create failed"), "save", {
        title: "Couldn't log session",
        description:
          "Something went wrong while logging your study session. Please try again.",
      });
    }
    return saved;
  };

  const handleEdit = (session: StudySession) => {
    setEditingSession(session);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requestDelete = (sessionId: string) => {
    setDeleteSessionId(sessionId);
  };

  const confirmDelete = async () => {
    if (!deleteSessionId) return;

    setIsDeleting(true);
    const deleted = await deleteSession(deleteSessionId);
    setIsDeleting(false);

    if (deleted) {
      showSuccessToast("Study session deleted", "The session was removed from your history.");
      if (editingSession?.id === deleteSessionId) {
        setEditingSession(null);
      }
      setDeleteSessionId(null);
      return;
    }

    showFriendlyError(new Error("delete failed"), "delete", {
      title: "Couldn't delete session",
      description:
        "Something went wrong while deleting this study session. Please try again.",
    });
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

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
    const currentStreak = computeStreak(sessions);
    return { totalSessions, totalHours, avgDifficulty, currentStreak };
  }, [sessions]);

  if (!isHydrated) {
    return <SessionsViewSkeleton />;
  }

  return (
    <div className="space-y-8">
      {error && (
        <ProviderErrorBanner
          title={error.title}
          description={error.description}
          onRetry={() => void reload()}
        />
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Total Sessions" countTo={stats.totalSessions} icon={BookOpen} staggerIndex={0} />
        <MetricCard label="Study Hours" countTo={stats.totalHours} decimals={1} suffix="hrs" icon={Clock} staggerIndex={1} />
        <MetricCard label="Average Difficulty" countTo={stats.avgDifficulty} decimals={1} suffix="/ 5" icon={TrendingUp} staggerIndex={2} />
        <MetricCard
          label="Current Streak"
          countTo={stats.currentStreak}
          suffix={stats.currentStreak === 1 ? "day" : "days"}
          icon={Flame}
          staggerIndex={3}
        />
      </div>

      <div ref={formRef}>
        <SessionForm
          topicOptions={topicOptions}
          onSubmit={handleSubmit}
          onCancel={editingSession ? handleCancelEdit : undefined}
          editingSession={editingSession}
        />
      </div>

      <DashboardScrollReveal>
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
          onDelete={requestDelete}
        />
        </div>
      </DashboardScrollReveal>

      <ConfirmDialog
        open={deleteSessionId !== null}
        title="Delete study session?"
        description={
          deleteTarget
            ? `This will permanently remove your ${deleteTarget.topicName} session from ${deleteTarget.date}. This action cannot be undone.`
            : "This study session will be permanently removed. This action cannot be undone."
        }
        confirmLabel="Delete Session"
        loadingLabel="Deleting..."
        loading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!isDeleting) setDeleteSessionId(null);
        }}
      />
    </div>
  );
}
