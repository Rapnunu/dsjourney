"use client";

import { useState, useEffect, useMemo } from "react";
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
import { mockSessions } from "../../sessions/data";
import { getStoredSessions } from "@/lib/storage";
import type { StudySession } from "../../sessions/types";

export function AnalyticsView() {
  // Always start with mockSessions so server and client HTML match
  const [sessions, setSessions] = useState<StudySession[]>(
    () => JSON.parse(JSON.stringify(mockSessions))
  );

  // After mount: load persisted sessions from localStorage
  useEffect(() => {
    const stored = getStoredSessions();
    if (stored !== null && stored.length > 0) {
      setSessions(stored);
    }
  }, []);

  // Memoize analytics calculations so they only rerun when sessions change
  const kpiStats = useMemo(() => getKpiStats(sessions), [sessions]);
  const categoryHours = useMemo(() => getCategoryHours(sessions), [sessions]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(sessions), [sessions]);
  const difficultTopics = useMemo(() => getDifficultTopics(sessions), [sessions]);
  const progressData = useMemo(() => getProgressComparison(sessions), [sessions]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Insights into your preparation progress"
        icon={<BarChart3 size={22} />}
      />

      <div className="space-y-6">
        {/* KPI cards */}
        <KpiCards stats={kpiStats} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <HoursByCategory categories={categoryHours} />
          </div>
          <div className="lg:col-span-2">
            <WeeklyActivity days={weeklyActivity} />
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DifficultTopics topics={difficultTopics} />
          <ProgressVsTime data={progressData} />
        </div>
      </div>
    </div>
  );
}

