"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { dashboardCard, DashboardScrollReveal, EmptyState } from "@/components/dashboard";
import type { StudySession } from "@/features/sessions/types";
import { DIFFICULTY_LABELS } from "@/features/sessions/types";

interface RecentActivityProps {
  sessions: StudySession[];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RecentActivity({ sessions }: RecentActivityProps) {
  return (
    <DashboardScrollReveal>
      <div className={`${dashboardCard} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Recent Activity
          </h2>
          {sessions.length > 0 && (
            <Link
              href="/study-sessions"
              className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
            >
              View all
            </Link>
          )}
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            title="No recent sessions."
            description="Your latest study sessions will appear here."
          />
        ) : (
          <ul className="space-y-3" aria-label="Recent study sessions">
            {sessions.map((session) => {
              const difficulty = DIFFICULTY_LABELS[session.difficultyRating];

              return (
                <li
                  key={session.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {session.topicName}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {session.categoryName} · {formatDate(session.date)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="inline-flex items-center gap-1 text-xs tabular-nums text-text-secondary">
                      <Clock size={11} />
                      {session.hoursStudied}h
                    </p>
                    <p className={`mt-0.5 text-[10px] ${difficulty.color}`}>
                      {difficulty.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {sessions.length > 0 && (
          <Link
            href="/study-sessions"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
          >
            View session history
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </DashboardScrollReveal>
  );
}
