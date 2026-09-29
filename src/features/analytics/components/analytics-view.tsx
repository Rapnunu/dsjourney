"use client";

import { useMemo } from "react";
import { DashboardScrollReveal } from "@/components/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart3 } from "lucide-react";
import { KpiCards } from "./kpi-cards";
import { HoursByCategory } from "./hours-by-category";
import { WeeklyActivity } from "./weekly-activity";
import { DifficultTopics } from "./difficult-topics";
import { ProgressVsTime } from "./progress-vs-time";
import {
  getKpiStats,
  getCategoryHours,
  getWeeklyActivity,
  getDifficultTopics,
  getProgressComparison,
} from "../data";
import { useSessionStore } from "@/features/sessions/session-provider";
import { useRoadmapStore } from "@/features/roadmap/roadmap-provider";

// ── Skeleton placeholders ──────────────────────────────────────────

function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-surface/60 ${className ?? ""}`}
      style={style}
    />
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-subtle bg-bg-surface/50 px-4 py-4 flex items-center gap-3"
          >
            <SkeletonPulse className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-6 w-12" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-[10px] border border-border-subtle bg-bg-surface p-5 space-y-4">
          <SkeletonPulse className="h-4 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <SkeletonPulse className="h-3 w-24" />
                <SkeletonPulse className="h-3 w-12" />
              </div>
              <SkeletonPulse className="h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 rounded-[10px] border border-border-subtle bg-bg-surface p-5 space-y-4">
          <SkeletonPulse className="h-4 w-28" />
          <div className="flex items-end gap-2 h-40">
            {[45, 65, 30, 55, 75, 40, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <SkeletonPulse
                  className="w-full rounded-t-md"
                  style={{ height: `${h}%` }}
                />
                <SkeletonPulse className="h-3 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-border-subtle bg-bg-surface p-5 space-y-3"
          >
            <SkeletonPulse className="h-4 w-32" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between py-2">
                <div className="space-y-1.5">
                  <SkeletonPulse className="h-4 w-36" />
                  <SkeletonPulse className="h-3 w-20" />
                </div>
                <SkeletonPulse className="h-4 w-10" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────

export function AnalyticsView() {
  const { sessions, isHydrated: sessionsHydrated } = useSessionStore();
  const { roadmap, isHydrated: roadmapHydrated } = useRoadmapStore();
  const isHydrated = sessionsHydrated && roadmapHydrated;

  const kpiStats = useMemo(() => getKpiStats(sessions), [sessions]);
  const categoryHours = useMemo(() => getCategoryHours(sessions), [sessions]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(sessions), [sessions]);
  const difficultTopics = useMemo(() => getDifficultTopics(sessions), [sessions]);
  const progressData = useMemo(
    () => getProgressComparison(sessions, roadmap),
    [sessions, roadmap],
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Understand how your study effort turns into progress."
        icon={<BarChart3 size={22} />}
      />

      {!isHydrated ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="space-y-6">
          {/* KPI cards */}
          <KpiCards stats={kpiStats} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <DashboardScrollReveal className="lg:col-span-3">
              <HoursByCategory categories={categoryHours} />
            </DashboardScrollReveal>
            <DashboardScrollReveal className="lg:col-span-2" delayMs={60}>
              <WeeklyActivity days={weeklyActivity} />
            </DashboardScrollReveal>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardScrollReveal>
              <DifficultTopics topics={difficultTopics} />
            </DashboardScrollReveal>
            <DashboardScrollReveal delayMs={60}>
              <ProgressVsTime data={progressData} />
            </DashboardScrollReveal>
          </div>
        </div>
      )}
    </div>
  );
}

