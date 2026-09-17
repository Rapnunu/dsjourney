"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardScrollReveal, EmptyState, SectionCard } from "@/components/dashboard";
import type { StudySession } from "@/features/sessions/types";

interface RecentActivityPanelProps {
  sessions: StudySession[];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RecentActivityPanel({ sessions }: RecentActivityPanelProps) {
  return (
    <DashboardScrollReveal>
      <SectionCard title="Recent Activity">
        {sessions.length === 0 ? (
          <EmptyState
            title="No study sessions yet."
            description="Your latest study activity will appear here."
          />
        ) : (
          <ul className="space-y-2" aria-label="Recent study sessions">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">
                    {formatDate(session.date)}
                  </p>
                  <p className="truncate text-sm font-medium text-text-primary">
                    {session.topicName}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs tabular-nums">
                  <p className="font-medium text-text-primary">
                    {session.hoursStudied}h
                  </p>
                  <p className="text-text-muted">
                    Difficulty {session.difficultyRating}/5
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/study-sessions"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          View Study Sessions
          <ArrowRight size={12} />
        </Link>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
