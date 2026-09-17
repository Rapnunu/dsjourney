"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  dashboardBtnPrimary,
  dashboardCard,
  DashboardScrollReveal,
} from "@/components/dashboard";
import { LineChart } from "@/components/dashboard/charts";
import { CHART_COLORS } from "@/components/dashboard/charts/chart-colors";
import {
  getStudyActivityTrend,
  type StudyActivityPoint,
  type StudyActivityRange,
} from "@/features/analytics/data";
import type { StudySession } from "@/features/sessions/types";

interface StudyActivitySectionProps {
  sessions: StudySession[];
}

export function StudyActivitySection({ sessions }: StudyActivitySectionProps) {
  const [range, setRange] = useState<StudyActivityRange>(7);
  const hasSessions = sessions.length > 0;

  const activityData = useMemo(
    () => getStudyActivityTrend(sessions, range),
    [sessions, range],
  );

  const weeklyConsistency = useMemo(
    () => getStudyActivityTrend(sessions, 7),
    [sessions],
  );

  const chartPoints = useMemo(
    () =>
      activityData.map((point) => ({
        label: point.day,
        date: point.date,
        hours: point.hours,
        sessionCount: point.sessionCount,
      })),
    [activityData],
  );

  const activeDays = weeklyConsistency.filter((day) => day.hours > 0).length;

  return (
    <DashboardScrollReveal>
      <div className={`${dashboardCard} p-5`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Study Activity
          </h2>
          <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-bg-elevated p-0.5">
            {([7, 30] as StudyActivityRange[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-ring ${
                  range === option
                    ? "bg-bg-surface text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
                aria-pressed={range === option}
              >
                {option}D
              </button>
            ))}
          </div>
        </div>

        <LineChart
          data={chartPoints}
          height={200}
          emptyMessage={!hasSessions ? "No study activity yet." : undefined}
          emptyDescription={
            !hasSessions
              ? "Log a study session to start seeing your learning trend."
              : undefined
          }
          emptyAction={
            !hasSessions ? (
              <Link href="/study-sessions" className={dashboardBtnPrimary}>
                <Plus size={15} />
                Log Study Session
              </Link>
            ) : undefined
          }
        />

        <div className="mt-6 border-t border-border-subtle pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Weekly Consistency
            </h3>
            <span className="text-xs text-text-muted">
              {activeDays}/7 active days
            </span>
          </div>
          <WeeklyConsistency days={weeklyConsistency} />
        </div>
      </div>
    </DashboardScrollReveal>
  );
}

function WeeklyConsistency({ days }: { days: StudyActivityPoint[] }) {
  const maxHours = Math.max(...days.map((day) => day.hours), 1);

  return (
    <div
      className="flex items-end justify-between gap-1.5"
      role="list"
      aria-label="Weekly study consistency"
    >
      {days.map((day) => {
        const hasActivity = day.hours > 0;
        const heightPct = hasActivity ? (day.hours / maxHours) * 100 : 0;

        return (
          <div
            key={day.date}
            className="flex flex-1 flex-col items-center gap-2"
            role="listitem"
            aria-label={`${day.day}: ${hasActivity ? `${day.hours} hours studied` : "no study activity"}`}
          >
            <div className="flex h-10 w-full items-end justify-center">
              <div
                className="w-full max-w-[28px] rounded-t-sm transition-all duration-500"
                style={{
                  height: hasActivity ? `${Math.max(heightPct, 12)}%` : "4px",
                  backgroundColor: hasActivity
                    ? CHART_COLORS.teal
                    : CHART_COLORS.track,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-text-muted">
              {day.day.charAt(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
